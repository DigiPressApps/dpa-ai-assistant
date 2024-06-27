export const playAudioFromBlob = ( props ) => {
	let { currentAudio = null } = props
	const {
		blob = null,
		setIsPlaying = undefined
	} = props

	if ( !blob ) {
		return null
	}

	// 再生中のオーディオがある場合は、停止
	if ( currentAudio && !currentAudio.paused ) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		currentAudio = null;
		if ( setIsPlaying ) {
			setIsPlaying( false )
		}
		return
	}

	const url = window.URL.createObjectURL( blob );
	const audio = new Audio( url );
	audio.play();
	setIsPlaying( true )

	audio.addEventListener( 'ended', () => {
		window.URL.revokeObjectURL( url );
		currentAudio = null
		if ( setIsPlaying ) {
			setIsPlaying( false )
		}
	} );

	return audio
}