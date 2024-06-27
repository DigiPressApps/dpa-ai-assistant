/**
 * ベクトルストアを作成
 * @see https://platform.openai.com/docs/api-reference/vector-stores/create
 */
export const createVectorStore = async ( props ) => {
	const {
		openai = null,
		name = null,
		fileIds = null,
		expiresAfter = null,
		metadata = null,
	} = props

	if ( !openai ) return;

	const params = {}
	if ( name ) params.name = name;
	if ( fileIds && Array.isArray( fileIds ) ) params.file_ids = fileIds;
	if ( expiresAfter ) params.expires_after = expiresAfter;
	if ( metadata ) params.metadata = metadata;

	const vectorStore = await openai.beta.vectorStores.create( params );

	return vectorStore
}

/**
 * ベクトルストアのリストを取得
 * @see https://platform.openai.com/docs/api-reference/vector-stores/list
 */
export const listVectorStores = async ( props ) => {
	const {
		openai = null,
		limit = 20,
		order = 'desc',
		after = null,
		before = null,
	} = props

	if ( !openai ) return;

	const params = {
		limit: limit,
		order: order,
	}
	if ( after ) params.after = after;
	if ( before ) params.before = before;

	const list = await openai.beta.vectorStores.list( params );

	return list
}

/**
 * ベクトルストアを取得
 * @see https://platform.openai.com/docs/api-reference/vector-stores/retrieve
 */
export const retrieveVectorStore = async ( props ) => {
	const {
		openai = null,
		id = null,
	} = props

	if ( !openai || !id ) return;

	const vectorStore = await openai.beta.vectorStores.retrieve( id );

	return vectorStore
}

/**
 * ベクトルストアを削除
 * @see https://platform.openai.com/docs/api-reference/vector-stores/delete
 */
export const deleteVectorStore = async ( props ) => {
	const {
		openai = null,
		id = null,
	} = props

	if ( !openai || !id ) return;

	const deletedVectorStore = await openai.beta.vectorStores.del( id );

	return deletedVectorStore
}

/**
 * ベクトルストアにファイルを作成
 * @see https://platform.openai.com/docs/api-reference/vector-stores-files/createFile
 */
export const createFileToVectorStore = async ( props ) => {
	const {
		openai = null,
		vectorStoreId = null,
		fileId = null,
	} = props

	if ( !openai || !vectorStoreId || !fileId ) return;

	const vectorStoreFile = await openai.beta.vectorStores.files.create(
		vectorStoreId,
		{
			file_id: fileId,
		}
	);

	return vectorStoreFile
}

/**
 * ベクトルストアのファイルリストを取得
 * @see https://platform.openai.com/docs/api-reference/vector-stores-files/listFiles
 */
export const listFilesInVectorStore = async ( props ) => {
	const {
		openai = null,
		vectorStoreId = null,
		limit = 20,
		order = 'desc',
		after = null,
		before = null,
		filter = null,	// in_progress, completed, failed, cancelled
	} = props

	if ( !openai || !vectorStoreId ) return;

	const params = {
		limit: limit,
		order: order,
	}
	if ( after ) params.after = after;
	if ( before ) params.before = before;
	if ( filter ) params.filter = filter;

	const files = await openai.beta.vectorStores.list( vectorStoreId, params );

	return files
}

/**
 * ベクトルストアのファイルを取得
 * @see https://platform.openai.com/docs/api-reference/vector-stores-files/getFile
 */
export const getFileInVectorStore = async ( props ) => {
	const {
		openai = null,
		vectorStoreId = null,
		fileId = null,
	} = props

	if ( !openai || !vectorStoreId || !fileId ) return;

	const file = await openai.beta.vectorStores.files.retrieve( vectorStoreId, fileId );

	return file
}

/**
 * ベクトルストアのファイルを削除
 * @see https://platform.openai.com/docs/api-reference/vector-stores-files/deleteFile
 */
export const deleteFileInVectorStore = async ( props ) => {
	const {
		openai = null,
		vectorStoreId = null,
		fileId = null,
	} = props

	if ( !openai || !vectorStoreId || !fileId ) return;

	const file = await openai.beta.vectorStores.files.del( vectorStoreId, fileId );

	return file
}

/**
 * ベクトルストアに複数のファイルを追加 (500ファイルまで / 最大ファイルサイズ: 512MB)
 * @see https://platform.openai.com/docs/api-reference/vector-stores-file-batches/createBatch
 */
export const createBatchToVectorStore = async ( props ) => {
	const {
		openai = null,
		vectorStoreId = null,
		fileIds = null,
	} = props

	if ( !openai || !vectorStoreId || ( !fileIds || !Array.isArray( fileIds ) ) ) return;

	const batch = await openai.beta.vectorStores.fileBatches.create(
		vectorStoreId,
		{
			file_ids: fileIds,
		}
	);

	return batch
}

/**
 * ベクトルストアのファイルバッチをキャンセル
 * @see https://platform.openai.com/docs/api-reference/vector-stores-file-batches/cancelBatch
 */
export const cancelBatchInVectorStore = async ( props ) => {
	const {
		openai = null,
		vectorStoreId = null,
		batchIds = null,
	} = props

	if ( !openai || !vectorStoreId || !batchIds ) return;

	const batch = await openai.beta.vectorStores.fileBatches.cancel( vectorStoreId, batchIds );

	return batch
}

/**
 * ベクトルストアのバッチファイルリストを取得
 * @see https://platform.openai.com/docs/api-reference/vector-stores-file-batches/listBatchFiles
 */
export const listBatchFilesInVectorStore = async ( props ) => {
	const {
		openai = null,
		vectorStoreId = null,
		batchId = null,
		limit = 20,
		order = 'desc',
		after = null,
		before = null,
		filter = null,	// in_progress, completed, failed, cancelled
	} = props

	if ( !openai || !vectorStoreId || !batchId ) return

	const params = {
		limit: limit,
		order: order,
	}
	if ( after ) params.after = after;
	if ( before ) params.before = before;
	if ( filter ) params.filter = filter;

	const files = await openai.beta.vectorStores.fileBatches.listFiles( vectorStoreId, batchId, params );

	return files
}