/**
 * Internal dependencies
 */
import './editor.scss'
import {
	ConditionalWrapper,
	TipMessage,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import { OPEN_AI_API_KEY_URL } from '@dpaa/ai-assistant/constants'
import { SpeechToTextPanel } from './speech-to-text-panel'
import { TextToSpeechPanel } from './text-to-speech-panel'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	ExternalLink,
	Icon,
	Flex,
	FlexItem,
	Notice,
	TabPanel,
	Spinner,
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
	commentContent as commentContentIcon,
} from '@wordpress/icons'

export const TranscriptionPanel = ( props ) => {
	const {
		pluginSettings,
		openai,
		userCanManageSettings,
		isInEditor,
	} = props

	// 一般設定
	const generalSettings = pluginSettings?.generalSettings
	// API設定
	const apiSettings = pluginSettings?.openAISettings

	// Open API設定用
	const [ apiKey, setApiKey ] = useState( null )

	const [ speechSettings, setSpeechSettings ] = useState( null )
	const [ transcriptionSettings, setTranscriptionSettings ] = useState( null )

	// テキストから音声パネル
	const [ textToSpeechPanel, setTextToSpeechPanel ] = useState( <></> )
	// 音声からテキストパネル
	const [ speechToTextPanel, setSpeechToTextPanel ] = useState( <></> )

	// エラーメッセージ用
	const [ errorMessage, setErrorMessage ] = useState( '' )
	// チップメッセージ表示用
	const [ tipMessage, setTipMessage ] = useState( { message: '', actions: [], explicitDismiss: false } )
	// 読み込み状態管理用
	const [ isLoading, setIsLoading ] = useState( false )

	// API 設定の取得
	useEffect( () => {
		if ( apiSettings ) {
			setApiKey( apiSettings?.apiKey )
			setSpeechSettings( apiSettings?.speech || null )
			setTranscriptionSettings( apiSettings?.transcription || null )
		}
	}, [ apiSettings ] )

	// プラグインオプションの更新用
	const { setSetting } = useDispatch( STORE_NAME )
	const updateSetting = ( key, value ) => {
		if ( value && Array.isArray( value ) ) {
			setSetting( { 'openAISettings': key }, value );
		}
	};
	useEffect( () => updateSetting( 'speech', speechSettings ), [ speechSettings ] );
	useEffect( () => updateSetting( 'transcription', transcriptionSettings ), [ transcriptionSettings ] );

	useEffect( () => {
		if ( ( apiKey && !openai ) ) {
			// ローディング表示
			setTextToSpeechPanel( <Spinner style={ { width: '30px', height: '30px' } } /> )
		}
		else if ( !apiKey && !openai ) {
			// APIキーがない場合
			setTextToSpeechPanel(
				<>
					<Text
						display='block'
						size='13px'
						weight='normal'
					>
						{ __( 'To generate audio or transcribe text, create an OpenAI API key and save it in the plugin settings.', dpaa.i18n ) }
					</Text>
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
				</>
			)
		}
		else if ( openai && apiKey ) {
			// タブパネルをセット
			setTextToSpeechPanel(
				<TextToSpeechPanel
					openai={ openai }
					generalSettings={ generalSettings }
					isLoading={ isLoading }
					isInEditor={ isInEditor }
					speechSettings={ speechSettings }
					setTipMessage={ setTipMessage }
					setIsLoading={ setIsLoading }
				/>
			)
			setSpeechToTextPanel(
				<SpeechToTextPanel
					openai={ openai }
					isLoading={ isLoading }
					isInEditor={ isInEditor }
					settings={ transcriptionSettings }
					setTipMessage={ setTipMessage }
					setIsLoading={ setIsLoading }
				/>
			)
		}

	}, [ apiKey, openai ] )

	// タブの状態管理用
	const [ activeTabName, setActiveTabName ] = useState( 'speech' )
	const onSelectTab = tabName => {
		setActiveTabName( tabName )
	}

	// タブパネル
	const tabs = [
		{
			name: 'speech',
			titleName: __( 'Text to Speech', dpaa.i18n ),
			title: <><Icon icon='microphone' className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Text to Speech', dpaa.i18n ) }</>,
			className: 'dpaa-tab-panel__tab tab--speech',
		},
		{
			name: 'transcription',
			titleName: __( 'Speech to Text', dpaa.i18n ),
			title: <><Icon icon={ commentContentIcon } className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Speech to Text', dpaa.i18n ) }</>,
			className: 'dpaa-tab-panel__tab tab--transcription',
		},
	]

	return (
		<>
			<TabPanel
				className='dpaa-operation-panel__tab-container dpaa--inner-tab-container dpaa-box-shadow-element'
				orientation='horizontal'
				initialTabName='speech'
				onSelect={ onSelectTab }
				tabs={ tabs }>
				{
					( tab ) =>
					<>
						{ tab.name === 'speech' && textToSpeechPanel }
						{ tab.name === 'transcription' && speechToTextPanel }
					</>
				}
			</TabPanel>
			{ errorMessage && (
				<div className='dpaa__visible-error-message'>{ errorMessage.toString() }</div>
			) }
			<TipMessage
				message={ tipMessage?.message || '' }
				actions={ tipMessage?.actions || [] }
				explicitDismiss={ tipMessage?.explicitDismiss || false }
				isLoading={ isLoading }
			/>
		</>
	)
}