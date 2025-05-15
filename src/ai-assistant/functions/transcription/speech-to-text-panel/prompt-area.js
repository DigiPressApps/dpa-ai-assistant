/**
 * Internal dependencies
 */
import { OptionsArea } from './options-area'
import {
	languageMapForTranscription
} from '@dpaa/ai-assistant/functions/language-map'
import {
	OPEN_AI_API_KEY_URL
} from '@dpaa/ai-assistant/constants'
import {
	PopoverHelp
} from '@dpaa/components'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Button,
	ExternalLink,
	Flex,
	FlexItem,
	Notice,
	TextareaControl,
	ToggleControl,
	__experimentalInputControl as InputControl,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components'
import {
	memo,
	useState,
	useEffect,
} from '@wordpress/element'

export const PromptArea = memo( ( props ) => {
	const {
		isLoading,
		openai,
		url,
		language,
		temperature,
		model,
		prompt,
		isStreaming,
		onChangeUrl,
		onChangePrompt,
		onClickClear,
		onClickTranscript,
		onChangeLanguage,
		onChangeTemperature,
		onClickOpenMediaLibrary,
		onChangeIsStreaming,
		onChangeModel,
	} = props

	// 変換言語
	const [ transcriptionLanguage, setTranscriptionLanguage ] = useState( __( 'input language', dpaa.i18n ) )
	useEffect( () => {
		if ( language ) {
			setTranscriptionLanguage( languageMapForTranscription[ language ] )
		}
	}, [ language ])

	return (
		<Flex
			className='dpaa-ai-assistant--generator__input-form'
			direction='row'
			align='flex-start'
			gap={ 5 }
		>
			<FlexItem
				className='dpaa-ai-assistant--generator__prompt__wrapper'
				isBlock={ true }
				style={ {
					flexBasis: 'calc( 65% - 6px )'
				} }
			>

				<VStack spacing={ 2 }>
					<Flex
						gap={ 2 }
						direction='row'
						justify='flex-end'
						align='end'
					>
						<FlexItem style={ { flexBasis: 'calc( 100% - 40px )' } }>
							<InputControl
								__next40pxDefaultSize
								size='__unstable-large'
								type='url'
								label={ <>
									{__( 'Audio URL', dpaa.i18n ) }
									<PopoverHelp
										buttonText=''
										buttonClass='__right-inline-position'
										buttonSize='small'
										popoverPosition='bottom left'
										popoverVariant='toolbar'
										popoverOffset={ 5 }
										popoverClass=''
										popoverNoArrow={ false }
										help={ sprintf( __( 'Transcribe the audio file in %s.', dpaa.i18n ), __( transcriptionLanguage, dpaa.i18n ) ) }
									/>
								</> }
								value={ url }
								onChange={ onChangeUrl }
								disabled={ isLoading }
								placeholder='https://path-to-your-audio.com/speech.mp3'
							/>
						</FlexItem>
						<FlexItem style={ { flexBasis: '32px' } }>
							<Button
								size='compact'
								showTooltip
								label={ __( 'Open media library', dpaa.i18n ) }
								className='dpaa-ai-assistant--generator__button'
								icon='insert'
								iconSize={ 20 }
								variant='primary'
								isBusy={ isLoading }
								disabled={ !openai }
								onClick={ onClickOpenMediaLibrary }
							/>
						</FlexItem>
					</Flex>
					<HStack
						spacing={ 1}
						justify='end'
					>
						{/* { model !== 'whisper-1' && ( */}
						{ isStreaming && (
							<ToggleControl
								__nextHasNoMarginBottom
								checked={ isStreaming }
								label={ __( 'Streaming', dpaa.i18n ) }
								onChange={ onChangeIsStreaming }
								disabled={ isLoading || !openai }
							/>
						) }
						<Button
							size='compact'
							showTooltip
							label={ __( 'Clear all logs', dpaa.i18n ) }
							className='dpaa-ai-assistant--generator__button'
							icon='trash'
							iconSize={ 18 }
							variant='primary'
							isDestructive={ true }
							disabled={ isLoading || !openai }
							onClick={ onClickClear }
						/>
						<Button
							size='compact'
							showTooltip
							label={ __( 'Speech to Text', dpaa.i18n ) }
							icon='welcome-write-blog'
							iconSize={ 20 }
							variant='primary'
							isDestructive={ false }
							isBusy={ isLoading }
							disabled={ isLoading || !url || !openai }
							onClick={ onClickTranscript }
						/>
					</HStack>
					<TextareaControl
						__nextHasNoMarginBottom
						label={ <>
							{`${ __( 'System Prompt', dpaa.i18n ) } (${ __( 'optional', dpaa.i18n ) })` }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( "An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.", dpaa.i18n ) }
							/>
						</> }
						className='dpaa-ai-assistant--generator__prompt__textarea'
						value={ prompt }
						onChange={ onChangePrompt }
						rows={ 2 }
						placeholder={ __( 'The following conversation is a lecture about the recent developments around OpenAI, GPT-4.5 and the future of AI.', dpaa.i18n ) }
						disabled={ isLoading || !openai }
					/>
				</VStack>
			</FlexItem>
			<FlexItem
				isBlock={ true }
				style={ {
					flexBasis: 'calc( 35% - 6px )'
				} }
			>
				{ !openai
				? (
					<Notice
						className="dpaa-ai-assistant--settings__notice-component"
						status="info"
						isDismissible={ false }
					>
						<VStack spacing={ 2 }>
							<ExternalLink
								href={ OPEN_AI_API_KEY_URL }
								type="link"
								rel="next"
							>
								{ __( 'Get the API key.', dpaa.i18n ) }
							</ExternalLink>
						</VStack>
					</Notice>
				)
				: (
					<OptionsArea
						model={ model }
						language={ language }
						temperature={ temperature }
						onChangeLanguage={ onChangeLanguage }
						onChangeTemperature={ onChangeTemperature }
						onChangeModel={ onChangeModel }
					/>
				) }
			</FlexItem>
		</Flex>
	)
} )