// HTMLエスケープを適用する関数
export const escapeHtml = ( html ) => {
	return html.replace( /[&<"']/g, ( match ) => {
		return {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		}[ match ];
	} );
}