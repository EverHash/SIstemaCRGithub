/*global document, console */

import { armarDirectorioEstudiante, armarDirectorioRepresentante, dibujarFilaTabla, dibujarFilaTablaDetallesMeses, entrarSeleccionarMesesConvenio, estudianteNoElegible, estudianteTieneConvenioPorMes, fechaConvenioVencida, insertarDatosRepresentante, limpiarFormulariosInterfazConsulta, mostrarElementosInterfazConsulta, obtenerTodasLasCedulas, ocultarElementosInterfazConsulta, pantallaConsultaMensualidadesVacia } from "./controlesConvenioPagos.js";
import { Base, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteField } from "./firebase.js";
import {mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga} from "./modal.js";
import { representante } from "./objetos.js";
import { annoEnCurso } from "./obtenerPrecios.js";
import { cambiarAFechaVenezolana, convertirAfechaHTML, extraerMesEscolar, fechaDeHoy, fechaDeHoyFormatoJS } from "./utilidades.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

let cedulaProcesos;

let nombreRepreProcesos;

export let flagEmpleadoConvenio = false;
export let flagHermanosConvenio = false;

export let arrayEstudiantesConvenio = [];

export let representanteConvenio;

function determinarFlagEmpleado(representante){

    if(representante.tipoRepresentante == "Empleado") return true;
    else return false;

}

export async function consultar(){

    try {

        mostrarPantallaCarga();
        
        limpiarFormulariosInterfazConsulta();
        
        ocultarElementosInterfazConsulta();

        cedulaProcesos = document.getElementById("cedulaRepresentanteConvenios").value;

        let representante = await getDoc(doc(Base, "representantes", cedulaProcesos));

        insertarDatosRepresentante(representante.data());

        representanteConvenio = representante.data();

        nombreRepreProcesos = representanteConvenio.nombres + " " + representanteConvenio.apellidos;

        flagEmpleadoConvenio = determinarFlagEmpleado(representante.data());

        await buscarEstudiantes();

        mostrarElementosInterfazConsulta();

        ocultarPantallaCarga();

    } catch (error) {
     
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        
    }

}

export async function buscarEstudiantes(){

    let directorio = "representantes/" + cedulaProcesos + "/estudiantes" + annoEnCurso;

    let estudiantes = await getDocs(collection(Base, directorio));

    let indiceMesEnCurso = extraerMesEscolar() - 1; //PA PONERLO A LA PAR CON EL INDICE DEL BUCLE

    let nEstudiantes = 0;

    arrayEstudiantesConvenio = [];

    estudiantes.forEach(estudiante => {

        arrayEstudiantesConvenio.push(estudiante.data());

        dibujarFilaTabla(estudiante.data(), indiceMesEnCurso);

        nEstudiantes++;

        if(nEstudiantes > 1) flagHermanosConvenio = true;
    });

    console.log(arrayEstudiantesConvenio);

}

export async function continuarVerMesesDetalladosConvenios(){

    limpiarFilasTabla("tbodyDetallesMensualidadesConvenio", 1);

    try {
        mostrarPantallaCarga();

        let directorio = "representantes/" + cedulaProcesos + "/estudiantes" + annoEnCurso;
        let estudiantes = await getDocs(collection(Base, directorio));        

        debugger;

        let flagConvenioFallido = false;

        estudiantes.forEach(estudiante => {

            let propiedadesMeses = ["pago09Septiembre",
                                    "pago10Octubre",
                                    "pago11Noviembre",
                                    "pago12Diciembre",
                                    "pago13Enero",
                                    "pago14Febrero",
                                    "pago15Marzo",
                                    "pago16Abril",
                                    "pago17Mayo",
                                    "pago18Junio",
                                    "pago19Julio",
                                    "pago20Agosto"];

            let objEstudiante = estudiante.data();

            if(estudianteNoElegible(objEstudiante)){

                flagConvenioFallido = true;
                return; // SI FALLO EN PAGAR A UNO, NO DEJA HACER MAS CONVENIOS
            } 

            if(objEstudiante.hasOwnProperty("pagoInscripcion")){

                if(!objEstudiante.pagoInscripcion){

                    if(!estudianteTieneConvenioPorMes(objEstudiante, 0)) dibujarFilaTablaDetallesMeses(objEstudiante, 0);

                }

            }

            for(let i = 0; i <= propiedadesMeses.length - 1; i++){

                if(objEstudiante[propiedadesMeses[i]]) continue;

                if(estudianteTieneConvenioPorMes(objEstudiante, i + 1)) continue;

                dibujarFilaTablaDetallesMeses(objEstudiante, i + 1);

            }

        });

        if(flagConvenioFallido){

            ocultarPantallaCarga();
            mostrarPantallaError("El representante no cumplió el convenio respecto a uno o más estudiantes");
            return;

        }

        if(pantallaConsultaMensualidadesVacia()){

            ocultarPantallaCarga();
            mostrarPantallaError("No hay mensualidades disponibles para crear un convenio");
            return;

        }

        entrarSeleccionarMesesConvenio();
        ocultarPantallaCarga();
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        console.log(error);
    }
    
}

export async function crearConvenio(){

    mostrarPantallaCarga();

    let cedulas = obtenerTodasLasCedulas();

    let respuesta;

    for(let i = 0; i <= cedulas.length - 1; i++){

        respuesta = await subirConvenioEstudiante(cedulas[i]);

        if(respuesta == "ERROR") return "ERROR";

    }

    let resultadoReporte = await crearReporteConvenio(2); //2 POR SER CONVENIO REGULAR
        
    if(resultadoReporte != 0) return "ERROR";

    ocultarPantallaCarga();

}

async function subirConvenioEstudiante(cedula){

    let tabla = document.getElementById("tbodyConfirmarMesesConvenio");

    let objetoEstudiante = {};

    let cedulaBucle;

    let mes;

    let fechaPago = document.getElementById("fechaDePagoCrearConvenio").value;

    fechaPago = cambiarAFechaVenezolana(fechaPago);

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        cedulaBucle = tabla.rows[i].cells[1].textContent;

        if(cedulaBucle == cedula){

            mes = tabla.rows[i].cells[3].textContent;

            if(mes == "Inscripción") mes = "Inscripcion";

            objetoEstudiante["convenio" + mes] = fechaPago;
        }

    }



    let directorioEstudiante = armarDirectorioEstudiante(cedula, cedulaProcesos); //PROCESOS ES REPRESENTANTE
    let directorioRepresentante = armarDirectorioRepresentante(cedula, cedulaProcesos);

    try {
        await updateDoc(doc(Base, directorioRepresentante), objetoEstudiante);
        await updateDoc(doc(Base, directorioEstudiante), objetoEstudiante);

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return "ERROR";
        
    }


}

export async function procesarPagoConvenio(estudiante, indice, directorioEstudiante, directorioRepresentante){

    let propiedades = ["Inscripcion",
                       "Septiembre",
                       "Octubre",
                       "Noviembre",
                       "Diciembre",
                       "Enero",
                       "Febrero",
                       "Marzo",
                       "Abril",
                       "Mayo",
                       "Junio",
                       "Julio",
                       "Agosto"];

    let fechaHoy = fechaDeHoyFormatoJS();

    let fechaConvenio = estudiante["convenio" + propiedades[indice]];

    fechaConvenio = convertirAfechaHTML(fechaConvenio);

    directorioRepresentante += estudiante.cedula;

    if(fechaConvenioVencida(fechaConvenio, fechaHoy)){

        await updateDoc(doc(Base, directorioRepresentante), {["convenioFallido" + propiedades[indice]]: true});
        await updateDoc(doc(Base, directorioEstudiante), {["convenioFallido" + propiedades[indice]]:true});        

    }
    else{

        await updateDoc(doc(Base, directorioRepresentante), {["convenioCumplido" + propiedades[indice]]: true});
        await updateDoc(doc(Base, directorioEstudiante), {["convenioCumplido" + propiedades[indice]]:true});  

    }

    await updateDoc(doc(Base, directorioRepresentante), {["convenio" + propiedades[indice]]: deleteField()});
    await updateDoc(doc(Base, directorioEstudiante), {["convenio" + propiedades[indice]]: deleteField()});     



}

export async function crearReporteConvenio(tipoConvenio){ //CREAR REPORTE CONVENIO CREADO

    //tipoConvenio: 1 EN CASO DE SER INSCRIPCION
    //tipoConvenio: 2 EN CASO DE SER CONVENIO REGULAR

    let obtenerNumeroDeReporte;
    let IdReporte;    
    
    try { //SE OBTIENE EL NUMERO DE REPORTE
        
        obtenerNumeroDeReporte = await doc(Base, "variables", "numeroReportes");
        let numeroDeReporte = await getDoc(obtenerNumeroDeReporte);
        let IdReporteObtener = numeroDeReporte.data();

        IdReporte = IdReporteObtener.numero + 1;

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return "ERROR";
    }

    let fechaHoy = fechaDeHoy();

    let reporte;

    if(tipoConvenio == 1) reporte = obtenerDatosReporteConvenioInscripcion(IdReporte, fechaHoy); //INSCRIPCION
    if(tipoConvenio == 2) reporte = obtenerDatosReporteConvenioRegular(IdReporte, fechaHoy); //REGULAR

    reporte = agregarCambiosConvenio(reporte, tipoConvenio);

    try { //SE SUBE A LA BASE DE DATOS EL RECIBO
        await setDoc(doc(Base, "reportesEdicion/" + IdReporte), reporte);
        await updateDoc(obtenerNumeroDeReporte, {numero: IdReporte});
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return "ERROR";
    }

    return 0;

}

function obtenerDatosReporteConvenioInscripcion(IdReporte, fechaHoy){

  let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");

  //AQUI SE OBTIENEN LOS DATOS DEL REPRESENTANTE, LUEGO SE
  //PROCEDE A PREPARAR EL OBJETO PARA SUBIRLO

  const repre = new representante();

  repre.obtenerDatosRepresentante(formularios);

  let reporte = { //SE CREA EL REPORTE
     tipoEdicion: "Inscripción Convenio",
     numeroReporte: IdReporte,
     nombreRepresentante: repre.nombres + " " + repre.apellidos,
     fecha: fechaHoy,
     cedulaRepresentante: repre.cedula,
  };

  return reporte;


}

function obtenerDatosReporteConvenioRegular(IdReporte, fechaHoy){

    let reporte = { //SE CREA EL REPORTE
        tipoEdicion: "Convenio",
        numeroReporte: IdReporte,
        nombreRepresentante: nombreRepreProcesos,
        fecha: fechaHoy,
        cedulaRepresentante: cedulaProcesos,
    };

    return reporte;

}


function agregarCambiosConvenio(objetoReporte, tipoConvenio){

    //tipoConvenio: 1 EN CASO DE SER INSCRIPCION
    //tipoConvenio: 2 EN CASO DE SER CONVENIO REGULAR

    let arrayIdsTabla = ["tbodyConfirmarMesesConvenioInscripcion", "tbodyConfirmarMesesConvenio"];
    
    let arrayIdsFechas = ["fechaDePagoCrearConvenioInscripcion", "fechaDePagoCrearConvenio"];
    
    //VARIABLES PARA EL BUCLE
    
    let nombreEstudiante;
    
    let contador = 1;

    let mesConvenio;

    //VARIABLES DE ELEMENTOS HTML
    
    let tbody = document.getElementById(arrayIdsTabla[tipoConvenio - 1]);

    let fechaConvenio = document.getElementById(arrayIdsFechas[tipoConvenio - 1]).value;

    fechaConvenio = cambiarAFechaVenezolana(fechaConvenio);

    for(let i = 1; i <= tbody.rows.length - 1; i++){

        nombreEstudiante = tbody.rows[i].cells[0].textContent;

        mesConvenio = tbody.rows[i].cells[3].textContent;

        objetoReporte["cambio" + contador] = [];

        objetoReporte["cambio" + contador].push(nombreEstudiante);

        if(tipoConvenio == 1 && mesConvenio == "Inscripción"){

            objetoReporte["cambio" + contador].push("No Inscrito");
            objetoReporte["cambio" + contador].push("Inscrito con Convenio para " + fechaConvenio);

        }
        else{

            objetoReporte["cambio" + contador].push("Convenio no Existente");
            objetoReporte["cambio" + contador].push("Convenio " + mesConvenio + " para " + fechaConvenio);

        }


        contador++;
    }

    return objetoReporte;

}



export async function crearReporteConvenioIncumplido(){

    let fechaHoy = fechaDeHoy();

    let reporte = {
        tipoEdicion: "Convenio",
        numeroReporte: "",
        nombreRepresentante: nombreRepreProcesos,
        fecha: fechaHoy,
        cedulaRepresentante: cedulaProcesos,

    };



    
}