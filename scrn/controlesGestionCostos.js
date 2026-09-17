/*global document */

import { Base, doc, getDoc } from "./firebase.js";
import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { fechaDeHoy } from "./utilidades.js";

export {mostrarGestionDeCostos, atrasGestionCostos};

let objetoAnterior;

function mostrarGestionDeCostos(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-GestionCostos").style.display = "block";
}

function atrasGestionCostos(){
    document.getElementById("main-container-postLogin").style.display = "block";
    document.getElementById("main-container-GestionCostos").style.display = "none";
}

export function asignarObjetoAnteriorConfiguracion(objeto){

    objetoAnterior = objeto;

}

export function obtenerCopiaValoresInterfazConfiguracion(){

    let objetoValores = {};

      objetoValores["mensualidadBachillerato"] = document.getElementById("CostoMensualidadBachillerato").value;
      objetoValores["mensualidadPrimaria"] = document.getElementById("CostoMensualidadPrimaria").value;
      objetoValores["mensualidadPreescolar"] = document.getElementById("CostoMensualidadPreescolar").value;

      objetoValores["prontoPagoMensualidad"] = document.getElementById("descuentoProntoPagoMensualidad").value;

      objetoValores["mensualidadPreescolarHermanoProntoPago"] = document.getElementById("mensualidadPreescolarHermanosProntoPago").value;
      objetoValores["mensualidadPrimariaHermanoProntoPago"] = document.getElementById("mensualidadPrimariaHermanosProntoPago").value;
      objetoValores["mensualidadBachilleratoHermanoProntoPago"] = document.getElementById("mensualidadBachilleratoHermanosProntoPago").value;

      //INPUT PRECIOS PREINSCRIPCION

      objetoValores["preinscripcionPrimaria"] = document.getElementById("CostoPreinscripcionPrimaria").value;
      objetoValores["preinscripcionPreescolar"] = document.getElementById("CostoPreinscripcionPreescolar").value;
      objetoValores["preinscripcionBachillerato"] = document.getElementById("CostoPreinscripcionBachillerato").value;

      //INPUTS PRECIOS INSCRIPCION

      objetoValores["inscripcionPrimaria"] = document.getElementById("CostoInscripcionPrimaria").value;
      objetoValores["inscripcionPreescolar"] = document.getElementById("CostoInscripcionPreescolar").value;
      objetoValores["inscripcionBachillerato"] = document.getElementById("CostoInscripcionBachillerato").value;
      objetoValores["prontoPagoInscripcion"] = document.getElementById("descuentoProntoPagoInscripcion").value;
      objetoValores["fechaMaximaDescuentoProntoPagoInscripcion"] = document.getElementById("fechaMaximaProntoPagoInscripcion").value;

      //INPUT DESCUENTOS

      objetoValores["descuentoHermanos"] = document.getElementById("DescuentoHermanos").value;
      objetoValores["descuentoEmpleado"] = document.getElementById("DescuentoEmpleado").value;

      //INPUT PRECIOS ADMINISTRATIVOS

      objetoValores["retiroPapeles"] = document.getElementById("CostoRetiroPapeles").value;
      objetoValores["retiroTitulo"] = document.getElementById("CostoRetiroTitulo").value;
      objetoValores["retiroFondoNegro"] = document.getElementById("CostoCertificacionFondoNegro").value;
      objetoValores["notasCertificadas"] = document.getElementById("CostoNotasCertificadas").value;

      //INPUT VARIABLES

      objetoValores["verificarZelle"] = document.getElementById("requerirVerificacionZelle").checked;
      objetoValores["verificarTransf"] = document.getElementById("requerirVerificacionTransferencia").checked;
      objetoValores["verificarDolares"] = document.getElementById("requerirVerificacionDolares").checked;
      objetoValores["annoEscolar"] = document.getElementById("annoEscolarEnCurso").value;
      objetoValores["dolar"] = document.getElementById("CostoDolar").value;

      return objetoValores;

}

export function armarReporteCambiosConfiguracion(){

    let objetoActual = obtenerCopiaValoresInterfazConfiguracion();

    let contador = 1;

    let fechaHoy = fechaDeHoy();

    let reporte = {

        tipoEdicion: "Variables",
        fecha: fechaHoy,

    };

    let arrayPropiedades = [];
    let arrayConceptos = [];

    //VARIABLES

    arrayPropiedades.push("dolar"); arrayConceptos.push("Dólar: ");
    arrayPropiedades.push("annoEscolar"); arrayConceptos.push("Año Escolar: ");

    //MENSUALIDADES

    arrayPropiedades.push("mensualidadBachillerato"); arrayConceptos.push("Mensualidad Bachillerato: ");
    arrayPropiedades.push("mensualidadPrimaria"); arrayConceptos.push("Mensualidad Primaria: ");
    arrayPropiedades.push("mensualidadPreescolar"); arrayConceptos.push("Mensualidad Preescolar: ");

    //PRONTO PAGO

    arrayPropiedades.push("prontoPagoMensualidad"); arrayConceptos.push("Descuento Pronto Pago: ");
    arrayPropiedades.push("mensualidadPreescolarHermanoProntoPago"); arrayConceptos.push("Mensualidad Preescolar Hermanos + Pronto Pago: ");
    arrayPropiedades.push("mensualidadPrimariaHermanoProntoPago"); arrayConceptos.push("Mensualidad Primaria Hermanos + Pronto Pago: ");
    arrayPropiedades.push("mensualidadBachilleratoHermanoProntoPago"); arrayConceptos.push("Mensualidad Bachillerato Hermanos + Pronto Pago: ");

    //PRONTO PAGO INSCRIPCION

    arrayPropiedades.push("prontoPagoInscripcion"); arrayConceptos.push("Descuento Pronto Pago Inscripción: ");
    arrayPropiedades.push("fechaMaximaDescuentoProntoPagoInscripcion"); arrayConceptos.push("Fecha Máxima de Descuento de Inscripción Pronto Pago: ");

    //OTROS DESCUENTOS

    arrayPropiedades.push("descuentoHermanos"); arrayConceptos.push("Descuento Hermanos: ");
    arrayPropiedades.push("descuentoEmpleado"); arrayConceptos.push("Descuento Empleado (en porcentaje): ");

    //PREINSCRIPCION

    arrayPropiedades.push("preinscripcionPreescolar"); arrayConceptos.push("Preinscripción Preescolar: ");
    arrayPropiedades.push("preinscripcionPrimaria"); arrayConceptos.push("Preinscripción Primaria: ");
    arrayPropiedades.push("preinscripcionBachillerato"); arrayConceptos.push("Preinscripción Bachillerato: ");

    //INSCRIPCION

    arrayPropiedades.push("inscripcionPreescolar"); arrayConceptos.push("Inscripción Preescolar: ");
    arrayPropiedades.push("inscripcionPrimaria"); arrayConceptos.push("Inscripción Primaria: ");
    arrayPropiedades.push("inscripcionBachillerato"); arrayConceptos.push("Inscripción Bachillerato: ");

    arrayPropiedades.push("retiroPapeles"); arrayConceptos.push("Retiro de Papeles: ");
    arrayPropiedades.push("retiroTitulo"); arrayConceptos.push("Retiro de Título: ");
    arrayPropiedades.push("retiroFondoNegro"); arrayConceptos.push("Certificación de Fondo Negro: ");
    arrayPropiedades.push("notasCertificadas"); arrayConceptos.push("Notas Certificadas: ");

    for(let i = 0; i <= arrayPropiedades.length - 1; i++){

        if(objetoAnterior[arrayPropiedades[i]] != objetoActual[arrayPropiedades[i]]){

            reporte = introducirConceptoReporteEdicion(objetoActual, arrayPropiedades[i], arrayConceptos[i], reporte, contador);
            contador++;

        }

    }

    return reporte;

}

function introducirConceptoReporteEdicion(objetoActual, propiedad, concepto, reporte, contador){

    reporte["cambio" + contador] = [];
    reporte["cambio" + contador].push("N/A");
    reporte["cambio" + contador].push(concepto + objetoAnterior[propiedad]);
    reporte["cambio" + contador].push(concepto + objetoActual[propiedad]);

    return reporte;

}

export function copiasValoresIdenticasConfiguracion(copia1, copia2){

    for(let propiedad in copia1){

        if(copia1[propiedad] != copia2[propiedad]) return false;

    }

    return true;

}

export function armarCambiosPreciosTablaAnual(){



}

export function armarReporteCambioAnual(contadorReporte, fecha){

    let objetoActual = obtenerCopiaValoresInterfazConfiguracion();

    let arrayPropiedades = [];
    let arrayConceptos = [];

    let objetoCambios = {

        contador: contadorReporte

    };

    //VARIABLES

    arrayPropiedades.push("annoEscolar"); arrayConceptos.push("Año Escolar: ");

    //MENSUALIDADES

    arrayPropiedades.push("mensualidadBachillerato"); arrayConceptos.push("Mensualidad Bachillerato: ");
    arrayPropiedades.push("mensualidadPrimaria"); arrayConceptos.push("Mensualidad Primaria: ");
    arrayPropiedades.push("mensualidadPreescolar"); arrayConceptos.push("Mensualidad Preescolar: ");

    //PRONTO PAGO

    arrayPropiedades.push("prontoPagoMensualidad"); arrayConceptos.push("Descuento Pronto Pago: ");
    arrayPropiedades.push("mensualidadPreescolarHermanoProntoPago"); arrayConceptos.push("Mensualidad Preescolar Hermanos + Pronto Pago: ");
    arrayPropiedades.push("mensualidadPrimariaHermanoProntoPago"); arrayConceptos.push("Mensualidad Primaria Hermanos + Pronto Pago: ");
    arrayPropiedades.push("mensualidadBachilleratoHermanoProntoPago"); arrayConceptos.push("Mensualidad Bachillerato Hermanos + Pronto Pago: ");

    //PRONTO PAGO INSCRIPCION

    arrayPropiedades.push("prontoPagoInscripcion"); arrayConceptos.push("Descuento Pronto Pago Inscripción: ");
    arrayPropiedades.push("fechaMaximaDescuentoProntoPagoInscripcion"); arrayConceptos.push("Fecha Máxima de Descuento de Inscripción Pronto Pago: ");

    //OTROS DESCUENTOS

    arrayPropiedades.push("descuentoHermanos"); arrayConceptos.push("Descuento Hermanos: ");
    arrayPropiedades.push("descuentoEmpleado"); arrayConceptos.push("Descuento Empleado (en porcentaje): ");

    //PREINSCRIPCION

    arrayPropiedades.push("preinscripcionPreescolar"); arrayConceptos.push("Preinscripción Preescolar: ");
    arrayPropiedades.push("preinscripcionPrimaria"); arrayConceptos.push("Preinscripción Primaria: ");
    arrayPropiedades.push("preinscripcionBachillerato"); arrayConceptos.push("Preinscripción Bachillerato: ");

    //INSCRIPCION

    arrayPropiedades.push("inscripcionPreescolar"); arrayConceptos.push("Inscripción Preescolar: ");
    arrayPropiedades.push("inscripcionPrimaria"); arrayConceptos.push("Inscripción Primaria: ");
    arrayPropiedades.push("inscripcionBachillerato"); arrayConceptos.push("Inscripción Bachillerato: ");

    arrayPropiedades.push("retiroPapeles"); arrayConceptos.push("Retiro de Papeles: ");
    arrayPropiedades.push("retiroTitulo"); arrayConceptos.push("Retiro de Título: ");
    arrayPropiedades.push("retiroFondoNegro"); arrayConceptos.push("Certificación de Fondo Negro: ");
    arrayPropiedades.push("notasCertificadas"); arrayConceptos.push("Notas Certificadas: ");

    for(let i = 0; i <= arrayPropiedades.length - 1; i++){

        if(objetoAnterior[arrayPropiedades[i]] != objetoActual[arrayPropiedades[i]]){

            objetoCambios.contador = objetoCambios.contador + 1;

            objetoCambios["cambio" + objetoCambios.contador] = [];
            objetoCambios["cambio" + objetoCambios.contador].push(arrayConceptos[i]);
            objetoCambios["cambio" + objetoCambios.contador].push(objetoAnterior[arrayPropiedades[i]]);
            objetoCambios["cambio" + objetoCambios.contador].push(objetoActual[arrayPropiedades[i]]);
            objetoCambios["cambio" + objetoCambios.contador].push(fecha);

        }

    }

    return objetoCambios;

}