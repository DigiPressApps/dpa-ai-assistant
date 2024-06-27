/**
 * Internal dependencies
 */
import {
	uploadFileToOpenAI,
} from '@dpaa/util'
import {
	Files as FilesPanel,
} from '@dpaa/ai-assistant/functions/storage-modal/files'

/** 
 * External dependencies
 */
import Dexie from 'dexie';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
} from '@wordpress/components'
import {
	useEffect,
	useState,
} from '@wordpress/element'
import { DatasetPagination } from './dataset-pagination'
import { RenderPanelOperationArea } from './render-panel-operation-area'
import { RenderDatasetLineHeader } from './render-dataset-line-header'
import { RenderDatasetLine } from './render-dataset-line'

export const DatasetPanel = props => {
	const {
		openai,
		uploadedFiles,
		targetSelecter,
		isLoading,
		setIsLoading,
		setTipMessage,
	} = props

	if ( !uploadedFiles ) {
		return null
	}

	const currentDate = new Date().toISOString().slice( 0, 10 );

	// アップロードファイル名
	const [ uploadFileName, setUploadFileName ] = useState( `dpaa-${ currentDate }` )

	// 現在のモード
	const [ currentMode, setCurrentMode ] = useState( 'list' )
	const [ createMode, setCreateMode ] = useState( null )

	// データセット用
	const [ jsonlData, setJsonlData ] = useState( null )
	const [ currentRenderedDataset, setCurrentRenderedDataset ] = useState( null )
	const [ systemMessageOnEasy, setSystemMessageOnEasy ] = useState( null )
	// データセットのページネーション用
	const [ currentDatasetPageNum, setCurrentDatasetPageNum ] = useState( 1 )
	const [ datasetNumPerPage, setDatasetNumPerPage ] = useState( 10 )
	const [ startDatasetPageIndex, setStartDatasetPageIndex ] = useState( 0 )
	const [ endDatasetPageIndex, setEndDatasetPageIndex ] = useState( 10 )

	// IndexedDBデータベース用
	const [ indexedDB, setIndexedDB ] = useState( null )

	// ローカルデータ(indexedDB)の取得
	const fetchDataFromIndexedDB = async () => {
		try {
			setIsLoading( true )

			if ( indexedDB ) {
				const data = await indexedDB.fineTuneData.get( 1 );
				// messages: { system: 'context', user: 'question', assistant: 'answer', ... }
				if ( data?.messages ) {
					setJsonlData( JSON.parse( data.messages ) );
				} else {
					setJsonlData( [] )
				}
				setSystemMessageOnEasy( data?.systemMessageOnEasy || '' )
				setCreateMode( data?.createMode || 'easy' )
			}
		} catch ( error ) {
			console.error('Error fetching data from IndexedDB:', error);
		} finally {
			setIsLoading( false )
		}
	};
	// ローカルデータ(indexedDB)の更新(上書き保存)
	 const saveDataToIndexedDB = async ( data ) => {
		try {
			if ( indexedDB ) {
				const primitiveData = JSON.stringify( data );
				await indexedDB.fineTuneData.put( {
					id: 1,
					messages: primitiveData,
					systemMessageOnEasy: typeof systemMessageOnEasy === 'string' ? systemMessageOnEasy : '',
					createMode: typeof createMode === 'string' ? createMode : 'easy',
				} );
			}
		} catch ( error ) {
			console.error('Error saving data to IndexedDB:', error);
		}
	};

	// ローカルストレージのレンダーログの取得(初回レンダリング時)
	useEffect(() => {
		// データベース(IndexedDB)を作成
		const db = new Dexie( 'datasetForFineTuning' );
		setIndexedDB( db )
	}, [] );

	// データベース作成時
	useEffect( () => {
		if ( indexedDB ) {
			// オブジェクトストア(テーブル)を作成
			indexedDB.version( 1 ).stores({
				fineTuneData: '++id, messages, systemMessageOnEasy, createMode'
			});
			// ローカルデータの取得
			fetchDataFromIndexedDB()
		}
	}, [ indexedDB ] )

	// jsonlデータ、Easyモード用のシステムプロンプト変更時
	useEffect( () => {
		if ( jsonlData && Array.isArray( jsonlData ) ) {
			// ローカルデータの更新(上書き保存)
			saveDataToIndexedDB( jsonlData )
		}
	}, [ jsonlData, systemMessageOnEasy, createMode ] )

	// データセットのレンダリング更新
	useEffect( () => {
		if ( jsonlData && Array.isArray( jsonlData ) ) {
			if ( startDatasetPageIndex < endDatasetPageIndex ) {
				// データセット一覧のレンダリングを更新
				setCurrentRenderedDataset(
					jsonlData.slice( startDatasetPageIndex, endDatasetPageIndex ).map( ( line, index ) => (
						<RenderDatasetLine
							isLoading={ isLoading }
							line={ line }
							index={ startDatasetPageIndex + index }
							createMode={ createMode }
							systemMessageOnEasy={ systemMessageOnEasy }
							handleAddMessageData={ ( index, messageSet ) => handleAddAMessage( index, messageSet ) }
							handleRaplaceMessageData={ ( index, messageSet ) => handleRaplaceMessage( index, messageSet ) }
							handleChangeMessages={ () => {
								const updatedData = [ ...jsonlData ];
								setJsonlData( updatedData )
							} }
							handleDeleteSelectedDataset={ () => handleDeleteSelectedDataset( startDatasetPageIndex + index ) }
						/>
					) )
				)
			}
		}
	}, [ jsonlData, createMode, datasetNumPerPage, currentDatasetPageNum, startDatasetPageIndex, endDatasetPageIndex, systemMessageOnEasy ] )

	// csv を jsonl に変換
	const csvToJSONL = ( csvText ) => {
		const lines = csvText.split( '\n' );
		const header = lines[ 0 ].split( ',' );

		const jsonlArray = lines.slice( 1 ).map( line => {
			const values = line.split( ',' );
			let jsonlObject = '{"messages":[';
			for ( let i = 0; i < values.length; i++ ) {
				jsonlObject += `{"role":"${ header[ i ] }","content":"${ values[ i ] || '' }"}`;
				if ( i < values.length - 1 ) {
					jsonlObject += ',';
				}
			}
			jsonlObject += ']}';
			
			return JSON.parse( jsonlObject );
		} );
		return jsonlArray;
	}

	// jsonlファイルの読み込み、取得
	const loadImportedFile = async ( file ) => {
		let arrLines = null;

		try {
			setIsLoading( true )
			setTipMessage( { message: __( 'Loading...', dpaa.i18n ) } )

			const text = await file.text();
			
			if ( file.name.endsWith( '.csv' ) ) {
				arrLines = csvToJSONL( text ) || null;
			} else if ( file.name.endsWith( '.json' ) ) {
				arrLines = JSON.parse( text ) || null;
			} else if ( file.name.endsWith( '.jsonl' ) ) {
				arrLines = text.split( '\n' ).filter( line => line.trim() ).map( line => JSON.parse( line ) ) || null;
			}
			
		} catch ( error ) {
			console.error( __( 'Failed to load a file.' ), error);
			alert( error )
		} finally {
			setIsLoading( false )
			setTipMessage( { message: '' } )
			if ( arrLines && Array.isArray( arrLines ) ) {
				setJsonlData( arrLines )
			}

			return arrLines
		}
	}

	// 学習データ一覧ページ移動
	const handleChangeDatasetListPage = ( pageNum ) => {
		const startIndex = datasetNumPerPage * ( pageNum - 1 )
		const endIndex = datasetNumPerPage * ( pageNum - 1 ) + datasetNumPerPage
		setCurrentDatasetPageNum( pageNum )
		setStartDatasetPageIndex( startIndex )
		setEndDatasetPageIndex( endIndex )
	}

	// インポートボタンのコールバック
	const handleImportDatasetFile = async () => {
		const input = document.createElement( 'input' );
		input.type = 'file';
		input.accept = '.jsonl, .json, .csv';
		input.onchange = async ( event ) => {
			const file = event.target.files[0];
			if ( !file ) {
				return
			}

			try {
				setIsLoading( true )

				 // インポートの実行
				const arrLines = await loadImportedFile( file )
				if ( arrLines && Array.isArray( arrLines ) ) {
					// 1ページ目に移動
					handleChangeDatasetListPage( 1 )
				}

			} catch ( error ) {
				console.error( 'Import error', error )
			} finally {
				setIsLoading( false )
			}
		};
		input.click();
	}

	// 個別の学習データ消去ボタンのコールバック
	const handleDeleteSelectedDataset = ( index ) => {
		// 新規チャットが追加された後(renderedLog にデータがある場合)
		if ( Array.isArray( jsonlData ) && jsonlData.length > 0 ) {
			if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
				// ログの配列をコピー
				const updatedJsonlData = [ ...jsonlData || [] ]
				// 指定されたインデックスのアイテムを削除
				updatedJsonlData.splice( index, 1 )
				// jsonlData を更新(→レンダリング)
				setJsonlData( updatedJsonlData )
			}
		}
	}

	// 学習データ全消去ボタンのコールバック
	const handleClearAllCurrentDataset = () => {
		if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
			// jsonlデータの削除
			setJsonlData( null )
			// システムメッセージ(Easy mode)の削除
			setSystemMessageOnEasy( null )
			// 現在のページ番号を初期化
			setCurrentDatasetPageNum( 1 )
			// レンダリングの消去
			setCurrentRenderedDataset( null )
			// ローカルストレージの削除
			indexedDB.fineTuneData.delete( 1 )
		}
	}

	// 学習データのマニュアル追加(空の行)
	const handleAddEntryDataset = () => {
		// 空の"messages"を追加
		const newJsonlData = [ ...jsonlData || [] ]
		newJsonlData.push( {
			"messages": [ {
				"role": "system",
				"content": ""
			}, {
				"role": "user",
				"content": ""
			}, {
				"role": "assistant",
				"content": ""
			} ]
		} )
		setJsonlData( newJsonlData )

		// 最後のページに移動
		const lastPageNum = Math.ceil( jsonlData?.length / datasetNumPerPage ) || 1;
		handleChangeDatasetListPage( lastPageNum )
	}

	// 現在の展開されているデータ(jsonl)をローカルにダウンロード
	const handleDonwloadCurrentDataset = () => {
		// Convert jsonlData to JSON string with 2-space indentation
		const jsonlContent = JSON.stringify( jsonlData, null, 2 );
		
		const blob = new Blob( [ jsonlContent ], { type: 'application/json' });
		const url = window.URL.createObjectURL( blob );
		
		const a = document.createElement( 'a' );
		a.href = url;
		a.download = `${ uploadFileName }.json`;
		a.click();

		window.URL.revokeObjectURL( url );
	}

	// 現在の展開されているデータ(jsonl)をOpenAI にアップロード
	const handleUploadCurrentDataset = async () => {
		if ( !jsonlData || !Array.isArray( jsonlData ) ) {
			return null;
		}
		if ( jsonlData.length < 10 ) {
			alert( __( 'To create a custom tuned model, you are required to provide at least 10 examples(conversations).', dpaa.i18n ) )
			return null
		}

		let response = false

		try {
			setIsLoading( true );
			// メッセージの表示
			setTipMessage( { message: __( 'Uploading...', dpaa.i18n ) } );

			const entityJsonlData = [ ...jsonlData ];
			if ( createMode === 'easy' && systemMessageOnEasy ) {
				entityJsonlData.forEach( ( line, index ) => {
					if ( Array.isArray( line?.messages ) ) {
						let foundSystemRole = false;
						for ( let i = 0; i < line.messages.length; i++ ) {
							// system role がある場合はループを抜ける
							if ( foundSystemRole ) {
								break;
							}
							if ( line.messages[ i ].role === 'system' ) {
								// system role が見つかった場合
								foundSystemRole = true;
								if ( !line.messages[ i ].content ) {
									// content が空の場合は共通のコンテキストを代入
									line.messages[ i ].content = systemMessageOnEasy
								}
							} else {
								// system が配列内に存在しない場合は先頭に追加
								if ( !line.messages.some( item => item.role === 'system' ) ) {
									line.messages.unshift({ role: 'system', content: systemMessageOnEasy } );
									foundSystemRole = true;
								}
							}
						}
					}
				} )
			}

			const jsonlContent = entityJsonlData.map( messages => JSON.stringify( messages ) ).join( '\n' );
			// Mime type
			const fileMime = 'text/plain';
			// Blobを作成
			const blob = new Blob( [ jsonlContent ], { type: fileMime });
			// ファイルオブジェクトを作成
			const file = new File( [ blob ], `${ uploadFileName || 'dpaa-' + currentDate }.jsonl`, { type: fileMime } );

			// ファイルサイズが512MB以上の場合
			if ( file.size > 536870912 ) {
				alert( __( 'The maximum file size that can be uploaded at one time is 512MB.', dpaa.i18n ) )
				return null
			}

			// アップロード
			response = await uploadFileToOpenAI( {
				openai: openai,
				file: file,
				fileType: 'object',
				purpose: 'fine-tune',
			} )

		} catch ( error ) {
			setTipMessage( { message: '' } );
			console.error( error );
			alert( error );
		} finally {
			setIsLoading( false );
			setTipMessage( { message: '' } );
			if ( response?.status === 'processed' ) {
				setTipMessage( { message: <>
					{ __( 'Uploaded!', dpaa.i18n ) }
					<br />
					{ __( 'You can check the status of the uploaded file on the "Uploaded files" tab.', dpaa.i18n ) }
					<br />
					{ `${ __( 'File name', dpaa.i18n ) }: ${ response?.filename }` }
				</> } );
				setTimeout( () => {
					setTipMessage( { message: '' } );
				}, 4000 );
			} else {
				alert( __( 'Upload failed', dpaa.i18n ) );
			}
		}
	}

	// メッセージ行のマニュアル追加
	const handleAddAMessage = ( index, messageSet ) => {
		const updatedData = [ ...jsonlData ];
		if ( updatedData[ index ]?.messages && Array.isArray( updatedData[ index ]?.messages ) ) {
			updatedData[ index ].messages.push( messageSet )
			setJsonlData( updatedData )
		}
	}

	// メッセージ行の入れ替え
	const handleRaplaceMessage = ( index, messageSet ) => {
		const updatedData = [ ...jsonlData ];
		if ( updatedData[ index ]?.messages && Array.isArray( updatedData[ index ]?.messages ) ) {
			updatedData[ index ].messages = messageSet;
			setJsonlData( updatedData )
		}
	}

	// アップロードファイル一覧
	const renderedUploadedFileList = (
		<FilesPanel
			openai={ openai }
			isLoading={ isLoading }
			setIsLoading={ setIsLoading }
			setTipMessage={ setTipMessage }
			purpose='fine-tune'
		/>
	)

	// データセットエディタ
	const renderedCreateDataset = (
		<>
			<BaseControl className='dpaa-vertical-scrollable-area'>
				<RenderDatasetLineHeader
					isLoading={ isLoading }
					createMode={ createMode }
					systemMessageOnEasy={ systemMessageOnEasy }
					onChangeSystemMessageOnEasy={ newVal => setSystemMessageOnEasy( newVal ) }
				/>
				{ currentRenderedDataset }
			</BaseControl>
			<DatasetPagination
				isLoading={ isLoading }
				total={ jsonlData?.length }
				currentPageNum={ currentDatasetPageNum }
				numPerPage={ datasetNumPerPage }
				onChangePage={ pageNum => handleChangeDatasetListPage( pageNum ) }
			/>
		</>
	)

	return (
		<>
			<RenderPanelOperationArea
				currentMode={ currentMode }
				setCurrentMode={ setCurrentMode }
				createMode={ createMode }
				setCreateMode={ setCreateMode }
				targetSelecter={ targetSelecter }
				datasetNum={ jsonlData?.length || 0 }
				uploadFileName={ uploadFileName }
				isLoading={ isLoading }
				onClickImport={ () => handleImportDatasetFile() }
				onClickAddEntry={ () => handleAddEntryDataset() }
				onClickDownload={ () => handleDonwloadCurrentDataset() }
				onClickUpload={ () => handleUploadCurrentDataset() }
				onClickClear={ () => handleClearAllCurrentDataset() }
				onChangeUploadFileName={ newVal => setUploadFileName( newVal ) }
			/>
			{ currentMode === 'list' && renderedUploadedFileList }
			{ currentMode === 'create' && renderedCreateDataset }
		</>
	)
}