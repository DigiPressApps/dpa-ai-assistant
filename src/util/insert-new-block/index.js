/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'

export const insertNewBlock = ( props ) => {
	const {
		blockName = 'core/paragraph',
		args = null,
		insertBlockFunc = undefined,
		insertPosition = -1,	// 末尾
	} = props

	if ( !args || !insertBlockFunc ) {
		return false
	}

	const newBlock = createBlock( blockName, args );

	return insertBlockFunc( newBlock, insertPosition ) || false;
}