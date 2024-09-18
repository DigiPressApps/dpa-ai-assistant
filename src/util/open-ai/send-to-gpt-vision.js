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

export const sendToGPTVision = async ( props ) => {
	const {
		message = '',
		apiKey = null,
		openai = undefined,
		model = '',
		systemPrompt = '',
		temperature = 1,
		topP = 0.7,
		maxTokens = 2000,
		arrayImageUrls = [],
	} = props

	if ( !message || !model || ( !model.includes( 'gpt-4-vision' ) && !model.includes( 'gpt-4o' ) ) || !Array.isArray( arrayImageUrls ) || arrayImageUrls?.length < 0 ) {
		return;
	}

	// openai がない場合はここで生成
	const openAI = openai || ( apiKey && typeof apiKey === 'string' ? newOpenAI(apiKey) : null );
	if ( !openAI ) {
		return;
	}

	const images = arrayImageUrls.map( url => {
		return {
			type: 'image_url',
			image_url: {
				'url': url
			},
		}
	} )

	const params = {
		model: model,
		messages: [
			{
				'role': 'user',
				'content': [
					{
						type: 'text',
						text: message,
					},
					...images,
				],
			},
		],
		temperature: parseFloat( temperature ),
		top_p: parseFloat( topP ),
		frequency_penalty: 0,
		n: 1,
		max_tokens: parseInt( maxTokens, 10 ),
	}

	if ( systemPrompt ) {
		params.messages.unshift( {
			'role': 'system',
			'content': systemPrompt,
		} );
	}

	const response = await openAI.chat.completions.create( params );

	return {
		response: response.choices[ 0 ].message.content,
		usage: response.usage,
	}
}