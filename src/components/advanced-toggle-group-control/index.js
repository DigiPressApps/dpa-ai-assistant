/**
 * Advanced ToggleGroupControl
 * 
 * @see https://wordpress.github.io/gutenberg/?path=/docs/components-experimental-togglegroupcontrol--borderless
 */

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
  __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

export const AdvancedToggleGroupControl = props => {
	const { controls } = props

	return (
		<ToggleGroupControl
			className={ classnames( 'dpaa-advanced-toggle-group-control', props.className ) }
			{ ...props }
			children={
				controls.map( ( option, index ) => {
					if ( option.icon ) {
						return <ToggleGroupControlOptionIcon key={ index } { ...option } />
					} else {
						return <ToggleGroupControlOption key={ index } aria-label={ option.tooltip || option.label } { ...option } />
					}
				} )
			}
		/>
	)
}

AdvancedToggleGroupControl.defaultProps = {
	onChange: () => {},
	value: null,
	label: '',
	help: '',
	className: '',
	size: 'default',	// or __unstable-large
	isAdaptiveWidth: false,
	isBlock: true,
	controls: [
		{
			icon: null,
			value: null,
			label: null,
			ariaLabel: null,
			showTooltip: true,
			tooltip: ''
		},
	],
}

export default AdvancedToggleGroupControl