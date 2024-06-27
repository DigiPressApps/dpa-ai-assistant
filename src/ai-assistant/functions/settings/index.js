/**
 * Internal dependencies
 */
import './editor.scss'
import {
	GeneralSettings,
	OpenAISettings,
	GoogleAISettings,
	OpenAISettingsForImageGeneration,
	OpenAISettingsForTranscription,
	StabilityAISettings,
	TextGenerationSettings,
	ImageSettings,
	UserRolesRestriction,
	ExportImportSettings,
} from './components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	Flex,
	FlexItem,
} from '@wordpress/components'
import {
	useState,
	memo,
} from '@wordpress/element'

export const SettingsPanel = memo( props => {
	const {
		openai,
		pluginSettings,
	} = props

	return (
		<>
			<BaseControl
				className="dpaa--settings__wrapper"
				help={ __( 'General settings for content generation by AI and API behavior. Each tab allows you to temporarily change generation parameters from the options panel.', dpaa.i18n ) }
			>
				<Flex
					direction='row'
					gap={ 4 }
					align='flex-start'
					justify='space-between'
					wrap={ true }
				>
					<FlexItem
						style={ {
							flexBasis: 'calc(50% - 8px)'
						} }
					>
						<Flex
							direction='column'
							gap={ 1 }
						>
							<FlexItem>
								<GeneralSettings
									pluginSettings={ pluginSettings }
								/>
							</FlexItem>
							<FlexItem>
								<TextGenerationSettings
									pluginSettings={ pluginSettings }
								/>
							</FlexItem>
							<FlexItem>
								<ImageSettings
									pluginSettings={ pluginSettings }
								/>
							</FlexItem>
							<FlexItem>
								<UserRolesRestriction />
							</FlexItem>
						</Flex>
					</FlexItem>
					<FlexItem
						style={ {
							flexBasis: 'calc(50% - 8px)'
						} }
					>
						<Flex
							direction='column'
							gap={ 1 }
						>
							<FlexItem>
								<OpenAISettings
									pluginSettings={ pluginSettings }
								/>
							</FlexItem>
							<FlexItem>
								<GoogleAISettings />
							</FlexItem>
							<FlexItem>
								<OpenAISettingsForTranscription
									pluginSettings={ pluginSettings }
								/>
							</FlexItem>
							<FlexItem>
								<OpenAISettingsForImageGeneration
									pluginSettings={ pluginSettings }
								/>
							</FlexItem>
							<FlexItem>
								<StabilityAISettings
									pluginSettings={ pluginSettings }
								/>
							</FlexItem>
						</Flex>
					</FlexItem>
				</Flex>
			</BaseControl>
			<ExportImportSettings pluginSettings={ pluginSettings } />
		</>
	)
} )

export default SettingsPanel