/*global document */

import { tipoDePago } from "../controlesEfectuarPago.js";
import {sumaDecimal,
        restaDecimal,
        productoPrecision2,
        numberAformatoMontos,
        verSiEsUnaLetraOCaracterEspecial,
        eliminarCaracterEnIndice,
        eliminarTodasLasOcurrenciasDeUnCaracter,
        insertarCaracterEnIndice,
        extraerNumerosPuntosComasDeUnaCadena,
        formatearCadenaNumerosMilesYDecimales,
        validacionMontoEstiloBDV,
        determinarProntoPago,
        verificarProntoPagoPorFecha,
        fechaDeHoyFormatoJS,
        formatoMontosAnumber,
        } from "../utilidades.js";

import {precioDolar as precioDolarInscripcion,
        precioMensualidadBachillerato,
        precioMensualidadPrimaria,
        precioMensualidadPreescolar,
        descuentoEmpleado,
        descuentoHermanos,
        mensualidadBachilleratoProntoPagoHermanos,
        mensualidadPrimariaProntoPagoHermanos,
        mensualidadPreescolarProntoPagoHermanos,
        precioInscripcionPrimaria,
        precioInscripcionPreescolar,
        precioInscripcionBachillerato,
        fechaMaximaDescuentoProntoPago
        } from "../obtenerPrecios.js";
import { crearCeldaConInput, crearCeldaConSelect, crearCeldaConTexto, crearTRconCeldasApendadas } from "../utilidadesTablas.js";

import { determinarCostoMensualidad } from "./aritmetica.js";

import {correccionSumaBSTotalPagarInscripcion, determinarDescuentosAplicadosSelect} from "../controlesInscripcionMensualidad.js";

export {crearFilaMesesPagarInscripcion,
        crearFilaMesesPagarConfirmarInscribir
};




function crearFilaMesesPagarInscripcion(datosEstudiante, mes, flagHermanos, annoConsultado, flagEmpleado){

  //CREA TODAS LAS VARIABLES QUE SE VAN A EMPLEAR

  let tabla = document.getElementById("tablaPagarMesesInscripcion");

  let arrayCeldas = [];

  let selectDescuento = document.createElement("select");

  let arrayDescuentos = ["Ninguno", 
                        "Pronto Pago", 
                        "Hermanos", 
                        "Pronto Pago + Hermanos", 
                        "Empleado", 
                        "Empleado + Pronto Pago"];
 
  //CREA TODAS LAS CELDAS QUE SON SOLO DE TEXTO

  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.nombreCompleto));
  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.cedula));
  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.curso));
  arrayCeldas.push(crearCeldaConTexto(mes));

  //AQUI SE CREA EL INPUT DEL MONTO

  arrayCeldas.push(crearCeldaConInput("text", 
                                      determinarCostoMensualidad(datosEstudiante.curso,
                                                                flagHermanos,
                                                                flagEmpleado,
                                                                mes,
                                                                annoConsultado),
                                      "validacionMontoConCorreccionPagoTotalUSDInscripcion"));

  //ESTE ES EL INPUT CON EL PRECIO DEL DOLAR

  arrayCeldas.push(crearCeldaConInput("text", numberAformatoMontos(precioDolarInscripcion), "validacionMontoEstiloBDV"));

  //ESTOS SON LOS SELECTS DEL DESCUENTO

  selectDescuento = crearCeldaConSelect(arrayDescuentos, "cambiarMontoDolaresDescuentoInscripcion");
  selectDescuento.children[0].selectedIndex = determinarDescuentosAplicadosSelect(flagHermanos, flagEmpleado, annoConsultado, mes);

  arrayCeldas.push(selectDescuento);

  //FINALMENTE ESTE ES EL CHECKBOX DE SELECCIONAR EL MES A PAGAR
  
  arrayCeldas.push(crearCeldaConInput("checkbox", false, "seleccionarMesPagarInscripcion"));

  tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

function crearFilaMesesPagarConfirmarInscribir(){

   let tablaOrigen = document.getElementById("tablaPagarMesesInscripcion");
   let tablaDestino = document.getElementById("tablaConfirmarMesesInscribir");

   let nombreCompleto;
   let cedula;
   let curso;
   let concepto;
   let montoUSD;
   let precioUSD;
   let montoBs;
   let descuento;

   let arrayCeldas = [];

   for(let i = 1; i <= tablaOrigen.rows.length - 1; i++){

        if(tablaOrigen.rows[i].cells[7].children[0].checked == true){

            arrayCeldas = [];

            nombreCompleto = tablaOrigen.rows[i].cells[0].textContent;
            cedula = tablaOrigen.rows[i].cells[1].textContent;
            curso = tablaOrigen.rows[i].cells[2].textContent;
            concepto = tablaOrigen.rows[i].cells[3].textContent;
            montoUSD = tablaOrigen.rows[i].cells[4].children[0].value;
            descuento = tablaOrigen.rows[i].cells[6].children[0].options[tablaOrigen.rows[i].cells[6].children[0].selectedIndex].textContent;
            precioUSD = tablaOrigen.rows[i].cells[5].children[0].value;
            montoBs = productoPrecision2(formatoMontosAnumber(montoUSD), formatoMontosAnumber(precioUSD));
            montoBs = numberAformatoMontos(montoBs);

            arrayCeldas.push(crearCeldaConTexto(nombreCompleto));
            arrayCeldas.push(crearCeldaConTexto(cedula));
            arrayCeldas.push(crearCeldaConTexto(curso));
            arrayCeldas.push(crearCeldaConTexto(concepto));
            arrayCeldas.push(crearCeldaConTexto(montoUSD));
            arrayCeldas.push(crearCeldaConInput("text", montoBs, "validacionMontoConCorreccionPagoTotalBSInscripcion"));
            arrayCeldas.push(crearCeldaConTexto(descuento));
            arrayCeldas.push(crearCeldaConTexto(precioUSD));

            tablaDestino.appendChild(crearTRconCeldasApendadas(arrayCeldas));

        }

   }

   correccionSumaBSTotalPagarInscripcion();

}