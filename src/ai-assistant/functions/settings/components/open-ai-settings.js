/**
 * Internal dependencies
 */
import {
	PanelAdvancedSettings,
	PopoverHelp,
} from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	OPEN_AI_API_KEY_URL,
	OPEN_AI_GPT_MODEL_DOCUMENT_URL,
	OPEN_AI_USAGE_URL,
	OPEN_AI_GPT_MODELS,
	DEFAULT_OPEN_AI_GPT_MODEL,
	DEFAULT_OPEN_AI_MAX_TOKENS,
	DEFAULT_OPEN_AI_TEMPERATURE,
	DEFAULT_OPEN_AI_TOP_P,
} from '@dpaa/ai-assistant/constants'
import { aiIcon } from '@dpaa/ai-assistant/icons'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	CustomSelectControl,
	ExternalLink,
	Flex,
	FlexItem,
	Notice,
	RangeControl,
	__experimentalInputControl as InputControl,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	useDispatch,
} from '@wordpress/data'
import {
	useEffect,
	useState,
} from '@wordpress/element'
import {
	seen as seenIcon,
} from '@wordpress/icons'

export const OpenAISettings = ( { pluginSettings } ) => {

	// 各パラメータの状態管理用
	const [ apiKey, setApiKey ] = useState( pluginSettings?.openAISettings?.apiKey || '' )
	const [ gptModel, setGptModel ] = useState( pluginSettings?.openAISettings?.gptModel || DEFAULT_OPEN_AI_GPT_MODEL )
	const [ maxTokens, setMaxTokens ] = useState( pluginSettings?.openAISettings?.maxTokens || DEFAULT_OPEN_AI_MAX_TOKENS )
	const [ temperature, setTemperature ] = useState( pluginSettings?.openAISettings?.temperature || DEFAULT_OPEN_AI_TEMPERATURE )
	const [ topP, setTopP ] = useState( pluginSettings?.openAISettings?.topP || DEFAULT_OPEN_AI_TOP_P )

	// グローバル設定の更新用(ストア更新前の状態管理用)
	const { setSetting } = useDispatch( STORE_NAME )
	const updateSetting = ( key, value ) => {
		setSetting( { 'openAISettings': key }, value );
	};
	useEffect( () => updateSetting( 'apiKey', apiKey ), [ apiKey ] );
	useEffect( () => updateSetting( 'gptModel', gptModel ), [ gptModel ] );
	useEffect( () => updateSetting( 'maxTokens', parseInt( maxTokens, 10 ) ), [ maxTokens ] );
	useEffect( () => updateSetting( 'temperature', parseFloat( temperature ) ), [ temperature ] );
	useEffect( () => updateSetting( 'topP', parseFloat( topP ) ), [ topP ] );

	const [ showKey, setShowKey ] = useState( false );

	return (
		<>
			<PanelAdvancedSettings
				title={ `${ sprintf( __( '%s Settings', dpaa.i18n ), 'OpenAI' ) } (${ __( 'For text', dpaa.i18n ) })` }
				className='dpaa-components-panel __option-settings'
				titleLeftIcon={ aiIcon }
				initialOpen={ false }
				hasToggle={ false }
			>
				<Flex
					direction='column'
					gap={ 3 }
					className='dpaa-ai-assistant--settings__components-flex __open-ai'
				>
					<FlexItem>
						<Flex direction='row' gap={ 1 } justify='space-between' align='center'>
							<FlexItem style={ { flexBasis: !apiKey ? '100%' : 'calc(100% - 34px)' } }>
								<InputControl
									__next40pxDefaultSize
									size='__unstable-large'
									type={ showKey ? 'text' : 'password' }
									label={ __( 'API Key', dpaa.i18n ) }
									value={ apiKey }
									onChange={ newVal => setApiKey( newVal ) }
									placeholder='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'
									help={ apiKey ? (
										<ExternalLink
											href={ OPEN_AI_USAGE_URL }
											type="link"
											rel="next"
										>
											{ __( 'Check current usage', dpaa.i18n ) }
										</ExternalLink>
									) : (
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
									) }
								/>
							</FlexItem>
							{ apiKey && (
								<FlexItem style={ { flexBasis: '30px' } }>
									<Button
										size='compact'
										icon={ seenIcon }
										label={ sprintf( __( 'Show %s', dpaa.i18n ), __( 'API Key', dpaa.i18n ) ) }
										showTooltip={ true }
										disabled={ !apiKey }
										variant={ showKey ? 'secondary' : 'primary' }
										onClick={ () => setShowKey( !showKey ) }
									/>
								</FlexItem>
							) }
						</Flex>
					</FlexItem>
					<FlexItem>
						<BaseControl
							help={ (
								<>
									<Text color='#757575' size={ 12.5 } isBlock={ true } lineHeight={ 1.44 }>
										{ sprintf( __( 'Select the %s language model to generate text.', dpaa.i18n ), 'OpenAI' ) }
									</Text>
									<ExternalLink
										href={ OPEN_AI_GPT_MODEL_DOCUMENT_URL }
										type="link"
										rel="next"
									>
										{ __( 'Documentation', dpaa.i18n ) }
									</ExternalLink>
								</>
							) }
						>
							<CustomSelectControl
								__next40pxDefaultSize
								__experimentalShowSelectedHint
								size='__unstable-large'
								label={ __( 'Language Model', dpaa.i18n ) }
								value={ OPEN_AI_GPT_MODELS.find( option => option.key === gptModel ) }
								options={ OPEN_AI_GPT_MODELS }
								onChange={ newSelect => setGptModel( newSelect.selectedItem.key ) }
							/>
						</BaseControl>
					</FlexItem>
					<FlexItem>
						<RangeControl
							label={ __( 'Max Tokens', dpaa.i18n ) }
							value={ maxTokens }
							allowReset={ true }
							initialPosition={ DEFAULT_OPEN_AI_MAX_TOKENS }
							resetFallbackValue={ DEFAULT_OPEN_AI_MAX_TOKENS }
							step={ 1 }
							onChange={ newVal => setMaxTokens( newVal ) }
							renderTooltipContent={ value => `${ value } ${ __( 'tokens.', dpaa.i18n ) }` }
							min={ 0 }
							max={ (
								gptModel === 'gpt-3.5-turbo'
								? 4000
								: ( gptModel === 'gpt-3.5-turbo-1106' )
									? 16000
									: gptModel === 'gpt-4'
										? 8000
										: 128000
							) }
						/>
						<PopoverHelp
							buttonIcon='warning'
							buttonText={ __( 'About this parameter', dpaa.i18n ) }
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass='dpaa-ai-assistant--settings__components-popover'
							popoverNoArrow={ false }
							help={ __( "A token in OpenAI's GPT is the smallest unit of text, and generally corresponds to a word or character.<br />However, the specific token size varies depending on the language and model used.<br /><br />The appropriate value for max_tokens depends on your specific use case.<br />The following is an estimate of the tokens consumed.<br /><br />- Short texts (e.g. tweets, answers to short questions): 60-120 tokens<br />- Medium length text (e.g. emails, answers to long questions): 120 to 512 tokens<br />- Long text (e.g. articles, reports): 512 to 2048 tokens<br /><br />However, increasing max_tokens increases API response time and costs.<br />Therefore, we recommend using the minimum number of tokens needed.<br />Also, be careful when generating very long text, as the model may generate unintended content.", dpaa.i18n ) }
						/>
					</FlexItem>
					<FlexItem>
						<RangeControl
							label={ __( 'Temperature', dpaa.i18n ) }
							value={ temperature }
							allowReset={ true }
							initialPosition={ DEFAULT_OPEN_AI_TEMPERATURE }
							resetFallbackValue={ DEFAULT_OPEN_AI_TEMPERATURE }
							onChange={ newVal => setTemperature( newVal ) }
							renderTooltipContent={ value => `${ value }` }
							min={ 0.0 }
							max={ 1.0 }
							step={ 0.01 }
						/>
						<PopoverHelp
							buttonIcon='warning'
							buttonText={ __( 'About this parameter', dpaa.i18n ) }
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass='dpaa-ai-assistant--settings__components-popover'
							popoverNoArrow={ false }
							help={ __( "The temperature parameter is an important parameter to control the diversity of text produced by the model.<br />This parameter takes values between 0 and 1; the closer it is to 0, the more confident the generated text will be.<br />On the other hand, the closer it is to 1, the more varied and unpredictable the generated text will be.<br /><br />For example, at low temperatures, a model tends to always produce similar outputs for the same inputs.<br />On the other hand, higher temperatures are more likely to produce different outputs for the same input.<br /><br />Therefore, the temperature parameter is used to adjust the predictability and variety of the generated text.<br />Appropriate temperature values should be adjusted depending on the specific task or use case.<br /><br />It is generally recommended altering this or 'top_p' but not both.", dpaa.i18n ) }
						/>
					</FlexItem>
					<FlexItem>
						<RangeControl
							label={ __( 'Top_p', dpaa.i18n ) }
							value={ topP }
							allowReset={ true }
							initialPosition={ DEFAULT_OPEN_AI_TOP_P }
							resetFallbackValue={ DEFAULT_OPEN_AI_TOP_P }
							onChange={ newVal => setTopP( newVal ) }
							renderTooltipContent={ value => `${ value }` }
							min={ 0.0 }
							max={ 1.0 }
							step={ 0.01 }
						/>
						<PopoverHelp
							buttonIcon='warning'
							buttonText={ __( 'About this parameter', dpaa.i18n ) }
							buttonSize='small'
							popoverPosition='bottom left'
							popoverVariant='toolbar'
							popoverOffset={ 5 }
							popoverClass='dpaa-ai-assistant--settings__components-popover'
							popoverNoArrow={ false }
							help={ __( "The top_p parameter allows you to adjust the diversity of the generated text.<br />Lower values return more reproducible, undisturbed, average text, but less diversity in answers.<br /><br />On the other hand, the higher the value, the more diverse the AI will answer the same question, making it suitable for writing stories or wanting answers using a variety of approaches.<br /><br />However, the closer the value of top_p is to 1, the more likely the generated text will be corrupted, so experimentation and evaluation is required to find the appropriate value for your requirements.<br /><br />It is generally recommended altering this or 'temperature' but not both.", dpaa.i18n ) }
						/>
					</FlexItem>
				</Flex>
			</PanelAdvancedSettings>
		</>
	)
}

export default OpenAISettings