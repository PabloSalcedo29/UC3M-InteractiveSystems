const mymap = L.map('sample_map').setView([40.55, -3.90], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18,
}).addTo(mymap);
 
//VARIABLES QUE USAREMOS PARA DISTINTOS PARAMETROS
var pos_actual;
var marcador_posicion;
var marcador_destino;
var limites_destino;
var limites_destino2;

//SACAMOS NUESTRA POSICIÓN Y CREAMOS UN MARCADOR EN ESA POSICIÓN
if (navigator.geolocation) {
  console.log(navigator.geolocation)
  navigator.geolocation.watchPosition(
    (position) => {
      pos_actual = new L.latLng(position.coords.latitude,position.coords.longitude);
      mymap.setView(pos_actual);

      //BORRAMOS LA POSICIÓN ANTERIOR PARA CUANDO NOS MOVEMOS
      if (marcador_posicion){
      mymap.removeLayer(marcador_posicion);
    };
      marcador_posicion = L.circle(pos_actual,
        {
          color: 'red',
          fillColor: 'red',
          fillOpacity: 1,
          radius: 10
        }).addTo(mymap);

        marcador_posicion.bindPopup("Aqui esta su ubicación"); 



//IMPRIMIMOS COORDENADAS ACTUALES EN LA PARTE DE ARRIBA DE LA PÁGINA
if ('geolocation' in navigator) {
  const p1 = document.querySelector("#p1");
  const p = document.querySelector("#geoloc");
  const watchID = navigator.geolocation.watchPosition((position) => {
    p.innerHTML = `${position.coords.latitude}, ${position.coords.longitude}`;
  });
}

//FUNCION PARA COLOCAR UN MARCADOR EN EL DESTINO Y RESALTAR EL ÁREA EN EL QUE VIBRARÁ
function marcar_destino(posicion) {

  

    //SI NUESTRA POSICIÓN ESTA A MENOS DE X DISTANCIA, VIBRARÁ.
    //SI NUESTERA POSICIÓN ESTA EN EL ÁREA VERDE VIBRARÁ
    if (pos_actual.distanceTo((posicion.latlng)) < 500 ){
      window.navigator.vibrate([1500, 1000, 1500]);
      console.log("Está cerca de su destino")
    } 
  
   if (pos_actual.distanceTo((posicion.latlng)) < 100 ){
      window.navigator.vibrate([5000]);
      console.log("Ha llegado a su destino")
    } 

  
    //BORRAMOS EL ANTERIOR MARCADOR DE DESTINO Y SU ÁREA 
    if (marcador_destino){
      mymap.removeLayer(marcador_destino);
    };
  
    if (limites_destino){
      mymap.removeLayer(limites_destino);
    };
  if (limites_destino2){
      mymap.removeLayer(limites_destino2);
    };

    //CREAMOS EL MARCADOR Y EL ÁREA ALREDEDOR
    marcador_destino = L.marker((posicion.latlng)).addTo(mymap);
  
    limites_destino = new L.circle((posicion.latlng) , {
    color : 'green',
    fillColor : 'green' ,
    fillOpacity : 0.25 ,
    radius : 500
    });
    limites_destino.addTo(mymap);  

  limites_destino2 = new L.circle((posicion.latlng) , {
    color : 'blue',
    fillColor : 'blue' ,
    fillOpacity : 0.5 ,
    radius : 100
    });
    limites_destino2.addTo(mymap);
}
mymap.on('click', marcar_destino);

mymap.on('click', function(posicion) {
  console.log(posicion);
}) 
    },
  );
}
 



  
