/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	ToggleControl,
	__experimentalText as Text,
	__experimentalSpacer as Spacer,
	__experimentalInputControl as InputControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import {
	memo
} from '@wordpress/element'
import {
	addCard as addCardIcon,
	download as downloadIcon,
	upload as uploadIcon,
	tableRowAfter as tableRowAfterIcon,
} from '@wordpress/icons'

export const RenderPanelOperationArea = memo( props => {
	const {
		isLoading,
		currentMode,
		setCurrentMode,
		createMode,
		setCreateMode,
		targetSelecter,
		datasetNum,
		uploadFileName,
		onClickAddEntry,
		onClickImport,
		onClickUpload,
		onClickDownload,
		onClickClear,
		onChangeUploadFileName,
	} = props

	return (
		<Spacer marginBottom={ 5 }>
			<Flex
				direction='column'
				gap={ 5 }
				justify='space-between'
				style={ { width: '100%' } }
			>
				<FlexItem>
					<Flex
						direction='row'
						gap={ 3 }
						justify='space-between'
						style={ { width: '100%' } }
					>
						<FlexItem style={ { flexBasis: 'calc( 100% - 162px )' } }>
							<Text
								display='block'
								size='13px'
								weight='normal'
								lineHeight={ 1.44 }
							>
								{ currentMode === 'list'
									? __( 'List of files uploaded to OpenAI. You can create a custom AI model from Fine-tune data (jsonl).', dpaa.i18n )
									: __( 'Create or upload your dataset for creatinig custom tuned model and upload it to OpenAI as data for the Fine-tune model.', dpaa.i18n )
								}
							</Text>
						</FlexItem>
						<FlexItem style={ { flexBasis: '150px' } }>
							<Flex
								direction='row'
								gap={ 2 }
								align='center'
								justify='flex-end'
							>
								<FlexItem>
									{ targetSelecter }
								</FlexItem>
							</Flex>
						</FlexItem>
					</Flex>
				</FlexItem>
				<FlexItem>
					<Flex
						direction='row'
						gap={ 2 }
						justify='space-between'
						align='flex-start'
						wrap={ true }
					>
						<FlexItem>
							<ToggleGroupControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								size='__unstable-large'
								// label={ __( 'Switching', dpaa.i18n ) }
								isBlock={ true }
								value={ currentMode }
								onChange={ newVal => setCurrentMode( newVal ) }
								>
								<ToggleGroupControlOption
									showTooltip
									aria-label={ sprintf( __( 'Switch to %s', dpaa.i18n ), __( 'list of uploaded files', dpaa.i18n ) ) }
									label={ __( 'Dataset files', dpaa.i18n ) }
									value='list'
									
								/>
								<ToggleGroupControlOption
									showTooltip
									aria-label={ sprintf( __( 'Switch to %s', dpaa.i18n ), __( 'dataset creation', dpaa.i18n ) ) }
									label={ `${ __( 'Dataset creation', dpaa.i18n ) } (${ datasetNum })` }
									value='create'
								/>
							</ToggleGroupControl>
						</FlexItem>
						{ currentMode === 'create' && (
							<FlexItem>
								<Flex direction='column' gap={ 4 } justify='flex-end'>
									<FlexItem>
										<Flex
											direction='row'
											gap={ 2 }
											justify='flex-end'
											wrap={ true }
										>
											<FlexItem>
												<Flex direction='row' gap={ 2 } align='center'>
													<FlexItem>
														<InputControl
															label={ __( 'File name', dpaa.i18n ) }
															labelPosition='side'
															// placeholder={  }
															__unstableInputWidth='180px'
															value={ uploadFileName }
															onChange={ onChangeUploadFileName }
															type='text'
															disabled={ isLoading }
														/>
													</FlexItem>
													<FlexItem>
														<Button
															showTooltip
															label={ `${ __( 'Upload the current dataset to OpenAI for Fine-tune', dpaa.i18n ) }` }
															icon={ uploadIcon }
															iconSize={ 22 }
															variant='primary'
															isDestructive={ false }
															disabled={ isLoading }
															onClick={ onClickUpload }
														/>
													</FlexItem>
												</Flex>
											</FlexItem>
											<FlexItem>
												<Button
													showTooltip
													label={ `${ __( 'Download the current dataset as json', dpaa.i18n ) }` }
													icon={ downloadIcon }
													iconSize={ 22 }
													variant='primary'
													isDestructive={ false }
													disabled={ isLoading }
													onClick={ onClickDownload }
												/>
											</FlexItem>
										</Flex>
									</FlexItem>
									<FlexItem>
										<Flex
											direction='row'
											gap={ 2 }
											justify='flex-end'
											wrap={ true }
										>
											<FlexItem>
												<ToggleControl
													__nextHasNoMarginBottom
													checked={ createMode === 'expert' }
													label={ __( 'Expert mode', dpaa.i18n ) }
													disabled={ isLoading }
													onChange={ newVal => setCreateMode( newVal ? 'expert' : 'easy' ) }
												/>
											</FlexItem>
											<FlexItem>
												<Button
													showTooltip
													label={ __( 'Add a manual training data', dpaa.i18n ) }
													icon={ tableRowAfterIcon }
													iconSize={ 22 }
													variant='primary'
													isDestructive={ false }
													disabled={ isLoading }
													onClick={ onClickAddEntry }
												/>
											</FlexItem>
											<FlexItem>
												<Button
													showTooltip
													label={ `${ __( 'Import local dataset file', dpaa.i18n ) } (jsonl, json, csv)` }
													icon={ addCardIcon }
													iconSize={ 22 }
													variant='primary'
													isDestructive={ false }
													disabled={ isLoading }
													onClick={ onClickImport }
												/>
											</FlexItem>
											<FlexItem>
												<Button
													showTooltip
													label={ __( 'Clear all dataset', dpaa.i18n ) }
													icon='trash'
													iconSize={ 22 }
													variant='primary'
													isDestructive={ true }
													disabled={ isLoading }
													onClick={ onClickClear }
												/>
											</FlexItem>
										</Flex>
									</FlexItem>
								</Flex>
							</FlexItem>
						) }
					</Flex>
				</FlexItem>
			</Flex>
		</Spacer>
	)
} )