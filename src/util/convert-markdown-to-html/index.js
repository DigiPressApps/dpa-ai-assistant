/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { renderToString } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
// import markdownit from 'markdown-it'
// import remarkToc from "remark-toc";
 

// Markdown 記法のテキストを HTML に変換
export const convertMarkdownToHTML = props => {
	const {
		markdownText = '',
		returnAsHTMLText = false,
		showTOC = false,
		isTOCOrderedList = true,
	} = props

	if ( !markdownText ) {
		return null
	}

	const html = (
		<ReactMarkdown
			rehypePlugins={ [ rehypeRaw, rehypeSanitize, rehypeSlug,
				[ rehypeToc, {
					headings: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
					customizeTOC: toc => {
						if ( showTOC ) {
							// ol から ul に変更
							const replacer = ( children ) => {
								children.forEach(child => {
									if ( child.type === 'element' && child.tagName === 'ol' ) {
										child.tagName = 'ul';
									}
									if ( child.children ) {
										replacer( child.children );
									}
								} );
							};
							return isTOCOrderedList ? toc : replacer( [ toc ] );
						} else {
							return showTOC
						}
					},
				} ]
			] }
			remarkPlugins={ [ remarkGfm ] }
		>
			{ markdownText }
		</ReactMarkdown>
	)

	return returnAsHTMLText ? renderToString( html ) : html

	// if ( returnAsHTMLText ) {
	// 	const md = markdownit()
	// 	return md.render( markdownText )
	// } else {
	// 	return (
	// 		<ReactMarkdown
	// 			rehypePlugins={ [ rehypeRaw, rehypeSanitize, rehypeSlug, [ rehypeToc, { headings: 'h2' } ] ] }
	// 			remarkPlugins={ [ remarkGfm ] }
	// 		>
	// 			{ markdownText }
	// 		</ReactMarkdown>
	// 	)
	// }
}