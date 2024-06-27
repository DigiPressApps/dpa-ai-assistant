/**
 * Internal dependencies
 */
import { UpgradeLabel } from './upgrade-label'
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Flex,
	FlexItem,
	Icon,
	Modal,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	lock as lockIcon,
} from '@wordpress/icons'

export const UpgradeModal = props => {
	const {
		title = __( 'Pro Feature', dpaa.i18n ),
		text = __( 'This is Pro version feature. Upgrade now!', dpaa.i18n ),
		buttonText = __( 'Upgrade Pro', dpaa.i18n ),
		buttonSize = '19px',
		buttonBold = true,
		buttonBorderRadius = '25px',
		buttonTextColor = '#fff',
		buttonColor = '#09b041',
		buttonPadding = '0 18px',
		buttonHeight = '50px',
		onRequestClose = () => {}
	} = props

	return (
		<Modal
			title={ title }
			size='small'
			closeButtonLabel={ __( 'Close' ) }
			onRequestClose={ onRequestClose }
			className='dpaa-modal dpaa-modal--upgrade'
			icon={ <Icon icon={ lockIcon } /> }
			shouldCloseOnClickOutside={ true }
			style={ {
				width: '100%',
				maxWidth: '420px'
			} }
		>
			<Flex direction='column' gap={ 8 } justify='center' align='center'>
				<FlexItem>
					<Text size='15px'>
						{ text }
					</Text>
				</FlexItem>
				<UpgradeLabel
					text={ buttonText }
					textSize={ buttonSize }
					textBold={ buttonBold }
					borderRadius={ buttonBorderRadius }
					textColor={ buttonTextColor }
					labelColor={ buttonColor }
					padding={ buttonPadding }
					height={ buttonHeight }
				/>
			</Flex>
		</Modal>
	)
}

export default UpgradeModal