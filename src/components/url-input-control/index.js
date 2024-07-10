import './editor.scss'

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n"
import {
	BaseControl,
	Button,
	Dashicon,
	ToggleControl,
} from "@wordpress/components"
import { useState } from "@wordpress/element"
import { URLInput } from "@wordpress/block-editor"

import { omit } from 'lodash'
import classnames from 'classnames'

export const URLInputControl = props => {
	const {
		label = '',
		help = null,
		value = '',
		onChange = () => {},
		newTab = false,
		onChangeNewTab = undefined,
		isAbsolutePosition = false
	} = props

	const [ more, setMore] = useState( false )

	return (
		<BaseControl
			label={ label ? label : undefined }
			id="dpaa-url-input-control"
			className={ classnames( [
				'dpaa-url-input-control'
			], {
				'is-absolute-pos': isAbsolutePosition
			}) }
			help={ help }
		>
			<div className="dpaa-url-input-control__wrapper">
				<Dashicon className="dpaa-url-input-control__icon" icon="admin-links" />
				<URLInput
					className="dpaa-url-input-control__input"
					value={ value }
					onChange={ onChange }
					autoFocus={ false }
					{ ...omit( props, [ 'label', 'help' ] ) }
				/>
				{ onChangeNewTab &&
					<Button
						className="dpaa-url-input-control__more-button"
						icon="ellipsis"
						label={ more ? __( 'Hide more tools & options', 'dpaa' ) : __( 'Show more tools & options', 'dpaa' ) }
						onClick={ () => { more ? setMore( false ) : setMore( true ) } }
						aria-expanded={ more }
					/>
				}
			</div>
			{ onChangeNewTab && more &&
				<div className="dpaa-url-input-control__new-tab">
					<ToggleControl
						label={ __( 'Open in New Tab', 'dpaa' ) }
						checked={ newTab }
						onChange={ onChangeNewTab }
					/>
				</div>
			}
		</BaseControl>
	)
}

export default URLInputControl