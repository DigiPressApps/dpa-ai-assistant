/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	__experimentalText as Text,
	__experimentalSpacer as Spacer,
} from '@wordpress/components'
import {
	memo
} from '@wordpress/element'

export const RenderPanelOperationArea = memo( props => {

	const {
		currentList,
		setCurrentList,
		targetSelecter,
		succeededJobs,
		failedJobs,
		runningJobs,
		onClickRefresh,
	} = props

	return (
		<Spacer marginBottom={ 4 }>
			<Flex
				direction='column'
				gap={ 4 }
				justify='space-between'
				style={ { width: '100%' } }
			>
				<FlexItem>
					<Flex
						direction='row'
						gap={ 3 }
						wrap={ true }
						justify='space-between'
						style={ { width: '100%' } }
					>
						<FlexItem>
							<Text
								display='block'
								size='13px'
								weight='normal'
							>
								{ __( 'Trained AI model list.', dpaa.i18n ) }
							</Text>
						</FlexItem>
						<FlexItem>
							<Flex
								direction='row'
								gap={ 2 }
								align='center'
								justify='flex-end'
							>
								<FlexItem>
									{ targetSelecter }
								</FlexItem>
								<FlexItem>
									<Button
										size='compact'
										showTooltip
										label={ __( 'Refresh', dpaa.i18n ) }
										icon='controls-repeat'
										iconSize={ 18 }
										variant='primary'
										isDestructive={ false }
										onClick={ onClickRefresh }
									/>
								</FlexItem>
							</Flex>
						</FlexItem>
					</Flex>
				</FlexItem>
				<FlexItem>
					<Flex
						direction='row'
						gap={ 4 }
						align='center'
						justify='flex-end'
					>
						<FlexItem>
							<Button
								variant='link'
								onClick={ () => setCurrentList( 'succeeded' ) }
							>
								<Text size='14px' color='#169616' weight={ currentList === 'succeeded' && '600' }>{ __( 'succeeded', dpaa.i18n ) }</Text>
								<Text size='14px' color='#666'>{ ` (${ succeededJobs?.length })` }</Text>
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								variant='link'
								onClick={ () => setCurrentList( 'failed' ) }
							>
								<Text size='14px' color='#cc1818' weight={ currentList === 'failed' && '600' }>{ __( 'failed', dpaa.i18n ) }</Text>
								<Text size='14px' color='#666'>{ ` (${ failedJobs?.length })` }</Text>
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								variant='link'
								onClick={ () => setCurrentList( 'running' ) }
							>
								<Text size='14px' weight={ currentList === 'running' && '600' }>{ __( 'running', dpaa.i18n ) }</Text>
								<Text size='14px' color='#666'>{ ` (${ runningJobs?.length })` }</Text>
							</Button>
						</FlexItem>
					</Flex>
				</FlexItem>
			</Flex>
		</Spacer>
	)
} )