/**
 * Internal dependencies
 */
import { OptionsArea } from './options-area'
import {
	OPEN_AI_API_KEY_URL
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	ExternalLink,
	Flex,
	FlexItem,
	Notice,
	TextareaControl,
} from '@wordpress/components'
import {
	memo,
} from '@wordpress/element'

export const PromptArea = memo( ( props ) => {
	const {
		isLoading,
		openai,
		text,
		model,
		voice,
		format,
		speed,
		onClickConvert,
		onChangeText,
		onChangeModel,
		onChangeFormat,
		onChangeSpeed,
		onChangeVoice,
		onClickClear,
	} = props

	return (
		<Flex
			className='dpaa-ai-assistant--generator__input-form'
			direction='row'
			align='flex-start'
			gap={ 5 }
		>
			<FlexItem
				className='dpaa-ai-assistant--generator__prompt__wrapper'
				isBlock={ true }
				style={ {
					flexBasis: 'calc( 65% - 6px )'
				} }
			>
				<Flex
					direction='column'
					gap={ 1 }
				>
					<FlexItem>
						<TextareaControl
							__next40pxDefaultSize
							// label={ __( 'Question', dpaa.i18n ) }
							className='dpaa-ai-assistant--generator__prompt__textarea'
							value={ text }
							onChange={ onChangeText }
							rows={ 3 }
							placeholder={ __( 'Type or paste the text you want to generate to voice audio here.', dpaa.i18n ) }
							disabled={ isLoading || !openai }
						/>
					</FlexItem>
					<FlexItem>
						<Flex
							gap={ 1 }
							direction='row'
							justify='flex-end'
							align='center'
						>
							<FlexItem>
								<Button
									size='compact'
									showTooltip
									label={ __( 'Clear all logs', dpaa.i18n ) }
									className='dpaa-ai-assistant--generator__button'
									icon='trash'
									iconSize={ 18 }
									variant='primary'
									isDestructive={ true }
									disabled={ isLoading || !openai }
									onClick={ onClickClear }
								/>
							</FlexItem>
							<FlexItem>
								<Button
									size='compact'
									showTooltip
									label={ __( 'Generate audio', dpaa.i18n ) }
									icon='microphone'
									iconSize={ 20 }
									variant='primary'
									isDestructive={ false }
									isBusy={ isLoading }
									disabled={ isLoading || !text || !openai }
									onClick={ onClickConvert }
								/>
							</FlexItem>
						</Flex>
					</FlexItem>
				</Flex>
			</FlexItem>
			<FlexItem
				isBlock={ true }
				style={ {
					flexBasis: 'calc( 35% - 6px )'
				} }
			>
				{ !openai
				? (
					<Notice
						className="dpaa-ai-assistant--settings__notice-component"
						status="info"
						isDismissible={ false }
					>
						<Flex
							direction='column'
							gap={ 2 }
						>
							<FlexItem>
								<ExternalLink
									href={ OPEN_AI_API_KEY_URL }
									type="link"
									rel="next"
								>
									{ __( 'Get the API key.', dpaa.i18n ) }
								</ExternalLink>
							</FlexItem>
						</Flex>
					</Notice>
				)
				: (
					<OptionsArea
						model={ model }
						voice={ voice }
						format={ format }
						speed={ speed }
						onChangeModel={ onChangeModel }
						onChangeVoice={ onChangeVoice }
						onChangeFormat={ onChangeFormat }
						onChangeSpeed={ onChangeSpeed }
					/>
				) }
			</FlexItem>
		</Flex>
	)
} )