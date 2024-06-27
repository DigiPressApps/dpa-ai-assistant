/**
 * Internal dependencies
 */
import '../editor.scss'
import '@dpaa/scss/common/editor.scss'
import '@dpaa/ai-assistant/editor.scss'
import '@dpaa/datastore'
import {
	STORE_NAME,
	OPTION_NAME,
} from '@dpaa/datastore/constants'
import {
	ChatPanel,
	ImageGenerationPanel,
	WriterPanel,
	FineTuningPanel,
	TranscriptionPanel,
	SettingsPanel,
} from '@dpaa/ai-assistant/functions'
import { currentUserHasCapability } from '@dpaa/util'
import { UpgradeLabel } from '@dpaa/components'
import { aiRobotIcon } from '@dpaa/ai-assistant/icons'
import { DpIcon } from '@dpaa/icons'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import apiFetch from '@wordpress/api-fetch'
import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import {
	createRoot,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element'
import {
	Icon,
	Spinner,
	TabPanel,
	Flex,
	FlexItem,
	__experimentalHeading as Heading,
} from '@wordpress/components'
import {
	cog as cogIcon,
	postComments as postCommentsIcon,
	image as imageIcon,
	pencil as pencilIcon,
	tool as toolIcon,
} from '@wordpress/icons'

/**
 * External dependencies
 */
import OpenAI from "openai";

export const PluginMemu = () => {
	// ユーザー権限の取得
	const [ userCanManageSettings, setUserCanManageSettings ] = useState( false )
	useMemo( async () => {
		currentUserHasCapability( 'manage_options' )
		.then( result => {
			setUserCanManageSettings( result )
		} )
	}, [] )

	// ストアから全設定を取得
	const pluginSettings = useSelect( ( select ) => {
		return select( STORE_NAME ).getSettings()
	}, [] );

	useEffect( () => {
		if ( typeof pluginSettings === 'object' && Object.keys( pluginSettings ).length > 0 && userCanManageSettings ) {
			// 保存用カスタムエンドポイントにPOST
			apiFetch( {
				path: `${ STORE_NAME }/v1/update_option?name=${ OPTION_NAME }`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': dpaa.apiNonce,
				},
				data: { value: pluginSettings },
			} )
			.then( res => {
				if ( !res?.success ) {
					console.error( 'Could not update options.' );
				}
			} )
			.catch( error => {
				console.error( 'Updating Error', error );
			} );
		}
	}, [ pluginSettings, userCanManageSettings ] )

	// OpenAIインスタンス生成
	const openai = useMemo( () => {
		if ( pluginSettings?.openAISettings?.apiKey ) {
			return new OpenAI( {
				apiKey: pluginSettings?.openAISettings?.apiKey,
				dangerouslyAllowBrowser: true
			} );
		} else {
			return null;
		}
	}, [ pluginSettings?.openAISettings?.apiKey ] );

	// タブ切り替え状態監視
	const [ activeTabName, setActiveTabName ] = useState( pluginSettings?.generalSettings?.initialTab || 'chat' )
	const onSelect = tabName => {
		setActiveTabName( tabName )
	}

	// タブ
	const [ tabs, setTabs ] = useState( null );
	useEffect( () => {
		// ライセンスが有効の場合のみタブを追加
		const currentTabs = [
			{
				name: 'chat',
				titleName: __( 'Chat', dpaa.i18n ),
				title: <><Icon icon={ postCommentsIcon } className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Chat', dpaa.i18n ) }</>,
				className: 'dpaa-tab-panel__tab tab--chat',
			},
			{
				name: 'generateImage',
				titleName: __( 'Image Generation', dpaa.i18n ),
				title: <><Icon icon={ imageIcon } className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Image Generation', dpaa.i18n ) }</>,
				className: 'dpaa-tab-panel__tab tab--generate-image',
			},
			{
				name: 'writer',
				titleName: __( 'Writer', dpaa.i18n ),
				title: <><Icon icon={ pencilIcon } className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Writer', dpaa.i18n ) }</>,
				className: 'dpaa-tab-panel__tab tab--ai-writer',
			},
			{
				name: 'voiceConversion',
				titleName: __( 'Voice Conversion', dpaa.i18n ),
				title: <><Icon icon='microphone' className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Voice Conversion', dpaa.i18n ) }</>,
				className: 'dpaa-tab-panel__tab tab--ai-voice-conversion',
			},
		];

		// 設定パネルは管理者権限ユーザーのみ
		if ( userCanManageSettings ) {
			currentTabs.push(
				{
					name: 'assistants',
					titleName: __( 'Assistants', dpaa.i18n ),
					title: <><Icon icon={ aiRobotIcon } className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Assistants', dpaa.i18n ) }</>,
					className: 'dpaa-tab-panel__tab tab--assistants',
				},
				{
					name: 'fineTuning',
					titleName: __( 'AI Tuning', dpaa.i18n ),
					title: <><Icon icon={ toolIcon } className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'AI Tuning', dpaa.i18n ) }</>,
					className: 'dpaa-tab-panel__tab tab--fine-tuning',
				},
				{
					name: 'settings',
					titleName: __( 'Settings', dpaa.i18n ),
					title: <><Icon icon={ cogIcon } className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Settings', dpaa.i18n ) }</>,
					className: 'dpaa-tab-panel__tab tab--settings',
				}
			)
		}
		setTabs( currentTabs )
	}, [ userCanManageSettings ] )

	// タブコンテンツ
	const tabContents = ( tab ) => {
		return (
			<>
				{ tab.name === 'chat' && (
					<ChatPanel
						pluginSettings={ pluginSettings }
						openai={ openai }
						userCanManageSettings={ userCanManageSettings }
						isInEditor={ false }
					/>
				) }
				{ tab.name === 'generateImage' && (
					<ImageGenerationPanel
						pluginSettings={ pluginSettings }
						openai={ openai }
						userCanManageSettings={ userCanManageSettings }
						isInEditor={ false }
					/>
				) }
				{ tab.name === 'writer' && (
					<WriterPanel
						pluginSettings={ pluginSettings }
						openai={ openai }
						userCanManageSettings={ userCanManageSettings }
						isInEditor={ false }
					/>
				) }
				{ tab.name === 'voiceConversion' && (
					<TranscriptionPanel
						pluginSettings={ pluginSettings }
						openai={ openai }
						userCanManageSettings={ userCanManageSettings }
						isInEditor={ false }
					/>
				) }
				{ tab.name == 'assistants' && (
					<Flex justify='center' className='dpaa-box-shadow-element'>
						<FlexItem>
							<UpgradeLabel text={ __( 'Available in Pro version', dpaa.i18n ) } textSize='18px' padding='0 22px' height='50px' borderRadius='25px' margin='8vh auto' />
						</FlexItem>
					</Flex>
				) }
				{ tab.name === 'fineTuning' && (
					<FineTuningPanel
						pluginSettings={ pluginSettings }
						openai={ openai }
						userCanManageSettings={ userCanManageSettings }
						isInEditor={ false }
					/>
				) }
				{ ( tab.name === 'settings' && userCanManageSettings ) && (
					<SettingsPanel
						pluginSettings={ pluginSettings }
						openai={ openai }
						isInEditor={ false }
					/>
				) }
			</>
		)
	}
	
	// 見出しタイトル
	const headingTitle = `${ __( 'AI Assistant', dpaa.i18n ) }: ${ tabs?.find( tab => tab.name === activeTabName )?.titleName || '' }`

	return (
		<div
			style={ {
				'--dpaa-adminl-pane--max-width': `${ pluginSettings?.generalSettings?.adminPanelMaxWidth }px` || 1024
			} }
		>
			<header className='dpapps-plugin-menu__header'>
				<DpIcon />
				<Heading
					color="#1d2327"
					isBlock
					level="1"
					weight="700"
				>
					{ headingTitle }
				</Heading>
			</header>
			{ ( typeof pluginSettings !== 'object' || Object.keys( pluginSettings ).length === 0 )
			? ( <Spinner
					style={ {
						width: '30px',
						height: '30px',
					} }
				/> )
			: tabs && (
				<TabPanel
					className='dpapps-plugin-menu__tab-container'
					orientation='horizontal'
					initialTabName={ pluginSettings?.generalSettings?.initialTab }
					onSelect={ onSelect }
					tabs={ tabs }>
					{
						( tab ) => tabContents( tab )
					}
				</TabPanel>
			) }
		</div>
	)
}

const display = () => {
	const container = document.getElementById( 'dpaa-plugin-menu' );
	const root = createRoot( container );
	root.render( <PluginMemu /> );
}

domReady( display )