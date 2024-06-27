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
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	CustomSelectControl,
	BaseControl,
	ExternalLink,
	Flex,
	FlexItem,
	SelectControl,
	RangeControl,
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
			className='dpaa--settings__wrapper'
		>
			<PanelAdvancedSettings
				title={ __( 'Options', dpaa.i18n ) }
				className='dpaa-components-panel __option-settings'
				titleLeftIcon={ cogIcon }
				initialOpen={ false }
				hasToggle={ false }
			>
				<Flex
					direction='column'
					gap={ 3 }
					className='dpaa-ai-assistant--settings__components-flex __open-ai'
				>
					<FlexItem>
						<CustomSelectControl
							__next40pxDefaultSize
							__experimentalShowSelectedHint
							__nextUnconstrainedWidth='100%'
							size='__unstable-large'
							label={ __( 'Speech Model', dpaa.i18n ) }
							value={ OPEN_AI_SPEECH_MODELS.find( option => option.key === model ) }
							options={ OPEN_AI_SPEECH_MODELS }
							onChange={ onChangeModel }
						/>
					</FlexItem>
					<FlexItem>
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
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
					</FlexItem>
					<FlexItem>
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ __( 'Audio Format', dpaa.i18n ) }
							value={ format }
							options={ OPEN_AI_SPEECH_FORMATS }
							onChange={ onChangeFormat }
						/>
					</FlexItem>
					<FlexItem>
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
					</FlexItem>
				</Flex>
			</PanelAdvancedSettings>
		</BaseControl>
	)
} )