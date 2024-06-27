import { Buffer } from 'buffer';

export const base64ToBlob = ( props ) => {
	const {
		base64Data,
		contentType
	} = props

	if ( !base64Data || !contentType ) {
		return null
	}

	const byteCharacters = Buffer.from( base64Data, 'base64' ).toString( 'binary' );
	const byteNumbers = new Array( byteCharacters.length );

	for ( let i = 0; i < byteCharacters.length; i++ ) {
		byteNumbers[ i ] = byteCharacters.charCodeAt( i );
	}
	const byteArray = new Uint8Array(byteNumbers);
	return new Blob( [ byteArray ], { type: contentType });
}