/**
 * Internal dependencies
 */
import {
	CategorySelector,
	QueryControl,
} from '@dpaa/components'
import {
	convertMarkdownToHTML,
	createPost,
} from '@dpaa/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	ExternalLink,
	Notice,
} from '@wordpress/components'
import {
	useState,
	useEffect,
	memo,
} from '@wordpress/element'
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	drafts as draftsIcon,
	post as postIcon,
} from '@wordpress/icons'

const formatDateTime = ( date ) => {
	return date.toLocaleString( 'sv-SE' )
	// const dateString = date.toLocaleDateString( 'sv-SE' );
	// const timeString = date.toLocaleTimeString();
	// return `${ dateString } ${ timeString }+09:00`;
}

export const PublishArea = memo( props => {
	const {
		isLoading,
		title,
		sections,
		content,
		excerpt,
		isInsertTOC,
		isTOCOrderedList,
		showTOCTitle,
		tocTitle,
		tocTitleTag,
		clearGeneratedElements,
		setIsLoading,
		setErrorMessage,
		setTipMessage,
		isInEditor,
	} = props

	// 投稿ID
	const [ postID, setPostID ] = useState( null )

	// 投稿クエリ用
	const [ postType, setPostType ] = useState( 'post' )
	const [ author, setAuthor ] = useState( null )
	const [ categories, setCategories ] = useState( [ dpaa.defaultCategoryId ] )
	const [ date, setDate ] = useState( formatDateTime( new Date() ) )

	// ログイン中のユーザー、現在の編集中の投稿IDの取得
	const { currentUser, currentPostId } = useSelect( ( select ) => {
		const { getCurrentUser } = select( coreStore );

		return {
			currentUser: getCurrentUser(),
			currentPostId: isInEditor ? select('core/editor').getCurrentPostId() : postID,
		}
	}, [ postID ] );

	// ログイン中のユーザー(currentUser)を author の初期値としてセット 
	useEffect( () => {
		if ( currentUser?.id ) {
			setAuthor( currentUser?.id )
		}
	}, [ currentUser ] )

	// 投稿処理ハンドラー
	const handlePosting = async ( status ) => {
		setIsLoading( true )

		try {
			let newContent = content

			// **** npm run start (デバッグ)中は renderToString が実行できないので注意 ***
			// Markdown 記法のテキストをHTML(文字列)に変換
			let htmlContent = convertMarkdownToHTML( {
				markdownText: newContent,
				returnAsHTMLText: true,
				showTOC: isInsertTOC,
				isTOCOrderedList: isTOCOrderedList,
			} )

			if ( htmlContent && typeof htmlContent === 'string' ) {
				// 目次にタイトルを付ける
				if ( isInsertTOC && showTOCTitle ) {
					htmlContent = `<${ tocTitleTag }>${ tocTitle }</${ tocTitleTag }>\n${ htmlContent }`
				}

				try {
					setTipMessage( {
						message:  __( 'Posting...Please wait.', dpaa.i18n ),
						actions: [],
						explicitDismiss: false
					} )

					const result = await createPost( {
						status: status,
						type: postType,
						title: title,
						content: htmlContent,	// クラシックブロックになる
						excerpt: excerpt,
						date: date,
						categories: categories,
						author: author,
					} )

					if ( result?.data?.status === 200 ) {
						// 投稿IDのセット
						setPostID( result?.postID )
						// アイキャッチ画像なし
						setIsLoading( false ) 
						setTipMessage( {
							message:  __( 'Posted!', dpaa.i18n ),
							actions: [ {
								label: __( 'Edit post', dpaa.i18n ),
								url: `${ dpaa.siteUrl }/wp-admin/post.php?post=${ result?.postID }&action=edit`
							} ],
							explicitDismiss: false
						} )
						setTimeout(() => {
							setTipMessage( {
								message: '',
								actions: [],
								explicitDismiss: false,
							} )
						}, 5000 );
					} else {
						setIsLoading( false )
						console.error( result )
						setErrorMessage( result?.message )
						setTipMessage( {
							message:  '',
							actions: [],
							explicitDismiss: false
						} )
					}
				} catch ( error ) {
					setIsLoading( false )
					console.error( error )
					setErrorMessage( error )
					setTipMessage( {
						message:  '',
						actions: [],
						explicitDismiss: false
					} )
				}
			} else {
				setIsLoading( false )
				setTipMessage( {
					message:  '',
					actions: [],
					explicitDismiss: false
				} )
			}
		} catch ( error ) {
			setIsLoading( false )
			setTipMessage( {
				message:  '',
				actions: [],
				explicitDismiss: false
			} )
		}	
	}

	return (
		<Flex
			className='dpaa-box-shadow-element'
			direction='column'
			justify='flex-start'
			gap={ 4 }
			style={ {
				position: 'sticky',
				top: '44px',
				height: 'auto',
			} }
		>
			<FlexItem>
				<Flex
					direction='column'
					justify='flex-start'
					gap={ 1 }
				>
					<FlexItem>
						{ postType === 'post' && (
							<CategorySelector
								value={ categories }
								onChange={ newVal => setCategories( newVal?.category || [ dpaa.defaultCategoryId ] ) }
								label={ __( 'Categories' ) }
								maxLength={ 100 }
								placeholder={ __( 'Enter category name', dpaa.i18n ) }
							/>
						) }
					</FlexItem>
					<FlexItem>
						<QueryControl
							postType={ postType }
							authors={ author }
							maxAuthors={ 1 }
							currentDate={ date }
							onChangePostType={ newVal => setPostType( newVal ) }
							onChangeDate={ newVal => setDate( newVal ) }
							onChangeDateReset={ () => setDate( formatDateTime( new Date() ) ) }
							onChangeAuthors={ () => {} }
						/>
					</FlexItem>
				</Flex>
			</FlexItem>
			<FlexItem>
				<Flex
					direction='row'
					justify='center'
					gap={ 2 }
					wrap={ true }
				>
					<FlexItem>
						<Button
							size='compact'
							showTooltip
							label={ __( 'Clear generated contents.', dpaa.i18n ) }
							className='dpaa-button--flex-item'
							icon='trash'
							iconSize={ 20 }
							isDestructive={ true }
							variant='primary'
							disabled={ isLoading || ( !title && !sections && !content && !excerpt ) }
							onClick={ () => {
								if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
									clearGeneratedElements()
								}
							} }
						/>
					</FlexItem>
					<FlexItem>
						<Button
							__next40pxDefaultSize={ true }
							icon={ draftsIcon }
							iconSize={ 20 }
							iconPosition='left'
							variant='secondary'
							size='compact'
							className='dpaa-button--flex-item'
							onClick={ () => handlePosting( 'draft' ) }
							disabled={ isLoading || !content }
							isBusy={ isLoading }
						>
							{ __( 'Save draft', dpaa.i18n ) }
						</Button>
					</FlexItem>
					<FlexItem>
						<Button
							__next40pxDefaultSize={ true }
							icon={ postIcon }
							iconSize={ 20 }
							iconPosition='left'
							variant='primary'
							size='compact'
							className='dpaa-button--flex-item'
							onClick={ () => handlePosting( 'publish' ) }
							disabled={ isLoading || !content }
							isBusy={ isLoading }
						>
							{ __( 'Publish' ) }
						</Button>
					</FlexItem>
				</Flex>
			</FlexItem>
			{ postID && (
				<FlexItem>
					<Notice
						className="dpaa-ai-assistant--settings__notice-component"
						status="info"
						isDismissible={ false }
					>
						<Flex
							direction='column'
							gap={ 1 }
						>
							<FlexItem>
								<ExternalLink
									href={ `${ dpaa.siteUrl }/wp-admin/post.php?post=${ postID }&action=edit` }
									type="link"
									rel="next"
								>
									{ __( 'Edit post', dpaa.i18n ) }
								</ExternalLink>
							</FlexItem>
						</Flex>
					</Notice>
				</FlexItem>
			) }
		</Flex>
	)
} )