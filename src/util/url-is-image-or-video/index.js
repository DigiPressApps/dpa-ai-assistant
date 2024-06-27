export const urlIsImageOrVideo = ( url ) => {
	return url ? ( url.match( /(mp4|webm|ogg)$/i ) ? 'video' : 'image' ) : false;
}