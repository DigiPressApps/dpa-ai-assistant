/**
 * Internal dependencies
 */
import { getAvailableStabilityAIEngines } from '@dpaa/util'
import {
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
	CustomSelectControl,
	FlexItem,
	RangeControl,
	SelectControl,
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
		<>
			{ onChangeModel && (
				<FlexItem>
					<CustomSelectControl
						__next40pxDefaultSize
						__experimentalShowSelectedHint
						size='__unstable-large'
						label={ __( 'Model', dpaa.i18n ) }
						value={ models.find( option => option.key === model ) }
						options={ models }
						onChange={ onChangeModel }
					/>
				</FlexItem>
			) }
			{ onChangeStyle && (
				<FlexItem>
					<SelectControl
						__next40pxDefaultSize
						size='__unstable-large'
						label={ __( 'Style', dpaa.i18n ) }
						value={ style }
						options={ STABILITY_AI_STYLES }
						onChange={ onChangeStyle }
					/>
				</FlexItem>
			) }
			{ ( model === 'stable-diffusion-xl-1024-v1-0' || model === 'stable-diffusion-xl-1024-v0-9' ) && (
				<FlexItem>
					<SelectControl
						__next40pxDefaultSize
						size='__unstable-large'
						label={ `${ __( 'Dimensions' ) } (${ __( 'width x height', dpaa.i18n ) })` }
						value={ dimensions }
						options={ STABILITY_AI_SDXL_1_0_IMAGE_SIZES }
						onChange={ onChangeDimensions }
					/>
				</FlexItem>
			) }
			{ ( ( model !== 'stable-diffusion-xl-1024-v1-0' && model !== 'stable-diffusion-xl-1024-v0-9' ) && onChangeHeight ) && (
				<FlexItem>
					<RangeControl
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
				</FlexItem>
			) }
			{ ( ( model !== 'stable-diffusion-xl-1024-v1-0' && model !== 'stable-diffusion-xl-1024-v0-9' ) && onChangeWidth ) && (
				<FlexItem>
					<RangeControl
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
				</FlexItem>
			) }
			{ onChangeSamples && (
				<FlexItem>
					<RangeControl
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
				</FlexItem>
			) }
			{ onChangeCfgScale && (
				<FlexItem>
					<RangeControl
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
				</FlexItem>
			) }
			{ onChangeSteps && (
				<FlexItem>
					<RangeControl
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
				</FlexItem>
			) }
		</>
	)
} )