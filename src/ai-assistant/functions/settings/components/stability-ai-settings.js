/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	PopoverHelp,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	STABILITY_AI_API_KEY_URL,
	STABILITY_AI_MODEL_DOCUMENT_URL,
	STABILITY_AI_CALCULATE_COSTS_URL,
	STABILITY_AI_CREDITS_URL,
	STABILITY_AI_MODELS,
	STABILITY_AI_STYLES,
	STABILITY_AI_SDXL_1_0_IMAGE_SIZES,
	DEFAULT_STABILITY_AI_MODEL,
	DEFAULT_STABILITY_AI_STYLE,
	DEFAULT_STABILITY_AI_WIDTH,
	DEFAULT_STABILITY_AI_HEIGHT,
	DEFAULT_STABILITY_AI_CFG_SCALE,
	DEFAULT_STABILITY_AI_STEPS,
	DEFAULT_STABILITY_AI_SAMPLES
} from '@dpaa/ai-assistant/constants'
import {
	AICPU as  AICPUIcon,
	Finance as FinanceIcon,
	CoinC as CoinCIcon,
} from '@dpaa/icons'
import { getAvailableStabilityAIEngines } from '@dpaa/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	CustomSelectControl,
	ExternalLink,
	Flex,
	FlexItem,
	Icon,
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

export const StabilityAISettings = ( { pluginSettings } ) => {

	// 各パラメータの状態管理用
	const [ apiKey, setApiKey ] = useState( pluginSettings?.stabilityAISettings?.apiKey || '' )
	const [ model, setModel ] = useState( pluginSettings?.stabilityAISettings?.model || DEFAULT_STABILITY_AI_MODEL )
	const [ models, setModels ] = useState( STABILITY_AI_MODELS )
	const [ style, setStyle ] = useState( pluginSettings?.stabilityAISettings?.style || DEFAULT_STABILITY_AI_STYLE )
	const [ width, setWidth ] = useState( pluginSettings?.stabilityAISettings?.width || DEFAULT_STABILITY_AI_WIDTH )
	const [ height, setHeight ] = useState( pluginSettings?.stabilityAISettings?.height || DEFAULT_STABILITY_AI_HEIGHT )
	const [ dimensions, setDimensions ] = useState( pluginSettings?.stabilityAISettings?.dimensions || null )
	const [ steps, setSteps ] = useState( pluginSettings?.stabilityAISettings?.steps || DEFAULT_STABILITY_AI_STEPS )
	const [ samples, setSamples ] = useState( pluginSettings?.stabilityAISettings?.samples || DEFAULT_STABILITY_AI_SAMPLES )
	const [ cfgScale, setCfgScale ] = useState( pluginSettings?.stabilityAISettings?.cfgScale || DEFAULT_STABILITY_AI_CFG_SCALE )

	// グローバル設定の更新用(ストア更新前の状態管理用)
	const { setSetting } = useDispatch( STORE_NAME )
	const updateSetting = ( key, value ) => {
		setSetting( { 'stabilityAISettings': key }, value );
	};
	useEffect( () => updateSetting( 'apiKey', apiKey ), [ apiKey ] );
	useEffect( () => updateSetting( 'model', model ), [ model ] );
	useEffect( () => updateSetting( 'style', style ), [ style ] );
	useEffect( () => updateSetting( 'width', parseInt( width, 10 ) ), [ width ] );
	useEffect( () => updateSetting( 'height', parseInt( height, 10 ) ), [ height ] );
	useEffect( () => updateSetting( 'dimensions', dimensions ), [ dimensions ] );
	useEffect( () => updateSetting( 'steps', parseInt( steps, 10 ) ), [ steps ] );
	useEffect( () => updateSetting( 'samples', parseInt( samples, 10 ) ), [ samples ] );
	useEffect( () => updateSetting( 'cfgScale', parseFloat( cfgScale ) ), [ cfgScale ] );

	const latestModels = []
	const [ engines, setEngines ] = useState()
	useEffect( () => {
		getAvailableStabilityAIEngines( { apiKey: apiKey } )
		.then( response => {
			if ( response && Array.isArray( response ) ) {
				setEngines( response )
			}
		} )
		.catch( error => {
			console.error( error )
		} )
	}, [ apiKey ] )

	useEffect( () => {
		if ( engines && Array.isArray( engines ) ) {
			engines.forEach( ( engine, i ) => {
				latestModels.push(
					{
						name: engine?.name,
						key: engine?.id,
						__experimentalHint: engine?.description,
					}
				)
			} )

			if ( Array.isArray( latestModels ) && latestModels.length > 0 ) {
				setModels( latestModels )
			}
		}
 	}, [ engines ] )

	const [ showKey, setShowKey ] = useState( false );

	return (
		<PanelAdvancedSettings
			title={ `${ sprintf( __( '%s Settings', dpaa.i18n ), 'Stability AI' ) } (${ __( 'For image', dpaa.i18n ) })` }
			className='dpaa-components-panel __option-settings'
			initialOpen={ false }
			hasToggle={ false }
			titleLeftIcon={ AICPUIcon }
		>
			<VStack spacing={ 3 }>
				<VStack spacing={ 2 }>
					<Flex direction='row' gap={ 1 } justify='space-between' align='end'>
						<FlexItem style={ { flexBasis: !apiKey ? '100%' : 'calc(100% - 34px)' } }>
							<InputControl
								__next40pxDefaultSize
								size='__unstable-large'
								type={ showKey ? 'text' : 'password' }
								label={ __( 'API Key', dpaa.i18n ) }
								value={ apiKey || '' }
								onChange={ newVal => setApiKey( newVal ) }
								placeholder='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'
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
					{ apiKey ?
						<Button
							variant="secondary"
							size="small"
							icon={ <Icon icon={ CoinCIcon } style={{width: '20px', height: '20px'}} /> }
							iconSize={ 20 }
							showTooltip={ true }
							href={ STABILITY_AI_CREDITS_URL }
							target="_blank"
							label={ __('Check current credits', dpaa.i18n) }
							style={ { fontSize: '11px' } }
						/>
						: (
						<Notice
							className="dpaa-ai-assistant--settings__notice-component"
							status="info"
							isDismissible={ false }
						>
							<ExternalLink
								href={ STABILITY_AI_API_KEY_URL }
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
								help={ __( 'Select the Stability AI model (engine) to use to generate the image.', dpaa.i18n ) }
							/>
							<Button
								variant="link"
								size="small"
								href={ STABILITY_AI_CALCULATE_COSTS_URL }
								target="_blank"
								text={ __('Calculate Costs', dpaa.i18n) }
								style={ { fontSize: '11px' } }
							/>
							<Button
								variant="link"
								size="small"
								href={ STABILITY_AI_MODEL_DOCUMENT_URL }
								target="_blank"
								text={ __('Documentation', dpaa.i18n) }
								style={ { fontSize: '11px' } }
							/>
						</> }
						value={ models.find( option => option.key === model ) }
						options={ models }
						onChange={ newSelect => setModel( newSelect.selectedItem.key ) }
					/>
					<Text size={ 12 } style={ { color: '#666' } }>
						{ models.find( option => option.key === model )?.__experimentalHint }
					</Text>
				</VStack>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ <>
						{__( 'Style', dpaa.i18n ) }
						<PopoverHelp
							buttonText=''
							buttonClass='__right-inline-position'
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass=''
							popoverNoArrow={ false }
							help={ __( 'Select the style of the generated image.', dpaa.i18n ) }
						/>
					</> }
					value={ style }
					options={ STABILITY_AI_STYLES }
					onChange={ newVal => setStyle( newVal ) }
				/>
				{ ( model === 'stable-diffusion-xl-1024-v1-0' || model === 'stable-diffusion-xl-1024-v0-9' ) && (
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ `${ __( 'Dimensions' ) } (${ __( 'width x height', dpaa.i18n ) })` }
						value={ dimensions }
						options={ STABILITY_AI_SDXL_1_0_IMAGE_SIZES }
						onChange={ newVal => setDimensions( newVal ) }
					/>
				) }
				{ ( model !== 'stable-diffusion-xl-1024-v1-0' && model !== 'stable-diffusion-xl-1024-v0-9' ) && (
					<>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ <>
								{__( 'Width' ) }
								<PopoverHelp
									buttonText=''
									buttonClass='__right-inline-position'
									buttonSize='small'
									popoverPosition='bottom left'
									popoverVariant='toolbar'
									popoverOffset={ 5 }
									popoverClass=''
									popoverNoArrow={ false }
									help={ __( 'Set the generated image width in pixel value.', dpaa.i18n ) }
								/>
							</> }
							value={ width }
							allowReset={ true }
							initialPosition={ DEFAULT_STABILITY_AI_WIDTH }
							resetFallbackValue={ DEFAULT_STABILITY_AI_WIDTH }
							onChange={ newVal => setWidth( newVal ) }
							renderTooltipContent={ value => `${ value }px` }
							min={ 320 }
							max={ model === 'stable-diffusion-xl-beta-v2-2-2' ? 896 : 1536 }
							step={ 64 }
							placeholder='512'
						/>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={<>
								{__( 'Height' ) }
								<PopoverHelp
									buttonText=''
									buttonClass='__right-inline-position'
									buttonSize='small'
									popoverPosition='bottom left'
									popoverVariant='toolbar'
									popoverOffset={ 5 }
									popoverClass=''
									popoverNoArrow={ false }
									help={ __( 'Set the generated image height in pixel value.', dpaa.i18n ) }
								/>
							</> }
							value={ height }
							allowReset={ true }
							initialPosition={ DEFAULT_STABILITY_AI_HEIGHT }
							resetFallbackValue={ DEFAULT_STABILITY_AI_HEIGHT }
							onChange={ newVal => setHeight( newVal ) }
							renderTooltipContent={ value => `${ value }px` }
							min={ 320 }
							max={ model === 'stable-diffusion-xl-beta-v2-2-2' ? 896 : 1536 }
							step={ 64 }
							placeholder='512'
						/>
					</>
				) }
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ <>
						{__( 'Number of images', dpaa.i18n ) }
						<PopoverHelp
							buttonText=''
							buttonClass='__right-inline-position'
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass=''
							popoverNoArrow={ false }
							help={ __( 'Number of images to generate. Allows for batch image generations.', dpaa.i18n ) }
						/>
					</> }
					value={ samples }
					allowReset={ true }
					initialPosition={ DEFAULT_STABILITY_AI_SAMPLES }
					resetFallbackValue={ DEFAULT_STABILITY_AI_SAMPLES }
					onChange={ newVal => setSamples( newVal ) }
					renderTooltipContent={ value => `${ value }` }
					min={ 1 }
					max={ 10 }
					step={ 1 }
					placeholder='1'
				/>
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ <>
						{__( 'CFG Scale', dpaa.i18n ) }
						<PopoverHelp
							buttonText=''
							buttonClass='__right-inline-position'
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass=''
							popoverNoArrow={ false }
							help={ __( "A number that specifies how faithful the image will be to the prompt (input text). Default is 7.<br />Higher CFG Scale numbers produce images that are more faithful to the prompt.<br />Set this value higher if you want to generate an image that is faithful to the prompt, or lower this value if you care about image quality.", dpaa.i18n ) }
						/>
					</> }
					value={ cfgScale }
					allowReset={ true }
					initialPosition={ DEFAULT_STABILITY_AI_CFG_SCALE }
					resetFallbackValue={ DEFAULT_STABILITY_AI_CFG_SCALE }
					onChange={ newVal => setCfgScale( newVal ) }
					renderTooltipContent={ value => `${ value }` }
					min={ 1.0 }
					max={ 7.0 }
					step={ 0.1 }
					placeholder='7.0'
				/>
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ <>
						{__( 'Sampling Steps', dpaa.i18n ) }
						<PopoverHelp
							buttonText=''
							buttonClass='__right-inline-position'
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass=''
							popoverNoArrow={ false }
							help={ __( "The number of steps is the number of times the generated image is denoised. Default is 30.<br />Note that a larger number of sampling steps will produce a more detailed image, but will take more time and cost more to produce.", dpaa.i18n ) }
						/>
					</> }
					value={ steps }
					allowReset={ true }
					initialPosition={ DEFAULT_STABILITY_AI_STEPS }
					resetFallbackValue={ DEFAULT_STABILITY_AI_STEPS }
					onChange={ newVal => setSteps ( newVal ) }
					renderTooltipContent={ value => `${ value }` }
					min={ 10 }
					max={ 150 }
					step={ 1 }
					placeholder='30'
				/>
			</VStack>
		</PanelAdvancedSettings>
	)
}

export default StabilityAISettings