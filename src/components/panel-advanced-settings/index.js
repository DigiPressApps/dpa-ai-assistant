/**
 * Internal dependencies
 */
import './editor.scss'
import { useGlobalState } from '../../util/use-global-state'

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
	// Remember whether this panel was open/closed before.
	const { isSelected, name } = useBlockEditContext()
	const [ tab ] = useGlobalState( `tabCache-${ name }`, 'style' )
	const [ initialOpen, setInitialOpen ] = useGlobalState( `panelCache-${ name }-${ tab }-${ props.title }`, props.initialOpen )

	const [ isOpen, setIsOpen ] = useState( initialOpen )
	const [ showAdvanced, setShowAdvanced ] = useState( props.initialAdvanced )

	// onToggle で自分自身のノードを closeAllOpenPanels メソッドに渡すために必要
	const panelBodyRef = useRef(null);

	const hasToggle = props.hasToggle && props.onChange

	const onToggle = () => {
		setIsOpen( ! isOpen )
		setInitialOpen( ! isOpen )
		if ( props.onToggle ) {
			props.onToggle( ! isOpen )
		}

		// panelBodyRef.current は PanelBody の DOM ノードを参照します
		if ( panelBodyRef.current ) {
			closeAllOpenPanels( panelBodyRef.current )
		}
	}

	const wrapperClasses = classnames( [
		props.className,
		'dpaa-toggle-panel-body',
	], {
		'dpaa-toggle-panel-body--advanced': showAdvanced,
		[ `dpaa-panel--${ props.id }` ]: props.id,
	} )

	const Title = memo( () => {
		return (
			<>
				{ hasToggle && (
					<span className={ `editor-panel-toggle-settings__panel-title` }>
						<FormToggle
							className="dpaa-toggle-panel-form-toggle"
							checked={ props.checked }
							onClick={ ev => {
								ev.stopPropagation()
								ev.preventDefault()
								const checked = props.checked
								if ( checked && isOpen ) {
									// Comment this out since it jumps the inspector.
									// this.onToggle()
								} else if ( ! checked && ! isOpen ) {
									onToggle()
								}
								if ( props.onChange ) {
									props.onChange( ! checked )
								}
							} }
							aria-describedby={ props.title }
						/>
						{ props.title }
					</span>
				) }
				{ ! hasToggle && props.title }
			</>
		)
	} )

	return ( isSelected || ! name ) && ( // If there's no name, then the panel is used in another place.
		<Panel>
			<PanelBody
				className={ wrapperClasses }
				initialOpen={ initialOpen }
				onToggle={ onToggle }
				opened={ props.isOpen !== null ? props.isOpen : isOpen }
				title={ props.titleLeftIcon
					?
					 <>
					 	<Icon
							icon={ props.titleLeftIcon }
							className='dpaa-panel-advanced__title-icon'
							size={ props.titleLeftIconSize }
						/>
						<Title />
					 </>
					:
						<Title />
				}
				header={ props.header }
				icon={ props.icon }
				ref={ panelBodyRef }
			>
				{ props.children }
				{ showAdvanced && props.advancedChildren }
				{ props.advancedChildren && (
					<button
						className="dpaa-panel-advanced-button"
						onClick={ () => setShowAdvanced( ! showAdvanced ) }
					>
						{ showAdvanced ? props.advancedFoldPhrase : props.advancedExpandPhrase }
					</button>
				) }
			</PanelBody>
		</Panel>
	)
}

PanelAdvancedSettings.defaultProps = {
	id: '',
	className: '',
	title: __( 'Settings', dpaa.i18n ),
	checked: false,
	onChange: null,
	initialOpen: false,
	hasToggle: true,
	initialAdvanced: false,
	advancedExpandPhrase: __( 'Show all', dpaa.i18n ),
	advancedFoldPhrase: __( 'Fold', dpaa.i18n ),
	advancedChildren: null,
	onToggle: () => {},
	isOpen: null,
	header: null,
	icon: null,
	titleLeftIcon: null,
	titleLeftIconSize: '20'
}

export default PanelAdvancedSettings