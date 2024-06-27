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

if ( ! class_exists( 'DPAA_Create_Post' ) ) {
	class DPAA_Create_Post {
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_plugin_rest_route' ) );
		}

		/**
		 * カスタムエンドポイントを登録
		 */
		public function register_plugin_rest_route() {
			// 投稿用
			register_rest_route(
				DPAA_PLUGIN_ID . '/v1',
				'/create_post',
				array(
					'methods' => WP_REST_Server::CREATABLE, // POST,
					'callback' => array( $this, 'callback_create_post' ),
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
					'args' => array(
						'type' 			=> array(
							'required' 	=> false,
							'type' 		=> 'string',
						),
						'title' 	=> array(
							'required' 	=> false,
							'type' 		=> 'string',
						),
						'content' 		=> array(
							'required' 	=> false,
							'type' 		=> 'string',
						),
						'excerpt' 		=> array(
							'required' 	=> false,
							'type' 		=> 'string',
						),
						'status' 		=> array(
							'required' 	=> false,
							'type' 		=> 'string',
						),
						'date' 			=> array(
							'required' 	=> false,
							'type' 		=> 'string',
						),
						'author' 		=> array(
							'required' 	=> false,
							'type' 		=> 'number',
						),
						'categories' 	=> array(
							'required' 	=> false,
							'type' 		=> 'array',
						),
						'tags' 			=> array(
							'required' 	=> false,
							'type' 		=> 'array',
						)
					)
				)
			);
		}

		// 投稿用コールバック
		public static function callback_create_post( WP_REST_Request $request ) {
			$wpnonce = $request->get_header( 'X-WP-Nonce' );
			if ( ! wp_verify_nonce( $wpnonce, 'wp_rest' ) ) {
				return new WP_Error( 'invalid_nonce', 'Invalid nonce', array( 'status' => 403 ) );
			}
			if ( !is_user_logged_in() ) {
				return new WP_Error('rest_forbidden', 'User is not logged in.', array( 'status' => 403 ) );
			}

			$data = $request->get_json_params();

			$post_type 		= isset( $data[ 'type' ] ) ? sanitize_text_field( $data[ 'type' ] ) : 'post';
			$post_title 	= isset( $data[ 'title' ] ) ? sanitize_text_field( wp_strip_all_tags( $data[ 'title' ] ) ) : '';
			$post_content 	= isset( $data[ 'content' ] ) ? wp_kses_post( $data[ 'content' ] ) : '';
			$post_excerpt 	= isset( $data[ 'excerpt' ] ) ? sanitize_text_field( $data[ 'excerpt' ] ) : '';
			$post_status 	= isset( $data[ 'status' ] ) ? sanitize_text_field( $data[ 'status' ] ) : 'draft';
			$post_date 		= isset( $data[ 'date' ] ) ? sanitize_text_field( $data[ 'date' ] ) : gmdate( 'Y-m-d H:i:s' );
			$post_author 	= isset( $data[ 'author' ] ) ? sanitize_user( $data[ 'author' ] ) : get_current_user_id();
			$post_category 	= isset( $data[ 'categories' ] ) && is_array( $data[ 'categories' ] ) ? $data[ 'categories' ] : array( (int)get_option( 'default_category' ) );
			$tags_input 	= isset( $data[ 'tags' ] ) && is_array( $data[ 'tags' ] ) ? $data[ 'tags' ] : array();
			
			$new_post = array(
				'post_type'		=> $post_type,
				'post_title' 	=> $post_title,
				'post_content' 	=> $post_content,
				'post_excerpt' 	=> $post_excerpt,
				'post_status' 	=> $post_status,
				'post_date'		=> $post_date,
				'post_author'	=> $post_author,
				'post_category' => $post_category,
				'tags_input' 	=> $tags_input
			);
			
			$post_id = wp_insert_post( $new_post );
			
			if ( $post_id ) {
				return new WP_REST_Response( array(
					'message' => 'Post created successfully',
					'postID' => $post_id,
					'data'	=> array( 'status' => 200 )
				), 200 );
			} else {
				return new WP_Error(
					'error_creating_post',
					'Failed to create post',
					array(
						'status' => 500
					)
				);
			}
		}
	}

	new DPAA_Create_Post;
}