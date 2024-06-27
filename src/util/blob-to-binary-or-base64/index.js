import { __ } from '@wordpress/i18n'

// Blob データをバイナリ形式に変換する
export const blobToBinaryOrBase64 = ( props ) => {
	const {
		blob,
		isBase64 = false
	} = props

	if ( !blob ) {
		return null
	}

	return new Promise( ( resolve, reject ) => {
		const reader = new FileReader();

		reader.onload = () => {
			const binaryData = reader.result;
			resolve( binaryData );
		};

		reader.onerror = () => {
			reject( new Error( __( 'An error occurred while converting to binary data', dpaa.i18n ) ) );
		};

		if ( isBase64 ) {
			reader.readAsDataURL(blob);
		} else {
			reader.readAsBinaryString(blob);
		}
	} );
}