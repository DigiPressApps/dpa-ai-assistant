// HTMLからテキストを抽出
export const cleanHtmlToText = ( html ) => {
	const doc = new DOMParser().parseFromString( html, 'text/html' );
	return doc.body.textContent || "";
}

export const isNewlinesOnly = ( text ) => {
  return /^(\n)+$/.test( text );
}