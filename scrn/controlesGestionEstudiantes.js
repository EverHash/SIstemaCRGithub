/*global document */

import {deshabilitarFormularioRepresentante, flagAbonoRepreNoRegistrado, flagRepresentanteRegistrado, habilitarFormularioRepresentante, limpiarFlagsSelectsNuevoIngreso, limpiarFormulariosInscripcion, retrocederHaciaConsultaDatosNuevoIngreso, retrocederHaciaEstudiantesProsecucion, retrocederHaciaTipoRepresentanteNuevoIngreso} from "./controlesInscripcion.js";
import { annoEnCurso, obtenerPrecioInscripcion, obtenerPreciosMensualidad } from "./obtenerPrecios.js";
import { mostrarPantallaCarga, ocultarPantallaCarga } from "./modal.js";
import { setTipoPago } from "./controlesEfectuarPago.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";
import { mostrarVariable } from "./debugWIndow.js";

export {entrarGestionEstudiantes, 
        atrasGestionEstudiantes, 
        entrarTiposInscripcion, 
        atrasTiposInscripcion,
        entrarInscribirEstudiante,
        atrasInscribirEstudiantes,
        entrarPantallaNuevoIngreso};

export let tipoInscripcion;

export let tipoProcedimiento;

/*

    tipoProcedimiento = "inscripcionRegular" || "inscripcionConvenio" || "preinscripcion" || "inscripcionExonerada";

*/

function entrarGestionEstudiantes(){
    let mainContainerPostLogin = document.getElementById("main-container-postLogin");
    let mainContainerGestionEstudiantes = document.getElementById("main-container-GestionEstudiantes");
    mainContainerPostLogin.style.display = "none";
    mainContainerGestionEstudiantes.style.display = "block";
}

function atrasGestionEstudiantes(){
    document.getElementById("main-container-GestionEstudiantes").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
}

function entrarTiposInscripcion(){ //INSCRIPCION REGULAR
    document.getElementById("main-container-GestionEstudiantes").style.display = "none";
    document.getElementById("main-container-TiposInscripcion").style.display = "block";

    tipoProcedimiento = "inscripcionRegular";
}

export function entrarInscripcionConvenio(){

    document.getElementById("main-container-GestionEstudiantes").style.display = "none";
    document.getElementById("main-container-TiposInscripcion").style.display = "block";

    tipoProcedimiento = "inscripcionConvenio";

}

export function entrarInscripcionExonerada(){ //AUN NO USADA

    document.getElementById("main-container-GestionEstudiantes").style.display = "none";
    document.getElementById("main-container-TiposInscripcion").style.display = "block";

    tipoProcedimiento = "inscripcionExonerada";

}

function atrasTiposInscripcion(){ //esta lleva a la pantalla de seleccionar si es regular, convenio, etc
    document.getElementById("main-container-TiposInscripcion").style.display = "none";
    document.getElementById("main-container-GestionEstudiantes").style.display = "block";
}

function atrasInscribirEstudiantes(){

    if(tipoInscripcion == "Prosecucion") retrocederHaciaEstudiantesProsecucion();
    if(tipoInscripcion == "Nuevo Ingreso"){

        if(flagRepresentanteRegistrado || flagAbonoRepreNoRegistrado){

            retrocederHaciaConsultaDatosNuevoIngreso();

        }
        else retrocederHaciaTipoRepresentanteNuevoIngreso();

    }

  limpiarFormulariosInscripcion();
}

export function atrasEstudiantesProsecucion(){

    //CAMBIANDO DE PANTALLA

    document.getElementById("mainContainerDatosProsecucion").style.display = "none";
    document.getElementById("mainContainerDatosRepresentanteProsecucion").style.display = "block";

    //LIMPIANDO EL FORMULARIO

    limpiarFormularioEstudiantesProsecucion();

}

export function limpiarFormularioEstudiantesProsecucion(){

    document.getElementById("annoEscolarConsultaEstudiantesProsecucion").value = annoEnCurso;
    document.getElementById("pantallaProsecucion").style.display = "none";
    limpiarFilasTabla("tablaDetallesEstudiantesProsecucion", 1);

}

export function atrasRepresentanteProsecucion(){

    //CAMBIO DE PANTALLA

    document.getElementById("mainContainerDatosRepresentanteProsecucion").style.display = "none";
    document.getElementById("main-container-TiposInscripcion").style.display = "block";

    limpiarFormularioRepresentanteProsecucion();
}

export function limpiarFormularioRepresentanteProsecucion(){

    document.getElementById("cedulaRepresentanteProsecucion").value = "";
    document.getElementById("nombresRepresentanteProsecucion").value = "";
    document.getElementById("apellidosRepresentanteProsecucion").value = "";
    document.getElementById("totalAbonadoRepresentanteProsecucion").value = "";

}

async function entrarPantallaNuevoIngreso(){
    setTipoPago("Inscripcion");
    tipoInscripcion = "Nuevo Ingreso";
    mostrarVariable(tipoInscripcion, "tipoInscripcion", 3);
    mostrarPantallaCarga();
    await obtenerPrecioInscripcion();
    await obtenerPreciosMensualidad();
    document.getElementById("AnnoEscolarNuevoIngreso").value = annoEnCurso;
    document.getElementById("main-container-TiposInscripcion").style.display = "none";
    document.getElementById("mainContainerDatosRepresentanteRegistradoInscripcion").style.display = "block";
    habilitarFormularioRepresentante();
    ocultarPantallaCarga();
}

export function atrasPantallaNuevoIngreso(){

    limpiarPantallaNuevoIngreso();
    document.getElementById("mainContainerIntroducirDatosNuevoIngreso").style.display = "none";
    document.getElementById("main-container-TiposInscripcion").style.display = "block";

}

export function limpiarPantallaNuevoIngreso(){

    document.getElementById("representanteRegistradoInscripcion").selectedIndex = 0;
    document.getElementById("representanteNoRegistradoAbonoInscripcion").selectedIndex = 0;
    document.getElementById("cuestionarioAbonoNoRegistrado").style.display = "none";
    limpiarFlagsSelectsNuevoIngreso();

}

export function atrasRepresentanteNuevoIngreso(){

    //NAVEGACION

    document.getElementById("main-container-TiposInscripcion").style.display = "block";
    document.getElementById("mainContainerDatosRepresentanteRegistradoInscripcion").style.display = "none";

    limpiarFormularioRepresentanteNuevoIngreso();
}

export function limpiarFormularioRepresentanteNuevoIngreso(){

    document.getElementById("cedulaRepresentanteNuevoIngreso").value = "";
    document.getElementById("nombresRepresentanteNuevoIngreso").value = "";
    document.getElementById("apellidosRepresentanteNuevoIngreso").value = "";
    document.getElementById("totalAbonadoRepresentanteNuevoIngreso").value = "";

}

async function entrarInscribirEstudiante(){
    mostrarPantallaCarga();
    await obtenerPrecioInscripcion();
    await obtenerPreciosMensualidad();
    setTipoPago("Inscripcion");
    habilitarFormularioRepresentante();
    ocultarInputCedulaRepresentanteInscripcion();
    document.getElementById("contenedorAnnoEscolarConsultaProsecucion").style.display = "none";
    document.getElementById("formularioAbonoInscripcion").style.display = "flex";
    document.getElementById("AnnoEscolarInscripcion").value = annoEnCurso;
    document.getElementById("main-container-TiposInscripcion").style.display = "none";
    document.getElementById("mainContainerInscribirEstudiante").style.display = "block";
    ocultarPantallaCarga();
}

export async function entrarProsecucion(){
    setTipoPago("Inscripcion");
    tipoInscripcion = "Prosecucion";
    mostrarVariable(tipoInscripcion, "tipoInscripcion", 3);
    mostrarPantallaCarga();
    deshabilitarFormularioRepresentante();
    await obtenerPrecioInscripcion();
    await obtenerPreciosMensualidad();
    document.getElementById("AnnoEscolarProsecucion").value = annoEnCurso;
    document.getElementById("main-container-TiposInscripcion").style.display = "none";
    document.getElementById("mainContainerDatosRepresentanteProsecucion").style.display = "block";
    ocultarPantallaCarga();
}

function ocultarInputCedulaRepresentanteInscripcion(){

    document.getElementById("formularioAbonoInscripcion").style.display = "none";
    document.getElementById("formularioAgregar").style.display = "none";
    document.getElementById("cedulaConsultarRepresentanteInscripcion").value = "";
    document.getElementById("cedulaConsultarAbonoInscripcion").value = "";

}