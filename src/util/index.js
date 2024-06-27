/**
 * Exports
 */
export * from "./array-range-of-numbers";
export * from "./base64-to-blob";
export * from "./blob-to-binary-or-base64";
export * from "./clean-html-to-text";
export * from "./clipboard";
export * from "./convert-markdown-to-html";
export * from "./create-element-from-html-string";
export * from "./create-post";
export * from "./current-user-has-capability";
export * from "./escape-attribute";
export * from "./escape-html";
export * from "./fetch-blob-from-external-url";
export * from "./get-audio-data-from-url";
export * from "./get-current-post-id";
export * from "./get-sysinfo";
export * from "./insert-new-block";
export * from "./is-local-url";
export * from "./media-library";
export * from "./open-ai";
export * from "./play-audio-from-blob";
export * from "./range";
export * from "./stability-ai";
export * from "./url-is-image-or-video";
export * from "./url-to-base64-image";
export * from "./use-global-state";
export * from "./use-local-storage";

export const escapeHtml = ( str ) => {
	if( typeof str !== 'string' ) return str
	return str.replace(/[&'`"<>]/g, function(match) {
		return {
			'&': '&amp;',
			"'": '&#x27;',
			'`': '&#x60;',
			'"': '&quot;',
			'<': '&lt;',
			'>': '&gt;',
		}[match]
	});

	return str;
}
export const escapeAttribute = ( str ) => {
	if( typeof str !== 'string' ) return str

	return str.replace(/["]/g, function(match) {
		return {
			'"': '&quot;',
		}[match]
	});
}

export const isFloat = ( n ) => {
  return Number( n ) === n && n % 1 !== 0;
}

export const getDecimalPointLength =( n ) => {
  return ( String( n ).split( '.' )[1] || '' ).length;
}

// Base64形式の文字列かどうかをチェックする方法
export const isBase64 = ( str ) => {
	const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
	return base64Regex.test( str );
}