/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	OPEN_AI_API_KEY_URL,
	OPEN_AI_USAGE_URL,
	OPEN_AI_SPEECH_VOICES_URL,
	DEFAULT_OPEN_AI_SPEECH_MODEL, 	// tts-1 or tts-1-hd
	DEFAULT_OPEN_AI_SPEECH_VOICE,	// alloy, echo, fable, onyx, nova, and shimmer
	DEFAULT_OPEN_AI_SPEECH_FORMAT,	// mp3, opus, aac, flac, wav, and pcm
	DEFAULT_OPEN_AI_SPEECH_SPEED, 	// 0.25 to 4.0
	DEFAULT_OPEN_AI_TRANSCRIPTION_MODEL,	// whisper-1
	DEFAULT_OPEN_AI_TRANSCRIPTION_LANGUAGE,	// ISO-639-1 https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
	DEFAULT_OPEN_AI_TRANSCRIPTION_FORMAT,	// json, text, srt, verbose_json, or vtt
	DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE, // 0.0 to 1.0
	DEFAULT_OPEN_AI_TRANSCRIPTION_MAX_LOGS,
	DEFAULT_OPEN_AI_SPEECH_MAX_LOGS,
	OPEN_AI_SPEECH_MODELS_DOCUMENT_URL,
	OPEN_AI_SPEECH_MODELS,
	OPEN_AI_SPEECH_VOICES,
	OPEN_AI_SPEECH_FORMATS,
	OPEN_AI_TRANSCRIPTION_LANGUAGE,
} from '@dpaa/ai-assistant/constants'
import { aiIcon } from '@dpaa/ai-assistant/icons'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	CustomSelectControl,
	ExternalLink,
	Flex,
	FlexItem,
	Notice,
	RangeControl,
	SelectControl,
	TextareaControl,
	__experimentalDivider as Divider,
	__experimentalInputControl as InputControl,
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
		} )
	}, [ speechModel, speechVoice, speechSpeed, speechFormat ] )

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
				titleLeftIcon={ aiIcon }
				initialOpen={ false }
				hasToggle={ false }
			>
				<Flex
					direction='column'
					gap={ 3 }
					className='dpaa-ai-assistant--settings__components-flex __open-ai'
				>
					<FlexItem>
						<Flex direction='row' gap={ 1 } justify='space-between' align='center'>
							<FlexItem style={ { flexBasis: !apiKey ? '100%' : 'calc(100% - 34px)' } }>
								<InputControl
									__next40pxDefaultSize
									size='__unstable-large'
									type={ showKey ? 'text' : 'password' }
									label={ __( 'API Key', dpaa.i18n ) }
									value={ apiKey || '' }
									onChange={ newVal => setApiKey( newVal ) }
									placeholder='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'
									help={ apiKey ? (
										<ExternalLink
											href={ OPEN_AI_USAGE_URL }
											type="link"
											rel="next"
										>
											{ __( 'Check current usage', dpaa.i18n ) }
										</ExternalLink>
									) : (
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
														{ __( 'Get the API key.', dpaa.i18n ) }
													</ExternalLink>
												</FlexItem>
											</Flex>
										</Notice>
									) }
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
					</FlexItem>
					<FlexItem>
						<BaseControl
							help={ (
								<>
									<span>{ __( 'Select the speech model to generate voice.', dpaa.i18n ) }</span><br />
									<ExternalLink
										href={ OPEN_AI_SPEECH_MODELS_DOCUMENT_URL }
										type="link"
										rel="next"
									>
										{ __( 'Documentation', dpaa.i18n ) }
									</ExternalLink>
								</>
							) }
						>
							<CustomSelectControl
								__next40pxDefaultSize
								__experimentalShowSelectedHint
								__nextUnconstrainedWidth='100%'
								size='__unstable-large'
								label={ __( 'Speech Model', dpaa.i18n ) }
								value={ OPEN_AI_SPEECH_MODELS.find( option => option.key === speechModel ) }
								options={ OPEN_AI_SPEECH_MODELS }
								onChange={ newSelect => setSpeechModel( newSelect.selectedItem.key ) }
							/>
						</BaseControl>
					</FlexItem>
					<FlexItem>
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ __( 'Voice', dpaa.i18n ) }
							help={ <>
								<span>{ __( 'Select the voice of the generated audio.', dpaa.i18n ) }</span><br />
								<ExternalLink
									href={ OPEN_AI_SPEECH_VOICES_URL }
									type="link"
									rel="next"
								>
									{ __( 'Check voices', dpaa.i18n ) }
								</ExternalLink>
							</> }
							value={ speechVoice }
							options={ OPEN_AI_SPEECH_VOICES }
							onChange={ newVal => setSpeechVoice( newVal ) }
						/>
					</FlexItem>
					<FlexItem>
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ __( 'Audio Format', dpaa.i18n ) }
							help={ __( 'Select the audio format of the voice data.', dpaa.i18n ) }
							value={ speechFormat }
							options={ OPEN_AI_SPEECH_FORMATS }
							onChange={ newVal => setSpeechFormat( newVal ) }
						/>
					</FlexItem>
					<FlexItem>
						<RangeControl
							label={ __( 'Speech Speed', dpaa.i18n ) }
							help={ __( 'The speed of the generated audio.', dpaa.i18n ) }
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
					</FlexItem>
					<FlexItem>
						<RangeControl
							label={ __( 'Max number of "Text to Speech" logs', dpaa.i18n ) }
							help={ __( 'Set the maximum number of conversion logs.', dpaa.i18n ) }
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
					</FlexItem>
					<FlexItem>
						<Divider marginEnd={ 4 } />
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ __( 'Transcription Language', dpaa.i18n ) }
							help={ __( 'Select the language to transcribe from the input audio.', dpaa.i18n ) }
							value={ transcriptionLanguage }
							options={ OPEN_AI_TRANSCRIPTION_LANGUAGE }
							onChange={ newVal => setTranscriptionLanguage( newVal ) }
						/>
					</FlexItem>
					<FlexItem>
						<TextareaControl
							__next40pxDefaultSize
							label={ __( 'System Prompt', dpaa.i18n ) }
							help={ __( "An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.", dpaa.i18n ) }
							value={ transcriptionPrompt }
							onChange={ newVal => setTranscriptionPrompt( newVal ) }
							rows={ 2 }
							placeholder={ __( 'Write in a deep, heavy, Southern accent.', dpaa.i18n ) }
						/>
					</FlexItem>
					<FlexItem>
						<RangeControl
							label={ __( 'Temperature', dpaa.i18n ) }
							help={ __( 'The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.', dpaa.i18n ) }
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
					</FlexItem>
					<FlexItem>
						<RangeControl
							label={ __( 'Max number of "Speech to Text" logs', dpaa.i18n ) }
							help={ __( 'Set the maximum number of transcription logs.', dpaa.i18n ) }
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
					</FlexItem>
				</Flex>
			</PanelAdvancedSettings>
		</>
	)
}

export default OpenAISettingsForTranscription