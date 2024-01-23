const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 80;

const serveStaticFile = async (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(err, data) {
      if(err) reject(err);
      resolve(data);
    });
  });
} 

// Función para obtener los datos enviados en la solicitud POST
const obtenerDatos = async (request) => {
  return new Promise((resolve, reject) => {
    let data = '';
    request.on('data', (inf) => {
      data += inf;
    });
    request.on('end', () => {
      resolve(data);
    });
    request.on('error', (error) => {
      reject(error);
    });
  });
};

// Función para guardar los datos en un archivo
const saveTasksToFile = async (data, fileName) => {
  try {
    await fs.promises.writeFile(fileName, data);
    console.log(`Archivo ${fileName} guardado de forma correcta`);
  } catch (error) {
    console.error(`Error al guardar el archivo ${fileName}: ${error}`);
  }
};

const sendResponse = (response, content, contentType) => {
  response.writeHead(200, {"Content-Type": contentType});
  response.end(content);
}

const handleRequest = async (request, response) => {
  const url = request.url;

  if(request.method === "GET"){
    let content;
    let contentType;
    switch(url){
      case "/":
      case "/index.html":
        content = await serveStaticFile("www/index.html");
        contentType = "text/html";
        break;
      case "/script.js":
        content = await serveStaticFile("www/script.js");
        contentType = "text/javascript";
        break;
      case "/style.css":
        content = await serveStaticFile("www/style.css");
        contentType = "text/css";
        break;
      case "/tasks/get": 
        content = await serveStaticFile("tasks.json");
        contentType = "text/json";
        break;
      default: 
        content = "Ruta no vinculada\r\n";
        contentType = "text/html";
    }
    sendResponse(response, content, contentType);
  } else if(request.method === "POST"){
    let content;
    let contentType;
    switch(url){
      case "/":
      case "/tasks/post":
        content = "post del json";
        contentType = "text/plain";
        // obetenemos lo que queremos almacenar en el json
        const archivo = await obtenerDatos(request);
        // Guardar los datos en el archivo tasks.json
        await saveTasksToFile(archivo, "tasks.json");
        break;
      default: 
        content = "No se puede hacer POST en tasks.json\r\n";
        contentType = "text/plain";
    }
    sendResponse(response, content, contentType);
  }else{
     response.writeHead(405, {"Content-Type": "text/html"});
     response.write(`M&eacutetodo ${request.method} no permitido!\r\n`);
  }
}


const server = http.createServer(handleRequest);
server.listen(PORT);