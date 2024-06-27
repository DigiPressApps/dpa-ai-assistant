/**
 * Internal dependencies
 */
import './editor.scss'
import {
	AuthorSelector,
	DropdownRenderToggleButton,
	TaxonomyControl,
	UpgradeLabel,
} from '@dpaa/components'
import { usePostTypes } from './util'

/**
 * WordPress dependencies
 */
import {
	BaseControl,
	DateTimePicker,
	Flex,
	FlexItem,
	SelectControl,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
} from '@wordpress/components'
import {
	dateI18n,
	getSettings
} from '@wordpress/date'
import { __ } from '@wordpress/i18n'

export const QueryControl = props => {
	const {
		postType = 'post',
		authors = null,
		maxAuthors = 0,
		taxonomyQuery = null,
		currentDate = new Date(),
		onChangePostType = undefined,
		onChangeDate = undefined,
		onChangeDateReset = undefined,
		onChangeAuthors = undefined,
		onChangeTaxonomyQuery = undefined,
	} = props

	// WordPressの日付フォーマットを取得
	const dateFormat = getSettings().formats.date

	// 投稿タイプの取得
	const { postTypesTaxonomiesMap, postTypesSelectOptions } = usePostTypes();

	// ドロップダウンの挙動
	const popoverProps = {
		placement: 'bottom-start',
		offset: 5,
		shift: true,
	};

	// 日付選択ドロップダウン
	const DateSelector = ( { label, currentDate, onChange, onReset } ) => (
		<BaseControl
			label={ label }
			className="dpaa-inspector__dropdown-period-control"
		>
			<Dropdown
				popoverProps={ popoverProps }
				className="dpaa-inspector__dropdown-period"
				renderToggle={ ( { onToggle, isOpen } ) => {
					return (
						<DropdownRenderToggleButton
							icon='calendar-alt'
							iconSize={ 20 }
							size='default'
							text={ currentDate ? dateI18n( dateFormat, currentDate ) : label }
							variant='secondary'
							useResetButton={ currentDate && true }
							onChangeReset={ onReset }
							onToggle={ onToggle }
							isOpen={ isOpen }
						/>
					)
				} }
				renderContent={ () => (
					<DropdownContentWrapper paddingSize="medium">
						<BaseControl
							label={ label }
							className="dpaa-inspector__dropdown-period-content"
						>
							<DateTimePicker
								__nextRemoveResetButton
								currentDate={ currentDate }
								onChange={ onChange }
								startOfWeek={ 1 }
								is12Hour
							/>
						</BaseControl>
					</DropdownContentWrapper>
				)}
			/>
		</BaseControl>
	);

	return (
		<Flex
			direction='column'
			gap={ 1 }
		>
			{ onChangePostType && (
				<FlexItem>
					<SelectControl
						__next40pxDefaultSize
						size='__unstable-large'
						options={ postTypesSelectOptions }
						value={ postType }
						label={ <>
							{ __( 'Post type', dpaa.i18n ) }
							<UpgradeLabel text={ __( 'More Types?', dpaa.i18n ) } />
						</> }
						onChange={ onChangePostType }
					/>
				</FlexItem>
			) }
			{ onChangeTaxonomyQuery && (
				<FlexItem>
					<TaxonomyControl
						query={ {
							postType,
							taxonomyQuery,
						} }
						onChange={ onChangeTaxonomyQuery }
					/>
				</FlexItem>
			) }
			{ onChangeAuthors && (
				<FlexItem>
					<AuthorSelector
						value={ authors }
						onChange={ onChangeAuthors }
						maxLength={ maxAuthors }
					/>
				</FlexItem>
			) }
			{ onChangeDate && (
				<FlexItem>
					<DateSelector
						label={ __( 'Public', dpaa.i18n ) }
						currentDate={ currentDate }
						onChange={ onChangeDate }
						onReset={ onChangeDateReset }
					/>
				</FlexItem>
			) }
		</Flex>
	)
}

export default QueryControl