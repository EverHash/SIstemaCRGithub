/*global document, console, TextEncoder, window */

import {mostrarPantallaCarga, 
        mostrarPantallaColisionesHashes, 
        mostrarPantallaError, 
        ocultarModalConfirmarPagar, 
        ocultarPantallaCarga } from "./modal.js";
import {convertirAfechaHTML, 
        formatoMontosAnumber, 
        numberAformatoMontos, 
        productoPrecision2, 
        sumaDecimal, 
        restaDecimal, 
        cambiarAFechaVenezolana, 
        extraerNumerosPuntosComasDeUnaCadena, 
        fechaDeHoy} from "./utilidades.js";
import {inscribirEstudiante} from "./inscribir.js";

export{limpiarMetodosPago, 
       cambiarTipoConversion, 
       atrasEfectuarPago, 
       calcularResultadoCalculadoraDolares, 
       setTipoPago, 
       tipoDePago, 
       efectuarPago, 
       agregarFilaTablaMetodosPago, 
       tipoBillete, 
       determinarTipoPagoYdeuda,
       mostrarModalDetallesPago,
       ocultarModalDetallesPago,
       introducirDatosArrayTabla,
       limpiarFilaArrayTabla,
       validarArrayDatosTabla, 
       mostrarDineroContenedorAbonos, 
       setCedulaRepresentante,
       limpiarValoresTotalPagarPantallaPagos,
       arrayTabla};

import { precioDolar, verificarDolares, verificarZelle, verificarTransferencia } from "./obtenerPrecios.js";
import { efectuarPagoIndividual, contenedoresAbonos as contenedoresAbonosMensualidad, reiniciarContenedoresAbono } from "./mensualidad.js";
import { registrarMetodosPagos } from "./pagosMetodos.js";
import { agregarEstudiante } from "./agregarEstudiante.js";
import { realizarPagoAdministrativo } from "./administrativo.js";
import { reinscribir } from "./reinscribir.js";
import { descontarAbono, subirAbono } from "./abonos.js";
import { subirAbonoNoRegistrado } from "./abonosNoRegistrado.js";
import { Base, collection, doc, getDoc, getDocs, setDoc } from "./firebase.js";
import { crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";
import { preinscribir } from "./preinscripcion.js";
import { mostrarPantalla } from "./funcionesHTML.js";

let tipoDePago;
let tipoConversion = "BS-USD";

let cedulaRepresentante;

function setCedulaRepresentante(cedula){
    cedulaRepresentante = cedula;
}

function limpiarValoresTotalPagarPantallaPagos(){

    document.getElementById("montoPagarDolares").textContent = "0,00";
    document.getElementById("montoPagarBolivares").textContent = "0,00";
    document.getElementById("montoAbonarPantallaPagos").textContent = "N/A";

    //EL PRECIO DEL DOLAR SE DEJO QUIETO PORQUE ESO CAMBIA CON CADA CONSULTA

}

let arrayTabla = [
    ["fila1TablaPago", "", "", "", "", "", "", "", ""]
    ];

let contadorFila = 1;

/*

arrayTabla[0]: ID TABLA
arrayTabla[1]: NOMBRE ACREEDOR
arrayTabla[2]: PROCEDENCIA DEL PAGO
arrayTabla[3]: DESTINO DEL PAGO
arrayTabla[4]: MONTO
arrayTabla[5]: CODIGO O REFERENCIA
arrayTabla[6]: PRECIO DEL DOLAR
arrayTabla[7]: FECHA DE RECEPCION DE PAGO
arrayTabla[8]: METODO DE PAGO
arrayTabla[9]: DIVISA

*/

function resetearFilaArrayTabla(array, idTabla){
    let resultado = [];

    for(let i = 0; i <= array.length - 1; i++){
        if(array[i][0] == idTabla){
            array[i][1] = ""; //NOMBRE ACREEDOR
            array[i][2] = "N/A"; //PROCEDENCIA PAGO
            array[i][3] = "N/A"; //DESTINO PAGO
            array[i][4] = "0,00"; //MONTO
            array[i][5] = ""; //CODIGO O REFERENCIA
            array[i][6] = "0,00"; //PRECIO DOLAR
            array[i][7] = ""; //FECHA DE RECEPCION DE PAGO
            array[i][8] = ""; //METODO DE PAGO
            array[i][9] = ""; //DIVISA
            resultado = array;
            break;
        }
    }
    console.log(resultado);
    return resultado;
}

let tablaEnEdicion = "";

function obtenerArrayEnEdicion(){
    for(let i = 0; i <= arrayTabla.length - 1; i++){
        if(arrayTabla[i][0] == tablaEnEdicion){
            return arrayTabla[i];
        }
    }
}

function obtenerIndiceArrayTablaEdicion(){
    for(let i = 0; i <= arrayTabla.length - 1; i++){
        if(arrayTabla[i][0] == tablaEnEdicion){
            return i;
        }
    }
}

function limpiarFormularioModalDatos(metodoPago){
    if(metodoPago == "Punto"){
        mostrarFormularioModalPunto();
    }
    if(metodoPago == "Transferencia"){
        mostrarFormularioModalTransferencia();
    }
    if(metodoPago == "Efectivo Bolívares"){
        mostrarFormularioModalEfectivoBS();
    }
    if(metodoPago == "Efectivo Dólares"){
        mostrarFormularioModalEfectivoDolares();
    }
    if(metodoPago == "Zelle"){
        mostrarFormularioModalZelle();
    }
    if(metodoPago == "Abono"){
        mostrarFormularioModalAbono();
    }

    //LIMPIAR LOS FORMULARIOS DESPUES DE ASIGNAR (LOS SELECTS)

}

function asignarDatosModal(){

    let datos = obtenerArrayEnEdicion();

    let nombreAcreedor = document.getElementById("nombreAcreedorModalPagos");

    let procedenciaPago = document.getElementById("seleccionarProcedenciaModalDetallesPago");
    let montoBillete = document.getElementById("seleccionarBilleteModalDetallesPago");
    let contenedorAbono = document.getElementById("seleccionarContenedorAbonoModalDetallesPago");
    let NAprocedenciaPago = document.getElementById("NAprocedenciaPago");

    let destinoPago = document.getElementById("seleccionarDestinoModalDetallesPago");
    let NAdestinoPago = document.getElementById("NAdestinoPago");

    let monto = document.getElementById("montoPagarModalDetallesPago");
    let codigo = document.getElementById("codigoModalDetallesPago");
    let precioDolar = document.getElementById("precioDolarModalDetallesPago");
    let fechaPago = document.getElementById("fechaRecepcionPago");

    let disponibleContenedorBS = document.getElementById("disponibleContenedorBSModalDetallesPago");
    let disponibleContenedorUSD = document.getElementById("disponibleContenedorUSDModalDetallesPago");

    //DETRAS DE TI

    let fecha = convertirAfechaHTML(datos[7]);

    nombreAcreedor.value = datos[1];
    monto.value = datos[4];
    codigo.value = datos[5];
    precioDolar.value = datos[6];

    if(monto.value == "") monto.value = "0,00";
    if(precioDolar.value == "") precioDolar.value = "0,00";

    if(fecha == "--") fechaPago.value = "";
    else fechaPago.value = fecha;

    disponibleContenedorBS.value = "0,00";
    disponibleContenedorUSD.value = "0,00";

    //SE DETERMINA CUAL ES EL METODO DE PAGO
    //UNA VEZ DETERMINADO SE PROCEDE A MOSTRAR LOS FORMULARIOS QUE CORRESPONDEN
    //CON SU SELECT CORRESPONDIENTE

    if(datos[8] == "Transferencia"){

        //PROCEDENCIA

        procedenciaPago.style.display = "block";
        montoBillete.style.display = "none";
        contenedorAbono.style.display = "none";
        NAprocedenciaPago.style.display = "none";

        montoBillete.selectedIndex = 0;
        contenedorAbono.selectedIndex = 0;

        for(let i = 0; i <= procedenciaPago.children.length - 1; i++){
            if(procedenciaPago.children[i].textContent == datos[2]){
                procedenciaPago.selectedIndex = i;
                break;
            }
        }

        //DESTINO

        destinoPago.style.display = "block";
        NAdestinoPago.style.display = "none";

        for(let i = 0; i <= destinoPago.children.length - 1; i++){
            if(destinoPago.children[i].textContent == datos[3]){
                destinoPago.selectedIndex = i;
                break;
            }
        }

    }

    if(datos[8] == "Efectivo Dólares"){

        procedenciaPago.style.display = "none";
        montoBillete.style.display = "block";
        contenedorAbono.style.display = "none";
        NAprocedenciaPago.style.display = "none";

        procedenciaPago.selectedIndex = 0;
        contenedorAbono.selectedIndex = 0;


        for(let i = 0; i <= montoBillete.children.length - 1; i++){
            if(montoBillete.children[i].textContent == datos[2]){
                montoBillete.selectedIndex = i;
                break;
            }
        }

        destinoPago.style.display = "none";
        NAdestinoPago.style.display = "block";

        destinoPago.selectedIndex = 0;

    }

    if(datos[8] == "Punto"){

        procedenciaPago.style.display = "none";
        montoBillete.style.display = "none";
        contenedorAbono.style.display = "none";
        NAprocedenciaPago.style.display = "block";

        procedenciaPago.selectedIndex = 0;
        montoBillete.selectedIndex = 0;
        contenedorAbono.selectedIndex = 0;

        destinoPago.style.display = "none";
        NAdestinoPago.style.display = "block";

        destinoPago.selectedIndex = 0;

    }

    if(datos[8] == "Efectivo Bolívares"){

        procedenciaPago.style.display = "none";
        montoBillete.style.display = "none";
        contenedorAbono.style.display = "none";
        NAprocedenciaPago.style.display = "block";

        procedenciaPago.selectedIndex = 0;
        montoBillete.selectedIndex = 0;
        contenedorAbono.selectedIndex = 0;

        destinoPago.style.display = "none";
        NAdestinoPago.style.display = "block";

        destinoPago.selectedIndex = 0;
    }

    if(datos[8] == "Zelle"){

        procedenciaPago.style.display = "none";
        montoBillete.style.display = "none";
        contenedorAbono.style.display = "none";
        NAprocedenciaPago.style.display = "block";

        procedenciaPago.selectedIndex = 0;
        montoBillete.selectedIndex = 0;
        contenedorAbono.selectedIndex = 0;

        destinoPago.style.display = "none";
        NAdestinoPago.style.display = "block";

        destinoPago.selectedIndex = 0;
    }

    if(datos[8] == "Abono"){
        agregarContenedoresAbonosAlSelect();
        procedenciaPago.style.display = "none";
        montoBillete.style.display = "none";
        contenedorAbono.style.display = "block";
        NAprocedenciaPago.style.display = "none";

        procedenciaPago.selectedIndex = 0;
        montoBillete.selectedIndex = 0;

        for(let i = 0; i <= contenedorAbono.children.length - 1; i++){
            if(contenedorAbono.children[i].textContent == datos[2]){
                contenedorAbono.selectedIndex = i;

                if(tipoDePago == "Mensualidad" || tipoDePago == "Inscripcion" || tipoDePago == "Agregar" || tipoDePago == "Reinscripcion" || tipoDePago == "Administrativo"){
                    for(let i = 0; i <= contenedoresAbonosMensualidad.length - 1; i++){

                        if(datos[2] == contenedoresAbonosMensualidad[i][0]){

                            if(contenedoresAbonosMensualidad[i][1] == "Dólares"){
                                disponibleContenedorUSD.value = numberAformatoMontos(contenedoresAbonosMensualidad[i][2]);
                            }

                            if(contenedoresAbonosMensualidad[i][1] == "Bolívares"){
                                disponibleContenedorBS.value = numberAformatoMontos(contenedoresAbonosMensualidad[i][2]);
                            }

                        }
                    }
                }

                break;
            }
        }



        destinoPago.style.display = "none";
        NAdestinoPago.style.display = "block";

        destinoPago.selectedIndex = 0;

    }

}

function limpiarArrayTabla(array, idTabla){
    let resultado = [];

    for(let i = 0; i <= array.length - 1; i++){
        if(array[i][0] == idTabla) continue;
        else resultado.push(array[i]);
    }

    return resultado;
}

function introducirDatosArrayTabla(){
    let selectMetodo = document.getElementById(tablaEnEdicion).children[0].children[0];
    let metodoDePago = selectMetodo.options[selectMetodo.selectedIndex].textContent;
    
    if(validarFormularioIntroducirDatos(metodoDePago) == 1){ //FORMULARIO INVALIDO
        return;
    }

    arrayTabla = editarArrayTablaPagos(arrayTabla, metodoDePago);
    console.log(arrayTabla);
    ocultarModalDetallesPago();
}

function validarFormularioIntroducirDatos(metodoDePago){
    let nombreAcreedor = document.getElementById("nombreAcreedorModalPagos").value;
    let procedenciaPago = document.getElementById("seleccionarProcedenciaModalDetallesPago");
    let montoBillete = document.getElementById("seleccionarBilleteModalDetallesPago");
    let destinoPago = document.getElementById("seleccionarDestinoModalDetallesPago");
    let monto = document.getElementById("montoPagarModalDetallesPago").value;
    let codigo = document.getElementById("codigoModalDetallesPago").value;
    let precioDolar = document.getElementById("precioDolarModalDetallesPago").value;
    let fechaPago = document.getElementById("fechaRecepcionPago").value;

    let disponibleAbonoBS = document.getElementById("disponibleContenedorBSModalDetallesPago").value;
    let disponibleAbonoUSD = document.getElementById("disponibleContenedorUSDModalDetallesPago").value;

    let montoNUMBER;
    let disponibleAbonoNUMBER;

    if(nombreAcreedor == ""){
        mostrarPantallaError("Introduzca el nombre del acreedor");
        return 1;
    }

    if(procedenciaPago.selectedIndex == 0 && procedenciaPago.style.display != "none"){
        mostrarPantallaError("Seleccione el banco de procedencia del pago");
        return 1;
    }
    
    if(montoBillete.selectedIndex == 0 && montoBillete.style.display != "none"){
        mostrarPantallaError("Seleccione el billete con el cual se realizó el pago");
        return 1;
    }
    
    if(destinoPago.selectedIndex == 0 && destinoPago.style.display != "none"){
        mostrarPantallaError("Seleccione el banco de destino del pago");
        return 1;
    }

    if(monto == "0,00"){
        mostrarPantallaError("Introduzca un monto");
        return 1;
    }

    if(metodoDePago == "Abono"){
        if(disponibleAbonoBS == "0,00" && disponibleAbonoUSD == "0,00"){
            mostrarPantallaError("El contenedor de abonos no tiene ningún monto abonado");
            return 1;
        }

        if(disponibleAbonoBS != "0,00"){
            montoNUMBER = formatoMontosAnumber(monto);
            disponibleAbonoNUMBER = formatoMontosAnumber(disponibleAbonoBS);

            if(montoNUMBER > disponibleAbonoNUMBER){
                mostrarPantallaError("El monto no puede ser mayor al que se encuentra en el contenedor");
                return 1;
            }
        }

        if(disponibleAbonoUSD != "0,00"){
            montoNUMBER = formatoMontosAnumber(monto);
            disponibleAbonoNUMBER = formatoMontosAnumber(disponibleAbonoUSD);

            if(montoNUMBER > disponibleAbonoNUMBER){
                mostrarPantallaError("El monto no puede ser mayor al que se encuentra en el contenedor");
                return 1;
            }
        }
    }

    if(codigo == ""){
        mostrarPantallaError("Introduzca un código para el pago");
        return 1;
    }
    
    if(precioDolar == "0,00"){
        mostrarPantallaError("Introduzca el precio del Dólar");
        return 1;
    }
    
    if(fechaPago == ""){ //CORREGIR EL ORDEN DE LA FECHA DE PAGO
        mostrarPantallaError("Introduzca la fecha de pago");
        return 1;
    }


}


function editarArrayTablaPagos(array, metodoDePago){
    let resultado;

    let nombreAcreedor = document.getElementById("nombreAcreedorModalPagos").value;

    let procedenciaPago = document.getElementById("seleccionarProcedenciaModalDetallesPago");
    let montoBillete = document.getElementById("seleccionarBilleteModalDetallesPago");
    let contenedorAbono = document.getElementById("seleccionarContenedorAbonoModalDetallesPago");
    let NAprocedenciaPago = document.getElementById("NAprocedenciaPago");

    let destinoPago = document.getElementById("seleccionarDestinoModalDetallesPago");
    let NAdestinoPago = document.getElementById("NAdestinoPago");

    let disponibleAbonoBS = document.getElementById("disponibleContenedorBSModalDetallesPago").value;
    let disponibleAbonoUSD = document.getElementById("disponibleContenedorUSDModalDetallesPago").value;

    let monto = document.getElementById("montoPagarModalDetallesPago").value;
    let codigo = document.getElementById("codigoModalDetallesPago").value;
    let precioDolar = document.getElementById("precioDolarModalDetallesPago").value;
    let fechaPago = document.getElementById("fechaRecepcionPago").value;


    for(let i = 0; i <= array.length - 1; i++){
        if(array[i][0] == tablaEnEdicion){
            array[i][1] = nombreAcreedor;

            if(procedenciaPago.style.display == "block"){ //PROCEDENCIA BANCO
                array[i][2] = procedenciaPago.options[procedenciaPago.selectedIndex].textContent;
            }


            if(montoBillete.style.display == "block"){ //PROCEDENCIA MONTO BILLETE
                array[i][2] = montoBillete.options[montoBillete.selectedIndex].textContent;
            }

            if(contenedorAbono.style.display == "block"){  //PROCEDENCIA CONTENEDOR ABONO
                array[i][2] = contenedorAbono.options[contenedorAbono.selectedIndex].textContent;
            }

            if(NAprocedenciaPago.style.display == "block"){ //PROCEDENCIA N/A
                array[i][2] = "N/A";
            }

            if(destinoPago.style.display == "block"){ //DESTINO BANCO
                array[i][3] = destinoPago.options[destinoPago.selectedIndex].textContent;
            }

            if(NAdestinoPago.style.display == "block"){ //DESTINO N/A
                array[i][3] = "N/A";
            }

            array[i][4] = monto;
            array[i][5] = codigo;
            array[i][6] = precioDolar;
            array[i][7] = cambiarAFechaVenezolana(fechaPago);
            array[i][8] = metodoDePago;

            if(metodoDePago == "Punto") array[i][9] = "BS";
            if(metodoDePago == "Transferencia") array[i][9] = "BS";
            if(metodoDePago == "Efectivo Bolívares") array[i][9] = "BS";

            if(metodoDePago == "Efectivo Dólares") array[i][9] = "USD";
            if(metodoDePago == "Zelle") array[i][9] = "USD";

            if(metodoDePago == "Abono"){
                if(disponibleAbonoBS != "0,00") array[i][9] = "BS";
                if(disponibleAbonoUSD != "0,00") array[i][9] = "USD";
            } 

        }
    }

    resultado = array;
    console.log(resultado);
    return resultado;
}

function setTipoPago(cadena){
    tipoDePago = cadena;
    console.log("cambio de tipo de pago realizado a: ", tipoDePago);
}

function cambiarTipoConversion(){
    if(tipoConversion == "BS-USD"){
        document.getElementById("convertirOrigen").textContent = "Valor en Dólares";
        document.getElementById("convertirDestino").textContent = "Valor en Bolívares";
        tipoConversion = "USD-BS";
        return 0;
    }
    if(tipoConversion == "USD-BS"){
        document.getElementById("convertirDestino").textContent = "Valor en Dólares";
        document.getElementById("convertirOrigen").textContent = "Valor en Bolívares";
        tipoConversion = "BS-USD";
        return 0;
    }
}

function sumarMontosDolares(){
    let resultado = 0;
    let valorPago;
 
    for(let i = 0; i <= arrayTabla.length - 1; i++){

        if(arrayTabla[i][9] == "USD"){
            valorPago = arrayTabla[i][4];
            resultado = numberAformatoMontos(resultado);
            resultado = sumaDecimal(resultado, valorPago);
        }
    }
    return resultado;
}

function sumaMontosMixto(){
    let resultado = 0;
    let valorPago;
 
    for(let i = 0; i <= arrayTabla.length - 1; i++){

        if(arrayTabla[i][9] == "USD"){
            valorPago = arrayTabla[i][4];
            valorPago = formatoMontosAnumber(valorPago);
            valorPago = productoPrecision2(valorPago, formatoMontosAnumber(arrayTabla[i][6]));
            valorPago = numberAformatoMontos(valorPago);
            resultado = numberAformatoMontos(resultado);
            resultado = sumaDecimal(resultado, valorPago);
        }
        if(arrayTabla[i][9] == "BS"){
            valorPago = arrayTabla[i][4];
            resultado = numberAformatoMontos(resultado);
            resultado = sumaDecimal(resultado, valorPago);
        }
    }
    return resultado;
}

function sumarMontosBolivares(){
    let resultado = 0;
    let valorPago;
 
    for(let i = 0; i <= arrayTabla.length - 1; i++){

        if(arrayTabla[i][9] == "BS"){

            valorPago = arrayTabla[i][4];
            resultado = numberAformatoMontos(resultado);
            resultado = sumaDecimal(resultado, valorPago);
        }
    }
    return resultado;
}

// function sumarMontosMetodosPago(){
    
//     let resultado = 0;
//     let valorPago;
//     let tablaPagos = document.getElementById("tablaMetodosPagos");
//     for(let i = 1; i <= tablaPagos.rows.length - 1; i++){
//         valorPago = tablaPagos.rows[i].cells[4].children[0].value;
//         resultado = numberAformatoMontos(resultado);
//         resultado = sumaDecimal(resultado, valorPago);
//     }
//     return resultado;
// }


function validarArrayDatosTabla(){
    /*
    
    arrayTabla[0]: ID TABLA
arrayTabla[1]: NOMBRE ACREEDOR
arrayTabla[2]: PROCEDENCIA DEL PAGO
arrayTabla[3]: DESTINO DEL PAGO
arrayTabla[4]: MONTO
arrayTabla[5]: CODIGO O REFERENCIA
arrayTabla[6]: PRECIO DEL DOLAR
arrayTabla[7]: FECHA DE RECEPCION DE PAGO
arrayTabla[8]: METODO DE PAGO
arrayTabla[9]: DIVISA
     */

    for(let i = 0; i <= arrayTabla.length - 1; i++){
        if(arrayTabla[i][0] == ""){
            mostrarPantallaError("Introduzca el nombre del acreedor en la fila " + (i + 1));
            return 1;
        }
        if(arrayTabla[i][4] == "0,00"){
            mostrarPantallaError("Introduzca el monto del pago en la fila " + (i + 1));
            return 1;
        }
        if(arrayTabla[i][5] == ""){
            mostrarPantallaError("Introduzca el código en la fila " + (i + 1));
            return 1;
        }
        if(arrayTabla[i][6] == "0,00"){
            mostrarPantallaError("Introduzca el precio del dólar en la fila " + (i + 1));
            return 1;
        }
        if(arrayTabla[i][7] == ""){
            mostrarPantallaError("Introduzca la fecha de recepción del pago en la fila " + (i + 1));
            return 1;
        }
        if(arrayTabla[i][2] == ""){
            mostrarPantallaError("Introduzca la procedencia del pago en la fila " + (i + 1));
            return 1;
        }
        if(arrayTabla[i][3] == ""){
            mostrarPantallaError("Introduzca el destino del pago en la fila " + (i + 1));
            return 1;
        }
    }
}

function determinarTipoPagoYdeuda(){

    //1. VER COMO FUE EL PAGO: MIXTO, USD O BS
    //2. TOMAR EL MONTO EN LA MONEDA QUE CORRESPONDA
    //3. VER CUANTO SE PAGO
    //4. MOSTRAR

    let montoQueSeDebePagar;
    let resultadoResta;

    let pagado;

    let valorPagoBs = sumarMontosBolivares();
    let valorPagoUSD = sumarMontosDolares();

    let valorPago = 0;
    let flagBS = false;
    let flagUSD = false;

    if(valorPagoBs != 0 && valorPagoUSD != 0){
        valorPago = sumaMontosMixto();
        flagBS = true;
    }

    if(valorPagoBs != 0 && valorPagoUSD == 0){
        valorPago = valorPagoBs;
        flagBS = true;
    }
    
    if(valorPagoBs == 0 && valorPagoUSD != 0){
        valorPago = valorPagoUSD;
        flagUSD = true;
    }


    if(flagBS && (tipoDePago != "Abono" && tipoDePago != "AbonoNoRegistrado")){

        
        montoQueSeDebePagar = document.getElementById("montoPagarBolivares").textContent;
        document.getElementById("totalPorPagarModuloPagar").textContent = montoQueSeDebePagar + " Bs";
        resultadoResta = restaDecimal(montoQueSeDebePagar, numberAformatoMontos(valorPago));
    
        document.getElementById("totalPagoModuloPagar").textContent = numberAformatoMontos(valorPago);
        document.getElementById("DeudaDePagoModuloPagar").textContent = numberAformatoMontos(resultadoResta);

        document.getElementById("totalPagoModuloPagar").textContent += " Bs";
        document.getElementById("DeudaDePagoModuloPagar").textContent += " Bs";


        
        //HAY QUE PONER LA LLAMADA DE LOS ABONOS
        //TERMINAR EL MODULO DE ABONOS PRONTO
        //WARNING
        
        // if(resultadoResta < 0){
        //     mostrarPantallaError("Introduzca el monto completo a pagar");
        //     return;
        // }

        // if(resultadoResta > 0){
            
        //     return;   
        // }
    }

    if(flagUSD && (tipoDePago != "Abono" && tipoDePago != "AbonoNoRegistrado")){

        montoQueSeDebePagar = document.getElementById("montoPagarDolares").textContent;
        document.getElementById("totalPorPagarModuloPagar").textContent = montoQueSeDebePagar + " $";
        resultadoResta = restaDecimal(montoQueSeDebePagar, numberAformatoMontos(valorPago));
    
        document.getElementById("totalPagoModuloPagar").textContent = numberAformatoMontos(valorPago);
        document.getElementById("DeudaDePagoModuloPagar").textContent = numberAformatoMontos(resultadoResta);

        document.getElementById("totalPagoModuloPagar").textContent += " $";
        document.getElementById("DeudaDePagoModuloPagar").textContent += " $";
    }


    if(tipoDePago == "Abono" || tipoDePago == "AbonoNoRegistrado"){

        pagado = numberAformatoMontos(sumarMontosBolivares());
        pagado += " Bs y ";
        pagado += numberAformatoMontos(sumarMontosDolares());
        pagado += " USD";
    
        document.getElementById("totalPagoModuloPagar").textContent = pagado;
        document.getElementById("totalPorPagarModuloPagar").textContent = document.getElementById("montoAbonarPantallaPagos").textContent;
        document.getElementById("DeudaDePagoModuloPagar").textContent = determinarDeudaModuloPagarAbono(pagado, document.getElementById("montoAbonarPantallaPagos").textContent);
    }

    // let montoQueSeDebePagar = document.getElementById("montoPagarBolivares").textContent;
    // let resultadoResta = restaDecimal(montoQueSeDebePagar, numberAformatoMontos(valorPago));
    // document.getElementById("totalPagoModuloPagar").textContent = numberAformatoMontos(valorPago);
    // if(resultadoResta > 0){
    //     document.getElementById("DeudaDePagoModuloPagar").textContent = numberAformatoMontos(resultadoResta);
    // }
    // else if(resultadoResta == 0){
    //     document.getElementById("DeudaDePagoModuloPagar").textContent = "0,00";  
    // }
}

function determinarDeudaModuloPagarAbono(montoPagado, montoPagar){
    montoPagado = montoPagado.split(" ");
    montoPagar = montoPagar.split(" ");

    let parteBS = restaDecimal(montoPagado[0], montoPagar[0]);
    let parteUSD = restaDecimal(montoPagado[3], montoPagar[3]);

    if(parteBS < 0) parteBS *= -1;
    if(parteUSD < 0) parteUSD *= -1;
    
    parteBS = numberAformatoMontos(parteBS);
    parteUSD = numberAformatoMontos(parteUSD);

    let resultado = parteBS + " Bs y " + parteUSD + " USD";

    return resultado;
}

function limpiarMetodosPago(){
    let tablaPagos = document.getElementById("tablaMetodosPagos");
    if(tablaPagos.rows.length >= 2){
        for(let i = tablaPagos.rows.length - 1; i >= 2; i--){
            tablaPagos.removeChild(tablaPagos.lastChild);
        }   
    }
    tablaPagos.rows[1].cells[0].children[0].selectedIndex = 0; //METODO DE PAGO NO SELECCIONADO
    tablaPagos.rows[1].cells[2].children[0].style.display = "none"; //OCULTAR EL N/A EN CONTROLES
    tablaPagos.rows[1].cells[2].children[1].style.display = "block"; //PONER EL BOTON DE AGREGAR METODO
    arrayTabla = [
        ["fila1TablaPago", "", "", "", "", "", "", "", "", ""]
        ];
        
        document.getElementById("nombreAcreedorModalPagos").value = "";
        document.getElementById("seleccionarProcedenciaModalDetallesPago").selectedIndex = 0;
        document.getElementById("seleccionarBilleteModalDetallesPago").selectedIndex = 0;
    
        document.getElementById("seleccionarDestinoModalDetallesPago").selectedIndex = 0;
    
        document.getElementById("montoPagarModalDetallesPago").value = "0,00";
        document.getElementById("codigoModalDetallesPago").value = "";
        document.getElementById("precioDolarModalDetallesPago").value = "0,00";
        document.getElementById("fechaRecepcionPago").value = "";

}

function tipoBillete(){
    let inputMonto = document.getElementById("montoPagarModalDetallesPago");
    if(this.selectedIndex == 0){ //MONTO NO SELECCIONADO
        inputMonto.value = "0,00";
    }
    if(this.selectedIndex == 1){ //1 USD

        //ASIGNACION DEL COSTO

        inputMonto.value = "1,00";

    }
    if(this.selectedIndex == 2){ //2 USD

        //ASIGNACION DEL COSTO
        inputMonto.value = "2,00";

    }
    if(this.selectedIndex == 3){ //5 USD

        //ASIGNACION DEL COSTO

        inputMonto.value = "5,00";
    
    }
    if(this.selectedIndex == 4){ //10 USD

        //ASIGNACION DEL COSTO

        inputMonto.value = "10,00";
        
    }
    if(this.selectedIndex == 5){ //20 USD

        //ASIGNACION DEL COSTO

        inputMonto.value = "20,00";
        
    }
    if(this.selectedIndex == 6){ //50 USD

        //ASIGNACION DEL COSTO

        inputMonto.value = "50,00";
        
    }
    if(this.selectedIndex == 7){ //100 USD

        //ASIGNACION DEL COSTO

        inputMonto.value = "100,00";
    
    }
}

function ocultarBotonFilaAnteriorTablaPagos(){
    let tabla = document.getElementById("tablaMetodosPagos");

    let numeroFilas = tabla.rows.length - 1;
    numeroFilas--;

    tabla.rows[numeroFilas].cells[2].children[0].style.display = "block";
    tabla.rows[numeroFilas].cells[2].children[1].style.display = "none";
}

function mostrarBotonAgregarFila(){
    let tabla = document.getElementById("tablaMetodosPagos");

    let numeroFilas = tabla.rows.length - 1;

    tabla.rows[numeroFilas].cells[2].children[0].style.display = "none";
    tabla.rows[numeroFilas].cells[2].children[1].style.display = "block";
}

function limpiarFilaArrayTabla(){
    let idTabla = this.parentNode.parentNode.id;
    arrayTabla = resetearFilaArrayTabla(arrayTabla, idTabla);
}

function borrarFila(){
    let tabla = document.getElementById("tablaMetodosPagos");
    let idTabla = this.parentNode.parentNode.id;
    tabla.removeChild(this.parentNode.parentNode);
    mostrarBotonAgregarFila();
    arrayTabla = limpiarArrayTabla(arrayTabla, idTabla);
    console.log(arrayTabla);
}

function agregarFilaTablaMetodosPago(){
    let tabla = document.getElementById("tablaMetodosPagos");


    let fila = document.createElement("tr");
    contadorFila++;
    fila.id = "fila" + (contadorFila) + "TablaPago";

    let arrayEstaFila = ["", "", "", "", "", "", "", "", "", ""];
    arrayEstaFila[0] = fila.id;
    arrayTabla.push(arrayEstaFila);

    let celdaMetodo = document.createElement("td");
    let selectMetodo = document.createElement("select");
    let arrayMetodo = ["Método de Pago", "Punto", "Transferencia", "Efectivo Bolívares", "Efectivo Dólares", "Zelle", "Abono"];
    
    for(let i = 0; i <= arrayMetodo.length - 1; i++) selectMetodo.appendChild(document.createElement("option"));
    for(let i = 0; i <= arrayMetodo.length - 1; i++) selectMetodo.children[i].textContent = arrayMetodo[i];
    selectMetodo.addEventListener("change", resetearFilaArrayTabla);
    celdaMetodo.appendChild(selectMetodo);
    
    let celdaDetalles =  document.createElement("td");
    let imagenDetalles = document.createElement("img");
    imagenDetalles.src = "rsrcs/file_1150643.png";
    imagenDetalles.className = "icono";
    imagenDetalles.addEventListener("click", mostrarModalDetallesPago);
    celdaDetalles.appendChild(imagenDetalles);




    let celdaControles = document.createElement("td");
    let botonBorrarFila = document.createElement("img");
    let botonAgregarFila = document.createElement("button");
    let spanCeldaControles = document.createElement("span");


    spanCeldaControles.textContent = "N/A";
    spanCeldaControles.className = "oculto";
    botonAgregarFila.textContent = "Agregar Método";
    botonAgregarFila.addEventListener("click", agregarFilaTablaMetodosPago);
    botonAgregarFila.className = "botonAzul";
    celdaControles.appendChild(spanCeldaControles);
    celdaControles.appendChild(botonAgregarFila);

    let celdaBorrar = document.createElement("th");
    celdaBorrar.className = "celdaEstudianteBotonBorrar";


    botonBorrarFila.src = "rsrcs/delete.png";
    botonBorrarFila.className = "icono";
    botonBorrarFila.addEventListener("click", borrarFila);
    celdaBorrar.appendChild(botonBorrarFila);

    fila.appendChild(celdaMetodo);
    fila.appendChild(celdaDetalles);
    fila.appendChild(celdaControles);
    fila.appendChild(celdaBorrar);
    tabla.appendChild(fila);
    ocultarBotonFilaAnteriorTablaPagos();
}

function mostrarModalDetallesPago(){

    tablaEnEdicion = this.parentNode.parentNode.id;

    let metodoDePago = this.parentNode.parentNode.children[0].children[0];

    let indice = obtenerIndiceArrayTablaEdicion();

    document.getElementById("seleccionarProcedenciaModalDetallesPago").selectedIndex = 0;
    document.getElementById("seleccionarDestinoModalDetallesPago").selectedIndex = 0;
    document.getElementById("seleccionarBilleteModalDetallesPago").selectedIndex = 0;
    document.getElementById("disponibleContenedorBSModalDetallesPago").value = "0,00";
    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = "0,00";
    document.getElementById("precioDolarModalDetallesPago").value = "0,00";
    document.getElementById("fechaRecepcionPago").value = "";
    document.getElementById("nombreAcreedorModalPagos").value = "";

    if(metodoDePago.selectedIndex == 0){
        mostrarPantallaError("Seleccione un método de pago para editar los datos correspondientes");
        return;
    }
    
    if(metodoDePago.selectedIndex == 1){
        mostrarFormularioModalPunto();
    }
    
    if(metodoDePago.selectedIndex == 2){
        mostrarFormularioModalTransferencia();
    }
    
    if(metodoDePago.selectedIndex == 3){
        mostrarFormularioModalEfectivoBS();
    }
    
    if(metodoDePago.selectedIndex == 4){
        mostrarFormularioModalEfectivoDolares();
    }
    
    if(metodoDePago.selectedIndex == 5){
        mostrarFormularioModalZelle();
    }
    
    if(metodoDePago.selectedIndex == 6 && (tipoDePago == "Abono" || tipoDePago == "AbonoNoRegistrado")){
        mostrarPantallaError("Método de pago no disponible para realizar abonos");
        return;
    } 

    if(metodoDePago.selectedIndex == 6){
        mostrarFormularioModalAbono();
    }

    document.getElementById("modalDatosDetallesPago").style.display = "block";

    if(arrayTabla[indice][8] != metodoDePago.options[metodoDePago.selectedIndex].textContent){
        limpiarFormularioModalDatos(metodoDePago.options[metodoDePago.selectedIndex].textContent);
    }
    else asignarDatosModal();
}

function limpiarSelectAbonos(){
    let selectAbonos = document.getElementById("seleccionarContenedorAbonoModalDetallesPago");

    if(selectAbonos.children.length > 1){
        for(let i = selectAbonos.children.length - 1; i >= 1; i--){
            selectAbonos.removeChild(selectAbonos.lastChild);
        }   
    }
}

function agregarContenedoresAbonosAlSelect(){
    let selectAbonos = document.getElementById("seleccionarContenedorAbonoModalDetallesPago");

    limpiarSelectAbonos();

    if(tipoDePago == "Mensualidad" || tipoDePago == "Inscripcion" || tipoDePago == "Agregar" || tipoDePago == "Reinscripcion" || tipoDePago == "Administrativo"){
        for(let i = 0; i <= contenedoresAbonosMensualidad.length - 1; i++){
            selectAbonos.appendChild(document.createElement("option"));
            selectAbonos.children[i + 1].textContent = contenedoresAbonosMensualidad[i][0];
        }
    }
}

function mostrarDineroContenedorAbonos(){
    let selectAbonos = document.getElementById("seleccionarContenedorAbonoModalDetallesPago");
    let contenedorSeleccionado = selectAbonos.options[selectAbonos.selectedIndex].textContent;
    let montoDisponible;

    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = "0,00";
    document.getElementById("disponibleContenedorBSModalDetallesPago").value = "0,00";

    if(tipoDePago == "Mensualidad" || tipoDePago == "Inscripcion" || tipoDePago == "Agregar" || tipoDePago == "Reinscripcion" || tipoDePago == "Administrativo"){
        for(let i = 0; i <= contenedoresAbonosMensualidad.length - 1; i++){
            if(contenedorSeleccionado == contenedoresAbonosMensualidad[i][0]){
                if(contenedoresAbonosMensualidad[i][1] == "Dólares"){
                    montoDisponible = numberAformatoMontos(contenedoresAbonosMensualidad[i][2]);
                    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = montoDisponible;
                }
                if(contenedoresAbonosMensualidad[i][1] == "Bolívares"){
                    montoDisponible = numberAformatoMontos(contenedoresAbonosMensualidad[i][2]);
                    document.getElementById("disponibleContenedorBSModalDetallesPago").value = montoDisponible;
                }
            }
        }
    }
}

function mostrarFormularioModalPunto(){

    //PONER N/A EN PROCEDENCIA DE PAGO

    document.getElementById("NAprocedenciaPago").style.display = "block";
    document.getElementById("seleccionarContenedorAbonoModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarProcedenciaModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarBilleteModalDetallesPago").style.display = "none";

    //PONER N/A EN DESTINO DE PAGO

    document.getElementById("NAdestinoPago").style.display = "block";
    document.getElementById("seleccionarDestinoModalDetallesPago").style.display = "none";

    //HABILITAR EL CAMPO DE CODIGO DE PAGO

    document.getElementById("codigoModalDetallesPago").disabled = false;
    document.getElementById("codigoModalDetallesPago").value = "";

    //HABILITAR EL CAMPO DE MONTO

    document.getElementById("montoPagarModalDetallesPago").value = "0,00";
    document.getElementById("montoPagarModalDetallesPago").disabled = false;

    //CAMPOS CON LOS MONTOS DE LOS CONTENEDORES DE ABONOS

    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = "0,00";
    document.getElementById("disponibleContenedorBSModalDetallesPago").value = "0,00";

    document.getElementById("precioDolarModalDetallesPago").value = numberAformatoMontos(precioDolar);

}

function mostrarFormularioModalTransferencia(){
    
    //PONER EL SELECT DEL BANCO

    document.getElementById("seleccionarProcedenciaModalDetallesPago").style.display = "block";
    document.getElementById("NAprocedenciaPago").style.display = "none";
    document.getElementById("seleccionarContenedorAbonoModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarBilleteModalDetallesPago").style.display = "none";

    //PONER EL SELECT DE DESTINO DE PAGO

    document.getElementById("seleccionarDestinoModalDetallesPago").style.display = "block";
    document.getElementById("NAdestinoPago").style.display = "none";

    //HABILITAR EL CAMPO DE CODIGO DE PAGO

    document.getElementById("codigoModalDetallesPago").disabled = false;
    document.getElementById("codigoModalDetallesPago").value = "";

    //HABILITAR EL CAMPO DE MONTO

    document.getElementById("montoPagarModalDetallesPago").value = "0,00";
    document.getElementById("montoPagarModalDetallesPago").disabled = false;

    //CAMPOS CON LOS MONTOS DE LOS CONTENEDORES DE ABONOS

    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = "0,00";
    document.getElementById("disponibleContenedorBSModalDetallesPago").value = "0,00";

    document.getElementById("precioDolarModalDetallesPago").value = numberAformatoMontos(precioDolar);

}

function mostrarFormularioModalEfectivoBS(){
    
    //PONER N/A EN PROCEDENCIA DE PAGO

    document.getElementById("NAprocedenciaPago").style.display = "block";
    document.getElementById("seleccionarContenedorAbonoModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarProcedenciaModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarBilleteModalDetallesPago").style.display = "none";

    //PONER N/A EN DESTINO DE PAGO

    document.getElementById("NAdestinoPago").style.display = "block";
    document.getElementById("seleccionarDestinoModalDetallesPago").style.display = "none";

    //DESHABILITAR EL CAMPO DE CODIGO DE PAGO

    document.getElementById("codigoModalDetallesPago").disabled = true;
    document.getElementById("codigoModalDetallesPago").value = "N/A";

    //HABILITAR EL CAMPO DE MONTO

    document.getElementById("montoPagarModalDetallesPago").value = "0,00";
    document.getElementById("montoPagarModalDetallesPago").disabled = false;

    //CAMPOS CON LOS MONTOS DE LOS CONTENEDORES DE ABONOS

    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = "0,00";
    document.getElementById("disponibleContenedorBSModalDetallesPago").value = "0,00";

    document.getElementById("precioDolarModalDetallesPago").value = numberAformatoMontos(precioDolar);

}

function mostrarFormularioModalEfectivoDolares(){
    
    //PONER EL SELECT DEL BILLETE

    document.getElementById("seleccionarBilleteModalDetallesPago").style.display = "block";
    document.getElementById("seleccionarContenedorAbonoModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarProcedenciaModalDetallesPago").style.display = "none";
    document.getElementById("NAprocedenciaPago").style.display = "none";

    //PONER N/A EN DESTINO DE PAGO

    document.getElementById("NAdestinoPago").style.display = "block";
    document.getElementById("seleccionarDestinoModalDetallesPago").style.display = "none";

    //HABILITAR EL CAMPO DE CODIGO DE PAGO

    document.getElementById("codigoModalDetallesPago").disabled = false;
    document.getElementById("codigoModalDetallesPago").value = "";

    //DESHABILITAR EL CAMPO DE MONTO
    //ESTO ES PARA PONER EL MONTO CON EL SELECT

    document.getElementById("montoPagarModalDetallesPago").value = "0,00";
    document.getElementById("montoPagarModalDetallesPago").disabled = true;

    //CAMPOS CON LOS MONTOS DE LOS CONTENEDORES DE ABONOS

    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = "0,00";
    document.getElementById("disponibleContenedorBSModalDetallesPago").value = "0,00";

    document.getElementById("precioDolarModalDetallesPago").value = numberAformatoMontos(precioDolar);

}

function mostrarFormularioModalZelle(){

    //PONER N/A EN PROCEDENCIA DE PAGO

    document.getElementById("NAprocedenciaPago").style.display = "block";
    document.getElementById("seleccionarContenedorAbonoModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarProcedenciaModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarBilleteModalDetallesPago").style.display = "none";

    //PONER N/A EN DESTINO DE PAGO

    document.getElementById("NAdestinoPago").style.display = "block";
    document.getElementById("seleccionarDestinoModalDetallesPago").style.display = "none";

    //HABILITAR EL CAMPO DE CODIGO DE PAGO

    document.getElementById("codigoModalDetallesPago").disabled = false;
    document.getElementById("codigoModalDetallesPago").value = "";

    //HABILITAR EL CAMPO DE MONTO

    document.getElementById("montoPagarModalDetallesPago").value = "0,00";
    document.getElementById("montoPagarModalDetallesPago").disabled = false;

    //CAMPOS CON LOS MONTOS DE LOS CONTENEDORES DE ABONOS

    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = "0,00";
    document.getElementById("disponibleContenedorBSModalDetallesPago").value = "0,00";

    document.getElementById("precioDolarModalDetallesPago").value = numberAformatoMontos(precioDolar);

}

function mostrarFormularioModalAbono(){
    agregarContenedoresAbonosAlSelect();

    //PONER N/A EN PROCEDENCIA DE PAGO

    document.getElementById("seleccionarContenedorAbonoModalDetallesPago").style.display = "block";
    document.getElementById("NAprocedenciaPago").style.display = "none";
    document.getElementById("seleccionarProcedenciaModalDetallesPago").style.display = "none";
    document.getElementById("seleccionarBilleteModalDetallesPago").style.display = "none";

    //PONER N/A EN DESTINO DE PAGO

    document.getElementById("NAdestinoPago").style.display = "block";
    document.getElementById("seleccionarDestinoModalDetallesPago").style.display = "none";

    //HABILITAR EL CAMPO DE CODIGO DE PAGO

    document.getElementById("codigoModalDetallesPago").disabled = true;
    document.getElementById("codigoModalDetallesPago").value = "N/A";

    //HABILITAR EL CAMPO DE MONTO

    document.getElementById("montoPagarModalDetallesPago").value = "0,00";
    document.getElementById("montoPagarModalDetallesPago").disabled = false;

    //CAMPOS CON LOS MONTOS DE LOS CONTENEDORES DE ABONOS

    document.getElementById("disponibleContenedorUSDModalDetallesPago").value = "0,00";
    document.getElementById("disponibleContenedorBSModalDetallesPago").value = "0,00";

    document.getElementById("precioDolarModalDetallesPago").value = numberAformatoMontos(precioDolar);

}

function ocultarModalDetallesPago(){
    document.getElementById("modalDatosDetallesPago").style.display = "none";
}

function atrasEfectuarPago(){

    document.getElementById("mainContainerPagar").style.display = "none"; //OCULTAR PANTALLA ACTUAL
    
    //EL CODIGO SIGUIENTE MUESTRA LA PANTALLA CORRESPONDIENTE SEGUN EL TIPO DE PAGO

    if(tipoDePago == "Inscripcion"){
        document.getElementById("mainContainerConfirmarInscribir").style.display = "block";
    }
    if(tipoDePago == "Preinscripcion"){
        mostrarPantalla("mainContainerConfirmarPreinscripcion");
    }
    if(tipoDePago == "Mensualidad"){
        document.getElementById("main-container-PagarEstudiante").style.display = "block";
    }
    if(tipoDePago == "Administrativo"){
        document.getElementById("mainContainerConfirmarConceptosAdministrativo").style.display = "block";
    }
    if(tipoDePago == "Agregar"){
        document.getElementById("mainContainerConfirmarInscribir").style.display = "block";
    }
    if(tipoDePago == "Reinscripcion"){
        document.getElementById("mainContainerConfirmarInscribir").style.display = "block";
    }  
    if(tipoDePago == "Abono"){
        document.getElementById("main-container-Abonos").style.display = "block";
    }
    if(tipoDePago == "AbonoNoRegistrado"){
        document.getElementById("main-container-AbonosNoRegistrado").style.display = "block";
    }
    
    limpiarMetodosPago();
}

function calcularResultadoCalculadoraDolares(){

    //POR CUESTIONES DE LA UI, LOS ID DE LOS 
    //HTMLS SIGUE IGUAL A PESAR DE QUE SE HACE
    //OTRA OPERACION. USAR LAS NOTAS COMO REFERENCIA

    let bolivares, calcularResultado, resultado;

    if(tipoConversion == "BS-USD"){ //DE BS A USD

        //CALCULAR EL RESULTADO

        bolivares = document.getElementById("valorBolivaresCalculadoraDolares").value;
        calcularResultado = formatoMontosAnumber(bolivares);
        resultado = calcularResultado / precioDolar;
        resultado = numberAformatoMontos(resultado);
        document.getElementById("resultadoCalculadoraDolares").value = resultado;
    }

    if(tipoConversion == "USD-BS"){ // DE USD A BS 

        //CALCULAR EL RESULTADO

        bolivares = document.getElementById("valorBolivaresCalculadoraDolares").value;
        calcularResultado = formatoMontosAnumber(bolivares);
        resultado = productoPrecision2(calcularResultado, precioDolar);
        resultado = numberAformatoMontos(resultado);
        document.getElementById("resultadoCalculadoraDolares").value = resultado;
    } 
}

function obtenerMontosMetodosPago(){

    let valorPagoBs = sumarMontosBolivares();
    let valorPagoUSD = sumarMontosDolares();

    let valorPago = 0;
    let flagBS = false;
    let flagUSD = false;

    if(valorPagoBs != 0 && valorPagoUSD != 0){
        valorPago = sumaMontosMixto();
        flagBS = true;
    }

    if(valorPagoBs != 0 && valorPagoUSD == 0){
        valorPago = valorPagoBs;
        flagBS = true;
    }
    
    if(valorPagoBs == 0 && valorPagoUSD != 0){
        valorPago = valorPagoUSD;
        flagUSD = true;
    }
    return valorPago;
}

function validarMontos(){
    
    let montoApagar = document.getElementById("DeudaDePagoModuloPagar").textContent;
    montoApagar = extraerNumerosPuntosComasDeUnaCadena(montoApagar);

    let montoDeuda = formatoMontosAnumber(montoApagar);
    if(montoDeuda > 0){
        return 1;
    }

    if(montoDeuda < 0) return 2;
}

function validarMontosAbonos(){

    let totalPagado = document.getElementById("totalPagoModuloPagar").textContent;
    let totalApagar = document.getElementById("totalPorPagarModuloPagar").textContent;

    if(totalPagado != totalApagar) return 1;
    else return 0;
}

async function determinarSiSeDescuentaAbono(arrayTabla){
    for(let i = 0; i <= arrayTabla.length - 1; i++){
        if(arrayTabla[i][8] == "Abono"){
            await descontarAbono(cedulaRepresentante, arrayTabla[i][2], arrayTabla[i][4]);
        }
    }
}

// async function abonarExcedente(cedulaRepresentante){
//     let montoApagar = document.getElementById("DeudaDePagoModuloPagar").textContent;

//     let representante = await doc(Base, "representantes", cedulaRepresentante);
//     let datosRepre = await getDoc(representante);
//     datosRepre = datosRepre.data();

//     let suma;

//     if(montoApagar.includes("$")){
//         if(datosRepre.hasOwnProperty("excedenteUSD")){

//         }
//         else{

//         }
//     }
//     else{
//         if(datosRepre.hasOwnProperty("excedenteBS")){
//             montoApagar = extraerNumerosPuntosComasDeUnaCadena(montoApagar);
//             suma = datosRepre.excedenteBS[2];
//             suma = numberAformatoMontos(suma);
//             suma = sumaDecimal(suma, montoApagar);
//             datosRepre.excedenteBS[2] = suma;
//         }
//         else{
//             montoApagar = extraerNumerosPuntosComasDeUnaCadena(montoApagar);
//             datosRepre["excedenteBS"] = [];
//             datosRepre["excedenteBS"][0] = "excedenteBS";
//             datosRepre["excedenteBS"][1] = "Bolívares";
//             datosRepre["excedenteBS"][2] = formatoMontosAnumber(montoApagar);
//         }
//     }
// }

async function efectuarPago(){

    let flagColision = false;

    limpiarFilasTabla("tablaDatosHashes", 1); //LIMPIA LA TABLA DE COLISIONES

    ocultarModalConfirmarPagar();
    mostrarPantallaCarga();

    let montosInvalidos;

    if(tipoDePago == "Abono" || tipoDePago == "AbonoNoRegistrado") montosInvalidos = validarMontosAbonos();
    else{
        montosInvalidos = validarMontos();
    } 

    if(montosInvalidos == 1){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto requerido para efectuar el pago");
        return;
    }

    if(montosInvalidos == 2){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto requerido para efectuar el pago");
        return;
    }

    let total = obtenerMontosMetodosPago();

    console.log(arrayTabla);

    let hashes = await calcularHashes(); //LOS QUE ESTAN EN LA INTERFAZ

    if(hashes.length >= 1){

        flagColision = await determinarColisionHashes(hashes);


    }

    if(flagColision){

        ocultarPantallaCarga();
        mostrarPantallaColisionesHashes();
        return;

    }

    if(hashes.length >= 1) await subirHashes(hashes);


    if(tipoDePago == "Inscripcion") await inscribirEstudiante(total, arrayTabla);
    if(tipoDePago == "Mensualidad") await efectuarPagoIndividual(total, arrayTabla);
    if(tipoDePago == "Agregar") await inscribirEstudiante(total, arrayTabla);
    if(tipoDePago == "Reinscripcion") await inscribirEstudiante(total, arrayTabla);
    if(tipoDePago == "Preinscripcion") await preinscribir(total, arrayTabla);
    if(tipoDePago == "Administrativo") await realizarPagoAdministrativo(total, arrayTabla);
    if(tipoDePago == "Abono") await subirAbono(total, arrayTabla); 
    if(tipoDePago == "AbonoNoRegistrado") await subirAbonoNoRegistrado(total, arrayTabla); 

    for(let i = 0; i <= arrayTabla.length - 1; i++){
       await registrarMetodosPagos(arrayTabla[i][1], arrayTabla[i][7], arrayTabla[i][8], arrayTabla[i][5], arrayTabla[i][2], arrayTabla[i][3], arrayTabla[i][4], arrayTabla[i][6]);
    }

    await determinarSiSeDescuentaAbono(arrayTabla);

    ocultarPantallaCarga(); //WARNING QUITAR ESTE OCULTAR

    limpiarFormularioModalDatos();

    arrayTabla = [
        ["fila1TablaPago", "", "", "", "", "", "", "", "", ""]
    ];

    reiniciarContenedoresAbono();
}

/*

arrayTabla[0]: ID TABLA
arrayTabla[1]: NOMBRE ACREEDOR
arrayTabla[2]: PROCEDENCIA DEL PAGO
arrayTabla[3]: DESTINO DEL PAGO
arrayTabla[4]: MONTO
arrayTabla[5]: CODIGO O REFERENCIA
arrayTabla[6]: PRECIO DEL DOLAR
arrayTabla[7]: FECHA DE RECEPCION DE PAGO
arrayTabla[8]: METODO DE PAGO
arrayTabla[9]: DIVISA

*/

async function calcularHashes(){

    let tipoPagoUsado;

    let fechaHoy = fechaDeHoy();

    let arrayHashes = [];

    let cadenaHash;

    let codigoOperacion;

    let hashBucle = {};

    for(let i = 0; i <= arrayTabla.length - 1; i++){

        //id ES EL HASH

        hashBucle = {

            id: "",
            monto: "",
            fecha: fechaHoy,
            referencia: "",
            metodo: ""

        };

        tipoPagoUsado = arrayTabla[i][8];

        if(tipoPagoUsado == "Efectivo Bolívares" || tipoPagoUsado == "Abono") continue;

        codigoOperacion = arrayTabla[i][5];

        cadenaHash = codigoOperacion;

        hashBucle.id = await obtenerSHA512(cadenaHash);
        hashBucle.monto = arrayTabla[i][4];
        hashBucle.referencia = codigoOperacion;
        hashBucle.metodo = tipoPagoUsado;

        arrayHashes.push(hashBucle);
        

    }

    return arrayHashes;
    
}

async function determinarColisionHashes(arrayHashes){

    try {
       let flagColision = false;

        let hashConsultado;

        for(let i = 0; i <= arrayHashes.length - 1; i++){

            hashConsultado = await getDoc(doc(Base, "hashesPagos", arrayHashes[i].id));

            if(hashConsultado.exists()){

                escribirTablaColisionesHash(arrayHashes[i], hashConsultado.data());
                flagColision = true;

            }

        }

        return flagColision;     
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return;
    }

}

export async function obtenerSHA512(texto){

  const mensajeUTF8 = new TextEncoder().encode(texto);

  const hashProcesadoBits = await window.crypto.subtle.digest("SHA-512", mensajeUTF8);

  const hashArray = Array.from(new Uint8Array(hashProcesadoBits));

  const hashHexa = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHexa;

}

async function subirHashes(hashes){

    try {
        for(let i = 0; i <= hashes.length - 1; i++){

            await setDoc(doc(Base, "hashesPagos/" + hashes[i].id), hashes[i]);

        }      
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return;
    }
    
}


function escribirTablaColisionesHash(hashActual, hashConsultado){

    let tabla = document.getElementById("tablaDatosHashes");

    let fila;

    let arrayCeldas = [];

    arrayCeldas.push(crearCeldaConTexto(hashActual.metodo));
    arrayCeldas.push(crearCeldaConTexto(hashActual.referencia));
    arrayCeldas.push(crearCeldaConTexto(hashConsultado.metodo));
    arrayCeldas.push(crearCeldaConTexto(hashConsultado.referencia));
    arrayCeldas.push(crearCeldaConTexto(hashConsultado.fecha));

    fila = crearTRconCeldasApendadas(arrayCeldas);

    tabla.appendChild(fila);

}


// export async function crearHashesTodosLosPagos(){

//     let pago;

//     let objeto;

//     let indice;

//     for(let i = 3362; i >= 0; i--){

//         indice = i.toString();

//         pago = await getDoc(doc(Base, "pagos", indice));

//         if(!pago.exists()) continue;

//         objeto = pago.data();

//         console.log(i);

//         await subirHashesPunto(objeto);

//         await subirHashesTransferencia(objeto);

//         await subirHashesZelle(objeto);

//         await subirHashesEfectivoDolares(objeto);

//     }

// }

// //HASHES DE PUNTO
// //HASHES DE PUNTO
// //HASHES DE PUNTO

// async function subirHashesPunto(pago){

//     let contador = 1;

//     let hash;

//     while(true){

//         if(!pago.hasOwnProperty("pagoPunto" + contador)) break;

//         hash = await crearHashPunto(pago, contador);

//         await setDoc(doc(Base, "hashesPagos/" + hash.id), hash);

//         contador++;

//     }



// }

// async function crearHashPunto(pago, contador){

//     let hash = {

//             id: "",
//             monto: "",
//             fecha: pago.fecha,
//             referencia: "",
//             metodo: "Punto"

//     };

//     hash.id = await obtenerSHA512(pago["pagoPunto" + contador][0]);
//     hash.monto = pago["pagoPunto" + contador][1];
//     hash.referencia = pago["pagoPunto" + contador][0];

//     return hash;

// }

// //HASHES DE TRANSFERENCIA
// //HASHES DE TRANSFERENCIA
// //HASHES DE TRANSFERENCIA

// async function subirHashesTransferencia(pago){

//     let contador = 1;

//     let hash;

//     while(true){

//         if(!pago.hasOwnProperty("pagoTransferencia" + contador)) break;

//         hash = await crearHashTransferencia(pago, contador);

//         await setDoc(doc(Base, "hashesPagos/" + hash.id), hash);

//         contador++;

//     }



// }

// async function crearHashTransferencia(pago, contador){

//     let hash = {

//             id: "",
//             monto: "",
//             fecha: pago.fecha,
//             referencia: "",
//             metodo: "Transferencia"

//     };

//     hash.id = await obtenerSHA512(pago["pagoTransferencia" + contador][2]);
//     hash.monto = pago["pagoTransferencia" + contador][3];
//     hash.referencia = pago["pagoTransferencia" + contador][2];

//     return hash;

// }

// //HASHES DE ZELLE
// //HASHES DE ZELLE
// //HASHES DE ZELLE

// async function subirHashesZelle(pago){

//     let contador = 1;

//     let hash;

//     while(true){

//         if(!pago.hasOwnProperty("pagoZelle" + contador)) break;

//         hash = await crearHashZelle(pago, contador);

//         await setDoc(doc(Base, "hashesPagos/" + hash.id), hash);

//         contador++;

//     }



// }

// async function crearHashZelle(pago, contador){

//     let hash = {

//             id: "",
//             monto: "",
//             fecha: pago.fecha,
//             referencia: "",
//             metodo: "Zelle"

//     };

//     hash.id = await obtenerSHA512(pago["pagoZelle" + contador][0]);
//     hash.monto = pago["pagoZelle" + contador][1];
//     hash.referencia = pago["pagoZelle" + contador][0];

//     return hash;

// }

// //HASHES DE DOLARES EFECTIVO
// //HASHES DE DOLARES EFECTIVO
// //HASHES DE DOLARES EFECTIVO

// async function subirHashesEfectivoDolares(pago){

//     let contador = 1;

//     let hash;

//     while(true){

//         if(!pago.hasOwnProperty("pagoDolares" + contador)) break;

//         hash = await crearHashEfectivoDolares(pago, contador);

//         await setDoc(doc(Base, "hashesPagos/" + hash.id), hash);

//         contador++;

//     }



// }

// async function crearHashEfectivoDolares(pago, contador){

//     let hash = {

//             id: "",
//             monto: "",
//             fecha: pago.fecha,
//             referencia: "",
//             metodo: "Efectivo Dolares"

//     };

//     hash.id = await obtenerSHA512(pago["pagoDolares" + contador][1]);
//     hash.monto = pago["pagoDolares" + contador][2];
//     hash.referencia = pago["pagoDolares" + contador][1];

//     return hash;

// }