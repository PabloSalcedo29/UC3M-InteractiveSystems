const socket = io();

const popup = document.querySelector('.popup');
const settingsBtn = document.querySelector('.footer-button:last-child');
const closeBtn = document.querySelector('.popup-close-btn');

settingsBtn.addEventListener('click', () => {
  popup.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});


var estado_video = true; // true es que esta reproduciendose y false que esta parado

const MediaDevices = navigator.mediaDevices;
var linternaApagada = true;

async function EncenderApagarLinterna() {
  if (linternaApagada){
    MediaDevices.getUserMedia({ video: { facingMode: "environment", torch: true } })
    .then(function(stream) {
    var track = stream.getVideoTracks()[0];
    linternaApagada = false;
    return track.applyConstraints({
        advanced: [{torch: true}]
    });
    })
  } else {
    MediaDevices.getUserMedia({ video: { facingMode: "environment", torch: false } })
    .then(function(stream) {
    var track = stream.getVideoTracks()[0];
    linternaApagada = true;
    return track.applyConstraints({
        advanced: [{torch: false}]
    });
    })
  }
}

async function pausarReanudar() {
  if (estado_video){
    socket.emit('pausa_video');
    console.log('El video está en pausa');
    estado_video = false;
  } else {
    socket.emit('play_video');
    console.log('El video está en reanudar');
    estado_video = true;
  }
}

function adelantar() {
  socket.emit('adelantar_video');
  console.log('El video se adelanto');
}

function retroceder() {
  socket.emit('retroceder_video');
  console.log('El video se retraso');
}

function adelantar_mov() {
  socket.emit('adelantar_video_mov');
  console.log('El video se adelanto');
}

function retroceder_mov() {
  socket.emit('retroceder_video_mov');
  console.log('El video se retraso');
}

function bajar_volumen() {
  socket.emit('bajar_volumen');
  console.log('El volumen se ha bajado');
}
function subir_volumen() {
  socket.emit('subir_volumen');
  console.log('El volumen se ha subido');
}

function control_voz() {
  alert("control por voz");
}

function aviso() {
  estado_video = false;
	socket.emit('aviso');
  console.log('Se ha avisado');
}

// SUBIR Y BAJAR EL VOLUMEN CON TOUCH SWIPE
document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchmove", moveTouch, false);

// Variables para almacenar la posición inicial y final del desplazamiento
let startX = null;
let startY = null;
let endX = null;
let endY = null;

function startTouch(event) {
  // Almacenar las coordenadas iniciales del desplazamiento
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
}

function moveTouch(event) {
  // Asegurarse de que se han almacenado las coordenadas iniciales
  if (startX === null || startY === null) {
    return;
  }

  // Almacenar las coordenadas finales del desplazamiento
  endX = event.touches[0].clientX;
  endY = event.touches[0].clientY;

  // Calcular la dirección del desplazamiento
  const diffX = startX - endX;
  const diffY = startY - endY;

  // Verificar si el desplazamiento es horizontal
   if (Math.abs(diffX) > Math.abs(diffY)) {
    // Verificar si el desplazamiento es hacia la izquierda
    if (diffX < 0) {
      subir_volumen();
    }
    if (diffX > 0) {
      bajar_volumen();
    }
    
  }
  else{
     if (diffY > 0) {
      pausarReanudar();
    }
  }
  

  // Restablecer las coordenadas de inicio y final a nulo
  startX = null;
  startY = null;
  endX = null;
  endY = null;
}



//ADELANTAR Y RETROCEDER CON MOVIMIENTO DEL MOVIL
// Detectar los cambios en la orientación del dispositivo
window.addEventListener('deviceorientation', function(event) {
  var giroHaciaIzquierda = -50; // Umbral para detectar giro hacia la izquierda
  var giroHaciaDerecha = 50;

  
  if (event.gamma <= giroHaciaIzquierda) { // Si el ángulo `gamma` es menor o igual al umbral
    retroceder_mov();
  }
   if (event.gamma >= giroHaciaDerecha) { // Si el ángulo `gamma` es menor o igual al umbral
    adelantar_mov();
  }
});




//SPEECH API
function control_voz(){
// revisar si el API de reconocimiento de voz es compatible con el navegador
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  // crear un nuevo objeto de reconocimiento de voz
  var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "es-ES"; // establecer el idioma del reconocimiento de voz a español
  
  // agregar un evento que se activará cuando se detecte un resultado en el reconocimiento de voz
  recognition.onresult = function(event) {
    var transcript = event.results[event.results.length - 1][0].transcript;
    console.log("Se ha detectado la siguiente entrada de voz: " + transcript);
    
    // si la entrada de voz contiene la palabra 'a'
    if (/parar/.test(transcript)) {
      // llamar a la función pausar()
      pausarReanudar();
    }
    if (/seguir/.test(transcript)) {
      // llamar a la función pausar()
      pausarReanudar();
    }
    if (/adelantar/.test(transcript)) {
      // llamar a la función pausar()
      adelantar();
    }
    if (/retroceder/.test(transcript)) {
      // llamar a la función pausar()
      retroceder();
    }
    if (/subir/.test(transcript)) {
      // llamar a la función pausar()
      subir_volumen();
    }
    if (/bajar/.test(transcript)) {
      // llamar a la función pausar()
      bajar_volumen();
    }
  };
  
  // iniciar el reconocimiento de voz cuando se clique el boton start-btn
  document.getElementById("boton_microfono").addEventListener("click", function() {
    recognition.start();
  });
  
} 

}



