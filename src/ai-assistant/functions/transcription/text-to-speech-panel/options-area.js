/**
 * Internal dependencies
 */
import { PanelAdvancedSettings } from '@dpaa/components'
import {
	OPEN_AI_SPEECH_MODELS,
	OPEN_AI_SPEECH_VOICES,
	OPEN_AI_SPEECH_FORMATS,
	DEFAULT_OPEN_AI_SPEECH_SPEED,
	OPEN_AI_SPEECH_VOICES_URL,
	OPEN_AI_GPT_MODELS_URL,
	OPEN_AI_PRICING_URL,
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	CustomSelectControl,
	BaseControl,
	Button,
	ExternalLink,
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
		voice,
		format,
		speed,
		onChangeModel,
		onChangeVoice,
		onChangeFormat,
		onChangeSpeed,
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
							label={ <>
								{ __( 'Speech Model', dpaa.i18n ) }
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
							</> }
							value={ OPEN_AI_SPEECH_MODELS.find( option => option.key === model ) }
							options={ OPEN_AI_SPEECH_MODELS }
							onChange={ onChangeModel }
						/>
						<Text size={ 12 } style={ { color: '#666' } }>
							{ OPEN_AI_SPEECH_MODELS.find( option => option.key === model )?.__experimentalHint }
						</Text>
					</VStack>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Voice', dpaa.i18n ) }
						help={ <ExternalLink
								href={ OPEN_AI_SPEECH_VOICES_URL }
								type="link"
								rel="next"
							>
								{ __( 'Check voices', dpaa.i18n ) }
							</ExternalLink> }
						value={ voice }
						options={ OPEN_AI_SPEECH_VOICES }
						onChange={ onChangeVoice }
					/>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Audio Format', dpaa.i18n ) }
						value={ format }
						options={ OPEN_AI_SPEECH_FORMATS }
						onChange={ onChangeFormat }
					/>
					{ ( model === 'tts-1' || model=== 'tts-1-hd' ) && (
						<RangeControl
							label={ __( 'Speech Speed', dpaa.i18n ) }
							value={ speed }
							allowReset={ true }
							initialPosition={ DEFAULT_OPEN_AI_SPEECH_SPEED }
							resetFallbackValue={ DEFAULT_OPEN_AI_SPEECH_SPEED }
							step={ 0.01 }
							onChange={ onChangeSpeed }
							renderTooltipContent={ value => `${ value }` }
							min={ 0.25 }
							max={ 4.0 }
						/>
					) }
				</VStack>
			</PanelAdvancedSettings>
		</BaseControl>
	)
} )