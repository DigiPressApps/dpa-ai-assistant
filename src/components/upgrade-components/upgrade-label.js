/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
} from '@wordpress/components'

export const UpgradeLabel = props => {
	const {
		href= `${ dpaa.storeUrl }?utm_source=wp-dashboard&utm_medium=dpaa-free&utm_campaign=upgrade-label`,
		text = __( 'Upgrade', dpaa.i18n ),
		textSize = '12px',
		textBold = true,
		borderRadius = '11px',
		textColor = '#fff',
		labelColor = '#09b041',
		padding = '0 8px',
		margin = 'auto 6px',
		height = '22px',
		position = null,
	} = props

	return (
		<Button
			label={ __( 'Go Pro', dpaa.i18n ) }
			showTooltip={ true }
			size='default'
			href={ href }
			target='_blank'
			text={ text }
			style={ {
				borderRadius: borderRadius,
				background: labelColor,
				color: textColor,
				padding: padding,
				margin: margin,
				height: height,
				fontSize: textSize,
				fontWeight: textBold && 'bold',
			} }
		/>
	)
}

export default UpgradeLabel