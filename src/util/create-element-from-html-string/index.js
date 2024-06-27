/**
 * Create a DOM Element based on HTML string
 *
 * @param {string} htmlString
 *
 * @return {*} DOM Element
 */
export const createElementFromHTMLString = htmlString => {
	const parentElement = document.createElement( 'div' )
	parentElement.innerHTML = htmlString

	return parentElement.firstElementChild
}