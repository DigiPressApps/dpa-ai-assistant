/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'

export const getSysinfo = async () => {

	// RESTエンドポイント
	const apiUrl = '/dpaa/v1/get_sysinfo';

	try {
		// カスタムエンドポイント(/wp-json/dpaa/v1/get_sysinfo)からGET
		const response = await apiFetch( {
			path: apiUrl,	// ショートハンドの場合
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': dpaa.apiNonce,
			},
		} );
		return response

	} catch ( error ) {
		return error
	}
}