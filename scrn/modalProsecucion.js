/*global document, console */

import { escribirFormularioDigitalEstudiante, escribirFormularioDigitalPrimerEstudiante, escribirFormularioDigitalRepresentante, retornarFormulariosEstudiantesAestadoOriginal } from "./controlesInscripcion.js";
import { Base, collection, doc, getDoc, getDocs } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { crearCeldaConTexto, limpiarFilasTabla, crearCeldaConInput, crearTRconCeldasApendadas } from "./utilidadesTablas.js";
import { cedulaRepre as cedulaRepreConsulta} from "./inscribir.js";

export {escribirEstudianteTablaProsecucion,
        mostrarModalProsecucion,
        ocultarModalProsecucion,
        buscarEstudiantesSeleccionadosModalProsecucion};

let annoEscolarConsulta = "";

function estudianteConDeuda(estudiante){
    
    let arrayPropiedades = ["pagoInscripcion",
                            "pago09Septiembre",
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

    for(let i = 0; i <= arrayPropiedades.length - 1; i++){

        if(estudiante[arrayPropiedades[i]] == false){

            mostrarPantallaError("El estudiante presenta deudas, no se puede realizar prosecución");
            return 1;

        }

    }

    return 0;

}

function escribirEstudianteTablaProsecucion(datosEstudiante){

    let tabla = document.getElementById("tablaDetallesEstudiantesProsecucion");

    let celdaNombre = crearCeldaConTexto(datosEstudiante.nombres + " " + datosEstudiante.apellidos);
    let celdaCedula = crearCeldaConTexto(datosEstudiante.cedula);
    let celdaCurso = crearCeldaConTexto(datosEstudiante.curso);
    let celdaInput = crearCeldaConInput("checkbox", false, "");

    let arrayFilas = [];

    arrayFilas.push(celdaNombre);
    arrayFilas.push(celdaCedula);
    arrayFilas.push(celdaCurso);
    arrayFilas.push(celdaInput);

    tabla.appendChild(crearTRconCeldasApendadas(arrayFilas));

}

function formularioInvalido(){

    let tabla = document.getElementById("tablaDetallesEstudiantesProsecucion");

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[3].children[0].checked) return false;

    }

    return true;

}

async function buscarEstudiantesSeleccionadosModalProsecucion(){

    if(formularioInvalido()){

        mostrarPantallaError("Seleccione uno o más estudiantes por favor");
        return;

    }

    mostrarPantallaCarga();

    retornarFormulariosEstudiantesAestadoOriginal();

    let annoEscolarConsulta = document.getElementById("annoEscolarConsultaEstudiantesProsecucion").value;

    let directorioConsulta;

    let consultaEstudiante;

    let tabla = document.getElementById("tablaDetallesEstudiantesProsecucion");

    let cedulasSeleccionadas = [];

    //SE PROCEDE A SELECCIONAR LAS CEDULAS DE LOS ESTUDIANTES
    //QUE SE VA A CONSULTAR PARA ESCRIBIR EL FORMULARIO


    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[3].children[0].checked) cedulasSeleccionadas.push(tabla.rows[i].cells[1].textContent);

    }


    //SE PREPARA EL DIRECTORIO PARA CONSULTAR
    //LOS ESTUDIANTES EN LA BASE DE DATOS


    if(annoEscolarConsulta == "2024-2025"){

      directorioConsulta = "representantes/" + cedulaRepreConsulta + "/estudiantes";

    }
    else{

      directorioConsulta = "representantes/" + cedulaRepreConsulta + "/estudiantes" + annoEscolarConsulta;

    }

    //SE PROCEDE A BUSCAR LOS 
    //ESTUDIANTES EN LA BASE DE DATOS
    //Y A LA VEZ, ESCRIBIR LOS DATOS
    //DE DICHOS ESTUDIANTES EN EL
    //FORMULARIO CORRESPONDIENTE


    for(let i = 0; i <= cedulasSeleccionadas.length - 1; i++){

        consultaEstudiante = await getDoc(doc(Base, directorioConsulta, cedulasSeleccionadas[i]));

        if(estudianteConDeuda(consultaEstudiante.data())){

            ocultarPantallaCarga();
            return;

        }

        if(i != 0) escribirFormularioDigitalEstudiante(consultaEstudiante.data(), i + 1);
        else escribirFormularioDigitalPrimerEstudiante(consultaEstudiante.data());

    }


    //SE OBTIENEN LOS DATOS DEL REPRESENTANTE

    let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepreConsulta));


    escribirFormularioDigitalRepresentante(datosRepresentante.data());

    ocultarPantallaCarga();
    mostrarFormulariosInscripcion();

    return;

    //HACE FALTA UN FLAG PARA REGISTRAR EL REPRESENTANTE
    //Y UN FLAG PARA SABER SI TIENE ABONO Y HAY QUE ACOMODARLO
    //UN FLAG QUE DETERMINE HACIA DONDE VAN LOS BOTONES HACIA ATRAS

}

//CONTROLES DE APARECER
//Y DESAPARECER EL MODAL


function mostrarModalProsecucion(){

    document.getElementById("PantallaDatosEstudiantesProsecucion").style.display = "block";

}

function ocultarModalProsecucion(){

    document.getElementById("PantallaDatosEstudiantesProsecucion").style.display = "none";

}

function mostrarFormulariosInscripcion(){

    document.getElementById("mainContainerDatosProsecucion").style.display = "none";
    document.getElementById("mainContainerInscribirEstudiante").style.display = "block";

}