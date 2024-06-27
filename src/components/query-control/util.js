/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useMemo } from '@wordpress/element'
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Returns a helper object that contains:
 * 1. An `options` object from the available post types, to be passed to a `SelectControl`.
 * 2. A helper map with available taxonomies per post type.
 *
 * @return {Object} The helper object related to post types.
 * 
 * @see https://github.com/WordPress/gutenberg/blob/820b13599bf12f5efa472e36a780cd63e86a67b3/packages/block-library/src/query/utils.js#L89
 */
export const usePostTypes = () => {
	const postTypes = useSelect( ( select ) => {
		const { getPostTypes } = select( coreStore );
		const excludedPostTypes = [ 'attachment' ];
		const filteredPostTypes = getPostTypes( { per_page: -1 } )?.filter(
			( { viewable, slug } ) =>
				viewable && ! excludedPostTypes.includes( slug )
		);
		return filteredPostTypes;
	}, [] );
	const postTypesTaxonomiesMap = useMemo( () => {
		if ( ! postTypes?.length ) return;
		return postTypes.reduce( ( accumulator, type ) => {
			accumulator[ type.slug ] = type.taxonomies;
			return accumulator;
		}, {} );
	}, [ postTypes ] );
	const postTypesSelectOptions = [
		{ 
			label: __( 'Post', dpaa.i18n ),
			value: 'post',
		},
		{ 
			label: __( 'Page', dpaa.i18n ),
			value: 'page',
		},
	];

	return { postTypesTaxonomiesMap, postTypesSelectOptions };
};