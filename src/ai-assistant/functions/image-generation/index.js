/**
 * Internal dependencies
 */
import './editor.scss'
import {
	ConditionalWrapper,
	TipMessage,
} from '@dpaa/components'
import {
	sendMessage as sendMessageToChatGPT,
	generateImageByStabilityAI,
	generateImageByOpenAI,
	imageToClipboard,
} from '@dpaa/util'
// import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	DEFAULT_OPEN_AI_DALL_E_MODEL,
	DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES,
	DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE,
	DEFAULT_OPEN_AI_DALL_E_QUALITY,
	DEFAULT_STABILITY_AI_API_HOST,
	DEFAULT_STABILITY_AI_API_VERSION,
	DEFAULT_STABILITY_AI_MODEL,
	DEFAULT_STABILITY_AI_TYPE,
	DEFAULT_STABILITY_AI_STYLE,
	DEFAULT_STABILITY_AI_WIDTH,
	DEFAULT_STABILITY_AI_HEIGHT,
	DEFAULT_STABILITY_AI_CFG_SCALE,
	DEFAULT_STABILITY_AI_STEPS,
	DEFAULT_STABILITY_AI_SAMPLES,
	DEFAULT_IMAGE_ENGINE,
	DEFAULT_UPLOAD_FILE_PREFIX,
	DEFAULT_IMAGE_MAX_VISIBLE_IMAGE_LOGS,
	DEFAULT_OPEN_AI_GPT_MODEL,
	DEFAULT_OPEN_AI_DALL_E_STYLE,
} from '@dpaa/ai-assistant/constants'
import {
	SYSTEM_PROMPT_TRANSLATE_ENGLISH,
	SYSTEM_PROMPT_GENERATE_IMAGE_RANDOM,
	USER_PROMPT_RANDOM,
	MAGIC_PROMPT_TOPICS,
} from './system-prompt'
import { RenderLog } from './render-log'
import { PromptArea } from './prompt-area'

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

/**
 * External dependencies
 */
import Dexie from 'dexie';

export const ImageGenerationPanel = ( props ) => {
	const {
		pluginSettings,
		openai,
		userCanManageSettings,
		isInEditor,
	} = props

	const currentDate = new Date().toISOString().replace(/[-T:]/g, '-').slice(0, 16);

	// 翻訳指示用システムプロンプト(ChatGPT)
	const [ gptSystemPrompt, setGptSystemPrompt ] = useState( SYSTEM_PROMPT_TRANSLATE_ENGLISH )

	const generalSettings = pluginSettings?.generalSettings
	const imageGenerationSettings = pluginSettings?.imageGenerationSettings
	const stabilityAISettings = pluginSettings?.stabilityAISettings
	const openAISettings = pluginSettings?.openAISettings

	const [ openAIApiKey, setOpenAIApiKey ] = useState( '' )
	const [ gptModel, setGptModel ] = useState( DEFAULT_OPEN_AI_GPT_MODEL )
	const [ dallEModel, setDallEModel ] = useState( DEFAULT_OPEN_AI_DALL_E_MODEL )
	const [ dallENumberImages, setDallENumberImages ] = useState( DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES )
	const [ dallEImageSize, setDallEImageSize ] = useState( null )
	const [ dallEQuality, setDallEQuality ] = useState( DEFAULT_OPEN_AI_DALL_E_QUALITY )
	const [ dallEStyle, setDallEStyle ] = useState( DEFAULT_OPEN_AI_DALL_E_STYLE )

	const [ engine, setEngine ] = useState( DEFAULT_IMAGE_ENGINE )
	const [ uploadFilePrefix, setUploadFilePrefix ] = useState( DEFAULT_UPLOAD_FILE_PREFIX )
	const [ maxVisibleImageLogs, setMaxVisibleGeneratedImageLogs ] = useState( DEFAULT_IMAGE_MAX_VISIBLE_IMAGE_LOGS )
	const [ stabilityAIApiKey, setStabilityAIApiKey ] = useState( null )
	const [ stabilityAIApiVersion, setStabilityAIApiVersion ] = useState( DEFAULT_STABILITY_AI_API_VERSION )
	const [ stableDiffusionGenerateType, setStableDiffusionGenerateType ] = useState( DEFAULT_STABILITY_AI_TYPE )
	const [ stableDiffusionModel, setStableDiffusionModel ] = useState( DEFAULT_STABILITY_AI_MODEL )
	const [ stableDiffusionStyle, setStableDiffusionStyle ] = useState( DEFAULT_STABILITY_AI_STYLE )
	const [ stableDiffusionWidth, setStableDiffusionWidth ] = useState( DEFAULT_STABILITY_AI_WIDTH )
	const [ stableDiffusionHeight, setStableDiffusionHeight ] = useState( DEFAULT_STABILITY_AI_HEIGHT )
	const [ stableDiffusionDimensions, setStableDiffusionDimensions ] = useState( null )
	const [ stableDiffusionCfgScale, setStableDiffusionCfgScale ] = useState( DEFAULT_STABILITY_AI_CFG_SCALE )
	const [ stableDiffusionSteps, setStableDiffusionSteps ] = useState( DEFAULT_STABILITY_AI_STEPS )
	const [ stableDiffusionSamples, setStableDiffusionSamples ] = useState( DEFAULT_STABILITY_AI_SAMPLES )

	// トランスクリプション設定用
	const [ transcriptionSettings, setTranscriptionSettings ] = useState( null )

	// API 設定の取得
	useEffect( () => {
		if ( stabilityAISettings ) {
			setStabilityAIApiKey( stabilityAISettings?.apiKey || null )
			setStableDiffusionModel( stabilityAISettings?.model || DEFAULT_STABILITY_AI_MODEL )
			setStableDiffusionStyle( stabilityAISettings?.style || DEFAULT_STABILITY_AI_STYLE )
			setStableDiffusionWidth( stabilityAISettings?.width || DEFAULT_STABILITY_AI_WIDTH )
			setStableDiffusionHeight( stabilityAISettings?.height || DEFAULT_STABILITY_AI_HEIGHT )
			setStableDiffusionDimensions( stabilityAISettings?.dimensions || null )
			setStableDiffusionCfgScale( stabilityAISettings?.cfgScale || DEFAULT_STABILITY_AI_CFG_SCALE )
			setStableDiffusionSteps( stabilityAISettings?.steps || DEFAULT_STABILITY_AI_STEPS )
			setStableDiffusionSamples( stabilityAISettings?.samples || DEFAULT_STABILITY_AI_SAMPLES )
		}
	}, [ stabilityAISettings ] )
	useEffect( () => {
		if ( openAISettings ) {
			setOpenAIApiKey( openAISettings?.apiKey || null )
			setGptModel( openAISettings?.gptModel || DEFAULT_OPEN_AI_GPT_MODEL )
			setDallEModel( openAISettings?.imageGeneration?.dallEModel || DEFAULT_OPEN_AI_DALL_E_MODEL )
			setDallENumberImages( openAISettings?.imageGeneration?.numberImages || DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES )
			setDallEImageSize( openAISettings?.imageGeneration?.imageSize || DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE )
			setDallEQuality( openAISettings?.imageGeneration?.quality || DEFAULT_OPEN_AI_DALL_E_QUALITY )
			setDallEStyle( openAISettings?.imageGeneration?.dallEStyle || DEFAULT_OPEN_AI_DALL_E_STYLE )
			setTranscriptionSettings( openAISettings?.transcription || null )
		}
	}, [ openAISettings ] )
	useEffect( () => {
		if ( imageGenerationSettings ) {
			setEngine( imageGenerationSettings?.engine || DEFAULT_IMAGE_ENGINE )
			setMaxVisibleGeneratedImageLogs( imageGenerationSettings?.maxVisibleImageLogs || DEFAULT_IMAGE_MAX_VISIBLE_IMAGE_LOGS )
		}
	}, [ imageGenerationSettings ] )
	useEffect( () => {
		if ( generalSettings ) {
			setUploadFilePrefix( generalSettings?.uploadFilePrefix || DEFAULT_UPLOAD_FILE_PREFIX )
		}
	}, [ generalSettings ] )

	// エンジンのチェック
	useEffect( () => {
		if ( stabilityAIApiKey || openAIApiKey ) {
			if ( engine === 'stable-diffusion' && !stabilityAIApiKey ) {
				setEngine( 'dall-e' )
			}
			if ( engine === 'dall-e' && !openAIApiKey ) {
				setEngine( 'stable-diffusion' )
			}
		}
	}, [ stabilityAIApiKey, openAIApiKey, engine ] )

	// ラッパー要素への参照用
	const scrollableRef = useRef( undefined );

	// プロンプト
	const [ imagePrompt, setImagePrompt ] = useState( '' )
	// ログ記録用
	const [ generatedImages, setGeneratedImages ] = useState( [] )
	// ローディング状態
	const [ isLoading, setIsLoading ] = useState( false )
	// 前回のメッセージの保持、比較用
	const previousImagePromptRef = useRef( '' );
	// エラーメッセージ用
	const [ errorMessage, setErrorMessage ] = useState( '' )
	// レンダリング用のログ
	const [ renderedLog, setRenderedLog ] = useState( null )
	// チップメッセージ表示用
	const [ tipMessage, setTipMessage ] = useState( { message: '' } )
	// ストリーム画像用
	// const imageFileInputRef = useRef( undefined )
	// const [ binaryInputImage, setBinaryInputImage ] = useState( null )

	// IndexedDBデータベース用
	const [ indexedDB, setIndexedDB ] = useState( null )

	// ローカルデータ(indexedDB)の取得
	const fetchDataFromIndexedDB = async () => {
		try {
			if ( indexedDB ) {
				const data = await indexedDB.images.get( 1 );
				if ( data?.generatedImage ) {
					setRenderedLog( JSON.parse( data.generatedImage ) );
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
				await indexedDB.images.put( {
					id: 1,
					generatedImage: primitiveData
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
		const db = new Dexie( 'generatedImageLog' );
		setIndexedDB( db )
	}, [] );

	// データベース作成時
	useEffect( () => {
		if ( indexedDB ) {
			// オブジェクトストア(テーブル)を作成
			indexedDB.version( 1 ).stores({
				images: '++id, generatedImage'
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

	// 画像生成
	const handleImageGeneration = useCallback( async ( props ) => {

		let base64Images = null

		try {
			if ( engine === 'dall-e' && openAIApiKey ) {
				// DALL-E
				try {
					base64Images = await generateImageByOpenAI( {
						prompt: props.prompt,
						openai: openai,
						n: dallENumberImages,	// dall-e-3 は「1」のみ
						model: dallEModel,
						size: dallEImageSize,
						mode: 'generate',	// または variation
						format: 'b64_json',	// または url
						image: null,
					} )
				} catch ( error ) {
					handleError( error )
				}
			} else {
				// StableDiffusion
				try {
					base64Images = await generateImageByStabilityAI( {
						prompt: props.prompt,
						apiKey: stabilityAIApiKey,
						apiHost: DEFAULT_STABILITY_AI_API_HOST,
						apiVersion: stabilityAIApiVersion,
						type: stableDiffusionGenerateType,
						model: stableDiffusionModel,
						cfgScale: stableDiffusionCfgScale,
						width: stableDiffusionWidth,
						height: stableDiffusionHeight,
						dimensions: stableDiffusionDimensions,
						steps: stableDiffusionSteps,
						samples: stableDiffusionSamples,
						style: stableDiffusionStyle,
						// inputImage: binaryInputImage,	// image-to-image 用。現時点では未使用。
						setErrorMessage: setErrorMessage,
					} )
				} catch ( error ) {
					handleError( error )
				}
			}
		} catch ( error ) {
			handleError( error )
		} finally {
			if ( base64Images && Array.isArray( base64Images ) ) {
				// Base64フォーマットのテキストの配列
				setGeneratedImages( base64Images )
			}
			return base64Images
		}
	}, [ openAIApiKey, dallENumberImages, dallEModel, dallEImageSize, stabilityAIApiKey, stabilityAIApiVersion, stableDiffusionGenerateType, stableDiffusionModel, stableDiffusionCfgScale, stableDiffusionWidth, stableDiffusionHeight, stableDiffusionSteps, stableDiffusionSamples, stableDiffusionStyle ] )

	// エラーメッセージの格納
	const handleError = ( error ) => {
		setTipMessage( { message: '' } )
		if ( error?.response ) {
			setErrorMessage( error.response.status )
			console.error( { 'Error status: ': error.response.status, 'Data: ': error.response.data } )
		} else if ( error?.message ) {
			setErrorMessage( error.message )
			console.error( 'Error: ', error.message )
		} else {
			setErrorMessage( error )
			console.error( 'Error: ', error )
		}
	}

	// 画像生成コールバック
	const callbackGenerateImage = useCallback( async ( props ) => {
		const {
			prompt = imagePrompt,
			gptPrompt = SYSTEM_PROMPT_TRANSLATE_ENGLISH,
			tipNoPrompt = __( 'No prompt!', dpaa.i18n ),
			isMagic = false,
			isTranscription = false,
			// inputImage = binaryInputImage,
		} = props

		if ( ( isLoading && !isTranscription ) || ( engine === 'stable-diffusion' && !stabilityAIApiKey ) || ( engine === 'dall-e' && !openAIApiKey ) ) {
			return
		}

		if ( !prompt ) {
			setTipMessage( { message: tipNoPrompt } )
			setTimeout( () => {
				setTipMessage( { message: '' } )
			}, 2000 )
			console.error( 'No prompt!' )
			return
		}

		let base64Images = null

		try {
			// APIリクエストを開始する前にローディング表示を開始
			setIsLoading( true )
			setTipMessage( { message: __( 'Generating...', dpaa.i18n ) } )
			// エラーメッセージをクリア
			setErrorMessage( '' )

			// 今回のプロンプトを保持
			previousImagePromptRef.current = prompt

			// 英語以外の場合は 一旦 ChatGPT にプロンプトを翻訳させる
			if ( openAIApiKey ) {
				// プロンプトを翻訳
				try {
					const response = await sendMessageToChatGPT( {
						apiKey: openAIApiKey,
						systemPrompt: gptPrompt,
						message: prompt,
						useStreaming: false,
						model: gptModel,
					} )

					if ( response?.response ) {
						// 画像生成
						base64Images = await handleImageGeneration( {
							prompt: response.response
						} )

						// マジックプロンプトの場合
						if ( isMagic ) {
							previousImagePromptRef.current = response.response
							// マジックプロンプトの場合はOpenAIから受け取ったメッセージをプロンプトとしてここで保持
							setImagePrompt( response.response )
						}
					} else {						
						setErrorMessage( __( 'Failed to translate the prompt.', dpaa.i18n ) )
					}
				} catch ( error ) {
					handleError( error )
				}
			} else {
				// 画像生成
				base64Images = await handleImageGeneration( {
					prompt: prompt,
				} )
			}
		} catch ( error ) {
			handleError( error )
		} finally {
			setIsLoading( false )
			setTipMessage( { message: '' } )
		}
	}, [ openAIApiKey, stabilityAIApiVersion, dallEModel, engine, imagePrompt, dallENumberImages, dallEModel, dallEImageSize, stabilityAIApiKey, stableDiffusionGenerateType, stableDiffusionModel, stableDiffusionCfgScale, stableDiffusionWidth, stableDiffusionHeight, stableDiffusionSteps, stableDiffusionSamples, stableDiffusionStyle, tipMessage, isLoading, errorMessage ] );

	// 各ログの削除ボタンのコールバック
	const handleDeleteItem = ( index ) => {
		// 新規画像が追加された後(renderedLog にデータがある場合)
		if ( Array.isArray( renderedLog ) && renderedLog.length > 0 ) {
			// ログの配列をコピー
			const copyRenderedLog = [ ...renderedLog ]
			// 指定されたインデックスのアイテムを削除
			copyRenderedLog.splice( index, 1 )
			setRenderedLog( copyRenderedLog )
			
		}
	}

	// ダウンロード
	const handleDownload = ( base64Image ) => {
		const link = document.createElement( 'a' );
		link.href = `data:image/png;base64,${ base64Image }`;
		link.download = `generated-${ currentDate }.png`;
		link.click();
	}

	// 画像生成ハンドラー
	const handleGenerate = async ( props ) => {
		const {
			prompt = null,
			gptPrompt = SYSTEM_PROMPT_TRANSLATE_ENGLISH,
			isMagic = false,
			isRegenerate = false,
			isTranscription = false,
		} = props

		if ( !prompt || !gptPrompt ) {
			return
		}
		if ( isRegenerate ) {
			if ( !window.confirm( __( 'Are you sure you want to regenerate?', dpaa.i18n ) ) ) {
				return
			}
		}

		try{
			setIsLoading( true )

			// マジックプロンプト(ランダムメッセージ)の場合
			let currentPrompt = prompt
			if ( isMagic ) {
				// 趣味の候補からランダムに一つ選んでトピックを生成させるプロンプト
				const randomTopic = MAGIC_PROMPT_TOPICS[ Math.floor( Math.random() * MAGIC_PROMPT_TOPICS.length ) ];
				// ランダムメッセージ
				currentPrompt = USER_PROMPT_RANDOM.replace( '{TOPIC}', randomTopic )
			} else {
				// マジックプロンプトでは最初の生成指示文は保持させない
				setImagePrompt( currentPrompt )
			}

			setStableDiffusionGenerateType( 'text-to-image' )
			setGptSystemPrompt( gptPrompt )
			await callbackGenerateImage( {
				prompt: currentPrompt,
				gptPrompt: gptPrompt,
				isMagic: isMagic,
				isTranscription: isTranscription,
			} )
		} catch ( error ) {
			setErrorMessage( error );
			console.error( error );
		} finally {
			setIsLoading( false )
		}
	}

	// 履歴全クリアハンドラー
	const handleClearAll = () => {
		if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
			// レンダー済み要素の削除
			setRenderedLog( [] )
			// 内部ログ(履歴データ)の削除
			setGeneratedImages( [] )
			// ローカルストレージの削除
			indexedDB.images.delete( 1 )
		}
	}

	// コピーボタンのコールバック
	const handleCopyToClipboardItem = async ( base64Data ) => {
		let result = false
		try {
			setIsLoading( true )
			result = await imageToClipboard( { base64Data } )

		} catch ( error ) {
			console.error( error )
			alert( error )
		} finally {
			setIsLoading( false )
			if ( result ){
				setTipMessage( { message: __( 'Copied!', dpaa.i18n ) } )
				setTimeout(() => {
					setTipMessage( { message: '' } )
				}, 2000 );
			}
		}
	}

	// 画像データの受け取りが完了したらレンダリングして蓄積
	useEffect( () => {
		if ( Array.isArray( generatedImages ) && generatedImages.length > 0 ) {

			// 画像生成履歴(配列)を蓄積して重複するアイテムを削除
			const newRenderedLog = Array.from( new Set( [
				...( renderedLog || [] ),
				<RenderLog
					prompt={ previousImagePromptRef?.current }
					arrayImages={ generatedImages }
					isLoaded={ true }
					isLoading={ isLoading }
					inidex={ renderedLog?.length || 0 }
					onClickCopyToClipboardItem ={ handleCopyToClipboardItem }
					onClickDeleteItem ={ handleDeleteItem }
					onClickDownload={ handleDownload }
					onClickRegenerate={ () => handleGenerate( {
						prompt: previousImagePromptRef?.current,
						gptPrompt: SYSTEM_PROMPT_TRANSLATE_ENGLISH,
						isMagic: false,
						isRegenerate: true,
					} ) }
					isInEditor={ isInEditor }
				/>
			] ) );

			// 履歴の保存
			if ( newRenderedLog.length > maxVisibleImageLogs ) {
				// 履歴最大数を超えた場合
				const trimmedRenderedLog = newRenderedLog.slice( newRenderedLog.length - maxVisibleImageLogs )
				setRenderedLog( trimmedRenderedLog )
			} else {
				// 履歴最大数以下の場合
				setRenderedLog( newRenderedLog )
			}
	
			// リセット
			setGeneratedImages( [] )
			setImagePrompt( '' )
			// setBinaryInputImage( null )
		}
	}, [ generatedImages ] )

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
						prompt={ item?.props?.prompt }
						arrayImages={ item?.props?.arrayImages }
						isLoaded={ true }
						isLoading={ isLoading }
						index={ index }
						onClickCopyToClipboardItem ={ handleCopyToClipboardItem }
						onClickDeleteItem ={ handleDeleteItem }
						onClickDownload={ handleDownload }
						onClickRegenerate={ () => handleGenerate( {
							prompt: item?.props?.prompt,
							gptPrompt: SYSTEM_PROMPT_TRANSLATE_ENGLISH,
							isMagic: false,
							isRegenerate: true,
						} ) }
						isInEditor={ isInEditor }
					/>
				) )
			) }
		</>
	)

	// メッセージ送信エリア
	const promptArea = (
		<PromptArea
			stabilityAIapiKey={ stabilityAIApiKey }
			openAIApiKey={ openAIApiKey }
			isLoading={ isLoading }
			imagePrompt={ imagePrompt }
			onChangeImagePrompt={ newVal => setImagePrompt( newVal ) }
			previousImagePromptRef={ previousImagePromptRef }
			onClickMagicPrompt={ () => handleGenerate( {
				prompt: USER_PROMPT_RANDOM,
				gptPrompt: SYSTEM_PROMPT_GENERATE_IMAGE_RANDOM,
				isMagic: true,
				isRegenerate: false,
			} ) }
			onClickReGenerate={ () => handleGenerate( {
				prompt: previousImagePromptRef.current,
				gptPrompt: SYSTEM_PROMPT_TRANSLATE_ENGLISH,
				isMagic: false,
				isRegenerate: true,
			} ) }
			onClickGenerate={ () => handleGenerate( {
				prompt: imagePrompt,
				gptPrompt: SYSTEM_PROMPT_TRANSLATE_ENGLISH,
				isMagic: false,
				isRegenerate: false,
			} ) }
			onClickClear={ () => handleClearAll() }

			// OpenAI
			engine={ engine }
			onChangeEngine={ newVal => setEngine( newVal ) }
			dallEModel={ dallEModel }
			onChangeDallEModel={ newSelect => setDallEModel( newSelect.selectedItem.key ) }
			dallENumberImages={ dallENumberImages }
			onChangeDallENumberImages={ newVal => setDallENumberImages( newVal ) }
			dallEImageSize={ dallEImageSize }
			onChangeDallEImageSize={ newVal => setDallEImageSize( newVal ) }
			dallEQuality={ dallEQuality }
			onChangeDallEQuality={ newVal => setDallEQuality( newVal ) }
			dallEStyle={ dallEStyle }
			onChangeDallEStyle={ newVal => setDallEStyle( newVal ) }

			// StabilityAI
			stableDiffusionModel={ stableDiffusionModel }
			onChangeStableDiffusionModel={ newSelect => setStableDiffusionModel( newSelect.selectedItem.key ) }
			stableDiffusionStyle={ stableDiffusionStyle }
			onChangeStableDiffusionStyle={ newVal => setStableDiffusionStyle( newVal ) }
			stableDiffusionWidth={ stableDiffusionWidth }
			onChangeStableDiffusionWidth={ newVal => setStableDiffusionWidth( newVal )}
			stableDiffusionHeight={ stableDiffusionHeight }
			onChangeStableDiffusionHeight={ newVal => setStableDiffusionHeight( newVal ) }
			stableDiffusionDimensions={ stableDiffusionDimensions }
			onChangeStableDiffusionDimensions={ newVal => setStableDiffusionDimensions( newVal ) }
			stableDiffusionSamples={ stableDiffusionSamples }
			onChangeStableDiffusionSamples={ newVal => setStableDiffusionSamples( newVal ) }
			stableDiffusionCfgScale={ stableDiffusionCfgScale }
			onChangeStableDiffusionCfgScale={ newVal => setStableDiffusionCfgScale( newVal )  }
			stableDiffusionSteps={ stableDiffusionSteps }
			onChangeStableDiffusionSteps={ newVal => setStableDiffusionSteps( newVal ) }

			errorMessage={ errorMessage }
		/>
	)

	// メインエリア
	return (
		<>
			<div className="dpaa-vertical-scrollable-area" ref={ scrollableRef }>
				<Flex
					direction='column'
					gap={ 5 }
				>
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

export default ImageGenerationPanel