/**
 * Internal dependencies
 */
import {
	OPEN_AI_DALL_E_IMAGE_QUALITY,
	OPEN_AI_DALL_E_IMAGE_STYLES,
	OPEN_AI_DALL_E_MODELS,
	OPEN_AI_DALL_E_2_IMAGE_SIZES,
	OPEN_AI_DALL_E_3_IMAGE_SIZES,
	DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES,
	DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE,
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

export const OptionsAreaDallE = memo( ( props ) => {
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
		if ( model === 'dall-e-3' ) {
			setImageSizeOptions( OPEN_AI_DALL_E_3_IMAGE_SIZES )
			if ( !OPEN_AI_DALL_E_3_IMAGE_SIZES.some( size => size.value === imageSize ) ) {
				onChangeImageSize( DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE )
			}
		} else {
			setImageSizeOptions( OPEN_AI_DALL_E_2_IMAGE_SIZES )
			if ( !OPEN_AI_DALL_E_2_IMAGE_SIZES.some( size => size.value === imageSize ) ) {
				onChangeImageSize( DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE )
			}
		}
	}, [ model ])

	return (
		<>
			{ onChangeModel && (
				<FlexItem>
					<CustomSelectControl
						__next40pxDefaultSize
						__experimentalShowSelectedHint
						size='__unstable-large'
						label={ __( 'Model', dpaa.i18n ) }
						value={ OPEN_AI_DALL_E_MODELS.find( option => option.key === model ) }
						options={ OPEN_AI_DALL_E_MODELS }
						onChange={ onChangeModel }
					/>
				</FlexItem>
			) }
			{ onChangeNumberImages && (
				<FlexItem>
					<RangeControl
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
				</FlexItem>
			) }
			{ onChangeImageSize && (
				<FlexItem>
					<SelectControl
						__next40pxDefaultSize
						size='__unstable-large'
						label={ `${ __( 'Dimensions' ) } (${ __( 'width x height', dpaa.i18n ) })` }
						value={ imageSize }
						options={ imageSizeOptions }
						onChange={ onChangeImageSize }
					/>
				</FlexItem>
			) }
			{ ( model === 'dall-e-3' && onChangeQuality && onChangeStyle ) && (
				<>
					<FlexItem>
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ __( 'Image Quality', dpaa.i18n ) }
							value={ quality }
							options={ OPEN_AI_DALL_E_IMAGE_QUALITY }
							onChange={ onChangeQuality }
						/>
					</FlexItem>
					<FlexItem>
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ __( 'Style', dpaa.i18n ) }
							value={ style }
							options={ OPEN_AI_DALL_E_IMAGE_STYLES }
							onChange={ onChangeStyle }
						/>
					</FlexItem>
				</>
			) }
		</>
	)
} )