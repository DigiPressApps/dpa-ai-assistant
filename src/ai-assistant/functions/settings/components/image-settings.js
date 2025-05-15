/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	PopoverHelp,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	DEFAULT_IMAGE_ENGINE,
	DEFAULT_UPLOAD_FILE_PREFIX,
	DEFAULT_IMAGE_MAX_VISIBLE_IMAGE_LOGS,
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	RangeControl,
	SelectControl,
	__experimentalVStack as VStack,
} from '@wordpress/components'
import {
	useDispatch,
} from '@wordpress/data'
import {
	useEffect,
	useState,
} from '@wordpress/element'
import {
	image as imageIcon,
} from '@wordpress/icons'

export const ImageSettings = ( { pluginSettings } ) => {

	// 各パラメータの状態管理用
	const [ engine, setEngine ] = useState( pluginSettings?.imageGenerationSettings?.engine || DEFAULT_IMAGE_ENGINE )
	const [ uploadFilePrefix, setUploadFilePrefix ] = useState( pluginSettings?.generalSettings?.uploadFilePrefix || DEFAULT_UPLOAD_FILE_PREFIX )
	const [ maxVisibleImageLogs, setMaxVisibleGeneratedImageLogs ] = useState( pluginSettings?.imageGenerationSettings?.maxVisibleImageLogs || DEFAULT_IMAGE_MAX_VISIBLE_IMAGE_LOGS)
	

	// グローバル設定の更新用(ストア更新前の状態管理用)
	const { setSetting } = useDispatch( STORE_NAME )
	const updateSetting = ( key, value ) => {
		setSetting( { 'imageGenerationSettings': key }, value );
	};
	useEffect( () => updateSetting( 'engine', engine ), [ engine ] );
	useEffect( () => updateSetting( 'uploadFilePrefix', uploadFilePrefix ), [ uploadFilePrefix ] );
	useEffect( () => updateSetting( 'maxVisibleImageLogs', maxVisibleImageLogs ), [ maxVisibleImageLogs ] );

	return (
		<PanelAdvancedSettings
			title={ sprintf( __( '%s Settings', dpaa.i18n ), __( 'Image Generation', dpaa.i18n ) ) }
			className='dpaa-components-panel __option-settings'
			initialOpen={ false }
			hasToggle={ false }
			titleLeftIcon={ imageIcon }
		>
			<VStack spacing={ 3 }>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ <>
						{__( 'AI Image Generator', dpaa.i18n ) }
						<PopoverHelp
							buttonText=''
							buttonClass='__right-inline-position'
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass=''
							popoverNoArrow={ false }
							help={ __( 'Select the generator engine to use for AI image generation.', dpaa.i18n ) }
						/>
					</> }
					value={ engine }
					options={ [
						{ value: 'dall-e', label: __( 'OpenAI', dpaa.i18n ) },
						{ value: 'stable-diffusion', label: __( 'Stability AI', dpaa.i18n ) },
					] }
					onChange={ newVal => setEngine( newVal ) }
				/>
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ <>
						{__( 'Max number of generated image logs', dpaa.i18n ) }
						<PopoverHelp
							buttonText=''
							buttonClass='__right-inline-position'
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass=''
							popoverNoArrow={ false }
							help={ __( 'Set the maximum number of logs generated.', dpaa.i18n ) }
						/>
					</> }
					value={ maxVisibleImageLogs }
					allowReset={ true }
					initialPosition={ DEFAULT_IMAGE_MAX_VISIBLE_IMAGE_LOGS }
					resetFallbackValue={ DEFAULT_IMAGE_MAX_VISIBLE_IMAGE_LOGS }
					step={ 1 }
					onChange={ newVal => setMaxVisibleGeneratedImageLogs( newVal ) }
					renderTooltipContent={ value => `${ value }` }
					min={ 1 }
					max={ 4 }
				/>
			</VStack>
		</PanelAdvancedSettings>
	)
}

export default ImageSettings