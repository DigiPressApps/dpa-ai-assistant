
/**
 * テキストから音声データに変換
 */
export const textToSpeech = async ( props ) => {
	const {
		openai = undefined,
		text = '',
		model = 'tts-1',	// tts-1, tts-1-hd
		voice = 'alloy', // alloy, echo, fable, onyx, nova, shimmer
		format = 'mp3',	// mp3, opus, aac, flac, wav, pcm
		speed = 1,	// 0.25 to 4.0
	} = props

	if ( !openai || !text || !model || !voice ) {
		return
	}

	const response = await openai.audio.speech.create({
		model: model,
		voice: voice,
		input: text,
		response_format: format,
		speed: speed,
	});

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
	} = props

	if ( !openai || !file || !model ) {
		return
	}

	const args = {
		model: model,
		file: file,
	}
	if ( language ) {
		Object.assign(
			args,
			{ language: language },
		)
	}
	if ( prompt ) {
		Object.assign(
			args,
			{ prompt: prompt },
		)
	}
	if ( format ) {
		Object.assign(
			args,
			{ response_format: format },
		)
	}
	if ( temperature ) {
		Object.assign(
			args,
			{ temperature: temperature },
		)
	}

	const response = await openai.audio.transcriptions.create( args );

	return response;
}