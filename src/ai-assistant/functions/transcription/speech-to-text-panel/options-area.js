/**
 * Internal dependencies
 */
import { PanelAdvancedSettings } from '@dpaa/components'
import {
	OPEN_AI_TRANSCRIPTION_LANGUAGE,
	DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE,
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	Flex,
	FlexItem,
	SelectControl,
	RangeControl,
} from '@wordpress/components'
import { memo } from '@wordpress/element'
import { cog as cogIcon } from '@wordpress/icons'

export const OptionsArea = memo( ( props ) => {
	const {
		language,
		temperature,
		onChangeLanguage,
		onChangeTemperature,
	} = props

	return (
		<BaseControl className='dpaa--settings__wrapper'>
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
						<SelectControl
							__next40pxDefaultSize
							size='__unstable-large'
							label={ __( 'Transcription Language', dpaa.i18n ) }
							value={ language }
							options={ OPEN_AI_TRANSCRIPTION_LANGUAGE }
							onChange={ onChangeLanguage }
						/>
					</FlexItem>
					<FlexItem>
						<RangeControl
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
					</FlexItem>
				</Flex>
			</PanelAdvancedSettings>
		</BaseControl>
	)
} )