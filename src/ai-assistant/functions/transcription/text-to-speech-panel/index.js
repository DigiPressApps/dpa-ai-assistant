/**
 * Internal dependencies
 */
import {
	blobToBinaryOrBase64,
	textToSpeech,
	uploadAudioToMediaLibrary,
	playAudioFromBlob,
} from '@dpaa/util'
import { PromptArea } from './prompt-area'
import { RenderLog } from './render-log'

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
	useDispatch,
	useSelect,
} from '@wordpress/data'
import {
	useEffect,
	useState,
	useRef,
} from '@wordpress/element'

/** 
 * External dependencies
 */
import Dexie from 'dexie';

export const TextToSpeechPanel = props => {
	const {
		openai,
		generalSettings,
		speechSettings,
		isLoading,
		isInEditor,
		setIsLoading,
		setTipMessage,
	} = props

	const currentDate = new Date().toISOString().replace(/[-T:]/g, '-').slice(0, 16);

	// ラッパー要素への参照用
	const scrollableRef = useRef( undefined );

	// パラメータ用
	const [ model, setModel ] = useState( null )
	const [ format, setFormat ] = useState( null )
	const [ voice, setVoice ] = useState( null )
	const [ speed, setSpeed ] = useState( null )
	const [ maxLogs, setMaxLogs ] = useState( null )

	useEffect( () => {
		if ( speechSettings ) {
			setModel( speechSettings?.model )
			setFormat( speechSettings?.format )
			setVoice( speechSettings?.voice )
			setSpeed( speechSettings?.speed )
			setMaxLogs( speechSettings?.maxLogs )
		}
	}, [] ) 

	// 実行用
	const [ text, setText ] = useState( '' )
	const [ isExecute, setIsExecute ] = useState( false )

	// blob用
	const [ currentBlobAndText, setCurrentBlobAndText ] = useState( null )
	const [ blobsLog, setBlobsLog ] = useState( null )

	// ログエリア全体
	const [ logArea, setLogArea ] = useState( null )

	// 音声再生用
	const [ isPlaying, setIsPlaying ] = useState( false )

	// IndexedDBデータベース用
	const [ indexedDB, setIndexedDB ] = useState( null )

	// ローカルデータ(indexedDB)の取得
	const fetchDataFromIndexedDB = async () => {
		try {
			if ( indexedDB ) {
				const data = await indexedDB.speechToText.get( 1 );
				if ( data?.blobs ) {
					setBlobsLog( data.blobs );
				} else {
					setBlobsLog( [] )
				}
			}
		} catch ( error ) {
			console.error('Error fetching data from IndexedDB:', error);
		}
	};
	// ローカルデータ(indexedDB)の更新(上書き保存)
	 const saveDataToIndexedDB = async ( data ) => {
		try {
			if ( indexedDB && data && Array.isArray( data )) {
				await indexedDB.speechToText.put( {
					id: 1,
					blobs: data
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
		const db = new Dexie( 'speechToTextLog' );
		setIndexedDB( db )
	}, [] );

	// データベース作成時
	useEffect( () => {
		if ( indexedDB ) {
			// オブジェクトストア(テーブル)を作成
			indexedDB.version( 1 ).stores({
				speechToText: '++id, blobs'
			});
			// ローカルデータの取得
			fetchDataFromIndexedDB()
		}
	}, [ indexedDB ] )

	// IndexDB への追加保存
	useEffect( () => {
		if ( blobsLog && Array.isArray( blobsLog ) ) {
			// 最大ログ数を超えた場合は調整
			const updatedBlobsLog = blobsLog.length > maxLogs ? blobsLog.slice( blobsLog.length - maxLogs ) : blobsLog;

			// ローカルデータの更新(上書き保存)
			saveDataToIndexedDB( updatedBlobsLog )

			// ログエリアの更新
			setLogArea(
				<>
					{ Array.isArray( updatedBlobsLog ) && updatedBlobsLog.length > 0 && (
						// 通常のログ表示
						updatedBlobsLog.map( ( blob, index ) =>  (
							<RenderLog
								text={ blob?.text }
								blob={ blob?.blob }
								isLoading={ isLoading }
								onClickPlay={ () => handlePlayAudio( blob?.blob ) }
								onClickRegenerate={ () => handleRegenerate( blob?.text ) }
								onClickDownload={ () => handleDownloadAudio( blob?.blob ) }
								onClickDeleteItem={ () => handleDeleteItem( index ) }
								isInEditor={ isInEditor }
							/>
						) )
					) }
				</>
			)
		}
	}, [ blobsLog ] )

	// 「テキストから音声」変換実行
	useEffect( () => {
		if ( isExecute && text ) {
			setIsLoading( true )
			setTipMessage( { message: __( 'Generating...', dpaa.i18n ) } );

			textToSpeech( {
				openai: openai,
				text: text,
				model: model,	// tts-1, tts-1-hd
				voice: voice, // alloy, echo, fable, onyx, nova, shimmer
				format: format,	// mp3, opus, aac, flac, wav, pcm
				speed: speed,	// 0.25 to 4.0
			} )
			.then( blob => {
				// テキストのレスポンスを保存
				setCurrentBlobAndText( { blob: blob, text: text } )
			} )
			.catch( error => {
				alert( error )
				console.error( error )
			} )
			.finally( () => {
				setText( '' );
				setTipMessage( { message: '' } );
				setIsLoading( false )
				setIsExecute( false )
			} )
		}
	}, [ isExecute ] )

	// 音声変換成功時
	useEffect( () => {
		if ( currentBlobAndText && typeof currentBlobAndText === 'object' ) {
			const newBlobsLog = [ ...blobsLog || [] ]
			newBlobsLog.push( currentBlobAndText )
			// ログを追加
			setBlobsLog( newBlobsLog )
		}
	}, [ currentBlobAndText ] )

	// 音声をダウンロード
	const handleDownloadAudio = ( blob ) => {
		const url = window.URL.createObjectURL( blob );
		const a = document.createElement( 'a' );
		a.href = url;
		a.download = `text-to-speech-${ currentDate }.${ format }`;
		a.click();
		window.URL.revokeObjectURL( url );
	}

	// 再生成
	const handleRegenerate = ( targetText ) => {
		if ( window.confirm( __( 'Are you sure you want to regenerate?', dpaa.i18n ) ) ) {
			setText( targetText )
			setIsExecute( true )
		}
	}

	// ログの削除
	const handleDeleteItem = ( index ) => {
		if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
			// 新規チャットが追加された後(renderedLog にデータがある場合)
			if ( Array.isArray( blobsLog ) && blobsLog.length > 0 ) {
				// ログの配列をコピー
				const updateBlobsLog = [ ...blobsLog ]
				// 指定されたインデックスのアイテムを削除
				updateBlobsLog.splice( index, 1 )
				setBlobsLog( updateBlobsLog )
			}
		}
	}

	// 全ログの一括消去
	const handleClearAll = () => {
		if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
			setLogArea( null )
			setBlobsLog( [] )
			indexedDB.speechToText.delete( 1 )
		}
	}

	// 音声を再生
	let currentAudio = null
	const handlePlayAudio = ( blob ) => {
		currentAudio = playAudioFromBlob( {
			blob: blob,
			currentAudio: currentAudio,
			setIsPlaying: setIsPlaying,
		} )
	}

	return (
		<>
			<div className="dpaa-vertical-scrollable-area" ref={ scrollableRef }>
				<Flex direction='column' gap={ 5 }>
					{ ( !logArea && !blobsLog ) && (
						<FlexItem>
							<Spinner style={ { width: '30px', height: '30px' } } />
						</FlexItem>
					) }
					{ ( logArea && blobsLog ) && logArea }
				</Flex>
			</div>
			<PromptArea
				isLoading={ isLoading }
				openai={ openai }
				text={ text }
				model={ model }
				voice={ voice }
				format={ format }
				speed={ speed }
				onClickConvert={ () => setIsExecute( true ) }
				onChangeModel={ newSelect => setModel( newSelect.selectedItem.key ) }
				onChangeText={ newVal => setText( newVal ) }
				onChangeVoice={ newVal => setVoice( newVal ) }
				onChangeFormat={ newVal => setFormat( newVal ) }
				onChangeSpeed={ newVal => setSpeed( newVal ) }
				onClickClear={ handleClearAll }
			/>
		</>
	)
}