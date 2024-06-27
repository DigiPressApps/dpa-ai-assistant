/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	MenuGroup,
	MenuItem,
} from '@wordpress/components'
import { pencil as pencilIcon } from '@wordpress/icons'

export const DropdownButtonsForSelectedText = ( props ) => {
	const {
		onClose,
		setSelectedTextOperation,
		setSelectedTextOperationMessage,
		selectedTextTarget,
	} = props

	return (
		<MenuGroup>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'summarize' )
					setSelectedTextOperationMessage( sprintf( 'Summarize the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Summarize the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'bulleted_list' )
					setSelectedTextOperationMessage( sprintf( 'Summarize the %s in bulleted list', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Summarize the %s in bulleted list', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'expand' )
					setSelectedTextOperationMessage( sprintf( 'Expand the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Expand the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'rewrite' )
					setSelectedTextOperationMessage( sprintf( 'Rewrite the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Rewrite the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'suggest_title' )
					setSelectedTextOperationMessage( sprintf( 'Suggest a title about the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Suggest a title about the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'excerpt' )
					setSelectedTextOperationMessage( sprintf( 'Create an excerpt of the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Create an excerpt of the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'paragraph' )
					setSelectedTextOperationMessage( sprintf( 'Write a paragraph about the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Write a paragraph about the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'article' )
					setSelectedTextOperationMessage( sprintf( 'Write an article about the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Write an article about the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'conclusion' )
					setSelectedTextOperationMessage( sprintf( 'Write a conclusion about the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Write a conclusion about the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'opinion' )
					setSelectedTextOperationMessage( sprintf( 'Express your opinions about the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Express your opinions about the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'counterargument' )
					setSelectedTextOperationMessage( sprintf( 'Provide a counterargument about the %s', selectedTextTarget ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Provide a counterargument about the %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'translate_japanese' )
					setSelectedTextOperationMessage( sprintf( 'Translate the %s into %s', selectedTextTarget, 'Japanese' ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Translate the %s into %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ), __( 'Japanese', dpaa.i18n ) ) }
			</MenuItem>
			<MenuItem
				icon={ pencilIcon }
				onClick={ () => {
					setSelectedTextOperation( 'translate_english' )
					setSelectedTextOperationMessage( sprintf( 'Translate the %s into %s', selectedTextTarget, 'English' ) )
					onClose()
				} }
			>
				{ sprintf( __( 'Translate the %s into %s', dpaa.i18n ), __( selectedTextTarget, dpaa.i18n ), __( 'English' ) ) }
			</MenuItem>
		</MenuGroup>
	)
}

export default DropdownButtonsForSelectedText