/**
 * Internal dependencies
 */
import './editor.scss'
import { DropdownRenderToggleButton } from '@dpaa/components'

/**
 * WordPress dependencies
 */
import {
	BaseControl,
	ToggleControl,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
} from '@wordpress/components'

export const ExpandedDropdownControl = props => {
	const {
		labelToggleFlag = '',
		labelDropdownTrigger = '',
		toggleFlag = null,
		popoverProps = {
			placement: 'bottom-start',
			offset: 5,
			shift: true,
		},
		dropdownRenderToggleButtonData = {
			icon: 'filter',
			iconSize: 20,
			size: 'default',
			text: '',
			variant: 'secondary',
			buttonColor: null,
			useResetButton: false,
			onChangeReset: undefined,
		},
		onChangeToggleFlag = undefined,
		children = <></>,
	} = props

	return (
		<>
			{ onChangeToggleFlag && (
				<ToggleControl
					label={ labelToggleFlag }
					checked={ toggleFlag }
					onChange={ onChangeToggleFlag }
				/>
			) }
			{ ( !onChangeToggleFlag || ( onChangeToggleFlag && toggleFlag ) ) && (
				<BaseControl
					label={ labelDropdownTrigger }
					className="dpaa-inspector__dropdown-button-control"
				>
					<Dropdown
						popoverProps={ popoverProps }
						className="dpaa-inspector__dropdown"
						renderToggle={ ( { onToggle, isOpen } ) => {
							return (
								<DropdownRenderToggleButton
									icon={ dropdownRenderToggleButtonData?.icon }
									iconSize={ dropdownRenderToggleButtonData?.iconSize }
									size={ dropdownRenderToggleButtonData?.size }
									text={ dropdownRenderToggleButtonData?.text }
									variant={ dropdownRenderToggleButtonData?.variant }
									buttonColor={ dropdownRenderToggleButtonData?.buttonColor }
									useResetButton={ dropdownRenderToggleButtonData?.useResetButton }
									onChangeReset={ dropdownRenderToggleButtonData?.onChangeReset }
									onToggle={ onToggle }
									isOpen={ isOpen }
								/>
							)
						} }
						renderContent={ () => (
							<DropdownContentWrapper paddingSize="medium">
								<div className="dpaa-inspector__dropdown-content">
									{ children }
								</div>
							</DropdownContentWrapper>
						) }
					/>
				</BaseControl>
			) }
		</>
	)
}

export default ExpandedDropdownControl