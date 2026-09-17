/*global document, console */

import { ocultarPantallaCarga, mostrarPantallaError, mostrarPantallaCarga } from "./modal.js";
import { fechaDeHoy } from "./utilidades.js";
import { getDocs, collection, Base, query, orderBy } from "./firebase.js";
import { annoEnCurso, obtenerPreciosMensualidad } from "./obtenerPrecios.js";
import { dibujarFilaDeudaEstudianteDeudoresGeneral, dibujarFilaDeudaEstudianteSeccionIndividual, formularioInvalido, obtenerDirectorioSeccion } from "./controlesDeudores.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

export {listaDeudores, listaGeneralDeudores};

function esRetirado(mesEnCurso, mesRetiro){

  if((mesEnCurso > mesRetiro) && mesRetiro != 0) return true;
  else return false;

}

async function listaDeudores(){
    try {

      if(formularioInvalido()) return;

      mostrarPantallaCarga();

      let vacio = true;
      let grado = document.getElementById("Grado-De-Instruccion-Deudores").options[document.getElementById("Grado-De-Instruccion-Deudores").selectedIndex].textContent;
      let curso = document.getElementById("Seleccionar-cursoDeudores").options[document.getElementById("Seleccionar-cursoDeudores").selectedIndex].textContent;
      let seccion = document.getElementById("Seleccionar-SeccionDeudores").options[document.getElementById("Seleccionar-SeccionDeudores").selectedIndex].textContent;
      let annoConsultado = document.getElementById("annoEscolarDeudores").value;
      let directorioConsulta;

      if(annoConsultado == "2024-2025"){

        directorioConsulta = "estudiantes/" + grado + "/" + curso + " " + seccion;

      }
      else{

        directorioConsulta = "estudiantes/" + annoConsultado + "/" + grado + "/" + curso + " " + seccion + "/Estudiantes";  

      }

      let solicitud = await query(collection(Base, directorioConsulta), orderBy("nombres"));
      let estudiantes = await getDocs(solicitud);
      
      limpiarFilasTabla("tbodyListaDeudoresSeccion", 2);

      //INSERTAR DATOS Y COMENZAR CON EL BUCLE

      let fechaProcesada = fechaDeHoy();
      document.getElementById("cursoListaDeudores").textContent = "Curso: " + curso + " " + seccion;
      document.getElementById("fechaListaDeudores").textContent = "Fecha: " + fechaProcesada;
      estudiantes.forEach((estudiante) => {
        vacio = false;
        dibujarFilaDeudaEstudianteSeccionIndividual(estudiante.data());

      });
      if(vacio == true){
        document.getElementById("cajaTablaDeudores").style.display = "none";
        document.getElementById("imprimirListaDeudores").style.display = "none";
        ocultarPantallaCarga();
        mostrarPantallaError("Sección Vacía");
        return;
      }

      ocultarPantallaCarga();
      document.getElementById("cajaTablaDeudores").style.display = "block";
      document.getElementById("imprimirListaDeudores").style.display = "flex";
    
    } catch (error) {
      ocultarPantallaCarga();
      console.log("ERROR AL BUSCAR LA LISTA DE DEUDORES: ", error);
      mostrarPantallaError("Error Inesperado");
    }
  }

  async function listaGeneralDeudores(){
    try {
      mostrarPantallaCarga();
      let vacio = true;
      let solicitud;
      let estudiantes;
      let cursoArray = ["Primer Nivel", "Segundo Nivel", "Tercer Nivel", "Primer Grado", //4 - 9
      "Segundo Grado", "Tercer Grado", "Cuarto Grado", "Quinto Grado", "Sexto Grado", 
      "Primer Año", "Segundo Año", "Tercer Año", "Cuarto Año", "Quinto Año"];
      let seccionArray = ["Sección A", "Sección B"];
      await obtenerPreciosMensualidad();
      let annoConsultado = annoEnCurso;
      let directorioConsulta;

      limpiarFilasTabla("tabla-ListaGeneralDeudores", 2);
      let fechaProcesada = fechaDeHoy();
      document.getElementById("fechaListaGeneralDeudores").textContent = "Fecha: " + fechaProcesada;
        for(let j = 0; j <= cursoArray.length - 1; j++){
          for(let k = 0; k <= 1; k++){
            directorioConsulta = obtenerDirectorioSeccion(cursoArray[j], seccionArray[k], annoConsultado);  
            solicitud = await query(collection(Base, directorioConsulta), orderBy("nombres"));
            estudiantes = await getDocs(solicitud);
            estudiantes.forEach((estudiante) => {
              vacio = false;

              dibujarFilaDeudaEstudianteDeudoresGeneral(estudiante.data(), cursoArray[j] + " " + seccionArray[k]);

            });
          }
        }
      if(vacio == true){
        ocultarPantallaCarga();
        return 1;
      }
      else{
        ocultarPantallaCarga();
      }
    } catch (error) {
      ocultarPantallaCarga();
      console.log("ERROR AL BUSCAR LA LISTA DE DEUDORES: ", error);
      mostrarPantallaError("Error Inesperado");
    }
  }