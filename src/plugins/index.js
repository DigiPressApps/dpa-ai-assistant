/**
 * Internal dependencies
 */
import { EditorDom } from './get-editor-dom'

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'

registerPlugin( 'dpaa-editor-dom', { render: EditorDom } )