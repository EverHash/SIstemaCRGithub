/*global document, console */

import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga, mostrarPantallaExito } from "./modal.js";
import { Base, getDoc, doc, getDocs, collection, updateDoc } from "./firebase.js";
import { dibujarFilaEstudiante, dibujarFilaTablaPrevioConfirmar, entrarPantallaConsultaMesesRetirar, formularioInvalido, limpiarInterfazBuscar, noHayEstudiantes, obtenerDirectorioEstudiante, obtenerDirectorioRepresentante, rellenarFormularioRepresentante, tablaPrimeraConsultaMesesVacia, volverPantallaInicioProcesoFinalizado } from "./controlesRetirarEstudiantes.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";
import { annoEnCurso, obtenerPreciosMensualidad } from "./obtenerPrecios.js";
import { determinarPropiedadPorMes } from "./utilidades.js";

export {BuscarEstudiantesParaRetirar, 
        retirarEstudiantes, 
        continuarRetirarEstudiantes};

let cedulaParaConsultas;

async function BuscarEstudiantesParaRetirar(){
    try {

      //ESTA FUNCION DIBUJA UNA TABLA E INSERTA LOS DATOS

      mostrarPantallaCarga();

      limpiarInterfazBuscar();

      await obtenerPreciosMensualidad();

      limpiarFilasTabla("tabla-retirar-estudiante-encabezado", 1);

      //SE OBTIENE LOS DATOS DEL REPRESENTANTE Y
      //SE VERIFICA SI EXISTE

      if(formularioInvalido()) return;

      let cedulaRepresentante = document.getElementById("cedula-representante-retirar").value;


      let nombreRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));


      if(!nombreRepresentante.exists()){
        ocultarPantallaCarga();
        mostrarPantallaError("El representante no está registrado en el sistema");
        return 0;
      }

      cedulaParaConsultas = cedulaRepresentante; //PARA USAR EN OTRAS VARIABLES
      
      rellenarFormularioRepresentante(nombreRepresentante.data());

      //SE BUSCAN LOS ESTUDIANTES REGISTRADOS

      let estudiantesRepresentados = await getDocs(collection(Base, "representantes/"+ cedulaRepresentante +"/estudiantes" + annoEnCurso));
      if(noHayEstudiantes(estudiantesRepresentados)) return;

      //BUCLE DE LOS ESTUDIANTES OBTENIDOS

      estudiantesRepresentados.forEach((documento) => {

        dibujarFilaEstudiante(documento.data());

      });

      ocultarPantallaCarga();
      document.getElementById("retirarEstudiantes").style.display = "block";
      document.getElementById("tablaRetirar").style.display = "block";
    } 
    catch (error) {
        ocultarPantallaCarga();
        console.log(error);
        mostrarPantallaError(error);
    }
  }


async function continuarRetirarEstudiantes(){

  try {
    
    mostrarPantallaCarga();
    limpiarFilasTabla("tbodyMesesSeleccionarDesactivar", 1);
    let tablaConsultas = document.getElementById("tabla-retirar-estudiante-encabezado");
    let cedulaEstudiante;
    let estudiante;

    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){

      if(tablaConsultas.rows[i].cells[6].children[0].checked){

        cedulaEstudiante = tablaConsultas.rows[i].cells[2].textContent;
        estudiante = await getDoc(doc(Base, "representantes/" + cedulaParaConsultas + "/estudiantes" + annoEnCurso + "/" + cedulaEstudiante));
        dibujarFilaTablaPrevioConfirmar(estudiante.data());

      }

    }

    if(tablaPrimeraConsultaMesesVacia()){

      ocultarPantallaCarga();
      mostrarPantallaError("No hay meses para deshabilitar");
      return;

    }

    entrarPantallaConsultaMesesRetirar();
    ocultarPantallaCarga();
    
  } catch (error) {
      ocultarPantallaCarga();
      mostrarPantallaError(error);
      console.log(error);
    }
    
}





    async function retirarEstudiantes(){
      try {
        mostrarPantallaCarga();

        let tabla = document.getElementById("tbodyMesesConfirmarDesactivar");

        let directorioEstudiante;

        let directorioRepresentante;

        let propiedad;

        for(let i = 1; i <= tabla.rows.length - 1; i++){

          directorioEstudiante = obtenerDirectorioEstudiante(i);
          directorioRepresentante = obtenerDirectorioRepresentante(i, cedulaParaConsultas);
          propiedad = determinarPropiedadPorMes(tabla.rows[i].cells[4].textContent);

          await updateDoc(doc(Base, directorioEstudiante), {[propiedad]: "N/A"});
          await updateDoc(doc(Base, directorioRepresentante), {[propiedad]: "N/A"});

        }

        ocultarPantallaCarga();
        volverPantallaInicioProcesoFinalizado();
        mostrarPantallaExito("Mensualidades desactivadas");


      } catch (error) {
        ocultarPantallaCarga();
        console.log(error);
        mostrarPantallaError(error);
      }
    }