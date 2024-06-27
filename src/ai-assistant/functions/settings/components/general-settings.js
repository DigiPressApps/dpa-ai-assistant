/**
 * Internal dependencies
 */
import {
	DEFAULT_UPLOAD_FILE_PREFIX,
} from '@dpaa/ai-assistant/constants'
import {
	PanelAdvancedSettings,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Flex,
	FlexItem,
	RangeControl,
	SelectControl,
	__experimentalInputControl as InputControl,
} from '@wordpress/components'
import {
	useDispatch,
} from '@wordpress/data'
import {
	useEffect,
	useState,
} from '@wordpress/element'
import {
	cog as cogIcon,
} from '@wordpress/icons'

export const GeneralSettings = ( { pluginSettings } ) => {

	// 各パラメータの状態管理用
	const [ initialTab, setInitialTab ] = useState( pluginSettings?.generalSettings?.initialTab || 'chat' )
	const [ uploadFilePrefix, setUploadFilePrefix ] = useState( pluginSettings?.generalSettings?.uploadFilePrefix || DEFAULT_UPLOAD_FILE_PREFIX )
	const [ adminPanelMaxWidth, setAdminPanelMaxWidth ] = useState( pluginSettings?.generalSettings?.adminPanelMaxWidth || 1024 )
	

	// グローバル設定の更新用(ストア更新前の状態管理用)
	const { setSetting } = useDispatch( STORE_NAME )
	const updateSetting = ( key, value ) => {
		setSetting( { 'generalSettings': key }, value );
	};
	useEffect( () => updateSetting( 'initialTab', initialTab ), [ initialTab ] );
	useEffect( () => updateSetting( 'uploadFilePrefix', uploadFilePrefix ), [ uploadFilePrefix ] );
	useEffect( () => updateSetting( 'adminPanelMaxWidth', adminPanelMaxWidth ), [ adminPanelMaxWidth ] );

	const tabs = [
		{ value: 'chat', label: __( 'Chat', dpaa.i18n ) },
		{ value: 'generateImage', label: __( 'Image Generation', dpaa.i18n ) },
		{ value: 'writer', label: __( 'Writer', dpaa.i18n ) },
		{ value: 'voiceConversion', label: __( 'Voice Conversion', dpaa.i18n ) },
		{ value: 'assistants', label: __( 'Assistants', dpaa.i18n ) },
		{ value: 'fineTuning', label: __( 'AI Tuning', dpaa.i18n ) },
		{ value: 'settings', label: __( 'Settings', dpaa.i18n ) },
	]

	return (
		<PanelAdvancedSettings
			title={ sprintf( __( '%s Settings', dpaa.i18n ), __( 'General', dpaa.i18n ) ) }
			className='dpaa-components-panel __option-settings'
			initialOpen={ false }
			hasToggle={ false }
			titleLeftIcon={ cogIcon }
		>
			<Flex
				direction='column'
				gap={ 3 }
				className='dpaa-ai-assistant--settings__components-flex __general'
			>
				<FlexItem>
					<SelectControl
						__next40pxDefaultSize
						size='__unstable-large'
						label={ __( 'Initial Open Tab', dpaa.i18n ) }
						help={ __( 'Select the initial open tab in the admin panel.', dpaa.i18n ) }
						value={ initialTab }
						options={ tabs }
						onChange={ newVal => setInitialTab( newVal ) }
					/>
				</FlexItem>
				<FlexItem>
					<InputControl
						__next40pxDefaultSize
						size='__unstable-large'
						type='text'
						label={ __( 'Upload file prefix', dpaa.i18n ) }
						value={ uploadFilePrefix }
						onChange={ newVal => setUploadFilePrefix( newVal ) }
						placeholder='dpaa-'
						help={ __( 'A prefix added to the beginning of filenames when uploaded by the AI Assistant to the Media Library.', dpaa.i18n ) }
					/>
				</FlexItem>
				<FlexItem>
					<RangeControl
						label={ __( 'Admin Panel Max width', dpaa.i18n ) }
						help={ __( 'Set the maximum display width of AI Assistant operation screen.', dpaa.i18n ) }
						value={ adminPanelMaxWidth }
						allowReset={ true }
						initialPosition={ 1024 }
						resetFallbackValue={ 1024 }
						step={ 1 }
						onChange={ newVal => setAdminPanelMaxWidth( newVal ) }
						renderTooltipContent={ value => `${ value }px` }
						min={ 600 }
						max={ 2048 }
					/>
				</FlexItem>
			</Flex>
		</PanelAdvancedSettings>
	)
}

export default GeneralSettings