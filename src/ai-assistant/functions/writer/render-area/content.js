/**
 * Internal dependencies
 */
import {
	OPTIONS_INT_HEADING_LEVELS,
	OPTIONS_STRING_HEADING_LEVELS,
} from '../constants'

/**
 * WordPress dependencies
 */
import {
	__,
	sprintf
} from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	Flex,
	FlexItem,
	Icon,
	SelectControl,
	TextareaControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	__experimentalHeading as Heading,
	__experimentalInputControl as InputControl,
	__experimentalItem as Item,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components'
import { memo } from '@wordpress/element'
import {
	commentContent as commentContentIcon,
	postContent as postContentIcon,
	formatListBullets as formatListBulletsIcon,
	formatListNumbered as formatListNumberedIcon,
} from '@wordpress/icons'

export const Content = memo ( props => {
	const {
		content,
		sections,
		onChangeContent,
		isInsertTOC,
		onChangeIsInsertTOC,
		showTOCTitle,
		onChangeShowTOCTitle,
		tocTitle,
		onChangeTocTitle,
		tocTitleTag,
		onChangeTocTitleTag,
		isTOCOrderedList,
		onChangeIsTOCOrderedList,
		isIncludeIntro,
		onChangeIsIncludeIntro,
		showIntroTitle,
		onChangeShowIntroTitle,
		introTitle,
		onChangeIntroTitle,
		introTitleTag,
		onChangeIntroTitleTag,
		isIncludeOutro,
		onChangeIsIncludeOutro,
		showOutroTitle,
		onChangeShowOutroTitle,
		outroTitle,
		onChangeOutroTitle,
		outroTitleTag,
		onChangeOutroTitleTag,
		onClickGenerateContent,
		paragraphPerSection,
		onChangeParagraphPerSection,
		minContentWords,
		onChangeMinContentWords,
		isLoading,
	} = props;


	return onChangeContent && (
		<FlexItem>
			<Flex
				className='dpaa-box-shadow-element'
				direction='column'
				justify='space-between'
				wrap={ true }
				gap={ 3 }
			>
				<FlexItem>
					<Heading
						level={ 5 }
						adjustLineHeightForInnerControls="small"
						weight={ 600 }
					>
						<Icon icon={ postContentIcon } style={ { verticalAlign: 'middle' } } />
						{ __( 'Post Content', dpaa.i18n ) }
					</Heading>
				</FlexItem>
				<FlexItem>
					<TextareaControl
						__next40pxDefaultSize
						className='dpaa-ai-assistant--generator__prompt__textarea'
						value={ content }
						onChange={ onChangeContent }
						rows={ 15 }
						disabled={ isLoading }
					/>
				</FlexItem>
				{ onChangeIsInsertTOC && (
					<FlexItem>
						<Flex direction='column' gap={ 4 } align='flex-start'>
							<FlexItem>
								<ToggleControl
									__nextHasNoMarginBottom
									checked={ isInsertTOC }
									label={ sprintf( __( 'Insert %s', dpaa.i18n ), __( 'Table of Contents', dpaa.i18n ) ) }
									help={ __( 'The table of contents will be inserted at the beginning of the text when you post.', dpaa.i18n ) }
									onChange={ onChangeIsInsertTOC }
									disabled={ isLoading }
								/>
							</FlexItem>
							{ isInsertTOC && (
								<FlexItem style={ {
									border: '1px solid rgba(var(--wp-admin-theme-color-darker-10--rgb), 0.4)',
									borderRadius: '3px'
								} }>
									<Item size='medium'>
										<BaseControl label={ __( 'TOC Settings', dpaa.i18n ) }>
											<Flex
												direction='column' gap={ 3 }
												align='flex-start'
												style={ { width: '100%' } }
											>
												{ onChangeShowTOCTitle && (
													<FlexItem>
														<ToggleControl
															__nextHasNoMarginBottom
															checked={ showTOCTitle }
															label={ sprintf( __( 'Show %s', dpaa.i18n ), __( 'Title', dpaa.i18n ) ) }
															onChange={ onChangeShowTOCTitle }
															disabled={ isLoading }
														/>
													</FlexItem>
												) }
												{ showTOCTitle && (
													<FlexItem style={ {
														border: '1px solid rgba(var(--wp-admin-theme-color-darker-10--rgb), 0.4)',
														borderRadius: '3px'
													} }>
														<Item size='medium'>
															<Flex direction='row' gap={ 2 } wrap={ true }>
																{ ( showTOCTitle && onChangeTocTitle ) && (
																	<FlexItem>
																		<InputControl
																			__next40pxDefaultSize={ true }
																			size='__unstable-large'
																			label={ __( 'Title', dpaa.i18n ) }
																			labelPosition='side'
																			value={ tocTitle }
																			onChange={ onChangeTocTitle }
																			placeholder={ __( 'Table of Contents', dpaa.i18n ) }
																			type='text'
																			disabled={ isLoading }
																		/>
																	</FlexItem>
																) }
																{ ( showTOCTitle && onChangeTocTitleTag ) && (
																	<FlexItem>
																		<SelectControl
																			__next40pxDefaultSize
																			__nextHasNoMarginBottom
																			label={ `${ __( 'Title', dpaa.i18n ) } ${ __( 'Heading level:', dpaa.i18n ) }` }
																			labelPosition='side'
																			value={ tocTitleTag }
																			options={ OPTIONS_STRING_HEADING_LEVELS }
																			onChange={ onChangeTocTitleTag }
																			disabled={ isLoading }
																		/>
																	</FlexItem>
																) }
															</Flex>
														</Item>
													</FlexItem>
												) }
												{ onChangeIsTOCOrderedList && (
													<FlexItem>
														<ToggleGroupControl
															__nextHasNoMarginBottom
															__next40pxDefaultSize
															size='__unstable-large'
															label={ __( 'TOC list type', dpaa.i18n ) }
															isBlock={ true }
															value={ isTOCOrderedList ? 'ordered' : 'unordered' }
															onChange={ newVal => {
																if ( newVal === 'ordered' ) {
																	onChangeIsTOCOrderedList( true ) 
																} else {
																	onChangeIsTOCOrderedList( false )
																}
															} }
															>
															<ToggleGroupControlOptionIcon
																icon={ formatListNumberedIcon }
																label={ __( 'Ordered list', dpaa.i18n ) }
																value='ordered'
															/>
															<ToggleGroupControlOptionIcon
																icon={ formatListBulletsIcon }
																label={ __( 'Unordered list', dpaa.i18n ) }
																value='unordered'
															/>
														</ToggleGroupControl>
														{/* <Button
															size='compact'
															showTooltip
															label={ __( 'Switch the TOC list type', dpaa.i18n ) }
															text={ isTOCOrderedList ? __( 'Ordered list', dpaa.i18n ) : __( ' Unordered list', dpaa.i18n ) }
															icon={ isTOCOrderedList ? formatListNumberedIcon : formatListBulletsIcon }
															iconSize={ 20 }
															variant='primary'
															isDestructive={ false }
															onClick={ onChangeIsTOCOrderedList }
														/> */}
													</FlexItem>
												) }
											</Flex>
										</BaseControl>
									</Item>
								</FlexItem>
							) }
						</Flex>
					</FlexItem>
				) }
				{ onChangeIsIncludeIntro && (
					<FlexItem>
						<Flex direction='column' gap={ 4 } align='flex-start'>
							<FlexItem>
								<ToggleControl
									__nextHasNoMarginBottom
									checked={ isIncludeIntro }
									label={ __( 'Include Introduction', dpaa.i18n ) }
									onChange={ onChangeIsIncludeIntro }
									disabled={ isLoading }
								/>
							</FlexItem>
							{ isIncludeIntro && (
								<FlexItem style={ {
									border: '1px solid rgba(var(--wp-admin-theme-color-darker-10--rgb), 0.4)',
									borderRadius: '3px'
								} }>
									<Item size='medium'>
										<BaseControl label={ __( 'Introduction Settings', dpaa.i18n ) }>
											<Flex
												direction='column' gap={ 3 }
												align='flex-start'
												style={ { width: '100%' } }
											>
												{ onChangeShowIntroTitle && (
													<FlexItem>
														<ToggleControl
															__nextHasNoMarginBottom
															checked={ showIntroTitle }
															label={ sprintf( __( 'Show %s', dpaa.i18n ), __( 'Title', dpaa.i18n ) ) }
															onChange={ onChangeShowIntroTitle }
															disabled={ isLoading }
														/>
													</FlexItem>
												) }
												{ showIntroTitle && (
													<FlexItem style={ {
														border: '1px solid rgba(var(--wp-admin-theme-color-darker-10--rgb), 0.4)',
														borderRadius: '3px'
													} }>
														<Item size='medium'>
															<Flex direction='row' gap={ 2 } wrap={ true }>
																{ ( showIntroTitle && onChangeIntroTitle ) && (
																	<FlexItem>
																		<InputControl
																			__next40pxDefaultSize={ true }
																			size='__unstable-large'
																			label={ __( 'Title', dpaa.i18n ) }
																			labelPosition='side'
																			value={ introTitle }
																			onChange={ onChangeIntroTitle }
																			placeholder={ __( 'Introduction', dpaa.i18n ) }
																			type='text'
																			disabled={ isLoading }
																		/>
																	</FlexItem>
																) }
																{ ( showIntroTitle && onChangeIntroTitleTag ) && (
																	<FlexItem>
																		<SelectControl
																			__next40pxDefaultSize
																			__nextHasNoMarginBottom
																			label={ `${ __( 'Title', dpaa.i18n ) } ${ __( 'Heading level:', dpaa.i18n ) }` }
																			labelPosition='side'
																			value={ introTitleTag }
																			options={ OPTIONS_INT_HEADING_LEVELS }
																			onChange={ onChangeIntroTitleTag }
																			disabled={ isLoading }
																		/>
																	</FlexItem>
																) }
															</Flex>
														</Item>
													</FlexItem>
												) }
											</Flex>
										</BaseControl>
									</Item>
								</FlexItem>
							) }
						</Flex>
					</FlexItem>
				) }
				{ onChangeIsIncludeOutro && (
					<FlexItem>
						<Flex direction='column' gap={ 4 } align='flex-start'>
							<FlexItem>
								<ToggleControl
									__nextHasNoMarginBottom
									checked={ isIncludeOutro }
									label={ __( 'Include Conclusion', dpaa.i18n ) }
									onChange={ onChangeIsIncludeOutro }
									disabled={ isLoading }
								/>
							</FlexItem>
							{ isIncludeOutro && (
								<FlexItem style={ {
									border: '1px solid rgba(var(--wp-admin-theme-color-darker-10--rgb), 0.4)',
									borderRadius: '3px'
								} }>
									<Item size='medium'>
										<BaseControl label={ __( 'Conclusion Settings', dpaa.i18n ) }>
											<Flex
												direction='column' gap={ 3 }
												align='flex-start'
												style={ { width: '100%' } }
											>
												{ onChangeShowOutroTitle && (
													<FlexItem>
														<ToggleControl
															__nextHasNoMarginBottom
															checked={ showOutroTitle }
															label={ sprintf( __( 'Show %s', dpaa.i18n ), __( 'Title', dpaa.i18n ) ) }
															onChange={ onChangeShowOutroTitle }
															disabled={ isLoading }
														/>
													</FlexItem>
												) }
												{ showOutroTitle && (
													<FlexItem style={ {
														border: '1px solid rgba(var(--wp-admin-theme-color-darker-10--rgb), 0.4)',
														borderRadius: '3px'
													} }>
														<Item size='medium'>
															<Flex direction='row' gap={ 2 } wrap={ true }>
																{ ( showOutroTitle && onChangeOutroTitle ) && (
																	<FlexItem>
																		<InputControl
																			__next40pxDefaultSize={ true }
																			size='__unstable-large'
																			label={ __( 'Title', dpaa.i18n ) }
																			labelPosition='side'
																			value={ outroTitle }
																			onChange={ onChangeOutroTitle }
																			placeholder={ __( 'Outroduction', dpaa.i18n ) }
																			type='text'
																			disabled={ isLoading }
																		/>
																	</FlexItem>
																) }
																{ ( showOutroTitle && onChangeOutroTitleTag ) && (
																	<FlexItem>
																		<SelectControl
																			__next40pxDefaultSize
																			__nextHasNoMarginBottom
																			label={ `${ __( 'Title', dpaa.i18n ) } ${ __( 'Heading level:', dpaa.i18n ) }` }
																			labelPosition='side'
																			value={ outroTitleTag }
																			options={ OPTIONS_INT_HEADING_LEVELS }
																			onChange={ onChangeOutroTitleTag }
																			disabled={ isLoading }
																		/>
																	</FlexItem>
																) }
															</Flex>
														</Item>
													</FlexItem>
												) }
											</Flex>
										</BaseControl>
									</Item>
								</FlexItem>
							) }
						</Flex>
					</FlexItem>
				) }
				<FlexItem>
					<Flex
						direction='row'
						justify='space-between'
						wrap={ true }
						gap={ 2 }
					>
						<FlexItem>
							<Flex direction='row' gap={ 2 } wrap={ true } justify='flex-start'>
								{ onChangeParagraphPerSection && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ __( 'Paragraphs per section:', dpaa.i18n ) }
											labelPosition='side'
											value={ paragraphPerSection }
											min={ 1 }
											max={ 4 }
											step={ 1 }
											onChange={ onChangeParagraphPerSection }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
								{ onChangeMinContentWords && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ `${ __( 'Min characters', dpaa.i18n ) }:` }
											labelPosition='side'
											value={ minContentWords }
											min={ 100 }
											max={ 20000 }
											step={ 1 }
											onChange={ onChangeMinContentWords }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
							</Flex>
						</FlexItem>
						<FlexItem>
							<Button
								icon={ content ? 'controls-repeat' : commentContentIcon }
								iconSize={ 20 }
								iconPosition='left'
								variant='primary'
								size='compact'
								className='dpaa-button--flex-item dpaa-button--suggested-generate'
								onClick={ onClickGenerateContent }
								disabled={ isLoading || !sections }
								isBusy={ isLoading }
							>
								{ content ? __( 'Regenerate', dpaa.i18n ) : __( 'Generate', dpaa.i18n ) }
							</Button>
						</FlexItem>
					</Flex>
				</FlexItem>
			</Flex>
		</FlexItem>
	)
} )