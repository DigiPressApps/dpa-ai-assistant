/**
 * Internal dependencies
 */
import '../editor.scss'
import '@dpaa/scss/common/editor.scss'
import '@dpaa/ai-assistant/editor.scss'
import { DpIcon } from '@dpaa/icons'
import { DashboardTab } from './tabs/dashboard'
import { ToolsTab } from './tabs/tools'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { __ } from '@wordpress/i18n'
import {
	Icon,
	TabPanel,
	__experimentalHeading as Heading,
} from '@wordpress/components'
import {
	createRoot,
	useState,
} from '@wordpress/element'
import {
	home as homeIcon,
	tool as toolIcon,
} from '@wordpress/icons'

export const Dashboard = () => {
	// タブ切り替え状態監視
	const [ activeTabName, setActiveTabName ] = useState( 'dashboard' )
	const onSelect = tabName => {
		setActiveTabName( tabName )
	}

	// タブ
	const [ tabs, setTabs ] = useState( [
		{
			name: 'dashboard',
			titleName: __( 'Dashboard', dpaa.i18n ),
			title: <><Icon icon={ homeIcon } className='dpapps-tab-panel__tab-icon' size='24' />{ __( 'Dashboard', dpaa.i18n ) }</>,
			className: 'dpapps-tab-panel__tab tab--dashboard',
		},
		{
			name: 'tools',
			titleName: __( 'Tools', dpaa.i18n ),
			title: <><Icon icon={ toolIcon } className='dpapps-tab-panel__tab-icon' size='24' />{ __( 'Tools', dpaa.i18n ) }</>,
			className: 'dpapps-tab-panel__tab tab--tools',
		},
	] )

	// 見出しタイトル
	const headingTitle = `${ __( 'DigiPress Apps', dpaa.i18n ) }: ${ tabs.find( tab => tab.name === activeTabName )?.titleName }`

	return (
		<div className='dpapps--admin-dashboard'>
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
			<TabPanel
				className='dpapps-plugin-menu__tab-container'
				orientation='horizontal'
				initialTabName='dashboard'
				onSelect={ onSelect }
				tabs={ tabs }>
				{
					( tab ) =>
					<>
						{ tab.name === 'dashboard' && (
							<DashboardTab />
						) }
						{ ( tab.name === 'tools' ) && (
							<ToolsTab />
						) }
					</>
				}
			</TabPanel>
		</div>
	)
}

const display = () => {
	const container = document.getElementById( 'digipress-apps-dashboard' );
	const root = createRoot( container );
	root.render( <Dashboard /> );
}

domReady( display )