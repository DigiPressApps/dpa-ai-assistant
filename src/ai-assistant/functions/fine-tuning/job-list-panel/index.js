/**
 * Internal dependencies
 */
import {
	getFineTuningJobsList,
	deleteFineTunedModel,
	cancelFineTuningJob,
} from '@dpaa/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl,
} from '@wordpress/components'
import {
	useEffect,
	useState,
} from '@wordpress/element'
import { RenderPanelOperationArea } from './render-panel-operation-area'
import { RenderJobListHeader } from './render-job-list-header'
import { RenderJobLine } from './render-job-line'

export const JobListPanel = props => {
	const {
		openai,
		jobs,
		jobsUpTo,
		uploadedFiles,
		targetSelecter,
		setIsLoading,
		setTipMessage,
	} = props

	if ( !jobs ) {
		return null
	}

	const [ currentJobs, setCurrentJobs ] = useState( jobs )
	const [ succeededJobs, setSucceededJobs ] = useState( null )
	const [ renderedSucceededJobs, setRenderedSucceededJobs ] = useState( null )
	const [ failedJobs, setFailedJobs ] = useState( null )
	const [ renderedFailedJobs, setRenderedFailedJobs ] = useState( null )
	const [ runningJobs, setRunningJobs ] = useState( null )
	const [ renderedRunningJobs, setRenderedRunningJobs ] = useState( null )
	const [ renderedJobs, setRenderedJobs ] = useState( null )
	const [ currentList, setCurrentList ] = useState( 'succeeded' )

	// モデルの削除
	const calbackDeleteFineTunedModel = async ( model ) => {
		if ( !model ) {
			return null
		}

		if ( window.confirm( `"${ model }"\n\n${ __( 'Are you sure you want to delete?', dpaa.i18n ) }\n${ __( 'It will take some time for it to actually be removed from OpenAI.', dpaa.i18n ) }` ) ) {

			let response = false
			try {
				setIsLoading( true )
				setTipMessage( { message: __( 'Deleting...', dpaa.i18n ) } )

				response = await deleteFineTunedModel( { openai: openai, model: model } )

			} catch ( error ) {
				console.error( 'Failed to delete a fine-tuned model.', error )
				alert( error )
			} finally {
				setIsLoading( false )
				setTipMessage( { message: '' } )
				if ( response?.deleted ) {
					setTipMessage( { message: `${ __( 'Deleted!', dpaa.i18n ) } ID: ${ response.id }` } )
					setTimeout( () => {
						setTipMessage( { message: '' } )
					}, 3000 );
				}
			}
		}
	}

	// ジョブのキャンセル
	const calbackCalcelJob = async ( id ) => {
		if ( !id ) {
			return null
		}

		if ( window.confirm( __( 'Are you sure you want to cancel?', dpaa.i18n ) ) ) {
			let response = false
			try {
				setIsLoading( true )
				setTipMessage( { message: __( 'Cancelling...', dpaa.i18n ) } )
				response = await cancelFineTuningJob( { openai: openai, jobID: id } )

			} catch ( error ) {
				console.error( 'Failed to cancel a fine-tuning job.', error )
				alert( error )
			} finally {
				setIsLoading( false )
				setTipMessage( { message: '' } )
				if ( response?.status === 'cancelled' ) {
					setTipMessage( { message: `${ __( 'Cancelled!', dpaa.i18n ) } ID: ${ response?.id }` } )
					setTimeout( () => {
						setTipMessage( { message: '' } )
					}, 3000 );
				}
			}
		}
	}

	// リストの更新
	const callbackRefreshList =  async ( { showTip = false } ) => {
		let response = false
		try {
			setIsLoading( true )
			if ( showTip ) {
				setTipMessage( { message: __( 'Loading...', dpaa.i18n ) } )
			}

			// job一覧の取得
			response = await getFineTuningJobsList( { openai: openai, limit: jobsUpTo } )

		} catch ( error ) {
			console.error( 'Failed to get Fine tuned jobs list.', error )
			alert( error )
		} finally {
			setIsLoading( false )
			setTipMessage( { message: '' } )
			if ( response?.response?.ok ) {
				setCurrentJobs( response.data )
				if ( showTip ) {
					setTipMessage( { message: __( 'Refreshed!', dpaa.i18n ) } )
					setTimeout( () => {
						setTipMessage( { message: '' } )
					}, 3000 );
				}
			}
		}
	}

	// レンダリング用のリストの作成
	const generateRenderingList = jobs => {
		if ( !jobs || !Array.isArray( jobs ) ) {
			return null
		}

		return (
			jobs.map( ( job, index ) => (
				<RenderJobLine
					job={ job }
					index={ index }
					uploadedFiles={ uploadedFiles }
					onClickCancel={ () => calbackCalcelJob( job?.id ) }
					onClickDelete={ () => calbackDeleteFineTunedModel( job?.fine_tuned_model ) }
				/>
			) )
		)
	}

	// ステータスごとのリストの取得
	useEffect( () => {
		if ( succeededJobs && Array.isArray( succeededJobs ) ) {
			setRenderedSucceededJobs( generateRenderingList( succeededJobs ) )
		}
		if ( failedJobs && Array.isArray( failedJobs ) ) {
			setRenderedFailedJobs( generateRenderingList( failedJobs ) )
		}
		if ( runningJobs && Array.isArray( runningJobs ) ) {
			setRenderedRunningJobs( generateRenderingList( runningJobs ) )
		}
	}, [ succeededJobs, failedJobs, runningJobs ] )

	// レンダリング
	useEffect( () => {
		if ( currentJobs && Array.isArray( currentJobs ) && currentJobs.length > 0 ) {
			// 成功したモデルの取得
			setSucceededJobs(
				currentJobs.filter( ( job, index ) => job?.status === 'succeeded' )
			)
			// 失敗したジョブの取得
			setFailedJobs(
				currentJobs.filter( ( job, index ) => job?.status === 'failed' )
			)
			// 処理中のジョブの取得
			setRunningJobs(
				currentJobs.filter( ( job, index ) => job?.status === 'running' )
			)

			setRenderedJobs( generateRenderingList( currentJobs ) )
		}
	}, [ currentJobs ] )

	return (
		<>
			<RenderPanelOperationArea
				currentList={ currentList }
				setCurrentList={ setCurrentList }
				targetSelecter={ targetSelecter }
				succeededJobs={ succeededJobs }
				failedJobs={ failedJobs }
				runningJobs={ runningJobs }
				onClickRefresh={ () => callbackRefreshList( { showTip: true } ) }
			/>
			<BaseControl className='dpaa-vertical-scrollable-area'>
				<RenderJobListHeader currentList={ currentList } />
				{ currentList === 'succeeded' && renderedSucceededJobs }
				{ currentList === 'failed' && renderedFailedJobs }
				{ currentList === 'running' && renderedRunningJobs }
			</BaseControl>
		</>
	)
}