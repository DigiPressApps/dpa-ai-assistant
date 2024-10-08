<?php
/**
 * Get the client system info.
 *
 * @since   0.1.0
 * 
 * @return string $return
 */
if ( ! function_exists( 'dpapps_get_sysinfo' ) ) {
	function dpapps_get_sysinfo() {
		global $wpdb;

		// Get theme info
		$theme_data   = wp_get_theme();
		$theme        = $theme_data->Name . ' ' . $theme_data->Version;
		$parent_theme = $theme_data->Template;
		if ( ! empty( $parent_theme ) ) {
			$parent_theme_data = wp_get_theme( $parent_theme );
			$parent_theme      = $parent_theme_data->Name . ' ' . $parent_theme_data->Version;
		}

		$host = dpapps_get_host();

		$return  = '### Begin System Info (Generated ' . gmdate( 'Y-m-d H:i:s' ) . ') ###' . "\n\n";
		$return .= '-- Site Info' . "\n\n";
		$return .= 'Site URL:                 ' . site_url() . "\n";
		$return .= 'Home URL:                 ' . home_url() . "\n";
		$return .= 'Multisite:                ' . ( is_multisite() ? 'Yes' : 'No' ) . "\n";

		$return  = apply_filters( 'dpapps_sysinfo_after_site_info', $return );

		// Can we determine the site's host?
		if( $host ) {
			$return .= "\n" . '-- Hosting Provider' . "\n\n";
			$return .= 'Host:                     ' . $host . "\n";

			$return  = apply_filters( 'dpapps_sysinfo_after_host_info', $return );
		}

		// Server configuration (really just versioning)
		$return .= "\n" . '-- Webserver Configuration' . "\n\n";
		$return .= 'PHP Version:              ' . PHP_VERSION . "\n";
		$return .= 'MySQL Version:            ' . $wpdb->db_version() . "\n";
		$return .= 'Webserver Info:           ' . sanitize_text_field( $_SERVER['SERVER_SOFTWARE'] ) . "\n";

		$return  = apply_filters( 'dpapps_sysinfo_after_webserver_config', $return );

		// PHP configs... now we're getting to the important stuff
		$return .= "\n" . '-- PHP Configuration' . "\n\n";
		$return .= 'Loaded php.ini:           ' . php_ini_loaded_file() . "\n";
		$return .= 'Error log file:           ' . ini_get( 'error_log' ) . "\n";
		$return .= 'Memory Limit:             ' . ini_get( 'memory_limit' ) . "\n";
		$return .= 'Upload Max Size:          ' . ini_get( 'upload_max_filesize' ) . "\n";
		$return .= 'Post Max Size:            ' . ini_get( 'post_max_size' ) . "\n";
		$return .= 'Upload Max Filesize:      ' . ini_get( 'upload_max_filesize' ) . "\n";
		$return .= 'Time Limit:               ' . ini_get( 'max_execution_time' ) . "\n";
		$return .= 'Max Input Vars:           ' . ini_get( 'max_input_vars' ) . "\n";
		$return .= 'Display Errors:           ' . ( ini_get( 'display_errors' ) ? 'On (' . ini_get( 'display_errors' ) . ')' : 'N/A' ) . "\n";
		$return .= 'Allow URL File Open:      ' . ( ini_get( 'allow_url_fopen' ) ? 'On (' . ini_get( 'allow_url_fopen' ) . ')' : 'N/A' ) . "\n";

		$return  = apply_filters( 'dpapps_sysinfo_after_php_config', $return );

		// PHP extensions and such
		$return .= "\n" . '-- PHP Extensions' . "\n\n";
		$return .= 'cURL:                     ' . ( function_exists( 'curl_init' ) ? 'Supported' : 'Not Supported' ) . "\n";
		$return .= 'fsockopen:                ' . ( function_exists( 'fsockopen' ) ? 'Supported' : 'Not Supported' ) . "\n";
		$return .= 'SOAP Client:              ' . ( class_exists( 'SoapClient' ) ? 'Installed' : 'Not Installed' ) . "\n";
		$return .= 'Suhosin:                  ' . ( extension_loaded( 'suhosin' ) ? 'Installed' : 'Not Installed' ) . "\n";

		$return  = apply_filters( 'dpapps_sysinfo_after_php_ext', $return );

		// Session stuff
		$return .= "\n" . '-- Session Configuration' . "\n\n";
		$return .= 'Session:                  ' . ( isset( $_SESSION ) ? 'Enabled' : 'Disabled' ) . "\n";

		// The rest of this is only relevant is session is enabled
		if( isset( $_SESSION ) ) {
			$return .= 'Session Name:             ' . esc_html( ini_get( 'session.name' ) ) . "\n";
			$return .= 'Cookie Path:              ' . esc_html( ini_get( 'session.cookie_path' ) ) . "\n";
			$return .= 'Save Path:                ' . esc_html( ini_get( 'session.save_path' ) ) . "\n";
			$return .= 'Use Cookies:              ' . ( ini_get( 'session.use_cookies' ) ? 'On' : 'Off' ) . "\n";
			$return .= 'Use Only Cookies:         ' . ( ini_get( 'session.use_only_cookies' ) ? 'On' : 'Off' ) . "\n";
		}

		$return  = apply_filters( 'dpapps_sysinfo_after_session_config', $return );


		$locale = get_locale();

		// WordPress configuration
		$return .= "\n" . '-- WordPress Configuration' . "\n\n";
		$return .= 'Version:                  ' . get_bloginfo( 'version' ) . "\n";
		$return .= 'Language:                 ' . ( !empty( $locale ) ? $locale : 'en_US' ) . "\n";
		$return .= 'Permalink Structure:      ' . ( get_option( 'permalink_structure' ) ? get_option( 'permalink_structure' ) : 'Default' ) . "\n";
		$return .= 'Active Theme:             ' . $theme . "\n";
		if ( $parent_theme !== $theme ) {
			$return .= 'Parent Theme:             ' . $parent_theme . "\n";
		}
		$return .= 'Show On Front:            ' . get_option( 'show_on_front' ) . "\n";

		// Only show page specs if frontpage is set to 'page'
		if( get_option( 'show_on_front' ) == 'page' ) {
			$front_page_id = get_option( 'page_on_front' );
			$blog_page_id = get_option( 'page_for_posts' );

			$return .= 'Page On Front:            ' . ( $front_page_id != 0 ? get_the_title( $front_page_id ) . ' (#' . $front_page_id . ')' : 'Unset' ) . "\n";
			$return .= 'Page For Posts:           ' . ( $blog_page_id != 0 ? get_the_title( $blog_page_id ) . ' (#' . $blog_page_id . ')' : 'Unset' ) . "\n";
		}

		$return .= 'ABSPATH:                  ' . ABSPATH . "\n";

		// Make sure wp_remote_post() is working
		$request['cmd'] = '_notify-validate';

		$params = array(
			'sslverify'     => false,
			'timeout'       => 100,
			'user-agent'    => 'digipress-apps',
			'body'          => $request
		);

		$response = wp_remote_post( 'https://dpapps.net/', $params );

		if( !is_wp_error( $response ) && $response['response']['code'] >= 200 && $response['response']['code'] < 300 ) {
			$WP_REMOTE_POST = 'wp_remote_post() works';
		} else {
			$WP_REMOTE_POST = 'wp_remote_post() does not work';
		}

		$return .= 'Remote Post:              ' . $WP_REMOTE_POST . "\n";
		$return .= 'Table Prefix:             ' . 'Length: ' . strlen( $wpdb->prefix ) . '   Status: ' . ( strlen( $wpdb->prefix ) > 16 ? 'ERROR: Too long' : 'Acceptable' ) . "\n";
		$return .= 'Table Prefix:             ' . 'Length: ' . strlen( $wpdb->prefix ) . '   Status: ' . ( strlen( $wpdb->prefix ) > 16 ? 'ERROR: Too long' : 'Acceptable' ) . "\n";
		$return .= 'WP_DEBUG:                 ' . ( defined( 'WP_DEBUG' ) ? ( WP_DEBUG ? 'Enabled' : 'Disabled' ) : 'Not set' ) . "\n";
		$return .= 'WP_DEBUG_LOG:             ' . ( defined( 'WP_DEBUG_LOG' ) ? ( WP_DEBUG_LOG ? 'Enabled' : 'Disabled' ) : 'Not set' ) . "\n";
		$return .= 'WP_DEBUG_DISPLAY:         ' . ( defined( 'WP_DEBUG_DISPLAY' ) ? ( WP_DEBUG_DISPLAY ? 'Enabled' : 'Disabled' ) : 'Not set' ) . "\n";
		$return .= 'Memory Limit:             ' . WP_MEMORY_LIMIT . "\n";
		$return .= 'Registered Post Stati:    ' . implode( ', ', get_post_stati() ) . "\n";

		$return  = apply_filters( 'dpapps_sysinfo_after_wordpress_config', $return );


		// Get plugins that have an update
		if ( ! function_exists( 'get_plugin_updates' ) || ! function_exists( 'get_plugins' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}
		$updates = get_plugin_updates();

		// Must-use plugins
		// NOTE: MU plugins can't show updates!
		$muplugins = get_mu_plugins();
		if( count( $muplugins ) > 0 ) {
			$return .= "\n" . '-- Must-Use Plugins' . "\n\n";

			foreach( $muplugins as $plugin => $plugin_data ) {
				$return .= $plugin_data['Name'] . ': ' . $plugin_data['Version'] . "\n";
			}

			$return = apply_filters( 'dpapps_sysinfo_after_wordpress_mu_plugins', $return );
		}

		// WordPress active plugins
		$return .= "\n" . '-- WordPress Active Plugins' . "\n\n";

		$plugins = get_plugins();
		$active_plugins = get_option( 'active_plugins', array() );

		foreach( $plugins as $plugin_path => $plugin ) {
			if( !in_array( $plugin_path, $active_plugins ) )
				continue;

			$update = ( array_key_exists( $plugin_path, $updates ) ) ? ' (needs update - ' . $updates[$plugin_path]->update->new_version . ')' : '';
			$plugin_url = '';
			if ( ! empty( $plugin['PluginURI'] ) ) {
				$plugin_url = $plugin['PluginURI'];
			} elseif ( ! empty( $plugin['AuthorURI'] ) ) {
				$plugin_url = $plugin['AuthorURI'];
			} elseif ( ! empty( $plugin['Author'] ) ) {
				$plugin_url = $plugin['Author'];
			}
			if ( $plugin_url ) {
				$plugin_url = "\n" . $plugin_url;
			}
			$return .= $plugin['Name'] . ': ' . $plugin['Version'] . $update . $plugin_url . "\n\n";
		}

		$return  = apply_filters( 'dpapps_sysinfo_after_wordpress_plugins', $return );

		// WordPress inactive plugins
		$return .= "\n" . '-- WordPress Inactive Plugins' . "\n\n";

		foreach( $plugins as $plugin_path => $plugin ) {
			if( in_array( $plugin_path, $active_plugins ) )
				continue;

			$update = ( array_key_exists( $plugin_path, $updates ) ) ? ' (needs update - ' . $updates[$plugin_path]->update->new_version . ')' : '';
			$plugin_url = '';
			if ( ! empty( $plugin['PluginURI'] ) ) {
				$plugin_url = $plugin['PluginURI'];
			} elseif ( ! empty( $plugin['AuthorURI'] ) ) {
				$plugin_url = $plugin['AuthorURI'];
			} elseif ( ! empty( $plugin['Author'] ) ) {
				$plugin_url = $plugin['Author'];
			}
			if ( $plugin_url ) {
				$plugin_url = "\n" . $plugin_url;
			}
			$return .= $plugin['Name'] . ': ' . $plugin['Version'] . $update . $plugin_url . "\n\n";
		}

		$return  = apply_filters( 'dpapps_sysinfo_after_wordpress_plugins_inactive', $return );

		if( is_multisite() ) {
			// WordPress Multisite active plugins
			$return .= "\n" . '-- Network Active Plugins' . "\n\n";

			$plugins = wp_get_active_network_plugins();
			$active_plugins = get_site_option( 'active_sitewide_plugins', array() );

			foreach( $plugins as $plugin_path ) {
				$plugin_base = plugin_basename( $plugin_path );

				if( !array_key_exists( $plugin_base, $active_plugins ) )
					continue;

				$update = ( array_key_exists( $plugin_path, $updates ) ) ? ' (needs update - ' . $updates[$plugin_path]->update->new_version . ')' : '';
				$plugin  = get_plugin_data( $plugin_path );
				$plugin_url = '';
				if ( ! empty( $plugin['PluginURI'] ) ) {
					$plugin_url = $plugin['PluginURI'];
				} elseif ( ! empty( $plugin['AuthorURI'] ) ) {
					$plugin_url = $plugin['AuthorURI'];
				} elseif ( ! empty( $plugin['Author'] ) ) {
					$plugin_url = $plugin['Author'];
				}
				if ( $plugin_url ) {
					$plugin_url = "\n" . $plugin_url;
				}
				$return .= $plugin['Name'] . ': ' . $plugin['Version'] . $update . $plugin_url . "\n\n";
			}

			$return  = apply_filters( 'dpapps_sysinfo_after_wordpress_ms_plugins', $return );
		}

		$return .= "\n" . '### End System Info ###';

		return $return;
	}

	/**
	 * Get user host
	 */
	if ( ! function_exists( 'dpapps_get_host' ) ) {
		function dpapps_get_host() {
			$host = false;

			if( defined( 'WPE_APIKEY' ) ) {
				$host = 'WP Engine';
			} elseif( defined( 'PAGELYBIN' ) ) {
				$host = 'Pagely';
			} elseif( DB_HOST == 'localhost:/tmp/mysql5.sock' ) {
				$host = 'ICDSoft';
			} elseif( DB_HOST == 'mysqlv5' ) {
				$host = 'NetworkSolutions';
			} elseif( strpos( DB_HOST, 'ipagemysql.com' ) !== false ) {
				$host = 'iPage';
			} elseif( strpos( DB_HOST, 'ipowermysql.com' ) !== false ) {
				$host = 'IPower';
			} elseif( strpos( DB_HOST, '.gridserver.com' ) !== false ) {
				$host = 'MediaTemple Grid';
			} elseif( strpos( DB_HOST, '.pair.com' ) !== false ) {
				$host = 'pair Networks';
			} elseif( strpos( DB_HOST, '.stabletransit.com' ) !== false ) {
				$host = 'Rackspace Cloud';
			} elseif( strpos( DB_HOST, '.sysfix.eu' ) !== false ) {
				$host = 'SysFix.eu Power Hosting';
			} elseif( isset( $_SERVER['SERVER_NAME'] ) && strpos( sanitize_text_field( wp_unslash( $_SERVER['SERVER_NAME'] ) ), 'Flywheel' ) !== false ) {
				$host = 'Flywheel';
			} else {

				// Adding a general fallback for data gathering.
				if ( isset( $_SERVER['SERVER_NAME'] ) ) {
					$server_name = sanitize_text_field( wp_unslash( $_SERVER['SERVER_NAME'] ) );
				}

				$host = 'DBH: ' . DB_HOST . ', SRV: ' . $server_name;
			}

			return $host;
		}
	}
}
