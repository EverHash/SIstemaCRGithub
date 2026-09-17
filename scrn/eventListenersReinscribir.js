/*global document */

import { buscarRepresentanteReinscribir } from "./reinscribir.js";
import {paginaSiguienteReinscripcion, 
        paginaAnteriorReinscripcion, 
        agregarPaginaEstudianteReinscripcion, 
        eventListenerCalcularCostoReinscripcion, 
        entrarPantallaPagosReinscribir, 
        respuestaNOFormularioImprimirReinscripcion, 
        respuestaSIFormularioImprimirReinscripcion, 
        listaDeCursosReinscribir} from "./controlesReinscripcion.js";

import { ContinuarTicketReinscripcion } from "./recibos.js";
import { pdfReinscripcion } from "./impresion.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";

document.getElementById("buscarRepresentanteReinscribir").addEventListener("click", buscarRepresentanteReinscribir);

//LOS ELEMENTOS DEL FORMULARIO QUE YA ESTABAN

document.getElementById("Grado-De-InstruccionReinscripcion").addEventListener("change", eventListenerCalcularCostoReinscripcion);
document.getElementById("Grado-De-InstruccionReinscripcion").addEventListener("change", listaDeCursosReinscribir);

//NAVEGACION FORMULARIOS

document.getElementById("reinscribirSiguiente").addEventListener("click", paginaSiguienteReinscripcion);
document.getElementById("reinscribirAtras").addEventListener("click", paginaAnteriorReinscripcion);
document.getElementById("reinscribirAgregar").addEventListener("click", agregarPaginaEstudianteReinscripcion);

//FORMULARIO DE IMPRESION DE RECIBO

document.getElementById("ContinuarTicketReinscripcion").addEventListener("click", ContinuarTicketReinscripcion);
document.getElementById("imprimirTicketReinscripcion").addEventListener("click", pdfReinscripcion);

//BOTONES

document.getElementById("reinscribir-Estudiante").addEventListener("click", entrarPantallaPagosReinscribir);

//IMPRESION DE FORMULARIO DE INSCRIPCION

document.getElementById("imprimirFormularioReinscribir").addEventListener("click", respuestaSIFormularioImprimirReinscripcion);
document.getElementById("NOimprimirFormularioReinscribir").addEventListener("click", respuestaNOFormularioImprimirReinscripcion);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaReinscribirEstudiante").addEventListener("click", pegarContenidoPortapapeles);