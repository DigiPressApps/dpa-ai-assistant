/**
 * Internal dependencies
 */
import { ConditionalWrapper } from '@dpaa/components'
import { PublishArea } from './publish-area'
import { Title } from './title'
import { Sections } from './sections'
import { Content } from './content'
import { Excerpt } from './excerpt'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Disabled,
	Flex,
	FlexItem,
	Icon,
	__experimentalHeading as Heading,
	__experimentalDivider as Divider,
} from '@wordpress/components'
import { memo } from '@wordpress/element'
import { page as pageIcon } from '@wordpress/icons'

export const RenderArea = memo( ( props ) => {
	const {
		openai,
		clearGeneratedElements,
		isInEditor,
		setErrorMessage,
		setTipMessage,
		topic,
		title,
		onChangeTitle,
		setIsLoading,
		isLoading,
		sections,
		onChangeSections,
		content,
		onChangeContent,
		excerpt,
		minContentWords,
		onChangeMinContentWords,
		onChangeExcerpt,
		sectionCount,
		onChangeSectionCount,
		sectionHeadingLevel,
		onChangeSectionHeadingLevel,
		paragraphPerSection,
		onChangeParagraphPerSection,
		titleMinCharacters,
		onChangeTitleMinCharacters,
		titleMaxCharacters,
		onChangeTitleMaxCharacters,
		sectionTitleMinCharacters,
		onChangeSectionTitleMinCharacters,
		sectionTitleMaxCharacters,
		onChangeSectionTitleMaxCharacters,
		excerptMinCharacters,
		onChangeExcerptMinCharacters,
		excerptMaxCharacters,
		onChangeExcerptMaxCharacters,
		onClickGenerateTitle,
		onClickGenerateSections,
		onClickGenerateContent,
		onClickGenerateExcerpt,

		// はじめに
		isIncludeIntro,
		onChangeIsIncludeIntro,
		showIntroTitle,
		onChangeShowIntroTitle,
		introTitle,
		onChangeIntroTitle,
		introTitleTag,
		onChangeIntroTitleTag,
		// おわりに
		isIncludeOutro,
		onChangeIsIncludeOutro,
		showOutroTitle,
		onChangeShowOutroTitle,
		outroTitle,
		onChangeOutroTitle,
		outroTitleTag,
		onChangeOutroTitleTag,

		// 目次用
		isInsertTOC,
		onChangeIsInsertTOC,
		isTOCOrderedList,
		onChangeIsTOCOrderedList,
		showTOCTitle,
		onChangeShowTOCTitle,
		tocTitle,
		onChangeTocTitle,
		tocTitleTag,
		onChangeTocTitleTag,

	} = props

	return (
		<>
			<Divider
				marginStart={ 7 }
				marginEnd={ 5 }
				orientation='horizontal'
				style={ { opacity: '0.5' } }
			/>
			<Heading
				level={ 3 }
				adjustLineHeightForInnerControls="medium"
				weight={ 600 }
			>
				<Icon icon={ pageIcon } style={ { verticalAlign: 'middle' } } />
				{ isLoading ? __( 'Loading...', dpaa.i18n ) : __( 'Generated Contents', dpaa.i18n ) }
			</Heading>
			<ConditionalWrapper
				condition={ !openai }
				wrapper={ children => (
					<Disabled isDisabled={ true }>
						{ children }
					</Disabled>
				) }
			>
				<Flex
					direction='row'
					justify='space-between'
					align='normal'
					wrap={ true }
					gap={ 3 }
				>
					<FlexItem
						isBlock={ true }
						style={ {
							flexBasis: 'calc( 70% - 6px )'
						} }
					>
						<Flex
							className='dpaa-writer__render-area'
							direction='column'
							justify='space-between'
							wrap={ true }
							gap={ 3 }
						>
							<Title
								topic={ topic }
								title={ title }
								onChangeTitle={ onChangeTitle }
								titleMinCharacters={ titleMinCharacters }
								onChangeTitleMinCharacters={ onChangeTitleMinCharacters }
								titleMaxCharacters={ titleMaxCharacters }
								onChangeTitleMaxCharacters={ onChangeTitleMaxCharacters }
								onClickGenerateTitle={ onClickGenerateTitle }
								isLoading={ isLoading }
							/>
							<Sections
								title={ title }
								sections={ sections }
								onChangeSections={ onChangeSections }
								sectionCount={ sectionCount }
								onChangeSectionCount={ onChangeSectionCount }
								sectionHeadingLevel={ sectionHeadingLevel }
								onChangeSectionHeadingLevel={ onChangeSectionHeadingLevel }
								sectionTitleMinCharacters={ sectionTitleMinCharacters }
								onChangeSectionTitleMinCharacters={ onChangeSectionTitleMinCharacters }
								sectionTitleMaxCharacters={ sectionTitleMaxCharacters }
								onChangeSectionTitleMaxCharacters={ onChangeSectionTitleMaxCharacters }
								onClickGenerateSections={ onClickGenerateSections }
								isLoading={ isLoading }
							/>
							<Content
								content={ content }
								sections={ sections }
								excerpt={ excerpt }
								onChangeContent={ onChangeContent }
								isInsertTOC={ isInsertTOC }
								onChangeIsInsertTOC={ onChangeIsInsertTOC }
								showTOCTitle={ showTOCTitle }
								onChangeShowTOCTitle={ onChangeShowTOCTitle }
								tocTitle={ tocTitle }
								onChangeTocTitle={ onChangeTocTitle }
								tocTitleTag={ tocTitleTag }
								onChangeTocTitleTag={ onChangeTocTitleTag }
								isTOCOrderedList={ isTOCOrderedList }
								onChangeIsTOCOrderedList={ onChangeIsTOCOrderedList }
								isIncludeIntro={ isIncludeIntro }
								onChangeIsIncludeIntro={ onChangeIsIncludeIntro }
								showIntroTitle={ showIntroTitle }
								onChangeShowIntroTitle={ onChangeShowIntroTitle }
								introTitle={ introTitle }
								onChangeIntroTitle={ onChangeIntroTitle }
								introTitleTag={ introTitleTag }
								onChangeIntroTitleTag={ onChangeIntroTitleTag }
								isIncludeOutro={ isIncludeOutro }
								onChangeIsIncludeOutro={ onChangeIsIncludeOutro }
								showOutroTitle={ showOutroTitle }
								onChangeShowOutroTitle={ onChangeShowOutroTitle }
								outroTitle={ outroTitle }
								onChangeOutroTitle={ onChangeOutroTitle }
								outroTitleTag={ outroTitleTag }
								onChangeOutroTitleTag={ onChangeOutroTitleTag }
								onClickGenerateContent={ onClickGenerateContent }
								paragraphPerSection={ paragraphPerSection }
								onChangeParagraphPerSection={ onChangeParagraphPerSection }
								minContentWords={ minContentWords }
								onChangeMinContentWords={ onChangeMinContentWords }
								isLoading={ isLoading }
							/>
							<Excerpt
								title={ title }
								excerpt={ excerpt }
								onChangeExcerpt={ onChangeExcerpt }
								excerptMinCharacters={ excerptMinCharacters }
								onChangeExcerptMinCharacters={ onChangeExcerptMinCharacters }
								excerptMaxCharacters={ excerptMaxCharacters }
								onChangeExcerptMaxCharacters={ onChangeExcerptMaxCharacters }
								onClickGenerateExcerpt={ onClickGenerateExcerpt }
								isLoading={ isLoading }
							/>
						</Flex>
					</FlexItem>
					<FlexItem
						isBlock={ true }
						style={ {
							flexBasis: 'calc( 30% - 6px )'
						} }
					>
						<PublishArea
							isLoading={ isLoading }
							title={ title }
							sections={ sections }
							content={ content }
							excerpt={ excerpt }
							isInsertTOC={ isInsertTOC }
							isTOCOrderedList={ isTOCOrderedList }
							showTOCTitle={ showTOCTitle }
							tocTitle={ tocTitle }
							tocTitleTag={ tocTitleTag }
							clearGeneratedElements={ clearGeneratedElements }
							setIsLoading={ setIsLoading }
							setErrorMessage={ setErrorMessage }
							setTipMessage={ setTipMessage }
							isInEditor={ isInEditor }
						/>
					</FlexItem>
				</Flex>
			</ConditionalWrapper>
		</>
	)
} )