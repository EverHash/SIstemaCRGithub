/*global document, console */

import { ocultarYlimpiar } from "./controlesEditorMensualidad.js";
import {mostrarPantallaCarga, 
        mostrarPantallaError, 
        ocultarPantallaCarga } from "./modal.js";
import { annoEnCurso, obtenerPreciosMensualidad } from "./obtenerPrecios.js";

export {
    entrarTiposEdicion,
    atrasTiposEdicion,
    entrarEditorMensualidades,
    atrasEditorMensualidad

};

function entrarTiposEdicion(){

    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("mainContainerTipoEdicion").style.display = "block";

}

function atrasTiposEdicion(){
    document.getElementById("mainContainerTipoEdicion").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
}

async function entrarEditorMensualidades(){
    try {
        mostrarPantallaCarga();
        await obtenerPreciosMensualidad();
        document.getElementById("mainContainerTipoEdicion").style.display = "none";
        document.getElementById("mainContainerEditorMensualidad").style.display = "block";
        document.getElementById("annoEscolarEditorMensualidad").value = annoEnCurso;
        ocultarPantallaCarga();        
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        console.log(error);
    }

}

function atrasEditorMensualidad(){

    document.getElementById("mainContainerEditorMensualidad").style.display = "none";
    document.getElementById("mainContainerTipoEdicion").style.display = "block";    
    ocultarYlimpiar();

}