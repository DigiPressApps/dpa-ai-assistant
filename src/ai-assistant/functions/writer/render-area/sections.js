/**
 * WordPress dependencies
 */
import {
	__,
} from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	Flex,
	FlexItem,
	Icon,
	SelectControl,
	TextareaControl,
	__experimentalNumberControl as NumberControl,
	__experimentalHeading as Heading,
} from '@wordpress/components'
import {
	useState,
	memo,
} from '@wordpress/element'
import {
	archive as archiveIcon,
	commentContent as commentContentIcon,
} from '@wordpress/icons'

export const Sections = memo( props => {
	const {
		title,
		sections,
		onChangeSections,
		sectionCount,
		onChangeSectionCount,
		sectionHeadingLevel,
		onChangeSectionHeadingLevel,
		sectionTitleMinCharacters,
		onChangeSectionTitleMinCharacters,
		sectionTitleMaxCharacters,
		onChangeSectionTitleMaxCharacters,
		onClickGenerateSections,
		isLoading,
	} = props

	const optionsHeadingLevel = [
		{
			label: 'h1',
			value: '1'
		},
		{
			label: 'h2',
			value: '2'
		},
		{
			label: 'h3',
			value: '3'
		},
		{
			label: 'h4',
			value: '4'
		},
		{
			label: 'h5',
			value: '5'
		},
		{
			label: 'h6',
			value: '6'
		}
	];

	return onChangeSections && (
		<FlexItem>
			<Flex
				className='dpaa-box-shadow-element'
				direction='column'
				justify='space-between'
				wrap={ true }
				gap={ 2 }
			>
				<FlexItem>
					<Heading
						level={ 5 }
						adjustLineHeightForInnerControls="small"
						weight={ 600 }
					>
						<Icon icon={ archiveIcon } style={ { verticalAlign: 'middle' } } />
						{ __( 'Sections', dpaa.i18n ) }
					</Heading>
				</FlexItem>
				<FlexItem>
					<TextareaControl
						__next40pxDefaultSize
						className='dpaa-ai-assistant--generator__prompt__textarea'
						help={ __( 'Create sentences for each section generated here to compose the post content.', dpaa.i18n ) }
						value={ sections }
						onChange={ onChangeSections }
						rows={ 4 }
						disabled={ isLoading }
					/>
				</FlexItem>
				<FlexItem>
					<Flex
						direction='row'
						justify='space-between'
						wrap={ true }
						gap={ 2 }
					>
						<FlexItem>
							<Flex direction='row' gap={ 2 } wrap={ true } justify='flex-start'>
								{ onChangeSectionCount && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ __( 'Sections:', dpaa.i18n ) }
											labelPosition='side'
											value={ sectionCount }
											min={ 1 }
											max={ 4 }
											step={ 1 }
											onChange={ onChangeSectionCount }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
								{ onChangeSectionHeadingLevel && (
									<FlexItem>
										<SelectControl
											__next40pxDefaultSize
											__nextHasNoMarginBottom
											label={ __( 'Heading level:', dpaa.i18n ) }
											labelPosition='side'
											value={ sectionHeadingLevel }
											options={ optionsHeadingLevel }
											onChange={ onChangeSectionHeadingLevel }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
								{ onChangeSectionTitleMinCharacters && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ __( 'Min characters', dpaa.i18n ) }
											labelPosition='side'
											value={ sectionTitleMinCharacters }
											min={ 3 }
											max={ sectionTitleMaxCharacters }
											step={ 1 }
											onChange={ onChangeSectionTitleMinCharacters }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
								{ onChangeSectionTitleMaxCharacters && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ __( 'Max characters', dpaa.i18n ) }
											labelPosition='side'
											value={ sectionTitleMaxCharacters }
											min={ sectionTitleMinCharacters }
											max={ 200 }
											step={ 1 }
											onChange={ onChangeSectionTitleMaxCharacters }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
							</Flex>
						</FlexItem>
						<FlexItem>
							<Button
								icon={ sections ? 'controls-repeat' : commentContentIcon }
								iconSize={ 20 }
								iconPosition='left'
								variant='primary'
								size='compact'
								className='dpaa-button--flex-item dpaa-button--suggested-generate'
								onClick={ onClickGenerateSections }
								disabled={ isLoading || !title }
								isBusy={ isLoading }
							>
								{ sections ? __( 'Regenerate', dpaa.i18n ) : __( 'Generate', dpaa.i18n ) }
							</Button>
						</FlexItem>
					</Flex>
				</FlexItem>
			</Flex>
		</FlexItem>
	)
} )