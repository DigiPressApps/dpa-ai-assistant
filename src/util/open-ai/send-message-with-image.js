/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { newOpenAI } from "./new-openai.js";

export const sendMessageWithImageToOpenAI = async ( props ) => {
	const {
		message = '',
		apiKey = null,
		openai = undefined,
		useStreaming = false,
		model = '',
		systemPrompt = '',
		conversation = [],
		temperature = 1.0,
		topP = 1.0,
		maxTokens = 2000,
		frequencyPenalty = 0,
		presencePenalty = 0,
		imageData,
		imageType = 'url',
		imageDetail = 'low',
		setResponse,
		arrayImageUrls = [],
	} = props

	// OpenAI APIをサポートするモデルかどうかを確認
	if ( !model.includes('gpt-4o') && !model.includes('gpt-4.1') && !model.includes('gpt-5') ) {
		return {
			error: __('The model you are using does not support image input.', dp_ex_blocks.i18n)
		};
	}

	// openai がない場合はここで生成
	const openAI = openai || ( apiKey && typeof apiKey === 'string' ? newOpenAI(apiKey) : null );
	if ( !openAI ) {
		return;
	}

	// 最大トークン数の修正
	const currentMaxTokens = parseInt(maxTokens, 10);
	const fixMaxTokens = model.includes('gpt-4.1') && (currentMaxTokens <= 30767 || currentMaxTokens > 32768)
		? 32768
		: model.includes('gpt-4o') && (currentMaxTokens <= 14383 || currentMaxTokens > 16384)
			? 16384
			: model === 'o1-mini' && (currentMaxTokens <= 63535 || currentMaxTokens > 65536)
				? 65536
				: model === 'o3-mini' && (currentMaxTokens <= 97999 || currentMaxTokens > 100000)
					? 100000
					: currentMaxTokens;

	// 画像を含むユーザーメッセージの作成
	const userMessage = {
		role: 'user',
		content: [],
	};

	// テキストメッセージを追加
	if (message && message.trim()) {
		userMessage.content.push({
			type: 'text',
			text: message,
		});
	}

	const images = arrayImageUrls.map( url => {
		const imageContent = {
			type: 'image_url',
			image_url: {
				url: url,
			},
		};

		// 画像の詳細度を設定
		if (imageDetail && ['low', 'high', 'auto'].includes(imageDetail)) {
			imageContent.image_url.detail = imageDetail;
		}

		return imageContent;
	} );

	if ( images.length > 0 ) {
		userMessage.content.push( ...images );
	}

	// パラメータ
	const params = {
		model: model,
		...( model.includes('-search-preview') ? { web_search_options: {} } : {} ),
		messages: [
			...( conversation || [] ),
			userMessage,
		],
		...( !model.includes('-search-preview') ? {
			temperature: model.includes('gpt-') && !model.includes('gpt-5') ? parseFloat( temperature ) : 1.0,
			...( model.includes('gpt-') && !model.includes('gpt-5') ? { top_p: parseFloat( topP ) } : {} ),
			frequency_penalty: parseFloat( frequencyPenalty ),
			presence_penalty: parseFloat( presencePenalty ),
			n: 1,
		} : {} ),
		max_completion_tokens: fixMaxTokens,
		...( useStreaming && !model.includes('-search-preview') ? { stream: true } : {} ),
	}

	// システムプロンプトの追加
	if ( systemPrompt ) {
		params.messages.unshift( {
			role: 'developer',
			content: systemPrompt,
		}, );
	}

	try {
		const response = await openAI.chat.completions.create( params, {
			responseType: useStreaming ? 'stream' : 'text',
		} );

		if ( useStreaming ) {
			// ストリーミングレスポンスの累積内容
			let accumulatedContent = '';
			
			// 非同期型(ストリーミング)の場合
			for await ( const chunk of response ) {
				if ( chunk.choices[ 0 ].finish_reason === 'stop' ) {
					// 最終的な内容を渡して完了
					if (setResponse && typeof setResponse === 'function') {
						setResponse(accumulatedContent);
					}
					return chunk.choices[ 0 ].finish_reason;
				} else {
					// 新しいコンテンツを追加
					const newContent = chunk.choices[ 0 ]?.delta?.content || '';
					accumulatedContent += newContent;
					
					// 更新された累積コンテンツをコールバックに渡す
					if (setResponse && typeof setResponse === 'function') {
						setResponse(accumulatedContent);
					}
				}
			}
		} else {
			// 同期型の場合
			return {
				content: response.choices[ 0 ].message?.content,
				annotations: response.choices[ 0 ].message?.annotations,
				usage: response.usage,
			}
		}
	} catch (error) {
		console.error('Error calling OpenAI API with image:', error);
		return {
			error: error.message || __('Error processing your request', dp_ex_blocks.i18n)
		};
	}




	const response = await openAI.chat.completions.create( params );

	return {
		response: response.choices[ 0 ].message.content,
		usage: response.usage,
	}
}