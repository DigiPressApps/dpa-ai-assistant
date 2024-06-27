/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * External dependencies
 */
import { decode } from 'html-entities'
import useSWR from 'swr'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Icon,
	Spinner,
	ExternalLink,
	Flex,
	FlexItem,
	__experimentalScrollable as Scrollable,
	__experimentalGrid as Grid,
	__experimentalHeading as Heading,
} from '@wordpress/components'
import {
	dateI18n,
	getSettings,
} from '@wordpress/date'

export const DashboardTab = () => {
	const fetcher = ( ...args ) => fetch( ...args ).then( r => r.json() )

	const localFormat = getSettings().formats.date
	const baseEntry = 'https://dpapps.net/wp-json/wp/v2/';

	const pluginsEndpoints = [
		{
			title: <Flex direction='row' justify='flex-start' gap={ 2 } align='center'>
				<FlexItem>
					<Icon icon='admin-plugins' style={ { verticalAlign: 'middle' } } />
				</FlexItem>
				<FlexItem>
					{ __( 'Plugins', dpaa.i18n ) }
				</FlexItem>
			</Flex>,
			url: `${ baseEntry }posts?categories=2&per_page=100&_embed&orderby=title`,
			icon: undefined,
			type: 'post'
		},
		{
			title: <Flex direction='row' justify='flex-start' gap={ 2 } align='center'>
				<FlexItem>
					<Icon icon='media-document' style={ { verticalAlign: 'middle' } } />
				</FlexItem>
				<FlexItem>
					{ __( 'Documentation', dpaa.i18n ) }
				</FlexItem>
			</Flex>,
			url: `${ baseEntry }categories?parent=3&_embed`,
			icon: undefined,
			type: 'category'
		},
	]

	const postsEndpoints = [
		{
			title: <Flex direction='row' justify='flex-start' gap={ 2 } align='center'>
				<FlexItem>
					<Icon icon='clock' style={ { verticalAlign: 'middle' } } />
				</FlexItem>
				<FlexItem>
					{ __( 'Update History', dpaa.i18n ) }
				</FlexItem>
			</Flex>,
			url: `${ baseEntry }posts?categories=17&per_page=5`,
			icon: undefined,
			type: 'post'
		},
		{
			title: <Flex direction='row' justify='flex-start' gap={ 2 } align='center'>
				<FlexItem>
					<Icon icon='info' style={ { verticalAlign: 'middle' } } />
				</FlexItem>
				<FlexItem>
					{ __( 'Information', dpaa.i18n ) }
				</FlexItem>
			</Flex>,
			url: `${ baseEntry }news`,
			icon: undefined,
			type: 'post'
		},
	]

	const PluginsList = () => {
		return (
			pluginsEndpoints.map( ( endpoint, index ) => {
				const { data, error, isLoading } = useSWR( endpoint.url, fetcher );

				if ( error ) {
					return <div className='notice notice-error settings-error'  key={ index }>{ error }</div>;
				}

				if ( isLoading || !data ) {
					return (
						<div className='dpapps-admin__spinner'  key={ index }>
							<Spinner
								style={{
								height: 'calc(2px * 20)',
								width: 'calc(2px * 20)'
								}}
							/>
						</div>
					)
				}

				return (
					<FlexItem key={ index }>
						<Flex className='dpaa-box-shadow-element' direction='column' justify='flex-start' gap={ 3 }>
							<FlexItem>
								<Heading
									className='dpapps-admin__tab-item post-list-panel'
									color='#1d2327'
									isBlock
									level='3'
									adjustLineHeightForInnerControls='xSmall'
									style={ { fontSize: '16px', } }
								>
									{ endpoint.title }
								</Heading>
							</FlexItem>
							<FlexItem>
								<Grid
									className='dpapps-admin__block-list__grid'
									align='center'
									alignment='stretch'
									columnGap='20px'
									columns={ 3 }
									gap={ 5 }
								>
								{ data.map( ( item ) => {
									return (
										<div className="block-item">
											<a
												href={ item.link }
												className='block-image-link'
												target='_blank'
											>
											<Heading
												className="block-name"
												color='#1d2327'
												isBlock
												level='4'
											>
												{ decode( endpoint.type === 'category' ? item.name : item.title.rendered ) }
											</Heading>
											{ item?._embedded['wp:featuredmedia'] && (
												<img
													src={ item._embedded['wp:featuredmedia'][0].source_url }
													width={ `${ item._embedded['wp:featuredmedia'][0].media_details.width}` }
													height={ `${ item._embedded['wp:featuredmedia'][0].media_details.height}` } className='block-image'
												/>
											) }
											</a>
										</div>
									)
								} ) }
								</Grid>
							</FlexItem>
						</Flex>
					</FlexItem>
				)
			} )
		)
	}

	const PostsList = () => {
		return (
			postsEndpoints.map( ( endpoint, index ) => {
				const { data, error, isLoading } = useSWR( endpoint.url, fetcher );

				if ( error ) {
					return <div className='notice notice-error settings-error' key={ index }>{ error }</div>;
				}

				if ( isLoading || !data ) {
					return (
						<div className='dpapps-admin__spinner' key={ index }>
							<Spinner
								style={{
								height: 'calc(2px * 20)',
								width: 'calc(2px * 20)'
								}}
							/>
						</div>
					)
				}

				return (
					<FlexItem key={ index }>
						<Flex className='dpaa-box-shadow-element' direction='column' justify='flex-start' gap={ 3 }>
							<FlexItem>
								<Heading
									className='dpapps-admin__tab-item post-list-panel'
									color='#1d2327'
									isBlock
									level='3'
									adjustLineHeightForInnerControls='xSmall'
									style={ { fontSize: '16px', } }
								>
									{ endpoint.title }
								</Heading>
							</FlexItem>
							<FlexItem>
								<Scrollable
									scrollDirection='y'
									style={ {
										maxHeight: 400,
										width: '100%'
									} }
								>
									<Flex direction='column' gap={ 4 } justify='flex-start'>
										{ data.map( ( post, i ) => {
											return (
												<FlexItem>
													<Flex direction='row' gap={ 2 } justify='space-between' align='flex-start' key={ i }>
														<FlexItem style={ { flexBasis: '110px' } }>
															<span className="post-date">
																{ dateI18n(
																	localFormat,
																	post.date_gmt
																) }
															</span>
														</FlexItem>
														<FlexItem style={ { flexBasis: 'calc(100% - 110px' } }>
															<ExternalLink
																href={ post.link }
																className='post-link'
															>
																{ decode( post.title.rendered ) }
															</ExternalLink>
														</FlexItem>
													</Flex>
												</FlexItem>
											)
										} ) }
									</Flex>
								</Scrollable>
							</FlexItem>
						</Flex>
					</FlexItem>
				)
			} )
		)
	} 

	return (
		<Flex
			direction='row'
			justify='space-between'
			align='flex-start'
			wrap={ true }
			gap={ 4 }
		>
			<FlexItem style={ { flexBasis: 'calc( 100% - 318px )' } }>
				<Flex direction='column' gap={ 5 }>
					<PluginsList />
				</Flex>
			</FlexItem>
			<FlexItem style={ { flexBasis: '300px' } }>
				<Flex direction='column' gap={ 5 }>
					<PostsList />
				</Flex>
			</FlexItem>
		</Flex>
	)
}