/**
 * Internal dependencies
 */
import {
	copyToClipboard,
	speechToText,
	mediaLibrary,
	getAudioDataFromURL,
	base64ToBlob,
	playAudioFromBlob,
} from '@dpaa/util'
import { PromptArea } from './prompt-area'
import { RenderLog } from './render-log'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { createBlock } from '@wordpress/blocks'
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

export const SpeechToTextPanel = props => {
	const {
		openai,
		settings,
		isLoading,
		isInEditor,
		setIsLoading,
		setTipMessage,
	} = props

	// ラッパー要素への参照用
	const scrollableRef = useRef( null );

	// パラメータ用
	const [ model, setModel ] = useState( null )
	const [ format, setFormat ] = useState( null )
	const [ language, setLanguage ] = useState( null )
	const [ temperature, setTemperature ] = useState( null )
	const [ maxLogs, setMaxLogs ] = useState( null )
	const [ prompt, setPrompt ] = useState( null )

	useEffect( () => {
		if ( settings ) {
			setModel( settings?.model )
			setFormat( settings?.format )
			setLanguage( settings?.language )
			setTemperature( settings?.temperature )
			setMaxLogs( settings?.maxLogs )
			setPrompt( settings?.prompt )
		}
	}, [] ) 

	// 実行用
	const [ url, setUrl ] = useState( null )
	const [ isExecute, setIsExecute ] = useState( false )

	// 音声再生用
	const [ isPlaying, setIsPlaying ] = useState( false )

	// トランスクリプトデータ用
	const [ currentTranscripted, setCurrentTranscripted ] = useState( null )
	const [ transcriptionLog, setTranscriptionLog ] = useState( null )

	// レンダリング履歴用
	const [ renderedLog, setRenderedLog ] = useState( null )
	// ログエリア全体
	const [ logArea, setLogArea ] = useState( null )

	// IndexedDBデータベース用
	const [ indexedDB, setIndexedDB ] = useState( null )

	// ローカルデータ(indexedDB)の取得
	const fetchDataFromIndexedDB = async () => {
		try {
			if ( indexedDB ) {
				const data = await indexedDB.transcription.get( 1 );
				if ( data?.transcriptedData && Array.isArray( data?.transcriptedData ) ) {
					setTranscriptionLog( data.transcriptedData );
				} else {
					setTranscriptionLog( [] )
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
				await indexedDB.transcription.put( {
					id: 1,
					transcriptedData: data
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
		const db = new Dexie( 'transcriptionLog' );
		setIndexedDB( db )
	}, [] );

	// データベース作成時
	useEffect( () => {
		if ( indexedDB ) {
			// オブジェクトストア(テーブル)を作成
			indexedDB.version( 1 ).stores({
				transcription: '++id, transcriptedData'
			});
			// ローカルデータの取得
			fetchDataFromIndexedDB()
		}
	}, [ indexedDB ] )

	// IndexDB への追加保存
	useEffect( () => {
		if ( transcriptionLog && Array.isArray( transcriptionLog ) ) {
			// 最大ログ数を超えた場合は調整
			const updatedTranscriptionLog = transcriptionLog.length > maxLogs ? transcriptionLog.slice( transcriptionLog.length - maxLogs ) : transcriptionLog;

			// ローカルデータの更新(上書き保存)
			saveDataToIndexedDB( updatedTranscriptionLog )

			// ログエリアの更新
			setLogArea(
				<>
					{ Array.isArray( updatedTranscriptionLog ) && updatedTranscriptionLog.length > 0 && (
						// 通常のログ表示
						updatedTranscriptionLog.map( ( item, index ) => (
							<RenderLog
								isLoading={ isLoading }
								isLoaded={ true }
								isInEditor={ isInEditor }
								url={ item?.url }
								transcriptedText={ item?.text }
								onClickCopy={ () => handleCopyTranscriptedText( item?.text ) }
								onClickPlay={ () => handlePlayAudio( item?.blob ) }
								onClickRegenerate={ () => handleRegenerate( item ) }
								onClickDeleteItem={ () => handleDeleteItem( index ) }
								onClickAddNewBlock={ () => handleAddNewBlock( {
									text: item?.text,
									blockName: 'core/paragraph',
								} ) }
							/>
						) )
					) }
				</>
			)
		}
	}, [ transcriptionLog ] )

	// URL から blob を取得
	 const fetchBlobFromURL =  async ( url ) => {
		if ( url.startsWith( dpaa.siteUrl ) ) {
			// 自サイトのファイルの場合
			const response = await fetch( url );
			const blob = await response.blob();
			return blob;
		} else {

			// 外部URLの場合(REST API で PHP から音声ダウンロード後、Base64データを受け取り、blob化)
			try {
				const res = await getAudioDataFromURL( { audioUrl: url } );
				if ( res?.ok ) {
					const blob = await base64ToBlob({ base64Data: res?.base64Data, contentType: 'audio/mp3' });
					return blob;
				}
			} catch ( error ) {
				console.error(error);
				alert(error);
				return false;
			}
		}
	}
	// 転換実行
	useEffect( () => {
		const runTranscript = async () => {
			if ( isExecute && url ) {
				let response = false
				try {
					setIsLoading( true )
					setTipMessage( { message: __( 'Generating...', dpaa.i18n ) }  );

					const blob = await fetchBlobFromURL( url )

					if ( blob ) {
						try {
							const file = new File( [ blob ], `audio.mp3`, { type: blob?.type  } )

							// 文字起こし実行
							response = await speechToText( {
								openai: openai,
								file: file,
								model: model,
								language: language,
								prompt: prompt,
								format: format,
								temperature: temperature,
							} )

							if ( response?.text ) {
								// テキストのレスポンスを保存
								setCurrentTranscripted( {
									text: response.text,
									url: url,
									blob: blob,
								} )
								setUrl( '' );
							}
						} catch ( error ) {
							alert( error )
							console.error( error )
						}
					}
				} catch ( error ) {
					alert( error )
					console.error( error )
				} finally {
					setTipMessage( { message: '' } )
					setIsLoading( false )
					setIsExecute( false )
				}
			}
		}

		runTranscript();
		
	}, [ isExecute ] )

	// 転換成功時
	useEffect( () => {
		if ( currentTranscripted && typeof currentTranscripted === 'object' ) {
			const newTranscriptionLog = [ ...transcriptionLog || [] ]
			newTranscriptionLog.push( currentTranscripted )
			// ログを追加
			setTranscriptionLog( newTranscriptionLog )
		}
	}, [ currentTranscripted ] )

	// 再生成
	const handleRegenerate = ( item ) => {
		if ( window.confirm( __( 'Are you sure you want to regenerate?', dpaa.i18n ) ) ) {
			if ( !item?.blob ) {
				return
			}

			setIsLoading( true )
			setTipMessage( { message: __( 'Generating...', dpaa.i18n ) } );

			const file = new File( [ item?.blob ], `audio.mp3`, { type: item?.blob?.type  } )
			// 文字起こし実行
			speechToText( {
				openai: openai,
				file: file,
				model: model,
				language: language,
				prompt: '',
				format: format,
				temperature: temperature,
			} )
			.then( res => {
				// テキストのレスポンスを保存
				setCurrentTranscripted( {
					text: res?.text,
					url: item?.url,
					blob: item?.blob,
				} )
			} )
			.catch( error => {
				alert( error )
				console.error( error )
			} )
			.finally( () => {
				setUrl( '' );
				setTipMessage( { message: '' } )
				setIsLoading( false )
			} )
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

	// 文字起こし結果をクリップボードにコピー
	const handleCopyTranscriptedText = ( text ) => {
		copyToClipboard( text )
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

	// 新規ブロックの追加ボタンのコールバック
	const { insertBlock } = useDispatch( 'core/block-editor' )
	const { getSelectedBlock, getBlockIndex } = useSelect( ( select ) => select( 'core/block-editor' ), [] )
	const handleAddNewBlock = ( props ) => {
		const {
			text = null,
			blockName = 'core/paragraph' 
		} = props
		if ( !text ) {
			return
		}

		// 現在選択中のブロックのインデックスを取得
		const selectedBlock = getSelectedBlock();
		const insertIndex = ( selectedBlock && getBlockIndex( selectedBlock?.clientId ) > -1 ) ? getBlockIndex( selectedBlock.clientId ) + 1 : -1;

		// 段落ブロックにセット
		const newBlock = createBlock( blockName, {
			content: text,
		} )
		// 段落ブロックで追加
		insertBlock( newBlock, insertIndex )

		setTipMessage( { message: __( 'Inserted!', dpaa.i18n ) } )
		setTimeout( () => {
			setTipMessage( { message: '' } )
		}, 2000 )
	}

	// ログの削除
	const handleDeleteItem = ( index ) => {
		if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
			// 新規チャットが追加された後(renderedLog にデータがある場合)
			if ( Array.isArray( transcriptionLog ) && transcriptionLog.length > 0 ) {
				// ログの配列をコピー
				const updateTranscriptionLog = [ ...transcriptionLog ]
				// 指定されたインデックスのアイテムを削除
				updateTranscriptionLog.splice( index, 1 )
				setTranscriptionLog( updateTranscriptionLog )
			}
		}
	}

	// 全ログの一括消去
	const handleClearAll = () => {
		if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
			setLogArea( null )
			setTranscriptionLog( [] )
			indexedDB.transcription.delete( 1 )
		}
	}

	// メディアライブラリ
	const library = mediaLibrary( {
		title: __( 'Select or Upload Media' ),
		multiple: false,
		type: 'audio',
		buttonText: __( 'Select' ),
	} )
	// メディアライブラリを開く
	const handleOpenMediaLibrary = () => {
		library.open()
		library.on( 'select', () => {
			const audio = library.state().get( 'selection' ).first().toJSON();
			if ( audio && typeof audio === 'object' ) {
				setUrl( audio?.url )
			}
		} )
	} 

	return (
		<>
			<div className="dpaa-vertical-scrollable-area" ref={ scrollableRef }>
				<Flex direction='column' gap={ 5 }>
					{ ( !logArea && !transcriptionLog ) && (
						<FlexItem>
							<Spinner style={ { width: '30px', height: '30px' } } />
						</FlexItem>
					) }
					{ ( logArea && transcriptionLog ) && logArea }
				</Flex>
			</div>
			<PromptArea
				isLoading={ isLoading }
				openai={ openai }
				url={ url }
				language={ language }
				temperature={ temperature }
				prompt={ prompt }
				onChangeUrl={ newVal => setUrl( newVal ) }
				onChangePrompt={ newVal => setPrompt( newVal ) }
				onClickClear={ () => handleClearAll() }
				onClickTranscript={ () => setIsExecute( true ) }
				onChangeLanguage={ newVal => setLanguage( newVal ) }
				onChangeTemperature={ newVal => setTemperature( newVal ) }
				onClickOpenMediaLibrary={ () => handleOpenMediaLibrary() }
			/>
		</>
	)
}