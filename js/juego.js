var canvas;
var ctx;
var FPS =50;

//DIMENSIONES DE LAS CASILLAS

var anchoF = 50 ;
var altoF = 50;


//COLORES 
var muro = '#044f14';
var tierra = '#c6892f';


var escenario = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,2,0,0,2,2,0,0,0,0,2,2,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,0,0,0,0],
    [0,2,2,2,2,2,2,0,2,2,0,0,0,0,0],
    [0,2,2,2,2,2,0,0,0,2,2,2,2,2,0],
    [0,0,0,2,2,0,0,0,0,0,2,2,0,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ];


var protagonista;

//clase jugador

var jugador = function(){

    this.x = 100;
    this.y = 100;
    
    this.vy = 0;
    this.vx =0;
    
    this.gravedad =0.5;
    this.friccion =0.3;

    this.salto = 10;
    this.velocidad =3;

    this.velocidadMax =5;

    this.suelo =false;

    this.pulsaIzquierda = false;
    this.pulsaDerecha = false;

    this.colision = function(x,y){

      var colisiona = false;
      
      if(escenario[parseInt(y/altoF)][parseInt(x/anchoF)] == 0){
        colisiona = true;
      }

      return(colisiona);

    }
    this.correccion = function(lugar){

      //abajo
      if(lugar==1){
        this.y = parseInt(this.y/altoF)*altoF;

      }
      //arriba
      if(lugar==2){
        this.y = parseInt((this.y/altoF)+1)*altoF;

      }
      //izquierda 
      if(lugar==3){
        this.x = parseInt(this.x/anchoF)*anchoF;
      }
      //derecha
      if(lugar==4){
        this.x = parseInt((this.x/anchoF)+1)*anchoF;
      }


    }

    this.fisica = function(){

      //GRAVEDAD 
      if(this.suelo == false){
        this.vy += this.gravedad;
      }

      //MOVIMIENTO HORIZONTAL

      if(this.pulsaDerecha == true && this.vx <=this.velocidadMax){
        this.vx += this.velocidad;
      }

      if(this.pulsaIzquierda == true&& this.vx >= 0-(this.velocidadMax)){
        this.vx -= this.velocidad;
      }

      //FRICCION

      //izquierda
      if(this.vx<0){
        this.vx += this.friccion;
        if(this.vx>0){
          this.vx = 0;
        }
      }
      //derecha
      if(this.vx >0){
        this.vx -= this.friccion;
        if(this.vx<0){
          this.vx = 0;
        }
      }
      

      //colisiones

      //derecha
      if(this.vx > 0 && this.colision(this.x + anchoF + this.vx,(this.y + parseInt(altoF/2)))==true){

        //SOLO HACEMOS LA CORRECCIÓN SI LA FICHA NO ESTÁ ENCAJADA EN EL PUNTO EXACTO
        if(this.x != parseInt(this.x/anchoF)*anchoF){
          this.correccion(4);
        }
  
        this.vx = 0;
      }
      //Izquierda
    
      if(this.vx < 0 && this.colision(this.x + this.vx,(this.y+ parseInt(altoF/2)))==true){
       this.correccion(3);
        this.vx = 0;
      }


      //ACTUALIZAMOS POSICIÓN :
      this.y += this.vy;
      this.x += this.vx;

      //colisión techo
      if(this.vy <0){
        if((this.colision(this.x+1,this.y)==true)||(this.colision(this.x+anchoF-1,this.y)==true)){
          this.vy=0;
          this.correccion(2);
        }
      }

      //colisión del suelo
      if(this.vy >= 0){
        if((this.colision(this.x +1, this.y + altoF)==true)||(this.colision(this.x +anchoF-1, this.y + altoF)==true) ){
          this.suelo = true;
          this.vy =0;
          this.correccion(1);
        }
        else{
          this.suelo = false;
        }
      }    

    };

    this.arriba = function(){
      if(this.suelo == true){
        this.vy -=this.salto;
        this.suelo = false;
      }

    }
    this.derecha = function(){
      this.pulsaDerecha = true;
    };
    this.izquierda = function(){
      this.pulsaIzquierda = true;      
    };
    this.sueltaDerecha = function(){
      this.pulsaDerecha = false;   
    };
    this.sueltaIzquierda = function(){
      this.pulsaIzquierda = false;
    };
    
    this.dibuja = function(){
    

        this.fisica();

        ctx.fillStyle = '#820c01';
        ctx.fillRect(this.x, this.y,anchoF,altoF);
    }
}

function dibujaEscenario(){
    var color;
  
    for(y=0;y<10;y++){
      for(x=0;x<15;x++){
  
        if(escenario[y][x]==0)
          color = muro;
  
        if(escenario[y][x]==2)
          color = tierra;
  
        ctx.fillStyle = color;
        ctx.fillRect(x*anchoF,y*altoF,anchoF,altoF);
      }
    }
    
}
 //---------------------------------------------------------------------------

  var ratonX = 0;
  var ratonY = 0;

function inicializa(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
  
    //CREAMOS AL protagonista

    protagonista = new jugador();

    //CONTROLAR EL RATÓN

   // canvas.addEventListener('mousedown', clicRaton,false);
   // canvas.addEventListener('mouseup', clicRaton,false);
   // canvas.addEventListener('mousemove', posicionRaton,false);


  
    //LECTURA DEL TECLADO
    document.addEventListener('keydown',function(tecla){
  
      if(tecla.key == 'ArrowUp'){
       protagonista.arriba();
      }
  
      if(tecla.key == 'ArrowLeft'){
        protagonista.izquierda();
        
      }
  
      if(tecla.key == 'ArrowRight'){
       protagonista.derecha();
       
      }
  
    });

    //LIBERACION TECLAS
    document.addEventListener('keyup',function(tecla){
  
      if(tecla.key == 'ArrowUp'){
       protagonista.arriba();
      }
  
      if(tecla.key == 'ArrowLeft'){
        protagonista.sueltaIzquierda();
        
      }
  
      if(tecla.key == 'ArrowRight'){
       protagonista.sueltaDerecha();
       
      }
  
    });
  
  
  
  
  
    setInterval(function(){
      principal();
    },1000/FPS);
  }
  
  
  function borraCanvas(){
    canvas.width=750;
    canvas.height=500;
  }
  
  
  function principal(){
    borraCanvas();
    dibujaEscenario();
    protagonista.dibuja();
  } 