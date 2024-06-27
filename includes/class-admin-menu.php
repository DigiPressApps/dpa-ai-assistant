<?php
/**
 * Admin menu page
 *
 * @since   0.1.0
 */
 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Dpaa_Admin_menu' ) ) {
	class Dpaa_Admin_menu {
		public $main_menu_slug = 'dpapps-main-menu';
		public $license_menu_slug = 'dpapps-licenses';

		/**
		 * Init constructor.
		 */
		public function __construct() {
			self::requires();

			add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_resouces' ) );
		}

		/**
		 * Require resources
		 *
		 * @since 0.1.0
		 */
		private function requires() {
			// System information for technical support.
			require_once( DPAA_PATH . 'includes/function-get-sysinfo.php' );
		}

		/**
		 * Register main menu page.
		 */
		public function register_admin_menu() {
			// Check if the main menu page with the same slug already exists
			$main_menu_exists = false;
			$license_menu_exists = false;
			global $menu;
			foreach ( $menu as $item ) {
				if ( $this->main_menu_slug === $item[ 2 ] ) {
					$main_menu_exists = true;
				}
				if ( $this->license_menu_slug === $item[ 2 ] ) {
					$license_menu_exists = true;
				}
				if ( $main_menu_exists && $license_menu_exists ) {
					break;
				}
			}

			// If the main menu page doesn't exist, add it
			if ( ! $main_menu_exists ) {
				require_once( ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php' );
				require_once( ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php' );

				$wp_filesystem = new WP_Filesystem_Direct( true );

				$svg_file_path = DPAA_PATH . 'assets/images/dpicon-white.svg';
				$svg = $wp_filesystem->get_contents( $svg_file_path );
				
				add_menu_page(
					'DPAPPS', // Page title
					'DPAPPS', // Menu title
					'manage_options', // Capability
					$this->main_menu_slug, // Menu slug
					'',
					'data:image/svg+xml;base64,' . base64_encode( $svg ),	// Icon
					99 // Position
				);

				$main_menu_exists = true;
			}

			// Add sub-menu pages for this plugin
			if ( $main_menu_exists ) {
				// Top level menu: dashboard
				add_submenu_page(
					$this->main_menu_slug, // Parent slug
					__( 'Dashboard' ), // Page title
					__( 'Dashboard' ), // Menu title
					'manage_options', // Capability
					$this->main_menu_slug, // Menu slug = Same as top level menu slug
					array( $this, 'main_menu_page_callback' ) // Callback function
				);

				// Plugin menu
				add_submenu_page(
					$this->main_menu_slug, // Parent slug
					DPAA_PLUGIN_NAME, // Page title
					DPAA_PLUGIN_NAME, // Menu title
					'manage_options', // Capability
					DPAA_PLUGIN_ID . '_admin_menu', // Menu slug
					array( $this, 'plugin_menu_page_callback' ) // Callback function
				);
			}
		}

		/** 
		 * Render dashboard page (main menu).
		 * 
		 * @return void
		 */
		public function main_menu_page_callback() {
			echo '<div class="wrap">';
			echo '<div id="digipress-apps-dashboard" class="digipress-apps-dashboard"></div>';
			echo '</div>';
		}

		/**
		 * Render plugin setting page (sub-menu).
		 */
		public function plugin_menu_page_callback() {
			echo '<div class="wrap">';
			echo '<div id="dpaa-plugin-menu" class="dpaa-plugin-menu"></div>';
			echo '</div>';
		}

		/**
		 * Enqueue our script on the settings page.
		 */
		function enqueue_admin_resouces( $hook_suffix ) {
			// Dashboard
			if ( file_exists( DPAA_PATH . 'dist/dashboard.asset.php' ) && 'toplevel_page_' . $this->main_menu_slug === $hook_suffix ) {
				$assets = require_once( DPAA_PATH . 'dist/dashboard.asset.php' );

				// CSS
				wp_enqueue_style(
					'dpaa-backend', // Handle.
					DPAA_URL . 'dist/dashboard.css', // Block editor CSS.
					array( 'wp-edit-blocks' ),
					$assets[ 'version' ]
				);

				// JavaScript( handle: 'dpaa-backend')
				wp_register_script(
					'dpaa-backend',
					DPAA_URL . 'dist/dashboard.js',
					$assets[ 'dependencies' ],
					$assets[ 'version' ],
					true
				);

				// Enqueue 'dpaa-backend' to access the 'dpaa' variables
				wp_enqueue_script( 'dpaa-backend' );
			}

			// Plugin menu
			if ( file_exists( DPAA_PATH . 'dist/plugin-menu.asset.php' ) && 'dpapps_page_' . DPAA_PLUGIN_ID . '_admin_menu' === $hook_suffix ) {
				$assets = require_once( DPAA_PATH . 'dist/plugin-menu.asset.php' );

				// CSS
				wp_enqueue_style(
					'dpaa-backend', // Handle.
					DPAA_URL . 'dist/plugin-menu.css', // Block editor CSS.
					array( 'wp-edit-blocks' ),
					$assets[ 'version' ]
				);

				// JavaScript( handle: 'dpaa-backend')
				wp_register_script(
					'dpaa-backend',
					DPAA_URL . 'dist/plugin-menu.js',
					$assets[ 'dependencies' ],
					$assets[ 'version' ],
					true
				);

				// Enqueue 'dpaa-backend' to access the 'dpaa' variables
				wp_enqueue_script( 'dpaa-backend' );
			}
		}
	}

	if ( is_admin() ) {
		new Dpaa_Admin_menu();
	}
}