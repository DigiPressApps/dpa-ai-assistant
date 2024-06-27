/**
 * internal dependencies
 */
import {
	DEFAULT_STABILITY_AI_API_HOST,
	DEFAULT_STABILITY_AI_API_VERSION,
} from '@dpaa/ai-assistant/constants'

export const getAvailableStabilityAIEngines = async ( props ) => {
	const {
		apiKey = undefined,
		apiHost = DEFAULT_STABILITY_AI_API_HOST,
		apiVersion = DEFAULT_STABILITY_AI_API_VERSION,
		setErrorMessage = undefined,
	} = props

	if ( !apiKey ) {
		return;
	}

	// ヘッダー
	const headers = {
		Authorization: `Bearer ${ apiKey }`,
	}

	// リクエスト
	const response = await fetch(
		`${ apiHost }/${ apiVersion }/engines/list`,
		{
			method: 'GET',
			headers: headers,
		}
	)

	if ( !response.ok ) {
		const msgText = `Non-200 response: ${ await response.text() }`
		if ( setErrorMessage ) {
			setErrorMessage( msgText )
		}
		throw new Error( msgText )
	}

	const responseJSON = await response.json();

	return responseJSON
}