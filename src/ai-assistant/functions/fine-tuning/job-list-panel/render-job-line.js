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
import { memo } from '@wordpress/element'
import {
	close as closeIcon,
} from '@wordpress/icons'

// トレーニングファイル名の取得
const getTrainingFileName = ( id, uploadedFiles ) => {
	if ( id && Array.isArray( uploadedFiles ) && uploadedFiles.length > 0 ) {
		const file = uploadedFiles.find( item => item.id === id );
		return file ? file.filename : null
	}
}

export const RenderJobLine = memo( props => {
	const {
		job,
		index,
		uploadedFiles,
		onClickCancel,
		onClickDelete,
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
			<FlexItem style={ { width: '200px' } }>
				<Item>
					{ ( job?.fine_tuned_model && !job?.error?.error )
						? (
							<ExternalLink href={ `https://platform.openai.com/finetune/${ job?.id }?filter=all` }>
								<Text
									size='13px'
									highlightWords={ ( job?.user_provided_suffix && typeof job?.user_provided_suffix === 'string' ) ? [ job?.user_provided_suffix ] : [ '' ] }
								>
									{ job?.fine_tuned_model }
								</Text>
							</ExternalLink>
						)
						: (
							<Text
								size='13px'
								color='#cc1818'
							>
								{ job?.error?.message }
							</Text>
						)
					}
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '160px' } }>
				<Item>
					<Text size='13px'>{ job?.model }</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '200px' } }>
				<Item>
					{ uploadedFiles ? (
						<ExternalLink
							href={ `https://platform.openai.com/files/${ job?.training_file }` }
						>
							<Text size='13px'>{
								getTrainingFileName( job?.training_file, uploadedFiles )
							}</Text>
						</ExternalLink>
					) : '-' }
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '110px' } }>
				<Item>
					<Text size='13px'>{ job?.user_provided_suffix || 'N/A' }</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '110px' } }>
				<Item>
					<Text
						size='13px'
						color={ job?.status === 'succeeded' && '#169616' }
						isDestructive={ job?.status === 'failed' }
					>{ __( job?.status, dpaa.i18n ) }</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '150px' } }>
				<Item>
					<Text size='13px'>{ __( job?.id, dpaa.i18n ) }</Text>
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '140px' } }>
				<Item>
					{ job?.created_at
						? ( 
							<Text size='13px'>{
								new Date(job.created_at * 1000).toLocaleString([], { hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
							}</Text>
						)
						: 'N/A' 
					}
				</Item>
			</FlexItem>
			<FlexItem style={ { width: '120px' } }>
				<Item>
					<Text size='13px'>{ job?.trained_tokens ? job?.trained_tokens.toLocaleString() : 'N/A' }</Text>
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
								label={ __( 'Cancel a item', dpaa.i18n ) }
								icon={ closeIcon }
								iconSize={ 18 }
								variant='primary'
								isDestructive={ true }
								disabled={ job?.status !== 'running' }
								onClick={ onClickCancel }
							/>
						</FlexItem>
						<FlexItem>
							<Button
								size='compact'
								showTooltip
								label={ __( 'Delete this model', dpaa.i18n ) }
								icon='trash'
								iconSize={ 18 }
								variant='primary'
								isDestructive={ true }
								disabled={ job?.status !== 'succeeded' }
								onClick={ onClickDelete }
							/>
						</FlexItem>
					</Flex>
				</Item>
			</FlexItem>
		</Flex>
	)
 } )