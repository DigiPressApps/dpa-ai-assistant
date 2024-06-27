/**
 * @see https://platform.openai.com/docs/api-reference/files/create
 * @param { * } props
 * @returns (sample)
 * {
	"id": "file-abc123",
	"object": "file",
	"bytes": 120000,
	"created_at": 1677610602,
	"filename": "mydata.jsonl",
	"purpose": "fine-tune",
	}
 */
export const uploadFileToOpenAI = async ( props ) => {
	const {
		openai = undefined,
		purpose = 'assistants', // 'fine-tune'
		file = null,
		fileType = 'url',	// 'url' or 'objet'
	} = props

	if ( !openai || !file ) {
		return false
	}

	const uploadedFile = await openai.files.create( {
		file: fileType === 'url' ? await fetch( file ) : file,
		purpose: purpose,
	} )

	return uploadedFile
}

/**
 * 
 * @param { openai: OpenAI Instance } props 
 * @returns (sample)
 * {
  "data": [
    {
      "id": "file-abc123",
      "object": "file",
      "bytes": 175,
      "created_at": 1613677385,
      "filename": "salesOverview.pdf",
      "purpose": "assistants",
    },
    {
      "id": "file-abc123",
      "object": "file",
      "bytes": 140,
      "created_at": 1613779121,
      "filename": "puppy.jsonl",
      "purpose": "fine-tune",
    }
  ],
  "object": "list"
}
 */
export const getUploadedFilesOnOpenAI = async ( props ) => {
	const {
		openai = undefined,
		purpose = null,
	} = props

	if ( !openai ) {
		return false
	}

	const params = {};
	if ( purpose ) params.purpose = purpose;
 
	const list = await openai.files.list( params );

	const files = []

	for await ( const file of list ) {
		files.push( file )
	}

	return files
}

/**
 * 
 * @param {
 * 	openai: OpenAI instance,
 * 	fileID: Uploaded file ID
 * } props 
 * @returns (sample)
 * {
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune",
}
 */
export const retrieveUploadedFileOnOpenAI = async ( props ) => {
	const {
		openai = undefined,
		fileID = '',
	} = props

	if ( !openai || !fileID ) {
		return false
	}
 
	const file = await openai.files.retrieve( fileID );

	return file
}

/**
 * 
 * @param {
 * 	openai: OpenAI instance,
 * 	fileID: Uploaded file ID
 * } props 
 * @returns (sample)
 * {
  "id": "file-abc123",
  "object": "file",
  "deleted": true
}
 */
export const deleteUploadedFileOnOpenAI = async ( props ) => {
	const {
		openai = undefined,
		fileID = '',
	} = props

	if ( !openai || !fileID ) {
		return false
	}
 
	const result = await openai.files.del( fileID );

	return result
}

/**
 * 
 * @param {
 * 	openai: OpenAI instance,
 * 	fileID: Uploaded file ID
 * } props 
 * @returns file content.
 */
export const retrieveUploadedFileContentOnOpenAI = async ( props ) => {
	const {
		openai = undefined,
		fileID = '',
	} = props

	if ( !openai || !fileID ) {
		return false
	}
 
	const content = await openai.files.retrieveContent( fileID );

	return content
}