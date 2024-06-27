/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	TextareaControl,
	SelectControl,
	__experimentalItem as Item,
} from '@wordpress/components'
import {
	memo,
	useState,
	useEffect,
} from '@wordpress/element'
import {
	plus as plusIcon
} from '@wordpress/icons'

export const RenderDatasetLine = memo( props => {
	const {
		isLoading,
		line,
		index,
		createMode,
		handleAddMessageData,
		handleRaplaceMessageData,
		handleChangeMessages,
		handleDeleteSelectedDataset,
	} = props

	let messageControlsEasyMode = []

	const [ lineMessages, setLineMessages ] = useState( line?.messages || [ {
		'role': 'system',
		'content': '',
	}, {
		'role': 'user',
		'content': '',
	}, {
		'role': 'assistant',
		'content': '',
	} ] )

	useEffect( () => {
		setLineMessages( line?.messages )
	}, [ line ] )

	// テキストエリア入力イベント
	const handleOnChangeMessage = ( val, index ) => {
		const newLineMessages = [ ...lineMessages ]
		newLineMessages[ index ].content = val
		setLineMessages( newLineMessages )
		handleChangeMessages()
	}

	// Role 変更
	const handleOnChangeRole = ( val, index ) => {
		const newLineMessages = [ ...lineMessages ]
		newLineMessages[ index ].role = val
		setLineMessages( newLineMessages )
		handleChangeMessages()
	}

	// アイテム追加イベント(expertモード)
	const handleOnClickAddData = ( index ) => {
		if ( createMode !== 'expert' ) {
			return null
		}

		const blankMessageSet = { 'role': 'user', 'content': '', }
		const newLineMessages = [ ...lineMessages ]
		newLineMessages.push( blankMessageSet )
		setLineMessages( newLineMessages )
		handleAddMessageData( index, blankMessageSet )
	}

	// アイテム削除イベント(expertモード)
	const handleOnClickDeleteData = ( messageIndex, lineIndex ) => {
		if ( createMode !== 'expert' ) {
			return null
		}
		const newLineMessages = [ ...lineMessages ]
		newLineMessages.splice( messageIndex, 1 )
		setLineMessages( newLineMessages )
		handleRaplaceMessageData( lineIndex, newLineMessages )
	}

	return (
		<Flex
			className='dpaa-operation-panel__flex-table __items'
			gap={ 0 }
			align='stretch'
			justify='left'
			wrap={ false }
			style={ {
				width: '100%',
				wordWrap: 'break-word',
				wordBreak: 'break-all',
			} }
			key={ index }
		>
			<FlexItem style={ { width: '50px' } }>
				<Item>
					{ index + 1 }
				</Item>
			</FlexItem>
			{ createMode === 'expert' && (
				( lineMessages && Array.isArray( lineMessages ) ) && (
					<FlexItem style={ { width: 'calc( 100% - 160px )' } }>
						<Item>
							<Flex direction='column' gap={ 0 } justify='flex-start' align='center'>
								{
									lineMessages?.map( ( message, i ) => {
										return (
											<FlexItem key={ i } style={ { width: '100%' } }>
												<Flex direction='row' gap={ 2 } wrap={ true } justify='space-between' align='flex-start'>
													<FlexItem style={ { flexBasis: '130px' } }>
														<SelectControl
															__next40pxDefaultSize
															size='compact'
															// label={ __( 'Role', dpaa.i18n ) }
															// labelPosition='top'
															value={ lineMessages[ i ]?.role }
															options={ [
																{ value: 'system', label: __( 'System', dpaa.i18n ) },
																{ value: 'user', label: __( 'User', dpaa.i18n ) },
																{ value: 'assistant', label: __( 'Assistant', dpaa.i18n ) },
															] }
															disabled={ isLoading }
															onChange={ newVal => handleOnChangeRole( newVal, i ) }
														/>
													</FlexItem>
													<FlexItem style={ { flexBasis: 'calc( 100% - 176px )' } }>
														<TextareaControl
															rows={ 2 }
															value={ lineMessages[ i ]?.content }
															placeholder={ message?.role === 'user'
															? __( 'Where is the capital of Japan?', dpaa.i18n )
															: message?.role === 'assistant'
																? __( 'Tokyo. Tokyo is known as a city rich in diversity, where culture, fashion, and technology are integrated into an attractive city.', dpaa.i18n )
																: __( 'You are Hanako, an AI assistant. Your primary role is to assist website visitors by directing them to the appropriate pages and answering their questions concisely and accurately.', dpaa.i18n )
															}
															disabled={ isLoading }
															onChange={ newVal => handleOnChangeMessage( newVal, i ) }
														/>
													</FlexItem>
													<FlexItem style={ { flexBasis: '30px' } }>
														<Flex align='center' justify='center'>
															<FlexItem>
																<Button
																	size='small'
																	showTooltip
																	label={ __( 'Delete' ) }
																	icon='trash'
																	iconSize={ 16 }
																	variant='primary'
																	isDestructive={ true }
																	disabled={ isLoading }
																	onClick={ () => handleOnClickDeleteData( i, index ) }
																/>
															</FlexItem>
														</Flex>
													</FlexItem>
												</Flex>
											</FlexItem >
										)
									} )
								}
							</Flex>
						</Item>
					</FlexItem>
				)
			) }
			{ createMode === 'easy' && 
				( lineMessages && Array.isArray( lineMessages ) ) && (
					[ 'user', 'assistant' ].forEach( ( role, i ) => {
						let foundUser = false
						let foundAssistant = false
						// lineMessages.forEach( ( message, idx ) => {
						for ( let idx = 0; idx < lineMessages.length; idx++ ) {
							const message = lineMessages[ idx ];

							// user または assistant の role の場合のみ
							if ( message?.role === role ) {
								// user, asssistant がどちらも見つかっている場合はループを抜ける
								if ( ( message?.role === 'user' && foundUser ) && message?.role === 'assistant' && foundAssistant  ) {
									break;
								}

								// ループをスキップする場合
								if ( ( message?.role === 'user' && foundUser ) || ( message?.role === 'assistant' && foundAssistant ) ) {
									continue;
								}

								// user role の判定
								foundUser = ( message?.role === 'user' && !foundUser ) ? true : false;
								// assistant role の判定
								foundAssistant = ( message?.role === 'assistant' && !foundAssistant ) ? true : false;

								// メッセージ( user または assitant)の追加
								messageControlsEasyMode.push(
									<FlexItem style={ { width: 'calc( 50% - 80px )' } } key={ idx }>
										<Item>
											<TextareaControl
												rows={ 2 }
												value={ lineMessages[ idx ]?.content }
												placeholder={ role === 'user'
													? __( 'Where is the capital of Japan?', dpaa.i18n )
													: __( 'Tokyo. Tokyo is known as a city rich in diversity, where culture, fashion, and technology are integrated into an attractive city.', dpaa.i18n ) }
												onChange={ newVal => handleOnChangeMessage( newVal, idx ) }
												disabled={ isLoading }
											/>
										</Item>
									</FlexItem >
								);
							}
						}
					} )
				)
			}
			{ messageControlsEasyMode }
			<FlexItem>
				<Item>
					<Flex direction='row' gap={ 1 } justify='center'>
						{ createMode === 'expert' && (
							<FlexItem>
								<Button
									size='compact'
									showTooltip
									label={ __( 'Add' ) }
									icon={ plusIcon }
									iconSize={ 22 }
									variant='primary'
									isDestructive={ false }
									disabled={ isLoading }
									onClick={ () => handleOnClickAddData( index ) }
								/>
							</FlexItem>
						) }
						<FlexItem>
							<Button
								size='compact'
								showTooltip
								label={ __( 'Delete' ) }
								icon='trash'
								iconSize={ 18 }
								variant='primary'
								isDestructive={ true }
								disabled={ isLoading }
								onClick={ handleDeleteSelectedDataset }
							/>
						</FlexItem>
					</Flex>
				</Item>
			</FlexItem>
		</Flex>
	)
} )