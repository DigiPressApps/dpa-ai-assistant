/**
 * Internal dependencies
 */
import { UpgradeLabel } from '@dpaa/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

// @see https://github.com/WordPress/gutenberg/blob/7b5e167c6cc6cd3de23b9d2832366db9ad738b08/packages/block-library/src/query/utils.js#L38
/**
 * Returns a helper object with mapping from Objects that implement
 * the `IHasNameAndId` interface. The returned object is used for
 * integration with `FormTokenField` component.
 *
 * @param {IHasNameAndId[]} entities The entities to extract of helper object.
 * @return {QueryEntitiesInfo} The object with the entities information.
 */
const getEntitiesInfo = ( entities ) => {
	const mapping = entities?.reduce(
		( accumulator, entity ) => {
			const { mapById, mapByName, names } = accumulator;
			mapById[ entity.id ] = entity;
			mapByName[ entity.name ] = entity;
			names.push( entity.name );
			return accumulator;
		},
		{ mapById: {}, mapByName: {}, names: [] }
	);
	return {
		entities,
		...mapping,
	};
};

const AUTHORS_QUERY = {
	who: 'authors',
	per_page: -1,
	_fields: 'id,name',
	context: 'view',
};

const AuthorSelector = props => {
	const {
		onChange = undefined,
		value = null,
		maxLength = 100,	// 全取得 = 0
		placeholder = __( 'Enter author name', dpaa.i18n )
	} = props

	const authorsList = useSelect( ( select ) => {
		const { getUsers } = select( coreStore );
		return getUsers( AUTHORS_QUERY );
	}, [] );

	if ( ! authorsList ) {
		return null;
	}

	const authorsInfo = getEntitiesInfo( authorsList );
	/**
	 * We need to normalize the value because the block operates on a
	 * comma(`,`) separated string value and `FormTokenFiels` needs an
	 * array.
	 */
	const normalizedValue = ! value
		? []
		: ( typeof value === 'string' || typeof value === 'number' )
			? value.toString().split( ',' )
			: Array.isArray( value )
				? value
				: []
	// Returns only the existing authors ids. This prevents the component
	// from crashing in the editor, when non existing ids are provided.
	const sanitizedValue = normalizedValue.reduce(
		( accumulator, authorId ) => {
			const author = authorsInfo.mapById[ authorId ];
			if ( author ) {
				accumulator.push( {
					id: authorId,
					value: author.name,
				} );
			}
			return accumulator;
	}, [] );

	const getIdByValue = ( entitiesMappedByName, authorValue ) => {
		const id = authorValue?.id || entitiesMappedByName[ authorValue ]?.id;
		if ( id ) return id;
	};

	const onAuthorChange = ( newValue ) => {
		const ids = Array.from(
			newValue.reduce( ( accumulator, author ) => {
				// Verify that new values point to existing entities.
				const id = getIdByValue( authorsInfo.mapByName, author );
				if ( id ) accumulator.add( id );
				return accumulator;
			}, new Set() )
		);
		onChange( { author: ids } );
	};

	return (
		<FormTokenField
			label={ <>
				{ __( 'Authors', dpaa.i18n ) }
				<UpgradeLabel text={ __( 'Other Author?', dpaa.i18n ) } />
			</> }
			value={ sanitizedValue }
			suggestions={ authorsInfo.names }
			onChange={ onAuthorChange }
			maxLength={ maxLength }
			placeholder={ placeholder }
			__experimentalShowHowTo={ false }
			__experimentalExpandOnFocus={ ( !value || value?.length < maxLength ) ? true : false }
			__next40pxDefaultSize={ true }
		/>
	);
}

export default AuthorSelector;