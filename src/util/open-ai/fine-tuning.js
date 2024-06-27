// Create a fine-tuned model
// @see https://platform.openai.com/docs/api-reference/fine-tuning/create
export const createFineTuningJob = async ( props ) => {
	const {
		openai,
		model = null,
		trainingFile = null,
		validationFile = null,
		suffix = null,
		hyperparameters = {
			batch_size: 'auto',
			learning_rate_multiplier: 'auto',
			n_epochs: 'auto',
		}
	} = props

	if ( !openai || !model || !trainingFile ) {
		return
	}

	const fineTune = await openai.fineTuning.jobs.create( {
		training_file: trainingFile,
		model: model,
		suffix: suffix,
		hyperparameters: hyperparameters,
		validation_file: validationFile,
	} );

	// return job object
	// @see https://platform.openai.com/docs/api-reference/fine-tuning/object
	return fineTune
}

// Return fine-tuning jobs
export const getFineTuningJobsList = async ( props ) => {
	const {
		openai = undefined,
		limit = 10,
	} = props

	if ( !openai ) {
		return false
	}

	const list = await openai.fineTuning.jobs.list( { limit: limit } );

	return list
}

// Retrieve the state of a fine-tune
export const retrieveFineTuningJobState = async ( props ) => {
	const {
		openai = undefined,
		jobID = '',
	} = props

	if ( !openai || !jobID ) {
		return false
	}

	const state = await openai.fineTuning.jobs.retrieve( jobID );

	return state
}

// Cancel the job
export const cancelFineTuningJob = async ( props ) => {
	const {
		openai = undefined,
		jobID = '',
	} = props

	if ( !openai || !jobID ) {
		return false
	}

	const result = await openai.fineTuning.jobs.cancel( jobID );

	return result
}

// Return recently fine-tuning job events 
export const getFineTuningJobEvents = async ( props ) => {
	const {
		openai = undefined,
		jobID = '',
		limit = 10,
	} = props

	if ( !openai || !jobID ) {
		return false
	}

	const result = await openai.fineTuning.jobs.listEvents( jobID, { limit: limit });

	return result
}

// Delete fine-tuned model
export const deleteFineTunedModel = async ( props ) => {
	const {
		openai = undefined,
		model = '',
	} = props

	if ( !openai || !model ) {
		return false
	}

	const result = await openai.models.del( model );

	return result
}