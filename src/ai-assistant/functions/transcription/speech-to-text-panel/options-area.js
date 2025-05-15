/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	PopoverHelp,
} from '@dpaa/components'
import {
	OPEN_AI_TRANSCRIPTION_LANGUAGE,
	DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE,
	OPEN_AI_TRANSCRIPTION_MODELS,
	OPEN_AI_GPT_MODELS_URL,
	OPEN_AI_PRICING_URL,
	OPEN_AI_TRANSCRIPTION_MODELS_DOCUMENT_URL,
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	CustomSelectControl,
	SelectControl,
	RangeControl,
	__experimentalText as Text,
	__experimentalVStack as VStack,
} from '@wordpress/components'
import { memo } from '@wordpress/element'
import { cog as cogIcon } from '@wordpress/icons'

export const OptionsArea = memo( ( props ) => {
	const {
		model,
		language,
		temperature,
		onChangeModel,
		onChangeLanguage,
		onChangeTemperature,
	} = props

	return (
		<BaseControl
			__nextHasNoMarginBottom
			className='dpaa--settings__wrapper'
		>
			<PanelAdvancedSettings
				title={ __( 'Options', dpaa.i18n ) }
				className='dpaa-components-panel __option-settings'
				titleLeftIcon={ cogIcon }
				initialOpen={ false }
				hasToggle={ false }
			>
				<VStack
					spacing={ 3 }
					className='dpaa-ai-assistant--settings__components-flex __open-ai'
				>
					<VStack spacing={ 2 }>
						<CustomSelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							style={{ width: '100%' }}
							label={ <>
								{__( 'Transcription Model', dpaa.i18n ) }
								<PopoverHelp
									buttonText=''
									buttonClass='__right-inline-position'
									buttonSize='small'
									popoverPosition='bottom left'
									popoverVariant='toolbar'
									popoverOffset={ 5 }
									popoverClass=''
									popoverNoArrow={ false }
									help={ __( 'Select an AI model for transcribing audio to text.', dpaa.i18n ) }
								/>
								<Button
									variant="link"
									size="small"
									href={ OPEN_AI_GPT_MODELS_URL }
									target="_blank"
									text={ __('Models', dpaa.i18n) }
									style={ { fontSize: '11px' } }
								/>
								<Button
									variant="link"
									size="small"
									href={ OPEN_AI_PRICING_URL }
									target="_blank"
									text={ __('Pricing', dpaa.i18n) }
									style={ { fontSize: '11px' } }
								/>
								<Button
									variant="link"
									size="small"
									href={ OPEN_AI_TRANSCRIPTION_MODELS_DOCUMENT_URL }
									target="_blank"
									text={ __('Documentation', dpaa.i18n) }
									style={ { fontSize: '11px' } }
								/>
							</> }
							value={ OPEN_AI_TRANSCRIPTION_MODELS.find( option => option.key === model ) }
							options={ OPEN_AI_TRANSCRIPTION_MODELS }
							onChange={ onChangeModel }
						/>
						<Text size={ 12 } style={ { color: '#666' } }>
							{ OPEN_AI_TRANSCRIPTION_MODELS.find( option => option.key === model )?.__experimentalHint }
						</Text>
					</VStack>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Transcription Language', dpaa.i18n ) }
						value={ language }
						options={ OPEN_AI_TRANSCRIPTION_LANGUAGE }
						onChange={ onChangeLanguage }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Temperature', dpaa.i18n ) }
						value={ temperature }
						allowReset={ true }
						initialPosition={ DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE }
						resetFallbackValue={ DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE }
						step={ 0.01 }
						onChange={ onChangeTemperature }
						renderTooltipContent={ value => `${ value }` }
						min={ 0.0 }
						max={ 1.0 }
					/>
				</VStack>
			</PanelAdvancedSettings>
		</BaseControl>
	)
} )