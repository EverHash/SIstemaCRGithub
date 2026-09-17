/*global document, console */

import {cedulaInvalida, 
        rellenarFormularioRepresentante,
        noHayEstudiantes,
        dibujarFilaEstudiante,
        ocultarElementosInterfazConsulta,
        mostrarElementosInterfazConsulta,
        noHayEstudiantesSeleccionados,
        entrarPantallaSeleccionarMesesHabilitar,
        dibujarFilaTablaSeleccionarConcepto,
        obtenerDirectorioEstudiante,
        obtenerDirectorioRepresentante,
        volverPantallaInicioProcesoFinalizado,
        tablaPrimeraConsultaMesesVacia
 } from "./controlesHabilitarMensualidades.js";
import { Base, collection, doc, getDoc, getDocs, updateDoc } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, mostrarPantallaExito, ocultarPantallaCarga } from "./modal.js";
import { annoEnCurso, obtenerPreciosMensualidad } from "./obtenerPrecios.js";
import { determinarPropiedadPorMes } from "./utilidades.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

export {buscarEstudiantesParaHabilitar,
        consultarEstudiantes,
        habilitarMensualidadesSeleccionadas
};

let cedulaParaConsultas;

async function buscarEstudiantesParaHabilitar(){

    try {

      mostrarPantallaCarga();
      ocultarElementosInterfazConsulta();
      if(cedulaInvalida()) return;

      //ESTA FUNCION DIBUJA UNA TABLA E INSERTA LOS DATOS

      await obtenerPreciosMensualidad();

      limpiarFilasTabla("tbodyHabilitarMensualidades", 1);

      //SE OBTIENE LOS DATOS DEL REPRESENTANTE Y
      //SE VERIFICA SI EXISTE

      let cedulaRepresentante = document.getElementById("cedulaRepresentanteHabilitar").value;
      let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));
      if(!datosRepresentante.exists()){
        ocultarPantallaCarga();
        mostrarPantallaError("El representante no está registrado en el sistema");
        return 0;
      }

      cedulaParaConsultas = cedulaRepresentante; //PARA USAR EN OTRAS VARIABLES
      
      rellenarFormularioRepresentante(datosRepresentante.data());

      //SE BUSCAN LOS ESTUDIANTES REGISTRADOS

      let directorio = "representantes/"+ cedulaRepresentante +"/estudiantes" + annoEnCurso;

      let estudiantesRepresentados = await getDocs(collection(Base, directorio));
      if(noHayEstudiantes(estudiantesRepresentados)) return;

      //BUCLE DE LOS ESTUDIANTES OBTENIDOS

      estudiantesRepresentados.forEach((documento) => {

        dibujarFilaEstudiante(documento.data());

      });

      ocultarPantallaCarga();
      mostrarElementosInterfazConsulta();
        
    } catch (error){

      ocultarPantallaCarga();
      mostrarPantallaError(error);
        
    }
}

async function consultarEstudiantes() {
  try {
    
    mostrarPantallaCarga();

    if(noHayEstudiantesSeleccionados()){

      ocultarPantallaCarga();
      mostrarPantallaError("Seleccione uno o más estudiantes, por favor");
      return;

    }

    limpiarFilasTabla("tbodyMesesSeleccionarHabilitar", 1);

    let directorio = "representantes/"+ cedulaParaConsultas +"/estudiantes" + annoEnCurso;

    let estudiantes = await getDocs(collection(Base, directorio));

    estudiantes.forEach(estudiante => {

      dibujarFilaTablaSeleccionarConcepto(estudiante.data());

    });

    if(tablaPrimeraConsultaMesesVacia()){

      ocultarPantallaCarga();
      mostrarPantallaError("No hay meses para habilitar");
      return;

    }

    document.getElementById("marcarTodosLosMesesHabilitar").checked = false;

    ocultarPantallaCarga();
    
    entrarPantallaSeleccionarMesesHabilitar();

  } catch (error) {
    
  }
}

    async function habilitarMensualidadesSeleccionadas(){
      try {
        mostrarPantallaCarga();

        let tabla = document.getElementById("tbodyMesesConfirmarHabilitar");

        let directorioEstudiante;

        let directorioRepresentante;

        let propiedad;

        for(let i = 1; i <= tabla.rows.length - 1; i++){

          directorioEstudiante = obtenerDirectorioEstudiante(i);
          directorioRepresentante = obtenerDirectorioRepresentante(i, cedulaParaConsultas);
          propiedad = determinarPropiedadPorMes(tabla.rows[i].cells[4].textContent);

          await updateDoc(doc(Base, directorioEstudiante), {[propiedad]: false});
          await updateDoc(doc(Base, directorioRepresentante), {[propiedad]: false});

        }

        ocultarPantallaCarga();
        volverPantallaInicioProcesoFinalizado();
        mostrarPantallaExito("Mensualidades habilitadas");


      } catch (error) {
        ocultarPantallaCarga();
        console.log(error);
        mostrarPantallaError(error);
      }
    }