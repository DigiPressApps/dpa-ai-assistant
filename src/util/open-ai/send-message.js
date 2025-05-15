/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { newOpenAI } from "./new-openai.js";

export const sendMessageToOpenAI = async ( props ) => {
	const {
		message,
		apiKey,
		openai,
		useStreaming,
		model,
		systemPrompt,
		conversation,
		temperature,
		topP,
		maxTokens,
		logitBias = null,
		logprobs = false,
		topLogprobs = null,
		frequencyPenalty = 0,
		presencePenalty = 0,
		tools = null,
		toolChoice = 'auto',
		setResponse,
		setConsumedTokens,
		shouldReturnJson
	} = props

	if ( !message ) {
		return;
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

	// パラメータ
	const params = {
		model: model,
		...( model.includes('-search-preview') ? { web_search_options: {} } : {} ),
		messages: [
			{
				role: 'developer',
				content: systemPrompt,
			},
			...( conversation || [] ),
			{
				role: 'user',
				content: message,
			},
		],
		...( !model.includes('-search-preview') ? {
			temperature: model.includes('gpt-') ? parseFloat( temperature ) : 1,
			...( model.includes('gpt-') ? { top_p: parseFloat( topP ) } : {} ),
			frequency_penalty: parseFloat( frequencyPenalty ),
			presence_penalty: parseFloat( presencePenalty ),
			n: 1,
		} : {} ),
		// store: store,
		max_completion_tokens: fixMaxTokens,
		...( useStreaming && !model.includes('-search-preview') ? { stream: true } : {} ),
	}

	// モデルが Search Preview でない場合に追加するパラメータ
	if ( !model.includes('-search-preview') ) {
		if ( shouldReturnJson ) {
			params.response_format = { type: 'json_object' };
		}

		if ( tools && toolChoice ) {
			params.tools = tools;
			params.tool_choice = toolChoice;
		}

		if ( logprobs && typeof topLogprobs === 'number' ) {
			params.logprobs = logprobs;
			params.top_logprobs = parseInt( topLogprobs );
		}

		if ( typeof logitBias === 'number' ) params.logit_bias = parseInt( logitBias );
	}

	const response = await openAI.chat.completions.create( params, {
		responseType: useStreaming && !model.includes('-search-preview') ? 'stream' : 'text',
	} );

	if ( useStreaming && !model.includes('-search-preview') && setResponse && typeof setResponse === 'function' ) {
		// ストリーミングレスポンスの累積内容
		let accumulatedContent = '';
		
		// 非同期型(ストリーミング)の場合
		for await ( const chunk of response ) {
			if ( chunk.choices[ 0 ].finish_reason === 'stop' ) {
				// 最終的な内容を渡して完了
				setResponse(accumulatedContent);
				return chunk.choices[ 0 ].finish_reason;
			} else {
				// 新しいコンテンツを追加
				const newContent = chunk.choices[ 0 ]?.delta?.content || '';
				accumulatedContent += newContent;
				
				// 更新された累積コンテンツをコールバックに渡す
				setResponse(accumulatedContent);
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
}