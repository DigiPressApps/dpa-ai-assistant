import {
	DEFAULT_STABILITY_AI_API_HOST,
	DEFAULT_STABILITY_AI_API_VERSION,
} from '@dpaa/ai-assistant/constants'

export const handleImageGeneration = async ( props ) => {
	const {
		engine = '',
		prompt = '',
		openai = undefined,
		dallEModel = '',
		dallEImageSize = '',
		stabilityAIApiKey,
		stableDiffusionModel,
		stableDiffusionCfgScale,
		stableDiffusionWidth,
		stableDiffusionHeight,
		stableDiffusionSteps,
		stableDiffusionStyle
	} = props

	if ( engine === 'dall-e' ) {
		generateImageByOpenAI( {
			prompt: prompt,
			openai: openai,
			n: 1,
			model: dallEModel,
			size: dallEImageSize,
			mode: 'generate',	// または variation
			format: 'b64_json',	// または url
			image: null,
		} )
		.then( base64Image => {
			if ( base64Image && Array.isArray( base64Image ) ) {
				// Base64フォーマットのテキストの配列
				return base64Image
			}

		} )
		.catch( error => {
			console.error( error )
			setErrorMessage( error )

		} )
		.finally( () => {
			setIsLoading( false )
			setIsGenerate( false )
		} )
	} else {
		generateImageByStabilityAI( {
			prompt: prompt,
			apiKey: stabilityAIApiKey,
			apiHost: DEFAULT_STABILITY_AI_API_HOST,
			apiVersion: DEFAULT_STABILITY_AI_API_VERSION,
			type: 'text-to-image',
			model: stableDiffusionModel,
			cfgScale: stableDiffusionCfgScale,
			width: stableDiffusionWidth,
			height: stableDiffusionHeight,
			steps: stableDiffusionSteps,
			style: stableDiffusionStyle,
			samples: 1,

		} ).then( base64Image => {
			if ( base64Image && Array.isArray( base64Image ) ) {
				// Base64フォーマットのテキストの配列
				return base64Image
			}
		} ).catch( error => {
			console.error( error )
			setErrorMessage( error )

		} ).finally( () => {
			setIsLoading( false )
			setIsGenerate( false )
		} )
	}
}