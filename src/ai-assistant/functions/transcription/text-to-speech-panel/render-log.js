/**
 * Internal dependencies
 */
import { UpgradeModal } from '@dpaa/components'

/** 
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo,
	useState,
} from '@wordpress/element'
import {
	Icon,
	addCard as addCardIcon,
	commentContent as commentContentIcon,
	download as downloadIcon,
	upload as uploadIcon,
} from '@wordpress/icons'

export const RenderLog = memo( ( props ) => {
	const {
		text,
		blob,
		isLoading,
		onClickPlay,
		onClickRegenerate,
		onClickDownload,
		onClickDeleteItem,
		isInEditor,
	} = props

	if ( !text || !blob ) {
		return
	}

	const logWrapperClasses = classnames( [
		'dpaa-ai-assistant--generator__log__inner-wrapper',
		'__text-to-speech',
	] )

	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false );

	return (
		<FlexItem
			className='dpaa-ai-assistant--generator__log__wrapper'
		>
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
						label={ __( 'Upload to Media Library', dpaa.i18n ) }
						className='dpaa-ai-assistant--generator__log__button __upload_download'
						icon={ uploadIcon }
						iconSize={ 22 }
						variant='primary'
						onClick={ () => setIsUpgradeModal( true ) }
						disabled={ isLoading }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						size='compact'
						showTooltip
						label={ __( 'Download', dpaa.i18n ) }
						className='dpaa-ai-assistant--generator__log__button __upload_download'
						icon={ downloadIcon }
						iconSize={ 22 }
						variant='primary'
						onClick={ onClickDownload }
						disabled={ isLoading }
					/>
				</FlexItem>
				{ isInEditor && (
					<FlexItem>
						<Button
							size='compact'
							showTooltip
							label={ sprintf( __( 'Add this %s as a new block.', dpaa.i18n ), __( 'voice', dpaa.i18n ) ) }
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
			<div className={ logWrapperClasses }>
				<div className='dpaa-ai-assistant--generator__log__prompt'>
					<Flex
						direction='row'
						gap={ 1 }
						justify='flex-start'
						align='flex-start'
					>
						<FlexItem
							className='dpaa-ai-assistant--generator__message-icon dpaa-line-height--1'
						>
							<Icon
								icon={ commentContentIcon }
								size={ 28 }
							/>
						</FlexItem>
						<FlexItem className='dpaa-ai-assistant--generator__message-text'>
							<Text className='dpaa-ai-assistant--generator__log__item'>
								{ text }
							</Text>
						</FlexItem>
					</Flex>
				</div>
			</div>
			{ isUpgradeModal && <UpgradeModal onRequestClose={ () => setIsUpgradeModal( false ) } /> }
		</FlexItem>
	)
} )