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
	const {
		controls = [
			{
				icon: null,
				value: null,
				label: null,
				ariaLabel: null,
				showTooltip: true,
				tooltip: ''
			},
		],
		className = '',
	} = props

	return (
		<ToggleGroupControl
			className={ classnames( 'dpaa-advanced-toggle-group-control', className ) }
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

export default AdvancedToggleGroupControl