/*global document */

//ESTE DOCUMENTO CONTIENE TODOS LOS EVENT LISTENERS QUE MANEJAN LOS PAGOS
//SU EFECTO SE LIMITA A LA PANTALLA DE METODOS DE PAGO

import { efectuarPago,
         agregarFilaTablaMetodosPago,
         tipoBillete,
         calcularResultadoCalculadoraDolares,
         cambiarTipoConversion,
         atrasEfectuarPago,
         mostrarModalDetallesPago,
         ocultarModalDetallesPago,
         introducirDatosArrayTabla, 
         mostrarDineroContenedorAbonos,
         limpiarFilaArrayTabla} from "./controlesEfectuarPago.js";
import { ocultarModalConfirmarPagar, mostrarConfirmarPagar } from "./modal.js";

import { validacionMontoEstiloBDV } from "./utilidades.js";


//CONTROLES RELACIONADOS A EFECTUAR LOS PAGOS

document.getElementById("efectuarPago").addEventListener("click", mostrarConfirmarPagar); //MOSTRAR MODAL PAGAR
document.getElementById("confirmarEfectuarPago").addEventListener("click", efectuarPago); //PAGAR
document.getElementById("NoEfectuarPago").addEventListener("click", ocultarModalConfirmarPagar); //OCULTAR MODAL PAGO

//CONTROLES RELACIONADOS A LA TABLA

document.getElementById("agregarPagoTabla").addEventListener("click", agregarFilaTablaMetodosPago); //FILA NUEVA
document.getElementById("metodoPago").addEventListener("change", limpiarFilaArrayTabla);

//CONTROLES RELACIONADOS A LA CALCULADORA

document.getElementById("cambiarTipoConversion").addEventListener("click", cambiarTipoConversion); //INVERTIR TIPO CONVERSION
document.getElementById("valorBolivaresCalculadoraDolares").addEventListener("input", validacionMontoEstiloBDV); //MONTO CALCULADORA
document.getElementById("calcularResultadoCalculadoraDolares").addEventListener("click", calcularResultadoCalculadoraDolares); //RESULTADO CALCULADORA

//CONTROLES RELACIONADOS AL MODAL DE DETALLES

document.getElementById("seleccionarBilleteModalDetallesPago").addEventListener("change", tipoBillete); //TIPO DE BILLETE DE USD
document.getElementById("montoPagarModalDetallesPago").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("precioDolarModalDetallesPago").addEventListener("input", validacionMontoEstiloBDV);
document.getElementById("botonModalDetallesPago").addEventListener("click", mostrarModalDetallesPago);
document.getElementById("botonNoIntroducirDatosModalDetalles").addEventListener("click", ocultarModalDetallesPago);
document.getElementById("botonIntroducirDatosModalDetalles").addEventListener("click", introducirDatosArrayTabla);
document.getElementById("seleccionarContenedorAbonoModalDetallesPago").addEventListener("change", mostrarDineroContenedorAbonos);

//NAVEGACION

document.getElementById("atrasPagar").addEventListener("click", atrasEfectuarPago);

