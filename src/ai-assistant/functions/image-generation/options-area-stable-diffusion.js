/**
 * Internal dependencies
 */
import { getAvailableStabilityAIEngines } from '@dpaa/util'
import {
	STABILITY_AI_CALCULATE_COSTS_URL,
	STABILITY_AI_MODEL_DOCUMENT_URL,
	STABILITY_AI_MODELS,
	STABILITY_AI_STYLES,
	STABILITY_AI_SDXL_1_0_IMAGE_SIZES,
	DEFAULT_STABILITY_AI_WIDTH,
	DEFAULT_STABILITY_AI_HEIGHT,
	DEFAULT_STABILITY_AI_CFG_SCALE,
	DEFAULT_STABILITY_AI_STEPS,
	DEFAULT_STABILITY_AI_SAMPLES,
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	CustomSelectControl,
	RangeControl,
	SelectControl,
	__experimentalVStack as VStack,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo,
	useEffect,
	useState,
} from '@wordpress/element'

export const OptionsAreaStableDiffusion = memo( ( props ) => {
	const {
		apiKey,
		model,
		onChangeModel,
		style,
		onChangeStyle,
		width,
		onChangeWidth,
		height,
		onChangeHeight,
		dimensions,
		onChangeDimensions,
		samples,
		onChangeSamples,
		cfgScale,
		onChangeCfgScale,
		steps,
		onChangeSteps,
	} = props

	const [ models, setModels ] = useState( STABILITY_AI_MODELS )

	const latestModels = []
	const [ engines, setEngines ] = useState()
	useEffect( () => {
		if ( apiKey ) {
			getAvailableStabilityAIEngines( { apiKey: apiKey } )
			.then( response => {
				if ( response && Array.isArray( response ) ) {
					setEngines( response )
				}
			} )
			.catch( error => {
				console.error( error )
			} )
		}
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

	return (
		<VStack spacing={ 4 }>
			{ onChangeModel && (
				<VStack spacing={ 2 }>
					<CustomSelectControl
						__next40pxDefaultSize
						size='__unstable-large'
						label={ <>
							{__( 'Model', dpaa.i18n ) }
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
						onChange={ onChangeModel }
					/>
					<Text size={ 12 } color='#666'>
						{ models.find( option => option.key === model )?.__experimentalHint }
					</Text>
				</VStack>
			) }
			{ onChangeStyle && (
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Style', dpaa.i18n ) }
					value={ style }
					options={ STABILITY_AI_STYLES }
					onChange={ onChangeStyle }
				/>
			) }
			{ ( model === 'stable-diffusion-xl-1024-v1-0' || model === 'stable-diffusion-xl-1024-v0-9' ) && (
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ `${ __( 'Dimensions' ) } (${ __( 'width x height', dpaa.i18n ) })` }
					value={ dimensions }
					options={ STABILITY_AI_SDXL_1_0_IMAGE_SIZES }
					onChange={ onChangeDimensions }
				/>
			) }
			{ ( ( model !== 'stable-diffusion-xl-1024-v1-0' && model !== 'stable-diffusion-xl-1024-v0-9' ) && onChangeHeight ) && (
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Height' ) }
					value={ height }
					allowReset={ true }
					initialPosition={ DEFAULT_STABILITY_AI_HEIGHT }
					resetFallbackValue={ DEFAULT_STABILITY_AI_HEIGHT }
					onChange={ onChangeHeight }
					renderTooltipContent={ value => `${ value }px` }
					min={ 320 }
					max={ model === 'stable-diffusion-xl-beta-v2-2-2' ? 896 : 1536 }
					step={ 64 }
					placeholder='512'
				/>
			) }
			{ ( ( model !== 'stable-diffusion-xl-1024-v1-0' && model !== 'stable-diffusion-xl-1024-v0-9' ) && onChangeWidth ) && (
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Width' ) }
					value={ width }
					allowReset={ true }
					initialPosition={ DEFAULT_STABILITY_AI_WIDTH }
					resetFallbackValue={ DEFAULT_STABILITY_AI_WIDTH }
					onChange={ onChangeWidth }
					renderTooltipContent={ value => `${ value }px` }
					min={ 320 }
					max={ model === 'stable-diffusion-xl-beta-v2-2-2' ? 896 : 1536 }
					step={ 64 }
					placeholder='512'
				/>
			) }
			{ onChangeSamples && (
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Number of images', dpaa.i18n ) }
					value={ samples }
					allowReset={ true }
					initialPosition={ DEFAULT_STABILITY_AI_SAMPLES }
					resetFallbackValue={ DEFAULT_STABILITY_AI_SAMPLES }
					onChange={ onChangeSamples }
					renderTooltipContent={ value => `${ value }` }
					min={ 1 }
					max={ 10 }
					step={ 1 }
					placeholder='1'
				/>
			) }
			{ onChangeCfgScale && (
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'CFG Scale', dpaa.i18n ) }
					value={ cfgScale }
					allowReset={ true }
					initialPosition={ DEFAULT_STABILITY_AI_CFG_SCALE }
					resetFallbackValue={ DEFAULT_STABILITY_AI_CFG_SCALE }
					onChange={ onChangeCfgScale }
					renderTooltipContent={ value => `${ value }` }
					min={ 1.0 }
					max={ 7.0 }
					step={ 0.1 }
					placeholder='7.0'
				/>
			) }
			{ onChangeSteps && (
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Sampling Steps', dpaa.i18n ) }
					value={ steps }
					allowReset={ true }
					initialPosition={ DEFAULT_STABILITY_AI_STEPS }
					resetFallbackValue={ DEFAULT_STABILITY_AI_STEPS }
					onChange={ onChangeSteps }
					renderTooltipContent={ value => `${ value }` }
					min={ 10 }
					max={ 150 }
					step={ 1 }
					placeholder='30'
				/>
			) }
		</VStack>
	)
} )