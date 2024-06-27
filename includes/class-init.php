<?php
/**
 * Blocks Initializer
 *
 * @since   1.0.0
 */

 if ( ! class_exists( 'DPAA_Initializer' ) ) {

	class DPAA_Initializer {
		const CREDENTIAL_ACTION = DPAA_PLUGIN_ID . '_nonce_action';
		const CREDENTIAL_NAME = DPAA_PLUGIN_ID . '_nonce_key';
		const TRANSIENT_MSG_KEY = DPAA_PLUGIN_ID . '_msg';

		/**
		 * Constructor
		 */
		function __construct() {
			self::requires();
			add_action( 'init', array( __CLASS__, 'load_textdomain' ) );
			add_filter( 'plugin_action_links_' . DPAA_PLUGIN_BASENAME, array( __CLASS__, 'add_action_links' ) );
			add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
			add_action( 'enqueue_block_editor_assets' , array( __CLASS__, 'backend_block_editor_assets' ) );
			add_action( 'admin_enqueue_scripts', array( __CLASS__, 'admin_enqueue_scripts' ) );
			register_deactivation_hook( DPAA_FILE, array( __CLASS__, 'plugin_deactivation' ) );
			register_uninstall_hook( DPAA_FILE, array( __CLASS__, 'plugin_uninstall' ) );
		}

		/**
		 * Requires
		 *
		 * @access private
		 * @return void
		 */
		private function requires() {
			require_once( DPAA_PATH . 'includes/class-register-settings.php' );
			require_once( DPAA_PATH . 'includes/class-create-post.php' );
			require_once( DPAA_PATH . 'includes/class-admin-menu.php' );
			require_once( DPAA_PATH . 'includes/class-register-route.php' );
		}

		/**
		 * Show Admin message
		 */
		public static function show_admin_notice_message() {
			if ( $message = get_transient( self::TRANSIENT_MSG_KEY ) ) {
				echo '<div class="updated notice"><p>' . esc_html( $message ) . '</p></div>';
			}
		}

		/**
		 * Register the translation data and other assets for backend
		 *
		 * @since 0.1.0
		 */
		public static function backend_block_editor_assets() {
			if ( ! is_admin() ) return;

			/**
			 * Enqueue block CSS and JavaScript
			 */
			$asset_file = DPAA_PATH . 'dist/backend.asset.php';
			if ( file_exists( $asset_file ) ) {
				$assets = require_once( $asset_file );
			}

			// Register block editor styles for backend.
			wp_enqueue_style(
				'dpaa-backend', // Handle.
				DPAA_URL . 'dist/backend.css', // Block editor CSS.
				array( 'wp-edit-blocks' ),
				$assets[ 'version' ]
			);

			// Enqueue main JavaScript for backend.
			wp_enqueue_script(
				'dpaa-backend',
				DPAA_URL . 'dist/backend.js',
				$assets[ 'dependencies' ],
				$assets[ 'version' ],
				true
			);
		}

		/**
		 * Variables between php and js.
		 *
		 * Usage: import { i18n } from 'dpaa'
		 * @since 0.1.0
		 */
		public static function admin_enqueue_scripts() {
			if ( ! is_admin() ) return;

			wp_enqueue_media();

			global $wp_version;
			$args = apply_filters( 'dpaa_localize_script', array(
				'wpVersion'		=> $wp_version,
				'version'		=> DPAA_PLUGIN_VERSION,
				'srcUrl' 		=> untrailingslashit( plugins_url( '/', DPAA_FILE ) ),
				'siteUrl'		=> site_url(),
				'pluginPath'	=> DPAA_PATH,
				'pluginUrl'		=> DPAA_URL,
				'i18n' 			=> DPAA_I18N,
				'productId' 	=> DPAA_PLUGIN_ID,
				'optionName'	=> DPAA_OPTION_NAME,
				'lKeyPhrase'	=> DPAA_PLUGIN_LICENSE_KEY_PHRASE,
				'storeUrl'		=> DPAA_PLUGIN_STORE_URL,
				'apiNonce'		=> wp_create_nonce( 'wp_rest' ),
				'defaultCategoryId'	=> (int)get_option( 'default_category' ),
			) );

			wp_set_script_translations(
				'dpaa-backend',	// Target translation js handle name
				DPAA_I18N,	// Localize text domain
				DPAA_PATH . 'languages'	// translation file path
			);
			wp_localize_script(
				'dpaa-backend',	// Target translation js handle name
				DPAA_I18N,		// prefix in js translation phrase
				$args			// Sending value
			);
		}

		/**
		 * Add inline style to both frontend and backend
		 *
		 * @since 1.0.0.0
		 */
		public static function enqueue_assets() {
			/**
			 * Frontend only.
			 */
			if ( ! is_admin() ) {
				$assets = array();
				$asset_file = DPAA_PATH . 'dist/frontend.asset.php';
				if ( file_exists( $asset_file ) ) {
					$assets = require_once( $asset_file );
				}


				if ( !empty( $assets ) && is_array( $assets ) ) {
					// Register styles for frontend.
					wp_enqueue_style(
						'dpaa-frontend', // Handle.
						DPAA_URL . 'dist/style-frontend.css',
						array(),
						$assets[ 'version' ]
					);

					// Main Script
					wp_enqueue_script(
						'dpaa-frontend',
						DPAA_URL . 'dist/frontend.js',
						$assets[ 'dependencies' ],
						$assets[ 'version' ],
						true // Enqueue the script in the footer.
					);
				}

				// The built-in JavaScript client creates the nonce
				wp_localize_script(
					'wp-api',
					'wpApiSettings',
					array(
						'root' => esc_url_raw( rest_url() ),
						'nonce' => wp_create_nonce( 'wp_rest' )
					)
				);
			}
		}

		/**
		 * Add action link in wordpress plugin page.
		 */
		public static function add_action_links ( $actions ) {
			$links = array(
				'<a href="' . admin_url( 'admin.php?page=' . DPAA_PLUGIN_ID . '_admin_menu' ) . '">' . __( 'Settings' ) . '</a>',
				'<a href="' . DPAA_PLUGIN_STORE_URL . '?utm_source=wp-dashboard&utm_campaign=' . DPAA_PLUGIN_ID . '-upgrade&utm_medium=' . DPAA_PLUGIN_ID . '-free" target="_blank" style="color:#09b034;font-weight:bold;">' . __( 'Upgrade', 'dpa-ai-assistant' ) . '</a>'
			);
			$actions = array_merge( $actions, $links );
			return $actions;
		}

		/**
		 * Load plugin text domain.
		 */
		public static function load_textdomain() {
			load_plugin_textdomain( DPAA_I18N, false, DPAA_PLUGIN_DIR_NAME . '/languages' );
		}

		/**
		 * Do something when this plugin is about to be deactivated .
		 */
		public static function plugin_deactivation() {
			// Do something
		}
	
		/**
		 * Do something when this plugin is about to be uninstalled.
		 */
		public static function plugin_uninstall() {
			// Uninstall data and clear settings
			delete_option( DPAA_OPTION_NAME );
		}
	}

	new DPAA_Initializer;
}