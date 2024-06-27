/**
 * Internal dependencies
 */
import { OptionsArea } from './options-area'
import {
	languageMapForTranscription
} from '@dpaa/ai-assistant/functions/language-map'
import {
	OPEN_AI_API_KEY_URL
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Button,
	ExternalLink,
	Flex,
	FlexItem,
	Notice,
	TextareaControl,
	__experimentalInputControl as InputControl,
} from '@wordpress/components'
import {
	memo,
	useState,
	useEffect,
} from '@wordpress/element'

export const PromptArea = memo( ( props ) => {
	const {
		isLoading,
		openai,
		url,
		language,
		temperature,
		prompt,
		onChangeUrl,
		onChangePrompt,
		onClickClear,
		onClickTranscript,
		onChangeLanguage,
		onChangeTemperature,
		onClickOpenMediaLibrary,
	} = props

	// 変換言語
	const [ transcriptionLanguage, setTranscriptionLanguage ] = useState( __( 'input language', dpaa.i18n ) )
	useEffect( () => {
		if ( language ) {
			setTranscriptionLanguage( languageMapForTranscription[ language ] )
		}
	}, [ language ])

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
				<Flex
					direction='column'
					gap={ 2 }
				>
					<FlexItem>
						<Flex
							gap={ 2 }
							direction='row'
							justify='flex-end'
							align='center'
						>
							<FlexItem style={ { flexBasis: 'calc( 100% - 40px )' } }>
								<InputControl
									__next40pxDefaultSize
									size='__unstable-large'
									type='url'
									label={ __( 'Audio URL', dpaa.i18n ) }
									help={ sprintf( __( 'Transcribe the audio file in %s.', dpaa.i18n ), __( transcriptionLanguage, dpaa.i18n ) ) }
									value={ url }
									onChange={ onChangeUrl }
									disabled={ isLoading }
									placeholder='https://path-to-your-audio.com/speech.mp3'
								/>
							</FlexItem>
							<FlexItem style={ { flexBasis: '32px' } }>
								<Button
									size='compact'
									showTooltip
									label={ __( 'Open media library', dpaa.i18n ) }
									className='dpaa-ai-assistant--generator__button'
									icon='insert'
									iconSize={ 20 }
									variant='primary'
									isBusy={ isLoading }
									disabled={ !openai }
									onClick={ onClickOpenMediaLibrary }
								/>
							</FlexItem>
						</Flex>
					</FlexItem>
					<FlexItem>
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
									label={ __( 'Speech to Text', dpaa.i18n ) }
									icon='welcome-write-blog'
									iconSize={ 20 }
									variant='primary'
									isDestructive={ false }
									isBusy={ isLoading }
									disabled={ isLoading || !url || !openai }
									onClick={ onClickTranscript }
								/>
							</FlexItem>
						</Flex>
					</FlexItem>
					<FlexItem>
						<TextareaControl
							__next40pxDefaultSize
							label={ `${ __( 'System Prompt', dpaa.i18n ) } (${ __( 'optional', dpaa.i18n ) })` }
							help={ __( "An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.", dpaa.i18n ) }
							className='dpaa-ai-assistant--generator__prompt__textarea'
							value={ prompt }
							onChange={ onChangePrompt }
							rows={ 2 }
							placeholder={ __( 'Write in a deep, heavy, Southern accent.', dpaa.i18n ) }
							disabled={ isLoading || !openai }
						/>
					</FlexItem>
				</Flex>
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
				)
				: (
					<OptionsArea
						language={ language }
						temperature={ temperature }
						onChangeLanguage={ onChangeLanguage }
						onChangeTemperature={ onChangeTemperature }
					/>
				) }
			</FlexItem>
		</Flex>
	)
} )