/**
 * Internal dependencies
 */
import { OptionsArea } from './options-area'
import {
	OPEN_AI_API_KEY_URL
} from '@dpaa/ai-assistant/constants'
import {
	PopoverHelp,
} from '@dpaa/components'

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
	__experimentalVStack as VStack,
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
		instructions,
		onClickConvert,
		onChangeText,
		onChangeModel,
		onChangeFormat,
		onChangeSpeed,
		onChangeVoice,
		onClickClear,
		onChangeInstructions,
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
				<VStack spacing={ 2 }>
					<TextareaControl
						__nextHasNoMarginBottom
						className='dpaa-ai-assistant--generator__prompt__textarea'
						value={ text }
						onChange={ onChangeText }
						rows={ 3 }
						placeholder={ __( 'Type or paste the text you want to generate to voice audio here.', dpaa.i18n ) }
						disabled={ isLoading || !openai }
					/>
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
					{ model !== 'tts-1' && model !== 'tts-1-hd' && (
						<TextareaControl
							__nextHasNoMarginBottom
							label={ <>
								{ `${ __( 'Custom Instructions', dpaa.i18n ) } (${ __( 'optional', dpaa.i18n ) })` }
								<PopoverHelp
									buttonText=''
									buttonClass='__right-inline-position'
									buttonSize='small'
									popoverPosition='bottom left'
									popoverVariant='toolbar'
									popoverOffset={ 5 }
									popoverClass=''
									popoverNoArrow={ false }
									help={ __( 'Control the voice of your generated audio with additional instructions.<br />You can prompt the model to control aspects of speech, including:<br /><br />- Accent<br />- Emotional range<br />- Intonation<br />- Impressions<br />- Speed of speech<br />- Tone<br />- Whispering', dpaa.i18n ) }
								/>
							</> }
							className='dpaa-ai-assistant--generator__prompt__textarea'
							value={ instructions }
							onChange={ onChangeInstructions }
							rows={ 2 }
							placeholder={ __( 'Speak in a cheerful and positive tone.', dpaa.i18n ) }
							disabled={ isLoading || !openai }
						/>
					) }
				</VStack>
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
						<VStack spacing={ 2 }>
							<ExternalLink
								href={ OPEN_AI_API_KEY_URL }
								type="link"
								rel="next"
							>
								{ __( 'Get the API key.', dpaa.i18n ) }
							</ExternalLink>
						</VStack>
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