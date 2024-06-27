/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
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
	Flex,
	FlexItem,
	RangeControl,
	SelectControl,
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
			<Flex
				direction='column'
				gap={ 3 }
				className='dpaa-ai-assistant--settings__components-flex __chat'
			>
				<FlexItem>
					<SelectControl
						__next40pxDefaultSize
						size='__unstable-large'
						label={ __( 'AI Image Generator', dpaa.i18n ) }
						help={ __( 'Select the generator engine to use for AI image generation.', dpaa.i18n ) }
						value={ engine }
						options={ [
							{ value: 'stable-diffusion', label: __( 'Stable Diffusion (Stability AI)', dpaa.i18n ) },
							{ value: 'dall-e', label: __( 'DALL·E (OpenAI)', dpaa.i18n ) },
						] }
						onChange={ newVal => setEngine( newVal ) }
					/>
				</FlexItem>
				<FlexItem>
					<RangeControl
						label={ __( 'Max number of generated image logs', dpaa.i18n ) }
						help={ __( 'Set the maximum number of logs generated.', dpaa.i18n ) }
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
				</FlexItem>
			</Flex>
		</PanelAdvancedSettings>
	)
}

export default ImageSettings