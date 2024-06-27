/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'
import { __ } from '@wordpress/i18n'

// CSV(キャッシュデータ)取得処理
const getEmbeddingCache = async () => {
	// RESTエンドポイント
	const apiUrl = '/dpaa/v1/get_embedding_cache';

	try {
		// カスタムエンドポイント(/wp-json/dpaa/v1/get_embedding_cache)にPOST
		const response = await apiFetch( {
			path: apiUrl,	// ショートハンドの場合
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		} );
		if ( response?.success ) {
			return response.cache_map;
		} else {
			console.error( response?.error )
		}
	} catch ( error ) {
		console.error( error )
	}
}


// CSV(キャッシュデータ)更新処理
const updateEmbeddingCache = async ( line ) => {
	// RESTエンドポイント
	const apiUrl = '/dpaa/v1/update_embedding_cache';

	const requestData = {
		line: line,
	}

	try {
		// カスタムエンドポイント(/wp-json/dpaa/v1/update_embedding_cache)にPOST
		const response = await apiFetch( {
			path: apiUrl,	// ショートハンドの場合
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: requestData,
		} );
		return response
	} catch ( error ) {
		console.error( error )
	}
}

// Create a Embeddings model
// @see https://platform.openai.com/docs/api-reference/embeddings?lang=node.js
export const generateEmbedding = async ( props ) => {
	const {
		openai = null,
		input = null,	// 文字列 or 配列
		model = null,	// text-embedding-3-small, text-embedding-3-large
		encodingFormat = 'float',	// or base64
	} = props

	if ( !openai || !model || !input ) {
		return
	}

	const embedding = await openai.embeddings.create({
		model: model,
		input: Array.isArray( input ) ? input : [ input ],
		encoding_format: encodingFormat,
		// dimensions: dimensions,
	} );

	// return job object
	// @see https://platform.openai.com/docs/api-reference/embeddings/object
	return embedding?.data[ 0 ]?.embedding || false
}

// キャッシュ管理(必要に応じて generateEmbedding をコール)
export const generateEmbeddingWithCache = async ( props ) => {
	const {
		openai = null,
		input = null,	// 文字列 or 配列
		model = null,	// text-embedding-3-small, text-embedding-3-large
		encodingFormat = 'float',	// or base64
	} = props

	if ( !openai || !model || !input ) {
		return
	}

	// 改行はスペースに置換
	const text = input?.trim().replace( '\n', ' ' );
	const newProps = {
		openai: openai,
		input: text,
		model: model,
		encodingFormat: encodingFormat,
	}

	const cacheMap = await readCache();

	if ( cacheMap.has( text ) ) {
		// textがキャッシュにあれば、キャッシュからベクターを返す
		return cacheMap.get( text );
	} else {
		// textがキャッシュになければ、generateEmbedding でベクトルを生成し、キャッシュに追加
		const embeddingVector = await generateEmbedding( newProps );
		// キャッシュファイルを更新(新規エントリの追加)
		await appendToCache( text, embeddingVector );

		// 生成したベクトルを返す
		return embeddingVector;
	}
}

// CSVからキャッシュの読み込み、マップとしてreturn
const readCache = async () => {
	try {
		// REST APIのエンドポイント経由でwordpressのアップロードディレクトリからCSVファイルの内容を受け取る
		const cacheFile = await getEmbeddingCache();

		if ( !cacheFile ) {
			return new Map();
		}

		const lines = cacheFile.trim().split( '\n' );
		const cacheMap = new Map();

		// ヘッダー行をスキップして index 1 からループを開始
		for ( let i = 1; i < lines.length; i++) {
			const line = lines[ i ].trim();
			if ( line ) {
				const [ text, embedding ] = line.split( '\t' );
				cacheMap.set( text, JSON.parse( embedding ) );
			}
		}

		return cacheMap;
	} catch ( error ) {
		return new Map();
	}
}

// CSVファイルに追加してキャッシュを更新
const appendToCache = async ( text, embeddingVector ) => {
	const cacheMap = await readCache();
	if ( cacheMap.has( text ) ) {
		// エントリがすでにある場合はスルー
		return;
	}

	const vectorString = JSON.stringify( embeddingVector );
	// CSVへの追加行: "テキスト	ベクトル文字列"
	const newCacheLine = `${ text }\t${ vectorString }\n`;

	// ここにカスタムエンドポイントへ追加するキャッシュ(行=newCacheLine)を送信
	updateEmbeddingCache( newCacheLine )
	.then( res => {
		if ( res?.success ) {
			// cacheMap を更新
			cacheMap.set( text, embeddingVector );
		} else {
			console.error( __( 'Failed to update cache.' ) )
		}
	} )
	.catch( error => {
		console.error( error )
	} )
}

// セマンティック検索
export const semanticSearchWithEmbeddings = async ( props ) => {
	const {
		openai = null,
		input = null,	// 文字列 or 配列
		model = null,	// text-embedding-3-small, text-embedding-3-large
		targetList,
		k,
	} = props
	// 検索ワードのエンべディングを生成する
	const searchTermEmbedding = await generateEmbeddingWithCache( {
		openai,
		input,
		model,
	} );

	// 類似度を保持する配列
	let similarities = [];

	for ( let i = 0; i < targetList.length; i++ ) {
		const target = targetList[ i ];

		// 対象のエンべディングを生成
		const targetEmbedding = await generateEmbeddingWithCache( {
			openai,
			input: target,
			model,
		} );

		// 検索ワードと対象の類似度を算出
		const similarity = cosineSimilarityWithEmbeddings( searchTermEmbedding, targetEmbedding ); 

		// 類似度を追加
		similarities.push( {
			index: i,
			text: target,
			similarity: similarity,
			// vector: targetEmbedding,
		} )
	}
	// 類似度を降順でソート
	similarities.sort( ( a, b ) => b.similarity - a.similarity );

	// 上位k件を返す
	return similarities.slice( 0, k );
}

// コサイン類似度の算出
export const cosineSimilarityWithEmbeddings = ( vec1, vec2 ) => {
	return dotProduct( vec1, vec2 ) / ( norm( vec1) * norm( vec2 ) );
}

// ノーマライズ
const norm = ( vec ) => {
	let sum = 0;
	vec.forEach( ( v, i ) => {
		sum += v * v;
	} )
	return Math.sqrt( sum );
}

 const dotProduct = ( vec1, vec2 ) => {
	let product = 0;
	for ( let i = 0; i < vec1.length; i++ ) {
		product += vec1[ i ] * vec2[ i ];
	}
	return product;
 }