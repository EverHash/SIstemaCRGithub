/*global document */

import{entrarAbonos,
       atrasAbonos,
       dibujarNuevaFilaTablaAbonos,
       entrarPantallaPagarAbono,
       entrarTiposRepresentantesAbonos,
       atrasTiposRepresentantesAbonos,
       entrarRepresentantesNoRegistrados,
       atrasRepresentantesNoRegistrados,
       atrasDatosRepresentanteNoRegistrado,
       continuarIntroducirDatosRepresentanteNoRegistrado,
       entrarPantallaPagarAbonoNoRegistrado} from "./controlesAbonos.js";

import{consultarAbonos} from "./abonos.js";
import { pdfPagoAbono, pdfPagoAbonoNoRegistrado } from "./impresion.js";
import { continuarTicketAbono, continuarTicketAbonoNoRegistrado } from "./recibos.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";
import { validacionMontoEstiloBDV } from "./utilidades.js";

//CONTROLES NAVEGACION

document.getElementById("abonos").addEventListener("click", entrarAbonos);
document.getElementById("atrasAbonos").addEventListener("click", atrasAbonos);
document.getElementById("atrasTipoRepresentantesAbonos").addEventListener("click", atrasTiposRepresentantesAbonos);
document.getElementById("representanteRegistradoAbonos").addEventListener("click", entrarAbonos);
document.getElementById("abonarRepresentante").addEventListener("click", entrarPantallaPagarAbono);

//CONTROLES PANTALLA ABONOS

document.getElementById("consultarRepresentanteAbonos").addEventListener("click", consultarAbonos);
document.getElementById("agregarContenedorAbono").addEventListener("click", dibujarNuevaFilaTablaAbonos);

//CONTROLES ABONOS NO REGISTRADOS
//CONTROLES ABONOS NO REGISTRADOS
//CONTROLES ABONOS NO REGISTRADOS

document.getElementById("representanteNoRegistradoAbonos").addEventListener("click", entrarRepresentantesNoRegistrados);
document.getElementById("atrasAbonosNoRegistrados").addEventListener("click", atrasRepresentantesNoRegistrados);
document.getElementById("atrasAbonosNoRegistradosConsultaRepresentante").addEventListener("click", atrasDatosRepresentanteNoRegistrado);
document.getElementById("botonIntroducirDatosRepresentanteNoRegistradoAbonos").addEventListener("click", continuarIntroducirDatosRepresentanteNoRegistrado);
document.getElementById("agregarContenedorAbonoNoRegistrado").addEventListener("click", dibujarNuevaFilaTablaAbonos);
document.getElementById("primerMontoAbonoNoRegistrado").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("abonarRepresentanteNoRegistrado").addEventListener("click", entrarPantallaPagarAbonoNoRegistrado);
document.getElementById("ContinuarTicketAbonoNoRegistrado").addEventListener("click", continuarTicketAbonoNoRegistrado);
document.getElementById("imprimirTicketAbonoNoRegistrado").addEventListener("click", pdfPagoAbonoNoRegistrado);

//CONTROLES RECIBOS

document.getElementById("ContinuarTicketAbono").addEventListener("click", continuarTicketAbono);
document.getElementById("imprimirTicketAbono").addEventListener("click", pdfPagoAbono);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaAbonos").addEventListener("click", pegarContenidoPortapapeles);