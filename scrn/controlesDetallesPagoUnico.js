/*global document */

import { truncarDecimales, reemplazarCaracteres, divisionPrecision2, formatoMontosAnumber, numberAformatoMontos } from "./utilidades.js";

import { verificarDolares, verificarTransferencia, verificarZelle } from "./obtenerPrecios.js";

export {escribirTablaDetallesPagoUnico};

function escribirTablaDetallesPagoUnico(documentoDePago){
    let tabla = document.getElementById("tablaDetallesPagoUnico");
    let cadenaPunto = "pagoPunto";
    let cadenaEfectivo = "pagoEfectivo";
    let cadenaDolares = "pagoDolares";
    let cadenaTransferencia = "pagoTransferencia";
    let cadenaZelle = "pagoZelle";
    let cadenaAbono = "pagoAbono";
    let numeroPropiedad = 1;
    let fila;
    let tipo;
    let origen;
    let destino;
    let codigo;
    let monto;
    let montoUSD;
    let aceptarPago;
    let inputAceptarPago;
    for(let i = tabla.rows.length - 1; i > 0; i--){
        tabla.removeChild(tabla.lastChild);
    }   
    while(true){
        if(documentoDePago.hasOwnProperty(cadenaPunto + numeroPropiedad)){
            fila = document.createElement("tr");
            tipo = document.createElement("td");
            origen = document.createElement("td");
            destino = document.createElement("td");
            codigo = document.createElement("td");
            monto = document.createElement("td");
            montoUSD = document.createElement("td");
            aceptarPago = document.createElement("td");
            inputAceptarPago = document.createElement("input");
            inputAceptarPago.type = "checkbox";
            inputAceptarPago.checked = true;
            inputAceptarPago.disabled = true;
            tipo.textContent = "Punto";
            origen.textContent = "N/A";
            destino.textContent = "N/A";
            codigo.textContent = documentoDePago[cadenaPunto + numeroPropiedad][0];
            monto.textContent = documentoDePago[cadenaPunto + numeroPropiedad][1];
            montoUSD.textContent = "N/A";
            aceptarPago.appendChild(inputAceptarPago);
            fila.appendChild(tipo);
            fila.appendChild(origen);
            fila.appendChild(destino);
            fila.appendChild(codigo);
            fila.appendChild(monto);
            fila.appendChild(montoUSD);
            fila.appendChild(aceptarPago);
            tabla.appendChild(fila);
            numeroPropiedad++;
        }
        else break;
    }
    numeroPropiedad = 1;
    while(true){
        if(documentoDePago.hasOwnProperty(cadenaTransferencia + numeroPropiedad)){
            fila = document.createElement("tr");
            tipo = document.createElement("td");
            origen = document.createElement("td");
            destino = document.createElement("td");
            codigo = document.createElement("td");
            monto = document.createElement("td");
            montoUSD = document.createElement("td");
            aceptarPago = document.createElement("td");
            inputAceptarPago = document.createElement("input");
            inputAceptarPago.type = "checkbox";
            tipo.textContent = "Transferencia";
            if(verificarTransferencia != "SI"){
                inputAceptarPago.checked = !documentoDePago[cadenaTransferencia + numeroPropiedad][4];
                inputAceptarPago.disabled = true;
            }
            else{
                inputAceptarPago.checked = !documentoDePago[cadenaTransferencia + numeroPropiedad][4];
            }
            origen.textContent = documentoDePago[cadenaTransferencia + numeroPropiedad][0];
            destino.textContent = documentoDePago[cadenaTransferencia + numeroPropiedad][1];
            codigo.textContent = documentoDePago[cadenaTransferencia + numeroPropiedad][2];
            monto.textContent = documentoDePago[cadenaTransferencia + numeroPropiedad][3];
            montoUSD.textContent = "N/A";
            aceptarPago.appendChild(inputAceptarPago);
            fila.appendChild(tipo);
            fila.appendChild(origen);
            fila.appendChild(destino);
            fila.appendChild(codigo);
            fila.appendChild(monto);
            fila.appendChild(montoUSD);
            fila.appendChild(aceptarPago);
            tabla.appendChild(fila);
            numeroPropiedad++;
        }
        else break;
    }
    numeroPropiedad = 1;
    while(true){
        if(documentoDePago.hasOwnProperty(cadenaEfectivo + numeroPropiedad)){
            fila = document.createElement("tr");
            tipo = document.createElement("td");
            origen = document.createElement("td");
            destino = document.createElement("td");
            codigo = document.createElement("td");
            monto = document.createElement("td");
            montoUSD = document.createElement("td");
            aceptarPago = document.createElement("td");
            inputAceptarPago = document.createElement("input");
            inputAceptarPago.type = "checkbox";
            inputAceptarPago.checked = true;
            inputAceptarPago.disabled = true;
            tipo.textContent = "Efectivo Bolívares";
            origen.textContent = "N/A";
            destino.textContent = "N/A";
            codigo.textContent = "N/A";
            if(documentoDePago.hasOwnProperty("precioUSDdetallado")){
                monto.textContent = documentoDePago[cadenaEfectivo + numeroPropiedad][0];
            }
            else{
                monto.textContent = documentoDePago[cadenaEfectivo + numeroPropiedad];
            }
            montoUSD.textContent = "N/A";
            aceptarPago.appendChild(inputAceptarPago);
            fila.appendChild(tipo);
            fila.appendChild(origen);
            fila.appendChild(destino);
            fila.appendChild(codigo);
            fila.appendChild(monto);
            fila.appendChild(montoUSD);
            fila.appendChild(aceptarPago);
            tabla.appendChild(fila);
            numeroPropiedad++;
        }
        else break;
    }
    numeroPropiedad = 1;
    while(true){
        if(documentoDePago.hasOwnProperty(cadenaDolares + numeroPropiedad)){
            fila = document.createElement("tr");
            tipo = document.createElement("td");
            origen = document.createElement("td");
            destino = document.createElement("td");
            codigo = document.createElement("td");
            monto = document.createElement("td");
            montoUSD = document.createElement("td");
            aceptarPago = document.createElement("td");
            inputAceptarPago = document.createElement("input");
            inputAceptarPago.type = "checkbox";
            if(verificarDolares != "SI"){
                inputAceptarPago.checked = !documentoDePago[cadenaDolares + numeroPropiedad][3];
                inputAceptarPago.disabled = true;
            }
            else{
                inputAceptarPago.checked = !documentoDePago[cadenaDolares + numeroPropiedad][3];
            }
            tipo.textContent = "Efectivo Dólares";
            origen.textContent = documentoDePago[cadenaDolares + numeroPropiedad][0];
            destino.textContent = "N/A";
            codigo.textContent = documentoDePago[cadenaDolares + numeroPropiedad][1];
            if(documentoDePago.hasOwnProperty("version")){
                montoUSD.textContent = documentoDePago[cadenaDolares + numeroPropiedad][2];
                monto.textContent = "N/A";
            }
            else{
                monto.textContent = documentoDePago[cadenaDolares + numeroPropiedad][2];
                montoUSD.textContent = formatoMontosAnumber(monto.textContent) / documentoDePago.precioDolar;
                montoUSD.textContent = numberAformatoMontos(montoUSD.textContent);
            }
            aceptarPago.appendChild(inputAceptarPago);
            fila.appendChild(tipo);
            fila.appendChild(origen);
            fila.appendChild(destino);
            fila.appendChild(codigo);
            fila.appendChild(monto);
            fila.appendChild(montoUSD);
            fila.appendChild(aceptarPago);
            tabla.appendChild(fila);
            numeroPropiedad++;
        }
        else break;
    }
    numeroPropiedad = 1;
    while(true){
        if(documentoDePago.hasOwnProperty(cadenaZelle + numeroPropiedad)){
            fila = document.createElement("tr");
            tipo = document.createElement("td");
            origen = document.createElement("td");
            destino = document.createElement("td");
            codigo = document.createElement("td");
            monto = document.createElement("td");
            montoUSD = document.createElement("td");
            aceptarPago = document.createElement("td");
            inputAceptarPago = document.createElement("input");
            inputAceptarPago.type = "checkbox";
            if(verificarZelle != "SI"){
                inputAceptarPago.checked = !documentoDePago[cadenaZelle + numeroPropiedad][2];
                inputAceptarPago.disabled = true;
            }
            else{
                inputAceptarPago.checked = !documentoDePago[cadenaZelle + numeroPropiedad][2];
            }
            tipo.textContent = "Zelle";
            origen.textContent = "N/A";
            destino.textContent = "N/A";
            codigo.textContent = documentoDePago[cadenaZelle + numeroPropiedad][0];
            if(documentoDePago.hasOwnProperty("version")){
                monto.textContent = "N/A";
                montoUSD.textContent = documentoDePago[cadenaZelle + numeroPropiedad][1];
            }
            else{
                monto.textContent = documentoDePago[cadenaZelle + numeroPropiedad][1];
                montoUSD.textContent = formatoMontosAnumber(monto.textContent) / documentoDePago.precioDolar;
                montoUSD.textContent = numberAformatoMontos(montoUSD.textContent);
            }
            aceptarPago.appendChild(inputAceptarPago);
            fila.appendChild(tipo);
            fila.appendChild(origen);
            fila.appendChild(destino);
            fila.appendChild(codigo);
            fila.appendChild(monto);
            fila.appendChild(montoUSD);
            fila.appendChild(aceptarPago);
            tabla.appendChild(fila);
            numeroPropiedad++;
        }
        else break;
    }
    numeroPropiedad = 1;
    while(true){
        if(documentoDePago.hasOwnProperty(cadenaAbono + numeroPropiedad)){
            fila = document.createElement("tr");
            tipo = document.createElement("td");
            origen = document.createElement("td");
            destino = document.createElement("td");
            codigo = document.createElement("td");
            monto = document.createElement("td");
            montoUSD = document.createElement("td");
            aceptarPago = document.createElement("td");
            inputAceptarPago = document.createElement("input");
            inputAceptarPago.type = "checkbox";
            inputAceptarPago.checked = true;
            inputAceptarPago.disabled = true;
            tipo.textContent = "Contenedor Abono";
            origen.textContent =  "Contenedor " + documentoDePago[cadenaAbono + numeroPropiedad][0];
            destino.textContent = "N/A";
            codigo.textContent = "N/A";
            if(documentoDePago[cadenaAbono + numeroPropiedad][2] == "BS"){
                montoUSD.textContent = "N/A";
                monto.textContent = documentoDePago[cadenaAbono + numeroPropiedad][1];
            } 
            else{
                monto.textContent = "N/A";
                montoUSD.textContent = documentoDePago[cadenaAbono + numeroPropiedad][1];
            }
            aceptarPago.appendChild(inputAceptarPago);
            fila.appendChild(tipo);
            fila.appendChild(origen);
            fila.appendChild(destino);
            fila.appendChild(codigo);
            fila.appendChild(monto);
            fila.appendChild(montoUSD);
            fila.appendChild(aceptarPago);
            tabla.appendChild(fila);
            numeroPropiedad++;
        }
        else break;
    }
    document.getElementById("idPagoPantallaDatosPago").textContent = "Numero de Ticket: " + documentoDePago.IdPago;
    document.getElementById("montoTotalPago").textContent = "Pago Total: " + numberAformatoMontos(documentoDePago.total) + " Bs";
    if(documentoDePago.hasOwnProperty("flagVerificar")){
        if(documentoDePago.flagVerificar == true){
            document.getElementById("necesitaVerificacion").textContent = "El pago requiere verificación";
            document.getElementById("cajaBotonVerificarPago").style.display = "flex";
        }
        else{
            document.getElementById("necesitaVerificacion").textContent = "El pago ya fue verificado";
        }
    }
    else{
        document.getElementById("necesitaVerificacion").textContent = "El pago ya fue verificado";
    }
}