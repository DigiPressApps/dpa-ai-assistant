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
		__nextHasNoMarginBottom = false,
		__next40pxDefaultSize = false,
		value = null,
		label = '',
		help = '',
		className = '',
		size = 'default',	// or __unstable-large
		isAdaptiveWidth = false,
		isDeselectable = false,
		hideLabelFromVision = false,
		isBlock = true,
		onChange = () => {},
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
	} = props

	return (
		<ToggleGroupControl
			className={ classnames( 'dpaa-advanced-toggle-group-control', className ) }
			__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
			__next40pxDefaultSize={ __next40pxDefaultSize }
			value={ value }
			label={ label }
			help={ help }
			size={ size }
			isAdaptiveWidth={ isAdaptiveWidth }
			isDeselectable={ isDeselectable }
			hideLabelFromVision={ hideLabelFromVision }
			isBlock={ isBlock }
			onChange={ onChange }
			// { ...props }
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