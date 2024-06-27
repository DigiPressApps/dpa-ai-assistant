/**
 * Internal dependencies
 */
import { PanelAdvancedSettings } from '@dpaa/components'
import { OptionsAreaStableDiffusion } from './options-area-stable-diffusion'
import { OptionsAreaDallE } from './options-area-dall-e'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	Flex,
	FlexItem,
	SelectControl,
} from '@wordpress/components'
import {
	useEffect,
	useState,
} from '@wordpress/element'
import { cog as cogIcon } from '@wordpress/icons'

export const OptionsArea = props => {
	const {
		label,
		openai,
		openAIApiKey,
		stabilityAIApiKey,
		engine,
		onChangeEngine,
		dallEModel,
		dallENumberImages,
		dallEImageSize,
		dallEQuality,
		dallEStyle,
		stableDiffusionModel,
		stableDiffusionStyle,
		stableDiffusionWidth,
		stableDiffusionHeight,
		stableDiffusionDimensions,
		stableDiffusionSamples,
		stableDiffusionCfgScale,
		stableDiffusionSteps,
		onChangeDallEModel,
		onChangeDallENumberImages,
		onChangeDallEImageSize,
		onChangeDallEQuality,
		onChangeDallEStyle,
		onChangeStableDiffusionModel,
		onChangeStableDiffusionStyle,
		onChangeStableDiffusionWidth,
		onChangeStableDiffusionHeight,
		onChangeStableDiffusionDimensions,
		onChangeStableDiffusionSamples,
		onChangeStableDiffusionCfgScale,
		onChangeStableDiffusionSteps,
	} = props

	// 画像生成エンジンのセレクトオプション
	const engineOptions = []
	if ( stabilityAIApiKey ) {
		engineOptions.push( { value: 'stable-diffusion', label: __( 'Stable Diffusion (Stability AI)', dpaa.i18n ) } )
	}
	if ( openAIApiKey || openai ) {
		engineOptions.push( { value: 'dall-e', label: __( 'DALL·E (OpenAI)', dpaa.i18n ) } )
	}

	const [ settingForm, setSettingForm ] = useState( <></> )

	useEffect( () => {
		if ( engine === 'dall-e' && ( openAIApiKey || openai ) ) {
			setSettingForm(
				<OptionsAreaDallE
					model={ dallEModel }
					onChangeModel={ onChangeDallEModel }
					numberImages={ dallENumberImages }
					onChangeNumberImages={ onChangeDallENumberImages }
					imageSize={ dallEImageSize }
					onChangeImageSize={ onChangeDallEImageSize }
					quality={ dallEQuality }
					onChangeQuality={ onChangeDallEQuality }
					style={ dallEStyle }
					onChangeStyle={ onChangeDallEStyle }
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
	}, [ engine, dallEModel, dallENumberImages, dallEImageSize, dallEQuality, dallEStyle, stableDiffusionModel, stableDiffusionStyle, stableDiffusionWidth, stableDiffusionHeight, stableDiffusionDimensions, stableDiffusionSamples, stableDiffusionCfgScale, stableDiffusionSteps ] )

	return (
		<BaseControl
			className='dpaa--settings__wrapper'
		>
			<PanelAdvancedSettings
				title={ label }
				className='dpaa-components-panel __option-settings'
				initialOpen={ false }
				hasToggle={ false }
				titleLeftIcon={ cogIcon }
			>
				<Flex
					direction='column'
					gap={ 2 }
					justify='flex-start'
				>
					{ onChangeEngine && (
						<FlexItem>
							<SelectControl
								__next40pxDefaultSize
								size='__unstable-large'
								label={ __( 'AI Image Generator', dpaa.i18n ) }
								value={ engine }
								options={ engineOptions }
								onChange={ onChangeEngine }
							/>
						</FlexItem>
					) }
					{ settingForm }
				</Flex>
			</PanelAdvancedSettings>
		</BaseControl>
	)
}

OptionsArea.defaultProps = {
	label: __( 'Options', dpaa.i18n ),
	userCanManageSettings: false,
	openai: undefined,
	openAIApiKey: undefined,
	stabilityAIApiKey: undefined,
	engine: undefined,
	onChangeEngine: undefined,
	dallEModel: undefined,
	dallENumberImages: undefined,
	dallEImageSize: undefined,
	dallEQuality: undefined,
	dallEStyle: undefined,
	stableDiffusionModel: undefined,
	stableDiffusionStyle: undefined,
	stableDiffusionWidth: undefined,
	stableDiffusionHeight: undefined,
	stableDiffusionSamples: undefined,
	stableDiffusionCfgScale: undefined,
	stableDiffusionSteps: undefined,
	onChangeDallEModel: undefined,
	onChangeDallENumberImages: undefined,
	onChangeDallEImageSize: undefined,
	onChangeDallEQuality: undefined,
	onChangeDallEStyle: undefined,
	onChangeStableDiffusionModel: undefined,
	onChangeStableDiffusionStyle: undefined,
	onChangeStableDiffusionWidth: undefined,
	onChangeStableDiffusionHeight: undefined,
	onChangeStableDiffusionSamples: undefined,
	onChangeStableDiffusionCfgScale: undefined,
	onChangeStableDiffusionSteps: undefined,
}