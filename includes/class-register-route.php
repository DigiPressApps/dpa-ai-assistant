<?php
/**
 * Register our settings.
 *
 * @since   0.1.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'DPAA_Register_Route' ) ) {
	class DPAA_Register_Route {
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_plugin_rest_route' ) );
		}

		/**
		 * カスタムエンドポイントを登録
		 */
		public function register_plugin_rest_route() {
			// オーディオデータダウンロード用
			register_rest_route(
				DPAA_PLUGIN_ID . '/v1',
				'/get_audio_data',
				array(
					'methods' => WP_REST_Server::CREATABLE, // POST,
					'callback' => array( $this, 'callback_get_audio_data' ),
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
					'args' => array(
						'audioUrl' => array(
							'required' => true,
							'type' => 'string',
						)
					)
				)
			);

			// システム情報取得用
			register_rest_route(
				DPAA_PLUGIN_ID . '/v1',
				'/get_sysinfo',
				array(
					'methods' => WP_REST_Server::READABLE, // GET,
					'callback' => array( $this, 'callback_get_sysinfo' ),
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					}
				)
			);
		}
	
		// オーディオデータをBase64エンコード
		public static function callback_get_audio_data( WP_REST_Request $request ) {
			$wpnonce = $request->get_header( 'X-WP-Nonce' );
			if ( ! wp_verify_nonce( $wpnonce, 'wp_rest' ) ) {
				return new WP_Error( 'invalid_nonce', 'Invalid nonce', array( 'status' => 403 ) );
			}
			if ( !is_user_logged_in() ) {
				return new WP_Error('rest_forbidden', 'User is not logged in.', array( 'status' => 403 ) );
			}

			$response = array(
				'ok' 			=> false,
				'base64Data' 	=> null,
				'error'			=> ''
			);
			$http_status_code = 500;

			$audio_url = $request->get_param( 'audioUrl' );
			$audio = wp_remote_get( $audio_url );

			if ( !is_wp_error( $audio ) && $audio[ 'response' ][ 'code' ] === 200 ) {
				$audio_data = base64_encode( $audio[ 'body' ] );
				if ( isset( $audio_data ) && !empty( $audio_data ) ) {
					$response = array(
						'ok'			=> true,
						'base64Data' 	=> $audio_data,
						'error'			=> '',
						'nonce'			=> $wpnonce,
						'verify'		=> wp_verify_nonce( $wpnonce, 'wp_rest' )
					);
					$http_status_code = $audio[ 'response' ][ 'code' ];
				} else {
					$response = array(
						'ok'			=> false,
						'base64Data' 	=> null,
						'error' 		=> "Failed to encode audio data.\nURL: " . $audio_url
					);
				}
			} else {
				$response = array(
					'ok'			=> false,
					'base64Data' 	=> null,
					'error' 		=> "Error: " . $audio[ 'response' ][ 'message' ] . "(" . $audio[ 'response' ][ 'code' ] . ")"
				);
			}

			return rest_ensure_response( $response, $http_status_code );
		}

		// システム情報取得
		public static function callback_get_sysinfo( WP_REST_Request $request ) {
			$wpnonce = $request->get_header( 'X-WP-Nonce' );
			if ( ! wp_verify_nonce( $wpnonce, 'wp_rest' ) ) {
				return new WP_Error( 'invalid_nonce', 'Invalid nonce', array( 'status' => 403 ) );
			}
			if ( !is_user_logged_in() ) {
				return new WP_Error('rest_forbidden', 'User is not logged in.', array( 'status' => 403 ) );
			}

			$status = false;
			$http_status_code = 500;

			require_once( ABSPATH . 'wp-admin/includes/update.php');

			// System information for technical support.
			require_once( DPAA_PATH . 'includes/function-get-sysinfo.php' );

			$sysinfo = dpapps_get_sysinfo();

			if ( $sysinfo ) {
				$status = true;
				$http_status_code = 200;
			}

			return rest_ensure_response( array(
				'success'		=> $status,
				'sysinfo'		=> $sysinfo
			), $http_status_code );
		}
	}

	new DPAA_Register_Route;
}