/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'

export const createPost = async props => {
	const {
		type = 'post',
		title = '',
		content = '',
		excerpt = '',
		categories = [],
		tags = [],
		author = null,
		status = 'draft',
		date = null,
	} = props

	// RESTエンドポイント
	const apiUrl = '/dpaa/v1/create_post';

	const requestData = {
		type,
		title,
		content,
		excerpt,
		categories,
		tags,
		author,
		status,
		date,
	}

	try {
		// カスタムエンドポイント(/wp-json/dpaa/v1/create_post)にPOST
		const response = await apiFetch( {
			path: apiUrl,	// ショートハンドの場合
			// url: apiUrl,	// 絶対パスの場合
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