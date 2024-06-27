/**
 * Internal dependencies
 */
import './index'
import { STORE_NAME } from './constants'

/**
 * External dependencies
 */
import _ from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	useDispatch,
	useSelect,
} from '@wordpress/data'
import { store as coreStore } from '@wordpress/core-data'
import { useState } from '@wordpress/element'

export const saveGlobalSettings = () => {
	const [ isSaving, setIsSaving ] = useState( false )	
	const [ currentSettings, setCurrentSettings ] = useState( {} )	

	// 保存用アクション
	const { saveEntityRecord } = useDispatch( coreStore )

	// ストアからすべてのオプションを取得
	const settingsFromState = useSelect( ( select ) => {
		return select( STORE_NAME ).getSettings()
	}, [] )

	// オプションが取得できるまでスルー
	if ( !settingsFromState ) {
		setCurrentSettings( settingsFromState )
		return 
	}

	// 保存処理
	const save = () => {
		// 変更がないときはスルー
		if ( _.isEqual( currentSettings, settingsFromState ) || isSaving ){
			return false
		}

		// 保存中フラグ
		setIsSaving( true )

		// オプションの保存・更新
		const save = saveEntityRecord( 'root', 'site', {
			'dpaa_settings': settingsFromState,
		} )

		if ( save && typeof save == 'object' ) {
			setIsSaving( false )
			return true
		} else {
			setIsSaving( false )
			return false
		}
	}

	return save()
}

export default saveGlobalSettings