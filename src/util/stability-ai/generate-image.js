/**
 * internal dependencies
 */
import {
	DEFAULT_STABILITY_AI_API_HOST,
	DEFAULT_STABILITY_AI_API_VERSION,
	DEFAULT_STABILITY_AI_MODEL,
	DEFAULT_STABILITY_AI_TYPE,
} from '@dpaa/ai-assistant/constants'
import { textToImage } from './v1'

export const generateImageByStabilityAI = async ( props ) => {
	const {
		prompt = null,
		weight = 0.5,
		apiHost = DEFAULT_STABILITY_AI_API_HOST,
		apiVersion = DEFAULT_STABILITY_AI_API_VERSION,
		apiKey = null,
		model = DEFAULT_STABILITY_AI_MODEL,
		type = DEFAULT_STABILITY_AI_TYPE,
		inputBase64Image = null,
		imageMode = 'IMAGE_STRENGTH',
		imageStrength = 0.35,
		cfgScale = 0.8,
		width = 512,
		height = 512,
		dimensions = '1024x1024',	// SDXL 1.0, 
		steps = 50,
		samples = 1,
		style = 'none',
		setErrorMessage = undefined,
	} = props

	if ( !prompt || !apiKey || !apiHost || !model ) {
		return null;
	}

	if ( model === 'stable-diffusion-v1-6' || model === 'stable-diffusion-xl-1024-v1-0' ) {
		return textToImage( props );
	} else {

	}
}