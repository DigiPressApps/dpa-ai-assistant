/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'

export const getAudioDataFromURL = async ( props ) => {
	const {
		audioUrl = null,
	} = props

	if ( !audioUrl || typeof audioUrl !== 'string' ) {
		return null
	}

	// RESTエンドポイント
	const apiUrl = '/dpaa/v1/get_audio_data';

	const requestData = {
		audioUrl: audioUrl,
	}

	try {
		// カスタムエンドポイント(/wp-json/dpaa/v1/get_audio_data)にPOST
		const response = await apiFetch( {
			path: apiUrl,	// ショートハンドの場合
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': dpaa.apiNonce,
			},
			data: requestData,
		} );
		return response

	} catch ( error ) {
		return error
	}
}