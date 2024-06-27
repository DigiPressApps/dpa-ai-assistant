/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button,
	Flex,
	FlexItem,
	__experimentalSpacer as Spacer,
	__experimentalText as Text,
	__experimentalInputControl as InputControl,
} from '@wordpress/components'
import {
	arrowLeft as arrowLeftIcon,
	arrowRight as arrowRightIcon,
} from '@wordpress/icons'

export const DatasetPagination = props => {
	const {
		isLoading,
		total,
		currentPageNum,
		numPerPage,
		onChangePage,
	} = props

	const totalPages = Math.ceil( total / numPerPage );

	const handlePrev = () => {
		if ( currentPageNum > 1 ) {
			onChangePage( currentPageNum - 1 );
		}
	};

	const handleNext = () => {
		if ( currentPageNum < totalPages ) {
			onChangePage( currentPageNum + 1 );
		}
	};

	const handleInputPageNum = ( pageNum ) => {
		onChangePage( parseInt( pageNum ) );
	}

	return (
		<Spacer marginTop={ 5 }>
			<Flex
				direction='row'
				gap={ 4 }
				justify='center'
				align='center'
				wrap={ true }
			>
				<FlexItem>
					<Button
						label={ __( 'Previous' ) }
						icon={ arrowLeftIcon }
						iconSize={ 18 }
						size='compact'
						disabled={ currentPageNum === 1 || !totalPages || isLoading }
						variant='primary'
						onClick={ handlePrev }
					/>
				</FlexItem>
				<FlexItem>
					<Flex direction='row' gap={ 2 } wrap={ false } align='center' justify='center'>
						<FlexItem>
							<InputControl
								size='default'
								value={ currentPageNum || 1 }
								min={ 1 }
								max={ totalPages || 1 }
								onChange={ handleInputPageNum }
								type='number'
								placeholder={ 4 }
								disabled={ isLoading }
							/>
						</FlexItem>
						<FlexItem>
							<Text lineHeight={ 1.8 } size='13px'> / { totalPages || '1' }</Text>
						</FlexItem>
					</Flex>
				</FlexItem>
				<FlexItem>
					<Button
						label={ __( 'Next' ) }
						icon={ arrowRightIcon }
						iconSize={ 18 }
						size='compact'
						disabled={ currentPageNum === totalPages || !totalPages || isLoading }
						variant='primary'
						onClick={ handleNext }
						
					/>
				</FlexItem>
				<FlexItem>
					<Text lineHeight={ 1.8 } size='13px'>{ `( ${ total } ${ __( 'entries', dpaa.i18n ) } )` }</Text>
				</FlexItem>
			</Flex>
		</Spacer>
	)
}