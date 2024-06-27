/**
 * Internal dependencies
 */
import { sendMessage } from './send-message'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const SYS_PROMPT_GENERATE_TITLE = ''
const SYS_PROMPT_BASE = ''

export const writer = async ( props ) => {
	const {
		openapi,
		apiKey,
		model,
		message,
	} = props

	if ( !message || !apiKey ) {
		return;
	}

	const [ content, setContent ] = useState( '' )
	const [ systemPrompt, setSystemPrompt ] = useState( SYS_PROMPT_BASE )
	
	sendMessage( {
		apiKey: apiKey,
		openapi: openapi,
		useStreaming: false,
		systemPrompt: systemPrompt,
	} )
	.then( ( response ) => {

	} )
	.catch( ( error ) => {

	} )
}

writer.defaultProps = {
	message: null,
	openai: null,
	apiKey: null,
	model: 'gpt-3.5-turbo',
}