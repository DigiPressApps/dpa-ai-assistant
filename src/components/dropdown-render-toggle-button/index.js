/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	Button,
	ButtonGroup,
	__experimentalTheme as Theme,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export const DropdownRenderToggleButton = props => {
	const {
		className = 'dpaa-inspector__dropdown-button',
		buttonGroudClassName = 'dpaa-inspector__dropdown-button-group',
		icon = undefined,
		iconSize = 30,
		label = __( 'Open the setting panel', dpaa.i18n ),
		size = 'default',
		text,
		variant = 'secondary',
		useResetButton = false,
		onChangeReset = undefined,
		onToggle,
		isOpen,
	}= props

	if ( !onToggle ) {
		return
	}

	const toggleProps = {
		onClick: onToggle,
		className: classnames(
			className,
			{ 'is-open': isOpen }
		),
		'aria-expanded': isOpen,
	};

	return (
		<ButtonGroup className={ buttonGroudClassName }>
			<Button
				{ ...toggleProps }
				__next40pxDefaultSize
				label={ label }
				size={ size }
				isPressed={ isOpen }
				icon={ icon }
				iconSize={ iconSize }
				variant={ variant }
			>
				{ text }
			</Button>
			{ ( useResetButton && onChangeReset ) && (
				<Button
					__next40pxDefaultSize
					className='dpaa-inspector__dropdown-button-reset'
					size='default'
					onClick={ () => onChangeReset( '' ) }
					label={ __( 'Reset' ) }
					icon='no-alt'
					iconSize={ 20 }
					variant='tertiary'
				/>
			) }
		</ButtonGroup>
	);
};

export default DropdownRenderToggleButton