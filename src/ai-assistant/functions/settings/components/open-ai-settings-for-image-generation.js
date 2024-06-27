/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	OPEN_AI_API_KEY_URL,
	OPEN_AI_DALL_E_MODEL_DOCUMENT_URL,
	OPEN_AI_USAGE_URL,
	OPEN_AI_DALL_E_IMAGE_QUALITY,
	OPEN_AI_DALL_E_IMAGE_STYLES,
	OPEN_AI_DALL_E_2_IMAGE_SIZES,
	OPEN_AI_DALL_E_3_IMAGE_SIZES,
	OPEN_AI_DALL_E_MODELS,
	DEFAULT_OPEN_AI_DALL_E_MODEL,
	DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES,
	DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE,
	DEFAULT_OPEN_AI_DALL_E_QUALITY,
	DEFAULT_OPEN_AI_DALL_E_STYLE,
} from '@dpaa/ai-assistant/constants'
import { aiIcon } from '@dpaa/ai-assistant/icons'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	CustomSelectControl,
	ExternalLink,
	Flex,
	FlexItem,
	Notice,
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
	seen as seenIcon,
} from '@wordpress/icons'

export const OpenAISettingsForImageGeneration = ( { pluginSettings } ) => {

	// 各パラメータの状態管理用
	const [ apiKey, setApiKey ] = useState( pluginSettings?.openAISettings?.apiKey || '' )
	const [ imageGenerationSettings, setImageGenerationSettings ] = useState( pluginSettings?.openAISettings?.imageGeneration || null )
	const [ dallEModel, setDallEModel ] = useState( pluginSettings?.openAISettings?.imageGeneration?.dallEModel || DEFAULT_OPEN_AI_DALL_E_MODEL )
	const [ numberImages, setNumberImages ] = useState( pluginSettings?.openAISettings?.imageGeneration?.numberImages || DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES )
	const [ imageSize, setImageSize ] = useState( pluginSettings?.openAISettings?.imageGeneration?.imageSize || DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE )
	const [ quality, setQuality ] = useState( pluginSettings?.openAISettings?.imageGeneration?.quality || DEFAULT_OPEN_AI_DALL_E_QUALITY )
	const [ dallEStyle, setDallEstyle ] = useState( pluginSettings?.openAISettings?.imageGeneration?.dallEStyle || DEFAULT_OPEN_AI_DALL_E_STYLE )

	// グローバル設定の更新用(ストア更新前の状態管理用)
	const { setSetting } = useDispatch( STORE_NAME )
	const updateSetting = ( key, value ) => {
		setSetting( { 'openAISettings': key }, value );
	};
	useEffect( () => updateSetting( 'apiKey', apiKey ), [ apiKey ] );
	useEffect( () => updateSetting( 'imageGeneration', imageGenerationSettings ), [ imageGenerationSettings ] );

	// DALL・E の設定更新
	useEffect( () => {
		setImageGenerationSettings( {
			dallEModel: dallEModel,
			numberImages: parseInt( numberImages, 10 ),
			imageSize: imageSize,
			quality: quality,
			dallEStyle: dallEStyle,
		} )
	}, [ dallEModel, numberImages, imageSize, quality, dallEStyle ] )

	// 画像サイズオプション
	const [ imageSizeOptions, setImageSizeOptions ] = useState( [] )
	useEffect( () => {
		if ( dallEModel === 'dall-e-3' ) {
			setImageSizeOptions( OPEN_AI_DALL_E_3_IMAGE_SIZES )
			if ( imageSize === '256x256' || imageSize === '512x512' ) {
				setImageSize( '1024x1024' )
			}
		} else {
			setImageSizeOptions( OPEN_AI_DALL_E_2_IMAGE_SIZES )
			if ( imageSize === '1792x1024' || imageSize === '1024x1792' ) {
				setImageSize( '1024x1024' )
			}
		}

	}, [ dallEModel ])

	// APIキー表示有無の状態管理
	const [ showKey, setShowKey ] = useState( false );

	return (
		<>
			<PanelAdvancedSettings
				title={ `${ sprintf( __( '%s Settings', dpaa.i18n ), 'OpenAI' ) } (${ __( 'For image', dpaa.i18n ) })` }
				className='dpaa-components-panel __option-settings'
				titleLeftIcon={ aiIcon }
				initialOpen={ false }
				hasToggle={ false }
			>
				<Flex
					direction='column'
					gap={ 3 }
					className='dpaa-ai-assistant--settings__components-flex __open-ai'
				>
					<FlexItem>
						<Flex direction='row' gap={ 1 } justify='space-between' align='center'>
							<FlexItem style={ { flexBasis: !apiKey ? '100%' : 'calc(100% - 34px)' } }>
								<InputControl
									__next40pxDefaultSize
									size='__unstable-large'
									type={ showKey ? 'text' : 'password' }
									label={ __( 'API Key', dpaa.i18n ) }
									value={ apiKey || '' }
									onChange={ newVal => setApiKey( newVal ) }
									placeholder='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'
									help={ apiKey ? (
										<ExternalLink
											href={ OPEN_AI_USAGE_URL }
											type="link"
											rel="next"
										>
											{ __( 'Check current usage', dpaa.i18n ) }
										</ExternalLink>
									) : (
										<Notice
											className="dpaa-ai-assistant--settings__notice-component"
											status="info"
											isDismissible={ false }
										>
											<Flex
												direction='column'
												gap={ 2 }
											>
												<FlexItem>
													<ExternalLink
														href={ OPEN_AI_API_KEY_URL }
														type="link"
														rel="next"
													>
														{ __( 'Get the API key.', dpaa.i18n ) }
													</ExternalLink>
												</FlexItem>
											</Flex>
										</Notice>
									) }
								/>
							</FlexItem>
							{ apiKey && (
								<FlexItem style={ { flexBasis: '30px' } }>
									<Button
										size='compact'
										icon={ seenIcon }
										label={ sprintf( __( 'Show %s', dpaa.i18n ), __( 'API Key', dpaa.i18n ) ) }
										showTooltip={ true }
										disabled={ !apiKey }
										variant={ showKey ? 'secondary' : 'primary' }
										onClick={ () => setShowKey( !showKey ) }
									/>
								</FlexItem>
							) }
							
						</Flex>
					</FlexItem>
					<FlexItem>
						<BaseControl
							help={ (
								<>
									<span>{ __( 'Select the OpenAI model to generate images.', dpaa.i18n ) }</span><br />
									<ExternalLink
										href={ OPEN_AI_DALL_E_MODEL_DOCUMENT_URL }
										type="link"
										rel="next"
									>
										{ __( 'Documentation', dpaa.i18n ) }
									</ExternalLink>
								</>
							) }
						>
							<CustomSelectControl
								__next40pxDefaultSize
								__experimentalShowSelectedHint
								size='__unstable-large'
								label={ __( 'Model', dpaa.i18n ) }
								value={ OPEN_AI_DALL_E_MODELS.find( option => option.key === dallEModel ) }
								options={ OPEN_AI_DALL_E_MODELS }
								onChange={ newSelect => {
									setDallEModel( newSelect.selectedItem.key )
									if ( newSelect.selectedItem.key === 'dall-e-3' ) {
										setNumberImages( 1 )
									}
								} }
							/>
						</BaseControl>
					</FlexItem>
					<FlexItem>
						<RangeControl
							label={ __( 'Number of images', dpaa.i18n ) }
							help={ __( 'The number of images to generate. Must be between 1 and 10. For DALL·E 3, only one image is supported.', dpaa.i18n ) }
							value={ numberImages }
							allowReset={ true }
							initialPosition={ DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES }
							resetFallbackValue={ DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES }
							step={ 1 }
							onChange={ newVal => setNumberImages( dallEModel === 'dall-e-3' ? 1 : newVal ) }
							renderTooltipContent={ value => `${ value }` }
							min={ 1 }
							max={ dallEModel === 'dall-e-3' ? 1 : 10 }
						/>
					</FlexItem>
					<FlexItem>
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ `${ __( 'Dimensions' ) } (${ __( 'width x height', dpaa.i18n ) })` }
							help={ __( 'Select the resolution of the generated image.', dpaa.i18n ) }
							value={ imageSize }
							options={ imageSizeOptions }
							onChange={ newVal => setImageSize( newVal ) }
						/>
					</FlexItem>
					{ dallEModel === 'dall-e-3' && (
						<>
							<FlexItem>
								<SelectControl
									__next40pxDefaultSize
									size='__unstable-large'
									label={ __( 'Image Quality', dpaa.i18n ) }
									help={ __( 'The quality of the image that will be generated. hd creates images with finer details and greater consistency across the image.', dpaa.i18n ) }
									value={ quality }
									options={ OPEN_AI_DALL_E_IMAGE_QUALITY }
									onChange={ newVal => setQuality( newVal ) }
								/>
							</FlexItem>
							<FlexItem>
								<SelectControl
									__next40pxDefaultSize
									size='__unstable-large'
									label={ __( 'Style', dpaa.i18n ) }
									help={ __( 'The style of the generated images. Vivid causes the model to lean towards generating hyper-real and dramatic images. Natural causes the model to produce more natural, less hyper-real looking images.', dpaa.i18n ) }
									value={ dallEStyle }
									options={ OPEN_AI_DALL_E_IMAGE_STYLES }
									onChange={ newVal => setDallEstyle( newVal ) }
								/>
							</FlexItem>
						</>
					) }
				</Flex>
			</PanelAdvancedSettings>
		</>
	)
}

export default OpenAISettingsForImageGeneration