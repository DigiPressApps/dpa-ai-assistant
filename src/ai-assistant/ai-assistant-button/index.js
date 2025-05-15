/**
 * Internal dependencies
 */
import './editor.scss'
import { AIAssistantModal } from '../ai-assistant-modal'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useState } from '@wordpress/element'
import { Button } from '@wordpress/components'

/**
 * External dependencies
 */
import classnames from 'classnames'

// ツールバー用のボタン
export const AIAssistantButton = props => {
	const {
		text = __( 'Assistant', dpaa.i18n ),
		lebel = __( 'Open the AI Assistant', dpaa.i18n ),
		showTooltip = true,
		size = 'default', // "small", "default", "compact"
		icon = null,
		iconSize = 24,
		iconPosition = 'left',
		variant = undefined,
		className = '',
		isInEditor = true,
		style = {},
	} = props

	const [ isOpenModal, setIsOpenModal ] = useState( false )

	// ボタンclass
	const buttonClasses = classnames( [
		'dpaa-button--insert-ai-assistant',
		className
	] )

	return (
		<>
			<Button
				onClick={ () => setIsOpenModal( true ) }
				className={ buttonClasses }
				icon={ icon }
				iconSize={ iconSize }
				iconPosition={ iconPosition }
				variant={ variant }
				disabled={ isOpenModal }
				size={ size }
				text={ text }
				label={ lebel }
				showTooltip={ showTooltip }
				style={ style }
			/>
			{ isOpenModal && (
				// モーダル表示
				<AIAssistantModal
					isOpenModal={ isOpenModal }
					isInEditor={ isInEditor }
					onClose={ () => setIsOpenModal( false ) }
				/>
			) }
		</>
	)
}