/*global document, console */

import {mostrarPantallaCarga, ocultarPantallaCarga, mostrarPantallaError} from "./modal.js";
import {getDocs, collection, Base, orderBy, query} from "./firebase.js";
import { fechaDeHoy } from "./utilidades.js";
import { copiarAlPortapapelesCedulaDatosSeccion } from "./portapapeles.js";
import { limpiarTablaDatosSeccion } from "./controlesDatosSeccion.js";
export {listaDatosSeccion};

async function listaDatosSeccion(){
    try {
      mostrarPantallaCarga();
      if(document.getElementById("Grado-De-Instruccion-DatosSeccion").selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Seleccione por favor un grado de instrucción...");
        return 0;
      }
      if(document.getElementById("Seleccionar-cursoDatosSeccion").selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Seleccione por favor un curso...");
        return 0;
      }
      if(document.getElementById("Seleccionar-SeccionDatosSeccion").selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Seleccione por favor una sección...");
        return 0;
      }
      limpiarTablaDatosSeccion();
      let vacio = true;
      let grado = document.getElementById("Grado-De-Instruccion-DatosSeccion").options[document.getElementById("Grado-De-Instruccion-DatosSeccion").selectedIndex].textContent;
      let curso = document.getElementById("Seleccionar-cursoDatosSeccion").options[document.getElementById("Seleccionar-cursoDatosSeccion").selectedIndex].textContent;
      let seccion = document.getElementById("Seleccionar-SeccionDatosSeccion").options[document.getElementById("Seleccionar-SeccionDatosSeccion").selectedIndex].textContent;
      let tabla = document.getElementById("tabla-Lista-DatosSeccion");

      let annoConsultado = document.getElementById("annoEscolarDatosSeccion").value;
      let directorioConsulta;

      if(annoConsultado == "2024-2025"){

        directorioConsulta = "estudiantes/" + grado + "/" + curso + " " + seccion;

      }
      else{

        directorioConsulta = "estudiantes/" + annoConsultado + "/" + grado + "/" + curso + " " + seccion + "/Estudiantes";  

      }

      let nombreEstudiante, cedulaRepresentante, nombreRepresentante, fila;
      let contenedorTextoCedula, botonCopiarTexto;
      let estudiantes = await getDocs(query(collection(Base, directorioConsulta), orderBy("nombres")));
      let fechaProcesada = fechaDeHoy(); 
      document.getElementById("cursoListaDeudores").textContent = "Curso: " + curso + " " + seccion;
      document.getElementById("fechaListaDeudores").textContent = "Fecha: " + fechaProcesada;
      estudiantes.forEach((estudiante) => {
        vacio = false;
        nombreEstudiante = document.createElement("td");
        nombreEstudiante.innerText = estudiante.data().nombres + " " + estudiante.data().apellidos;
        nombreRepresentante = document.createElement("td");
        nombreRepresentante.innerText = estudiante.data().nombreRepresentante;       
        cedulaRepresentante = document.createElement("td");
        cedulaRepresentante.className = "cajaContenedorCedulaListaSeccion";
        contenedorTextoCedula = document.createElement("span");
        contenedorTextoCedula.textContent = estudiante.data().cedulaRepresentante;
        botonCopiarTexto = document.createElement("img");
        botonCopiarTexto.src = "rsrcs/file_14591883.png";
        botonCopiarTexto.className = "iconoPequenno";
        botonCopiarTexto.addEventListener("click", copiarAlPortapapelesCedulaDatosSeccion);
        cedulaRepresentante.appendChild(contenedorTextoCedula);
        cedulaRepresentante.appendChild(botonCopiarTexto);
        fila = document.createElement("tr");
        fila.appendChild(nombreEstudiante);
        fila.appendChild(nombreRepresentante);
        fila.appendChild(cedulaRepresentante);
        tabla.appendChild(fila);
      });
      if(vacio == true){
        ocultarPantallaCarga();
        document.getElementById("cajaTablaDatosSeccion").style.display = "none";
        mostrarPantallaError("Sección Vacía");
        return 0;
      }
      else{
        tabla.style.fontSize = "14px";
        ocultarPantallaCarga();
        document.getElementById("cajaTablaDatosSeccion").style.display = "block";
      }
    } catch (error) {
      ocultarPantallaCarga();
      console.log("ERROR AL BUSCAR LA LISTA DE DEUDORES: ", error);
      mostrarPantallaError("Error Inesperado");
    }
  }