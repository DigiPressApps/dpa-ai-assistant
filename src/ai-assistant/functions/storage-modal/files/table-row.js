/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	ExternalLink,
	Flex,
	FlexItem,
	__experimentalItem as Item,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo,
} from '@wordpress/element'
import {
	create as createIcon,
	download as downloadIcon,
} from '@wordpress/icons'

export const TableRow = memo( props => {
	const {
		file,
		index,
		onClickCreate,
		onClickDelete,
		onClickDownload,
	} = props

	return (
		<Flex
			className='dpaa-operation-panel__flex-table __items'
			gap={ 0 }
			align='stretch'
			justify='left'
			wrap={ false }
			style={ {
				width: 'fit-content',
				wordWrap: 'break-word',
				wordBreak: 'break-all',
			} }
			key={ index }
		>
			<FlexItem style={ { width: '240px' } }>
				<Item>
					<Text size='13px'>
						<ExternalLink
							href={ `https://platform.openai.com/files/${ file?.id }` }
						>
							<Text size='13px'>{ file?.filename }</Text>
						</ExternalLink>
					</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '140px' } }>
				<Item>
					<Text size='13px'>{ file?.purpose }</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '140px' } }>
				<Item>
					<Text size='13px'>{ ( file?.bytes && typeof file?.bytes === 'number' )
					? `${ file?.bytes.toLocaleString() } ${ __( 'bytes', dpaa.i18n ) }`
					: 'N/A' }</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '110px' } }>
				<Item>
					<Text
						size='13px'
						color={ file?.status === 'processed' && '#169616' }
						isDestructive={ file?.status !== 'processed' }
					>{ __( file?.status, dpaa.i18n ) }</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '150px' } }>
				<Item>
					<Text size='13px'>{ __( file?.id, dpaa.i18n ) }</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '140px' } }>
				<Item>
					{ file?.created_at
						? ( 
							<Text size='13px'>{
								new Date(file.created_at * 1000).toLocaleString([], { hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
							}</Text>
						)
						: '-' 
					}
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '120px' } }>
				<Item>
					<Flex
						direction='row'
						justify='center'
						gap={ 2 }
					>
						<FlexItem>
							<Button
								size='compact'
								showTooltip
								label={ __( 'Create a new tuned model', dpaa.i18n ) }
								icon={ createIcon }
								iconSize={ 24 }
								variant='primary'
								isDestructive={ false }
								disabled={ !file?.filename.endsWith('.jsonl') }
								onClick={ onClickCreate }
							/>
						</FlexItem>
						<FlexItem>
							<Button
								size='compact'
								showTooltip
								label={ __( 'Download', dpaa.i18n ) }
								icon={ downloadIcon }
								iconSize={ 18 }
								variant='primary'
								isDestructive={ false }
								onClick={ onClickDownload }
							/>
						</FlexItem>
						<FlexItem>
							<Button
								size='compact'
								showTooltip
								label={ __( 'Delete this file', dpaa.i18n ) }
								icon='trash'
								iconSize={ 18 }
								variant='primary'
								isDestructive={ true }
								onClick={ onClickDelete }
							/>
						</FlexItem>
					</Flex>
				</Item>
			</FlexItem>
		</Flex>
	)
} )