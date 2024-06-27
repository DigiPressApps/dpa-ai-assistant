/** 
 * モデルのリスト
 * @see https://platform.openai.com/docs/api-reference/models/list
 */
export const listModels = async ( props ) => {
	const {
		openai = null,
	} = props

	if ( !openai ) return;

	const list = await openai.models.list();

	return list;
}