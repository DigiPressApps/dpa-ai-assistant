/**
 * Internal dependencies
 */
import {
	STORE_NAME,
	OPTION_NAME,
} from '@dpaa/datastore/constants'
import { TipMessage } from '@dpaa/components'
import { currentUserHasCapability } from '@dpaa/util'

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'
import { __ } from '@wordpress/i18n'
import { useDispatch } from '@wordpress/data'
import {
	Flex,
	FlexItem,
	Button,
	Snackbar,
	Spinner,
	__experimentalSpacer as Spacer,
} from '@wordpress/components'
import {
	useEffect,
	useState,
	useMemo,
	memo,
} from '@wordpress/element'
import {
	download as downloadIcon,
	upload as uploadIcon,
} from '@wordpress/icons'

export const ExportImportSettings = ( { pluginSettings } ) => {

	// ファイル名用
	const currentDate = new Date().toISOString().slice( 0, 10 );
	// 読み込み状態監視
	const [ isLoading, setIsLoading ] = useState( false )
	const [ tipMessage, setTipMessage ] = useState( { message: '' } )
	// インポートファイル用
	const [ importData, setImportData ] = useState( null )

	// ユーザー権限の取得
	const [ userCanManageSettings, setUserCanManageSettings ] = useState( false )
	useMemo( async () => {
		currentUserHasCapability( 'manage_options' )
		.then( result => {
			setUserCanManageSettings( result )
		} )
	}, [] )

	// グローバル設定の更新用(ストア更新前の状態管理用)
	const { setSetting } = useDispatch( STORE_NAME )

	// REST API 経由で更新
	useEffect( () => {
		if ( importData && typeof importData === 'object' && Object.keys( importData ).length > 0 && userCanManageSettings ) {
			// 保存用カスタムエンドポイントにPOST(更新)
			const save = async () => {
				try {
					setIsLoading( true )
					setTipMessage( { message: __( 'Importing...', dpaa.i18n ) } )

					// REST API 経由でデータベース更新
					const res = await apiFetch( {
						path: `${ STORE_NAME }/v1/update_option?name=${ OPTION_NAME }`,
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': dpaa.apiNonce,
						},
						data: { value: importData },
					} )
					if ( res?.success ) {
						// Datastoreで更新
						Object.keys( importData ).forEach( async key => {
							const value = importData[ key ];
							setSetting( key, value )
						} )

						alert( __( 'Imported successfully!\nReload the page.', dpaa.i18n ) )
						location.reload();
					} else {
						console.error( 'Could not update options.', res );
						alert( __( 'Could not update options.', dpaa.i18n ) )
					}
				} catch ( error ) {
					console.error( 'Updating Error', error );
					alert( __( 'Updating Error', dpaa.i18n ), error )
				} finally {
					setIsLoading( false )
					setImportData( null )
					setTipMessage( { message: '' } )
				}
			}
			save();
		}
	}, [ importData, userCanManageSettings ] )

	// エクスポート
	const handleExportSettings = async () => {
		try {
			setIsLoading( true )
			const res = await apiFetch( {
				path: `${ STORE_NAME }/v1/get_option?name=${ OPTION_NAME }`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': dpaa.apiNonce,
				},
			} )
			if ( res ) {
				const jsonData = JSON.stringify( res )
				// ローカルにダウンロードする
				const blob = new Blob( [ jsonData ], { type: 'application/json' } );
				const url = URL.createObjectURL( blob );
				const a = document.createElement( 'a' );
				a.href = url;
				a.download = `dpaa-settings-${ currentDate }.json`;
				document.body.appendChild( a );
				a.click();
				window.URL.revokeObjectURL( url );
			}
		} catch ( error ) {
			alert( error )
		} finally {
			setIsLoading( false )
			setTipMessage( { message: '' } )
		}
	}

	// インポート
	const importOptions = async () => {
		const input = document.createElement( 'input' );
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async ( event ) => {
			try {
				setIsLoading( true )
				setTipMessage( { message: __( 'Importing...', dpaa.i18n ) } )

				const file = event.target.files[0];
				if ( !file ) {
					return
				}
				const text = await file.text();
				const jsonData = JSON.parse( text )

				if ( jsonData && typeof jsonData === 'object' ) {
					setImportData( jsonData )
				}
			} catch ( error ) {
				console.error( 'Import error', error )
			} finally {
				setIsLoading( false )
				setTipMessage( { message: '' } )
			}
		};
		input.click();
	}

	return (
		<>
			<Spacer marginTop={ 4 }>
				<Flex
					direction='row'
					gap={ 3 }
					justify='flex-end'
					// className='dpaa-box-shadow-element'
				>
					<FlexItem>
						<Button
							onClick={ () => handleExportSettings() }
							icon={ downloadIcon }
							iconSize={ 22 }
							iconPosition='left'
							variant='primary'
							size='default'
							disabled={ isLoading }
							isBusy={ isLoading }
						>
							{ __( 'Export Settings', dpaa.i18n ) }
						</Button>
					</FlexItem>
					<FlexItem>
						<Button
							onClick={ () => importOptions() }
							icon={ uploadIcon }
							iconSize={ 22 }
							iconPosition='left'
							variant='primary'
							size='default'
							disabled={ isLoading }
							isBusy={ isLoading }
						>
							{ __( 'Import Settings', dpaa.i18n ) }
						</Button>
					</FlexItem>
				</Flex>
			</Spacer>
			<TipMessage
				message={ tipMessage?.message || '' }
				actions={ tipMessage?.actions || [] }
				explicitDismiss={ tipMessage?.explicitDismiss || false }
				isLoading={ isLoading }
			/>
		</>
	)
}

export default ExportImportSettings
