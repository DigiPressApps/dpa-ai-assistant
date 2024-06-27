/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	UpgradeModal
} from '@dpaa/components'
import {
	CHAT_LANGUAGES,
	CHAT_CONTENT_STRUCTURES,
	CHAT_WRITING_STYLES,
	CHAT_WRITING_TONES,
	OPEN_AI_GPT_MODELS,
	TEXT_GENERATION_ENGINES,
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	CustomSelectControl,
	BaseControl,
	Flex,
	FlexItem,
	SelectControl,
	TextareaControl,
	__experimentalDivider as Divider,
} from '@wordpress/components'
import {
	memo,
	useEffect,
	useState,
} from '@wordpress/element'
import { cog as cogIcon } from '@wordpress/icons'

export const OptionsArea = memo( ( props ) => {
	const {
		label,
		userCanManageSettings,
		fineTunedModels,
		onChangeEngine,
		model,
		onChangeModel,
		language,
		onChangeLanguage,
		contentStructure,
		onChangeContentStructure,
		writingStyle,
		onChangeWritingStyle,
		writingTone,
		onChangeWritingTone,
		customPrompt,
		onChangeCustomBehavior,
	} = props

	// 選択可能なGPTモデルの状態管理用
	const selectableModels = OPEN_AI_GPT_MODELS

	useEffect( () => {
		if ( Array.isArray( fineTunedModels ) && fineTunedModels.length > 0 ) {
			fineTunedModels.forEach( ( job, index ) => {
				if ( !selectableModels.some( model => model.key === job?.id ) && !job?.error?.message && job?.fine_tuned_model ) {
					selectableModels.push({
						name: job?.fine_tuned_model,
						key: job?.fine_tuned_model,	// APIに渡す model は ID(job.id) ではなく、 モデル名(job.fine_tuned_model)
						__experimentalHint: __( 'Tuned', dpaa.i18n ),
					} );
				}
			 } )
		}
	}, [ fineTunedModels ] )

	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false );

	return (
		<>
			<BaseControl className='dpaa--settings__wrapper'>
				<PanelAdvancedSettings
					title={ label }
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
						{ onChangeEngine && (
							<>
								<FlexItem>
									<SelectControl
										__next40pxDefaultSize
										size='__unstable-large'
										label={ __( 'AI Text Generator', dpaa.i18n ) }
										value='gpt'
										options={ TEXT_GENERATION_ENGINES }
										onChange={ newVal => setIsUpgradeModal( true ) }
									/>
								</FlexItem>
								<FlexItem>
									<Divider margin={ 3 } style={ { opacity: 0.5 } } />
								</FlexItem>
							</>
						) }
						
						{ ( userCanManageSettings && onChangeModel ) && (
							<FlexItem>
								<CustomSelectControl
									__next40pxDefaultSize
									__experimentalShowSelectedHint
									size='__unstable-large'
									label={ __( 'Model', dpaa.i18n ) }
									value={ selectableModels.find( option => option.key === model ) }
									options={ selectableModels }
									onChange={ onChangeModel }
								/>
							</FlexItem>
						) }
						{ onChangeLanguage && (
							<FlexItem>
								<SelectControl
									__next40pxDefaultSize
									size='__unstable-large'
									label={ __( 'Select Language', dpaa.i18n ) }
									value={ language }
									options={ CHAT_LANGUAGES }
									onChange={ onChangeLanguage }
								/>
							</FlexItem>
						) }
						{ onChangeContentStructure && (
							<FlexItem>
								<SelectControl
									__next40pxDefaultSize
									size='__unstable-large'
									label={ __( 'Content Structure', dpaa.i18n ) }
									value={ contentStructure }
									options={ CHAT_CONTENT_STRUCTURES }
									onChange={ onChangeContentStructure }
								/>
							</FlexItem>
						) }
						{ onChangeWritingStyle && (
							<FlexItem>
								<SelectControl
									__next40pxDefaultSize
									size='__unstable-large'
									label={ __( 'AI Writing Style', dpaa.i18n ) }
									value={ writingStyle }
									options={ CHAT_WRITING_STYLES }
									onChange={ onChangeWritingStyle }
								/>
							</FlexItem>
						) }
						{ onChangeWritingTone && (
							<FlexItem>
								<SelectControl
									__next40pxDefaultSize
									size='__unstable-large'
									label={ __( 'AI Writing Tone', dpaa.i18n ) }
									value={ writingTone }
									options={ CHAT_WRITING_TONES }
									onChange={ onChangeWritingTone }
								/>
							</FlexItem>
						) }
						{ onChangeCustomBehavior && (
							<FlexItem>
								<TextareaControl
									__next40pxDefaultSize
									label={ __( 'Custom Prompt', dpaa.i18n ) }
									value={ customPrompt }
									onChange={ onChangeCustomBehavior }
									rows={ 3 }
									placeholder={ __( 'You are batman as a dark hero. Always respond with cool words.', dpaa.i18n ) }
								/>
							</FlexItem>
						) }
					</Flex>
				</PanelAdvancedSettings>
			</BaseControl>
			{ isUpgradeModal && <UpgradeModal onRequestClose={ () => setIsUpgradeModal( false ) } /> }
		</>
	)
} )

OptionsArea.defaultProps = {
	label: __( 'Options', dpaa.i18n ),
	userCanManageSettings: false,
	model: undefined,
	onChangeModel: undefined,
	language: undefined,
	onChangeLanguage: undefined,
	contentStructure: undefined,
	onChangeContentStructure: undefined,
	writingStyle: undefined,
	onChangeWritingStyle: undefined,
	writingTone: undefined,
	onChangeWritingTone: undefined,
	customPrompt: undefined,
	onChangeCustomBehavior: undefined,
}