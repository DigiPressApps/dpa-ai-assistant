/**
 * Internal dependencies
 */
import { UpgradeModal } from '@dpaa/components'
import {
	aiMonotoneIcon,
	openAIIcon,
} from '@dpaa/ai-assistant/icons'

/** 
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	__experimentalDivider as Divider,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo,
	useRef,
	useState,
} from '@wordpress/element'
import {
	Icon,
	commentAuthorAvatar as commentAuthorAvatarIcon,
	chevronDown as chevronDownIcon,
	chevronUp as chevronUpIcon,
	addCard as addCardIcon,
	copy as copyIcon,
	html as htmlIcon,
} from '@wordpress/icons'

export const RenderLog = memo( ( props ) => {
	const {
		message,
		response,
		isLoaded,
		isLoading,
		isStreaming,
		index,
		onClickCopyToClipboardItem,
		onClickRegenerate,
		onClickDeleteItem,
		isInEditor,
	} = props

	if ( !message || !response ) {
		return
	}

	const logWrapperRef = useRef( undefined )
	const logWrapperClasses = classnames( [
		'dpaa-ai-assistant--generator__log__inner-wrapper',
		'__chat',
	], {
		'is-loaded': isLoaded
	} )

	const [ toggleIcon, setToggleIcon ] = useState( chevronDownIcon )

	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false )

	return (
		<FlexItem className='dpaa-ai-assistant--generator__log__wrapper'>
			<Flex
				className='dpaa-ai-assistant--generator__log__buttons'
				justify='flex-end'
				gap={ 1 }
			>
				{ typeof index === 'number' && (
					<FlexItem>
						<Button
							size='compact'
							showTooltip
							label={ __( 'Delete', dpaa.i18n ) }
							className='dpaa-ai-assistant--generator__log__button __delete'
							icon='trash'
							iconSize={ 16 }
							variant='primary'
							isDestructive={ true }
							disabled={ isLoading || isStreaming }
							onClick={ () => {
								if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
									onClickDeleteItem( index )
								}
							} }
						/>
					</FlexItem>
				) }
				<FlexItem>
					<Button
						size='compact'
						showTooltip
						label={ __( 'Resend', dpaa.i18n ) }
						className='dpaa-ai-assistant--generator__log__button __copy-message'
						icon='controls-repeat'
						iconSize={ 16 }
						variant='primary'
						onClick={ onClickRegenerate }
						disabled={ isLoading || isStreaming }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						size='compact'
						showTooltip
						label={ __( 'Copy this message.', dpaa.i18n ) }
						className='dpaa-ai-assistant--generator__log__button __copy-message'
						icon={ copyIcon }
						iconSize={ 16 }
						variant='primary'
						onClick={ () => onClickCopyToClipboardItem( { target: message }) }
						disabled={ isLoading || isStreaming }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						size='compact'
						showTooltip
						label={ __( 'Copy this response.', dpaa.i18n ) }
						className='dpaa-ai-assistant--generator__log__button __copy-respond'
						icon={ copyIcon }
						iconSize={ 16 }
						variant='primary'
						onClick={ () => onClickCopyToClipboardItem( { target: response } ) }
						disabled={ isLoading || isStreaming }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						size='compact'
						showTooltip
						label={ __( 'Copy this response as HTML.', dpaa.i18n ) }
						className='dpaa-ai-assistant--generator__log__button __copy-respond'
						icon={ htmlIcon }
						iconSize={ 22 }
						variant='primary'
						onClick={ () => setIsUpgradeModal( true ) }
						disabled={ isLoading || isStreaming }
					/>
				</FlexItem>
				{ isInEditor && (
					<FlexItem>
						<Button
							size='compact'
							showTooltip
							label={ __( 'Add this response as a new block.', dpaa.i18n ) }
							className='dpaa-ai-assistant--generator__log__button __add-new-block'
							icon={ addCardIcon }
							iconSize={ 16 }
							variant='primary'
							onClick={ () => setIsUpgradeModal( true ) }
							disabled={ isLoading || isStreaming }
						/>
					</FlexItem>
				) }
			</Flex>
			<div className={ logWrapperClasses } ref={ logWrapperRef }>
				<div className='dpaa-ai-assistant--generator__log__prompt'>
					<Flex
						direction='row'
						gap={ 1 }
						justify='flex-start'
						align='flex-start'
					>
						<FlexItem className='dpaa-ai-assistant--generator__message-icon dpaa-line-height--1'>
							<Icon icon={ commentAuthorAvatarIcon } size={ 28 } />
						</FlexItem>
						<FlexItem className='dpaa-ai-assistant--generator__message-text'>
							<Text className='dpaa-ai-assistant--generator__log__item'>
								{ message }
							</Text>
						</FlexItem>
					</Flex>
				</div>
				<Divider
					margin="4"
					orientation="horizontal"
				/>
				<div className='dpaa-ai-assistant--generator__log__response __chat'>
					<Flex
						direction='row'
						gap={ 1 }
						justify='flex-start'
						align='flex-start'
					>
						<FlexItem className='dpaa-ai-assistant--generator__message-icon dpaa-line-height--1'>
							<Icon icon={ aiMonotoneIcon } size={ 28} />
						</FlexItem>
						<FlexItem className='dpaa-ai-assistant--generator__message-text'>
							<Text className='dpaa-ai-assistant--generator__log__item'>
								{ response }
							</Text>
						</FlexItem>
					</Flex>
				</div>
			</div>
			{ isLoaded && (
				<Button
					label={ __( 'Open / close response.', dpaa.i18n ) }
					showTooltip={ true }
					className='dpaa-ai-assistant--generator__log__toggle-button'
					size='compact'
					icon={ toggleIcon }
					iconSize={ 26 }
					onClick={ () => {
						logWrapperRef?.current?.classList?.toggle( 'is-expanded' )
						if ( logWrapperRef?.current?.classList?.contains( 'is-expanded' ) ) {
							setToggleIcon( chevronUpIcon )
						} else {
							setToggleIcon( chevronDownIcon )
						}
					} }
				/>
			) }
			{ isUpgradeModal && <UpgradeModal onRequestClose={ () => setIsUpgradeModal( false ) } /> }
		</FlexItem>
	)
} )