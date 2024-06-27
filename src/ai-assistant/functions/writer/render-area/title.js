/**
 * WordPress dependencies
 */
import {
	__,
} from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	Icon,
	__experimentalNumberControl as NumberControl,
	__experimentalHeading as Heading,
	__experimentalInputControl as InputControl,
} from '@wordpress/components'
import { memo } from '@wordpress/element'
import {
	heading as headingIcon,
	commentContent as commentContentIcon,
} from '@wordpress/icons'

export const Title = memo( props => {
	const {
		topic,
		title,
		onChangeTitle,
		titleMinCharacters,
		onChangeTitleMinCharacters,
		titleMaxCharacters,
		onChangeTitleMaxCharacters,
		onClickGenerateTitle,
		isLoading,
	} = props

	return  onChangeTitle && (
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
						<Icon icon={ headingIcon } style={ { verticalAlign: 'middle' } } />
						{ __( 'Title', dpaa.i18n ) }
					</Heading>
				</FlexItem>
				<FlexItem>
					<InputControl
						__next40pxDefaultSize={ true }
						size='__unstable-large'
						value={ title }
						onChange={ onChangeTitle }
						type='text'
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
								{ onChangeTitleMinCharacters && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ __( 'Min characters', dpaa.i18n ) }
											labelPosition='side'
											value={ titleMinCharacters }
											min={ 3 }
											max={ titleMaxCharacters }
											step={ 1 }
											onChange={ onChangeTitleMinCharacters }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
								{ onChangeTitleMaxCharacters && (
									<FlexItem>
										<NumberControl
											__next40pxDefaultSize
											label={ __( 'Max characters', dpaa.i18n ) }
											labelPosition='side'
											value={ titleMaxCharacters }
											min={ titleMinCharacters }
											max={ 200 }
											step={ 1 }
											onChange={ onChangeTitleMaxCharacters }
											disabled={ isLoading }
										/>
									</FlexItem>
								) }
							</Flex>
						</FlexItem>
						<FlexItem>
							<Button
								icon={ title ? 'controls-repeat' : commentContentIcon }
								iconSize={ 20 }
								iconPosition='left'
								variant='primary'
								size='compact'
								className='dpaa-button--flex-item dpaa-button--suggested-generate'
								onClick={ onClickGenerateTitle }
								disabled={ isLoading || !topic }
								isBusy={ isLoading }
							>
								{ title ? __( 'Regenerate', dpaa.i18n ) : __( 'Generate', dpaa.i18n ) }
							</Button>
						</FlexItem>
					</Flex>
				</FlexItem>
			</Flex>
		</FlexItem>
	)
} )