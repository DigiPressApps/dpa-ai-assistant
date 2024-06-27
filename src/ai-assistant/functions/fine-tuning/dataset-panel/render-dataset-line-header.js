/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	Icon,
	Flex,
	FlexItem,
	TextareaControl,
	__experimentalItem as Item,
	__experimentalText as Text,
	__experimentalSpacer as Spacer,
} from '@wordpress/components'
import {
	memo,
} from '@wordpress/element'
import {
	cog as cogIcon,
	commentContent as commentContentIcon,
} from '@wordpress/icons'

export const RenderDatasetLineHeader = memo( props => {
	const {
		isLoading,
		createMode,
		systemMessageOnEasy,
		onChangeSystemMessageOnEasy,
	} = props

	return (
		<>
			{ createMode === 'easy' && (
				<Spacer marginBottom={ 5 }>
					<BaseControl
						label={ __( 'System Prompt', dpaa.i18n ) }
						help={ __( 'Enter the behavior, character, and prior knowledge of the custom model (AI) to be created. This prompt applies to all training data.', dpaa.i18n ) }
					>
						<TextareaControl
							rows={ 2 }
							value={ systemMessageOnEasy }
							placeholder={ __( 'You are Hanako, an AI assistant. Your primary role is to assist website visitors by directing them to the appropriate pages and answering their questions concisely and accurately.', dpaa.i18n ) }
							onChange={ onChangeSystemMessageOnEasy }
							disabled={ isLoading }
						/>
					</BaseControl>
				</Spacer>
			) }
			<Flex
				className='dpaa-operation-panel__flex-table __header'
				gap={ 0 }
				align='stretch'
				justify='left'
				wrap={ false }
				style={ {
					width: '100%',
					wordWrap: 'break-word',
					wordBreak: 'break-all',
				} }
			>
				<FlexItem style={ { width: '50px' } }>
					<Item>
						<Text
							display='block'
							size='12px'
							weight='bold'
						>#</Text>
					</Item>
				</FlexItem>
				{ createMode === 'expert' && (
					<FlexItem style={ { width: 'calc( 100% - 160px )' } }>
							<Item>
								<Text
									display='block'
									size='12px'
									weight='bold'
								>
									<Icon icon={ commentContentIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
									{ __( 'Training data', dpaa.i18n ) }
								</Text>
							</Item>
					</FlexItem>
				) }
				{ createMode === 'easy' && (
					<>
						<FlexItem style={ { width: 'calc( 50% - 80px )' } }>
							<Item>
								<Text
									display='block'
									size='12px'
									weight='bold'
								>
									<Icon icon={ commentContentIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
									{ __( 'Question', dpaa.i18n ) }
								</Text>
							</Item>
						</FlexItem>
						<FlexItem style={ { width: 'calc( 50% - 80px )' } }>
							<Item>
								<Text
									display='block'
									size='12px'
									weight='bold'
								>
									<Icon icon={ commentContentIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
									{ __( 'Answer', dpaa.i18n ) }
								</Text>
							</Item>
						</FlexItem>
					</>
				) }
				<FlexItem>
					<Item>
						<Text
							display='block'
							size='12px'
							weight='bold'
						>
							<Icon icon={ cogIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
						</Text>
					</Item>
				</FlexItem>
			</Flex>
		</>
		
	)
} )