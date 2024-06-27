
/**
 * Internal dependencies
 */
import {
	addNewTagsAndReturnNewTagIds,
	cleanHtmlToText,
	isNewlinesOnly,
	sendMessage as sendMessageToChatGPT,
} from '@dpaa/util'
import {
	SYSTEM_PROMPT_GPT,
	MESSAGE_PROMPT_SUGGEST_TITLE,
	MESSAGE_PROMPT_SUGGEST_EXCERPT,
	MESSAGE_PROMPT_SUGGEST_TAG,
} from './system-prompt'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	Flex,
	FlexItem,
	Modal,
	Spinner,
} from '@wordpress/components'
import {
	useDispatch,
	useSelect,
	select,
} from '@wordpress/data';
import {
	useEffect,
	useState,
} from '@wordpress/element'
import {
	Icon,
	title as titleIcon,
	postContent as postContentIcon,
} from '@wordpress/icons'

export const ModalSuggest = props => {
	const {
		type,
		onRequestClose,
		openai,
		gptModel,
		maxTokens,
		propmtLanguage,
	} = props

	let modalTitle = ''
	let prefixPrompt = ''
	let buttonIcon = undefined
	if ( type === 'title' ) {
		modalTitle = __( 'New Titles', dpaa.i18n )
		prefixPrompt = MESSAGE_PROMPT_SUGGEST_TITLE
		buttonIcon = titleIcon
	}
	else if ( type === 'excerpt' ){
		modalTitle = __( 'New Excerpts', dpaa.i18n )
		prefixPrompt = MESSAGE_PROMPT_SUGGEST_EXCERPT
		buttonIcon = postContentIcon
	}

	const { getEntityRecords } = select( 'core' );
	const { saveEntityRecord } = useDispatch( 'core' );
	const { editPost } = useDispatch( 'core/editor' );

	const [ isLoading, setIsLoading ] = useState( true )
	const [ messagePrompt, setMessagePrompt ] = useState( '' )
	const [ response, setResponse ] = useState( null )
	const [ modalContent, setModalContent ] = useState( [] )
	const [ isGenerate, setIsGenerate ] = useState( false )
	const [ currentpPost, setCurrentpPost ] = useState( null )

	const [ errorMessage, setErrorMessage ] = useState( '' )

	// 現在の投稿タイトルと本文を取得
	const { postTitle, postContent } = useSelect( ( select ) => {
		const { getEditedPostAttribute } = select( 'core/editor' );
		return {
			postTitle: getEditedPostAttribute( 'title' ),
			postContent: getEditedPostAttribute( 'content' ),
		};
	} );

	// GPT への指示を整形
	useEffect( () => {
		let cleanMessage = ''
		if ( postContent && !isNewlinesOnly( postContent ) ) {
			// 本文がある場合は本文を優先
			cleanMessage += `\n${ cleanHtmlToText( postContent ) }`
		}
		else if ( postTitle ) {
			// 本文がない場合はタイトルを対象にする
			cleanMessage = `\n${ postTitle }\n`
		}
		if ( cleanMessage ) {
			setMessagePrompt( `${ prefixPrompt }${ propmtLanguage } \n\n"""${ cleanMessage }\n"""` )
		}
	}, [ postTitle, postContent ] )

	// レスポンスの取得
	useEffect( () => {
		if ( !isLoading && response ) {
			const suggestions = JSON.parse( response )
			if ( suggestions?.suggestions && Array.isArray( suggestions?.suggestions ) ) {
				setModalContent( suggestions.suggestions )
			}
		}
	}, [ isLoading, response ] )

	// 起動時に自動生成させる
	useEffect( () => {
		setIsGenerate( true )
		setCurrentpPost( select( 'core/editor' ).getCurrentPost() )
	}, [] )

	// 同期型 API リクエスト
	useEffect( () => {
		if ( isGenerate && messagePrompt ) {

			setIsLoading( true )
			setErrorMessage( '' )

			sendMessageToChatGPT( {
				systemPrompt: SYSTEM_PROMPT_GPT,
				message: messagePrompt,
				openai: openai,
				useStreaming: false,
				model: gptModel,
				temperature: 0.85,
				topP: 0.85,
				maxTokens: maxTokens,
				shouldReturnJson: true,
			} )
			.then( response => {
				if ( response?.response ) {
					setResponse( response?.response )
				} else {
					console.error( __( 'GPT response is null!', dpaa.i18n ) )
				}
			} )
			.catch( error => {
				console.error( error )
				setErrorMessage( error )
				setResponse( null )
			} )
			.finally( () => {
				setIsLoading( false )
				setIsGenerate( false )
			} )
		}
	}, [ messagePrompt, openai, gptModel, maxTokens, isGenerate ] )

	// サジェストボタンのコールバック
	const onClickSuggest = ( suggest ) => {
		// タイトルまたは抜粋をセット
		editPost( { [ `${ type }` ]: suggest } )
		// モーダルを閉じる
		onRequestClose()
	}

	return (
		<Modal
			title={ modalTitle }
			size='small'
			closeButtonLabel={ __( 'Close' ) }
			onRequestClose={ onRequestClose }
			className='dpaa-modal dpaa-modal--suggest'
			icon={ <Icon icon={ buttonIcon } /> }
			shouldCloseOnClickOutside={ true }
			style={ {
				width: '100%',
				maxWidth: '540px'
			} }
		>
			{ isLoading && (
				<Spinner
					style={ {
						width: '30px',
						height: '30px',
					} }
				/>
			) }
			{ ( !isLoading && modalContent && Array.isArray( modalContent ) ) && (
				<BaseControl
					label={ sprintf( __( 'Click to replace with new %s', dpaa.i18n ), __( type, dpaa.i18n ) ) }
				>
					<Flex
						direction='column'
						gap={ 2 }
						expanded={ true }
						className='dpaa-components-flex'
					>
						{ modalContent.map( ( item, index ) => (
							<FlexItem isBlock={ true }>
								<Button
									className={ `dpaa-button--flex-item dpaa-button--suggested-item __type-${ type }` }
									onClick={ () => onClickSuggest( item ) }
								>
									{ item }
								</Button>
							</FlexItem>
						) ) }
						<FlexItem>
							<Flex
								justify='flex-end'
							>
								<FlexItem>
									<Button
										icon={ !modalContent ? buttonIcon : 'controls-repeat' }
										iconSize={ 20 }
										iconPosition='left'
										variant='primary'
										size='compact'
										className='dpaa-button--flex-item dpaa-button--suggested-generate'
										onClick={ () => setIsGenerate( true ) }
										disabled={ isLoading || !modalContent }
										isBusy={ isGenerate }
									>
										{ !modalContent ? __( 'Generate', dpaa.i18n ) : __( 'Regenerate', dpaa.i18n ) }
									</Button>
								</FlexItem>
							</Flex>
						</FlexItem>
						{ errorMessage && (
							<FlexItem>
								<div className='dpaa__visible-error-message'>{ errorMessage.toString() }</div>
							</FlexItem>
						) }
					</Flex>
				</BaseControl>
			) }
		</Modal>
	)
}