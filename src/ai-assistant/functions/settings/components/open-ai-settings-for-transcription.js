/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	PopoverHelp,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	OPEN_AI_API_KEY_URL,
	OPEN_AI_USAGE_URL,
	OPEN_AI_SPEECH_VOICES_URL,
	DEFAULT_OPEN_AI_SPEECH_MODEL,
	DEFAULT_OPEN_AI_SPEECH_VOICE,
	DEFAULT_OPEN_AI_SPEECH_FORMAT,
	DEFAULT_OPEN_AI_SPEECH_SPEED, 	// 0.25 to 4.0
	DEFAULT_OPEN_AI_TRANSCRIPTION_MODEL,
	DEFAULT_OPEN_AI_TRANSCRIPTION_LANGUAGE,	// ISO-639-1 https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
	DEFAULT_OPEN_AI_TRANSCRIPTION_FORMAT,	// json, text, srt, verbose_json, or vtt
	DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE, // 0.0 to 1.0
	DEFAULT_OPEN_AI_TRANSCRIPTION_MAX_LOGS,
	DEFAULT_OPEN_AI_SPEECH_MAX_LOGS,
	OPEN_AI_TRANSCRIPTION_MODELS_DOCUMENT_URL,
	OPEN_AI_TRANSCRIPTION_MODELS,
	OPEN_AI_SPEECH_MODELS_DOCUMENT_URL,
	OPEN_AI_SPEECH_MODELS,
	OPEN_AI_SPEECH_VOICES,
	OPEN_AI_SPEECH_FORMATS,
	OPEN_AI_TRANSCRIPTION_LANGUAGE,
	OPEN_AI_GPT_MODELS_URL,
	OPEN_AI_PRICING_URL,
} from '@dpaa/ai-assistant/constants'
import {
	AICPU as AICPUIcon,
	Finance as FinanceIcon,
} from '@dpaa/icons'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
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
	TextareaControl,
	__experimentalDivider as Divider,
	__experimentalInputControl as InputControl,
	__experimentalVStack as VStack,
	__experimentalText as Text,
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

export const OpenAISettingsForTranscription = ( { pluginSettings } ) => {

	// 各パラメータの状態管理用
	const [ apiKey, setApiKey ] = useState( pluginSettings?.openAISettings?.apiKey || '' )
	const [ speechSettings, setSpeechSettings ] = useState( pluginSettings?.openAISettings?.speech || null )
	const [ transcriptionSettings, setTranscriptionSettings ] = useState( pluginSettings?.openAISettings?.transcription || null )

	// グローバル設定の更新用(ストア更新前の状態管理用)
	const { setSetting } = useDispatch( STORE_NAME )
	const updateSetting = ( key, value ) => {
		setSetting( { 'openAISettings': key }, value );
	};
	useEffect( () => updateSetting( 'apiKey', apiKey ), [ apiKey ] );
	useEffect( () => updateSetting( 'speech', speechSettings ), [ speechSettings ] );
	useEffect( () => updateSetting( 'transcription', transcriptionSettings ), [ transcriptionSettings ] );

	// 「テキストから音声」のパラメータ
	const [ speechModel, setSpeechModel ] = useState( DEFAULT_OPEN_AI_SPEECH_MODEL )
	const [ speechVoice, setSpeechVoice ] = useState( DEFAULT_OPEN_AI_SPEECH_VOICE )
	const [ speechSpeed, setSpeechSpeed ] = useState( DEFAULT_OPEN_AI_SPEECH_SPEED )
	const [ speechFormat, setSpeechFormat ] = useState( DEFAULT_OPEN_AI_SPEECH_FORMAT )
	const [ speechMaxLogs, setSpeechMaxLogs ] = useState( DEFAULT_OPEN_AI_SPEECH_MAX_LOGS )
	const [ speechInstructions, setSpeechInstructions ] = useState( '' )

	// 「音声からテキスト」のパラメータ
	const [ transcriptionModel, setTranscriptionModel ] = useState( DEFAULT_OPEN_AI_TRANSCRIPTION_MODEL )
	const [ transcriptionLanguage, setTranscriptionLanguage ] = useState( DEFAULT_OPEN_AI_TRANSCRIPTION_LANGUAGE )
	const [ transcriptionTenperature, setTranscriptionTenperature ] = useState( DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE )
	const [ transcriptionFormat, setTranscriptionFormat ] = useState( DEFAULT_OPEN_AI_TRANSCRIPTION_FORMAT )
	const [ transcriptionMaxLogs, setTranscriptionMaxLogs ] = useState( DEFAULT_OPEN_AI_TRANSCRIPTION_MAX_LOGS )
	const [ transcriptionPrompt, setTranscriptionPrompt ] = useState( '' )

	// 初回レンダリング時のみ(初期値)
	useEffect( () => {
		if ( pluginSettings?.openAISettings?.speech ) {
			setSpeechModel( pluginSettings?.openAISettings?.speech?.model || DEFAULT_OPEN_AI_SPEECH_MODEL )
			setSpeechVoice( pluginSettings?.openAISettings?.speech?.voice || DEFAULT_OPEN_AI_SPEECH_VOICE )
			setSpeechSpeed( pluginSettings?.openAISettings?.speech?.speed || DEFAULT_OPEN_AI_SPEECH_SPEED )
			setSpeechFormat( pluginSettings?.openAISettings?.speech?.format || DEFAULT_OPEN_AI_SPEECH_FORMAT )
			setSpeechMaxLogs( pluginSettings?.openAISettings?.speech?.maxLogs || DEFAULT_OPEN_AI_SPEECH_MAX_LOGS )
			setSpeechInstructions( pluginSettings?.openAISettings?.speech?.instructions || '' )
			setTranscriptionModel( pluginSettings?.openAISettings?.transcription?.model || DEFAULT_OPEN_AI_TRANSCRIPTION_MODEL )
			setTranscriptionLanguage( pluginSettings?.openAISettings?.transcription?.language || DEFAULT_OPEN_AI_TRANSCRIPTION_LANGUAGE )
			setTranscriptionFormat( pluginSettings?.openAISettings?.transcription?.format || DEFAULT_OPEN_AI_TRANSCRIPTION_FORMAT )
			setTranscriptionMaxLogs( pluginSettings?.openAISettings?.transcription?.maxlogs || DEFAULT_OPEN_AI_TRANSCRIPTION_MAX_LOGS )
			setTranscriptionTenperature( pluginSettings?.openAISettings?.transcription?.temperature || DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE )
			setTranscriptionPrompt( pluginSettings?.openAISettings?.transcription?.prompt || '' )
		}
	}, [] )

	// speechSettings の更新
	useEffect( () => {
		setSpeechSettings( {
			model: speechModel,
			voice: speechVoice,
			format: speechFormat,
			speed: speechSpeed,
			instructions: speechInstructions,
		} )
	}, [ speechModel, speechVoice, speechSpeed, speechFormat, speechInstructions ] )

	// transcription の更新
	useEffect( () => {
		setTranscriptionSettings( {
			model: transcriptionModel,
			language: transcriptionLanguage,
			format: transcriptionFormat,
			temperature: transcriptionTenperature,
			prompt: transcriptionPrompt,
		} )
	}, [ transcriptionModel, transcriptionLanguage, transcriptionTenperature, transcriptionFormat, transcriptionPrompt ] )

	const [ showKey, setShowKey ] = useState( false );

	return (
		<>
			<PanelAdvancedSettings
				title={ `${ sprintf( __( '%s Settings', dpaa.i18n ), 'OpenAI' ) } (${ __( 'For transcription', dpaa.i18n ) })` }
				className='dpaa-components-panel __option-settings'
				titleLeftIcon={ AICPUIcon }
				initialOpen={ false }
				hasToggle={ false }
			>
				<VStack
					spacing={ 3 }
					className='dpaa-ai-assistant--settings__components-flex __open-ai'
				>
					<VStack spacing={ 1 }>
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
							style={{ width: '100%' }}
							label={ <>
								{__( 'Speech Model', dpaa.i18n ) }
								<PopoverHelp
									buttonText=''
									buttonClass='__right-inline-position'
									buttonSize='small'
									popoverPosition='bottom left'
									popoverVariant='toolbar'
									popoverOffset={ 5 }
									popoverClass=''
									popoverNoArrow={ false }
									help={ __( 'Select the speech model to generate voice.', dpaa.i18n ) }
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
								<Button
									variant="link"
									size="small"
									href={ OPEN_AI_SPEECH_MODELS_DOCUMENT_URL }
									target="_blank"
									text={ __('Documentation', dpaa.i18n) }
									style={ { fontSize: '11px' } }
								/>
							</> }
							value={ OPEN_AI_SPEECH_MODELS.find( option => option.key === speechModel ) }
							options={ OPEN_AI_SPEECH_MODELS }
							onChange={ newSelect => setSpeechModel( newSelect.selectedItem.key ) }
						/>
						<Text size={ 12 } style={ { color: '#666' } }>
							{ OPEN_AI_SPEECH_MODELS.find( option => option.key === speechModel )?.__experimentalHint }
						</Text>
					</VStack>
					<TextareaControl
						__nextHasNoMarginBottom
						label={ <>
							{ `${ __( 'Custom Instructions', dpaa.i18n ) } (${ __( 'optional', dpaa.i18n ) })` }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( 'Control the voice of your generated audio with additional instructions.<br />You can prompt the model to control aspects of speech, including:<br /><br />- Accent<br />- Emotional range<br />- Intonation<br />- Impressions<br />- Speed of speech<br />- Tone<br />- Whispering', dpaa.i18n ) }
							/>
						</> }
						value={ speechInstructions }
						onChange={ newVal => setSpeechInstructions( newVal ) }
						rows={ 2 }
						placeholder={ __( 'Speak in a cheerful and positive tone.', dpaa.i18n ) }
					/>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ <>
							{__( 'Voice', dpaa.i18n ) }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( 'Select the voice of the generated audio.', dpaa.i18n ) }
							/>
							<Button
								variant="link"
								size="small"
								href={ OPEN_AI_SPEECH_VOICES_URL }
								target="_blank"
								text={ __( 'Check voices', dpaa.i18n ) }
								style={ { fontSize: '11px' } }
							/>
						</> }
						value={ speechVoice }
						options={ OPEN_AI_SPEECH_VOICES }
						onChange={ newVal => setSpeechVoice( newVal ) }
					/>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ <>
							{__( 'Audio Format', dpaa.i18n ) }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( 'Select the audio format of the voice data.', dpaa.i18n ) }
							/>
						</> }
						value={ speechFormat }
						options={ OPEN_AI_SPEECH_FORMATS }
						onChange={ newVal => setSpeechFormat( newVal ) }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ <>
							{__( 'Speech Speed', dpaa.i18n ) }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( 'The speed of the generated audio.', dpaa.i18n ) }
							/>
						</> }
						value={ speechSpeed }
						allowReset={ true }
						initialPosition={ DEFAULT_OPEN_AI_SPEECH_SPEED }
						resetFallbackValue={ DEFAULT_OPEN_AI_SPEECH_SPEED }
						step={ 0.01 }
						onChange={ newVal => setSpeechSpeed( newVal ) }
						renderTooltipContent={ value => `${ value }` }
						min={ 0.25 }
						max={ 4.0 }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ <>
							{__( 'Max number of "Text to Speech" logs', dpaa.i18n ) }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( 'Set the maximum number of conversion logs.', dpaa.i18n ) }
							/>
						</> }
						value={ speechMaxLogs }
						allowReset={ true }
						initialPosition={ DEFAULT_OPEN_AI_SPEECH_MAX_LOGS }
						resetFallbackValue={ DEFAULT_OPEN_AI_SPEECH_MAX_LOGS }
						step={ 1 }
						onChange={ newVal => setSpeechMaxLogs( newVal ) }
						renderTooltipContent={ value => `${ value } ${ __( 'logs.', dpaa.i18n ) }` }
						min={ 1 }
						max={ 10 }
					/>
					<Divider margin={ 3 } style={{ opacity: 0.5 }} />
					<VStack spacing={ 2 }>
						<CustomSelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							style={{ width: '100%' }}
							label={ <>
								{__( 'Transcription Model', dpaa.i18n ) }
								<PopoverHelp
									buttonText=''
									buttonClass='__right-inline-position'
									buttonSize='small'
									popoverPosition='bottom left'
									popoverVariant='toolbar'
									popoverOffset={ 5 }
									popoverClass=''
									popoverNoArrow={ false }
									help={ __( 'Select an AI model for transcribing audio to text.', dpaa.i18n ) }
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
								<Button
									variant="link"
									size="small"
									href={ OPEN_AI_TRANSCRIPTION_MODELS_DOCUMENT_URL }
									target="_blank"
									text={ __('Documentation', dpaa.i18n) }
									style={ { fontSize: '11px' } }
								/>
							</> }
							value={ OPEN_AI_TRANSCRIPTION_MODELS.find( option => option.key === transcriptionModel ) }
							options={ OPEN_AI_TRANSCRIPTION_MODELS }
							onChange={ newSelect => setTranscriptionModel( newSelect.selectedItem.key ) }
						/>
						<Text size={ 12 } style={ { color: '#666' } }>
							{ OPEN_AI_TRANSCRIPTION_MODELS.find( option => option.key === transcriptionModel )?.__experimentalHint }
						</Text>
					</VStack>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ <>
							{__( 'Transcription Language', dpaa.i18n ) }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( 'Select the language to transcribe from the input audio.', dpaa.i18n ) }
							/>
						</> }
						value={ transcriptionLanguage }
						options={ OPEN_AI_TRANSCRIPTION_LANGUAGE }
						onChange={ newVal => setTranscriptionLanguage( newVal ) }
					/>
					<TextareaControl
						__nextHasNoMarginBottom
						label={ <>
							{__( 'System Prompt', dpaa.i18n ) }
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
						value={ transcriptionPrompt }
						onChange={ newVal => setTranscriptionPrompt( newVal ) }
						rows={ 2 }
						placeholder={ __( 'The following conversation is a lecture about the recent developments around OpenAI, GPT-4.5 and the future of AI.', dpaa.i18n ) }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ <>
							{__( 'Temperature', dpaa.i18n ) }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( 'The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.', dpaa.i18n ) }
							/>
						</> }
						value={ transcriptionTenperature }
						allowReset={ true }
						initialPosition={ DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE }
						resetFallbackValue={ DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE }
						step={ 0.01 }
						onChange={ newVal => setTranscriptionTenperature( newVal ) }
						renderTooltipContent={ value => `${ value }` }
						min={ 0.0 }
						max={ 1.0 }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ <>
							{__( 'Max number of "Speech to Text" logs', dpaa.i18n ) }
							<PopoverHelp
								buttonText=''
								buttonClass='__right-inline-position'
								buttonSize='small'
								popoverPosition='bottom left'
								popoverVariant='toolbar'
								popoverOffset={ 5 }
								popoverClass=''
								popoverNoArrow={ false }
								help={ __( 'Set the maximum number of transcription logs.', dpaa.i18n ) }
							/>
						</> }
						value={ transcriptionMaxLogs }
						allowReset={ true }
						initialPosition={ DEFAULT_OPEN_AI_TRANSCRIPTION_MAX_LOGS }
						resetFallbackValue={ DEFAULT_OPEN_AI_TRANSCRIPTION_MAX_LOGS }
						step={ 1 }
						onChange={ newVal => setTranscriptionMaxLogs( newVal ) }
						renderTooltipContent={ value => `${ value } ${ __( 'logs.', dpaa.i18n ) }` }
						min={ 1 }
						max={ 10 }
					/>
				</VStack>
			</PanelAdvancedSettings>
		</>
	)
}

export default OpenAISettingsForTranscription