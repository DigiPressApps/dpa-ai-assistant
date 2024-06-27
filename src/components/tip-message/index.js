/**
 * WordPress dependencies
 */
import {
	Snackbar,
	Spinner,
} from '@wordpress/components'
import {
	memo,
	useEffect,
	useState,
} from '@wordpress/element'

export const TipMessage = memo( props => {
	const {
		actions = [],	// [ { label: 'ラベル', url: 'https://' } ]
		explicitDismiss = false,
		message = '',
		isLoading = false,
		countUpRef = undefined,
		onRemove = undefined,
		duration = 99999,
	} = props

	const [ isVisible, setIsVisible ] = useState( true );

	useEffect( () => {
		if ( duration && typeof duration === 'number' ) {
			const timer = setTimeout( () => {
				setIsVisible( false );
			}, duration );

			return () => clearTimeout(timer);
		}
	}, [ duration ] );

	const snackbar = <>
		{ message && (
			<Snackbar
				className='dpaa-modal--aiassistant__log__snackbar'
				as='text'
				actions={ actions }
				explicitDismiss={ explicitDismiss }
				onRemove={ onRemove }
			>
				<Spinner style={ !isLoading ? { display: 'none', } : null } />
				{ message }
				{/* <span className='dpaa-snackbar--count-up-timer' ref={ countUpRef } style={ !countUpRef ? { display: 'none', } : null } /> */}
			</Snackbar>
		) }
	</>

	return snackbar;
} )

export default TipMessage;