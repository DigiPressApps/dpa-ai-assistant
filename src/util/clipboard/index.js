/**
 * External dependencies
 */
import * as clipboard from "clipboard-polyfill";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

// 選択中のテキストを取得
export const getSelectedText = () => {
	const text = window.getSelection().toString();
	if ( text ) {
		return text
	}
	return ''
}

// 現在のクリップボードの内容(テキスト)を取得
export const getClipboardText = async () => {
	const text = await navigator.clipboard.readText()
	return text
}

// クリップボードに選択中の文字列をコピー
export const copyToClipboard = async ( data ) => {
	if ( !data ) return false
	try {
		if ( typeof data === 'string' && navigator?.clipboard?.writeText ) {
			await navigator.clipboard.writeText( data );
			return true
		} else if ( navigator?.clipboard?.write ) {
			await navigator.clipboard.write( data );
			return true
		}
	} catch ( error ) {
		console.error( error );
	}
	return false
}

// Base64イメージを Blob に変換
export const base64ImageToBlob = ( props ) => {
	const {
		base64Data = null,
		contentType = 'image/png',
		sliceSize = 512,
	} = props

	if ( !base64Data || typeof base64Data !== 'string' ) {
		return
	}

	const byteCharacters = atob( base64Data, 'base64' );
	const byteArrays = [];

	for ( let offset = 0; offset < byteCharacters.length; offset += sliceSize ) {
		const slice = byteCharacters.slice( offset, offset + sliceSize )
		const byteNumbers = new Array( slice.length ).fill( 0 ).map( ( _, i ) => slice.charCodeAt( i ) );
		const byteArray = new Uint8Array( byteNumbers );
		byteArrays.push( byteArray );
	}

	return new Blob( byteArrays, { type: contentType } );
}

// バイナリイメージデータをクリップボードにコピー
export const imageToClipboard = ( props ) => {
	return new Promise((resolve, reject) => {
		const {
			base64Data = null,
			contentType = 'image/png',
			sliceSize = 512,
		} = props

		if ( !base64Data ) {
			reject( __( 'No Base64 data!', dpaa.i18n ) )
		}

		const b64Data = base64Data.split( ',' )[ 1 ] || base64Data

		// Base64テキストをバイナリデータに変換
		const blob = base64ImageToBlob( {
			base64Data: b64Data,
			contentType: contentType,
			sliceSize: sliceSize,
		} )
		const clipboardItem = new ClipboardItem( { 'image/png': blob } )

		// クリップボードにコピー
		copyToClipboard( [ clipboardItem ] )
			.then( ( result ) => {
				resolve( result )
			} )
			.catch( ( error ) => {
				console.error( error )
				reject( __( 'Failed to copy to clipboard', dpaa.i18n ) )
			} )
	})
}