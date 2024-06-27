/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	Icon,
	TextareaControl,
	__experimentalNumberControl as NumberControl,
	__experimentalHeading as Heading,
} from '@wordpress/components'
import { memo } from '@wordpress/element'
import {
	commentContent as commentContentIcon,
	postExcerpt as postExcerptIcon,
} from '@wordpress/icons'

export const Excerpt = memo( props => {
	const {
		title,
		excerpt,
		onChangeExcerpt,
		excerptMinCharacters,
		onChangeExcerptMinCharacters,
		excerptMaxCharacters,
		onChangeExcerptMaxCharacters,
		onClickGenerateExcerpt,
		isLoading,
	} = props

	return onChangeExcerpt && (
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
						<Icon icon={ postExcerptIcon } style={ { verticalAlign: 'middle' } } />
						{ __( 'Excerpt', dpaa.i18n ) }
					</Heading>
				</FlexItem>
				<FlexItem>
					<TextareaControl
						__next40pxDefaultSize
						className='dpaa-ai-assistant--generator__prompt__textarea'
						value={ excerpt }
						onChange={ onChangeExcerpt }
						rows={ 3 }
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
								{ onChangeExcerptMinCharacters && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ __( 'Min characters', dpaa.i18n ) }
											labelPosition='side'
											value={ excerptMinCharacters }
											min={ 40 }
											max={ excerptMaxCharacters }
											step={ 1 }
											onChange={ onChangeExcerptMinCharacters }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
								{ onChangeExcerptMaxCharacters && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ __( 'Max characters', dpaa.i18n ) }
											labelPosition='side'
											value={ excerptMaxCharacters }
											min={ excerptMinCharacters }
											max={ 300 }
											step={ 1 }
											onChange={ onChangeExcerptMaxCharacters }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
							</Flex>
						</FlexItem>
						<FlexItem>
							<Button
								icon={ excerpt ? 'controls-repeat' : commentContentIcon }
								iconSize={ 20 }
								iconPosition='left'
								variant='primary'
								size='compact'
								className='dpaa-button--flex-item dpaa-button--suggested-generate'
								onClick={ onClickGenerateExcerpt }
								disabled={ isLoading || !title }
								isBusy={ isLoading }
							>
								{ excerpt ? __( 'Regenerate', dpaa.i18n ) : __( 'Generate', dpaa.i18n ) }
							</Button>
						</FlexItem>
					</Flex>
				</FlexItem>
			</Flex>
		</FlexItem>
	)
} )