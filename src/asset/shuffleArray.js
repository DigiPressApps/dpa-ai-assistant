export function shuffleArray ( array ) {

	if ( ! Array.isArray(array) ) return false;

	// 配列をシャッフル
	for (var i = array.length - 1; i >= 0; i--){
		// 0~iのランダムな数値を取得
		let rand = Math.floor( Math.random() * ( i + 1 ) );
		// 配列の数値を入れ替える
		[array[i], array[rand]] = [array[rand], array[i]]
	}

	return array;
}