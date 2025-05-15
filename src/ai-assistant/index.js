/**
 * Internal dependencies
 */
import './editor.scss'
import {
	// DpIcon,
	AICPU as AICPUIcon
} from '@dpaa/icons'
import { AIAssistantButton } from './ai-assistant-button'
import { CustomInspectorControlPanel } from './sidebar'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { createRoot } from '@wordpress/element'
import {
	Icon,
	__experimentalText as Text
} from '@wordpress/components'
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
			icon={ <Icon icon={ AICPUIcon } style={ { width: '24px', height: '24px' } } /> }
			iconSize={ 24 }
			variant={ undefined }
			lebel={ __( 'Open the AI Assistant', dpaa.i18n ) }
			text={ <Text size={ 12 }>{ __( 'Assistant', dpaa.i18n ) }</Text> }
			showTooltip={ true }
			size='default'
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