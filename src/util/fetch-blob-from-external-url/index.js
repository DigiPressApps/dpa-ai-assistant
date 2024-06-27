export const fetchBlobFromExternalURL = async ( url ) => {
	return new Promise( ( resolve, reject ) => {
		const xhr = new XMLHttpRequest();
		xhr.open( 'GET', url, true );
		xhr.responseType = 'blob';

		xhr.onload = () => {
			if ( xhr.status === 200 ) {
				const blob = xhr.response;
				resolve(blob);
			} else {
				reject(new Error('Failed to fetch blob. Status: ' + xhr.status));
			}
		};

		xhr.onerror = () => {
			reject(new Error('Error fetching blob.'));
		};

		xhr.send();
	});
}