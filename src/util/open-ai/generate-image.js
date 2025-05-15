/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import OpenAI from "openai";

// APIキーのセット
export const newOpenAI = ( apiKey ) => {
	if ( apiKey && typeof apiKey === 'string' ) {
		return new OpenAI( {
			apiKey: apiKey,
			dangerouslyAllowBrowser: true
		} );
	} else {
		return null;
	}
}

export const generateImageByOpenAI = async ( props ) => {
	const {
		prompt = '',
		apiKey = null,
		openai = null,
		n = 1,
		model = 'gpt-image-1',
		size = '1024x1024',
		mode = 'generate',
		format = 'b64_json',
		quality = 'auto',
		image = null,
		style = 'vivid',	// dall-e-3 用
	} = props

	if ( !prompt ) {
		return;
	}

	// openai がない場合はここで生成
	const openAI = openai || ( apiKey && typeof apiKey === 'string' ? newOpenAI( apiKey ) : null );
	if ( !openAI ) {
		throw new Error( __( 'OpenAI or API key is missing!', dpaa.i18n ) )
	}

	if ( mode === 'variation' && !image ) {
		throw new Error( __( 'Source image is not exist!', dpaa.i18n ) )
	}

	// 生成画像格納用
	const images = []

	// パラメータ
	const params = {
		model: model,
		n: model === 'dall-e-3' ? 1 : n,
		size: size,
	}

	// dall-e-2とdall-e-3の場合のみresponse_formatを設定
	if (model === 'dall-e-2' || model === 'dall-e-3') {
		params.response_format = format;
	}

	// プロンプトから画像を生成する場合
	if ( mode === 'generate' ) {
		Object.assign(
			params,
			{
				prompt: prompt,
			}
		)

		// モデルごとのqualityパラメータの設定
		let validQuality = 'auto';
		if (model === 'gpt-image-1') {
			validQuality = ['high', 'mid', 'low', 'auto'].includes(quality) ? quality : 'auto';
		} else if (model === 'dall-e-3') {
			validQuality = ['hd', 'standard', 'auto'].includes(quality) ? quality : 'auto';
		} else if (model === 'dall-e-2') {
			validQuality = ['standard', 'auto'].includes(quality) ? quality : 'auto';
		}
		params.quality = validQuality;

		// styleパラメータはdall-e-3の場合のみ設定
		if (model === 'dall-e-3') {
			params.style = style;
		}

		const response = await openAI.images.generate( params );

		if ( response?.data && Array.isArray( response?.data ) ) {
			response.data.forEach( ( image, index ) => {
				// Base64形式のテキスト(画像データ)を保持
				images.push( image[ format ] )
			} )
		}

		if ( images && Array.isArray( images ) ) {
			return images
		}
	}
	// 指定した画像から他のバリエーションを生成する場合
	else if ( mode === 'variation' ) {
		Object.assign(
			params,
			{
				image: image,
			}
		)
		const response = await openAI.images.createVariation( params );
		return response?.data[ 0 ][ format ]
	}

	return false;
}