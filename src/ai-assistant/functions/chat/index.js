/**
 * Internal dependencies
 */
import './editor.scss'
import { TipMessage } from '@dpaa/components'
import {
	getClipboardText,
	getSelectedText,
	copyToClipboard,
	sendMessage as sendMessageToChatGPT,
	sendToGPTVision,
	urlToBase64Image,
	isLocalUrl,
} from '@dpaa/util'
import {
	DEFAULT_OPEN_AI_GPT_MODEL,
	DEFAULT_CHAT_LANGUAGE_CODE,
	DEFAULT_CHAT_WRITING_TONE,
	DEFAULT_CHAT_WRITING_STYLE,
	DEFAULT_CHAT_CONTENT_STRUCTURE,
	DEFAULT_CHAT_MAX_CHAT_LOGS,
	DEFAULT_CHAT_MAX_VISIBLE_CHAT_LOGS,
	DEFAULT_OPEN_AI_MAX_TOKENS,
	DEFAULT_OPEN_AI_TEMPERATURE,
	DEFAULT_OPEN_AI_TOP_P,
} from '@dpaa/ai-assistant/constants'
import {
	MESSAGE_PROMPT_BULLETED_LIST,
	MESSAGE_PROMPT_PARAGRAPH,
	MESSAGE_PROMPT_ARTICLE,
	MESSAGE_PROMPT_OPINION,
	MESSAGE_PROMPT_COUNTERARGUMENT,
	SYSTEM_PROMPT_RANDOM,
	MESSAGE_PROMPT_SUMMARIZE,
	MESSAGE_PROMPT_EXPAND,
	MESSAGE_PROMPT_SUGGEST_TITLE,
	MESSAGE_PROMPT_EXCERPT,
	MESSAGE_PROMPT_REWRITE,
	MESSAGE_PROMPT_CONCLUSION,
	MESSAGE_PROMPT_TRANSLATE_JAPANESE,
	MESSAGE_PROMPT_TRANSLATE_ENGLISH,
	MESSAGE_MAGIC_PROMPT,
	MAGIC_PROMPT_TOPICS,
	MESSAGE_PROMPT_CONTINUE,
} from './system-prompt'
import { RenderLog } from './render-log'
import { PromptArea } from './prompt-area'
import { languageMap } from '../language-map'

/** 
 * External dependencies
 */
import Dexie from 'dexie';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Flex,
	FlexItem,
	Spinner,
} from '@wordpress/components'
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element'

export const ChatPanel = ( props ) => {
	const {
		pluginSettings,
		openai,
		userCanManageSettings,
		isInEditor,
	} = props

	// API設定
	const apiSettings = pluginSettings?.openAISettings
	// チャット設定
	const textGenerationSettings = pluginSettings?.textGenerationSettings

	// Open API設定用
	const [ fineTunedModels, setFineTunedModels ] = useState( null )
	const [ gptModel, setGptModel ] = useState( DEFAULT_OPEN_AI_GPT_MODEL )
	const [ maxTokens, setMaxTokens ] = useState( DEFAULT_OPEN_AI_MAX_TOKENS )
	const [ temperature, setTemperature ] = useState( DEFAULT_OPEN_AI_TEMPERATURE )
	const [ topP, setTopP ] = useState( DEFAULT_OPEN_AI_TOP_P )


	// チャット設定用
	const [ languageCode, setLanguageCode ] = useState( DEFAULT_CHAT_LANGUAGE_CODE )
	const [ writingTone, setWritingTone ] = useState( DEFAULT_CHAT_WRITING_TONE )
	const [ writingStyle, setWritingStyle ] = useState( DEFAULT_CHAT_WRITING_STYLE )
	const [ contentStructure, setContentStructure ] = useState( DEFAULT_CHAT_CONTENT_STRUCTURE )
	const [ maxChatLogs, setMaxChatLogs ] = useState( DEFAULT_CHAT_MAX_CHAT_LOGS )
	const [ maxVisibleChatLogs, setMaxVisibleChatLogs ] = useState( DEFAULT_CHAT_MAX_VISIBLE_CHAT_LOGS )
	const [ customPrompt, setCustomBehavior ] = useState( '' )

	// トランスクリプション設定用
	const [ transcriptionSettings, setTranscriptionSettings ] = useState( null )

	// API 設定の取得
	useEffect( () => {
		if ( apiSettings ) {
			setFineTunedModels( apiSettings?.fineTunedModels || null )
			setGptModel( apiSettings?.gptModel || DEFAULT_OPEN_AI_GPT_MODEL )
			setMaxTokens( apiSettings?.maxTokens || DEFAULT_OPEN_AI_MAX_TOKENS )
			setTemperature( apiSettings?.temperature || DEFAULT_OPEN_AI_TEMPERATURE )
			setTopP( apiSettings?.topP || DEFAULT_OPEN_AI_TOP_P )
			setTranscriptionSettings( apiSettings?.transcription || null )
		}
	}, [ apiSettings ] )

	// チャット設定の取得
	useEffect( () => {
		if ( textGenerationSettings ) {
			setLanguageCode( textGenerationSettings?.language || DEFAULT_CHAT_LANGUAGE_CODE )
			setWritingTone( textGenerationSettings?.writingTone || DEFAULT_CHAT_WRITING_TONE )
			setWritingStyle( textGenerationSettings?.writingStyle || DEFAULT_CHAT_WRITING_STYLE )
			setContentStructure( textGenerationSettings?.contentStructure || DEFAULT_CHAT_CONTENT_STRUCTURE)
			setMaxChatLogs( parseInt( textGenerationSettings?.maxChatLogs, 10 ) || DEFAULT_CHAT_MAX_CHAT_LOGS )
			setMaxVisibleChatLogs( parseInt( textGenerationSettings?.maxVisibleChatLogs, 10 ) || DEFAULT_CHAT_MAX_VISIBLE_CHAT_LOGS )
			setCustomBehavior( textGenerationSettings?.customPrompt || '' )
			
		}
	}, [ textGenerationSettings ] )

	// system 用のプロンプトの初期化
	const [ systemPrompt, setSystemPrompt ] = useState( `Respond in the same language you recieved. Tone: ${ DEFAULT_CHAT_WRITING_TONE }. Style: ${ DEFAULT_CHAT_WRITING_STYLE }. Structure: ${ DEFAULT_CHAT_CONTENT_STRUCTURE }` )
	// ユーザーのテキスト
	const [ message, setMessage ] = useState( '' )
	// GPT からの回答
	const [ response, setResponse ] = useState( '' )
	// 会話の記録用
	const [ conversation, setConversation ] = useState( [] )
	// ローディング状態
	const [ isLoading, setIsLoading ] = useState( false )
	// ストリーミング状態
	const [ isStreaming, setIsStreaming ] = useState( false )
	// 前回のメッセージの保持、比較用
	const previousMessageRef = useRef( '' );
	// エラーメッセージ用
	const [ errorMessage, setErrorMessage ] = useState( '' )
	// レンダリング用のログ
	const [ renderedLog, setRenderedLog ] = useState( null )
	// チップメッセージ表示用
	const [ tipMessage, setTipMessage ] = useState( { message: '' } )
	// const [ tipIcon, setTipIcon ] = useState( '' )
	// 選択テキストの種類
	const [ selectedTextTarget, setSelectedTextTarget ] = useState( '' )
	const [ selectedText, setSelectedText ] = useState( '' )
	const [ selectedTextOperation, setSelectedTextOperation ] = useState( '' )
	const [ selectedTextOperationMessage, setSelectedTextOperationMessage ] = useState( '' )
	const [ respondLanguage, setRespondLanguage ] = useState( '' )
	const [ respondTone, setRespondTone ] = useState( '' )
	const [ respondStyle, setRespondStyle ] = useState( '' )

	// イメージデータ用(GPT-4-Vision)
	const [ visionMediaData, setVisionMediaData ] = useState( [] )

	// ラッパー要素への参照用
	const scrollableRef = useRef( null );

	// IndexedDBデータベース用
	const [ indexedDB, setIndexedDB ] = useState( null )

	// ローカルデータ(indexedDB)の取得
	const fetchDataFromIndexedDB = async () => {
		try {
			if ( indexedDB ) {
				const data = await indexedDB.chat.get( 1 );
				if ( data?.generatedText ) {
					setRenderedLog( JSON.parse( data.generatedText ) );
				} else {
					setRenderedLog( [] )
				}
			}
		} catch ( error ) {
			console.error('Error fetching data from IndexedDB:', error);
		}
	};
	// ローカルデータ(indexedDB)の更新(上書き保存)
	 const saveDataToIndexedDB = async ( data ) => {
		try {
			if ( indexedDB ) {
				const primitiveData = JSON.stringify( data );
				await indexedDB.chat.put( {
					id: 1,
					generatedText: primitiveData
				} );

				// ログを一番下までスクロールさせる
				if ( scrollableRef.current ) {
					scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
				}
			}
		} catch ( error ) {
			console.error('Error saving data to IndexedDB:', error);
		}
	};

	// ローカルストレージのレンダーログの取得(初回レンダリング時)
	useEffect(() => {
		// データベース(IndexedDB)を作成
		const db = new Dexie( 'chatLog' );
		setIndexedDB( db )
	}, [] );

	// データベース作成時
	useEffect( () => {
		if ( indexedDB ) {
			// オブジェクトストア(テーブル)を作成
			indexedDB.version( 1 ).stores({
				chat: '++id, generatedText'
			});
			// ローカルデータの取得
			fetchDataFromIndexedDB()
		}
	}, [ indexedDB ] )

	// レンダーエリアの蓄積ログ
	useEffect( () => {
		if ( Array.isArray( renderedLog ) && renderedLog.length > 0 ) {
			// ローカルデータの更新(上書き保存)
			saveDataToIndexedDB( renderedLog )
		}
	}, [ renderedLog ] )


	// system用プロンプトの生成
	useEffect( () => {
		const actualLanguage = languageMap[ languageCode ];
		const propmtLanguage = languageCode === 'auto'
			? 'Respond in the same language you recieved. '
			: `Respond in ${ actualLanguage }, regardless of the language used by the user. `;
		const promptTone = writingTone ? `Tone: ${ writingTone }. ` : '';
		const promptSyle = writingStyle ? `Style: ${ writingStyle }. ` : '';
		const promptStructure = contentStructure && contentStructure !== 'none' ? `Structure: ${ contentStructure }. ` : '';

		setSystemPrompt( `${ promptTone }${ promptSyle }${ promptStructure }${ propmtLanguage }${ customPrompt }` );
		setRespondLanguage( propmtLanguage );
		setRespondTone( promptTone );
		setRespondStyle( promptSyle );

	}, [ languageCode, writingTone, writingStyle, contentStructure, customPrompt ] )

	// 表示ログの更新
	const refleshAndUpdateLogs = useCallback( props => {
		const {
			responseText,
			messageText,
		} = props

		if ( !responseText ) {
			return null
		}

		let newRenderedLog = []

		// ログエリアに履歴がある場合
		if ( Array.isArray( renderedLog ) && renderedLog.length > 0 ) {
			newRenderedLog = [
				...( renderedLog || [] ), 
				<RenderLog
					message={ messageText }
					response={ responseText }
					isLoaded={ true }
					index={ renderedLog?.length || 0 }
					isLoading={ isLoading }
					isStreaming={ isStreaming }
					tipMessage={ tipMessage }
					onClickCopyToClipboardItem={ handleCopyToClipboardItem }
					onClickRegenerate={ () => handleRegenerate( messageText ) }
					onClickDeleteItem={ handleDeleteItem }
					isInEditor={ isInEditor }
				/>
			]
		}

		// チャット履歴の保存
		if ( newRenderedLog.length > maxVisibleChatLogs ) {
			const trimmedRenderedLog = newRenderedLog.slice( newRenderedLog.length - maxVisibleChatLogs )
			setRenderedLog( trimmedRenderedLog )
		} else {
			setRenderedLog( newRenderedLog )
		}

	}, [ selectedTextOperationMessage, renderedLog, isLoading, isStreaming, tipMessage, isInEditor, pluginSettings, maxVisibleChatLogs ] )

	// 非同期 API リクエスト(ストリーミング)
	const sendMessageByAsync = useCallback( async ( props ) => {
		const {
			sysPrompt = systemPrompt,
			messageText = message,
			isTranscription = false,
		} = props

		if ( !messageText || ( isLoading && !isTranscription ) || !openai ) {
			return;
		}

		// APIリクエストを開始する前にローディング表示を開始
		setIsLoading( true )
		// エラーメッセージをクリア
		setErrorMessage( '' )
		// ストリーミング開始
		setIsStreaming( true )

		// 今回のメッセージを保持
		previousMessageRef.current = messageText

		sendMessageToChatGPT( {
			systemPrompt: sysPrompt,
			message: messageText,
			openai: openai,
			useStreaming: true,	// ストリーミングで取得
			model: gptModel,
			conversation: conversation,
			temperature: temperature,
			topP: topP,
			maxTokens: maxTokens,
			setResponse: setResponse,
		} )
		.then( response => {
			// stop.
			console.log( 'Streaming status: ', response )
		} )
		.catch( error => {
			if ( error?.response ) {
				setErrorMessage( error.response.status )
				console.error( { 'Error status: ': error.response.status, 'Data: ': error.response.data } )
			} else if ( error?.message ) {
				setErrorMessage( error.message )
				console.error( 'Error sending message: ', error.message )
			} else {
				setErrorMessage( error )
				console.error( 'Error: ', error )
			}
		} )
		.finally( () =>{
			// ローディング終了
			setIsLoading( false )
			setIsStreaming( false )
		} )

	}, [ isLoading, openai, message, conversation, temperature, topP, gptModel, systemPrompt, maxTokens ] );

	// 同期型 API リクエスト(非ストリーミング)
	const sendMessageBySync = useCallback( ( props ) => {
		const {
			sysPrompt = systemPrompt,
			messageText = message,
			sendResponseAfter = false,
			renderAndAppendLog = false,
			shouldReturnJson = false,
			tipNoMessage = __( 'No message!', dpaa.i18n )
		} = props

		if ( !messageText ) {
			setTipMessage( { message: tipNoMessage } )
			setTimeout( () => {
				setTipMessage( { message: '' } )
			}, 2000 )
			console.error( 'No message!' )
			return
		}

		setIsLoading( true )
		sendMessageToChatGPT( {
			systemPrompt: sysPrompt,
			message: messageText,
			openai: openai,
			useStreaming: false,	// ストリーミングでの受信は無効
			model: gptModel,
			conversation: conversation,
			temperature: temperature,
			topP: topP,
			maxTokens: maxTokens,
			shouldReturnJson: shouldReturnJson,
		} )
		.then( response => {
			const res = response?.response

			// レスポンスを新規のメッセージとして送信する場合(マジックプロンプト)
			if ( sendResponseAfter ) {
				setIsLoading( false )
				setMessage( res )
				sendMessageByAsync( { messageText: res } )
			}
			// ログを追加表示する場合
			else if ( renderAndAppendLog )  {
				refleshAndUpdateLogs( {
					responseText: res,
					messageText: __( selectedTextOperationMessage, dpaa.i18n ),
				} )
			} else {
				return res
			}
		} )
		.catch( error => {
			console.error( error )
			setErrorMessage( error )
		} )
		.finally( () => {
			setSelectedTextOperation( '' )
			setSelectedTextOperationMessage( '' )
			setIsLoading( false )
		} )
	}, [ isLoading, openai, message, systemPrompt, conversation, temperature, topP, gptModel, maxTokens, selectedTextOperationMessage ] )

	// ストリーミング中の処理
	useEffect( () => {
		// データ受信中
		if ( isStreaming && response ) {
			// ログを一番下までスクロールさせる
			if ( scrollableRef.current ) {
				scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
			}
		}
	}, [ response ] )

	// ストリーミング完了時の処理
	useEffect( () => {
		// ストリーミング完了時
		if ( !isStreaming && response ) {
			// 新しい会話を追加
			let newConversation = [
				...conversation,
				{
					'role': 'user',
					'content': previousMessageRef.current, // 直近の質問
				},
				{
					'role': 'assistant',
					'content': response,
				},
			];

			// 配列の長さが指定した数を超えている場合、先頭から要素を削除
			if ( newConversation.length > maxChatLogs ) {
				newConversation = newConversation.slice( -maxChatLogs );
			}

			// 会話の記録を更新(プロンプト用)
			setConversation( newConversation );

			// チャット履歴(配列)を蓄積して重複するアイテムを削除
			const newRenderedLog = Array.from( new Set( [
				...( renderedLog || [] ),
				...( pluginSettings?.chatLog || [] ),
				<RenderLog
					message={ previousMessageRef.current }
					response={ response }
					isLoaded={ true }
					inidex={ ( renderedLog?.length || 0 ) + ( pluginSettings?.chatLog?.length || 0 ) }
					isLoading={ isLoading }
					isStreaming={ isStreaming }
					tipMessage={ tipMessage }
					onClickCopyToClipboardItem={ handleCopyToClipboardItem }
					onClickRegenerate={ () => handleRegenerate( previousMessageRef.current ) }
					onClickDeleteItem={ handleDeleteItem }
					isInEditor={ isInEditor }
				/>
			] ) );

			// ログ表示用の要素を蓄積
			if ( newRenderedLog.length > maxVisibleChatLogs ) {
				const trimmedRenderedLog = newRenderedLog.slice( newRenderedLog.length - maxVisibleChatLogs )
				setRenderedLog( trimmedRenderedLog )
			} else {
				setRenderedLog( newRenderedLog )
			}

			// ストリーミングのレスポンスを空に
			setResponse( '' )
			// メッセージの消去(フォームのクリア)
			setMessage( '' )
		}

	}, [ isStreaming ] )

	// GPT-4-Vision 
	const sendMessageToGPTVisionBySync = useCallback( async ( props ) => {
		const {
			sysPrompt = systemPrompt,
			messageText = message,
			tipNoMessage = __( 'No message!', dpaa.i18n )
		} = props

		if ( !messageText || !Array.isArray( visionMediaData ) || visionMediaData?.length < 1 ) {
			setTipMessage( { message: tipNoMessage } )
			setTimeout( () => {
				setTipMessage( { message: '' } )
			}, 2000 )
			console.error( 'No message or no media data!', messageText, visionMediaData )
			setIsLoading( false )
			return false
		}

		// 取得済みのメディアデータから、URLのみの配列を生成
		const arrayUrls = visionMediaData.map( media => media?.url );

		// URLがローカル環境である場合は、Base64画像に変換
		const arrayImageUrls = await Promise.all( arrayUrls.map( async ( url ) => {
			if ( isLocalUrl( url ) ) {
				try {
					const res = await urlToBase64Image(url);
					return res;
				} catch ( error ) {
					console.error('Failed to convert Base64 Image.', error);
					return null;
				}
			}
		} ) )

		setIsLoading( true )
		sendToGPTVision( {
			systemPrompt: sysPrompt,
			message: messageText,
			openai: openai,
			model: gptModel,
			temperature: temperature,
			topP: topP,
			maxTokens: maxTokens,
			arrayImageUrls: arrayImageUrls,
		} )
		.then( response => {
			const res = response?.response
			refleshAndUpdateLogs( {
				responseText: res,
				messageText: messageText,
			} )
			return res
		} )
		.catch( error => {
			console.error( error )
			setErrorMessage( error )
		} )
		.finally( () => {
			setSelectedTextOperation( '' )
			setSelectedTextOperationMessage( '' )
			setIsLoading( false )
		} )

	}, [ visionMediaData, message, systemPrompt, isLoading, openai, temperature, topP, gptModel, maxTokens ] )

	// 各ログの削除ボタンのコールバック
	const handleDeleteItem = ( index ) => {
		// 新規チャットが追加された後(renderedLog にデータがある場合)
		if ( Array.isArray( renderedLog ) && renderedLog.length > 0 ) {
			// ログの配列をコピー
			const copyRenderedLog = [ ...renderedLog ]
			// 指定されたインデックスのアイテムを削除
			copyRenderedLog.splice( index, 1 )
			setRenderedLog( copyRenderedLog )
		}
	}

	// コピーボタンのコールバック
	const handleCopyToClipboardItem = ( { target } ) => {
		copyToClipboard( target )
			.then( ( result ) => {
				if ( result ) {
					setTipMessage( { message: __( 'Copied!', dpaa.i18n ) } )
					setTimeout( () => {
						setTipMessage( { message: '' } )
					}, 2000 )
				}
			} )
			.catch( ( error ) => {
				setErrorMessage( error )
				console.error( 'Error response copy:', error );
			} )
	}

	// 再生成用ハンドラー
	const handleRegenerate = ( message ) => {
		if ( !message ){
			return
		}
		if ( window.confirm( __( 'Are you sure you want to regenerate?', dpaa.i18n ) ) ) {
			setMessage( message )
			if ( ( gptModel.includes( 'gpt-4-vision' ) || gptModel.includes( 'gpt-4o' ) ) && Array.isArray( visionMediaData ) && visionMediaData?.length > 0 ) {
				// GPT-4-Visioｎ で画像認識の場合
				sendMessageToGPTVisionBySync( { messageText: message } )
			} else {
				sendMessageByAsync( { messageText: message } )
			}
		}
	}

	const handleClearAll = () => {
		if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
			// レンダー済みチャットの削除
			setRenderedLog( [] )
			// 内部ログ(履歴データ)の削除
			setConversation( [] )
			// ローカルストレージの削除
			indexedDB.chat.delete( 1 )
		}
	}

	const handleMagicPrompt = () => { 
		// 趣味の候補からランダムに一つ選んでトピックを生成させるプロンプト
		const randomTopic = MAGIC_PROMPT_TOPICS[ Math.floor( Math.random() * MAGIC_PROMPT_TOPICS.length ) ];
		// ランダムメッセージ
		const messageText = MESSAGE_MAGIC_PROMPT.replaceAll( '{TOPIC}', randomTopic )

		sendMessageBySync( {
			sysPrompt: `${ SYSTEM_PROMPT_RANDOM }`,
			messageText: `${ messageText } ${ respondLanguage }`,
			sendResponseAfter: true,
		} )
	}

	// ドロップダウンメニューのボタンクリックコールバック(GPTへメッセージ送信の指示)
	useEffect( () => {
		if ( ! selectedTextOperation ) {
			return
		}

		// オブジェクトリテラルでマッピング
		const messagePromptMap = {
			'summarize': `${ MESSAGE_PROMPT_SUMMARIZE } ${ respondLanguage }`,
			'expand': `${ MESSAGE_PROMPT_EXPAND } ${ respondLanguage }`,
			'rewrite': `${ MESSAGE_PROMPT_REWRITE } ${ respondLanguage }`,
			'suggest_title': `${ MESSAGE_PROMPT_SUGGEST_TITLE } ${ respondLanguage }`,
			'excerpt': `${ MESSAGE_PROMPT_EXCERPT } ${ respondLanguage }`,
			'conclusion': `${ MESSAGE_PROMPT_CONCLUSION } ${ respondLanguage }`,
			'bulleted_list': `${ MESSAGE_PROMPT_BULLETED_LIST } ${ respondLanguage }`,
			'paragraph': `${ MESSAGE_PROMPT_PARAGRAPH } ${ respondLanguage }`,
			'article': `${ MESSAGE_PROMPT_ARTICLE } ${ respondLanguage }`,
			'opinion': `${ MESSAGE_PROMPT_OPINION } ${ respondLanguage }`,
			'counterargument': `${ MESSAGE_PROMPT_COUNTERARGUMENT } ${ respondLanguage }`,
			'translate_japanese': MESSAGE_PROMPT_TRANSLATE_JAPANESE,
			'translate_english': MESSAGE_PROMPT_TRANSLATE_ENGLISH,
		};
		const messagePrompt = messagePromptMap[ selectedTextOperation ] || '';

		if ( messagePrompt ) {
			// 同期でメッセージ送信
			sendMessageBySync( {
				sysPrompt: systemPrompt,
				messageText: selectedText ? messagePrompt.replace( '{MESSAGE}', selectedText ) : '',
				renderAndAppendLog: true,
				tipNoMessage: __( 'No selected text!', dpaa.i18n ),
			} )
		}
	}, [ selectedTextOperation ] )

	// ログエリア
	const logArea = (
		<>
			{ ( !renderedLog || !Array.isArray( renderedLog ) ) && (
				<FlexItem>
					<Spinner style={ { width: '30px', height: '30px' } } />
				</FlexItem>
			) }
			{ Array.isArray( renderedLog ) && renderedLog.length > 0 && (
				// 通常のログ表示
				renderedLog.map( ( item, index ) =>  (
					<RenderLog
						message={ item?.props?.message }
						response={ item?.props?.response }
						isLoaded={ true }
						index={ index }
						isLoading={ isLoading }
						isStreaming={ isStreaming }
						tipMessage={ tipMessage }
						onClickCopyToClipboardItem={ handleCopyToClipboardItem }
						onClickRegenerate={ () => handleRegenerate( item?.props?.message ) }
						onClickDeleteItem={ handleDeleteItem }
						isInEditor={ isInEditor }
					/>
				) )
			) }
			{ ( Array.isArray( renderedLog ) && renderedLog.length === 0 && Array.isArray( pluginSettings?.chatLog ) && pluginSettings?.chatLog?.length > 0 ) && (
				// モーダルを開いたときやタブを切り替えた際に、以前の履歴がある場合はそれを表示
				pluginSettings.chatLog.map( ( item, index ) => (
					<RenderLog
						message={ item?.props?.message }
						response={ item?.props?.response }
						isLoaded={ true }
						index={ index }
						isLoading={ isLoading }
						isStreaming={ isStreaming }
						tipMessage={ tipMessage }
						onClickCopyToClipboardItem={ handleCopyToClipboardItem }
						onClickRegenerate={ () => handleRegenerate( item?.props?.message ) }
						onClickDeleteItem={ handleDeleteItem }
						isInEditor={ isInEditor }
					/>
				) )
			) }
			{ isStreaming && response && (
				// ストリーミング表示
				<RenderLog
					message={ message }
					response={ response }
					isLoaded={ false }
					isLoading={ isLoading }
					isStreaming={ isStreaming }
					tipMessage={ tipMessage }
					onClickCopyToClipboardItem={ handleCopyToClipboardItem }
					onClickRegenerate={ () => handleRegenerate( message ) }
					onClickDeleteItem={ handleDeleteItem }
					isInEditor={ isInEditor }
				/>
			) }
		</>
	)

	// メッセージ送信エリア
	const promptArea = (
		<PromptArea
			userCanManageSettings={ userCanManageSettings }
			message={ message }
			onChangeMessage={ newVal => setMessage( newVal ) }
			isLoading={ isLoading }
			openai={ openai }
			isStreaming={ isStreaming }
			onClickOperationSelectedText={ ( onToggle ) => {
				setSelectedTextTarget( 'selected text' )
				setSelectedText( getSelectedText() || '' )
				onToggle()
			} }
			onClickOperationClipboardText={ ( onToggle ) => {
				getClipboardText()
					.then( response => {
						setSelectedTextTarget( 'clipboard text' )
						setSelectedText( response || '' )
					} )
					.catch( error => {
						console.error( 'Failed to get the clipboard: ', error )
						setSelectedText( '' )
					} )
					.finally( () => {
						onToggle()
					} )
			} }
			setSelectedTextOperation={ setSelectedTextOperation }
			setSelectedTextOperationMessage={ setSelectedTextOperationMessage }
			selectedTextTarget={ selectedTextTarget }
			onClickClear={ () => handleClearAll() }
			onClickMagicPrompt={ () => handleMagicPrompt() }
			onClickContinue={ () => {
				setMessage( MESSAGE_PROMPT_CONTINUE )
				sendMessageByAsync( { messageText: MESSAGE_PROMPT_CONTINUE } )
			} }
			onClickSend={ () => {
				if ( ( gptModel.includes( 'gpt-4-vision' ) || gptModel.includes( 'gpt-4o' ) ) && Array.isArray( visionMediaData ) && visionMediaData?.length > 0 ) {
					// GPT-4-Visioｎ で画像認識の場合
					sendMessageToGPTVisionBySync( { messageText: message } )
				} else {
					sendMessageByAsync( { messageText: message } )
				}
			} }
			onClickReSend={ () => handleRegenerate( previousMessageRef.current ) }
			previousMessageRef={ previousMessageRef }
			errorMessage={ errorMessage }
			setErrorMessage={ setErrorMessage }
			model={ gptModel }
			onChangeModel={ newSelect => setGptModel( newSelect.selectedItem.key ) }
			language={ languageCode }
			onChangeLanguage={ newVal => setLanguageCode( newVal ) }
			contentStructure={ contentStructure }
			onChangeContentStructure={ newVal => setContentStructure( newVal ) }
			writingStyle={ writingStyle }
			onChangeWritingStyle={ newVal => setWritingStyle( newVal ) }
			writingTone={ writingTone }
			onChangeWritingTone={ newVal => setWritingTone( newVal ) }
			customPrompt={ customPrompt }
			onChangeCustomBehavior={ newVal => setCustomBehavior( newVal ) }
			visionMediaData={ visionMediaData }
			setVisionMediaData={ setVisionMediaData }
			fineTunedModels={ fineTunedModels }
		/>
	)

	// メインエリア
	return (
		<>
			<div className="dpaa-vertical-scrollable-area" ref={ scrollableRef }>
				<Flex direction='column' gap={ 5 }>
					{ logArea }
				</Flex>
			</div>
			{ promptArea }
			<TipMessage
				message={ tipMessage?.message || '' }
				actions={ tipMessage?.actions || [] }
				explicitDismiss={ tipMessage?.explicitDismiss || false }
				isLoading={ isLoading }
			/>
		</>
	)
}

export default ChatPanel