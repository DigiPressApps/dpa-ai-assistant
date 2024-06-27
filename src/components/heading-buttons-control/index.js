/**
 * Internal dependencies
 */
import { AdvancedToggleGroupControl } from '../../components'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'

const TAG_OPTIONS = [
	{
		value: 'h1',
		label: 'H1',
		tooltip: sprintf( __( '%s %d', 'Nth Title', 'dpaa' ), __( 'Heading Level', 'dpaa' ), 1 ),
		showTooltip: true,
	},
	{
		value: 'h2',
		label: 'H2',
		tooltip: sprintf( __( '%s %d', 'Nth Title', 'dpaa' ), __( 'Heading Level', 'dpaa' ), 2 ),
		showTooltip: true,
	},
	{
		value: 'h3',
		label: 'H3',
		tooltip: sprintf( __( '%s %d', 'Nth Title', 'dpaa' ), __( 'Heading Level', 'dpaa' ), 3 ),
		showTooltip: true,
	},
	{
		value: 'h4',
		label: 'H4',
		tooltip: sprintf( __( '%s %d', 'Nth Title', 'dpaa' ), __( 'Heading Level', 'dpaa' ), 4 ),
		showTooltip: true,
	},
	{
		value: 'h5',
		label: 'H5',
		tooltip: sprintf( __( '%s %d', 'Nth Title', 'dpaa' ), __( 'Heading Level', 'dpaa' ), 5 ),
		showTooltip: true,
	},
	{
		value: 'h6',
		label: 'H6',
		tooltip: sprintf( __( '%s %d', 'Nth Title', 'dpaa' ), __( 'Heading Level', 'dpaa' ), 6 ),
		showTooltip: true,
	},
	{
		value: 'p',
		label: 'P',
		tooltip: sprintf( __( '%s', 'Nth Title', 'dpaa' ), __( 'Paragraph', 'dpaa' ) ),
		showTooltip: true,
	},
	{
		value: 'div',
		label: 'DIV',
		tooltip: sprintf( __( '%s', 'Nth Title', 'dpaa' ), __( 'Div', 'dpaa' ) ),
		showTooltip: true,
	},
]

export const HeadingButtonsControl = props => {
	return (
		<AdvancedToggleGroupControl
			{ ...props }
			className="dpaa-heading-buttons-control"
		/>
	)
}

HeadingButtonsControl.defaultProps = {
	label: sprintf( __( '%s HTML Tag', 'dpaa' ), __( 'Title', 'dpaa' ) ),
	value: TAG_OPTIONS[ 0 ].value,
	controls: TAG_OPTIONS,
	// onChange: undefined,
	// help: '',
	// className: '',
	// size: 'default',
	// isAdaptiveWidth: false,
	// isBlock: true,
}

export default HeadingButtonsControl
