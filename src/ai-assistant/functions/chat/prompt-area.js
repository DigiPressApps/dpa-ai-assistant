/**
 * Internal dependencies
 */
import { OPEN_AI_API_KEY_URL } from '@dpaa/ai-assistant/constants'
import { sendIcon } from '@dpaa/ai-assistant/icons'
import { OptionsArea } from './options-area'
import {
	DropdownButtonsForSelectedText,
	UpgradeModal,
} from '@dpaa/components'
import { mediaLibrary } from '@dpaa/util'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Button,
	Dropdown,
	ExternalLink,
	Flex,
	FlexItem,
	Modal,
	Notice,
	Spinner,
	TextareaControl,
} from '@wordpress/components'
import {
	memo,
	useEffect,
	useState,
} from '@wordpress/element'
import {
	close as closeIcon,
	closeSmall as closeSmallIcon,
	redo as redoIcon,
	shuffle as shuffleIcon,
	menu as menuIcon,
	media as mediaIcon,
} from '@wordpress/icons'

export const PromptArea = memo( ( props ) => {
	const {
		userCanManageSettings,
		message,
		onChangeMessage,
		isLoading,
		openai,
		isStreaming,
		onClickOperationSelectedText,
		onClickOperationClipboardText,
		setSelectedTextOperation,
		setSelectedTextOperationMessage,
		selectedTextTarget,
		onClickClear,
		onClickContinue,
		onClickMagicPrompt,
		onClickSend,
		onClickReSend,
		previousMessageRef,
		errorMessage,
		setErrorMessage,

		model,
		onChangeModel,
		language,
		onChangeLanguage,
		contentStructure,
		onChangeContentStructure,
		writingStyle,
		onChangeWritingStyle,
		writingTone,
		onChangeWritingTone,
		customPrompt,
		onChangeCustomBehavior,
		visionMediaData,
		setVisionMediaData,
		fineTunedModels,
	} = props

	// メディアライブラリ
	const library = mediaLibrary( {
		title: __( 'Select or Upload Media' ),
		multiple: true,
		type: 'image',
		buttonText: __( 'Select' ),
	} )

	// GPT-4 Vision判定用
	const [ isVisionModel, setIsVisionModel ] = useState( false )
	useEffect( () => {
		setIsVisionModel( model.includes( 'gpt-4-vision' ) || model.includes( 'gpt-4o' ) )
	}, [ model ] )

	 // ボタンがクリックされたときに 各画像のポップアップ状態を切り替える
	const [ showModalVisionMedia, setShowModalVisionMedia ] = useState( Array( visionMediaData?.length ).fill( false ) );
	const toggleShowModalVisionMedia = ( index ) => {
		const newShowModalVisionMedia = [ ...showModalVisionMedia ];
		newShowModalVisionMedia[ index ] = !newShowModalVisionMedia[ index ];
		setShowModalVisionMedia( newShowModalVisionMedia );
	};

	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false );

	 return (
		<>
			<Flex
				className='dpaa-ai-assistant--generator__input-form'
				direction='row'
				align='flex-start'
				gap={ 3 }
			>
				<FlexItem
					className='dpaa-ai-assistant--generator__prompt__wrapper'
					isBlock={ true }
					style={ {
						flexBasis: 'calc( 65% - 6px )'
					} }
				>
					<Flex
						className='dpaa-box-shadow-element'
						direction='column'
						gap={ 1 }
					>
						<FlexItem>
							<TextareaControl
								__next40pxDefaultSize
								// label={ __( 'Question', dpaa.i18n ) }
								className='dpaa-ai-assistant--generator__prompt__textarea'
								value={ message }
								onChange={ onChangeMessage }
								rows={ 3 }
								placeholder={ !isVisionModel ? __( 'Ask anything...', dpaa.i18n ) : __( 'What do these images have in common?', dpaa.i18n ) }
								disabled={ isLoading || !openai || isStreaming }
							/>
						</FlexItem>
						{ ( !isLoading && !isStreaming && openai && isVisionModel ) && (
							<FlexItem>
								<Flex
									gap={ 1 }
									direction='row'
									justify='flex-end'
									align='center'
								>
									{ ( Array.isArray( visionMediaData ) && visionMediaData?.length > 0 ) && (
										<>
											<FlexItem style={ { flexBasis: 'calc( 100% - 64px )' } }>
												<Flex
													gap={ 1 }
													direction='row'
													justify='flex-end'
													align='center'
													wrap={ true }
												>
												{ visionMediaData.map( ( image, index ) => {
													return (
														<FlexItem key={ index }>
															<Button
																label={ __( 'Preview', dpaa.i18n ) }
																showTooltip={ true }
																onClick={ () => toggleShowModalVisionMedia( index ) }
																variant='link'
																className='dpaa-ai-assistant--generator__preview-button'
															>
															{ image?.type === 'image' && (
																<img
																	src={ image.url } className='dpaa-ai-assistant--generator__preview-image'
																/>
															) }
															</Button>
															{ showModalVisionMedia[ index ] && (
																<Modal
																	bodyOpenClassName='preview-modal-open'
																	className='dpaa-ai-assistant--generator__preview-modal'
																	overlayClassName='dpaa-ai-assistant--generator__preview-modal__overlay'
																	onRequestClose={ () => toggleShowModalVisionMedia( index ) }
																>
																	<div className='dpaa-ai-assistant--generator__preview-area'>
																		{ image?.type === 'image' && (
																			<img src={ image.url } className='dpaa-ai-assistant--generator__preview-image' />
																		) }
																	</div>
																</Modal>
															) }
														</FlexItem>
													)
												} ) }
												</Flex>
											</FlexItem>
											<FlexItem style={ { flexBasis: '32px' } } >
												<Button
													size='compact'
													showTooltip
													label={ __( 'Clear' ) }
													className='dpaa-ai-assistant--generator__button'
													icon={ closeSmallIcon }
													iconSize={ 24 }
													variant='secondary'
													isBusy={ isLoading }
													isDestructive={ true }
													onClick={ () => setVisionMediaData( [] ) }
												/>
											</FlexItem>
										</>
									) }
									<FlexItem style={ { flexBasis: '32px' } }>
										<Button
											size='compact'
											showTooltip
											label={ __( 'Open media library', dpaa.i18n ) }
											className='dpaa-ai-assistant--generator__button'
											icon={ mediaIcon }
											iconSize={ 24 }
											variant='primary'
											isBusy={ isLoading }
											onClick={ () => {
												library.open()
												library.on( 'select', () => {
													const images = library.state().get( 'selection' ).map( item => item.toJSON() );

													const filteredImages = images.filter( image => image?.width < 2000 && image?.height < 2000 )

													if ( images?.length !== filteredImages?.length ) {
														setErrorMessage( __( 'The image sides should be less than 2,000px.', dpaa.i18n ) )
													} else {
														setVisionMediaData( filteredImages )
														setErrorMessage( '' )
													}
												} )
											} }
										/>
									</FlexItem>
								</Flex>
							</FlexItem>
						) }
						<FlexItem>
							<Flex
								gap={ 1 }
								direction='row'
								justify='flex-end'
							>
								{ ( !isLoading && !isStreaming && openai ) && (
									<>
										<FlexItem>
											<Dropdown
												popoverProps={ {
													// placement: 'top center',
													offset: 5,
													// shift: true,
												} }
												renderToggle={ ( { isOpen, onToggle, onClose } ) => (
													<Button
														label={ sprintf( __( 'Operations on %s', dpaa.i18n ), __( 'selected text', dpaa.i18n ) ) }
														showToolTip={ true }
														icon={ menuIcon }
														iconSize={ 24 }
														variant='tertiary'
														disabled={ isVisionModel || isLoading || isStreaming }
														onClick={ () => onClickOperationSelectedText( onToggle ) }
														aria-expanded={ isOpen }
													/>
												) }
												renderContent={ ( { isOpen, onToggle, onClose } ) => (
													<DropdownButtonsForSelectedText
														setSelectedTextOperation={ setSelectedTextOperation }
														setSelectedTextOperationMessage={ setSelectedTextOperationMessage }
														selectedTextTarget={ selectedTextTarget }
														onClose={ onClose }
													/>
												) }
											/>
										</FlexItem>
										<FlexItem>
											<Dropdown
												popoverProps={ {
													// placement: 'top center',
													offset: 5,
													// shift: true,
												} }
												renderToggle={ ( { isOpen, onToggle, onClose } ) => (
													<Button
														label={ sprintf( __( 'Operations on %s', dpaa.i18n ), __( 'clipboard text', dpaa.i18n ) ) }
														showToolTip={ true }
														icon={ menuIcon }
														iconSize={ 24 }
														// variant='tertiary'
														disabled={ isVisionModel || isLoading || isStreaming }
														onClick={ () => onClickOperationClipboardText( onToggle ) }
														aria-expanded={ isOpen }
													/>
												) }
												renderContent={ ( { isOpen, onToggle, onClose } ) => (
													<DropdownButtonsForSelectedText
														setSelectedTextOperation={ setSelectedTextOperation }
														setSelectedTextOperationMessage={ setSelectedTextOperationMessage }
														selectedTextTarget={ selectedTextTarget }
														onClose={ onClose }
													/>
												) }
											/>
										</FlexItem>
									</>
								) }
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Clear all logs and reset tokens.', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon='trash'
										iconSize={ 18 }
										variant='primary'
										isDestructive={ true }
										disabled={ isLoading || isStreaming || !openai }
										onClick={ onClickClear }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Magic prompt!', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon={ shuffleIcon }
										iconSize={ 18 }
										variant='secondary'
										disabled={ isVisionModel || isLoading || isStreaming || !openai }
										onClick={ onClickMagicPrompt }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Continue an interrupted conversation.', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon={ redoIcon }
										iconSize={ 18 }
										variant='secondary'
										disabled={ isVisionModel || isLoading || isStreaming || !openai ||  !previousMessageRef?.current }
										onClick={ onClickContinue }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Resend previous message.', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon='controls-repeat'
										iconSize={ 18 }
										variant='secondary'
										disabled={ isLoading || isStreaming || !openai || !previousMessageRef?.current }
										onClick={ onClickReSend }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Talk to AI', dpaa.i18n ) }
										icon='microphone'
										iconSize={ 20 }
										variant='primary'
										isDestructive={ false }
										isBusy={ isLoading }
										disabled={ isLoading || isStreaming || !openai }
										onClick={ () => setIsUpgradeModal( true ) }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Send this message.', dpaa.i18n ) }
										className='dpaa-ai-assistant--generator__button'
										icon={ sendIcon }
										iconSize={ 18 }
										variant='primary'
										onClick={ onClickSend }
										isBusy={ isLoading }
										disabled={ isLoading || isStreaming || !openai || !message }
									>
										{ isLoading && (
											<Spinner />
										) }
									</Button>
								</FlexItem>
							</Flex>
						</FlexItem>
						{ errorMessage && (
							<FlexItem>
								<div className='dpaa__visible-error-message'>{ errorMessage.toString() }</div>
							</FlexItem>
						) }
					</Flex>
				</FlexItem>
				<FlexItem
					isBlock={ true }
					style={ {
						flexBasis: 'calc( 35% - 6px )'
					} }
				>
					{ !openai
					? (
						<Notice
							className="dpaa-ai-assistant--settings__notice-component"
							status="info"
							isDismissible={ false }
						>
							<Flex
								direction='column'
								gap={ 2 }
							>
								<FlexItem>
									<ExternalLink
										href={ OPEN_AI_API_KEY_URL }
										type="link"
										rel="next"
									>
										{ __( 'Get the API key.', dpaa.i18n ) }
									</ExternalLink>
								</FlexItem>
							</Flex>
						</Notice>
					)
					: (
						<OptionsArea
							userCanManageSettings={ userCanManageSettings }
							onChangeEngine={ () => {} }
							model={ model }
							onChangeModel={ onChangeModel }
							language={ language }
							onChangeLanguage={ onChangeLanguage }
							contentStructure={ contentStructure }
							onChangeContentStructure={ onChangeContentStructure }
							writingStyle={ writingStyle }
							onChangeWritingStyle={ onChangeWritingStyle }
							writingTone={ writingTone }
							onChangeWritingTone={ onChangeWritingTone }
							customPrompt={ customPrompt }
							onChangeCustomBehavior={ onChangeCustomBehavior }
							fineTunedModels={ fineTunedModels }
						/>
					) }
				</FlexItem>
			</Flex>
			{ isUpgradeModal && <UpgradeModal onRequestClose={ () => setIsUpgradeModal( false ) } /> }
		</>
	)
} )