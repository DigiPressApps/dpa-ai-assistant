/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

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

const CATEGORY_QUERY = {
	per_page: -1,
	_fields: 'id,name,parent',
	context: 'view',
};

const CategorySelector = props => {
	const {
		label,
		value,
		onChange,
		maxLength,
		placeholder,
	} = props

	const categoriesList = useSelect( ( select ) => {
		const { getEntityRecords } = select( 'core' );
		return getEntityRecords( 'taxonomy', 'category', CATEGORY_QUERY );
	}, [] );

	if ( ! categoriesList ) {
		return null;
	}

	const categoriesInfo = getEntitiesInfo( categoriesList );

	const normalizedValue = !value
		? []
		: (typeof value === 'string' || typeof value === 'number')
			? value.toString().split(',')
			: Array.isArray(value)
				? value
				: [];

	const sanitizedValue = normalizedValue.reduce( ( accumulator, categoryId ) => {
		const category = categoriesInfo.mapById[ categoryId ];
		if ( category ) {
			accumulator.push( {
				id: categoryId,
				value: category.name,
				parent: category.parent,
			} );
		}
		return accumulator;
	}, []);

	const getIdByValue = ( entitiesMappedByName, authorValue ) => {
		const id = authorValue?.id || entitiesMappedByName[ authorValue ]?.id;
		if ( id ) return id;
	};

	const onCategoryChange = ( newValue ) => {
		const ids = Array.from(
			newValue.reduce( ( accumulator, category ) => {
				// Verify that new values point to existing entities.
				const id = getIdByValue( categoriesInfo.mapByName, category );
				if ( id ) accumulator.add( id );
				return accumulator;
			}, new Set() )
		);
		onChange( { category: ids } );
	};

	return (
		<FormTokenField
			label={ label }
			value={ sanitizedValue }
			suggestions={ categoriesInfo.names }
			onChange={ onCategoryChange }
			maxLength={ maxLength }
			placeholder={ placeholder }
			__experimentalShowHowTo={ false }
			__experimentalExpandOnFocus={ true }
			__next40pxDefaultSize={ true }
		/>
	);
}

CategorySelector.defaultProps = {
	label: __( 'Categories' ),
	onChange: undefined,
	value: null,
	maxLength: 100,	// 全取得: 0
	placeholder: __( 'Enter category name', dpaa.i18n )
}

export default CategorySelector;