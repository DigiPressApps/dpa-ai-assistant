
/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data'

export const getCurrentPostId = () => {
	const { getCurrentPostId } = select( 'core/editor' );
	return getCurrentPostId();
};