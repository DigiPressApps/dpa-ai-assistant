/**
 * Internal dependencies
 */
import { DpIcon } from '@dpaa/icons'
import { AIAssistantButton } from '../ai-assistant-button'
import { aiIcon } from '../icons'
import { UpgradeModal } from '@dpaa/components'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	DEFAULT_OPEN_AI_MAX_TOKENS,
} from '../constants'
import { languageMap } from '../functions/language-map'
import { ModalSuggest } from './modal-suggest'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	Flex,
	FlexItem,
	__experimentalSpacer as Spacer,
} from '@wordpress/components'
import { useSelect } from '@wordpress/data';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import {
	useEffect,
	useMemo,
	useState
} from '@wordpress/element'
import {
	title as titleIcon,
	postFeaturedImage as postFeaturedImageIcon,
	postContent as postContentIcon,
	tag as tagIcon,
} from '@wordpress/icons'

/** 
 * External dependencies
 */
import OpenAI from "openai";

// 「投稿」サイドバーに追加するカスタムパネル
export const CustomInspectorControlPanel = () => {

	const [ isOpenSuggestTitlesModal, setIsOpenSuggestTitlesModal ] = useState( false )
	const [ isOpenSuggestExcerptsModal, setIsOpenSuggestExcerptsModal ] = useState( false )

	const [ openAIApiKey, setOpenAIApiKey ] = useState( null )
	const [ maxTokens, setMaxTokens ] = useState( DEFAULT_OPEN_AI_MAX_TOKENS )
	const [ propmtLanguage, setPropmtLanguage ] = useState( '' )

	const [ generalSettings, setGeneralSettings ] = useState( null )
	const [ openAISettings, setOpenAISettings ] = useState( null )

	// ストアから全設定を取得
	const pluginSettings = useSelect( ( select ) => {
		return select( STORE_NAME ).getSettings()
	}, [] );

	// オプションの取得
	useEffect( () => {
		if ( typeof pluginSettings === 'object' && Object.keys( pluginSettings ).length > 0 ) {
			setGeneralSettings( pluginSettings?.generalSettings )
			setOpenAISettings( pluginSettings?.openAISettings )

			setOpenAIApiKey( pluginSettings?.openAISettings?.apiKey )
			setMaxTokens( pluginSettings?.openAISettings?.gptModelmaxTokens )

			const actualLanguage = languageMap[ pluginSettings?.textGenerationSettings?.language ]
			setPropmtLanguage( ! actualLanguage 
				? 'Respond in the same language you recieved. '
				: `Respond in ${ actualLanguage }, regardless of the language used by the user. `
			)
		}
	}, [ pluginSettings ] )

	// API インスタンス生成
	const openai = useMemo( () => {
		if ( openAIApiKey ) {
			return new OpenAI( {
				apiKey: openAIApiKey,
				dangerouslyAllowBrowser: true
			} );
		} else {
			return null;
		}
	}, [ openAIApiKey ] );

	const [ isUpgradeModal, setIsUpgradeModal ] = useState( false )

	return (
		<>
			<PluginDocumentSettingPanel
				name='dpaa-register-custom-inspector-control-panel'
				className='dpaa-register-custom-inspector-control-panel'
				title={
					<Flex direction='row' gap={ 2 } justify='flex-start' align='center'>
						<FlexItem>
							<DpIcon />
						</FlexItem>
						<FlexItem>
							{ __( 'AI Assistant', dpaa.i18n ) }
						</FlexItem>
					</Flex>
				}
			>
				<BaseControl>
					<Spacer marginBottom={ 3 }>
						<Flex
							direction='column'
							gap={ 2 }
							justify='space-between'
							className='dpaa-components-flex'
						>
							<FlexItem
								style={ {
									flex: 1,
								} }
							>
								<AIAssistantButton
									text={ __( 'Open Assistant', dpaa.i18n ) }
									size='compact'
									icon={ aiIcon }
									iconSize={ 20 }
									variant='primary'
									className='__in-setting-panel'
									isInEditor={ true }
								/>
							</FlexItem>
						</Flex>
					</Spacer>
				</BaseControl>
				<BaseControl
					label={ __( 'Suggest:', dpaa.i18n ) }
				>
					<Flex
						direction='row'
						gap={ 2 }
						justify='flex-start'
						className='dpaa-components-flex __suggest-wrapper'
						wrap={ true }
					>
						<FlexItem className='__suggest-item'>
							<Button
								onClick={ () => setIsOpenSuggestTitlesModal( true ) }
								className='dpaa-button--flex-item dpaa-button--suggest-titles'
								icon={ titleIcon }
								iconSize={ 20 }
								iconPosition='left'
								variant='primary'
								size='compact'
								disabled={ !openai }
							>
								{ __( 'Titles', dpaa.i18n ) }
							</Button>
						</FlexItem>
						<FlexItem className='__suggest-item'>
							<Button
								onClick={ () => setIsOpenSuggestExcerptsModal( true ) }
								className='dpaa-button--flex-item dpaa-button--suggest-excerpts'
								icon={ postContentIcon }
								iconSize={ 20 }
								iconPosition='left'
								variant='primary'
								size='compact'
								disabled={ !openai }
							>
								{ __( 'Excerpts', dpaa.i18n ) }
							</Button>
						</FlexItem>
						<FlexItem className='__suggest-item'>
							<Button
								onClick={ () => setIsUpgradeModal( true ) }
								className='dpaa-button--flex-item dpaa-button--suggest-tags'
								icon={ tagIcon }
								iconSize={ 20 }
								iconPosition='left'
								variant='primary'
								size='compact'
								disabled={ !openai }
							>
								{ __( 'Tags', dpaa.i18n ) }
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								onClick={ () => setIsUpgradeModal( true ) }
								className='dpaa-button--flex-item dpaa-button--eyecatch'
								icon={ postFeaturedImageIcon }
								iconSize={ 20 }
								iconPosition='left'
								variant='primary'
								size='compact'
								disabled={ !openai }
								style={ {
									width: '100%',
								} }
							>
								{ __( 'Featured image' ) }
							</Button>
						</FlexItem>
					</Flex>
				</BaseControl>
			</PluginDocumentSettingPanel>
			{ ( isOpenSuggestTitlesModal && openai ) && (
				<ModalSuggest
					type='title'
					openai={ openai }
					gptModel={ openAISettings?.gptModel }
					maxTokens={ maxTokens }
					propmtLanguage={ propmtLanguage }
					onRequestClose= { () => setIsOpenSuggestTitlesModal( false ) }
				/>
			) }
			{ ( isOpenSuggestExcerptsModal && openai ) && (
				<ModalSuggest
					type='excerpt'
					openai={ openai }
					gptModel={ openAISettings?.gptModel }
					maxTokens={ maxTokens }
					propmtLanguage={ propmtLanguage }
					onRequestClose= { () => setIsOpenSuggestExcerptsModal( false ) }
				/>
			) }
			{ isUpgradeModal && <UpgradeModal onRequestClose={ () => setIsUpgradeModal( false ) } /> }
		</>
	);
}