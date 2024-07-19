<?php
/**
 * Plugin Name: 		DPA AI Assistant
 * Plugin URI: 			https://dpapps.net/plugins/ai-assistant/
 * Description: 		Powerful contents generation helper using AI services.
 * Author: 				digistate co., ltd.
 * Author URI: 			https://dpapps.net/
 * Requires at least: 	6.2
 * Requires PHP: 		8.0
 * Version: 			0.1.6
 * License: 			GPL2+
 * License URI: 		https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: 		dpa-ai-assistant
 * Domain Path: 		/languages/
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

defined( 'DPAA_PLUGIN_NAME' ) || define( 'DPAA_PLUGIN_NAME', 'AI Assistant' );
defined( 'DPAA_PLUGIN_VERSION' ) || define( 'DPAA_PLUGIN_VERSION', '0.1.6' );
defined( 'DPAA_REQUIRES_PHP' ) || define( 'DPAA_REQUIRES_PHP', '8.0' );
defined( 'DPAA_REQUIRES_WP' ) || define( 'DPAA_REQUIRES_WP', '6.2' );
defined( 'DPAA_PLUGIN_ID' ) || define( 'DPAA_PLUGIN_ID', 'dpaa' );
defined( 'DPAA_OPTION_NAME' ) || define( 'DPAA_OPTION_NAME', 'dpaa_settings' );
defined( 'DPAA_PLUGIN_AUTHOR' ) || define( 'DPAA_PLUGIN_AUTHOR', 'digistate' );
defined( 'DPAA_PLUGIN_AUTHOR_URL' ) || define( 'DPAA_PLUGIN_AUTHOR_URL', 'https://dpapps.net/' );
defined( 'DPAA_PLUGIN_STORE_URL' ) || define( 'DPAA_PLUGIN_STORE_URL', 'https://dpapps.net/' );
defined( 'DPAA_PLUGIN_LICENSE_PAGE' ) || define( 'DPAA_PLUGIN_LICENSE_PAGE', 'dpapps-licenses' );
defined( 'DPAA_PLUGIN_LICENSE_KEY_PHRASE' ) || define( 'DPAA_PLUGIN_LICENSE_KEY_PHRASE', 'dpaa_plugin_license_key' );
defined( 'DPAA_PLUGIN_LICENSE_OPT_UNIQUE_ID' ) || define( 'DPAA_PLUGIN_LICENSE_OPT_UNIQUE_ID', 'dpaa-plugin-license' );
defined( 'DPAA_ENABLE_CACHE' ) || define( 'DPAA_ENABLE_CACHE', false);
defined( 'DPAA_FILE' ) || define( 'DPAA_FILE', __FILE__);
defined( 'DPAA_URL' ) || define( 'DPAA_URL', plugin_dir_url( __FILE__ ) );
defined( 'DPAA_PATH' ) || define( 'DPAA_PATH', plugin_dir_path( __FILE__ ) );
defined( 'DPAA_PLUGIN_BASENAME' ) || define( 'DPAA_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
defined( 'DPAA_PLUGIN_DIR_NAME' ) || define( 'DPAA_PLUGIN_DIR_NAME', dirname( DPAA_PLUGIN_BASENAME ) );
defined( 'DPAA_I18N' ) || define( 'DPAA_I18N', 'dpaa' );

/**
 * Check the enviroment before activation
 * 
 * @since 0.1.0
 */
if ( ! function_exists( 'dpaa_register_activation_check' ) ) {
	function dpaa_register_activation_check() {
		global $wp_version;

		$allowed_html = array(
			'a' => array(
				'href' => array (),
				'class' => array(),
			),
			'br' => array(),
			'strong' => array(), 
		);

		if ( version_compare( PHP_VERSION, DPAA_REQUIRES_PHP, '<' ) ) {
			deactivate_plugins( basename( __FILE__ ) );
			wp_die(
				wp_kses(
					sprintf(
						/* translators: check the php version */
						__( '%1$s%2$s can not be activated.%3$sIt requires PHP version %4$s or higher, but PHP version %5$s is used on the site. Please upgrade your PHP version first %6$s Back %7$s', 'dpa-ai-assistant' ),
						'<strong>',
						esc_html( DPAA_PLUGIN_NAME ),
						'</strong><br /><br />',
						esc_html( DPAA_REQUIRES_PHP ),
						PHP_VERSION,
						'<br /><br /><a href="' . esc_url( get_dashboard_url( get_current_user_id(), 'plugins.php' ) ) . '" class="button button-primary">',
						'</a>'
					),
					$allowed_html
				)
			);
		}

		if ( version_compare( $wp_version, DPAA_REQUIRES_WP, '<' ) ) {
			deactivate_plugins( basename( __FILE__ ) );
			wp_die(
				wp_kses(
					sprintf(
						/* translators: check the wordpress version */
						__( '%1$s%2$s can not be activated.%3$sIt requires WordPress %4$s or higher, but WordPress %5$s is used on the site. Please update your WordPress first %6$s Back %7$s', 'dpa-ai-assistant' ),
						'<strong>',
						esc_html( DPAA_PLUGIN_NAME ),
						'</strong><br /><br />',
						esc_html( DPAA_REQUIRES_WP ),
						esc_html( $wp_version ),
						'<br /><br /><a href="' . esc_url( get_dashboard_url( get_current_user_id(), 'plugins.php' ) ) . '" class="button button-primary">',
						'</a>'
					),
					$allowed_html
				)
			);
		}

		if ( defined( 'DPAA_PLUGIN_NAME' ) && DPAA_PLUGIN_NAME === 'AI Assistant Pro' ){
			deactivate_plugins( basename( __FILE__ ) );
			wp_die(
				wp_kses(
					sprintf(
						/* translators: check the conflicting */
						__( 'Other version of %1$s is installed. To enable this plugin, please deactivate the currently active %2$s first.%3$s Back %4$s', 'dpa-ai-assistant' ),
						'DPAPPS Plugin',
						esc_html( DPAA_PLUGIN_NAME ),
						'<br /><br /><a href="' . esc_url( get_dashboard_url( get_current_user_id(), 'plugins.php' ) ) . '" class="button button-primary">',
						'</a>'
					),
					$allowed_html
				),
				esc_html( __( 'Activation Error', 'dpa-ai-assistant' ) )
			);
		}
	}
	register_activation_hook( __FILE__, 'dpaa_register_activation_check' );
}

/**
 * Main Class
 * 
 * @since 0.1.0
 */
if ( !class_exists( 'DPAA_PLUGIN' ) ) {
	final class DPAA_PLUGIN {
		/**
		 * Holds the instance
		 *
		 * @var object
		 */
		private static $instance;
		private $file = '';

		/**
		 * Main Instance
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof DPAA_PLUGIN ) ) {
				self::$instance = new DPAA_PLUGIN;
			}
			return self::$instance;
		}

		/**
		 * Constructor Function
		 *
		 * @access private
		 */
		public function __construct() {
			$this->setup_globals();
			$this->requires();

			self::$instance = $this;
		}

		/**
		 * Reset the instance of the class
		 *
		 * @access public
		 * @static
		 */
		public static function reset() {
			self::$instance = null;
		}

		/**
		 * Globals
		 *
		 * @return void
		 */
		private function setup_globals() {
			$this->file         = __FILE__;
		}

		/**
		 * Requires
		 *
		 * @access private
		 * @return void
		 */
		private function requires() {
			require_once( dirname( $this->file ) . '/includes/class-init.php' );
		}
	}

	/**
	 * Loads a single instance of this plugin
	 *
	 * This follows the PHP singleton design pattern.
	 */
	if ( ! function_exists( 'dpaa_plugin_load' ) ) {
		function dpaa_plugin_load() {
			return DPAA_PLUGIN::get_instance();
		}
		// Loads plugin after all the others have loaded and have registered their hooks and filters
		add_action( 'plugins_loaded', 'dpaa_plugin_load', apply_filters( 'dpaa_plugin_action_priority', 10, 2 ) );
	}
}