/**
 * Internal dependencies
 */
import './store'

/**
 * WordPress dependencies
 */
import {
	useState,
	useEffect,
	useMemo,
	useRef,
} from '@wordpress/element'
import { dispatch, useSelect } from '@wordpress/data'

/**
 * Gets the editor wrapper DOM element. This should be the way if you need to do
 * a querySelector and to get the raw DOM element of a block. This handles
 * iframe Tablet and Mobile previews introduced in WP 5.9.
 *
 * Take note that this can produce a `null` value if the editor is still
 * transitioning from Desktop to Tablet or Mobile previews.
 *
 * This is done here so that this costly operation is only done once when the
 * editor changes preview modes.
 *
 * @return {DomElement} This can be null when the editor is transitioning from
 * one device size to another.
 */
export const EditorDom = () => {
	const [ iframeForceUpdate, setIframeForceUpdate ] = useState( 0 )
	const [ editorDom, setEditorDom ] = useState( null )
	const timeout = useRef( undefined )
	const interval = useRef( undefined )

	// If in FSE, switching templates will recreate the editor.
	const editedSitePostId = useSelect( select => {
		return select( 'core/edit-site' )?.getEditedPostId?.()
	} )

	useEffect( () => {
		// If the editor is available right away, use it.
		const editorEl = document.querySelector( `.editor-styles-wrapper, iframe[name="editor-canvas"]` )
		if ( editorEl ) {
			setIframeForceUpdate( v => v + 1 )
		}

		// We have to wait for the editor area to load (e.g. FSE iframe takes a long time to load)
		interval.current = setInterval( () => {
			const editorEl = document.querySelector( `.editor-styles-wrapper, iframe[name="editor-canvas"]` )
			if ( editorEl ) {
				clearInterval( interval.current )
				clearTimeout( timeout.current )
				setIframeForceUpdate( v => v + 1 )
				// There's a chance that the editor STILL isn't ready, try again.
				setTimeout( () => {
					setIframeForceUpdate( v => v + 1 )
				}, 200 )
			}
		}, 200 )

		return () => {
			clearInterval( interval.current )
			clearTimeout( timeout.current )
		}
	}, [ editedSitePostId ] )

	useMemo( () => {
		const iframeEl = document.querySelector( `iframe[name="editor-canvas"]` )
		if ( iframeEl ) {
			setEditorDom( iframeEl.contentDocument.body )
		} else {
			setEditorDom( document.querySelector( `.editor-styles-wrapper` ) )
		}
	}, [ iframeForceUpdate ] )

	// Need to run dispatch in a useEffect or else we will get a React error
	// about updating a component while rendering another:
	// @see https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
	useEffect( () => {
		if ( editorDom ) {
			dispatch( 'dpaa/editor-dom' ).updateEditorDom( editorDom )
		}
	}, [ editorDom ] )

	// Don't render anything.
	return null
}
