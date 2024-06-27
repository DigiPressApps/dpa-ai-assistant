/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	ToolbarGroup,
	ToolbarButton,
	DropdownMenu
} from '@wordpress/components';
import { useState } from '@wordpress/element';

export const CustomToolbarButton = ( props ) => {
	const [ isOpen, setIsOpen ] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<ToolbarGroup>
			<ToolbarButton
				icon="admin-tools"
				onClick={toggleDropdown}
				aria-expanded={isOpen}
			/>
			{isOpen && (
				<DropdownMenu
					icon="admin-tools"
					label="Custom Options"
					controls={[]}
				/>
			)}
		</ToolbarGroup>
	);
};