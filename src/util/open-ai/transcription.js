/**
 * テキストから音声データに変換
 */
export const textToSpeech = async ( props ) => {
	const {
		openai = undefined,
		text = '',
		model = 'gpt-4o-mini-tts',
		voice = 'alloy', // alloy, ash, coral, echo, fable, onyx, nova, sage, shimmer
		format = 'mp3',	// mp3, opus, aac, flac, wav, pcm
		speed = 1,	// 0.25 to 4.0
		instructions = undefined,
	} = props

	if ( !openai || !text || !model || !voice ) {
		return
	}

	 const args = {
		model: model,
		voice: voice,
		input: text,
		response_format: format,
		...(model === 'tts-1' || model === 'tts-1-hd' ? { speed: speed } : {}),
		...( ( instructions && model !== 'tts-1' && model !== 'tts-1-hd' ) ? { instructions: instructions } : {}),
	}

	const response = await openai.audio.speech.create( args );

	const arrayBuffer = await response.arrayBuffer();
	const blob = new Blob( [ arrayBuffer ], { type: `audio/${ format }` } );

	return blob
}

/**
 * 音声データからにテキスト変換
 */
export const speechToText = async ( props ) => {
	const {
		openai = undefined,
		file = null,
		model = 'whisper-1',
		language = 'ja',	//ISO 639 https://www.asahi-net.or.jp/~ax2s-kmtn/ref/iso639.html
		prompt = '',
		format = 'json',	// json, text, srt, verbose_json, or vtt.
		temperature = 0,	// 0.0 to 1.0
		stream = false,
		setResponse = undefined
	} = props

	if ( !openai || !file || !model ) {
		return
	}

	const args = {
		model: model,
		file: file,
		...(language && { language }),
		...(prompt && { prompt }),
		...(format && { response_format: model === 'whisper-1' ? format : 'json' }),
		...(temperature && { temperature }),
		...( (stream && model !== 'whisper-1' && setResponse && typeof setResponse === 'function' ) && { stream: true }),
	};

	const response = await openai.audio.transcriptions.create( args );

	if ( stream && model !== 'whisper-1' && setResponse && typeof setResponse === 'function' ) {
		// ストリーミングレスポンスの累積内容
		let accumulatedContent = '';
		
		// 非同期型(ストリーミング)の場合
		for await ( const event of response ) {
			if ( event?.type === 'transcript.text.done' ) {
				// 最終的な内容を渡して完了
				setResponse(event?.text);
				return event.type;
			} else {
				// 新しいコンテンツを追加
				const newContent = event?.delta || '';
				accumulatedContent += newContent;
				
				// 更新された累積コンテンツをコールバックに渡す
				setResponse(accumulatedContent);
			}
		}
	} else {
		return response;
	}
}