/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const mediaLibrary = props => {
	const {
		title = __( 'Select an image', dpaa.i18n ),
		multiple = false,
		type = 'image',
		buttonText = __( 'Select' ),
	} = props

	return wp.media( {
		title: title,
		multiple: multiple,
		library: {
			type: type,
		},
		button: {
			text: buttonText
		}
	} )
}