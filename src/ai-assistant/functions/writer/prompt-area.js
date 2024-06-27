
/**
 * Internal dependencies
 */
import { OptionsArea as OptionsAreaGPT } from '@dpaa/ai-assistant/functions/chat/options-area'
import { UpgradeLabel, UpgradeModal } from '@dpaa/components'
import { OPEN_AI_API_KEY_URL } from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Icon,
	Button,
	ExternalLink,
	Flex,
	FlexItem,
	Notice,
	Spinner,
	TextareaControl,
	ToggleControl,
	__experimentalHeading as Heading,
	__experimentalInputControl as InputControl,
} from '@wordpress/components'
import {
	memo,
	useState,
	useEffect,
} from '@wordpress/element'
import {
	tag as tagIcon,
	postFeaturedImage as postFeaturedImageIcon,
	commentContent as commentContentIcon,
	pencil as pencilIcon,
	shuffle as shuffleIcon,
} from '@wordpress/icons'

export const PromptArea = memo( ( props ) => {
	const {
		userCanManageSettings,
		fineTunedModels,
		topic,
		onChangeTopic,
		isLoading,
		openai,
		errorMessage,
		model,
		onChangeModel,
		language,
		onChangeLanguage,
		writingStyle,
		onChangeWritingStyle,
		writingTone,
		onChangeWritingTone,
		onClickClear,
		onClickGenerate,
		onClickMagicPrompt,
		sectionCount,
	} = props

	const [ stateFeaturedImage, setStateFeaturedImage ] = useState( false );
	const [ stateSectionImages, setStateSectionImages ] = useState( false );
	const [ stateGenerateTags, setStateGenerateTags ] = useState( false );
	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false );

	useEffect( () => {
		if ( stateFeaturedImage || stateSectionImages || stateGenerateTags ) {
			setIsUpgradeModal( true );
		}
	}, [ stateFeaturedImage, stateSectionImages, stateGenerateTags ] )

	return (
		<>
			<Flex
				className='dpaa-writer__prompt-area'
				direction='column'
				// align='flex-start'
				gap={ 3 }
			>
				<FlexItem>
					{ onChangeTopic && (
						<>
							<Heading
								level={ 3 }
								adjustLineHeightForInnerControls="medium"
								weight={ 600 }
							>
								<Icon icon={ commentContentIcon } style={ { verticalAlign: 'middle' } } />
								{ __( 'Topic', dpaa.i18n ) }
							</Heading>
							<Flex
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
										gap={ 2 }
									>
										<FlexItem>
											<TextareaControl
												__next40pxDefaultSize
												label={ __( 'Topic', dpaa.i18n ) }
												help={ __( 'Describe the subject of the article you want AI to generate. The more detailed and specific the instructions, the more accurate content can be generated.', dpaa.i18n ) }
												className='dpaa-ai-assistant--generator__prompt__textarea'
												value={ topic }
												onChange={ onChangeTopic }
												rows={ 2 }
												placeholder={ __( 'Introducing sightseeing spots in Japan recommended for foreigners.', dpaa.i18n ) }
												disabled={ isLoading || !openai }
											/>
										</FlexItem>
										<FlexItem>
											<InputControl
												__next40pxDefaultSize={ true }
												size='__unstable-large'
												label={ <>
													{ __( 'Keywords to Include', dpaa.i18n ) }
													<UpgradeLabel text={ __( 'Pro Only', dpaa.i18n ) } />
												</> }
												help={ __( 'Use comma to separate keywords.', dpaa.i18n ) }
												placeholder={ __( 'Kyoto, Mt. Fuji, Asakusa', dpaa.i18n ) }
												value=''
												onChange={ () => {} }
												type='text'
												disabled={ true }
											/>
										</FlexItem>
										<FlexItem>
											<Flex
												gap={ 2 }
												justify='flex-end'
											>
												{ onClickClear && (
													<FlexItem>
														<Button
															size='compact'
															showTooltip
															label={ __( 'Clear', dpaa.i18n ) }
															className='dpaa-ai-assistant--generator__button'
															icon='trash'
															iconSize={ 18 }
															isDestructive={ true }
															variant='primary'
															disabled={ isLoading || !openai || !topic }
															onClick={ onClickClear }
														/>
													</FlexItem>
												) }
												{ onClickMagicPrompt && (
													<FlexItem>
														<Button
															size='compact'
															showTooltip
															label={ __( 'Magic prompt!', dpaa.i18n ) }
															className='dpaa-ai-assistant--generator__button'
															icon={ shuffleIcon }
															iconSize={ 18 }
															variant='secondary'
															disabled={ isLoading || !openai }
															onClick={ onClickMagicPrompt }
														/>
													</FlexItem>
												) }
												<FlexItem>
													<Button
														size='compact'
														showTooltip
														label={ __( 'Speak a topic', dpaa.i18n ) }
														icon='microphone'
														iconSize={ 20 }
														variant='primary'
														isDestructive={ false }
														isBusy={ isLoading }
														disabled={ isLoading || !openai }
														onClick={ () => setIsUpgradeModal( true ) }
													/>
												</FlexItem>
												{ onClickGenerate && (
													<FlexItem>
														<Button
															size='compact'
															showTooltip
															label={ __( 'Generate', dpaa.i18n ) }
															className='dpaa-ai-assistant--generator__button'
															icon={ pencilIcon }
															iconSize={ 18 }
															variant='primary'
															onClick={ onClickGenerate }
															isBusy={ isLoading }
															disabled={ isLoading || !openai || !topic }
														>
															{ isLoading && (
																<Spinner />
															) }
														</Button>
													</FlexItem>
												) }
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
									className='dpaa-ai-assistant--generator__options-area__wrapper'
									isBlock={ true }
									style={ {
										flexBasis: 'calc( 35% - 6px )'
									} }
								>
									<Flex direction='column' gap={ 3 } justify='flex-start'>
										<FlexItem>
											<Flex
												className='dpaa-box-shadow-element'
												direction='column'
												gap={ 3 }
											>
												<FlexItem>
													<ToggleControl
														__nextHasNoMarginBottom
														checked={ stateGenerateTags }
														label={ <>
															<Icon icon={ tagIcon } style={ { display: 'inline', verticalAlign: 'middle' } } />
															{ sprintf( __( 'Generate %s', dpaa.i18n ), __( 'Tags', dpaa.i18n ) ) }
														</> }
														onChange={ newVal => setStateGenerateTags( newVal ) }
														disabled={ isLoading }
													/>
												</FlexItem>
												<FlexItem>
													<ToggleControl
														__nextHasNoMarginBottom
														checked={ stateFeaturedImage }
														label={ <>
															<Icon icon={ postFeaturedImageIcon } style={ { display: 'inline', verticalAlign: 'middle' } } />
															{ sprintf(__( 'Generate %s', dpaa.i18n ), __( 'a Featured image', dpaa.i18n ) ) }
														</>}
														onChange={ newVal => setStateFeaturedImage( newVal ) }
														disabled={ isLoading }
													/>
												</FlexItem>
												<FlexItem>
													<ToggleControl
														__nextHasNoMarginBottom
														checked={ stateSectionImages }
														label={ <>
															<Icon icon='images-alt2' style={ { display: 'inline', verticalAlign: 'middle' } } />
															{`${ sprintf(__( 'Generate %s', dpaa.i18n ), __( 'images for each section', dpaa.i18n ) ) } (${ sectionCount }${ __( ' images', dpaa.i18n ) })` }
														</> }
														onChange={ newVal => setStateSectionImages( newVal ) }
														disabled={ isLoading }
													/>
												</FlexItem>
											</Flex>
										</FlexItem>
										<FlexItem>
											{ openai
												? (
													<OptionsAreaGPT
														label={ sprintf( __( '%s Settings', dpaa.i18n ), __( 'Text Generation', dpaa.i18n ) ) }
														userCanManageSettings={ userCanManageSettings }
														fineTunedModels={ fineTunedModels }
														model={ model }
														onChangeModel={ onChangeModel }
														language={ language }
														onChangeLanguage={ onChangeLanguage }
														writingStyle={ writingStyle }
														onChangeWritingStyle={ onChangeWritingStyle }
														writingTone={ writingTone }
														onChangeWritingTone={ onChangeWritingTone }
													/>
												)
												: (
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
																	{ `${ __( 'Get the API key.', dpaa.i18n ) } (OpenAI)` }
																</ExternalLink>
															</FlexItem>
														</Flex>
													</Notice>
												)
											}
										</FlexItem>
									</Flex>
								</FlexItem>
							</Flex>
						</>
					) }
				</FlexItem>
			</Flex>
			{ isUpgradeModal && (
				<UpgradeModal
					onRequestClose={ () => {
						setIsUpgradeModal( false );
						setStateFeaturedImage( false );
						setStateGenerateTags( false );
						setStateSectionImages( false );
					} }
				/>
			) }
		</>
	)
} )