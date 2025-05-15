/**
 * Internal dependencies
 */
import { PanelAdvancedSettings } from '@dpaa/components'
import { OptionsAreaStableDiffusion } from './options-area-stable-diffusion'
import { OptionsAreaGPTImage } from './options-area-dall-e'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	SelectControl,
	__experimentalVStack as VStack,
	__experimentalDivider as Divider,
} from '@wordpress/components'
import {
	useEffect,
	useState,
} from '@wordpress/element'
import { cog as cogIcon } from '@wordpress/icons'

export const OptionsArea = props => {
	const {
		label = __( 'Options', dpaa.i18n ),
		openai = undefined,
		openAIApiKey = undefined,
		stabilityAIApiKey = undefined,
		engine = undefined,
		onChangeEngine = undefined,
		gptImageModel = undefined,
		gptImageNumberImages = undefined,
		gptImageImageSize = undefined,
		gptImageQuality = undefined,
		gptImageStyle = undefined,
		stableDiffusionModel = undefined,
		stableDiffusionStyle = undefined,
		stableDiffusionWidth = undefined,
		stableDiffusionHeight = undefined,
		stableDiffusionDimensions = undefined,
		stableDiffusionSamples = undefined,
		stableDiffusionCfgScale = undefined,
		stableDiffusionSteps = undefined,
		onChangeGPTImageModel = undefined,
		onChangeGPTImageNumberImages = undefined,
		onChangeGPTImageImageSize = undefined,
		onChangeGPTImageQuality = undefined,
		onChangeGPTImageStyle = undefined,
		onChangeStableDiffusionModel = undefined,
		onChangeStableDiffusionStyle = undefined,
		onChangeStableDiffusionWidth = undefined,
		onChangeStableDiffusionHeight = undefined,
		onChangeStableDiffusionDimensions = undefined,
		onChangeStableDiffusionSamples = undefined,
		onChangeStableDiffusionCfgScale = undefined,
		onChangeStableDiffusionSteps = undefined,
	} = props

	// 画像生成エンジンのセレクトオプション
	const engineOptions = []
	if ( stabilityAIApiKey ) {
		engineOptions.push( { value: 'stable-diffusion', label: __( 'Stability AI', dpaa.i18n ) } )
	}
	if ( openAIApiKey || openai ) {
		engineOptions.push( { value: 'dall-e', label: __( 'OpenAI', dpaa.i18n ) } )
	}

	const [ settingForm, setSettingForm ] = useState( <></> )

	useEffect( () => {
		if ( engine === 'dall-e' && ( openAIApiKey || openai ) ) {
			setSettingForm(
				<OptionsAreaGPTImage
					model={ gptImageModel }
					onChangeModel={ onChangeGPTImageModel }
					numberImages={ gptImageNumberImages }
					onChangeNumberImages={ onChangeGPTImageNumberImages }
					imageSize={ gptImageImageSize }
					onChangeImageSize={ onChangeGPTImageImageSize }
					quality={ gptImageQuality }
					onChangeQuality={ onChangeGPTImageQuality }
					style={ gptImageStyle }
					onChangeStyle={ onChangeGPTImageStyle }
				/>
			)
		}
		else if ( engine === 'stable-diffusion' && stabilityAIApiKey )  {
			setSettingForm(
				<OptionsAreaStableDiffusion
					apiKey={ stabilityAIApiKey }
					model={ stableDiffusionModel }
					onChangeModel={ onChangeStableDiffusionModel }
					style={ stableDiffusionStyle }
					onChangeStyle={ onChangeStableDiffusionStyle }
					width={ stableDiffusionWidth }
					onChangeWidth={ onChangeStableDiffusionWidth }
					height={ stableDiffusionHeight }
					onChangeHeight={ onChangeStableDiffusionHeight }
					dimensions={ stableDiffusionDimensions }
					onChangeDimensions={ onChangeStableDiffusionDimensions }
					samples={ stableDiffusionSamples }
					onChangeSamples={ onChangeStableDiffusionSamples }
					cfgScale={ stableDiffusionCfgScale }
					onChangeCfgScale={ onChangeStableDiffusionCfgScale }
					steps={ stableDiffusionSteps }
					onChangeSteps={ onChangeStableDiffusionSteps }
				/>
			)
		}
	}, [ engine, gptImageModel, gptImageNumberImages, gptImageImageSize, gptImageQuality, gptImageStyle, stableDiffusionModel, stableDiffusionStyle, stableDiffusionWidth, stableDiffusionHeight, stableDiffusionDimensions, stableDiffusionSamples, stableDiffusionCfgScale, stableDiffusionSteps ] )

	return (
		<BaseControl
			__nextHasNoMarginBottom
			className='dpaa--settings__wrapper'
		>
			<PanelAdvancedSettings
				title={ label }
				className='dpaa-components-panel __option-settings'
				initialOpen={ false }
				hasToggle={ false }
				titleLeftIcon={ cogIcon }
			>
				<VStack spacing={ 4 }>
					{ onChangeEngine && (
						<VStack spacing={ 2 }>
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'AI Image Generator', dpaa.i18n ) }
								value={ engine }
								options={ engineOptions }
								onChange={ onChangeEngine }
							/>
							<Divider margin={ 3 } style={ { opacity: 0.5 } } />
						</VStack >
					) }
					{ settingForm }
				</VStack>
			</PanelAdvancedSettings>
		</BaseControl>
	)
}