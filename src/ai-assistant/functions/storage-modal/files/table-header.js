/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Flex,
	FlexItem,
	__experimentalItem as Item,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo,
} from '@wordpress/element'
import {
	Icon,
	connection as connectionIcon,
	calendar as calendarIcon,
	category as categoryIcon,
	check as checkIcon,
	cog as cogIcon,
	page as pageIcon,
} from '@wordpress/icons'

export const TableHeader = memo( () => {

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
			<FlexItem style={ { width: '240px' } }>
				<Item>
					<Text
						display='block'
						size='12px'
						weight='bold'
					>
						<Icon icon={ pageIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
						{ __( 'File name', dpaa.i18n ) }
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
						<Icon icon={ connectionIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
						{ __( 'Purpose', dpaa.i18n ) }
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
						<Icon icon={ categoryIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
						{ __( 'File size', dpaa.i18n ) }
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
						<Icon icon={ cogIcon } style={ { verticalAlign: 'middle', width: '20px', height: '20px' } } />
					</Text>
				</Item>
			</FlexItem>
		</Flex>
	)
} )