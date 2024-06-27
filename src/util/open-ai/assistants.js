/**
 * アシスタント生成
 * @see https://platform.openai.com/docs/api-reference/assistants/createAssistant
 * 
 * "tools" パラメータの指定例:
 * 
 * tools: [
		{ type: "code_interpreter" },
		{ type: "file_search" },
		{ type: "function" }
	]
 * 
 * "toolResources" パラメータの指定例:
 * 
 * toolResources = {
	code_interpreter: {
		file_ids: ['file1', 'file2'] // code_interpreter ツールに関連するファイルのID
	},
	file_search: {
		vector_store_ids: ['vectorStore1'], // file_search ツールに関連するベクトルストアのID
		vector_stores: {
			vectorStore1: {
				file_ids: ['file3', 'file4'], // ベクトルストアに追加するファイルのID
				metadata: {
					key1: 'value1',
					key2: 'value2'
					// 他のキーと値のペア
				}
			}
		}
	}
	}
 */
export const createAssistant = async ( props ) => {
	const {
		openai = null,
		name = null,
		instructions = null,	// The maximum length is 256,000 characters.
		description = null,		//  The maximum length is 512 characters.
		tools = [],				// @see https://platform.openai.com/docs/api-reference/assistants/createAssistant#assistants-createassistant-tools
		toolResources = null,	// @see https://platform.openai.com/docs/api-reference/assistants/createAssistant#assistants-createassistant-tool_resources
		metadata = null,		// @see https://platform.openai.com/docs/api-reference/assistants/createAssistant#assistants-createassistant-metadata
		temperature = 1,		// @see https://platform.openai.com/docs/api-reference/assistants/createAssistant#assistants-createassistant-temperature
		topP = 1,				// @see https://platform.openai.com/docs/api-reference/assistants/createAssistant#assistants-createassistant-top_p
		responseFormat = 'text',// @see https://platform.openai.com/docs/api-reference/assistants/createAssistant#assistants-createassistant-response_format
		model,
	} = props

	if ( !openai ) {
		return;
	}

	const params = {
		name: name,
		instructions: instructions,
		description: description,
		model: model,
		tools: tools,
		tool_resources: toolResources,
		temperature: parseFloat( temperature ),
		top_p: parseFloat( topP ),
		response_format: {
			'type': responseFormat
		},
	}

	if ( metadata ) params.metadata = metadata;

	const assistant = await openai.beta.assistants.create( params );

	return assistant;
}

/** 
 * アシスタント一覧取得
 * @see https://platform.openai.com/docs/api-reference/assistants/listAssistants
 */
export const listAssistants = async ( props ) => {
	const {
		openai = null,
		order = 'desc',	// asc, desc
		limit = 20,
		after = null,
		before = null,
	} = props

	if ( !openai ) {
		return;
	}

	const params = {
		order: order,
		limit: limit,
	}

	if ( after ) params.after = after;
	if ( before ) params.before = before;

	const assistants = await openai.beta.assistants.list( params );

	return assistants;
}

/** 
 * アシスタント情報取得
 * @see https://platform.openai.com/docs/api-reference/assistants/getAssistant
 */
export const retrieveAssistant = async ( props ) => {
	const {
		openai = null,
		id = null,
	} = props

	if ( !openai || !id ) {
		return;
	}

	const assistant = await openai.beta.assistants.retrieve( id );

	return assistant;
}

/**
 * アシスタント編集
 * @see https://platform.openai.com/docs/api-reference/assistants/modifyAssistant
 */
export const modifyAssistant = async ( props ) => {
	const {
		openai = null,
		name = null,
		id = null,
		instructions = null,
		description = null,	// The maximum length is 512 characters.
		tools = null,	// eg: [{"type": "code_interpreter"}]
		toolResources = null,	/* { "code_interpreter": { "file_ids": [file.id] } } */
		metadata = null,
		temperature = 1,
		topP = 1,
		responseFormat = 'text',
		model,
	} = props

	if ( !openai || !id ) return;

	const params = {}
	if ( name ) params.name = name;
	if ( instructions ) params.instructions = instructions;
	if ( description ) params.description = description;
	if ( model ) params.model = model;
	if ( tools ) params.tools = tools;
	if ( toolResources ) params.tool_resources = toolResources;
	if ( temperature ) params.temperature = parseFloat( temperature );
	if ( topP ) params.top_p = parseFloat( topP );
	if ( responseFormat ) params.response_format = { 'type': responseFormat };
	if ( metadata ) params.metadata = metadata;

	const updatedAssistant = await openai.beta.assistants.update( id, params );

	return updatedAssistant;
}

/** 
 * アシスタント削除
 * @see https://platform.openai.com/docs/api-reference/assistants/deleteAssistant
 */
export const deleteAssistant = async ( props ) => {
	const {
		openai = null,
		id = null,
	} = props

	if ( !openai || !id ) return;

	const result = await openai.beta.assistants.del( id );

	return result;
}

/** 
 * スレッド作成
 * @see https://platform.openai.com/docs/api-reference/threads/createThread
 */
export const createThread = async ( props ) => {
	const {
		openai = null,
		messages = null,		// @see https://platform.openai.com/docs/api-reference/threads/createThread#threads-createthread-messages
		toolResources = null,	// @see https://platform.openai.com/docs/api-reference/threads/createThread#threads-createthread-tool_resources
		metadata = null 		// @see https://platform.openai.com/docs/api-reference/threads/createThread#threads-createthread-metadata
	} = props

	if ( !openai ) return;

	const params = {}

	if ( messages && Array.isArray( messages ) ) params.messages = messages;
	if ( toolResources ) params.tool_resources = toolResources;
	if ( metadata ) params.metadata = metadata
 
	const result = await openai.beta.threads.create( params );

	return result;
}

/** 
 * スレッド取得
 * @see https://platform.openai.com/docs/api-reference/threads/getThread
 */
export const getThread = async ( props ) => {
	const {
		openai = null,
		id = null,
	} = props

	if ( !openai || !id ) return;

	const thread = await openai.beta.threads.retrieve( id );

	return thread;
}

/** 
 * スレッド変更
 * @see https://platform.openai.com/docs/api-reference/threads/modifyThread
 */
export const modifyThread = async ( props ) => {
	const {
		openai = null,
		id = null,
		toolResources = null,	// @see https://platform.openai.com/docs/api-reference/threads/modifyThread#threads-modifythread-tool_resources
		metadata = null,		// @see https://platform.openai.com/docs/api-reference/threads/modifyThread#threads-modifythread-metadata
	} = props

	if ( !openai || !id ) return;

	const params = {}

	if ( toolResources ) params.tool_resources = toolResources

	if ( metadata ) params.metadata = metadata;
 
	const result = await openai.beta.threads.update( id, params );

	return result;
}

/** 
 * スレッド削除
 * @see https://platform.openai.com/docs/api-reference/threads/deleteThread
 */
export const deleteThread = async ( props ) => {
	const {
		openai = null,
		id = null,
	} = props

	if ( !openai || !id ) return;

	const result = await openai.beta.threads.del( id );

	return result;
}

/** 
 * メッセージ送信
 * @see https://platform.openai.com/docs/api-reference/messages/createMessage
 */
export const createMessage = async ( props ) => {
	const {
		openai = null,
		threadId = null,
		role = null,	// user または assistant
		content = null,	// メッセージ
		attachments = null,	// @see https://platform.openai.com/docs/api-reference/messages/createMessage#messages-createmessage-attachments
		metadata = null,
	} = props

	if ( !openai || !threadId || !role || !content ) return;

	const params = {
		role: role,
		content: content,
	}

	if ( attachments && Array.isArray( attachments ) ) params.attachments = attachments;
	if ( metadata ) params.metadata = metadata;
 
	const result = await openai.beta.threads.messages.create( threadId, params );

	return result;
}

/** 
 * メッセージ一覧
 * @see https://platform.openai.com/docs/api-reference/messages/listMessages
 */
export const listMessages = async ( props ) => {
	const {
		openai = null,
		threadId = null,
		limit = 20,
		order = 'desc',
		after = null,
		before = null,
		runId = null,
	} = props

	if ( !openai || !threadId ) return;

	const params = {
		limit: limit,
		order: order,
	}

	if ( after ) params.after = after;
	if ( before ) params.before = before;
	if ( runId ) params.run_id = runId;
 
	const list = await openai.beta.threads.messages.list( threadId, params );

	return list;
}

/** 
 * メッセージ一取得
 * @see https://platform.openai.com/docs/api-reference/messages/getMessage
 */
export const getMessage = async ( props ) => {
	const {
		openai = null,
		threadId = null,
		messageId = null,
	} = props

	if ( !openai || !threadId || !messageId ) return;
 
	const message = await openai.beta.threads.messages.retrieve( threadId, messageId );

	return message;
}

/** 
 * メッセージ一変更
 * @see https://platform.openai.com/docs/api-reference/messages/modifyMessage
 */
export const modifyMessage = async ( props ) => {
	const {
		openai = null,
		threadId = null,
		messageId = null,
		metadata = null,
	} = props

	if ( !openai || !threadId || !messageId || !metadata ) return;
 
	const message = await openai.beta.threads.messages.update( threadId, messageId, metadata );

	return message;
}

/**
 * スレッド内でメッセージを送信
 * @see https://platform.openai.com/docs/api-reference/runs/createRun
 */
export const createRun = async ( props ) => {
	const {
		openai = null,
		threadId = null,
		assistantId = null,
		model = null,
		instructions = null,
		additionalInstructions = null,
		additionalMessages = null,
		tools = null,	// @see https://platform.openai.com/docs/api-reference/runs/createRun#runs-createrun-tools
		metadata = null,
		temperature = 1,
		topP = 1,
		stream = false,
		setResponse = null,
		maxPromptTokens = null,
		maxCompletionTokens = null,
		truncationStrategy = null,	// @see https://platform.openai.com/docs/api-reference/runs/createRun#runs-createrun-truncation_strategy
		toolChoice = null,
		responseFormat = 'text',
	} = props

	if ( !openai || !threadId || !assistantId || ( stream && !setResponse ) ) return

	const params = {
		assistant_id: assistantId,
		instructions: instructions,
		additional_instructions: additionalInstructions,
		additional_messages: additionalMessages,
		tools: tools,
		temperature: parseFloat( temperature ),
		top_p: parseFloat( topP ),
		stream: stream,
		max_prompt_tokens: maxPromptTokens,
		max_completion_tokens: maxCompletionTokens,
		response_format: {
			'type': responseFormat
		},
	}

	if ( model ) params.model = model;
	if ( metadata ) params.metadata = metadata;
	if ( truncationStrategy ) params.truncation_strategy = truncationStrategy;
	if ( toolChoice ) params.tool_choice = toolChoice;

	const run = await openai.beta.threads.runs.create( threadId, params );

	if ( stream ) {
		// 非同期型(ストリーミング)の場合
		for await ( const event of run ) {
			if ( event.event === 'thread.message.delta' ) {
				setResponse( content => content + ( event?.data?.delta?.content[ 0 ]?.text?.value || '' ) );
			} else if ( event.event === 'error' || event.event === 'thread.run.failed' || event.event === 'thread.message.incomplete' || event.event === 'thread.run.cancelled' || event.event === 'thread.run.completed' ) {
				return event?.data;
			}
		}
	} else {
		// 同期型の場合
		return run;
	}
}

/**
 * スレッドを作成しメッセージ送信
 * @see https://platform.openai.com/docs/api-reference/runs/createThreadAndRun
 */
export const createThreadAndRun = async ( props ) => {
	const {
		openai = null,
		assistantId = null,
		thread = null,	// @see https://platform.openai.com/docs/api-reference/runs/createThreadAndRun#runs-createthreadandrun-thread
		model = null,
		instructions = null,
		tools = null,
		metadata = null,
		temperature = 1,
		topP = 1,
		stream = false,
		setResponse = null,
		maxPromptTokens = null,
		maxCompletionTokens = null,
		truncationStrategy = null,
		toolChoice = null,
		responseFormat = 'text',
	} = props

	if ( !openai || !assistantId || ( stream && !setResponse ) ) return;

	const params = {
		assistant_id: assistantId,
		instructions: instructions,
		tools: tools,
		temperature: parseFloat( temperature ),
		top_p: parseFloat( topP ),
		stream: stream,
		max_prompt_tokens: maxPromptTokens,
		max_completion_tokens: maxCompletionTokens,
		response_format: {
			'type': responseFormat
		},
	}

	if ( thread ) params.thread = thread;
	if ( model ) params.model = model;
	if ( metadata ) params.metadata = metadata;
	if ( truncationStrategy ) params.truncation_strategy = truncationStrategy;
	if ( toolChoice ) params.tool_choice = toolChoice;

	const run = await openai.beta.threads.createAndRun( params );

	if ( stream ) {
		// 非同期型(ストリーミング)の場合
		for await ( const event of run ) {
			if ( event.event === 'thread.message.delta' ) {
				setResponse( content => content + ( event?.data?.delta?.content[ 0 ]?.text?.value || '' ) );
			} else if ( event.event === 'thread.run.completed' ) {
				return event?.data;
			}
		}
	} else {
		// 同期型の場合
		return run;
	}
}

/**
 * スレッドに属する実行のリスト
 * @see https://platform.openai.com/docs/api-reference/runs/listRuns
 */
export const listRuns = async ( props ) => {
	const {
		openai = null,
		threadId = null,
		limit = 20,	// 1 〜 100
		order = 'desc',	// created_at, asc, desc
		after = null,
		before = null,
	} = props

	if ( !openai || !threadId ) return;

	const params = {
		limit: limit,
		order: order,
	}
	if ( after ) params.after = after;
	if ( before ) params.before = before;

	const list = await openai.beta.threads.runs.list( threadId, params );

	return list
}

/**
 * スレッドの実行をキャンセル(in_progress の場合のみ)
 * @see https://platform.openai.com/docs/api-reference/runs/cancelRun
 */
export const cancelRun = async ( props ) => {
	const {
		openai = null,
		threadId = null,
		runId = null,
	} = props

	if ( !openai || !threadId || !runId ) return;

	const run = await openai.beta.threads.runs.cancel( threadId, runId );

	return run
}
