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
	Flex,
	FlexItem,
	__experimentalVStack as VStack,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	memo,
} from '@wordpress/element'

export const SettingsPanel = memo( props => {
	const {
		openai,
		pluginSettings,
	} = props

	return (
		<VStack spacing={ 4 } className='dpaa--settings__wrapper'>
			<Text color='#666'>{ __( 'General settings for content generation by AI and API behavior. Each tab allows you to temporarily change generation parameters from the options panel.', dpaa.i18n ) }</Text>
			<Flex
				direction='row'
				gap={ 3 }
				align='flex-start'
				justify='space-between'
				wrap={ true }
			>
				<FlexItem
					style={ {
						flexBasis: 'calc(50% - 8px)'
					} }
				>
					<VStack spacing={ 3 }>
						<GeneralSettings
							pluginSettings={ pluginSettings }
						/>
						<TextGenerationSettings
							pluginSettings={ pluginSettings }
						/>
						<ImageSettings
							pluginSettings={ pluginSettings }
						/>
						<UserRolesRestriction />
					</VStack>
				</FlexItem>
				<FlexItem
					style={ {
						flexBasis: 'calc(50% - 8px)'
					} }
				>
					<VStack spacing={ 3 }>
						<OpenAISettings
							pluginSettings={ pluginSettings }
						/>
						<GoogleAISettings />
						<OpenAISettingsForTranscription
							pluginSettings={ pluginSettings }
						/>
						<OpenAISettingsForImageGeneration
							pluginSettings={ pluginSettings }
						/>
						<StabilityAISettings
							pluginSettings={ pluginSettings }
						/>
					</VStack>
				</FlexItem>
			</Flex>
			<ExportImportSettings pluginSettings={ pluginSettings } />
		</VStack>
	)
} )

export default SettingsPanel