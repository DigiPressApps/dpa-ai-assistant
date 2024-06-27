/**
 * Internal dependencies
 */
import './editor.scss'
import { DpIcon } from '@dpaa/icons'
import { AIAssistantButton } from './ai-assistant-button'
import { CustomInspectorControlPanel } from './sidebar'

/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element'
import { subscribe } from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'
import domReady from '@wordpress/dom-ready'

// マウント(ツールバーボタンの追加)
const mountAIAssistant = () => {
	// ツールバーボタンを表示
	const buttonDiv = document.createElement( 'div' )
	buttonDiv.classList.add( 'dpaa-insert-toolbar-button__wrapper' )
	createRoot( buttonDiv ).render(
		<AIAssistantButton
			icon={ <DpIcon /> }
			iconSize={ 24 }
			variant='primary'
			className='__in-toolbar'
			isInEditor={ true }
		/>
	)

	subscribe( () => {
		setTimeout( () => {
			const toolbar = document.querySelector( '.edit-post-header-toolbar' )
			if ( toolbar ) {
				// If the button gets lost, just attach it again.
				if ( ! toolbar.querySelector( '.dpaa-insert-toolbar-button__wrapper' ) ) {
					toolbar.appendChild( buttonDiv )
				}
			}
		}, 1 )
	} )
}

domReady( mountAIAssistant )

// 「投稿」サイドバーへの追加
registerPlugin(
	'dpaa-register-custom-inspector-control-panel',
	{
		render: CustomInspectorControlPanel,
	}
);