
/**
 * Internal dependencies
 */
import {
	TipMessage,
} from '@dpaa/components'
import {
	OPEN_AI_API_KEY_URL,
} from '@dpaa/ai-assistant/constants'
import { Files } from './files'
import { VectorStores } from './vector-stores'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Icon,
	BaseControl,
	Button,
	CustomSelectControl,
	ExternalLink,
	Flex,
	FlexItem,
	Modal,
	Notice,
	Snackbar,
	Spinner,
	ToggleControl,
	__experimentalInputControl as InputControl,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	useState,
	memo,
} from '@wordpress/element'

export const StorageModal = memo( props => {
	const {
		openai,
		pluginSettings,
		onRequestClose,
	} = props

	if ( !openai || !pluginSettings || !onRequestClose ) {
		return null
	}

	// API設定
	const apiSettings = pluginSettings?.openAISettings

	// Open API設定用
	const [ apiKey, setApiKey ] = useState( null )

	// チップメッセージ表示用
	const [ tipMessage, setTipMessage ] = useState( { message: '' } )
	// 読み込み状態管理用
	const [ isLoading, setIsLoading ] = useState( false )

	// パネル管理
	const [ filesPanel, setFilesPanel ] = useState( null )
	const [ vectorStoresPanel, setVectorStoresPanel ] = useState( null )

	useEffect( () => {
		if ( apiSettings ) {
			setApiKey( apiSettings?.apiKey )
		}
	}, [ apiSettings ] )

	useEffect( () => {
		if ( !openai || !apiKey ) {
			setFilesPanel( 
				<>
					<Text
						display='block'
						size='13px'
						weight='normal'
					>
						{ __( 'There is no uploaded file. First, get your OpenAI API key and save it in the plugin settings.', dpaa.i18n ) }
					</Text>
					<Notice
						className="dpaa-ai-assistant--settings__notice-component"
						status="info"
						isDismissible={ false }
					>
						<Flex
							direction='column'
							gap={ 2 }
						>
							<FlexItem>
								<ExternalLink
									href={ OPEN_AI_API_KEY_URL }
									type="link"
									rel="next"
								>
									{ __( 'Get the API key.', dpaa.i18n ) }
								</ExternalLink>
							</FlexItem>
						</Flex>
					</Notice>
				</>
			)
			setVectorStoresPanel( <></> )
		}
		else if ( openai && apiKey ) {
			setFilesPanel(
				<Files
					openai={ openai }
					setIsLoading={ setIsLoading }
					setTipMessage={ setTipMessage }
				/>
			)
			setVectorStoresPanel(
				<VectorStores />
			)
		}
	}, [ openai, apiKey ] )

	// タブの状態管理用
	const [ activeTabName, setActiveTabName ] = useState( 'files' )
	const onSelectTab = tabName => {
		setActiveTabName( tabName )
	}

	// タブパネル
	const tabs = [
		{
			name: 'files',
			titleName: __( 'Files', dpaa.i18n ),
			title: <><Icon icon='list-view' className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Uploaded Files', dpaa.i18n ) }</>,
			className: 'dpaa-tab-panel__tab tab--files',
		},
		{
			name: 'vectorStores',
			titleName: __( 'Vector Stores', dpaa.i18n ),
			title: <><Icon icon='database' className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Vector Stores', dpaa.i18n ) }</>,
			className: 'dpaa-tab-panel__tab tab--vectorStores',
		},
	]
	
	return (
		<Modal
			title={ __( 'Storage Management', dpaa.i18n ) }
			size='large'
			closeButtonLabel={ __( 'Close' ) }
			onRequestClose={ onRequestClose }
			className='dpaa-modal dpaa-modal--storage-management'
			icon={ <Icon icon='cloud' /> }
			shouldCloseOnClickOutside={ true }
			style={ {
				width: '100%',
				maxWidth: '1280px'
			} }
		>
			<TabPanel
				className='dpaa--inner-tab-container'
				orientation='horizontal'
				initialTabName={ activeTabName }
				onSelect={ onSelectTab }
				tabs={ tabs }>
				{
					( tab ) =>
					<>
						{ tab.name === 'files' && filesPanel }
						{ tab.name === 'vectorStores' && vectorStoresPanel }
					</>
				}
			</TabPanel>
			<TipMessage
				message={ tipMessage?.message || '' }
				actions={ tipMessage?.actions || [] }
				explicitDismiss={ tipMessage?.explicitDismiss || false }
				isLoading={ isLoading }
			/>
		</Modal>
	)
} )