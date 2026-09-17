/*global document */

import {atrasPantallasMesesSolventes, 
        entrarMensualidadesInscribir, 
        todosMesesSolventesInscripcion,
        atrasMesesPagarInscripcion,
        seleccionarTodosMesesPagarInscripcion, 
        entrarPantallaConfirmarInscribir,
        atrasPantallaConfirmarInscribir,
        entrarPantallaPagarMensualidadInscribir} from "./controlesInscripcionMensualidad.js";

//NAVEGACION

document.getElementById("atrasMesesSolventesInscripcion").addEventListener("click", atrasPantallasMesesSolventes);
document.getElementById("BotonContinuarSolvenciasInscripcion").addEventListener("click", entrarMensualidadesInscribir);

document.getElementById("atrasConfirmarInscribir").addEventListener("click", atrasPantallaConfirmarInscribir);
document.getElementById("BotonConfirmarMensualidadesInscribir").addEventListener("click", entrarPantallaPagarMensualidadInscribir);
document.getElementById("BotonContinuarMesesInscripcion").addEventListener("click", entrarPantallaConfirmarInscribir);

//ELEMENTOS HTML

document.getElementById("todosMesesSolventesInscripcion").addEventListener("change", todosMesesSolventesInscripcion);
document.getElementById("atrasMesesPagarInscripcion").addEventListener("click", atrasMesesPagarInscripcion);
document.getElementById("pagarTodosLosMesesInscripcionInput").addEventListener("change", seleccionarTodosMesesPagarInscripcion);