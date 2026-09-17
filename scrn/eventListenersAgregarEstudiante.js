/*global document */

import { buscarRepresentanteAgregar } from "./agregarEstudiante.js";
import {paginaSiguienteAgregar, 
        paginaAnteriorAgregar, 
        agregarPaginaEstudianteAgregar, 
        eventListenerCalcularCostoAgregar, 
        eventListenerTipoRepresentanteInscribir, 
        entrarPantallaPagosAgregar, 
        respuestaNOFormularioImprimirAgregar, 
        respuestaSIFormularioImprimirAgregar, 
        listaDeCursosAgregar} from "./controlesAgregarEstudiante.js";

import { ContinuarTicketAgregar } from "./recibos.js";
import { pdfAgregar } from "./impresion.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";

document.getElementById("buscarRepresentanteAgregar").addEventListener("click", buscarRepresentanteAgregar);

//LOS ELEMENTOS DEL FORMULARIO QUE YA ESTABAN

document.getElementById("tipoRepresentanteAgregar").addEventListener("change", eventListenerTipoRepresentanteInscribir);
document.getElementById("Grado-De-InstruccionAgregar").addEventListener("change", eventListenerCalcularCostoAgregar);
document.getElementById("Grado-De-InstruccionAgregar").addEventListener("change", listaDeCursosAgregar);

//NAVEGACION FORMULARIOS

document.getElementById("agregarSiguiente").addEventListener("click", paginaSiguienteAgregar);
document.getElementById("agregarAtras").addEventListener("click", paginaAnteriorAgregar);
document.getElementById("agregarAgregar").addEventListener("click", agregarPaginaEstudianteAgregar);

//FORMULARIO DE IMPRESION DE RECIBO

document.getElementById("ContinuarTicketAgregar").addEventListener("click", ContinuarTicketAgregar);
document.getElementById("imprimirTicketAgregar").addEventListener("click", pdfAgregar);

//BOTONES

document.getElementById("agregar-Estudiante").addEventListener("click", entrarPantallaPagosAgregar);

//IMPRESION DE FORMULARIO DE INSCRIPCION

document.getElementById("imprimirFormularioAgregar").addEventListener("click", respuestaSIFormularioImprimirAgregar);
document.getElementById("NOimprimirFormularioAgregar").addEventListener("click", respuestaNOFormularioImprimirAgregar);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaAgregarEstudiante").addEventListener("click", pegarContenidoPortapapeles);