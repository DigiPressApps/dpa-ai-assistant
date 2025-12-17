/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	UpgradeLabel,
} from '@dpaa/components'
import { AICPU } from '@dpaa/icons'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Flex,
	FlexItem,
	Icon,
} from '@wordpress/components'

export const GoogleAISettings = ( { pluginSettings } ) => {
	return (
		<>
			<PanelAdvancedSettings
				title={ `${ sprintf( __( '%s Settings', dpaa.i18n ), 'Google AI' ) } (${ __( 'For text', dpaa.i18n ) })` }
				className='dpaa-components-panel __option-settings'
				initialOpen={ false }
				hasToggle={ false }
				titleLeftIcon={ <Icon icon={ AICPU } /> }
			>
				<Flex justify='center'>
					<FlexItem>
						<UpgradeLabel text={ __( 'Available in Pro version', dpaa.i18n ) } textSize='18px' padding='0 22px' height='50px' borderRadius='25px' margin='8vh auto' />
					</FlexItem>
				</Flex>
			</PanelAdvancedSettings>
		</>
	)
}

export default GoogleAISettings