/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'
import { createReduxStore, register } from '@wordpress/data'

/**
 * Internal dependencies
 */
import {
	DEFAULT_STATE,
	FETCH_SETTINGS,
	SET_USER_PREFERENCES,
	STATE_FROM_DATABASE,
	SET_SETTING,
	STORE_NAME,
	USER_PREFERENCES_NAME,
	OPTION_NAME,
} from './constants';

// Dispatch to the registered reduer.
const actions = {
	initSettings( settings ) {
		return {
			type: STATE_FROM_DATABASE,
			payload: {
				...settings,
			},
		};
	},
	fetchSettings() {
		return {
			type: FETCH_SETTINGS,
			payload: {},
		};
	},
	setSetting( setting, value ) {
		if ( typeof setting === 'object' ) {
			const key = Object.keys( setting )[ 0 ];
			return {
				type: SET_SETTING,
				payload: {
					setting: key,
					subSetting: setting[ key ],
					value,
				},
			};
		} else {
			return {
				type: SET_SETTING,
				payload: {
					setting,
					value,
				},
			};
		}
	},
	setUserPreferences( userPreferences ) {
		return {
			type: SET_USER_PREFERENCES,
			payload: {
				userPreferences,
			},
		};
	},
	setToggleState( section ) {
		return function ( { select, dispatch } ) {
			const currentValues = select.getUserPreferences();
			const sectionValue = currentValues[section];
			dispatch.setUserPreferences({
				...currentValues,
				[ section ]: !sectionValue,
			});
		};
	},
}

// Define the reducer (Update the state)
const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case STATE_FROM_DATABASE:
			return {
				...state,
				...action.payload,
			}
		case SET_SETTING:
			const { setting, subSetting, value } = action.payload;
			if ( subSetting ) {
				return {
					...state,
					[ setting ]: {
						...state[ setting ],
						[ subSetting ]: value,
					},
				};
			} else {
				return {
					...state,
					[ setting ]: value,
				};
			}
		case SET_USER_PREFERENCES:
			if ( action.payload ) {
				window.localStorage.setItem(
					USER_PREFERENCES_NAME,
					JSON.stringify( action.payload )
				);
			}
			return {
				...state,
				...action.payload,
			}
		default:
			return state;
	}
}

// Get the data from state.
const selectors = {
	getSettings( state ) {
		const { userPreferences, ...settings } = state;
		return settings;
	},
	getUserPreferences( state ) {
		return state.userPreferences;
	},
}

const resolvers = {
	getSettings() {
		return async ( { dispatch } ) => {
			// オプション取得用カスタムエンドポイントからGET
			const settings = await apiFetch( {
				path: `${ STORE_NAME }/v1/get_option?name=${ OPTION_NAME }`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': dpaa.apiNonce,
				},
			} );
			if ( settings ) {
				dispatch.initSettings( settings );
			}
		}
	},
	getUserPreferences() {
		return ( { dispatch } ) => {
			const userPreferences =
				window.localStorage.getItem(
					USER_PREFERENCES_NAME
				) || DEFAULT_STATE.userPreferences;
			dispatch.setUserPreferences( JSON.parse( userPreferences ) );
		};
	},
}

const controls = {
	FETCH_SETTINGS() {
		return apiFetch( {
			path: `${ STORE_NAME }/v1/get_option?name=${ OPTION_NAME }`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': dpaa.apiNonce,
			},
		} );
	},
}

// Define and register the store.
const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	controls,
	selectors,
	resolvers,
} )

register( store )