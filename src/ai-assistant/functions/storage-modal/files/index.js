/**
 * Internal dependencies
 */
import {
	getUploadedFilesOnOpenAI,
	getFineTuningJobsList,
	uploadFileToOpenAI,
	deleteUploadedFileOnOpenAI,
	retrieveUploadedFileContentOnOpenAI,
} from '@dpaa/util'
import {
	ModalCreateTunedModel
} from '@dpaa/ai-assistant/functions/fine-tuning/dataset-panel/modal-create-tuned-model'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	Flex,
	FlexItem,
	SelectControl,
	Spinner,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo,
	useEffect,
	useState,
} from '@wordpress/element'
import { TableHeader } from './table-header'
import { TableRow } from './table-row'

export const Files = memo( props => {
	const {
		openai = null,
		isLoading,
		setIsLoading,
		setTipMessage,
		purpose = null,
	} = props

	// アップロードファイル
	const [ uploadedFiles, setUploadedFiles ] = useState( null )
	// ファイル一覧の要素
	const [ renderedFiles, setRenderedFiles ] = useState( <Spinner style={ { width: '30px', height: '30px' } } /> )

	// Fine-tuningジョブ用
	const [ jobs, setJobs ] = useState( null )
	const [ jobsUpTo, setJobsUpTo ] = useState( 50 )

	// 新規モデル作成用のモーダル表示フラグ
	const [ isOpenCreateModelModal, setIsOpenCreateModelModal ] = useState( false )

	// 選択したファイル
	const [ selectedFileID, setSelectedFileID ] = useState( null )
	const [ selectedFileName, setSelectedFileName ] = useState( null )

	// フィルター
	const [ currentPurpose, setCurrentPurpose ] = useState( '' )

	// インスタンス生成時
	useEffect( () => {
		if ( openai ) {
			// アップロードファイルの取得
			getUploadedFilesOnOpenAI( { openai: openai, purpose: purpose } )
			.then( res => {
				if ( Array.isArray( res ) && res.length > 0 ) {
					setUploadedFiles( res )
				}
			} )
			.catch( error => {
				console.error( 'Failed to get uploaded files.', error )
				setErrorMessage( error )
			} )

			// job一覧の取得
			getFineTuningJobsList( { openai: openai, limit: jobsUpTo } )
			.then( res => {
				if ( res?.response?.ok ) {
					setJobs( res.data )
				}
			} )
			.catch( error => {
				console.error( 'Failed to get Fine tuned jobs list.', error )
				setErrorMessage( error )
			} )
		}
	}, [] )

	// アップロードファイルの削除
	const handleDeleteUploadedOpenAIFile = async ( id ) => {
		if ( !id ) {
			return null
		}

		if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
			let response = false
			try {
				setIsLoading( true )
				setTipMessage( { message: __( 'Deleting...', dpaa.i18n ) } )

				response = await deleteUploadedFileOnOpenAI( { openai: openai, fileID: id } )
			} catch ( error ) {
				console.error( 'Failed to delete a file.', error )
				alert( error )
			} finally {
				setIsLoading( false )
				setTipMessage( { message: '' } )
				if ( response?.deleted ) {
					// リストの更新
					handleRefreshUploadedFilesList( { showTip: false } )
					// メッセージの表示
					setTipMessage( { message: <>{ __( 'Deleted!', dpaa.i18n ) }<br />{ `ID: ${ response?.id }` }</> } )
					setTimeout( () => {
						setTipMessage( { message: '' } )
					}, 4000 );
				}
			}
		}
	}

	// ファイルコンテンツの取得(ダウンロード)
	const handleDownloadUploadedOpenAIFile =  async ( { id, fileName } ) => {
		try {
			setIsLoading( true )

			// アップロードファイルのコンテンツを取得
			const response = await retrieveUploadedFileContentOnOpenAI( { openai: openai, fileID: id } )

			if ( response ) {
				// ダウンロード
				const blob = new Blob( [ response ], { type: 'application/octet-stream' } );
				const url = window.URL.createObjectURL( blob );
				const anchor = document.createElement( 'a' );
				anchor.href = url;
				anchor.download = fileName;
				document.body.appendChild( anchor );
				anchor.click();
				window.URL.revokeObjectURL( url );
			}
		} catch ( error ) {
			console.error( 'Failed to retrieve a file content.', error )
			alert( error )
		} finally {
			setIsLoading( false )
		}
	}

	// リストの更新
	const handleRefreshUploadedFilesList =  async ( { showTip = false } ) => {
		let response = false
		try {
			setIsLoading( true )
			if ( showTip ) {
				setTipMessage( { message: __( 'Loading...', dpaa.i18n ) } )
			}

			// アップロードファイルの取得
			response = await getUploadedFilesOnOpenAI( { openai: openai, purpose: purpose } )

		} catch ( error ) {
			console.error( 'Failed to get uploaded files.', error )
			setErrorMessage( error )
		} finally {
			setIsLoading( false )
			setTipMessage( { message: '' } )
			if ( Array.isArray( response ) && response.length > 0 ) {
				setUploadedFiles( response )
				if ( showTip ) {
					setTipMessage( { message: __( 'Refreshed!', dpaa.i18n ) } )
					setTimeout( () => {
						setTipMessage( { message: '' } )
					}, 3000 );
				}
			}
		}
	}

	// アップロードファイル一覧の取得
	useEffect( () => {
		if ( uploadedFiles && Array.isArray( uploadedFiles ) ) {
			setRenderedFiles(
				uploadedFiles.map( ( file, index ) => (
					<TableRow
						file={ file }
						index={ index }
						onClickCreate={ () => {
							setSelectedFileID( file?.id )
							setSelectedFileName( file?.filename )
							setIsOpenCreateModelModal( true )
						} }
						onClickDelete={ () => handleDeleteUploadedOpenAIFile( file?.id ) }
						onClickDownload={ () => handleDownloadUploadedOpenAIFile( { id: file?.id, fileName: file?.filename } ) }
					/>
				) )
			)
		}
	}, [ uploadedFiles ] )

	// アップロードファイル一覧
	const renderedUploadedFileList = (
		<Flex direction='column' justify='flex-start' gap={ 4 }>
			{ uploadedFiles && Array.isArray( uploadedFiles ) && (
				<FlexItem>
					<Text
						display='block'
						size='13px'
						color='var(--wp-admin-theme-color-darker-20)'
					>
						{ sprintf( __( 'Total: %s', dpaa.i18n ), `${ uploadedFiles.length } ${ __( 'file(s)', dpaa.i18n ) }` ) }
					</Text>
				</FlexItem>
			) }
			<FlexItem>
				<Flex direction='row' justify='flex-end' align='center' gap={ 2 }>
					{ !purpose && (
						<FlexItem>
							<SelectControl
								__next40pxDefaultSize
								size='compact'
								label={ __( 'Filter', dpaa.i18n ) }
								labelPosition='side'
								value={ currentPurpose }
								options={ [
									{ value: '', label: __( 'All', dpaa.i18n ) },
									{ value: 'fine-tune', label: __( 'Fine-tuning', dpaa.i18n ) },
									{ value: 'assistants', label: __( 'Assistants', dpaa.i18n ) },
									{ value: 'user_data', label: __( 'User data', dpaa.i18n ) },
									{ value: 'batch', label: __( 'Batch', dpaa.i18n ) },
									{ value: 'vision', label: __( 'Image', dpaa.i18n ) },
								] }
								disabled={ isLoading }
								onChange={ newVal => setCurrentPurpose( newVal ) }
							/>
						</FlexItem>
					) }
					<FlexItem>
						<Button
							size='compact'
							showTooltip
							label={ __( 'Refresh', dpaa.i18n ) }
							icon='controls-repeat'
							iconSize={ 18 }
							variant='primary'
							isDestructive={ false }
							isBusy={ isLoading }
							disabled={ isLoading }
							onClick={ () => handleRefreshUploadedFilesList( { showTip: true } ) }
						/>
					</FlexItem>
				</Flex>
			</FlexItem>
			<FlexItem>
				<BaseControl className='dpaa-vertical-scrollable-area'>
					<TableHeader />
					{ renderedFiles }
				</BaseControl>
				{ isOpenCreateModelModal && (
					<ModalCreateTunedModel
						openai={ openai }
						jobs={ jobs }
						fileID={ selectedFileID }
						fileName={ selectedFileName }
						onRequestClose= { () => setIsOpenCreateModelModal( false ) }
					/>
				) }
			</FlexItem>
		</Flex>
	)

	return renderedUploadedFileList
} )