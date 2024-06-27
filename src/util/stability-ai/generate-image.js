/**
 * internal dependencies
 */
import {
	DEFAULT_STABILITY_AI_API_HOST,
	DEFAULT_STABILITY_AI_API_VERSION,
	DEFAULT_STABILITY_AI_MODEL,
	DEFAULT_STABILITY_AI_TYPE,
} from '@dpaa/ai-assistant/constants'

/**
 * External dependencies
 */
import FormData from 'form-data'

// 以下は /v1 用( /v2beta 以降からパラメータ仕様が変わってて使えない)
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
		return;
	}

	let intWidth = parseInt( width );
	let intHeight = parseInt( height );

	if ( model === 'stable-diffusion-xl-1024-v1-0' || model === 'stable-diffusion-xl-1024-v0-9' ) {
		// SDXL 1.0 の場合

		const dimensionsArray = dimensions.split( 'x' );
		intWidth = parseInt( dimensionsArray[ 0 ] );
		intHeight = parseInt( dimensionsArray[ 1 ] );
	}
	else if ( model === 'stable-diffusion-xl-beta-v2-2-2' ) {
		// SD Betaの場合

		// 高さと幅が両方とも 512 を超えている場合は、高さを 512 にする 
		if ( intWidth > 512 && intHeight > 512 ) {
			intHeight = 512;
		}
		if ( intWidth > 896 ) {
			intWidth = 896
		}
		if ( intHeight > 896 ) {
			intHeight = 896
		}
	}
	else if ( model === 'stable-diffusion-512-v2-1' ) {
		// SD 2.1 の場合
		intWidth = 512;
		intHeight = 512;
	}

	// ヘッダー
	const headers = {
		'Content-Type': type === 'image-to-image' ? 'multipart/form-data' : 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${ apiKey }`,
	}

	let body = null

	// 画像から画像の場合
	if ( type === 'image-to-image' ) {
		if ( !inputBase64Image ) {
			return
		}

		// パラメータの追加
		const formData = new FormData()
		formData.append( 'init_image', inputBase64Image )
		formData.append( 'init_image_mode', imageMode )
		formData.append( 'image_strength', imageStrength )
		formData.append( 'text_prompts[0][text]', prompt )
		formData.append( 'cfg_scale', cfgScale )
		formData.append( 'samples', samples )
		formData.append( 'steps', steps )
		formData.append( 'style_preset', style && style !== 'none' ? style : null )

		// body の代入
		body = formData
	}
	// テキストから画像の場合
	else {
		// 画像生成パラメータ
		const params = {
			text_prompts: [
				{
					text: prompt,
					// weight: 0.5, // 0〜35
				},
			],
			cfg_scale: parseInt( cfgScale ),
			height: intHeight,
			width: intWidth,
			steps: parseInt( steps ),
			samples: typeof samples === 'number' ? samples : parseInt( samples ),
			style_preset: style && style !== 'none' ? style : null,
			// clip_guidance_preset: 'NONE',
		}
		body = JSON.stringify( params )
	}

	// 生成画像格納用
	const images = []

	// リクエスト
	const response = await fetch(
		`${ apiHost }/${ apiVersion }/generation/${ model }/${ type }`,
		{
			method: 'POST',
			headers: headers,
			body: body,
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

	responseJSON.artifacts.forEach( ( image, index ) => {
		// Base64形式のテキスト(画像データ)を保持
		images.push( image.base64 )
	} );

	if ( images && Array.isArray( images ) ) {
		return images
	}

	return null
}