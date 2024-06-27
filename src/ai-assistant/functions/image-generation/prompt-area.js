/**
 * Internal dependencies
 */
import { OptionsArea } from './options-area'
import {
	OPEN_AI_API_KEY_URL,
	STABILITY_AI_API_KEY_URL,
} from '@dpaa/ai-assistant/constants'
import { UpgradeModal } from '@dpaa/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	ExternalLink,
	Flex,
	FlexItem,
	Notice,
	Spinner,
	TextareaControl,
} from '@wordpress/components'
import {
	memo,
	useState,
} from '@wordpress/element'
import {
	image as imageIcon,
	shuffle as shuffleIcon,
} from '@wordpress/icons'

export const PromptArea = memo( ( props ) => {
	const {
		engine,
		stabilityAIapiKey,
		openAIApiKey,
		isLoading,
		imagePrompt,
		previousImagePromptRef,
		errorMessage,
		onChangeEngine,
		onChangeImagePrompt,
		onClickMagicPrompt,
		onClickClear,
		onClickReGenerate,
		onClickGenerate,

		dallEModel,
		onChangeDallEModel,
		dallENumberImages,
		onChangeDallENumberImages,
		dallEImageSize,
		onChangeDallEImageSize,
		dallEQuality,
		onChangeDallEQuality,
		dallEStyle,
		onChangeDallEStyle,

		stableDiffusionModel,
		onChangeStableDiffusionModel,
		stableDiffusionStyle,
		onChangeStableDiffusionStyle,
		stableDiffusionWidth,
		onChangeStableDiffusionWidth,
		stableDiffusionHeight,
		onChangeStableDiffusionHeight,
		stableDiffusionDimensions,
		onChangeStableDiffusionDimensions,
		stableDiffusionSamples,
		onChangeStableDiffusionSamples,
		stableDiffusionCfgScale,
		onChangeStableDiffusionCfgScale,
		stableDiffusionSteps,
		onChangeStableDiffusionSteps,
	} = props

	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false );

	return (
		<>
			<Flex
				className='dpaa-ai-assistant--generator__input-form'
				direction='row'
				align='flex-start'
				gap={ 3 }
			>
				<FlexItem
					className='dpaa-ai-assistant--generator__prompt__wrapper'
					isBlock={ true }
					style={ {
						flexBasis: 'calc( 65% - 6px )'
					} }
				>
					<Flex
						className='dpaa-box-shadow-element'
						direction='column'
						gap={ 1 }
					>
						<FlexItem>
							<TextareaControl
								__next40pxDefaultSize
								className='dpaa-ai-assistant--generator__prompt__textarea'
								value={ imagePrompt }
								onChange={ onChangeImagePrompt }
								rows={ 2 }
								placeholder={ __( 'The beautiful Hawaiian ocean, mountains, and blue skies of Oahu, where surfers are splashing and enjoying the surf.', dpaa.i18n ) }
								disabled={ isLoading || ( engine === 'stable-diffusion' && !stabilityAIapiKey ) || ( engine === 'dall-e' && !openAIApiKey ) }
							/>
						</FlexItem>
						<FlexItem>
							<Flex
								gap={ 1 }
								direction='row'
								justify='flex-end'
							>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Clear all logs', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon='trash'
										iconSize={ 18 }
										variant='primary'
										isDestructive={ true }
										disabled={ isLoading }
										onClick={ onClickClear }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Magic prompt!', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon={ shuffleIcon }
										iconSize={ 18 }
										variant='secondary'
										disabled={ isLoading || ( engine === 'stable-diffusion' && !stabilityAIapiKey ) || !openAIApiKey }
										onClick={ onClickMagicPrompt }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Re-generate images', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon='controls-repeat'
										iconSize={ 18 }
										variant='secondary'
										disabled={ isLoading || !stabilityAIapiKey || !previousImagePromptRef.current }
										onClick={ onClickReGenerate }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Speak a description of the image', dpaa.i18n ) }
										icon='microphone'
										iconSize={ 20 }
										variant='primary'
										isDestructive={ false }
										isBusy={ isLoading }
										disabled={ isLoading || !openAIApiKey }
										onClick={ () => setIsUpgradeModal( true ) }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Generate image(s)', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon={ imageIcon }
										iconSize={ 18 }
										variant='primary'
										onClick={ onClickGenerate }
										isBusy={ isLoading }
										disabled={ isLoading || ( engine === 'stable-diffusion' && !stabilityAIapiKey ) || ( engine === 'dall-e' && !openAIApiKey ) || !imagePrompt }
									>
										{ isLoading && (
											<Spinner />
										) }
									</Button>
								</FlexItem>
							</Flex>
						</FlexItem>
						{ errorMessage && (
							<FlexItem>
								<div className='dpaa__visible-error-message'>{ errorMessage.toString() }</div>
							</FlexItem>
						) }
					</Flex>
				</FlexItem>
				<FlexItem
					isBlock={ true }
					style={ {
						flexBasis: 'calc( 35% - 6px )'
					} }
				>
					{ ( stabilityAIapiKey || openAIApiKey ) && (
						<OptionsArea
							stabilityAIApiKey={ stabilityAIapiKey }
							openAIApiKey={ openAIApiKey }
							engine={ engine }
							onChangeEngine={ onChangeEngine }
							dallEModel={ dallEModel }
							dallENumberImages={ dallENumberImages }
							dallEImageSize={ dallEImageSize }
							dallEQuality={ dallEQuality }
							dallEStyle={ dallEStyle }
							stableDiffusionModel={ stableDiffusionModel }
							stableDiffusionStyle={ stableDiffusionStyle }
							stableDiffusionWidth={ stableDiffusionWidth }
							stableDiffusionHeight={ stableDiffusionHeight }
							stableDiffusionDimensions={ stableDiffusionDimensions }
							stableDiffusionSamples={ stableDiffusionSamples }
							stableDiffusionCfgScale={ stableDiffusionCfgScale }
							stableDiffusionSteps={ stableDiffusionSteps }
							onChangeDallEModel={ onChangeDallEModel }
							onChangeDallENumberImages={ onChangeDallENumberImages }
							onChangeDallEImageSize={ onChangeDallEImageSize }
							onChangeDallEQuality={ onChangeDallEQuality }
							onChangeDallEStyle={ onChangeDallEStyle }
							onChangeStableDiffusionModel={ onChangeStableDiffusionModel }
							onChangeStableDiffusionStyle={ onChangeStableDiffusionStyle }
							onChangeStableDiffusionWidth={ onChangeStableDiffusionWidth }
							onChangeStableDiffusionHeight={ onChangeStableDiffusionHeight }
							onChangeStableDiffusionDimensions={ onChangeStableDiffusionDimensions }
							onChangeStableDiffusionSamples={ onChangeStableDiffusionSamples }
							onChangeStableDiffusionCfgScale={ onChangeStableDiffusionCfgScale }
							onChangeStableDiffusionSteps={ onChangeStableDiffusionSteps }
						/>
					) }
					{ !stabilityAIapiKey && (
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
										href={ STABILITY_AI_API_KEY_URL }
										type="link"
										rel="next"
									>
										{ `${ __( 'Get the API key.', dpaa.i18n ) } (Stability AI)` }
									</ExternalLink>
								</FlexItem>
							</Flex>
						</Notice>
					) }
					{ !openAIApiKey && (
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
										{ `${ __( 'Get the API key.', dpaa.i18n ) } (OpenAI)` }
									</ExternalLink>
								</FlexItem>
							</Flex>
						</Notice>
					) }
				</FlexItem>
			</Flex>
			{ isUpgradeModal && <UpgradeModal onRequestClose={ () => setIsUpgradeModal( false ) } /> }
		</>
	)
} )