export const escapeAttribute = ( str ) => {
	if ( typeof str !== 'string' ) return str
	return str.replace( /["]/g, function( match ) {
		return {
			'"': '&quot;',
		}[match]
	} );
}