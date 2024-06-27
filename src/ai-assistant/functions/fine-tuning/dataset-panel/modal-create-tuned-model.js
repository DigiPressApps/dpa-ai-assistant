
/**
 * Internal dependencies
 */
import {
	createFineTuningJob,
} from '@dpaa/util'
import { TipMessage } from '@dpaa/components'
import {
	OPEN_AI_USAGE_URL,
	OPEN_AI_MODELS_FOR_FINE_TUNING,
} from '@dpaa/ai-assistant/constants'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
	Button,
	CustomSelectControl,
	ExternalLink,
	Icon,
	Flex,
	FlexItem,
	Modal,
	Notice,
	ToggleControl,
	__experimentalInputControl as InputControl,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	useEffect,
	useState,
} from '@wordpress/element'
import {
	arrowRight as arrowRightIcon,
	check as checkIcon,
	create as createIcon,
	cancelCircleFilled as cancelCircleFilledIcon,
} from '@wordpress/icons'

export const ModalCreateTunedModel = props => {
	const {
		openai,
		fileName,
		fileID,
		jobs,
		onRequestClose,
	} = props

	if ( !openai || !fileID || !onRequestClose ) {
		return null
	}

	const [ tipMessage, setTipMessage ] = useState( { message: '' } )
	const [ isLoading, setIsLoading ] = useState( false )
	const [ baseModel, setbaseModel ] = useState( 'gpt-3.5-turbo-0125' )
	const [ suffix, setSuffix ] = useState( '' )
	const [ useHyperparameters, setUseHyperparameters ] = useState( false )
	const [ batchSize, setBatchSize ] = useState( null )
	const [ nEpochs, setNEpochs ] = useState( null )
	const [ learningRateMultiplier, setLearningRateMultiplier ] = useState( null )

	// 選択可能なGPTモデルの状態管理用
	const selectableModels = OPEN_AI_MODELS_FOR_FINE_TUNING

	useEffect( () => {
		if ( Array.isArray( jobs ) && jobs.length > 0 ) {
			jobs.forEach( ( job, index ) => {
				if ( !selectableModels.some( model => model.key === job?.id ) && !job?.error?.message && job?.fine_tuned_model ) {
					selectableModels.push({
						name: job?.fine_tuned_model,
						key: job?.id,
						__experimentalHint: __( 'Tuned', dpaa.i18n ),
					} );
				}
			 } )
		}
	}, [ jobs ] )

	// 新規Fine-tuningモデルの作成
	const callbackCreateFineTunedModel =  async () => {
		let response = false
		try {
			setIsLoading( true )
			setTipMessage( { message: __( 'Starting...', dpaa.i18n ) } )

			/**
			 * createFineTuningJob() パラメータ
			 *  openai,
				model = null,
				trainingFile = null,
				validationFile = null,
				suffix = null,
				hyperparameters = {
					batch_size: 'auto',
					learning_rate_multiplier: 'auto',
					n_epochs: 'auto',
				}
			*/
			response = await createFineTuningJob( {
				openai: openai,
				model: baseModel,
				trainingFile: fileID,
				suffix: suffix || null,
				hyperparameters: useHyperparameters
					? {
						batch_size: batchSize || 'auto',
						learning_rate_multiplier: learningRateMultiplier || 'auto',
						n_epochs: nEpochs || 'auto'
					}
					: {},
			} )

		} catch ( error ) {
			console.error( 'Failed to start a new tuned model.', error )
			alert( error )
		} finally {
			setIsLoading( false )
			setTipMessage( { message: '' } )
			if ( !response?.error?.error ) {
				setTipMessage( { message: __( 'Started the creation process! You can check the training status of your custom model by updating the status on the "Trained Models" panel.', dpaa.i18n ) } )
				setTimeout( () => {
					setTipMessage( { message: '' } )
				}, 5000 );
			} else {
				console.error( 'Failed to start a tuned model with error.', error )
				alert( response?.error?.message )
			}
		}
	}
	
	return (
		<Modal
			title={ `${ __( 'Create a new tuned model', dpaa.i18n ) } (Fine tuning)` }
			size='small'
			closeButtonLabel={ __( 'Close' ) }
			onRequestClose={ onRequestClose }
			className='dpaa-modal dpaa-modal--create-tuned-model'
			icon={ <Icon icon={ createIcon } /> }
			shouldCloseOnClickOutside={ true }
			style={ {
				width: '100%',
				maxWidth: '580px'
			} }
		>
			<Flex
				direction='column'
				gap={ 4 }
				justify='flex-start'
			>
				<FlexItem>
					<Notice
						isDismissible={ false }
					>
						<Text display="block" lineHeight={ 1.5 }>
							{ __( 'Create your own tuned model by the base model with selected dataset. Once you tuned a model, you’ll be billed only for the tokens you use in requests to that model.', dpaa.i18n ) }
						</Text>
						<Flex direction='row' gap={ 4 } justify='flex-start'>
							<FlexItem>
								<ExternalLink href='https://openai.com/pricing#fine-tuning-models'>
									{ __( 'Check OpenAI pricing', dpaa.i18n ) }
								</ExternalLink>
							</FlexItem>
							<FlexItem>
								<ExternalLink
									href={ OPEN_AI_USAGE_URL }
									type="link"
									rel="next"
								>
									{ __( 'Check current usage', dpaa.i18n ) }
								</ExternalLink>
							</FlexItem>
						</Flex>
					</Notice>
				</FlexItem>
				<FlexItem>
					<Text display="block" lineHeight={ 1.5 } highlightWords={ [ fileName ] }>
						{ `${ __( 'Training file (dataset)', dpaa.i18n ) }: ${ fileName }` }
					</Text>
				</FlexItem>
				<FlexItem>
					<BaseControl
						help={
							<>
								<Text display="block" size='12.5px' color='rgb(117, 117, 117)' lineHeight={ 1.5 }>
									{ __( 'The base model for your custom tuned model. You can select one of the supported models.', dpaa.i18n ) }
								</Text>
								<ExternalLink href='https://platform.openai.com/docs/guides/fine-tuning/what-models-can-be-fine-tuned'>
									{ __( 'Show details', dpaa.i18n ) }
								</ExternalLink>
							</>
						}

					>
						<CustomSelectControl
							__next40pxDefaultSize
							__experimentalShowSelectedHint
							label={ __( 'Base model', dpaa.i18n ) }
							size='__unstable-large'
							value={ selectableModels.find( option => option.key === baseModel ) }
							options={ selectableModels }
							onChange={ newSelect => setbaseModel( newSelect.selectedItem.key ) }
							disabled={ isLoading }
						/>
					</BaseControl>
				</FlexItem>
				<FlexItem>
					<InputControl
						__next40pxDefaultSize
						className='dpaa-input--use-pattern'
						size='__unstable-large'
						type='text'
						label={ `${ __( 'Suffix', dpaa.i18n ) } (${ __( 'optional', dpaa.i18n ) })` }
						help={
							<>
								<Text display="block" size='12.5px' color='rgb(117, 117, 117)' lineHeight={ 1.5 }>
									{ `${ __( 'A string of up to 18 characters that will be added to your tuned model name.', dpaa.i18n ) }` }
								</Text>
								<Text display="block" size='12.5px' color='rgb(117, 117, 117)' lineHeight={ 1.5 }>
									{ `${ __( 'Preview:', dpaa.i18n) } "ft:${ baseModel }:your-org:${ suffix || 'custom-model-name' }:abcdefgh"` }
								</Text>
								<ExternalLink href='https://platform.openai.com/docs/api-reference/fine-tuning/create#fine-tuning-create-suffix'>{ __( 'Show details', dpaa.i18n ) }</ExternalLink>
							</>
						}
						value={ suffix }
						pattern="^[a-zA-Z0-9\-\._]+$"
						onChange={ newVal => setSuffix( newVal.slice(0, 18) ) }
						placeholder='custom-model-name'
						disabled={ isLoading }
					/>
				</FlexItem>
				<FlexItem>
					<ToggleControl
						__nextHasNoMarginBottom
						checked={ useHyperparameters }
						label={ `${ __( 'More parameters', dpaa.i18n ) } (${ __( 'optional', dpaa.i18n ) })` }
						onChange={ () => setUseHyperparameters( !useHyperparameters ) }
					/>
				</FlexItem>
				{ useHyperparameters && (
					<FlexItem>
						<Flex
							direction='column'
							gap={ 3 }
							justify='flex-start'
							wrap={ true }
						>
							<FlexItem>
								<InputControl
									__next40pxDefaultSize
									__unstableInputWidth={ 100 }
									className='dpaa-create-fine-tune-model--more-params--input'
									size='__unstable-large'
									label={ __( 'Batch Size', dpaa.i18n ) }
									labelPosition='side'
									help={ __( 'Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.', dpaa.i18n ) }
									value={ batchSize }
									min={ 1 }
									max={ 10 }
									onChange={ newVal => setBatchSize( newVal ) }
									type='number'
									placeholder={ 4 }
									disabled={ isLoading }
								/>
							</FlexItem>
							<FlexItem>
								<InputControl
									__next40pxDefaultSize
									__unstableInputWidth={ 100 }
									className='dpaa-create-fine-tune-model--more-params--input'
									size='__unstable-large'
									label={ __( 'Number of Epochs', dpaa.i18n ) }
									labelPosition='side'
									help={ __( 'The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.', dpaa.i18n ) }
									value={ nEpochs }
									min={ 1 }
									max={ 10 }
									onChange={ newVal => setNEpochs( newVal ) }
									type='number'
									placeholder={ 4 }
									disabled={ isLoading }
								/>
							</FlexItem>
							<FlexItem>
								<InputControl
									__next40pxDefaultSize
									__unstableInputWidth={ 100 }
									className='dpaa-create-fine-tune-model--more-params--input'
									size='__unstable-large'
									label={ __( 'Learning Rate Multiplier', dpaa.i18n ) }
									labelPosition='side'
									help={ __( 'Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.', dpaa.i18n ) }
									value={ learningRateMultiplier }
									min={ 0.01 }
									max={ 0.4 }
									step={ 0.01 }
									onChange={ newVal => setLearningRateMultiplier( newVal ) }
									type='number'
									placeholder={ 0.1 }
									disabled={ isLoading }
								/>
							</FlexItem>
						</Flex>
					</FlexItem>
				) }
				<FlexItem>
					<Flex
						direction='row'
						justify='flex-end'
						gap={ 3 }
					>
						<FlexItem>
							<Button
								size='default'
								showTooltip
								label={ __( 'Cancel', dpaa.i18n ) }
								icon={ cancelCircleFilledIcon }
								iconSize={ 18 }
								variant='secondary'
								isDestructive={ true }
								disabled={ isLoading }
								onClick={ onRequestClose }
							>
								{ __( 'Cancel', dpaa.i18n ) }
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								size='default'
								showTooltip
								label={ __( 'Start', dpaa.i18n ) }
								icon={ arrowRightIcon }
								iconSize={ 24 }
								variant='primary'
								isDestructive={ false }
								disabled={ isLoading }
								onClick={ () => callbackCreateFineTunedModel() }
							>
								{ __( 'Start', dpaa.i18n ) }
							</Button>
						</FlexItem>
					</Flex>
				</FlexItem>
			</Flex>
			<TipMessage
				message={ tipMessage?.message || '' }
				actions={ tipMessage?.actions || [] }
				explicitDismiss={ tipMessage?.explicitDismiss || false }
				isLoading={ isLoading }
			/>
		</Modal>
	)
}