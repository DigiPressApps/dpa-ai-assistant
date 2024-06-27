/**
 * Internal dependencies
 */
import './editor.scss'
import {
	ConditionalWrapper,
	TipMessage,
} from '@dpaa/components'
import {
	// ファイル操作
	getUploadedFilesOnOpenAI,
	// Fine Tuning
	getFineTuningJobsList,
} from '@dpaa/util'
import { STORE_NAME } from '@dpaa/datastore/constants'
import {
	OPEN_AI_API_KEY_URL,
} from '@dpaa/ai-assistant/constants'
import { aiRobotIcon } from '@dpaa/ai-assistant/icons'
import { JobListPanel as GPTJobListPanel } from './job-list-panel'
import { DatasetPanel as GPTDatasetPanel } from './dataset-panel'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	ExternalLink,
	Flex,
	FlexItem,
	Icon,
	Notice,
	TabPanel,
	SelectControl,
	Spinner,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	useDispatch,
} from '@wordpress/data'
import {
	useEffect,
	useState,
} from '@wordpress/element'

export const FineTuningPanel = ( props ) => {
	const {
		pluginSettings,
		openai,
		userCanManageSettings,
		isInEditor,
	} = props

	// API設定
	const apiSettings = pluginSettings?.openAISettings

	// Open API設定用
	const [ apiKey, setApiKey ] = useState( null )
	// 
	const [ fineTunedModels, setFineTunedModels ] = useState( null )

	// エラーメッセージ用
	const [ errorMessage, setErrorMessage ] = useState( '' )
	// チップメッセージ表示用
	const [ tipMessage, setTipMessage ] = useState( { message: '' } )
	// 読み込み状態管理用
	const [ isLoading, setIsLoading ] = useState( false )

	// アップロードファイル用
	const [ uploadedFiles, setUploadedFiles ] = useState( null )
	// Fine Tuning関連
	const [ jobs, setJobs ] = useState( null )
	// 学習モデルパネル
	const [ modelListPanel, setModelListPanel ] = useState( <></> )
	// アップロードファイル管理パネル
	const [ filesPanel, setFilesPanel ] = useState( <></> )
	// 対象学習モデルの状態管理用
	const [ targetAI, setTargetAI ] = useState( 'openai' )

	const [ jobsUpTo, setJobsUpTo ] = useState( 30 )

	// API 設定の取得
	useEffect( () => {
		if ( apiSettings ) {
			setApiKey( apiSettings?.apiKey )
			setFineTunedModels( apiSettings?.fineTunedModels || null )
		}
	}, [ apiSettings ] )

	// プラグインオプション(Fine-tuningモデル)の更新用
	const { setSetting } = useDispatch( STORE_NAME )
	const updateSetting = ( key, value ) => {
		if ( value && Array.isArray( value ) ) {
			setSetting( { 'openAISettings': key }, value );
		}
	};
	useEffect( () => updateSetting( 'fineTunedModels', jobs ), [ jobs ] );

	const targetSelecter = (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			size='__unstable-large'
			value={ targetAI }
			options={ [
				{
					label: 'OpenAI',
					value: 'openai'
				},
			] }
			onChange={ newVal => setTargetAI( newVal ) }
			disabled={ !apiKey }
		/>
	)

	// openai インスタンス生成時
	useEffect( () => {
		if ( openai ) {
			// アップロードファイルの取得
			getUploadedFilesOnOpenAI( { openai } )
			.then( res => {
				if ( Array.isArray( res ) && res.length > 0 ) {
					setUploadedFiles( res )
				}
			} )
			.catch( error => {
				console.error( 'Failed to get uploaded files.', error )
				setErrorMessage( error )
			} )

			// job一覧の取得
			getFineTuningJobsList( { openai: openai, limit: jobsUpTo } )
			.then( res => {
				if ( res?.response?.ok ) {
					setJobs( res.data )
				}
			} )
			.catch( error => {
				console.error( 'Failed to get Fine tuned jobs list.', error )
				setErrorMessage( error )
			} )
		}
	}, [] )

	useEffect( () => {
		if ( ( apiKey && !openai ) || ( openai && ( !jobs || !uploadedFiles ) ) ) {
			// ローディング表示
			setModelListPanel( <Spinner style={ { width: '30px', height: '30px' } } /> )
		}
		else if ( !apiKey && !openai ) {
			// APIキーがない場合
			setModelListPanel(
				<>
					<Text
						display='block'
						size='13px'
						weight='normal'
					>
						{ __( 'There is no trained model. You can get an API key for OpenAI and create training data from your dataset to create custom models.', dpaa.i18n ) }
					</Text>
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
				</>
			)
		}
		else if ( jobs && uploadedFiles ) {
			// モデルとデータセットのパネルを取得
			setModelListPanel(
				openai && targetAI === 'openai' && (
					<GPTJobListPanel
						openai={ openai }
						jobs={ jobs }
						jobsUpTo={ jobsUpTo }
						uploadedFiles={ uploadedFiles }
						targetSelecter={ targetSelecter }
						isLoading={ isLoading }
						setTipMessage={ setTipMessage }
						setIsLoading={ setIsLoading }
					/>
				)
			)

			if ( uploadedFiles ) {
				setFilesPanel(
					openai && targetAI === 'openai' && (
						<GPTDatasetPanel
							openai={ openai }
							uploadedFiles={ uploadedFiles }
							targetSelecter={ targetSelecter }
							isLoading={ isLoading }
							setTipMessage={ setTipMessage }
							setIsLoading={ setIsLoading }
						/>
					)
				)
			}
		}
	}, [ jobs, uploadedFiles, apiKey, openai ] )

	// タブの状態管理用
	const [ activeTabName, setActiveTabName ] = useState( 'models' )
	const onSelectTab = tabName => {
		setActiveTabName( tabName )
	}

	// タブパネル
	const tabs = [
		{
			name: 'models',
			titleName: __( 'Models', dpaa.i18n ),
			title: <><Icon icon={ aiRobotIcon } className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Trained Models', dpaa.i18n ) }</>,
			className: 'dpaa-tab-panel__tab tab--models',
		},
		{
			name: 'dataset',
			titleName: __( 'Dataset', dpaa.i18n ),
			title: <><Icon icon='database' className='dpaa-tab-panel__tab-icon' size='24' />{ __( 'Dataset', dpaa.i18n ) }</>,
			className: 'dpaa-tab-panel__tab tab--dataset',
		},
	]

	return (
		<>
			<TabPanel
				className='dpaa-fine-tuning__tab-container dpaa--inner-tab-container dpaa-box-shadow-element'
				orientation='horizontal'
				initialTabName='models'
				onSelect={ onSelectTab }
				tabs={ tabs }>
				{
					( tab ) =>
					<>
						{ tab.name === 'models' && modelListPanel }
						{ tab.name === 'dataset' && filesPanel }
					</>
				}
			</TabPanel>
			{ errorMessage && (
				<div className='dpaa__visible-error-message'>{ errorMessage.toString() }</div>
			) }
			<TipMessage
				message={ tipMessage?.message || '' }
				actions={ tipMessage?.actions || [] }
				explicitDismiss={ tipMessage?.explicitDismiss || false }
				isLoading={ isLoading }
			/>
		</>
	)
}