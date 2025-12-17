/**
 * Internal dependencies
 */
import {
	OPEN_AI_GPT_MODELS_URL,
	OPEN_AI_PRICING_URL,
	OPEN_AI_DALL_E_3_IMAGE_QUALITY,
	OPEN_AI_DALL_E_IMAGE_STYLES,
	OPEN_AI_DALL_E_MODELS,
	OPEN_AI_DALL_E_2_IMAGE_SIZES,
	OPEN_AI_DALL_E_3_IMAGE_SIZES,
	OPEN_AI_GPT_IMAGE_1_IMAGE_SIZES,
	DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES,
	DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE,
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

export const OptionsAreaGPTImage = memo( ( props ) => {
	const {
		model,
		onChangeModel,
		numberImages,
		onChangeNumberImages,
		imageSize,
		onChangeImageSize,
		quality,
		onChangeQuality,
		style,
		onChangeStyle,
	} = props

	// 画像サイズオプション
	const [ imageSizeOptions, setImageSizeOptions ] = useState( [] )
	useEffect( () => {
		if ( model.includes( 'gpt-image-1' ) ) {
			setImageSizeOptions( OPEN_AI_GPT_IMAGE_1_IMAGE_SIZES )
			if ( !OPEN_AI_GPT_IMAGE_1_IMAGE_SIZES.some( size => size.value === imageSize ) ) {
				onChangeImageSize( DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE )
			}
		} else if ( model === 'dall-e-3' ) {
			setImageSizeOptions( OPEN_AI_DALL_E_3_IMAGE_SIZES )
			if ( !OPEN_AI_DALL_E_3_IMAGE_SIZES.some( size => size.value === imageSize ) ) {
				onChangeImageSize( DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE )
			}
		} else if ( model === 'dall-e-2' ) {
			setImageSizeOptions( OPEN_AI_DALL_E_2_IMAGE_SIZES )
			if ( !OPEN_AI_DALL_E_2_IMAGE_SIZES.some( size => size.value === imageSize ) ) {
				onChangeImageSize( DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE )
			}
		}
	}, [ model ])

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
						value={ OPEN_AI_DALL_E_MODELS.find( option => option.key === model ) }
						options={ OPEN_AI_DALL_E_MODELS }
						onChange={ onChangeModel }
					/>
					<Text size={ 12 } color='#666'>
						{ OPEN_AI_DALL_E_MODELS.find( option => option.key === model )?.__experimentalHint }
					</Text>
				</VStack>
			) }
			{ onChangeNumberImages && (
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Number of images', dpaa.i18n ) }
					value={ numberImages }
					allowReset={ true }
					initialPosition={ DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES }
					resetFallbackValue={ DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES }
					step={ 1 }
					onChange={ onChangeNumberImages }
					renderTooltipContent={ value => `${ value }` }
					min={ 1 }
					max={ model === 'dall-e-3' ? 1 : 10 }
				/>
			) }
			{ onChangeImageSize && (
				<SelectControl
					__next40pxDefaultSiz
					__nextHasNoMarginBottom
					label={ `${ __( 'Dimensions' ) } (${ __( 'width x height', dpaa.i18n ) })` }
					value={ imageSize }
					options={ imageSizeOptions }
					onChange={ onChangeImageSize }
				/>
			) }
			{ ( model === 'dall-e-3' && onChangeQuality && onChangeStyle ) && (
				<>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Image Quality', dpaa.i18n ) }
						value={ quality }
						options={ OPEN_AI_DALL_E_3_IMAGE_QUALITY }
						onChange={ onChangeQuality }
					/>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Style', dpaa.i18n ) }
						value={ style }
						options={ OPEN_AI_DALL_E_IMAGE_STYLES }
						onChange={ onChangeStyle }
					/>
				</>
			) }
		</VStack>
	)
} )