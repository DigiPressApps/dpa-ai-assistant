/**
 * Internal dependencies
 */
import './editor.scss';
import { PanelAdvancedSettings } from '@dpaa/components'
import { getSysinfo } from '@dpaa/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	TextareaControl,
	Spinner,
} from '@wordpress/components'
import {
	useState,
	useEffect,
} from '@wordpress/element'
import {
	download as downloadIcon,
} from '@wordpress/icons'

export const ToolsTab = () => {
	const [ sysinfo, setSysinfo ] = useState( '' )

	useEffect( () => {
		const get = async () => {
			getSysinfo()
			.then( res  => {
				if ( res?.success ) {
					setSysinfo( res.sysinfo );
				}
			} )
			.catch( error => {
				console.error( error );
			} )
		}
		get();
	}, [] )

	const handleDownload = () => {
		const element = document.createElement( 'a' );
		const file = new Blob( [
			sysinfo || 'A problem occurred while retrieving system information.'
		], { type: 'text/plain' } );
		element.href = URL.createObjectURL( file );
		element.download = 'system_info.txt';
		document.body.appendChild( element ); // Required for this to work in Firefox
		element.click();
	};

	return (
		<PanelAdvancedSettings
			className='dpapps-admin__tab-item system-info-panel'
			title={ __( 'System Info', dpaa.i18n ) }
			initialOpen={ true }
		>
			<Flex
				direction='column'
				gap={ 4 }
			>
				<FlexItem>
					{ !sysinfo
						? <Spinner />
						: <TextareaControl
							className="dpapps-admin__sysinfo-text-area"
							help={ __( 'Show your system info for debug and support. Please download and send the text file when you contact us.', dpaa.i18n ) }
							label={ __( 'System Info', dpaa.i18n ) }
							rows={ 24 }
							value={ sysinfo }
							readonly
						/>
					}
				</FlexItem>
				{ sysinfo && (
					<FlexItem>
						<Button
							onClick={ () => handleDownload() }
							icon={ downloadIcon }
							iconSize={ 22 }
							iconPosition='left'
							variant='primary'
							size='default'
							disabled={ !sysinfo }
						>
							{ __( 'Download', dpaa.i18n ) }
						</Button>
					</FlexItem>
				) }
			</Flex>
		</PanelAdvancedSettings>
	)
}