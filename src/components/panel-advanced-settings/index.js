/**
 * Internal dependencies
 */
import './editor.scss'
import { useGlobalState } from '@dpaa/util'

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	memo,
	useState,
	useRef,
} from '@wordpress/element'
import {
	FormToggle,
	Panel,
	PanelBody,
	Icon,
} from '@wordpress/components'
import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'

// 選択したパネル以外閉じる
const closeAllOpenPanels = ( clickedEl ) => {

	const allPanelToggles = document.querySelectorAll( '.dpaa-toggle-panel-body .components-panel__body-toggle' );

	[].forEach.call( allPanelToggles || [], el => {
		if ( el.offsetHeight === 0 ) {
			return
		}

		if ( el.parentElement.parentElement.classList.contains( 'is-opened' ) ) {

			if ( clickedEl.querySelector( '.components-panel__body-toggle' ) !== el ) {
				// Allow other panels to override the auto-closing behavior.
				if ( applyFilters( 'dpaa.panel.tabs.panel-auto-close', true, el ) ) {
					el.click()
				}
			}
		}
	} )
}

export const PanelAdvancedSettings = props => {
	const {
		id = '',
		className = '',
		title = __( 'Settings', dpaa.i18n ),
		checked = false,
		onChange = undefined,
		initialOpen = false,
		hasToggle = true,
		initialAdvanced = false,
		advancedExpandPhrase = __( 'Show all', dpaa.i18n ),
		advancedFoldPhrase = __( 'Fold', dpaa.i18n ),
		advancedChildren = undefined,
		onToggle = () => {}, 
		isOpen = undefined,
		header = undefined,
		icon = undefined,
		titleLeftIcon = undefined,
		titleLeftIconSize = '20',
		children = undefined,
	} = props

	// Remember whether this panel was open/closed before.
	const { isSelected, name } = useBlockEditContext()
	const [ tab ] = useGlobalState( `tabCache-${ name }`, 'style' )
	const [ isInitialOpen, setIsInitialOpen ] = useGlobalState( `panelCache-${ name }-${ tab }-${ title }`, initialOpen )
	const [ isCurrentOpen, setIsCurrentOpen ] = useState( isInitialOpen )
	const [ showAdvanced, setShowAdvanced ] = useState( initialAdvanced )

	// onToggle で自分自身のノードを closeAllOpenPanels メソッドに渡すために必要
	const panelBodyRef = useRef( null );

	const hasCurrentToggle = hasToggle && onChange

	const onCurrentToggle = () => {
		setIsCurrentOpen( ! isCurrentOpen )
		setIsInitialOpen( ! isCurrentOpen )
		if ( onToggle ) {
			onToggle( ! isCurrentOpen )
		}

		// panelBodyRef.current は PanelBody の DOM ノードを参照します
		if ( panelBodyRef.current ) {
			closeAllOpenPanels( panelBodyRef.current )
		}
	}

	const wrapperClasses = classnames( [
		className,
		'dpaa-toggle-panel-body',
	], {
		'dpaa-toggle-panel-body--advanced': showAdvanced,
		[ `dpaa-panel--${ id }` ]: id,
	} )

	const Title = memo( () => {
		return (
			<>
				{ hasCurrentToggle && (
					<span className={ `editor-panel-toggle-settings__panel-title` }>
						<FormToggle
							className="dpaa-toggle-panel-form-toggle"
							checked={ checked }
							onClick={ ev => {
								ev.stopPropagation()
								ev.preventDefault()
								if ( checked && isCurrentOpen ) {
									// Comment this out since it jumps the inspector.
									// this.onToggle()
								} else if ( ! checked && ! isCurrentOpen ) {
									onCurrentToggle()
								}
								if ( onChange ) {
									onChange( ! checked )
								}
							} }
							aria-describedby={ title }
						/>
						{ title }
					</span>
				) }
				{ ! hasCurrentToggle && title }
			</>
		)
	} )

	return ( isSelected || ! name ) && ( // If there's no name, then the panel is used in another place.
		<Panel>
			<PanelBody
				className={ wrapperClasses }
				initialOpen={ isInitialOpen }
				onToggle={ onCurrentToggle }
				opened={ isOpen !== null ? isOpen : isCurrentOpen }
				title={ titleLeftIcon
					?
					 <>
					 	<Icon
							icon={ titleLeftIcon }
							className='dpaa-panel-advanced__title-icon'
							size={ titleLeftIconSize }
						/>
						<Title />
					 </>
					:
					 <Title />
				}
				header={ header }
				icon={ icon }
				ref={ panelBodyRef }
			>
				{ children }
				{ showAdvanced && advancedChildren }
				{ advancedChildren && (
					<button
						className="dpaa-panel-advanced-button"
						onClick={ () => setShowAdvanced( ! showAdvanced ) }
					>
						{ showAdvanced ? advancedFoldPhrase : advancedExpandPhrase }
					</button>
				) }
			</PanelBody>
		</Panel>
	)
}

export default PanelAdvancedSettings