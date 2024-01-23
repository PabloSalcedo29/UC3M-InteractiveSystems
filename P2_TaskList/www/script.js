const taskList = [];//array de las tareas para el json
const tabla_tareas = document.getElementById('tabla_tareas');//tabla para almacenar y mostrar las tareas

//----------------------------RECARGAR TAREAS-------------------------------------
const loadTasks = async() => {
  try{
    //eliminamos las tareas que hay ahora para rehacer la tabla
    var tabla_tareas = document.getElementById("filas"); //cogemos la tabla
    var filas_tabla = tabla_tareas.getElementsByTagName("tr"); //cogemos las filas de las tablas
    for (var i = filas_tabla.length-1; i>=0; i--) {
       filas_tabla[i].parentNode.removeChild(filas_tabla[i]);
    }
    
     const tareas_json = await fetch('/tasks/get'); //accedemos al json y cogemos todos los datos
     datos = await tareas_json.json(); 
     taskList.push(datos);
    
//creamos la tabla de las tareas 
     datos.forEach(tarea =>{
       const nueva_tarea = document.createElement('tr');
       nueva_tarea.innerHTML = `
                <td>${tarea.id}</td>
                <td>${tarea.title}</td>
                <td>${tarea.done}</td>
                `;
       tabla_tareas.appendChild(nueva_tarea);
     });
  }
  catch(err){
    console.log(err);
  }
};
loadTasks();


//----------------------------AÑADIR TAREA-------------------------------------
const add = async() => {
  const nombre_tarea = document.getElementById("task-name").value; 
   if(nombre_tarea == "") {
    alert("INTRODUZCA UNA TAREA") //NO SE PERMITE AÑADIR UNA TAREA SIN TÍTULO
  }
  else { //Comprobamos que no este vacío el nombre de la tarea
    const nueva_tarea = document.createElement('tr');
    nueva_tarea.innerHTML = `
        <td>${taskList[0].length+1}</td>
        <td>${nombre_tarea}</td>
        <td>${"false"}</td>
        `;
    tabla_tareas.appendChild(nueva_tarea);
    //ahora lo añadimos al json 
    const tarea_json = { id:(taskList[0].length+1), title: nombre_tarea, done:false }; //CREAMOS LA TAREA EN LA TABLA
    taskList[0].push(tarea_json);//AÑADIMOS LA TAREA A LA LISTA PARA LUEGO METERLA EN EL JSON
    alert("TAREA AÑADIDA: "+ nombre_tarea)
    
    //ACTUALIZAMOS EL JSON
    try{await fetch("/tasks/post", {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
           },
          body: JSON.stringify(taskList[0]),
    });
    }
    catch(err){
      console.log(err);
    }
  document.getElementById("task-name").value = ""; //quitamos la tarea ya introducida
  };
};

const addButton = document.getElementById("fab-add");
addButton.addEventListener("click", add);


//----------------------------ELIMINAR TAREA-------------------------------------
//CUANDO SE AÑADE UNA TAREA SE DEBE RECARGAR LA PAGINA PARA PODER BORRAR
const remove = async(id) => {
    var i = 0;
    taskList[0] = taskList[0].filter(tarea => tarea.id != id);
     taskList[0].forEach(tarea => { 
        tarea.id = i+1;
        i = i+1;
      });
    console.log(taskList[0]);
    //ACTUALIZAMOS EL JSON
     try{await fetch("/tasks/post", {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
           },
          body: JSON.stringify(taskList[0]),
    });
    }
     catch(err){
      console.log(err);
    }
  loadTasks();
};

//OBTENEMOS LA POSICION PARA BORRAR LAS TAREAS O MARCARLAS COMO COMPLETADAS
var ejeX = null;
var tiempo = 0;

async function handleTouchStart(evt) {
    ejeX = evt.touches[0].clientX;
    momento_inicial = Date.now();
};

async function handleTouchMove(evt) {
    if (!ejeX) {
        return;
    }
    var px = evt.touches[0].clientX;
    var py = evt.touches[0].clientY;
    //VEMOS SI ESTA DESLIZANDO EN LA PANTALLA
    var difX = ejeX - px;
    //VEMOS CUANTO TIEMPO MANTENMOS PULSADO
    var tiempo_presionado = Date.now() - momento_inicial;
   
    if(difX > 6){ 
       const tarea_borrar= document.elementFromPoint(20, py);
       const id_borrar = tarea_borrar.textContent; 
       marcarCompletado(id_borrar);
    }
    else if (difX < -6) {
         const tarea_borrar= document.elementFromPoint(20, py);
         const id_borrar = tarea_borrar.textContent; 
         remove(id_borrar);
         alert("TAREA ELIMINADA")
    };
    ejeX = null;
};

//MARCAR TAREA COMO COMPLETADA. SI ESTA YA MARCADA SE DESMARCA
const marcarCompletado = async(id) => {
  if (taskList[0][id-1].done === false){
    taskList[0][id-1].done = true;
  }
  else{
    taskList[0][id-1].done = false;
  }
  console.log(taskList[0]);
 
  //ACTUALIZAMOS EL JSON
     try{await fetch("/tasks/post", {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
           },
          body: JSON.stringify(taskList[0]),
    });
    }
     catch(err){
      console.log(err);
    }
  loadTasks();
};



document.getElementById('filas').addEventListener('touchstart', handleTouchStart, false);
document.getElementById('filas').addEventListener('touchmove', handleTouchMove, false);




