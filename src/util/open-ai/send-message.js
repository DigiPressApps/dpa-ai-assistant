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

export const sendMessage = async ( props ) => {
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

	const params = {
		model: model,
		messages: [
			{
				'role': 'system',
				'content': systemPrompt,
			},
			...( conversation || [] ),
			{
				'role': 'user',
				'content': message,
			},
		],
		temperature: parseFloat( temperature ),
		top_p: parseFloat( topP ),
		frequency_penalty: parseFloat( frequencyPenalty ),
		presence_penalty: parseFloat( presencePenalty ),
		n: 1,
		max_tokens: parseInt( maxTokens, 10 ),
		stream: useStreaming ? true : false,
	}

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

	const response = await openAI.chat.completions.create( params, {
		responseType: useStreaming ? 'stream' : 'text',
	} );

	if ( useStreaming ) {
		// 非同期型(ストリーミング)の場合
		for await ( const chunk of response ) {
			if ( chunk.choices[ 0 ].finish_reason === 'stop' ) {
				return chunk.choices[ 0 ].finish_reason;
			} else {
				setResponse( content => content + ( chunk.choices[ 0 ]?.delta?.content || '' ) )
			}
		}
	} else {
		// 同期型の場合
		return {
			response: response.choices[ 0 ].message.content,
			usage: response.usage,
		}
	}
}

sendMessage.defaultProps = {
	message: null,
	openai: null,
	apiKey: null,
	useStreaming: false,
	model: 'gpt-3.5-turbo',
	systemPrompt: '',
	conversation: [],
	temperature: 0.8,
	topP: 0.8,
	maxTokens: 2000,
	setResponse: undefined,
	setConsumedTokens: null,
	shouldReturnJson: false,
}