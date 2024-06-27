/**
 * Returns an array range of numbers.
 *
 * @param {number} start Starting number range.
 * @param {number} end Ending number range.
 *
 * @return {Array} The range of start to end.
 *
 * @see https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
 */
export const arrayRangeOfNumbers = ( start, end ) => {
	return Array.from( { length: ( end - start ) }, ( v, k ) => k + start )
}