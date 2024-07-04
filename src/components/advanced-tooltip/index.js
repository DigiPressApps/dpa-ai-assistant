import './editor.scss'
import classnames from 'classnames'
import { Tooltip } from '@wordpress/components'

export const AdvancedTooltip = props => {

	return (
		<Tooltip
			{ ...props }
			className={ classnames( [ props.className, 'dpaa-tooltip' ] ) }
			text={ props.text
				? (
					<span className="dpaa-tooltip__text">
						{ props.text }
					</span>
				)
				: undefined
			}
		/>
	)
}

export default AdvancedTooltip
