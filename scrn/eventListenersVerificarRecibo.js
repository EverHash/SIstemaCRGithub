/*global document */

//ESTE DOCUMENTO CONTROLA LOS EVENT LISTENERS ASOCIADOS AL MODULO DE 
//VERIFICACION DE RECIBOS

import { mostrarVerificarTicket, atrasVerificarTicket } from "./controlesVerificarTicket.js";
import { verificacionTicket } from "./verificarTicket.js";
import { pdfVerificarTicket } from "./impresion.js";

//NAVEGACION

document.getElementById("atrasVerificarTicket").addEventListener("click", atrasVerificarTicket);
document.getElementById("VerificarTicket").addEventListener("click", mostrarVerificarTicket);

//BOTON

document.getElementById("BotonVerificarTicket").addEventListener("click", verificacionTicket);
document.getElementById("imprimirReciboVerificarTicket").addEventListener("click", pdfVerificarTicket);