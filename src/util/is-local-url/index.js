export const isLocalUrl = ( url ) => {
	const localUrlPattern = /^(https?:\/\/localhost|https?:\/\/127.0.0.1|(.+\.localhost)|(.+\.local))\/.*?$/;
	return localUrlPattern.test( url );
}