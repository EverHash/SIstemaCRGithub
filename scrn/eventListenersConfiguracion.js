/*global document */

//ESTE DOCUMENTO CONTROLA TODO LO RELACIONADO A GESTION COSTOS (AHORA LLAMADO CONFIGURACION)

import { atrasGestionCostos } from "./controlesGestionCostos.js";
import { gestionCostos, actualizarCostos } from "./gestionCostos.js";
import { validacionMontoEstiloBDV } from "./utilidades.js";

//NAVEGACION

document.getElementById("atrasGestionCostos").addEventListener("click", atrasGestionCostos);
document.getElementById("GestionCostos").addEventListener("click", gestionCostos);

//COSTOS

document.getElementById("CostoDolar").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("DescuentoEmpleado").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("DescuentoHermanos").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoInscripcionPreescolar").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoInscripcionPrimaria").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoInscripcionBachillerato").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("descuentoProntoPagoInscripcion").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoPreinscripcionPreescolar").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoPreinscripcionPrimaria").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoPreinscripcionBachillerato").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoMensualidadPreescolar").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoMensualidadPrimaria").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoMensualidadBachillerato").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("descuentoProntoPagoMensualidad").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("mensualidadPreescolarHermanosProntoPago").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("mensualidadPrimariaHermanosProntoPago").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("mensualidadBachilleratoHermanosProntoPago").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoRetiroPapeles").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoRetiroTitulo").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoCertificacionFondoNegro") .addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("CostoNotasCertificadas").addEventListener("input", validacionMontoEstiloBDV);

//ACTUALIZAR

document.getElementById("actualizarPrecios").addEventListener("click", actualizarCostos);