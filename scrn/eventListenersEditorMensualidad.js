/*global document */

import { actualizarMensualidades, consultarEstudiantesEditor } from "./editorMensualidad.js";
import { pdfEdicionMensualidad } from "./impresion.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";
import { continuarTicketEdicionMensualidad } from "./recibos.js";
import { flechaAbajoAnnoEscolar, flechaArribaAnnoEscolar } from "./utilidades.js";

//EL PORTAPAPELES

document.getElementById("pegarCedulaCopiadaEditorMensualidad").addEventListener("click", pegarContenidoPortapapeles);

//LAS FLECHAS DEL SELECTOR DE AÑO ESCOLAR

document.getElementById("flechaAbajoAnnoEscolarEditorMensualidad").addEventListener("click", flechaAbajoAnnoEscolar);
document.getElementById("flechaArribaAnnoEscolarEditorMensualidad").addEventListener("click", flechaArribaAnnoEscolar);

//EL BOTON PARA CONSULTAR

document.getElementById("buscarRepresentanteEditorMensualidad").addEventListener("click", consultarEstudiantesEditor);

//EL BOTON PARA ACTUALIZAR

document.getElementById("editarMensualidades").addEventListener("click", actualizarMensualidades);

//RECIBO

document.getElementById("ContinuarTicketEdicionMensualidad").addEventListener("click", continuarTicketEdicionMensualidad);
document.getElementById("imprimirTicketEdicionMensualidad").addEventListener("click", pdfEdicionMensualidad);