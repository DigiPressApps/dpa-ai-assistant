import {
	aiIcon
} from '@dpaa/ai-assistant/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Icon,
	Flex,
	FlexItem,
	__experimentalItem as Item,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo
} from '@wordpress/element'
import {
	calendar as calendarIcon,
	category as categoryIcon,
	check as checkIcon,
	cog as cogIcon,
	info as infoIcon,
	queryPaginationNext as queryPaginationNextIcon,
	page as pageIcon,
	warning as warningIcon,
} from '@wordpress/icons'

export const RenderJobListHeader = memo( props => {
	const {
		currentList,
	} = props
	return (
		<Flex
			className='dpaa-operation-panel__flex-table __header'
			gap={ 0 }
			align='stretch'
			justify='left'
			wrap={ false }
			style={ {
				width: 'fit-content',
				wordWrap: 'break-word',
				wordBreak: 'break-all',
			} }
		>
			<FlexItem style={ { width: '200px' } }>
				<Item>
					<Text
						display='block'
						size='12px'
						weight='bold'
					>
						<Icon icon={ currentList === 'failed' ? warningIcon : infoIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
						{ currentList === 'failed' ? __( 'Error', dpaa.i18n ) : __( 'Model name', dpaa.i18n ) }
					</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '160px' } }>
				<Item>
				<Text
					display='block'
					size='12px'
					weight='bold'
				>
					<Icon icon={ aiIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
					{ __( 'Base model', dpaa.i18n ) }
				</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '200px' } }>
				<Item>
				<Text
					display='block'
					size='12px'
					weight='bold'
				>
					<Icon icon={ pageIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
					{ __( 'Training file', dpaa.i18n ) }
				</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '110px' } }>
				<Item>
				<Text
					display='block'
					size='12px'
					weight='bold'
				>
					<Icon icon={ queryPaginationNextIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
					{ __( 'Suffix', dpaa.i18n ) }
				</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '110px' } }>
				<Item>
					<Text
						display='block'
						size='12px'
						weight='bold'
					>
						<Icon icon={ checkIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
						{ __( 'Status', dpaa.i18n ) }
					</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '150px' } }>
				<Item>
					<Text
						display='block'
						size='12px'
						weight='bold'
					>
						{ __( '# ID', dpaa.i18n ) }
					</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '140px' } }>
				<Item>
				<Text
					display='block'
					size='12px'
					weight='bold'
				>
					<Icon icon={ calendarIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
					{ __( 'Created at', dpaa.i18n ) }
				</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '120px' } }>
				<Item>
				<Text
					display='block'
					size='12px'
					weight='bold'
				>
					<Icon icon={ categoryIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
					{ __( 'Trained tokens', dpaa.i18n ) }
				</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '120px' } }>
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
	)
} )