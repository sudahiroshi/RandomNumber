
/**
 * クライアント側nylonの本体
 * nylon関係の機能を使う場合は必ず読み込んでください
 */
class nylon {

	/**
	 * constructor
	 * グローバル変数nylon，nylon.mapなどを初期化します
	 */
	constructor() {
		/**
		 * @type {hash}
		 */
		this.nylon = window.nylon;

		/**
		 * @type {window}
		 */
		this.parent = window.parent;

		if( window.nylon == null ) {
			window.nylon = {};
		}
		if( window.nylon.map == null ) {
			window.nylon.map = {};
		}

		/**
		 * @type {array}
		 */
		this.map = window.nylon.map;
	}

	/**
	 * 受け取ったイベント情報をそのまま外部に渡すための関数
	 * nylon.iFrameで使用します
	 * @param {function} fn - イベントを処理するコールバック関数
	 */
	setPassThrough( fn ) {
		if( window.nylon.passthrough == null ) {
			window.nylon.passthrough = fn;
		} else {
			console.log( "Error by duplexy registration" );
		}
	}

	/**
	 * キーワードと，キーワードに対する処理を登録する関数
	 * @param { string } keyword - キーワード
	 * @param { function } fn - コールバック関数
	 */
	on( keyword, fn ) {
		console.log( this );
		if( this.map[ keyword ] == null ) {
			//if( window != parent ) {
			//	this.parent.postMessage( { "keyword": ["on"], "params": {"keyword": ["on"], "key":keyword}}, nylon.origin );
			//}
			console.log( "new keyword : " + keyword );
			this.map[ keyword ] = [ new nylonfunc( fn, this ) ];
		} else {
			this.map[ keyword ].push( new nylonfunc( fn, this ) );
		}
	}

	/**
	 * イベントを起こす関数
	 * @param { string[] } keys - キーワードの配列
	 * @param { hash } params - パラメータ（ハッシュで与える）
	 */
	emitByArray( keys, params ) {
		if( window.nylon.passthrough != null ) {
			window.nylon.passthrough( keys, params, this );
		}
		if( params == null ) {
			params = {};
		}
		console.log( "-->" + params["keywords"] );

		if( params["keywords"] == null ) {
			console.log("params.keywordsがnull");
			params["keywords"] = keys;
		}

		for( let key of keys ) {
			if( this.map[ key ] == null ) {
				console.log( "Invarid keyword " + key );
			} else {
				for( let element of this.map[ key ] ) {
					//console.log( element );
					//console.log( "-->" + element.obj );
					if( element.obj != this ) {
						element.fn( key, params );
					}
				}
			}
		}
	}

	/**
	 * イベントを起こす関数
	 * @param { string } keyword - キーワード．|で区切ることで複数キーワードを与える
	 * @param { hash } params - パラメータ（ハッシュで与える）
	 */
	emit( keyword, params ) {
		var keys = keyword.split( "|" );
		this.emitByArray( keys, params );
	}
}

//export default nylon;
//exports = module.exports = nylon;

/**
 * nylonに登録する関数のクラス
 */
class nylonfunc {

	/**
	 * コンストラクタ
	 * @param { function } func - コールバック関数
	 * @param { nylon } object - nylonオブジェクト
	 */
	constructor( func, object ) {
		/** @type { function } */
		this.fn = func;
		/** @type { nylon } */
		this.obj = object;
	}
}
//export default nylonfunc;
