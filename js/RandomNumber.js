class RandomNumber {

  constructor( elm1, elm2, mode ) {
    this.elm1 = elm1;
    this.elm2 = elm2;
    const N = 100;
    this.N = N;
    this.MAX = 1000;
    this.dots = 0;

    this.mode = mode;

    this.nums = new Array(N);

    for( var i=0; i<N; i++ )  this.nums[i] = 0;

    this.vc1 = new VCanvas( elm1 );
    this.vc2 = new VCanvas( elm2 );
    this.background();
    this.vc1.forecolor( 0, 50, 50 );

    var timer1 = new vbTimer();
    timer1.interval = 20;
    var nl = new nylon();

    if( mode == "uniform") {
      timer1.timer = () => {
        for( var i=0; i<N; i++ ) {
          var rand = Math.floor( Math.random() * N );
          this.nums[ rand ]++;
        }
        this.vc1.beginPath();
        for( var x=0; x<N; x++ ) {
          this.vc1.line( x, 0, x, this.nums[x] );
        }
        this.vc1.stroke();
        this.dots += 100;
        if( this.dots >= this.MAX ) {
          timer1.disable();
          this.dots = 0;
        }
      }
    } else if( mode == "gauss") {
      timer1.timer = () => {
        for( var i=0; i<N; i++ ) {
          var rand=0;
          for( var j=0; j<12; j++ )
            rand += Math.random();
          this.nums[ Math.floor( rand / 12.0 * N ) ]++;
        }
        this.vc1.beginPath();
        for( var x=0; x<N; x++ ) {
          this.vc1.line( x, 0, x, this.nums[x] );
        }
        this.vc1.stroke();
        this.dots += 100;
        if( this.dots >= this.MAX ) {
          timer1.disable();
          this.dots = 0;
        }
      }
    } else if( mode == "exponential") {
      timer1.timer = () => {
        for( var i=0; i<N; i++ ) {
          var rand = - Math.floor( Math.log( Math.random() ) * N / 5 );
          this.nums[ rand ]++;
        }
        this.vc1.beginPath();
        for( var x=0; x<N; x++ ) {
          this.vc1.line( x, 0, x, this.nums[x] );
        }
        this.vc1.stroke();
        this.dots += 100;
        if( this.dots >= this.MAX ) {
          timer1.disable();
          this.dots = 0;
        }
      }
    }

    //timer1.timer();
    nl.on( "start", ( key, params ) => {
      timer1.enable();
    });
    nl.on( "clear", ( key, params ) => {
      timer1.disable();
      this.vc1.cls();
      for( var i=0; i<N; i++ )  this.nums[i] = 0;
    });
    nl.on( "max", ( key, params ) => {
      this.MAX = params["top"];
      this.background();
      for( var i=0; i<N; i++ )  this.nums[i] = 0;
      //timer1.timer();
    });
  }

  background() {
    this.vc1.cls();
    this.vc2.cls();

    var YMAX;
    if( this.mode == "uniform" ){
      YMAX = 18 * this.MAX / 1000;
    } else if( this.mode == "gauss" ) {
      YMAX = 60 * this.MAX / 1000;
    } else if( this.mode == "exponential" ) {
      YMAX = 60 * this.MAX / 1000;
    }

    this.vc1.scale( -2, YMAX, this.N+4, -(YMAX+5) );
    this.vc2.scale( -2, YMAX, this.N+4, -(YMAX+5) );

    this.vc2.forecolor( 0, 0, 0 );
    this.vc2.beginPath();
    this.vc2.line( 0, -5, 0, YMAX );
    this.vc2.line( this.N, -5, this.N, YMAX );
    this.vc2.line( 0, 0, this.N, 0 );
    for( var i=0; i<this.N; i+=this.N/10 ) {
      this.vc2.line( i, -5, i, 0 );
    }
    this.vc2.stroke();
  }
}

var guisetup = () => {
	var nl = new nylon();
	document.querySelector("#start").addEventListener( "click", () => {
		nl.emit( "start", null );
	});
  document.querySelector("#clear").addEventListener( "click", () => {
    nl.emit( "clear", null );
  });
  document.querySelector("#b02").addEventListener( "click", () => {
    nl.emit( "stop", null );
    nl.emit( "max", { "top":1000 } );
  });
  document.querySelector("#b03").addEventListener( "click", () => {
    nl.emit( "stop", null );
    nl.emit( "max", { "top":10000 } );
  });
  document.querySelector("#b04").addEventListener( "click", () => {
    nl.emit( "stop", null );
    nl.emit( "max", { "top":100000 } );
  });
}



window.addEventListener("load", function(e) {
  //var nl = new nylon();
  guisetup();

  x = new RandomNumber(
    document.querySelector('#graph1'),
    document.querySelector('#graph1b'),
    "uniform"
   );
  x = new RandomNumber(
    document.querySelector('#graph2'),
    document.querySelector('#graph2b'),
    "gauss"
   );
  x = new RandomNumber(
    document.querySelector('#graph3'),
    document.querySelector('#graph3b'),
    "exponential"
   );

});
