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

if ( ! class_exists( 'DPAA_Register_Settings' ) ) {
	class DPAA_Register_Settings {
		public function __construct() {
			add_action( 'admin_init', array( $this, 'register_plugin_settings' ) );
			add_action( 'rest_api_init', array( $this, 'register_plugin_rest_route' ) );
		}

		/**
		 * All plugin settings.
		 * 
		 * @since 0.1.0
		 */
		public static function get_plugin_settings() {
			// Our options.
			return array(
				'generalSettings'	=> array(
					'type'		=> 'object',
					'default'	=> array(),
					'items'		=> array(
						'initialTab'	=> array(
							'type'		=> 'string',
							'default'	=> 'chat'
						),
						'adminPanelMaxWidth'	=> array(
							'type'		=> 'number',
							'default'	=> 1024
						),
						'uploadFilePrefix'	=> array(
							'type'		=> 'string',
							'default'	=> 'dpaa-'
						)
					)
				),
				'openAISettings'	=> array(
					'type'		=> 'object',
					'default'	=> array(),
					'items'		=> array(
						'apiKey'	=> array(
							'type'		=> 'string',
							'default'	=> ''
						),
						'gptModel'	=> array(
							'type'		=> 'string',
							'default'	=> 'gpt-4o'
						),
						'temperature'	=> array(
							'type'		=> 'number',
							'default'	=> 0.8,
						),
						'topP'	=> array(
							'type'		=> 'number',
							'default'	=> 0.8,
						),
						'maxTokens'	=> array(
							'type'		=> 'number',
							'default'	=> 2000
						),
						'assistants'	=> array(
							'type'		=> 'object',
							'default'	=> array(),
							'items'		=> array(),
						),
						'fineTunedModels'	=> array(
							'type'		=> 'object',
							'default'	=> array(),
							'items'		=> array(),
						),
						'speech'	=> array(
							'type'		=> 'object',
							'default'	=> array(),
							'items'		=> array(
								'model'	=> array(
									'type'		=> 'string',
									'default'	=> 'tts-1'	// tts-1 or tts-1-hd
								),
								// @see https://platform.openai.com/docs/guides/text-to-speech/voice-options
								'voice'	=> array(
									'type'		=> 'string',
									'default'	=> 'alloy'	// lloy, echo, fable, onyx, nova, and shimmer
								),
								'format' => array(
									'type'		=> 'string',
									'default'	=> 'mp3'	// mp3, opus, aac, flac, wav, and pcm
								),
								'speed' => array(
									'type'		=> 'number',
									'default'	=> 1	// 0.25 to 4.0
								),
								'maxLogs' => array(
									'type'		=> 'number',
									'default'	=> 4
								)
							)
						),
						'transcription'	=> array(
							'type'		=> 'object',
							'default'	=> array(),
							'items'		=> array(
								'model'	=> array(
									'type'		=> 'string',
									'default'	=> 'whisper-1'
								),
								'language'	=> array(
									'type'		=> 'string',
									'default'	=> 'ja'
								),
								'temperature'	=> array(
									'type'		=> 'number',
									'default'	=> 0
								),
								'prompt'	=> array(
									'type'		=> 'string',
									'default'	=> ''
								),
								'format'	=> array(
									'type'		=> 'string',
									'default'	=> 'json'
								),
								'maxLogs' => array(
									'type'		=> 'number',
									'default'	=> 10
								)
							)
						),
						'imageGeneration'	=> array(
							'type'		=> 'object',
							'default'	=> array(),
							'items'		=> array(
								'dallEModel'	=> array(
									'type'		=> 'string',
									'default'	=> 'dall-e-2'	// dall-e-2, dall-e-3
								),
								'numberImages'	=> array(
									'type'		=> 'number',
									'default'	=> 1	// 1 to 10
								),
								'imageSize'	=> array(
									'type'		=> 'string',
									'default'	=> '1024x1024'	// 256x256, 512x512, 1024x1024, 1792x1024, 1024x1792
								),
								'quality'	=> array(
									'type'		=> 'string',
									'default'	=> 'standard'	// standard, hd
								),
								'dallEStyle'	=> array(
									'type'		=> 'string',
									'default'	=> 'vivid'	// vivid, natural
								)
							),
						),
					)
				),
				'textGenerationSettings' => array(
					'type'		=> 'object',
					'default'	=> array(),
					'items'		=> array(
						'language'	=> array(
							'type'		=> 'string',
							'default'	=> 'ja_JP'
						),
						'customPrompt'=> array(
							'type'		=> 'string',
							'default'	=> ''
						),
						'writingStyle'	=> array(
							'type'		=> 'string',
							'default'	=> 'normal'
						),
						'writingTone'	=> array(
							'type'		=> 'string',
							'default'	=> 'informative'
						),
						'contentStructure'	=> array(
							'type'		=> 'string',
							'default'	=> 'topic-wise',
						),
						'maxChatLogs'	=> array(
							'type'		=> 'number',
							'default'	=> 4
						),
						'maxVisibleChatLogs' => array(
							'type'		=> 'number',
							'default'	=> 30
						)
					)
				),
				'stabilityAISettings'	=> array(
					'type'		=> 'object',
					'default'	=> array(),
					'items'		=> array(
						'apiKey'	=> array(
							'type'		=> 'string',
							'default'	=> ''
						),
						'model'	=> array(
							'type'		=> 'string',
							'default'	=> 'stable-diffusion-xl-1024-v1-0'
						),
						'style'	=> array(
							'type'		=> 'string',
							'default'	=> 'none'
						),
						// For 'stable-diffusion-xl-1024-v1-0'
						'dimensions'	=> array(
							'type'		=> 'string',
							'default'	=> '1024x1024'
						),
						'width'	=> array(
							'type'		=> 'number',
							'default'	=> 512
						),
						'height'	=> array(
							'type'		=> 'number',
							'default'	=> 512
						),
						
						'samples'	=> array(
							'type'		=> 'number',
							'default'	=> 1
						),
						'cfgScale'	=> array(
							'type'		=> 'number',
							'default'	=> 7.0
						),
						'steps'	=> array(
							'type'		=> 'number',
							'default'	=> 30
						)
					)
				),
				'imageGenerationSettings' => array(
					'type'		=> 'object',
					'default'	=> array(),
					'items'		=> array(
						'engine'	=> array(
							'type'		=> 'string',
							'default'	=> 'stable-diffusion'	// dall-e
						),
						'maxVisibleImageLogs' => array(
							'type'		=> 'number',
							'default'	=> 4
						)
					)
				),
				'writerSettings'	=> array(
					'type'		=> 'object',
					'default'	=> array(),
					'items'		=> array(
						// For Eyecatch
						'isGenerateFeaturedImage'	=> array(
							'type'		=> 'boolean',
							'default'	=> false
						),
						'isGenerateImagePerSection'	=> array(
							'type'		=> 'boolean',
							'default'	=> false
						),
					)
				)
			);
		}

		/**
		 * Extract defaults from plugin settings.
		 *
		 * @param array $schema option schema.
		 *
		 * @return options
		 */
		public static function extract_defaults( $schema ) {
			$default = array();
			foreach ( $schema as $key => $value ) {
				$default[ $key ] = ( 'object' === $value['type'] && isset( $value['items'] ) ) ? self::extract_defaults( $value['items'] ) : $value['default'];
			}
			return $default;
		}

		/**
		 * Extract properties from plugin settings.
		 *
		 * @param array $schema option schema.
		 *
		 * @return options
		 */
		public static function extract_properties( $schema ) {
			$properties = array();

			if ( isset( $schema ) && !empty( $schema ) && is_array( $schema ) ) {
				foreach ( $schema as $key => $value ) {
					$properties[ $key ] = array(
						'type' => $value['type'],
					);

					if ( 'object' === $value['type'] ) {
						$properties[ $key ]['properties'] = isset( $value['items'] ) ? self::extract_properties( $value['items'] ) : '';
					}	

				}
			}

			return $properties;
		}

		/**
		 * Resigtration format is below.
		 * 
		 * @since 0.1.0
		 */
		public function register_plugin_settings() {
			$option_schema = $this->get_plugin_settings();
			register_setting(
				DPAA_PLUGIN_ID,
				DPAA_OPTION_NAME,
				array(
					'type'					=> 'object',
					'default'				=> $this->extract_defaults( $option_schema ),
					'show_in_rest'			=> array(
						'name'				=> DPAA_OPTION_NAME,
						'schema' 			=> array(
							'type'			=> 'object',
							'properties'	=> $this->extract_properties( $option_schema ),
						)
					)
				)
			);
		}

		/**
		 * Register our custom endpoint
		 */
		public function register_plugin_rest_route() {
			// プラグイン設定を取得するためのエンドポイント
			register_rest_route(
				DPAA_PLUGIN_ID . '/v1',	// ベース
				'/get_option',			// 種別
				array(
					'methods' => WP_REST_Server::READABLE, // GET
					'callback' => array( $this, 'callback_get_plugin_option' ),
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
					'args' => array(
						'name' => array(
							'required' => true,
							'type' => 'string',
						)
					)
				)
			);

			// 設定を更新するためのエンドポイント
			register_rest_route(
				DPAA_PLUGIN_ID . '/v1',
				'/update_option',
				array(
					'methods' => WP_REST_Server::CREATABLE, // POST,
					'callback' => array( $this, 'callback_update_plugin_option' ),
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
					'args' => array(
						'name' => array(
							'required' => true,
							'type' => 'string',
						),
						'value' => array(
							'required' => true,
							'type' => 'mixed',
						)
					)
				)
			);
		}

		// オプションを取得するためのコールバック
		public static function callback_get_plugin_option( WP_REST_Request $request ) {
			$wpnonce = $request->get_header( 'X-WP-Nonce' );
			if ( ! wp_verify_nonce( $wpnonce, 'wp_rest' ) ) {
				return new WP_Error( 'invalid_nonce', 'Invalid nonce', array( 'status' => 403 ) );
			}
			if ( !is_user_logged_in() ) {
				return new WP_Error('rest_forbidden', 'User is not logged in.', array( 'status' => 403 ) );
			}

			$option_name = $request->get_param( 'name' );
			$option_value = get_option( $option_name, null );
			 if ( null === $option_value ) {
				return new WP_Error( 'no_option', 'Option not found', array( 'status' => 404 ) );
			}
			return new WP_REST_Response( $option_value, 200 );
		}

		// オプションを更新するためのコールバック
		public static function callback_update_plugin_option( WP_REST_Request $request ) {
			$wpnonce = $request->get_header( 'X-WP-Nonce' );
			if ( ! wp_verify_nonce( $wpnonce, 'wp_rest' ) ) {
				return new WP_Error( 'invalid_nonce', 'Invalid nonce', array( 'status' => 403 ) );
			}
			if ( !is_user_logged_in() ) {
				return new WP_Error('rest_forbidden', 'User is not logged in.', array( 'status' => 403 ) );
			}

			$option_name = $request->get_param( 'name' );
			$option_value = $request->get_param( 'value' );
			$result = update_option( $option_name,  $option_value );
			$code = $result ? 200 : 500;
			$response = array(
				'success'	=> $result,
				'name'		=> $option_name,
				'value'		=> $option_value,
			);
			return rest_ensure_response( $response, $code );
		}

		// 新しいオプションが追加された場合は現在の設定にマージ
		public static function merge_new_options( $current_settings, $default_options ) {
			// 既存のオプションが空の場合はデフォルトで返す
			if ( !$current_settings ) {
				return $default_options;
			}

			// 追加されたオプションをデフォルト値でマージ
			foreach ( $default_options as $key => $value ) {
				if ( ! array_key_exists( $key, $current_settings ) ) {
					$current_settings[ $key ] = $value;
				} elseif ( is_array( $value ) ) {
					$current_settings[ $key ] = self::merge_new_options( $current_settings[ $key ], $value );
				}
			}

			return $current_settings;
		}
	}

	new DPAA_Register_Settings;

	// Current settings
	$dpaa_current_settings = get_option( DPAA_OPTION_NAME );

	// default settiings
	$default_options = DPAA_Register_Settings::get_plugin_settings();
	$default_options = DPAA_Register_Settings::extract_defaults( $default_options );
	
	// Marge new options to current options.
	$dpaa_current_settings = DPAA_Register_Settings::merge_new_options( $dpaa_current_settings, $default_options );
	// Update re-create options
	update_option( DPAA_OPTION_NAME, $dpaa_current_settings );
}