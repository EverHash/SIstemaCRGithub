/*global document */

export {seleccionarAnnoCierreCaja, 
        seleccionarMesCierreCaja, 
        atrasCierreCaja, 
        entrarCierreDeCaja,
        sumarMetodosUSD,
        sumarMetodosBS,
        sumarMetodosBSConConversion};

import { formatoMontosAnumber, numberAformatoMontos, sumaDecimal, verSiEsBisiesto } from "./utilidades.js";

function seleccionarAnnoCierreCaja(){
    document.getElementById("SeleccionarMes").selectedIndex = 0;
    document.getElementById("SeleccionarDia").selectedIndex = 0;
}

function seleccionarMesCierreCaja(){
    document.getElementById("SeleccionarDia").selectedIndex = 0;
    let anno = document.getElementById("SeleccionarAnno").value;
    let mes = document.getElementById("SeleccionarMes");
    let dia = document.getElementById("SeleccionarDia");
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

function atrasCierreCaja(){
    document.getElementById("main-container-CierreCaja").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    document.getElementById("SeleccionarAnno").value = "";
    document.getElementById("SeleccionarMes").selectedIndex = 0;
    document.getElementById("SeleccionarDia").selectedIndex = 0;
    document.getElementById("cierreFechaActual").checked = false;
    document.getElementById("containerTablasCierre").style.display = "none";
}

function entrarCierreDeCaja(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-CierreCaja").style.display = "block";
}

function sumarMetodosBSConConversion(arrayRecibos){

    //TRANSFERENCIA[3] = MONTO
    //PUNTO[1] = MONTO
    //EFECTIVOBS NO ES ARRAY

    let montoTotal = "0,00";
    let montoPago;
    let precioUSD;
    let cadenaPunto = "pagoPunto";
    let cadenaEfectivo = "pagoEfectivo";
    let cadenaTransferencia = "pagoTransferencia";
    let numero = 1;

    for(let i = 0; i <= arrayRecibos.length - 1; i++){ //EFECTIVO BS
        numero = 1;
        while(arrayRecibos[i].hasOwnProperty(cadenaEfectivo + numero)){

            if(arrayRecibos[i].hasOwnProperty("precioUSDdetallado")){

                //SE OBTIENE EL PRECIO DEL DOLAR DE ESE METODO DE PAGO
                //Y SE CONVIERTE EN NUMBER EL PRECIO DEL DOLAR

                precioUSD = arrayRecibos[i][cadenaEfectivo + numero][1];
                precioUSD = formatoMontosAnumber(precioUSD);

                //SE OBTIENE EL MONTO PAGADO POR ESTE METODO
                //Y LUEGO DICHO MONTO OBTENIDO SE CONVIERTE
                //TAMBIEN EL MONTO A TIPO NUMBER

                montoPago = arrayRecibos[i][cadenaEfectivo + numero][0];
                montoPago = formatoMontosAnumber(montoPago);

                //SE DIVIDE EL MONTO DEL PAGO ENTRE EL PRECIO DEL DOLAR
                //Y DICHO RESULTADO LUEGO SE CONVIERTE A FORMATO MONTOS
                //PARA PODER EFECTUAR LA SUMA CON ARITMETICA DECIMAL

                montoPago = montoPago / precioUSD;
                montoPago = numberAformatoMontos(montoPago);

                //SE EFECTUA LA SUMA CON ARITMETICA DECIMAL
                //Y DADO QUE LA FUNCION RETORNA UN NUMBER
                //DICHO RESULTADO SE CONVIERTE EN UN 
                //STRING EN FORMATO DE MONTOS

                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }
            else{

                //OBTENER EL MONTO DEL DOLAR DEL DIA EN EL QUE SE EMITIO ESE RECIBO
                //ASI COMO TAMBIEN EL MONTO PAGADO POR ESTE METODO DE PAGO

                precioUSD = arrayRecibos[i].precioDolar;
                montoPago = arrayRecibos[i][cadenaEfectivo + numero];

                //SE CONVIERTE EL MONTO A NUMBER
                //UNA VEZ CONVERTIDO, SE DIVIDE ENTRE EL PRECIO DEL DOLAR
                //DE MANERA QUE SE OBTIENE EL MONTO EN DOLARES
                //LUEGO SE CONVIERTE EL MONTO A FORMATO MONTOS

                montoPago = formatoMontosAnumber(montoPago);
                montoPago = montoPago / precioUSD;
                montoPago = numberAformatoMontos(montoPago);

                //ESTANDO EN FORMATO MONTOS, SE REALIZA LA SUMA
                //EN ARITMETICA DECIMAL, LUEGO EL MONTO EN NUMBER SE CONVIERTE EN 
                //FORMATO MONTOS PARA MOSTRARLO EN LA TABLA

                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }

            //INCREMENTO PARA CONTINUAR EL BUCLE

            numero++;
        }
    }

    //SE PONE EL IMPORTE POR ESTE LADO

    document.getElementById("importeUSDefectivoBS").textContent = montoTotal;


    //SUMATORIA DE PUNTO
    //SUMATORIA DE PUNTO
    //SUMATORIA DE PUNTO


    //REINICIANDO VALORES
    numero = 1;
    montoTotal = "0,00";


    for(let i = 0; i <= arrayRecibos.length - 1; i++){
        numero = 1;
        while(arrayRecibos[i].hasOwnProperty(cadenaPunto + numero)){

            if(arrayRecibos[i].hasOwnProperty("precioUSDdetallado")){

                //SE TOMA EL PRECIO DEL DOLAR DEL METODO DE PAGO
                //LUEGO SE CONVIERTE EN NUMBER PARA PODER USARSE
                //EN ARITMETICA

                precioUSD = arrayRecibos[i][cadenaPunto + numero][2];
                precioUSD = formatoMontosAnumber(precioUSD);

                //SE TOMA EL MONTO DE ESTE METODO DE PAGO
                //LUEGO SE CONVIERTE EN NUMBER PARA PODER USARSE
                //EN ARITMETICA

                montoPago = arrayRecibos[i][cadenaPunto + numero][1];
                montoPago = formatoMontosAnumber(montoPago);

                //USANDO LOS MONTOS OBTENIDOS, SE DIVIDE EL MONTO
                //DEL METODO DE PAGO ENTRE EL PRECIO DEL DOLAR
                //DE FORMA QUE SE HA OBTENIDO EL MONTO DEL PAGO
                //EN DOLARES

                montoPago = montoPago / precioUSD;
                montoPago = numberAformatoMontos(montoPago);

                //SE EFECTUA LA SUMA DECIMAL DE FORMA QUE SE
                //VA SUMANDO EL MONTO TOTAL EN DOLARES
                //EL RESULTADO EN FORMATO MONTOS
                //SE USA PARA LA SUMA DECIMAL
                //Y PARA MOSTRARLO AL FINAL

                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }
            else{

                //SE TOMA EL PRECIO DEL DOLAR DEL RECIBO
                //LUEGO SE CONVIERTE EN NUMBER PARA PODER USARSE
                //EN ARITMETICA

                precioUSD = arrayRecibos[i].precioDolar;

                //SE TOMA EL MONTO DE ESTE METODO DE PAGO
                //LUEGO SE CONVIERTE EN NUMBER PARA PODER USARSE
                //EN ARITMETICA

                montoPago = arrayRecibos[i][cadenaPunto + numero][1];
                montoPago = formatoMontosAnumber(montoPago);

                //USANDO LOS MONTOS OBTENIDOS, SE DIVIDE EL MONTO
                //DEL METODO DE PAGO ENTRE EL PRECIO DEL DOLAR
                //DE FORMA QUE SE HA OBTENIDO EL MONTO DEL PAGO
                //EN DOLARES

                montoPago = montoPago / precioUSD;
                montoPago = numberAformatoMontos(montoPago);

                //SE EFECTUA LA SUMA DECIMAL DE FORMA QUE SE
                //VA SUMANDO EL MONTO TOTAL EN DOLARES
                //EL RESULTADO EN FORMATO MONTOS
                //SE USA PARA LA SUMA DECIMAL
                //Y PARA MOSTRARLO AL FINAL

                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }

            //INCREMENTO PARA CONTINUAR EL BUCLE

            numero++;
        }
    }

    document.getElementById("importeUSDpunto").textContent = montoTotal;

    //QUEDE FUE AQUI, YA A PUNTO LE ASIGNE LOS DATOS, FALTA TRANSFERENCIA



    //SUMATORIA DE TRANSFERENCIA
    //SUMATORIA DE TRANSFERENCIA
    //SUMATORIA DE TRANSFERENCIA
    //SUMATORIA DE TRANSFERENCIA


    //REINICIANDO VALORES
    numero = 1;
    montoTotal = "0,00";
    
    for(let i = 0; i <= arrayRecibos.length - 1; i++){
        numero = 1;
        while(arrayRecibos[i].hasOwnProperty(cadenaTransferencia + numero)){

            if(arrayRecibos[i].hasOwnProperty("precioUSDdetallado")){

                //SE TOMA EL PRECIO DEL DOLAR DEL METODO DE PAGO
                //LUEGO SE CONVIERTE EN NUMBER PARA PODER USARSE
                //EN ARITMETICA

                precioUSD = arrayRecibos[i][cadenaTransferencia + numero][6];
                precioUSD = formatoMontosAnumber(precioUSD);

                //SE TOMA EL MONTO DE ESTE METODO DE PAGO
                //LUEGO SE CONVIERTE EN NUMBER PARA PODER USARSE
                //EN ARITMETICA

                montoPago = arrayRecibos[i][cadenaTransferencia + numero][3];
                montoPago = formatoMontosAnumber(montoPago);

                //USANDO LOS MONTOS OBTENIDOS, SE DIVIDE EL MONTO
                //DEL METODO DE PAGO ENTRE EL PRECIO DEL DOLAR
                //DE FORMA QUE SE HA OBTENIDO EL MONTO DEL PAGO
                //EN DOLARES

                montoPago = montoPago / precioUSD;
                montoPago = numberAformatoMontos(montoPago);

                //SE EFECTUA LA SUMA DECIMAL DE FORMA QUE SE
                //VA SUMANDO EL MONTO TOTAL EN DOLARES
                //EL RESULTADO EN FORMATO MONTOS
                //SE USA PARA LA SUMA DECIMAL
                //Y PARA MOSTRARLO AL FINAL

                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }
            else{

                //SE TOMA EL PRECIO DEL DOLAR DEL RECIBO
                //LUEGO SE CONVIERTE EN NUMBER PARA PODER USARSE
                //EN ARITMETICA

                precioUSD = arrayRecibos[i].precioDolar;

                //SE TOMA EL MONTO DE ESTE METODO DE PAGO
                //LUEGO SE CONVIERTE EN NUMBER PARA PODER USARSE
                //EN ARITMETICA

                montoPago = arrayRecibos[i][cadenaTransferencia + numero][3];
                montoPago = formatoMontosAnumber(montoPago);

                //USANDO LOS MONTOS OBTENIDOS, SE DIVIDE EL MONTO
                //DEL METODO DE PAGO ENTRE EL PRECIO DEL DOLAR
                //DE FORMA QUE SE HA OBTENIDO EL MONTO DEL PAGO
                //EN DOLARES

                montoPago = montoPago / precioUSD;
                montoPago = numberAformatoMontos(montoPago);

                //SE EFECTUA LA SUMA DECIMAL DE FORMA QUE SE
                //VA SUMANDO EL MONTO TOTAL EN DOLARES
                //EL RESULTADO EN FORMATO MONTOS
                //SE USA PARA LA SUMA DECIMAL
                //Y PARA MOSTRARLO AL FINAL

                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }

            //INCREMENTO PARA CONTINUAR EL BUCLE

            numero++;
        }

    }
    
    document.getElementById("importeUSDTransferencia").textContent = montoTotal;

}

function sumarMetodosBS(arrayRecibos){

    //TRANSFERENCIA[3] = MONTO
    //PUNTO[1] = MONTO
    //EFECTIVOBS NO ES ARRAY


    let montoTotal = "0,00";
    let nPagosPunto = 0;
    let nPagosEfectivo = 0;
    let nPagosTransferencia = 0; 
    let montoPago;
    let cadenaPunto = "pagoPunto";
    let cadenaEfectivo = "pagoEfectivo";
    let cadenaTransferencia = "pagoTransferencia";
    let numero = 1;

    for(let i = 0; i <= arrayRecibos.length - 1; i++){
        numero = 1;
        while(arrayRecibos[i].hasOwnProperty(cadenaEfectivo + numero)){
            nPagosEfectivo++;

            //NO ES ARRAY Y SON BS, ASI QUE SOLO TOMAMOS Y YA

            if(arrayRecibos[i].hasOwnProperty("precioUSDdetallado")){
                montoPago = arrayRecibos[i][cadenaEfectivo + numero][0];
            }
            else{
                montoPago = arrayRecibos[i][cadenaEfectivo + numero];
            }
            montoTotal = sumaDecimal(montoTotal, montoPago);
            montoTotal = numberAformatoMontos(montoTotal);

            //INCREMENTO PARA CONTINUAR EL BUCLE

            numero++;
        }
    }

    //SE PONE EL NUMERO DE PAGOS QUE SE HICIERON EN EFECTIVO BS
    //Y EL IMPORTE

    document.getElementById("nPagosEfectivoBS").textContent = nPagosEfectivo;
    document.getElementById("importeEfectivoBS").textContent = montoTotal;


    //SUMATORIA DE PUNTO
    //SUMATORIA DE PUNTO
    //SUMATORIA DE PUNTO


    //REINICIANDO VALORES
    numero = 1;
    montoTotal = "0,00";


    for(let i = 0; i <= arrayRecibos.length - 1; i++){
        numero = 1;
        while(arrayRecibos[i].hasOwnProperty(cadenaPunto + numero)){
            nPagosPunto++;
            montoPago = arrayRecibos[i][cadenaPunto + numero][1];
            montoTotal = sumaDecimal(montoTotal, montoPago);
            montoTotal = numberAformatoMontos(montoTotal);

            //INCREMENTO PARA CONTINUAR EL BUCLE

            numero++;
        }
    }

    document.getElementById("nPagosPunto").textContent = nPagosPunto;
    document.getElementById("importePunto").textContent = montoTotal;


    //SUMATORIA DE TRANSFERENCIA
    //SUMATORIA DE TRANSFERENCIA
    //SUMATORIA DE TRANSFERENCIA
    //SUMATORIA DE TRANSFERENCIA


    //REINICIANDO VALORES
    numero = 1;
    montoTotal = "0,00";
    
    for(let i = 0; i <= arrayRecibos.length - 1; i++){
        numero = 1;
        while(arrayRecibos[i].hasOwnProperty(cadenaTransferencia + numero)){
            nPagosTransferencia++;
            montoPago = arrayRecibos[i][cadenaTransferencia + numero][3];
            montoTotal = sumaDecimal(montoTotal, montoPago);
            montoTotal = numberAformatoMontos(montoTotal);

            //INCREMENTO PARA CONTINUAR EL BUCLE

            numero++;
        }
    }
    
    document.getElementById("nPagosTransferencia").textContent = nPagosTransferencia;
    document.getElementById("importeTransferencia").textContent = montoTotal;

}


function sumarMetodosUSD(arrayRecibos){
    
    //ZELLE[1] = MONTO
    //EFECTIVODOLARES[2] = MONTO

    let montoTotal = "0,00";
    let nPagosZelle = 0;
    let nPagosEfectivo = 0; 
    let montoPago;
    let cadenaZelle = "pagoZelle";
    let cadenaEfectivo = "pagoDolares";
    let numero = 1;

    for(let i = 0; i <= arrayRecibos.length - 1; i++){
        numero = 1;
        while(arrayRecibos[i].hasOwnProperty(cadenaEfectivo + numero)){
            nPagosEfectivo++;
            if(arrayRecibos[i].hasOwnProperty("version")){
                montoPago = arrayRecibos[i][cadenaEfectivo + numero][2];
                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }
            else{

                //CONVIERTE A DOLARES EL MONTO QUE ERA ANTES EN BS
                //LUEGO LO CONVIERTE A FORMATO MONTOS PARA SUMARLO
                //LO SUMA Y DESPUES CONVIERTE EL NUMBER  RESULTANTE 
                //EN FORMATO MONTOS

                montoPago = arrayRecibos[i][cadenaEfectivo + numero][2];
                montoPago = formatoMontosAnumber(montoPago);
                montoPago = montoPago / arrayRecibos[i].precioDolar;
                montoPago = numberAformatoMontos(montoPago);
                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }
            numero++;
        }
    }

    //SE PONE EL NUMERO DE PAGOS QUE SE HICIERON EN DOLARES
    //Y EL IMPORTE

    document.getElementById("nPagosEfectivoUSD").textContent = nPagosEfectivo;
    document.getElementById("importeEfectivoUSD").textContent = montoTotal;

    //REINICIANDO VALORES
    numero = 1;
    montoTotal = "0,00";


    for(let i = 0; i <= arrayRecibos.length - 1; i++){
        numero = 1;
        while(arrayRecibos[i].hasOwnProperty(cadenaZelle + numero)){
            nPagosZelle++;
            if(arrayRecibos[i].hasOwnProperty("version")){
                montoPago = arrayRecibos[i][cadenaZelle + numero][1];
                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }
            else{
    
                //CONVIERTE A DOLARES EL MONTO QUE ERA ANTES EN BS
                //LUEGO LO CONVIERTE A FORMATO MONTOS PARA SUMARLO
                //LO SUMA Y DESPUES CONVIERTE EL NUMBER  RESULTANTE 
                //EN FORMATO MONTOS
    
                montoPago = arrayRecibos[i][cadenaZelle + numero][1];
                montoPago = formatoMontosAnumber(montoPago);
                montoPago = montoPago / arrayRecibos[i].precioDolar;
                montoPago = numberAformatoMontos(montoPago);
                montoTotal = sumaDecimal(montoTotal, montoPago);
                montoTotal = numberAformatoMontos(montoTotal);
            }
            numero++;
        }
    }

    document.getElementById("nPagosZelle").textContent = nPagosZelle;
    document.getElementById("importeZelle").textContent = montoTotal;
}