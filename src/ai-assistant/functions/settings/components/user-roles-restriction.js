/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	UpgradeLabel,
} from '@dpaa/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Flex,
	FlexItem,
} from '@wordpress/components'
import {
	lock as lockIcon,
} from '@wordpress/icons'

export const UserRolesRestriction = () => {
	return (
		<PanelAdvancedSettings
			title={ __( 'User Roles Restriction', dpaa.i18n ) }
			className='dpaa-components-panel __option-settings'
			initialOpen={ false }
			hasToggle={ false }
			titleLeftIcon={ lockIcon }
		>
			<Flex justify='center'>
				<FlexItem>
					<UpgradeLabel text={ __( 'Available in Pro version', dpaa.i18n ) } textSize='18px' padding='0 22px' height='50px' borderRadius='25px' margin='8vh auto' />
				</FlexItem>
			</Flex>
		</PanelAdvancedSettings>
	)
}

export default UserRolesRestriction