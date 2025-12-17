/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	PopoverHelp,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	OPEN_AI_GPT_MODELS,
	OPEN_AI_API_KEY_URL,
	OPEN_AI_USAGE_URL,
	OPEN_AI_GPT_MODELS_URL,
	OPEN_AI_PRICING_URL,
	OPEN_AI_DALL_E_3_IMAGE_QUALITY,
	OPEN_AI_GPT_IMAGE_1_IMAGE_QUALITY,
	OPEN_AI_DALL_E_IMAGE_STYLES,
	OPEN_AI_DALL_E_2_IMAGE_SIZES,
	OPEN_AI_DALL_E_3_IMAGE_SIZES,
	OPEN_AI_GPT_IMAGE_1_IMAGE_SIZES,
	OPEN_AI_DALL_E_MODELS,
	DEFAULT_OPEN_AI_DALL_E_MODEL,
	DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES,
	DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE,
	DEFAULT_OPEN_AI_DALL_E_QUALITY,
	DEFAULT_OPEN_AI_DALL_E_STYLE,
} from '@dpaa/ai-assistant/constants'
import {
	AICPU as AICPUIcon,
	Finance as FinanceIcon
} from '@dpaa/icons'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Button,
	CustomSelectControl,
	ExternalLink,
	Icon,
	Flex,
	FlexItem,
	Notice,
	RangeControl,
	SelectControl,
	__experimentalInputControl as InputControl,
	__experimentalText as Text,
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
	seen as seenIcon,
} from '@wordpress/icons'

export const OpenAISettingsForImageGeneration = ( { pluginSettings } ) => {

	// 各パラメータの状態管理用
	const [ apiKey, setApiKey ] = useState( pluginSettings?.openAISettings?.apiKey || '' )
	const [ imageGenerationSettings, setImageGenerationSettings ] = useState( pluginSettings?.openAISettings?.imageGeneration || null )
	const [ gptImageModel, setGPTImageModel ] = useState( pluginSettings?.openAISettings?.imageGeneration?.gptImageModel || DEFAULT_OPEN_AI_DALL_E_MODEL )
	const [ numberImages, setNumberImages ] = useState( pluginSettings?.openAISettings?.imageGeneration?.numberImages || DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES )
	const [ imageSize, setImageSize ] = useState( pluginSettings?.openAISettings?.imageGeneration?.imageSize || DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE )
	const [ quality, setQuality ] = useState( pluginSettings?.openAISettings?.imageGeneration?.quality || DEFAULT_OPEN_AI_DALL_E_QUALITY )
	const [ gptImageStyle, setGPTImagestyle ] = useState( pluginSettings?.openAISettings?.imageGeneration?.gptImageStyle || DEFAULT_OPEN_AI_DALL_E_STYLE )

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
			gptImageModel: gptImageModel,
			numberImages: parseInt( numberImages, 10 ),
			imageSize: imageSize,
			quality: quality,
			gptImageStyle: gptImageStyle,
		} )
	}, [ gptImageModel, numberImages, imageSize, quality, gptImageStyle ] )

	// 画像サイズオプション
	const [ imageSizeOptions, setImageSizeOptions ] = useState( [] )
	useEffect( () => {
		if ( gptImageModel.includes( 'gpt-image-1' ) ) {
			setImageSizeOptions( OPEN_AI_GPT_IMAGE_1_IMAGE_SIZES )
			if ( imageSize === '256x256' || imageSize === '512x512' ) {
				setImageSize( '1024x1024' )
			}
		} else if ( gptImageModel === 'dall-e-3' ) {
			setImageSizeOptions( OPEN_AI_DALL_E_3_IMAGE_SIZES )
			if ( imageSize === '256x256' || imageSize === '512x512' ) {
				setImageSize( '1024x1024' )
			}
		} else if ( gptImageModel === 'dall-e-2' ) {
			setImageSizeOptions( OPEN_AI_DALL_E_2_IMAGE_SIZES )
			if ( imageSize === '1792x1024' || imageSize === '1024x1792' ) {
				setImageSize( '1024x1024' )
			}
		}

	}, [ gptImageModel ])

	// APIキー表示有無の状態管理
	const [ showKey, setShowKey ] = useState( false );

	return (
		<>
			<PanelAdvancedSettings
				title={ `${ sprintf( __( '%s Settings', dpaa.i18n ), 'OpenAI' ) } (${ __( 'For image', dpaa.i18n ) })` }
				className='dpaa-components-panel __option-settings'
				titleLeftIcon={ <Icon icon={ AICPUIcon } /> }
				initialOpen={ false }
				hasToggle={ false }
			>
				<VStack
					spacing={ 3 }
					className='dpaa-ai-assistant--settings__components-flex __open-ai'
				>
					<VStack spacing={ 1 }>
						<Flex direction='row' gap={ 1 } justify='space-between' align='end'>
							<FlexItem style={ { flexBasis: !apiKey ? '100%' : 'calc(100% - 40px)' } }>
								<InputControl
									__next40pxDefaultSize
									size='__unstable-large'
									type={ showKey ? 'text' : 'password' }
									label={ __( 'API Key', dpaa.i18n ) }
									value={ apiKey }
									onChange={ newVal => setApiKey( newVal ) }
									placeholder='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'
									/>
							</FlexItem>
							{ apiKey && (
								<FlexItem style={ { flexBasis: '36px' } }>
									<Button
										size='default'
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
						{ apiKey ?
							<Button
								variant="secondary"
								size="small"
								icon={ <Icon icon={ FinanceIcon } style={{width: '20px', height: '20px'}} /> }
								iconSize={ 20 }
								showTooltip={ true }
								href={ OPEN_AI_USAGE_URL }
								target="_blank"
								label={ __('Usage', dpaa.i18n) }
								style={ { fontSize: '11px', width: 'fit-content' } }
							/>
							: (
							<Notice
								className="dpaa-ai-assistant--settings__notice-component"
								status="warning"
								isDismissible={ false }
							>
								<ExternalLink
									href={ OPEN_AI_API_KEY_URL }
									type="link"
									rel="next"
								>
									{ __( 'Get the API key.', dpaa.i18n ) }
								</ExternalLink>
							</Notice>
						) }
					</VStack>
					<VStack spacing={ 2 }>
						<CustomSelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ <>
								{__( 'Model', dpaa.i18n ) }
								<PopoverHelp
									buttonText=''
									buttonClass='__right-inline-position'
									buttonSize='small'
									popoverPosition='bottom left'
									popoverVariant='toolbar'
									popoverOffset={ 5 }
									popoverClass=''
									popoverNoArrow={ false }
									help={ __( 'Select the OpenAI model to generate images.', dpaa.i18n ) }
								/>
								<Button
									variant="link"
									size="small"
									href={ OPEN_AI_GPT_MODELS_URL }
									target="_blank"
									text={ __('Models', dpaa.i18n) }
									style={ { fontSize: '11px' } }
								/>
								<Button
									variant="link"
									size="small"
									href={ OPEN_AI_PRICING_URL }
									target="_blank"
									text={ __('Pricing', dpaa.i18n) }
									style={ { fontSize: '11px' } }
								/>
							</> }
							value={ OPEN_AI_DALL_E_MODELS.find( option => option.key === gptImageModel ) }
							options={ OPEN_AI_DALL_E_MODELS }
							onChange={ newSelect => {
								setGPTImageModel( newSelect.selectedItem.key )
								if ( newSelect.selectedItem.key === 'dall-e-3' ) {
									setNumberImages( 1 )
								}
							} }
						/>
						<Text size={ 12 } style={ { color: '#666' } }>
							{ OPEN_AI_DALL_E_MODELS.find( option => option.key === gptImageModel )?.__experimentalHint }
						</Text>
					</VStack>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Number of images', dpaa.i18n ) }
						help={ __( 'The number of images to generate. Must be between 1 and 10. For DALL·E 3, only one image is supported.', dpaa.i18n ) }
						value={ numberImages }
						allowReset={ true }
						initialPosition={ DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES }
						resetFallbackValue={ DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES }
						step={ 1 }
						onChange={ newVal => setNumberImages( gptImageModel === 'dall-e-3' ? 1 : newVal ) }
						renderTooltipContent={ value => `${ value }` }
						min={ 1 }
						max={ gptImageModel === 'dall-e-3' ? 1 : 10 }
					/>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ `${ __( 'Dimensions' ) } (${ __( 'width x height', dpaa.i18n ) })` }
						help={ __( 'Select the resolution of the generated image.', dpaa.i18n ) }
						value={ imageSize }
						options={ imageSizeOptions }
						onChange={ newVal => setImageSize( newVal ) }
					/>
					{ gptImageModel !== 'dall-e-2' && (
						<>
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Image Quality', dpaa.i18n ) }
								help={ __( 'The quality of the image that will be generated. hd creates images with finer details and greater consistency across the image.', dpaa.i18n ) }
								value={ quality }
								options={ gptImageModel === 'dall-e-3' ? OPEN_AI_DALL_E_3_IMAGE_QUALITY : OPEN_AI_GPT_IMAGE_1_IMAGE_QUALITY }
								onChange={ newVal => setQuality( newVal ) }
							/>
							{ gptImageModel === 'dall-e-3' && (
								<SelectControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Style', dpaa.i18n ) }
									help={ __( 'The style of the generated images. Vivid causes the model to lean towards generating hyper-real and dramatic images. Natural causes the model to produce more natural, less hyper-real looking images.', dpaa.i18n ) }
									value={ gptImageStyle }
									options={ OPEN_AI_DALL_E_IMAGE_STYLES }
									onChange={ newVal => setGPTImagestyle( newVal ) }
								/>
							) }
						</>
					) }
				</VStack>
			</PanelAdvancedSettings>
		</>
	)
}

export default OpenAISettingsForImageGeneration