/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	UpgradeModal
} from '@dpaa/components'
import {
	OPEN_AI_GPT_MODELS_URL,
	OPEN_AI_PRICING_URL,
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
	Button,
	SelectControl,
	TextareaControl,
	__experimentalDivider as Divider,
	__experimentalText as Text,
	__experimentalVStack as VStack,
} from '@wordpress/components'
import {
	memo,
	useEffect,
	useState,
} from '@wordpress/element'
import { cog as cogIcon } from '@wordpress/icons'

export const OptionsArea = memo( ( props ) => {
	const {
		label = __( 'Options', dpaa.i18n ),
		userCanManageSettings = false,
		fineTunedModels = undefined,
		onChangeEngine = undefined,
		model = undefined,
		onChangeModel = undefined,
		language = undefined,
		onChangeLanguage = undefined,
		contentStructure = undefined,
		onChangeContentStructure = undefined,
		writingStyle = undefined,
		onChangeWritingStyle = undefined,
		writingTone = undefined,
		onChangeWritingTone = undefined,
		customPrompt = undefined,
		onChangeCustomBehavior = undefined,
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
			<BaseControl
				__nextHasNoMarginBottom
				className='dpaa--settings__wrapper'
			>
				<PanelAdvancedSettings
					title={ label }
					className='dpaa-components-panel __option-settings'
					titleLeftIcon={ cogIcon }
					initialOpen={ false }
					hasToggle={ false }
				>
					<VStack
						spacing={ 4 }
						className='dpaa-ai-assistant--settings__components-flex __open-ai'
					>
						{ onChangeEngine && (
							<VStack spacing={ 2 }>
								<SelectControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'AI Text Generator', dpaa.i18n ) }
									value='gpt'
									options={ TEXT_GENERATION_ENGINES }
									onChange={ newVal => setIsUpgradeModal( true ) }
								/>
								<Divider margin={ 3 } style={ { opacity: 0.5 } } />
							</VStack>
						) }
						{ ( userCanManageSettings && onChangeModel ) && (
							<VStack spacing={ 2 }>
								<CustomSelectControl
									__next40pxDefaultSize
									size='__unstable-large'
									label={ <>
										{__( 'Model', dpaa.i18n ) }
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
									value={ selectableModels.find( option => option.key === model ) }
									options={ selectableModels }
									onChange={ onChangeModel }
								/>
								<Text size={ 12 } style={ { color: '#666' } }>
									{ selectableModels.find( option => option.key === model )?.__experimentalHint }
								</Text>
							</VStack>
						) }
						{ onChangeLanguage && (
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Select Language', dpaa.i18n ) }
								value={ language }
								options={ CHAT_LANGUAGES }
								onChange={ onChangeLanguage }
							/>
						) }
						{ onChangeContentStructure && (
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Content Structure', dpaa.i18n ) }
								value={ contentStructure }
								options={ CHAT_CONTENT_STRUCTURES }
								onChange={ onChangeContentStructure }
							/>
						) }
						{ onChangeWritingStyle && (
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'AI Writing Style', dpaa.i18n ) }
								value={ writingStyle }
								options={ CHAT_WRITING_STYLES }
								onChange={ onChangeWritingStyle }
							/>
						) }
						{ onChangeWritingTone && (
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'AI Writing Tone', dpaa.i18n ) }
								value={ writingTone }
								options={ CHAT_WRITING_TONES }
								onChange={ onChangeWritingTone }
							/>
						) }
						{ onChangeCustomBehavior && (
							<TextareaControl
								__nextHasNoMarginBottom
								label={ __( 'Custom Prompt', dpaa.i18n ) }
								value={ customPrompt }
								onChange={ onChangeCustomBehavior }
								rows={ 3 }
								placeholder={ __( 'You are batman as a dark hero. Always respond with cool words.', dpaa.i18n ) }
							/>
						) }
					</VStack>
				</PanelAdvancedSettings>
			</BaseControl>
			{ isUpgradeModal && <UpgradeModal onRequestClose={ () => setIsUpgradeModal( false ) } /> }
		</>
	)
} )