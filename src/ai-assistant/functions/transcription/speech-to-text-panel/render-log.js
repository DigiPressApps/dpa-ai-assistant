/**
 * Internal dependencies
 */
import { UpgradeModal } from '@dpaa/components'

/** 
 * External dependencies
 */
import classnames from 'classnames';
import {
	microphoneIcon
} from '@dpaa/ai-assistant/icons'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	ExternalLink,
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
	addCard as addCardIcon,
	commentContent as commentContentIcon,
	chevronDown as chevronDownIcon,
	chevronUp as chevronUpIcon,
	copy as copyIcon,
} from '@wordpress/icons'

export const RenderLog = memo( ( props ) => {
	const {
		url,
		transcriptedText,
		isLoading,
		isLoaded,
		onClickCopy,
		onClickPlay,
		onClickRegenerate,
		onClickDeleteItem,
		onClickAddNewBlock,
		isInEditor,
	} = props

	if ( !url || !transcriptedText ) {
		return
	}

	const logWrapperRef = useRef( undefined )

	const [ toggleIcon, setToggleIcon ] = useState( chevronDownIcon )

	const logWrapperClasses = classnames( [
		'dpaa-ai-assistant--generator__log__inner-wrapper',
		'__speech-to-text',
		'__chat',
	], {
		'is-loaded': isLoaded
	} )

	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false );

	return (
		<FlexItem className='dpaa-ai-assistant--generator__log__wrapper'>
			<Flex
				className='dpaa-ai-assistant--generator__log__buttons'
				justify='flex-end'
				gap={ 1 }
			>
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
						disabled={ isLoading }
						onClick={ onClickDeleteItem }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						size='compact'
						showTooltip
						label={ __( 'Regenerate', dpaa.i18n ) }
						className='dpaa-ai-assistant--generator__log__button __regenerate __copy-message'
						icon='controls-repeat'
						iconSize={ 16 }
						variant='primary'
						onClick={ onClickRegenerate }
						disabled={ isLoading }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						size='compact'
						showTooltip
						label={ __( 'Listen', dpaa.i18n ) }
						className='dpaa-ai-assistant--generator__log__button __play'
						icon={ 'controls-volumeon' }
						iconSize={ 16 }
						variant='primary'
						onClick={ onClickPlay }
						disabled={ isLoading }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						size='compact'
						showTooltip
						label={ sprintf( __( 'Copy %s', dpaa.i18n ), __( 'this transcripted text', dpaa.i18n ) ) }
						className='dpaa-ai-assistant--generator__log__button __copy-respond'
						icon={ copyIcon }
						iconSize={ 16 }
						variant='primary'
						onClick={ onClickCopy }
						disabled={ isLoading }
					/>
				</FlexItem>
				{ isInEditor && (
					<FlexItem>
						<Button
							size='compact'
							showTooltip
							label={ sprintf( __( 'Add %s as a new block.', dpaa.i18n ), __( 'this transcripted text', dpaa.i18n ) ) }
							className='dpaa-ai-assistant--generator__log__button __add-new-block'
							icon={ addCardIcon }
							iconSize={ 16 }
							variant='primary'
							onClick={ () => setIsUpgradeModal( true ) }
							disabled={ isLoading }
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
							<Icon icon={ microphoneIcon } size={ 28 } />
						</FlexItem>
						<FlexItem className='dpaa-ai-assistant--generator__message-text'>
							<ExternalLink
								href={ url }
								className='dpaa-ai-assistant--generator__log__item'
								type="link"
								rel="next"
							>
								{ url }
							</ExternalLink>
						</FlexItem>
					</Flex>
				</div>
				<Divider margin="4" orientation="horizontal" />
				<div className='dpaa-ai-assistant--generator__log__response __speech-to-text'>
					<Flex
						direction='row'
						gap={ 1 }
						justify='flex-start'
						align='flex-start'
					>
						<FlexItem className='dpaa-ai-assistant--generator__message-icon dpaa-line-height--1'>
							<Icon icon={ commentContentIcon } size={ 28 } />
						</FlexItem>
						<FlexItem className='dpaa-ai-assistant--generator__message-text'>
							<Text className='dpaa-ai-assistant--generator__log__item'>
								{ transcriptedText }
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