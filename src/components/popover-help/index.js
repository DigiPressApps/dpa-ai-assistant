/**
 * Internal dependencies
 */
import './editor.scss'

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Popover,
} from '@wordpress/components'
import { useState } from '@wordpress/element'

export const PopoverHelp = ( props ) => {
	const {
		buttonClass,
		buttonVariant,
		buttonIcon,
		buttonText,
		buttonSize,
		popoverPosition,
		popoverVariant,
		popoverOffset,
		popoverClass,
		popoverNoArrow,
		help,
		enableInnerHTMLHelp,
		maxWidth,
	} = props

	const buttonClasses = classnames( [
		'dpaa-components-popover-help__button',
		buttonClass,
	] )

	const popoverClasses = classnames( [
		'dpaa-components-popover-help__popover',
		popoverClass,
	] );

	const [ isVisible, setIsVisible ] = useState( false )
	
	return (
		<Button
			__next40pxDefaultSize
			className={ buttonClasses }
			variant={ buttonVariant }
			size={ buttonSize }
			icon={ buttonIcon }
			onClick={ () => setIsVisible( !isVisible ) }
		>
			{ buttonText }
			{ isVisible && (
				<Popover
					className={ popoverClasses }
					position={ popoverPosition }
					variant={ popoverVariant }
					noArrow={ popoverNoArrow }
					offset={ popoverOffset }
				>
					{ enableInnerHTMLHelp
						? <span dangerouslySetInnerHTML={ { __html: help } } />
						: help
					}
				</Popover>
			) }
			</Button>
	)
}

PopoverHelp.defaultProps = {
	buttonClass: '',
	buttonVariant: 'tertiary',
	buttonIcon: 'warning',
	buttonText: __( 'About', dpaa.i18n ),
	buttonSize: 'small',
	popoverPosition: 'bottom left',
	popoverVariant: 'toolbar',
	popoverOffset: 5,
	popoverClass: '',
	popoverNoArrow: false,
	help: '',
	enableInnerHTMLHelp: true,
	maxWidth: '650px',
}

export default PopoverHelp