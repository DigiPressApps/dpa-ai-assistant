/**
 * External dependencies
 */
import OpenAI from "openai";

// APIキーのセット
export const newOpenAI = ( apiKey ) => {
	if ( apiKey && typeof apiKey === 'string' ) {
		return new OpenAI( {
			apiKey: apiKey,
			dangerouslyAllowBrowser: true
		} );
	} else {
		return null;
	}
}

export default newOpenAI;