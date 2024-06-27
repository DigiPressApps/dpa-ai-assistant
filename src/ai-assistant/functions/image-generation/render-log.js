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
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	Flex,
	FlexItem,
	Icon,
	Modal,
	__experimentalDivider as Divider,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo,
	useState,
} from '@wordpress/element'
import {
	addCard as addCardIcon,
	commentAuthorAvatar as commentAuthorAvatarIcon,
	copy as copyIcon,
	arrowLeft as arrowLeftIcon,
	arrowRight as arrowRightIcon,
	download as downloadIcon,
	upload as uploadIcon,
	seen as seenIcon
} from '@wordpress/icons'

export const RenderLog = memo( ( props ) => {
	const {
		prompt,
		arrayImages,
		isLoaded,
		isLoading,
		isInEditor,
		index,
		onClickCopyToClipboardItem,
		onClickDownload,
		onClickDeleteItem,
		onClickRegenerate,
	} = props

	if ( !prompt || !arrayImages || !Array.isArray( arrayImages ) ) {
		return
	}

	// ボタンがクリックされたときに 各画像のポップアップ状態を切り替える
	const [ isVisibleArray, setIsVisibleArray ] = useState( Array( arrayImages.length ).fill( false ));
	const toggleIsVisible = ( index ) => {
		const newIsVisibleArray = [ ...isVisibleArray ];
		newIsVisibleArray[ index ] = !newIsVisibleArray[ index ];
		setIsVisibleArray( newIsVisibleArray );
	};

	const innerWrapperClasses = classnames( [
		'dpaa-ai-assistant--generator__log__inner-wrapper',
	], {
		'is-loaded': isLoaded
	} )

	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false )

	return (
		<FlexItem
			className='dpaa-ai-assistant--generator__log__wrapper'
		>
			<Flex
				className='dpaa-ai-assistant--generator__log__buttons'
				justify='flex-end'
				gap={ 1 }
			>
				{ typeof index === 'number' && (
					<>
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
								onClick={ () => {
									if ( window.confirm( __( 'Are you sure you want to delete?', dpaa.i18n ) ) ) {
										onClickDeleteItem( index )
									}
								} }
							/>
						</FlexItem>
						<FlexItem>
							<Button
								size='compact'
								showTooltip
								label={ __( 'Regenerate', dpaa.i18n ) }
								className='dpaa-ai-assistant--generator__log__button __copy-message'
								icon='controls-repeat'
								iconSize={ 16 }
								variant='primary'
								isDestructive={ false }
								onClick={ onClickRegenerate }
								disabled={ isLoading  }
							/>
						</FlexItem>
					</>
				) }
			</Flex>
			<BaseControl
				className={ innerWrapperClasses }
			>
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
								{ prompt }
							</Text>
						</FlexItem>
					</Flex>
				</div>
				<Divider
					margin="4"
					orientation="horizontal"
				/>
				<div className='dpaa-ai-assistant--generator__log__response __generate-image'>
				{ arrayImages.map( ( image, index ) => (
					<>
						<div className='dpaa-ai-assistant--generator__log__image-wrapper' key={ index }>
							<Button
								label={ __( 'Preview', dpaa.i18n ) }
								showTooltip={ true }
								onClick={ () => toggleIsVisible( index ) }
								variant='link'
								className='dpaa-ai-assistant--generator__preview-button'
							>
								<img src={ `data:image/png;base64,${ image }` } className='dpaa-ai-assistant--generator__log__image' />
							</Button>
							{ isVisibleArray[ index ] && (
								<Modal
									bodyOpenClassName='preview-modal-open'
									className='dpaa-ai-assistant--generator__preview-modal'
									overlayClassName='dpaa-ai-assistant--generator__preview-modal__overlay'
									onRequestClose={ () => toggleIsVisible( index ) }
								>
									<div className='dpaa-ai-assistant--generator__preview-area'>
										{ index > 0 && (
											<Button
												size='small'
												showTooltip
												label={ __( 'Previous' ) }
												className='dpaa-ai-assistant--generator__log__button __prev-next __left'
												icon={ 	arrowLeftIcon }
												iconSize={ 14 }
												variant='primary'
												onClick={ () => {
													toggleIsVisible( index )
													toggleIsVisible( index - 1 )
												} }
											/>
										) }
										<img src={ `data:image/png;base64,${ image }` } className='dpaa-ai-assistant--generator__preview-image' />
										{ ( arrayImages.length > 1 && index !== ( arrayImages.length -1 ) ) && (
											<Button
												size='small'
												showTooltip
												label={ __( 'Next' ) }
												className='dpaa-ai-assistant--generator__log__button __prev-next __right'
												icon={ arrowRightIcon }
												iconSize={ 14 }
												variant='primary'
												onClick={ () => {
													toggleIsVisible( index )
													toggleIsVisible( index + 1 )
												} }
											/>
										) }
									</div>
								</Modal>
							) }
							<Flex
								className='dpaa-ai-assistant--generator__log__buttons'
								justify='flex-end'
								gap={ 1 }
							>
								{ isInEditor && (
									<FlexItem>
										<Button
											size='small'
											showTooltip
											label={ __( 'Use as featured image', dpaa.i18n ) }
											className='dpaa-ai-assistant--generator__log__button __set-eyecatch'
											icon={ seenIcon }
											iconSize={ 15 }
											variant='primary'
											isDestructive={ false }
											disabled={ isLoading }
											onClick={ () => setIsUpgradeModal( true ) }
										/>
									</FlexItem>
								) }
								<FlexItem>
									<Button
										size='small'
										showTooltip
										label={ __( 'Copy to clipboard', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__log__button __copy-respond'
										icon={ copyIcon }
										iconSize={ 15 }
										variant='primary'
										isDestructive={ false }
										disabled={ isLoading }
										onClick={ () => onClickCopyToClipboardItem( image ) }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='small'
										showTooltip
										label={ __( 'Upload to Media Library', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__log__button __upload_download'
										icon={ uploadIcon }
										iconSize={ 15 }
										variant='primary'
										onClick={ () => setIsUpgradeModal( true ) }
										disabled={ isLoading }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='small'
										showTooltip
										label={ __( 'Download', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__log__button __upload_download'
										icon={ downloadIcon }
										iconSize={ 15 }
										variant='primary'
										onClick={ () => onClickDownload( image ) }
										disabled={ isLoading }
									/>
								</FlexItem>
								{ isInEditor && (
									<FlexItem>
										<Button
											size='small'
											showTooltip
											label={ __( 'Add this response as a new block.', dpaa.i18n ) }
											className='dpaa-ai-assistant--generator__log__button __add-new-block'
											icon={ addCardIcon }
											iconSize={ 15 }
											variant='primary'
											onClick={ () => setIsUpgradeModal( true ) }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
							</Flex>
						</div>
					</>
				) ) }
				</div>
			</BaseControl>
			{ isUpgradeModal && <UpgradeModal onRequestClose={ () => setIsUpgradeModal( false ) } /> }
		</FlexItem>
	)
} )