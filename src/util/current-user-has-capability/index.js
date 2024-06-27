import { select } from '@wordpress/data'
import apiFetch from '@wordpress/api-fetch'
import { addQueryArgs } from '@wordpress/url'
import { store as coreStore } from '@wordpress/core-data';

/**
 * Checks whether the current user has a certain capability.
 *
 * @param {string} cap The capability to check e.g. 'manage_options'
 */
export const currentUserHasCapability = async ( cap = 'manage_options' ) => {
	const id = select( coreStore ).getCurrentUser()?.id

	let result = false

	if ( id ) {
		result = await apiFetch( {
			path: addQueryArgs( `/wp/v2/users/${ id }`, {
				context: 'edit',
			} ),
		} )
	} else {
		result = await apiFetch( {
			path: addQueryArgs( '/wp/v2/users/me', {
				context: 'edit',
			} ),
		} )
	}

	return result?.capabilities[ cap ] || false
}