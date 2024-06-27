import './editor.scss'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Popover } from '@wordpress/components'
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	omit, omitBy, keys,
} from 'lodash'

const urlLabels = [
	{
		id: 'opensInNewTab',
		title: __( 'Open in new tab' ),
	},
	{
		id: 'noFollowLink',
		title: __( 'Set nofollow', 'dpaa' ),
	},
	{
		id: 'sponsored',
		title: __( 'Set sponsored', 'dpaa' ),
	},
	{
		id: 'ugc',
		title: __( 'Set ugc', 'dpaa' ),
	},
]

export const URLInputPopover = props => {
	const {
		url,
		newTab,
		noFollow,
		sponsored,
		ugc,
	} = props

	const urlOptions = {
		url,
		opensInNewTab: newTab,
		noFollowLink: noFollow,
		sponsored,
		ugc,
	}

	if ( ! props.onChangeUrl ) {
		return null
	}

	const mainClassName = classnames( [
		'dpaa-url-input-popover',
	] )

	const linkControlSettings = urlLabels.filter( ( { id } ) => {
		// Filters the options based on existing onChange props
		switch ( id ) {
			case 'opensInNewTab': return props.onChangeNewTab
			case 'noFollowLink': return props.onChangeNoFollow
			case 'sponsored': return props.onChangeSponsored
			case 'ugc': return props.onChangeUgc
			default: return true
		}
	} )

	return (
		<Popover
			className={ mainClassName }
			focusOnMount={ props.popoverFocusOnMount }
			position={ props.position }
			anchor={ props.anchor }
			onClose={ props.onClosePopover }
		>
			<LinkControl
				className={ props.linkControlClassName }
				value={ urlOptions }
				showSuggestions={ ! props.disableSuggestions }
				settings={ linkControlSettings }
				onChange={
					option => {
						const onChangeKeys = {
							url: props.onChangeUrl,
							opensInNewTab: props.onChangeNewTab,
							noFollowLink: props.onChangeNoFollow,
							sponsored: props.onChangeSponsored,
							ugc: props.onChangeUgc,
						}

						// Gets only the changed values to update
						const changedValues = omitBy( omit( option, 'id', 'title', 'type' ), ( value, key ) => {
							return urlOptions[ key ] === value
						} )

						// Trigger onChange only to changed values
						keys( changedValues ).forEach( value => {
							onChangeKeys[ value ]?.( changedValues[ value ] )
						} )
					}
				}
				onRemove={ props.onRemoveLinkControl }
			/>
		</Popover>
	)
}

URLInputPopover.defaultProps = {
	url: '',
	newTab: false,
	noFollow: false,
	sponsored: false,
	ugc: false,
	disableSuggestions: false,
	popoverFocusOnMount: 'firstElement',
	linkControlClassName: null,
	position: 'bottom center',
	anchor: undefined,
	onChangeUrl: null,
	onChangeNewTab: null,
	onChangeNoFollow: null,
	onChangeSponsored: null,
	onChangeUgc: null,
	onClosePopover: null,
	onRemoveLinkControl: null,
}

export default URLInputPopover
