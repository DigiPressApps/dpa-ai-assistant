/**
 * Internal dependencies
 */
import './editor.scss'
import {
	TipMessage,
} from '@dpaa/components'
import { sendMessage as sendMessageToChatGPT } from '@dpaa/util'
import {
	DEFAULT_OPEN_AI_GPT_MODEL,
	DEFAULT_OPEN_AI_MAX_TOKENS,
	DEFAULT_OPEN_AI_TEMPERATURE,
	DEFAULT_OPEN_AI_TOP_P,
	DEFAULT_CHAT_LANGUAGE_CODE,
	DEFAULT_CHAT_WRITING_TONE,
	DEFAULT_CHAT_WRITING_STYLE,

	// 本文コンテンツ用
	DEFAULT_WRITER_SECTION_COUNT,
	DEFAULT_WRITER_PARAGRAPH_PER_SECTION,
	DEFAULT_WRITER_SECTION_HEADING_LEVEL,
	DEFAULT_WRITER_TITLE_MIN_CHARACTERS,
	DEFAULT_WRITER_TITLE_MAX_CHARACTERS,
	DEFAULT_WRITER_SECTION_TITLE_MIN_CHARACTERS,
	DEFAULT_WRITER_SECTION_TITLE_MAX_CHARACTERS,
	DEFAULT_WRITER_EXCERPT_MIN_CHARACTERS,
	DEFAULT_WRITER_EXCERPT_MAX_CHARACTERS,
	DEFAULT_WRITER_MIN_CONTENT_WORDS,
	// 目次
	DEFAULT_WRITER_IS_INSERT_TOC,
	DEFAULT_WRITER_IS_TOC_ORDERED_LIST,
	DEFAULT_WRITER_SHOW_TOC_TITLE,
	DEFAULT_WRITER_TOC_TITLE,
	DEFAULT_WRITER_TOC_TITLE_TAG,
	// イントロ
	DEFAULT_WRITER_IS_INCLUDE_INTRO,
	DEFAULT_WRITER_SHOW_INTRO_TITLE,
	DEFAULT_WRITER_INTRO_TITLE,
	DEFAULT_WRITER_INTRO_TITLE_TAG,
	// まとめ
	DEFAULT_WRITER_IS_INCLUDE_OUTRO,
	DEFAULT_WRITER_SHOW_OUTRO_TITLE,
	DEFAULT_WRITER_OUTRO_TITLE,
	DEFAULT_WRITER_OUTRO_TITLE_TAG,
} from '@dpaa/ai-assistant/constants'
import {
	SYSTEM_PROMPT,
	MAGIC_PROMPT_TOPICS,
	MESSAGE_MAGIC_PROMPT,
	MESSAGE_PROMPT_TITLE,
	MESSAGE_PROMPT_SECTIONS,
	MESSAGE_PROMPT_CONTENT,
	MESSAGE_PROMPT_CONTENT_INTRO,
	MESSAGE_PROMPT_CONTENT_OUTRO,
	MESSAGE_PROMPT_CONTENT_AT_LEAST_WORDS,
	MESSAGE_PROMPT_EXCERPT,
} from './system-prompt'
import { PromptArea } from './prompt-area'
import { RenderArea } from './render-area'
import { languageMap } from '../language-map'

/** 
 * External dependencies
 */
import Dexie from 'dexie';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Spinner,
	__experimentalSpacer as Spacer,
} from '@wordpress/components'
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element'

export const WriterPanel = ( props ) => {
	const {
		pluginSettings,
		openai,
		userCanManageSettings,
		isInEditor,
	} = props

	// OpenAI設定
	const openAISettings = pluginSettings?.openAISettings
	// チャット設定
	const textGenerationSettings = pluginSettings?.textGenerationSettings

	// Open API設定用
	const [ gptModel, setGptModel ] = useState( DEFAULT_OPEN_AI_GPT_MODEL )
	const [ maxTokens, setMaxTokens ] = useState( DEFAULT_OPEN_AI_MAX_TOKENS )
	const [ temperature, setTemperature ] = useState( DEFAULT_OPEN_AI_TEMPERATURE )
	const [ topP, setTopP ] = useState( DEFAULT_OPEN_AI_TOP_P )
	const [ fineTunedModels, setFineTunedModels ] = useState( null )

	// テキスト生成用
	const [ languageCode, setLanguageCode ] = useState( DEFAULT_CHAT_LANGUAGE_CODE )
	const [ writingTone, setWritingTone ] = useState( DEFAULT_CHAT_WRITING_TONE )
	const [ writingStyle, setWritingStyle ] = useState( DEFAULT_CHAT_WRITING_STYLE )

	// 記事コンテンツのステート
	const [ generateType, setGenerateType ] = useState( undefined )
	const [ generatedTitle, setGeneratedTitle ] = useState( undefined )
	const [ generatedSections, setGeneratedSections ] = useState( undefined )
	const [ generatedContent, setGeneratedContent ] = useState( undefined )
	const [ generatedExcerpt, setGeneratedExcerpt ] = useState( undefined )

	// 記事生成条件のステート
	const [ sectionCount, setSectionCount ] = useState( undefined )
	const [ paragraphPerSection, setParagraphPerSection ] = useState( undefined )
	const [ sectionHeadingLevel, setSectionHeadingLevel ] = useState( undefined )
	const [ titleMinCharacters, setTitleMinCharacters ] = useState( undefined )
	const [ titleMaxCharacters, setTitleMaxCharacters ] = useState( undefined )
	const [ sectionTitleMinCharacters, setSectionTitleMinCharacters ] = useState( undefined )
	const [ sectionTitleMaxCharacters, setSectionTitleMaxCharacters ] = useState( undefined )
	const [ excerptMinCharacters, setExcerptMinCharacters ] = useState( undefined )
	const [ excerptMaxCharacters, setExcerptMaxCharacters ] = useState( undefined )
	const [ minContentWords, setMinContentWords ] = useState( undefined )
	const [ isChainGeneration, setIsChainGeneration ] = useState( false )
	// 目次
	const [ isInsertTOC, setIsInsertTOC ] = useState( undefined )
	const [ isTOCOrderedList, setIsTOCOrderedList ] = useState( undefined )
	const [ showTOCTitle, setShowTOCTitle ] = useState( undefined )
	const [ tocTitle, setTocTitle ] = useState( undefined )
	const [ tocTitleTag, setTocTitleTag ] = useState( undefined )
	// イントロ
	const [ isIncludeIntro, setIsIncludeIntro ] = useState( undefined )
	const [ showIntroTitle, setShowIntroTitle ] = useState( undefined )
	const [ introTitle, setIntroTitle ] = useState( undefined )
	const [ introTitleTag, setIntroTitleTag ] = useState( undefined )
	// まとめ
	const [ isIncludeOutro, setIsIncludeOutro ] = useState( undefined )
	const [ showOutroTitle, setShowOutroTitle ] = useState( undefined )
	const [ outroTitle, setOutroTitle ] = useState( undefined )
	const [ outroTitleTag, setOutroTitleTag ] = useState( undefined )

	// プロンプト用
	const [ titlePrompt, setTitlePrompt ] = useState( MESSAGE_PROMPT_TITLE )
	const [ sectionsPrompt, setSectionsPrompt ] = useState( MESSAGE_PROMPT_SECTIONS )
	const [ contentPrompt, setContentPrompt ] = useState( MESSAGE_PROMPT_CONTENT )
	const [ excerptPrompt, setExcerptPrompt ] = useState( MESSAGE_PROMPT_EXCERPT )
	const [ messagePrompt, setMessagePrompt ] = useState( '' )

	// 生成フラグ
	const [ isGenerate, setIsGenerate ] = useState( false )

	// チップメッセージ表示用
	const [ tipMessage, setTipMessage ] = useState( { message: '', actions: [], explicitDismiss: false } )

	// system 用のプロンプトの初期化
	const [ systemPrompt, setSystemPrompt ] = useState( SYSTEM_PROMPT )
	// ユーザーのテキスト
	const [ topic, setTopic ] = useState( '' )
	// ローディング状態
	const [ isLoading, setIsLoading ] = useState( false )
	// エラーメッセージ用
	const [ errorMessage, setErrorMessage ] = useState( '' )

	// フォーム参照用
	const titleRef = useRef( undefined )
	const sectionsRef = useRef( undefined )
	const contentRef = useRef( undefined )
	const excerptRef = useRef( undefined )
	const countUpRef = useRef( undefined )

	// API 設定の取得
	useEffect( () => {
		if ( openAISettings ) {
			setGptModel( openAISettings?.gptModel || DEFAULT_OPEN_AI_GPT_MODEL )
			setMaxTokens( openAISettings?.maxTokens || DEFAULT_OPEN_AI_MAX_TOKENS )
			setTemperature( openAISettings?.temperature || DEFAULT_OPEN_AI_TEMPERATURE )
			setTopP( openAISettings?.topP || DEFAULT_OPEN_AI_TOP_P )
			setFineTunedModels( openAISettings?.fineTunedModels || null )
		}
	}, [ openAISettings ] )

	// チャット設定の取得
	useEffect( () => {
		if ( textGenerationSettings ) {
			setLanguageCode( textGenerationSettings?.language || DEFAULT_CHAT_LANGUAGE_CODE )
			setWritingTone( textGenerationSettings?.writingTone || DEFAULT_CHAT_WRITING_TONE )
			setWritingStyle( textGenerationSettings?.writingStyle || DEFAULT_CHAT_WRITING_STYLE )
		}
	}, [ textGenerationSettings ] )

	// Markdown用の見出しレベル判定(オブジェクトリテラル)
	const markdownHeadingLevelMap = {
		1: '#',
		2: '##',
		3: '###',
		4: '####',
		5: '#####',
		6: '######',
		
	};

	// 生成コンテンツの強制消去
	const clearGeneratedElements = () => {
		// ステートを空にする
		setGeneratedTitle( '' )
		setGeneratedSections( '' )
		setGeneratedContent( '' )
		setGeneratedExcerpt( '' )

		// ローカルストレージの削除
		indexedDB.contents.delete( 1 )
	}

	// IndexedDBデータベース用
	const [ indexedDB, setIndexedDB ] = useState( null )

	// ローカルデータ(indexedDB)の取得
	const fetchDataFromIndexedDB = async () => {
		try {
			if ( indexedDB ) {
				const data = await indexedDB.contents.get( 1 );

				// 本文コンテンツ
				if ( data?.title ) {
					setGeneratedTitle( data.title )
				}
				if ( data?.sections ) {
					setGeneratedSections( data.sections )
				}
				if ( data?.content ) {
					setGeneratedContent( data.content )
				}
				if ( data?.excerpt ) {
					setGeneratedExcerpt( data.excerpt )
				}

				// 生成条件
				setSectionCount( data?.sectionCount || DEFAULT_WRITER_SECTION_COUNT )
				setParagraphPerSection( data?.paragraphPerSection || DEFAULT_WRITER_PARAGRAPH_PER_SECTION )
				setSectionHeadingLevel( data?.sectionHeadingLevel || DEFAULT_WRITER_SECTION_HEADING_LEVEL )
				setTitleMinCharacters( data?.titleMinCharacters || DEFAULT_WRITER_TITLE_MIN_CHARACTERS )
				setTitleMaxCharacters( data?.titleMaxCharacters || DEFAULT_WRITER_TITLE_MAX_CHARACTERS )
				setSectionTitleMinCharacters( data?.sectionTitleMinCharacters || DEFAULT_WRITER_SECTION_TITLE_MIN_CHARACTERS )
				setSectionTitleMaxCharacters( data?.sectionTitleMaxCharacters || DEFAULT_WRITER_SECTION_TITLE_MAX_CHARACTERS )
				setExcerptMinCharacters( data?.excerptMinCharacters || DEFAULT_WRITER_EXCERPT_MIN_CHARACTERS )
				setExcerptMaxCharacters( data?.excerptMaxCharacters || DEFAULT_WRITER_EXCERPT_MAX_CHARACTERS )
				setMinContentWords( data?.minContentWords || DEFAULT_WRITER_MIN_CONTENT_WORDS )
				// 目次
				setTocTitle( data?.tocTitle || DEFAULT_WRITER_TOC_TITLE )
				setTocTitleTag( data?.tocTitleTag || DEFAULT_WRITER_TOC_TITLE_TAG )
				setShowTOCTitle( typeof data?.showTOCTitle === 'boolean' ? data?.showTOCTitle : DEFAULT_WRITER_SHOW_TOC_TITLE )
				setIsInsertTOC( typeof data?.isInsertTOC === 'boolean' ? data?.isInsertTOC : DEFAULT_WRITER_IS_INSERT_TOC )
				setIsTOCOrderedList( typeof data?.isTOCOrderedList === 'boolean' ? data?.isTOCOrderedList : DEFAULT_WRITER_IS_TOC_ORDERED_LIST )
				// イントロ
				setIsIncludeIntro( typeof data?.isIncludeIntro === 'boolean' ? data?.isIncludeIntro : DEFAULT_WRITER_IS_INCLUDE_INTRO )
				setShowIntroTitle( typeof data?.showIntroTitle === 'boolean' ? data?.showIntroTitle : DEFAULT_WRITER_SHOW_INTRO_TITLE )
				setIntroTitle( data?.introTitle || DEFAULT_WRITER_INTRO_TITLE )
				setIntroTitleTag( data?.introTitleTag || DEFAULT_WRITER_INTRO_TITLE_TAG )
				// まとめ
				setIsIncludeOutro( typeof data?.isIncludeOutro === 'boolean' ? data?.isIncludeOutro : DEFAULT_WRITER_IS_INCLUDE_OUTRO )
				setShowOutroTitle( typeof data?.showOutroTitle === 'boolean' ? data?.showOutroTitle : DEFAULT_WRITER_SHOW_OUTRO_TITLE )
				setOutroTitle( data?.outroTitle || DEFAULT_WRITER_OUTRO_TITLE )
				setOutroTitleTag( data?.outroTitleTag || DEFAULT_WRITER_OUTRO_TITLE_TAG )
			}
		} catch ( error ) {
			console.error('Error fetching data from IndexedDB:', error);
		}
	};
	// ローカルデータ(indexedDB)の更新(上書き保存)
	 const saveDataToIndexedDB = async ( data ) => {
		try {
			if ( indexedDB ) {
				await indexedDB.contents.put( {
					id: 1,
					title: data?.title || '',
					sections: data?.sections || '',
					content: data?.content || '',
					excerpt: data?.excerpt || '',

					// 生成条件
					sectionCount: data?.sectionCount || DEFAULT_WRITER_SECTION_COUNT,
					paragraphPerSection: data?.paragraphPerSection || DEFAULT_WRITER_PARAGRAPH_PER_SECTION,
					sectionHeadingLevel: data?.sectionHeadingLevel || DEFAULT_WRITER_SECTION_HEADING_LEVEL,
					titleMinCharacters: data?.titleMinCharacters || DEFAULT_WRITER_TITLE_MIN_CHARACTERS,
					titleMaxCharacters: data?.titleMaxCharacters || DEFAULT_WRITER_TITLE_MAX_CHARACTERS,
					sectionTitleMinCharacters: data?.sectionTitleMinCharacters || DEFAULT_WRITER_SECTION_TITLE_MIN_CHARACTERS,
					sectionTitleMaxCharacters: data?.sectionTitleMaxCharacters || DEFAULT_WRITER_SECTION_TITLE_MAX_CHARACTERS,
					excerptMinCharacters: data?.excerptMinCharacters || DEFAULT_WRITER_EXCERPT_MIN_CHARACTERS,
					excerptMaxCharacters: data?.excerptMaxCharacters || DEFAULT_WRITER_EXCERPT_MAX_CHARACTERS,
					minContentWords: data?.minContentWords || DEFAULT_WRITER_MIN_CONTENT_WORDS,

					// 目次
					isInsertTOC: typeof data?.isInsertTOC === 'boolean' ? data?.isInsertTOC : DEFAULT_WRITER_IS_INSERT_TOC,
					isTOCOrderedList: typeof data?.isTOCOrderedList === 'boolean' ? data?.isTOCOrderedList : DEFAULT_WRITER_IS_INSERT_TOC,
					showTOCTitle: typeof data?.showTOCTitle === 'boolean' ? data?.showTOCTitle : DEFAULT_WRITER_SHOW_TOC_TITLE,
					tocTitle: data?.tocTitle || DEFAULT_WRITER_TOC_TITLE,
					tocTitleTag: data?.tocTitleTag || DEFAULT_WRITER_TOC_TITLE_TAG,

					// イントロ
					isIncludeIntro: typeof data?.isIncludeIntro === 'boolean' ? data?.isIncludeIntro : DEFAULT_WRITER_IS_INCLUDE_INTRO,
					showIntroTitle: typeof data?.showIntroTitle === 'boolean' ? data?.showIntroTitle : DEFAULT_WRITER_SHOW_INTRO_TITLE,
					introTitle: data?.introTitle || DEFAULT_WRITER_INTRO_TITLE,
					introTitleTag: data?.introTitleTag || DEFAULT_WRITER_INTRO_TITLE_TAG,
					// まとめ
					isIncludeOutro: typeof data?.isIncludeOutro === 'boolean' ? data?.isIncludeOutro : DEFAULT_WRITER_IS_INCLUDE_OUTRO,
					showOutroTitle: typeof data?.showOutroTitle === 'boolean' ? data?.showOutroTitle : DEFAULT_WRITER_SHOW_OUTRO_TITLE,
					outroTitle: data?.outroTitle || DEFAULT_WRITER_OUTRO_TITLE,
					outroTitleTag: data?.outroTitleTag || DEFAULT_WRITER_OUTRO_TITLE_TAG,
				} );
			}
		} catch ( error ) {
			console.error('Error saving data to IndexedDB:', error);
		}
	};

	// ローカルストレージのレンダーログの取得(初回レンダリング時)
	useEffect(() => {
		setIsLoading( true )
		setTipMessage( {
			message: __( 'Loading...', dpaa.i18n ),
			actions: [],
			explicitDismiss: false
		} )
		// データベース(IndexedDB)を作成
		const db = new Dexie( 'generatedContents' );
		setIndexedDB( db )
	}, [] );

	// データベース作成時
	useEffect( () => {
		const loadIndexedDB = async () => {
			if ( indexedDB ) {
				// オブジェクトストア(テーブル)を作成
				indexedDB.version( 1 ).stores( {
					contents:
						'++id, title, sections, content, excerpt, sectionCount, paragraphPerSection, sectionHeadingLevel, titleMinCharacters, titleMaxCharacters, sectionTitleMinCharacters, sectionTitleMaxCharacters, excerptMinCharacters, excerptMaxCharacters, minContentWords, isInsertTOC, isTOCOrderedList, showTOCTitle, tocTitle, tocTitleTag, isIncludeIntro, showIntroTitle, introTitle, introTitleTag, isIncludeOutro, showOutroTitle, outroTitle, outroTitleTag'
				} );
				// ローカルデータの取得
				await fetchDataFromIndexedDB()

				setIsLoading( false );
				setTipMessage({
					message: '',
					actions: [],
					explicitDismiss: false
				});
			}
		}
		loadIndexedDB();
		
	}, [ indexedDB ] )

	// 投稿データの更新
	useEffect( () => {
		const data = {
			sectionCount: sectionCount,
			paragraphPerSection: paragraphPerSection,
			sectionHeadingLevel: sectionHeadingLevel,
			titleMinCharacters: titleMinCharacters,
			titleMaxCharacters: titleMaxCharacters,
			sectionTitleMinCharacters: sectionTitleMinCharacters,
			sectionTitleMaxCharacters: sectionTitleMaxCharacters,
			excerptMinCharacters: excerptMinCharacters,
			excerptMaxCharacters: excerptMaxCharacters,
			minContentWords: minContentWords,

			// 目次
			isInsertTOC: isInsertTOC,
			isTOCOrderedList: isTOCOrderedList,
			showTOCTitle: showTOCTitle,
			tocTitle: tocTitle,
			tocTitleTag: tocTitleTag,
			// イントロ
			isIncludeIntro: isIncludeIntro,
			showIntroTitle: showIntroTitle,
			introTitle: introTitle,
			introTitleTag: introTitleTag,
			// まとめ
			isIncludeOutro: isIncludeOutro,
			showOutroTitle: showOutroTitle,
			outroTitle: outroTitle,
			outroTitleTag: outroTitleTag,
		}

		if ( generatedTitle || generatedSections || generatedContent || generatedExcerpt ) {
			Object.assign(
				data,
				{
					title: generatedTitle,
					sections: generatedSections,
					content: generatedContent,
					excerpt: generatedExcerpt,
				}
			)
		}
	
		// ローカルデータの更新(上書き保存)
		saveDataToIndexedDB( data )
	}, [ generatedTitle, generatedSections, generatedContent, generatedExcerpt, sectionCount, paragraphPerSection, sectionHeadingLevel, titleMinCharacters, titleMaxCharacters, sectionTitleMinCharacters, sectionTitleMaxCharacters, excerptMinCharacters, excerptMaxCharacters, minContentWords,
		isInsertTOC,
		isTOCOrderedList,
		showTOCTitle,
		tocTitle,
		tocTitleTag,
		isIncludeIntro,
		showIntroTitle,
		introTitle,
		introTitleTag,
		isIncludeOutro,
		showOutroTitle,
		outroTitle,
		outroTitleTag ] )

	// システムプロンプトの整形
	useEffect( () => {
		const actualLanguage = languageMap[ languageCode ]
		const propmtLanguage = languageCode === 'auto'
			? 'Reply in the same language you recieved. '
			: `Always respond in ${ actualLanguage }, regardless of the language used by the user. `
		const promptTone = writingTone ? `Tone: ${ writingTone }. ` : ''
		const promptSyle = writingStyle ? `Style: ${ writingStyle }. ` : ''

		setSystemPrompt( `${ SYSTEM_PROMPT } ${ propmtLanguage }${ promptTone }${ promptSyle }` )
	}, [ languageCode, writingTone, writingStyle ] )

	// GPTとの通信
	useEffect( () => {
		const generate = async () => {
			if ( openai && isGenerate && generateType && messagePrompt ) {
				// ローディング表示開始
				setIsLoading( true )

				// GPTとのやりとり
				try {
					const response = await sendMessageToChatGPT( {
						systemPrompt: systemPrompt,
						message: messagePrompt,
						openai: openai,
						useStreaming: false,	// ストリーミングでの受信は無効
						model: gptModel,
						temperature: temperature,
						topP: topP,
						maxTokens: maxTokens,
						shouldReturnJson: false,
					} )

					setIsGenerate( false )
					setIsLoading( false )
					setTipMessage( { message: '', actions: [], explicitDismiss: false } )

					if ( response?.response && response?.response !== "I'm sorry, I cannot fulfill this request." ) {
						if ( generateType === 'magicPrompt' ) {
							// 一旦既存の結果をここで消去しておく
							clearGeneratedElements()
							// トピックをセット
							if ( response.response !== topic ) {
								setTopic( response.response )
							}
							// 生成されたトピックを渡してタイトルの生成を指示
							generateArticle( {
								type: 'title',
								topic: response.response,
							} )
						}
						else if ( generateType === 'title' ) {
							// タイトルの保持
							if ( response.response !== generatedTitle ) {
								setGeneratedTitle( response.response )
							}
							// 生成されたタイトルを渡してセクションタイトルの生成を指示
							if ( isChainGeneration ) {
								generateArticle( {
									type: 'sections',
									title: response.response,
								} )
							}
						}
						else if ( generateType === 'sections' ) {
							// セクションタイトルの保持
							if ( generatedSections !== response.response ) {
								setGeneratedSections( response.response )
							}
							// 生成されたタイトルを渡してセクションタイトルの生成を指示
							// セクションを再生成する場合は、isChainGeneration に関係なく本文とセットで生成する。
							generateArticle( {
								type: 'content',
								title: generatedTitle,
								sections: response.response,
							} )
						}
						else if ( generateType === 'content' ) {
							// 本文の保持(導入、まとめの指示を消す)
							const replacedIntroTitle = isIncludeIntro && showIntroTitle ? `${ markdownHeadingLevelMap[ parseInt( introTitleTag ) ] } ${ introTitle }\n` : ''
							const replacedOutroTitle = isIncludeOutro && showOutroTitle ? `${ markdownHeadingLevelMap[ parseInt( outroTitleTag ) ] } ${ outroTitle }\n` : ''
							const newContent = response.response.replace( /===INTRO===\s*\n/g, replacedIntroTitle ).replace( /===OUTRO===\s*\n/g, replacedOutroTitle )


							console.dir( { newContent, replacedIntroTitle } );

							if ( newContent !== generatedContent ) {
								setGeneratedContent( newContent )
							}
							// 生成されたタイトルを渡して抜粋の生成を指示
							if ( isChainGeneration ) {
								generateArticle( {
									type: 'excerpt',
									title: generatedTitle,
								} )
							}
						}
						else if ( generateType === 'excerpt' ) {
							// 抜粋の保持
							if ( response.response !== generatedExcerpt ) {
								setGeneratedExcerpt( response.response )
							}
						}
					} else {
						console.error( 'Invalid response: ', response )
						setErrorMessage( __( 'Invalid response', dpaa.i18n ) )
					}
				} catch ( error ) {
					console.error( error )
					setErrorMessage( error )
					setIsGenerate( false )
					setIsLoading( false )
				}
			}
		}

		generate();
	},[ isGenerate, messagePrompt, generateType ] )

	// メインジェネレータ(記事生成処理)
	const generateArticle = useCallback( ( props ) => {
		const {
			type = '',
			topic = '',
			title = '',
			excerpt = '',
			sections = '',
		} = props

		setGenerateType( type )

		switch ( type ) {
			case 'magicPrompt':
				// 進捗メッセージ
				setTipMessage( {
					message: sprintf( __( 'Generating %s...', dpaa.i18n ),__( 'Topic', dpaa.i18n ) ),
					actions: [],
					explicitDismiss: false
				} )
				// 趣味の候補からランダムに一つ選んでトピックを生成させるプロンプト
				const randomHobby = MAGIC_PROMPT_TOPICS[ Math.floor( Math.random() * MAGIC_PROMPT_TOPICS.length ) ];
				setMessagePrompt( MESSAGE_MAGIC_PROMPT.replaceAll( '{HOBBY}', randomHobby ) )
				setIsGenerate( true )
				break;
			case 'title':
				if ( topic ) {
					// 進捗メッセージ
					setTipMessage( {
						message: sprintf( __( 'Generating %s...', dpaa.i18n ), __( 'Title', dpaa.i18n ) ),
						actions: [],
						explicitDismiss: false
					} )
					// タイトル生成用のプロンプト
					setMessagePrompt( titlePrompt.replaceAll( '{TOPIC}', topic ).replace( '{TITLE_MIN}', titleMinCharacters ).replace( '{TITLE_MAX}', titleMaxCharacters ) )
					setIsGenerate( true )
				}
				break;
			case 'sections':
				if ( title ) {
					// 進捗メッセージ
					setTipMessage( {
						message: sprintf( __( 'Generating %s...', dpaa.i18n ), __( 'Sections', dpaa.i18n ) ),
						actions: [],
						explicitDismiss: false
					} )
					// セクションタイトル生成用のプロンプト
					setMessagePrompt( sectionsPrompt.replace( '{SECTION_COUNT}', sectionCount ).replaceAll( '{TITLE}', title ).replace( '{HEADING_LEVEL}', sectionHeadingLevel ).replace( '{SECTION_TITLE_MIN}', titleMinCharacters ).replace( '{SECTION_TITLE_MAX}', titleMaxCharacters ) )
					setIsGenerate( true )
				}
				break;
			case 'content':
				if ( title && sections ) {
					// 進捗メッセージ
					setTipMessage( {
						message: sprintf( __( 'Generating %s...', dpaa.i18n ), __( 'Post Content', dpaa.i18n ) ),
						actions: [],
						explicitDismiss: false
					} )
					// 本文生成用のプロンプト
					let contentMessagePrompt = contentPrompt.replaceAll( '{TITLE}', title ).replace( '{SECTIONS}', sections ).replace( '{PARAGRAPHS_PER_SECTION}', paragraphPerSection ).replace( '{HEADING_LEVEL}', sectionHeadingLevel )
					// 最低文字数
					if ( minContentWords ) {
						contentMessagePrompt += ` ${ MESSAGE_PROMPT_CONTENT_AT_LEAST_WORDS.replace( '{MIN_CONTENT_WORDS}', minContentWords ) }`
					}
					// 導入を挿入する場合
					if( isIncludeIntro ) {
						contentMessagePrompt += ` ${ MESSAGE_PROMPT_CONTENT_INTRO }`
					}
					// まとめを挿入する場合
					if( isIncludeOutro ) {
						contentMessagePrompt += ` ${ MESSAGE_PROMPT_CONTENT_OUTRO }`
					}

					setMessagePrompt( contentMessagePrompt )
					setIsGenerate( true )
				}
				break;
			case 'excerpt':
				if ( title ) {
					// 進捗メッセージ
					setTipMessage( {
						message: sprintf( __( 'Generating %s...', dpaa.i18n ), __( 'Excerpt', dpaa.i18n ) ),
						actions: [],
						explicitDismiss: false
					} )
					// 抜粋生成用のプロンプト
					setMessagePrompt( excerptPrompt.replaceAll( '{TITLE}', title ).replace( '{EXCERPT_MIN}', excerptMinCharacters ).replace( '{EXCERPT_MAX}', excerptMaxCharacters ) )
					setIsGenerate( true )
				}
				break;
			default:
				setIsGenerate( false )
				break;
		}
	}, [ isGenerate, isLoading, generateType, tipMessage, messagePrompt,
		isInsertTOC,
		isTOCOrderedList,
		sectionCount, paragraphPerSection, titlePrompt, sectionsPrompt, contentPrompt, excerptPrompt ] )

	// マジックプロンプトハンドラー
	const handleMagicPrompt = () => {
		// 連続生成フラグをオンにする
		setIsChainGeneration( true )
		// マジックプロンプトで自動生成
		generateArticle( {
			type: 'magicPrompt',
		} )
	}

	// 記事生成ハンドラー
	const handleGenerateAll = ( { topic } ) => {
		// 一旦既存の結果をここで消去しておく
		clearGeneratedElements()
		// 連続生成フラグをオンにする
		setIsChainGeneration( true )
		// 新規生成を指示
		generateArticle( {
			type: 'title',
			topic: topic
		} )
	}

	// タイトルの生成ハンドラー
	const handleGenerateTitle = () => {
		if ( topic ) {
			// 連続生成フラグをオフにする
			setIsChainGeneration( false )
			// タイトルのみ生成
			generateArticle( {
				type: 'title',
				topic: topic
			} )
		}
	}

	// セクションの生成ハンドラー
	const handleGenerateSections = () => {
		if ( generatedTitle ) {
			// 連続生成フラグをオフにする
			setIsChainGeneration( false )
			// セクションのみ生成
			generateArticle( {
				type: 'sections',
				title: generatedTitle,
			} )
		}
	}

	// 本文生成ハンドラー
	const handleGenerateContent = () => {
		if ( generatedTitle && generatedSections ) {
			// 連続生成フラグをオフにする
			setIsChainGeneration( false )
			// 本文のみ生成
			generateArticle( {
				type: 'content',
				title: generatedTitle,
				sections: generatedSections,
			} )
		}
	}

	// 概要生成ハンドラー
	const handleGenerateExcerpt = () => {
		if ( generatedTitle ) {
			// 連続生成フラグをオフにする
			setIsChainGeneration( false )
			// 抜粋のみ生成
			generateArticle( {
				type: 'excerpt',
				title: generatedTitle,
			} )
		}
	}

	// トピック消去ハンドラー
	const handleClear = () => {
		setTopic( '' )
	}

	// メッセージ送信エリア
	const promptArea = (
		<PromptArea
			userCanManageSettings={ userCanManageSettings }
			fineTunedModels={ fineTunedModels }
			topic={ topic }
			onChangeTopic={ newVal => setTopic( newVal ) }
			isLoading={ isLoading }
			openai={ openai }
			errorMessage={ errorMessage }
			model={ gptModel }
			onChangeModel={ newVal => setGptModel( newVal ) }
			language={ languageCode }
			onChangeLanguage={ newVal => setLanguageCode( newVal ) }
			writingStyle={ writingStyle }
			onChangeWritingStyle={ newVal => setWritingStyle( newVal ) }
			writingTone={ writingTone }
			onChangeWritingTone={ newVal => setWritingTone( newVal ) }
			onClickMagicPrompt={ () => handleMagicPrompt() }
			onClickGenerate={ () => handleGenerateAll( { topic: topic } ) }
			onClickClear={ () => handleClear() }

			sectionCount={ sectionCount }
		/>
	)

	// レンダーエリア
	const renderArea = (
		<Spacer marginBottom={ 2 }>
			<RenderArea
				openai={ openai }
				clearGeneratedElements={ clearGeneratedElements }
				isInEditor={ isInEditor }
				setErrorMessage={ setErrorMessage }
				setTipMessage={ setTipMessage }
				topic={ topic }
				title={ generatedTitle }
				titleRef={ titleRef }
				onChangeTitle={ newVal => setGeneratedTitle( newVal ) }
				setIsLoading={ setIsLoading }
				isLoading={ isLoading }
				sections={ generatedSections }
				sectionsRef={ sectionsRef }
				onChangeSections={ newVal => setGeneratedSections( newVal ) }
				content={ generatedContent }
				contentRef={ contentRef }
				onChangeContent={ newVal => setGeneratedContent( newVal ) }
				excerpt={ generatedExcerpt }
				excerptRef={ excerptRef }
				onChangeExcerpt={ newVal => setGeneratedExcerpt( newVal ) }
				sectionCount={ sectionCount }
				onChangeSectionCount={ newVal => setSectionCount( newVal ) }
				sectionHeadingLevel={ sectionHeadingLevel }
				onChangeSectionHeadingLevel={ newVal => setSectionHeadingLevel( newVal ) }
				paragraphPerSection={ paragraphPerSection }
				onChangeParagraphPerSection={ newVal => setParagraphPerSection( newVal ) }
				titleMinCharacters={ titleMinCharacters }
				onChangeTitleMinCharacters={ newVal => setTitleMinCharacters( newVal ) }
				titleMaxCharacters={ titleMaxCharacters }
				onChangeTitleMaxCharacters={ newVal => setTitleMaxCharacters( newVal ) }
				sectionTitleMinCharacters={ sectionTitleMinCharacters }
				onChangeSectionTitleMinCharacters={ newVal => setSectionTitleMinCharacters( newVal ) }
				sectionTitleMaxCharacters={ sectionTitleMaxCharacters }
				onChangeSectionTitleMaxCharacters={ newVal => setSectionTitleMaxCharacters( newVal ) }
				excerptMinCharacters={ excerptMinCharacters }
				onChangeExcerptMinCharacters={ newVal => setExcerptMinCharacters( newVal ) }
				excerptMaxCharacters={ excerptMaxCharacters }
				onChangeExcerptMaxCharacters={ newVal => setExcerptMaxCharacters( newVal ) }
				minContentWords= { minContentWords }
				onChangeMinContentWords={ newVal => setMinContentWords( newVal ) }
				onClickGenerateTitle={ () => handleGenerateTitle() }
				onClickGenerateSections={ () => handleGenerateSections() }
				onClickGenerateContent={ () => handleGenerateContent() }
				onClickGenerateExcerpt={ () => handleGenerateExcerpt() }
				// イントロ
				isIncludeIntro={ isIncludeIntro }
				onChangeIsIncludeIntro={ newVal => setIsIncludeIntro( newVal ) }
				showIntroTitle={ showIntroTitle }
				onChangeShowIntroTitle={ newVal => setShowIntroTitle( newVal ) }
				introTitle={ introTitle }
				onChangeIntroTitle={ newVal => setIntroTitle( newVal ) }
				introTitleTag={ introTitleTag }
				onChangeIntroTitleTag={ newVal => setIntroTitleTag( newVal ) }
				// まとめ
				isIncludeOutro={ isIncludeOutro }
				onChangeIsIncludeOutro={ newVal => setIsIncludeOutro( newVal ) }
				showOutroTitle={ showOutroTitle }
				onChangeShowOutroTitle={ newVal => setShowOutroTitle( newVal ) }
				outroTitle={ outroTitle }
				onChangeOutroTitle={ newVal => setOutroTitle( newVal ) }
				outroTitleTag={ outroTitleTag }
				onChangeOutroTitleTag={ newVal => setOutroTitleTag( newVal ) }

				// 目次用
				isInsertTOC={ isInsertTOC }
				onChangeIsInsertTOC={ newVal => setIsInsertTOC( newVal ) }
				isTOCOrderedList={ isTOCOrderedList }
				onChangeIsTOCOrderedList={ () => setIsTOCOrderedList( !isTOCOrderedList ) }
				showTOCTitle={ showTOCTitle }
				onChangeShowTOCTitle={ newVal => setShowTOCTitle( newVal ) }
				tocTitle={ tocTitle }
				onChangeTocTitle={ newVal => setTocTitle( newVal ) }
				tocTitleTag={ tocTitleTag }
				onChangeTocTitleTag={ newVal => setTocTitleTag( newVal ) }
			/>
		</Spacer>
	)

	return (
		<>
			{ promptArea }
			{ indexedDB ? renderArea : <Spinner /> }
			<TipMessage
				message={ tipMessage?.message || '' }
				actions={ tipMessage?.actions || [] }
				explicitDismiss={ tipMessage?.explicitDismiss || false }
				isLoading={ isLoading }
				countUpRef={ countUpRef } 
			/>
		</>
	)
}