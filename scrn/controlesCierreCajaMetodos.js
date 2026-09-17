/*global document, console */

export {entrarCierreCajaMetodos, 
        atrasCierreCajaMetodos, 
        seleccionarMesCierreCajaMetodos, 
        seleccionarAnnoCierreCaja,
        obtenerFechaFormulario,
        formularioInvalido,
        dibujarTablaMontosCierre,
        dibujarPago,
        dibujarEncabezadoTablaDetalles,
        obtenerNumeroMes
};

import {verSiEsBisiesto,
        extraerHorayFechaFirestore,
        sumaDecimal,
        numberAformatoMontos,
        formatoMontosAnumber} from "./utilidades.js";

import {mostrarPantallaError, } from "./modal.js";

function formularioInvalido(){
    let anno = document.getElementById("SeleccionarAnnoMetodos").value;
    let mes = document.getElementById("SeleccionarMesMetodos");
    let dia = document.getElementById("SeleccionarDiaMetodos");
    if(anno == ""){
        mostrarPantallaError("Llene el espacio de año");
        return 1;
    }
    if(mes.selectedIndex == 0){
        mostrarPantallaError("Seleccione el mes");
        return 1;
    }
    if(dia.selectedIndex == 0){
        mostrarPantallaError("Seleccione el día");
        return 1;
    }
    return 0;
}

function obtenerFechaFormulario(){
    let anno = document.getElementById("SeleccionarAnnoMetodos").value;
    let mes = document.getElementById("SeleccionarMesMetodos");
    let dia = document.getElementById("SeleccionarDiaMetodos");
    let diaObtenido = dia.options[dia.selectedIndex].textContent;
    let mesObtenido = mes.options[mes.selectedIndex].textContent;
    mesObtenido = obtenerNumeroMes(mesObtenido);
    let fecha = diaObtenido + "/" + mesObtenido + "/" + anno;
    return fecha;
}

function obtenerNumeroMes(nombreMes){
    let meses = ["Enero", "Febrero", "Marzo", "Abril", 
                 "Mayo", "Junio", "Julio", "Agosto",
                 "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    for(let i = 0; i <= 11; i++){
        if(nombreMes == meses[i]){
            if(i < 9){
                return "0" + (i + 1); //EN CASO DE QUE SEA ANTES DE OCTUBRE
            }
            else return i + 1; //EN CASO DE QUE SEA OCTUBRE O POSTERIOR (MES 10)
        }
    }
}

function sumarMetodosBS(arrayMetodosPagos, metodo){

    //METODO ES EL CODIGO QUE REPRESENTA EL TIPO DE PAGO QUE SE REALIZO
    //1 ES PUNTO
    //2 ES TRANSFERENCIA
    //3 ES EFECTIVO BOLIVARES
    //4 ES EFECTIVO DOLARES
    //5 ES ZELLE
    
    let monto = "0,00";
    let pagado;

    for(let i = 0; i <= arrayMetodosPagos.length - 1; i++){
        if(arrayMetodosPagos[i].metodoPago == metodo){
            pagado = arrayMetodosPagos[i].monto;
            monto = sumaDecimal(monto, pagado);
            monto = numberAformatoMontos(monto);
        }
    }
    return monto;

}

function sumarMetodosUSD(arrayMetodosPagos, metodo){ //QUE NO INCLUYA ZELLE Y DOLARES EFECTIVO

    //METODO ES EL CODIGO QUE REPRESENTA EL TIPO DE PAGO QUE SE REALIZO
    //1 ES PUNTO
    //2 ES TRANSFERENCIA
    //3 ES EFECTIVO BOLIVARES
    //4 ES EFECTIVO DOLARES
    //5 ES ZELLE
    
    let monto = "0,00";
    let pagado;
    let dolares = 0; 

    for(let i = 0; i <= arrayMetodosPagos.length - 1; i++){
        if(arrayMetodosPagos[i].metodoPago == metodo){

            if(arrayMetodosPagos[i].version == 2){
                pagado = arrayMetodosPagos[i].monto;
                dolares = sumaDecimal(numberAformatoMontos(dolares), pagado);
            }
            else{
                pagado = arrayMetodosPagos[i].monto;
                pagado = formatoMontosAnumber(pagado);
                dolares += (pagado / arrayMetodosPagos[i].precioDolar);
            }
        }
    }
    dolares = numberAformatoMontos(dolares);
    return dolares;
}

function sumarMetodosEfectivoDolaresZelle(arrayMetodosPagos, metodo){ //SOLO ZELLE Y DOLARES EFECTIVO

    let monto = "0,00";
    let pagado;
    let dolares = 0; 

    for(let i = 0; i <= arrayMetodosPagos.length - 1; i++){
        if(arrayMetodosPagos[i].metodoPago == 4 || arrayMetodosPagos[i].metodoPago == 5){
            pagado = arrayMetodosPagos[i].monto;
            monto = sumaDecimal(monto, pagado);
            dolares += (monto / arrayMetodosPagos[i].precioDolar);
            monto = numberAformatoMontos(monto);
        }
    }
    return dolares;
}

function sumarNmetodo(arrayMetodosPagos, metodo){
    
    //METODO ES EL CODIGO QUE REPRESENTA EL TIPO DE PAGO QUE SE REALIZO
    //1 ES PUNTO
    //2 ES TRANSFERENCIA
    //3 ES EFECTIVO BOLIVARES
    //4 ES EFECTIVO DOLARES
    //5 ES ZELLE
    
    let numero = 0;

    for(let i = 0; i <= arrayMetodosPagos.length - 1; i++){
        if(arrayMetodosPagos[i].metodoPago == metodo){
            numero++;
        }
    }
    return numero;
}

function dibujarTablaMontosCierre(arrayMetodosPagos){ //REFIERE A LA TABLA DEL ENCABEZADO

    let tablaMaestra = document.getElementById("tablaDatosPagosCierreMetodos");
    let tabla = document.createElement("tbody");
    tabla.id = "metodosCierreTbody";

    //FILA ENCABEZADO: NOMBRE DE LA INSTITUCION

    let filaInstitucion = document.createElement("tr");
    let celdaInstitucion = document.createElement("th");

    celdaInstitucion.colSpan = 4;
    celdaInstitucion.textContent = "Unidad Educativa Privada Cristóbal Rojas";
    filaInstitucion.appendChild(celdaInstitucion);
    tabla.appendChild(filaInstitucion);

    //FILA ENCABEZADO: FECHA DE CONSULTA

    let filaFechaDeConsulta = document.createElement("tr");
    let celdaFechaDeConsulta = document.createElement("th");

    celdaFechaDeConsulta.colSpan = 4;
    celdaFechaDeConsulta.textContent = "Fecha de Realización de Consulta: ";
    celdaFechaDeConsulta.textContent += extraerHorayFechaFirestore();
    filaFechaDeConsulta.appendChild(celdaFechaDeConsulta);
    tabla.appendChild(filaFechaDeConsulta);

    //FILA ENCABEZADO: FECHA CONSULTADA

    //AQUI EN ESTA PARTE OBTENGO LA FECHA YA PROCESADA

    let annoConsultado = document.getElementById("SeleccionarAnnoMetodos").value;
    let mesConsultado = document.getElementById("SeleccionarMesMetodos").options[document.getElementById("SeleccionarMesMetodos").selectedIndex].textContent;
    let diaConsultado = document.getElementById("SeleccionarDiaMetodos").options[document.getElementById("SeleccionarDiaMetodos").selectedIndex].textContent;
    mesConsultado = obtenerNumeroMes(mesConsultado);

    //AQUI INSERTO LOS DATOS

    let filaFechaConsultada = document.createElement("tr");
    let celdaFechaConsultada = document.createElement("th");

    celdaFechaConsultada.textContent = "Fecha Consultada: ";
    celdaFechaConsultada.textContent += diaConsultado + "/" + mesConsultado + "/" + annoConsultado;
    celdaFechaConsultada.colSpan = 4;

    filaFechaConsultada.appendChild(celdaFechaConsultada);
    tabla.appendChild(filaFechaConsultada);

    //ENCABEZADO: PAGOS POR METODO

    let filaEncabezadoPagosPorMetodo = document.createElement("tr");
    let celdaEncabezadoPagosPorMetodo = document.createElement("th");

    celdaEncabezadoPagosPorMetodo.colSpan = 4;
    celdaEncabezadoPagosPorMetodo.textContent = "Pagos por Método de Pago";

    filaEncabezadoPagosPorMetodo.appendChild(celdaEncabezadoPagosPorMetodo);
    tabla.appendChild(filaEncabezadoPagosPorMetodo);

    //FORMAS DE PAGO (ENCABEZADO SOLO TEXTO CLASIFICACION)

    let filaFormasDePago = document.createElement("tr");
    let celdaFormasDePago = document.createElement("td");
    let celdaNpagos = document.createElement("td");
    let celdaImporteUSD = document.createElement("td");
    let celdaImporteBS = document.createElement("td");

    celdaFormasDePago.textContent = "Formas de Pago";
    celdaNpagos.textContent = "N. Pagos";
    celdaImporteUSD.textContent = "Importe USD";
    celdaImporteBS.textContent = "Importe BS";

    filaFormasDePago.appendChild(celdaFormasDePago);
    filaFormasDePago.appendChild(celdaNpagos);
    filaFormasDePago.appendChild(celdaImporteUSD);
    filaFormasDePago.appendChild(celdaImporteBS);

    tabla.appendChild(filaFormasDePago);

    //DATOS DEL PUNTO
    //DATOS DEL PUNTO
    //DATOS DEL PUNTO

    let filaPunto = document.createElement("tr");

    let celdaPuntoTexto = document.createElement("td");
    let celdaPuntoNpagos = document.createElement("td");
    let celdaPuntoImporteUSD = document.createElement("td");
    let celdaPuntoImporteBS = document.createElement("td");


    celdaPuntoTexto.textContent = "Punto";
    celdaPuntoNpagos.textContent = sumarNmetodo(arrayMetodosPagos, 1);
    celdaPuntoImporteUSD.textContent = "N/A";
    celdaPuntoImporteBS.textContent = sumarMetodosBS(arrayMetodosPagos, 1);

    filaPunto.appendChild(celdaPuntoTexto);
    filaPunto.appendChild(celdaPuntoNpagos);
    filaPunto.appendChild(celdaPuntoImporteUSD);
    filaPunto.appendChild(celdaPuntoImporteBS);

    tabla.appendChild(filaPunto);

    //DATOS EFECTIVO BS
    //DATOS EFECTIVO BS
    //DATOS EFECTIVO BS

    let filaEfectivo = document.createElement("tr");

    let celdaEfectivoBSTexto = document.createElement("td");
    let celdaEfectivoBSNpagos = document.createElement("td");
    let celdaEfectivoBSImporteUSD = document.createElement("td");
    let celdaEfectivoBSImporteBS = document.createElement("td");


    celdaEfectivoBSTexto.textContent = "Efectivo BS";
    celdaEfectivoBSNpagos.textContent = sumarNmetodo(arrayMetodosPagos, 3);
    celdaEfectivoBSImporteUSD.textContent = "N/A";
    celdaEfectivoBSImporteBS.textContent = sumarMetodosBS(arrayMetodosPagos, 3);

    filaEfectivo.appendChild(celdaEfectivoBSTexto);
    filaEfectivo.appendChild(celdaEfectivoBSNpagos);
    filaEfectivo.appendChild(celdaEfectivoBSImporteUSD);
    filaEfectivo.appendChild(celdaEfectivoBSImporteBS);

    tabla.appendChild(filaEfectivo);

    //DATOS EFECTIVO DOLARES
    //DATOS EFECTIVO DOLARES
    //DATOS EFECTIVO DOLARES

    let filaEfectivoDolares = document.createElement("tr");

    let celdaEfectivoDolaresTexto = document.createElement("td");
    let celdaEfectivoDolaresNpagos = document.createElement("td");
    let celdaEfectivoDolaresImporteUSD = document.createElement("td");
    let celdaEfectivoDolaresImporteBS = document.createElement("td");


    celdaEfectivoDolaresTexto.textContent = "Efectivo Dolares";
    celdaEfectivoDolaresNpagos.textContent = sumarNmetodo(arrayMetodosPagos, 4);


    celdaEfectivoDolaresImporteUSD.textContent = sumarMetodosUSD(arrayMetodosPagos, 4);

    //LA FUNCION SUMAR METODOS BS SUMA EL MONTO EN BRUTO
    //AHORA, LOS MONTOS SON EN SU MONEDA, POR LO QUE ESTE METODO FUNCIONA

    celdaEfectivoDolaresImporteBS.textContent = "N/A";

    filaEfectivoDolares.appendChild(celdaEfectivoDolaresTexto);
    filaEfectivoDolares.appendChild(celdaEfectivoDolaresNpagos);
    filaEfectivoDolares.appendChild(celdaEfectivoDolaresImporteUSD);
    filaEfectivoDolares.appendChild(celdaEfectivoDolaresImporteBS);

    tabla.appendChild(filaEfectivoDolares);

    //DATOS TRANSFERENCIA
    //DATOS TRANSFERENCIA
    //DATOS TRANSFERENCIA

    let filaTransferencia = document.createElement("tr");

    let celdaTransferenciaTexto = document.createElement("td");
    let celdaTransferenciaNpagos = document.createElement("td");
    let celdaTransferenciaImporteUSD = document.createElement("td");
    let celdaTransferenciaImporteBS = document.createElement("td");


    celdaTransferenciaTexto.textContent = "Transferencia";
    celdaTransferenciaNpagos.textContent = sumarNmetodo(arrayMetodosPagos, 2);
    celdaTransferenciaImporteUSD.textContent = "N/A";
    celdaTransferenciaImporteBS.textContent = sumarMetodosBS(arrayMetodosPagos, 2);

    filaTransferencia.appendChild(celdaTransferenciaTexto);
    filaTransferencia.appendChild(celdaTransferenciaNpagos);
    filaTransferencia.appendChild(celdaTransferenciaImporteUSD);
    filaTransferencia.appendChild(celdaTransferenciaImporteBS);

    tabla.appendChild(filaTransferencia);

    //DATOS ZELLE
    //DATOS ZELLE
    //DATOS ZELLE

    let filaZelle = document.createElement("tr");

    let celdaZelleTexto = document.createElement("td");
    let celdaZelleNpagos = document.createElement("td");
    let celdaZelleImporteUSD = document.createElement("td");
    let celdaZelleImporteBS = document.createElement("td");


    celdaZelleTexto.textContent = "Zelle";
    celdaZelleNpagos.textContent = sumarNmetodo(arrayMetodosPagos, 5);

    //LO MISMO QUE DICE ARRIBA EN TRANSFERENCIA

    celdaZelleImporteUSD.textContent = sumarMetodosUSD(arrayMetodosPagos, 5);
    celdaZelleImporteBS.textContent = "N/A";



    filaZelle.appendChild(celdaZelleTexto);
    filaZelle.appendChild(celdaZelleNpagos);
    filaZelle.appendChild(celdaZelleImporteUSD);
    filaZelle.appendChild(celdaZelleImporteBS);

    tabla.appendChild(filaZelle);
    tablaMaestra.appendChild(tabla);
}

function determinarMetodoPago(metodoPago){
    if(metodoPago.metodoPago == 1) return "Punto"; 
    if(metodoPago.metodoPago == 2) return "Transferencia"; 
    if(metodoPago.metodoPago == 3) return "Efectivo Bolivares"; 
    if(metodoPago.metodoPago == 4) return "Efectivo Dolares"; 
    if(metodoPago.metodoPago == 5) return "Zelle"; 
}

function dibujarEncabezadoTablaDetalles(){
    let tablaMaestra = document.getElementById("tablaListaPagosCierreMetodos");
    let tabla = document.createElement("tbody");
    tabla.id = "datosPagosMetodosTbody";

    let fila = document.createElement("tr");
    let celdaNombre = document.createElement("td");
    let celdaMetodo = document.createElement("td");
    let celdaProcedenciaPago = document.createElement("td");
    let celdaDestinoPago = document.createElement("td");
    let celdaCodigo = document.createElement("td");
    let celdaMontoBs = document.createElement("td");
    let celdaMontoUSD = document.createElement("td");
    let celdaNrecibo = document.createElement("td");
    let celdaFecha = document.createElement("td");

    celdaNombre.textContent = "Nombre del Acreedor";
    celdaMetodo.textContent = "Método de Pago";
    celdaProcedenciaPago.textContent = "Banco de Procedencia";
    celdaDestinoPago.textContent = "Banco Destino";
    celdaCodigo.textContent = "Código o Referencia";
    celdaMontoBs.textContent = "Monto (BS)";
    celdaMontoUSD.textContent = "Monto (USD)";
    celdaNrecibo.textContent = "No. Recibo";
    celdaFecha.textContent = "Fecha";

    celdaNombre.style.fontWeight = "bold";
    celdaMetodo.style.fontWeight = "bold";
    celdaProcedenciaPago.style.fontWeight = "bold";
    celdaDestinoPago.style.fontWeight = "bold";
    celdaCodigo.style.fontWeight = "bold";
    celdaMontoBs.style.fontWeight = "bold";
    celdaMontoUSD.style.fontWeight = "bold";
    celdaNrecibo.style.fontWeight = "bold";
    celdaFecha.style.fontWeight = "bold";

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaMetodo);
    fila.appendChild(celdaProcedenciaPago);
    fila.appendChild(celdaDestinoPago);
    fila.appendChild(celdaCodigo);
    fila.appendChild(celdaMontoBs);
    fila.appendChild(celdaMontoUSD);
    fila.appendChild(celdaNrecibo);
    fila.appendChild(celdaFecha);

    tabla.appendChild(fila);
    tablaMaestra.appendChild(tabla);
}

function dibujarPago(metodoPago){
    let tabla = document.getElementById("datosPagosMetodosTbody");

    let fila = document.createElement("tr");
    let celdaNombre = document.createElement("td");
    let celdaMetodo = document.createElement("td");
    let celdaProcedenciaPago = document.createElement("td");
    let celdaDestinoPago = document.createElement("td");
    let celdaCodigo = document.createElement("td");
    let celdaMontoBs = document.createElement("td");
    let celdaMontoUSD = document.createElement("td");
    let celdaNrecibo = document.createElement("td");
    let celdaFecha = document.createElement("td");

    console.log("Metodo ", metodoPago.id, ": ", metodoPago);

    if(metodoPago.hasOwnProperty("nombreEmisorPago")) celdaNombre.textContent = metodoPago.nombreEmisorPago;

    if(celdaNombre.textContent == "") celdaNombre.textContent = "No Disponible";

    celdaMetodo.textContent = determinarMetodoPago(metodoPago);
    celdaProcedenciaPago.textContent = metodoPago.bancoProcedencia;
    celdaDestinoPago.textContent = metodoPago.bancoDestino;
    celdaCodigo.textContent = metodoPago.codigo;
    celdaMontoBs.textContent = metodoPago.monto;
    celdaMontoUSD.textContent = numberAformatoMontos(formatoMontosAnumber(metodoPago.monto) / metodoPago.precioDolar);
    celdaFecha.textContent = metodoPago.fecha;

    if(metodoPago.version == 2){

        if(celdaMetodo.textContent == "Zelle"){

            celdaMontoBs.textContent = "N/A";
            celdaMontoUSD.textContent = metodoPago.monto;

        }
        if(celdaMetodo.textContent == "Efectivo Dolares"){

            celdaMontoBs.textContent = "N/A";
            celdaMontoUSD.textContent = metodoPago.monto;

        }

    }

    if(metodoPago.hasOwnProperty("nRecibo")) celdaNrecibo.textContent = metodoPago.nRecibo;
    
    if(celdaNrecibo.textContent == "") celdaNrecibo.textContent = "No Disponible";

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaMetodo);
    fila.appendChild(celdaProcedenciaPago);
    fila.appendChild(celdaDestinoPago);
    fila.appendChild(celdaCodigo);
    fila.appendChild(celdaMontoBs);
    fila.appendChild(celdaMontoUSD);
    fila.appendChild(celdaNrecibo);
    fila.appendChild(celdaFecha);

    tabla.appendChild(fila);
}

function seleccionarAnnoCierreCaja(){
    document.getElementById("SeleccionarMesMetodos").selectedIndex = 0;
    document.getElementById("SeleccionarDiaMetodos").selectedIndex = 0;
}

function seleccionarMesCierreCajaMetodos(){
    document.getElementById("SeleccionarDiaMetodos").selectedIndex = 0;
    let anno = document.getElementById("SeleccionarAnnoMetodos").value;
    let mes = document.getElementById("SeleccionarMesMetodos");
    let dia = document.getElementById("SeleccionarDiaMetodos");
    mes = mes.options[mes.selectedIndex].textContent; 
    for(let i = 1; i <= 31; i++) dia.children[i].style.display = "block";
    if((verSiEsBisiesto(anno) == 0) && (mes == "Febrero")){
        dia.children[29].style.display = "block";
        dia.children[30].style.display = "none";
        dia.children[31].style.display = "none";
    }
    if((verSiEsBisiesto(anno) == 1) && (mes == "Febrero")){
        dia.children[29].style.display = "none";
        dia.children[30].style.display = "none";
        dia.children[31].style.display = "none";
    }
    if((mes == "Abril")){
        dia.children[29].style.display = "block";
        dia.children[30].style.display = "block";
        dia.children[31].style.display = "none";
    }
    if((mes == "Junio")){
        dia.children[29].style.display = "block";
        dia.children[30].style.display = "block";
        dia.children[31].style.display = "none";
    }
    if((mes == "Septiembre")){
        dia.children[29].style.display = "block";
        dia.children[30].style.display = "block";
        dia.children[31].style.display = "none";
    }
    if((mes == "Noviembre")){
        dia.children[29].style.display = "block";
        dia.children[30].style.display = "block";
        dia.children[31].style.display = "none";
    }
}

function entrarCierreCajaMetodos(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-CierreCajaMetodos").style.display = "block";
}

function atrasCierreCajaMetodos(){
    document.getElementById("main-container-CierreCajaMetodos").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    document.getElementById("SeleccionarAnnoMetodos").value = "";
    document.getElementById("SeleccionarMesMetodos").selectedIndex = 0;
    document.getElementById("SeleccionarDiaMetodos").selectedIndex = 0;
    document.getElementById("containerTablasCierreMetodos").style.display = "none";
}