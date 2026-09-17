/*global console */

import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
export{extraerDiaDelMes,
       fechaDeHoy,
       fechaDeHoyFormatoJS,
       truncarDecimales,
       extraerMesEscolar,
       eliminadorDeMetodos,
       copiadorDePropiedades,
       reemplazarCaracteres,
       validacionMontoEstiloBDV,
       formatearCadenaNumerosMilesYDecimales,
       extraerNumerosPuntosComasDeUnaCadena,
       extraerNumerosPuntosComasBarrasGuionesDeUnaCadena,
       cambiarAFechaVenezolana,
       convertirAfechaHTML,
       eliminarOcurrenciasElementoArray,
       eliminarTodasLasOcurrenciasDeUnCaracter,
       verSiEsNumeroEntero,
       extraerLetrasDeUnaCadena,
       productoPrecision2,
       divisionPrecision2,
       formatoMontosAnumber,
       numberAformatoMontos,
       verSiEsBisiesto,
       extraerFechaFirestore,
       extraerHorayFechaFirestore, 
       sumaDecimal, 
       restaDecimal, 
       subcadenaDesdeIndice, 
       determinarProntoPago, 
       agregarPagoAlRegistroDeRepresentante,
       idFechaPagoAdministrativo,
       invertirOrdenArray,
       eliminarCaracterEnIndice,
       insertarCaracterEnIndice,
       verSiEsUnaLetraOCaracterEspecial,
       verificarProntoPagoPorFecha,
       flechaArribaAnnoEscolar,
       flechaAbajoAnnoEscolar,
       determinarSiTieneAbonos,
       determinarPropiedadPorMes
};

import {getDoc, doc, Base, updateDoc} from "./firebase.js";
import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";

function determinarPropiedadPorMes(mes){

    let arrayMeses = ["pagoInscripcion",
                      "pago09Septiembre",
                      "pago10Octubre",
                      "pago11Noviembre",
                      "pago12Diciembre",
                      "pago13Enero",
                      "pago14Febrero",
                      "pago15Marzo",
                      "pago16Abril",
                      "pago17Mayo",
                      "pago18Junio",
                      "pago19Julio",
                      "pago20Agosto"];

    let arrayMesesSolo = ["Inscripcion",
                      "Septiembre",
                      "Octubre",
                      "Noviembre",
                      "Diciembre",
                      "Enero",
                      "Febrero",
                      "Marzo",
                      "Abril",
                      "Mayo",
                      "Junio",
                      "Julio",
                      "Agosto"];

  for(let i = 0; i <= arrayMesesSolo.length - 1; i++){

    if(mes == arrayMesesSolo[i]) return arrayMeses[i];

  }

}

export function determinarNumeroConcepto(mes){ //PARA USO EN CONVENIOS

  //INSCRIP: 0
  //AGOSTO: 12

  let arrayMesesSolo = ["Inscripción",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre",
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto"];

  for(let i = 0; i <= arrayMesesSolo.length - 1; i++){

    if(mes == arrayMesesSolo[i]) return i;

  }

}

export function determinarConceptoPorNumero(numero){ //PARA USO EN CONVENIOS

  //INSCRIP: 0
  //AGOSTO: 12

  let arrayMesesSolo = ["Inscripción",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre",
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto"];

  return arrayMesesSolo[numero];

}

export function ponerPrimeraLetraEnMayuscula(cadena){

  let resultado = "";
  
  let copiaCadena;

  let flagMayuscula = false;

  for(let i = 0; i <= cadena.length - 1; i++){

    if(esUnaLetra(cadena[i]) && i == 0){

      copiaCadena = cadena[i];
      resultado += copiaCadena.toUpperCase();
      continue;

    }

    if(esUnaLetra(cadena[i]) && flagMayuscula){

      copiaCadena = cadena[i];
      resultado += copiaCadena.toUpperCase();
      flagMayuscula = false;
      continue;


    } 

    if(esUnCaracterEspecial(cadena[i])){

      flagMayuscula = true;
      resultado += cadena[i];
      continue;

    }

    copiaCadena = cadena[i];
    resultado += copiaCadena.toLowerCase();
    continue;
    
    

  }

  return resultado;

}

function flechaArribaAnnoEscolar(){

  //ESTO SUBE EN UNO AMBOS AÑOS ESCOLARES

  let cadena = this.parentNode.parentNode.children[0].value;
  cadena = cadena.split("-");

  let n1 = parseInt(cadena[0]);
  let n2 = parseInt(cadena[1]);

  n1++;
  n2++;

  this.parentNode.parentNode.children[0].value = n1 + "-" + n2;

}

export function existeEnElArray(array, elemento){

  //SI ESTA RETORNA TRUE
  //SI NO ESTA RETORNA FALSE

  for(let i = 0; i <= array.length - 1; i++){

    if(array[i] == elemento) return true;

  }

  return false;

}

function flechaAbajoAnnoEscolar(){

  //ESTO BAJA EN UNO AMBOS AÑOS ESCOLARES

  let cadena = this.parentNode.parentNode.children[0].value;
  cadena = cadena.split("-");

  let n1 = parseInt(cadena[0]);
  let n2 = parseInt(cadena[1]);

  n1--;
  n2--;

  this.parentNode.parentNode.children[0].value = n1 + "-" + n2;
  
}

function invertirOrdenArray(array){
    let resultado = [];
    for(let i = array.length - 1; i >= 0; i--){
        resultado.push(array[i]);
    }
    return resultado;
}

function verificarProntoPagoPorFecha(fecha1, fecha2){

    //SE VERIFICA SI LA FECHA 2 ES MAYOR O IGUAL
    //A LA FECHA 1, ES DECIR, SI FECHA 2 NO HA LLEGADO O 
    //SE ESTA CUANDO MUCHO EN ESA FECHA

    //0: FECHA YA PASO
    //1: ESTAMOS EN ESE DIA CUANDO MUCHO

    if(Date.parse(fecha1) <= Date.parse(fecha2)) return 1;
    else return 0;

}

export function contarOcurrenciasArray(array, valor){

  let contador = 0;

  for(let i = 0; i <= array.length - 1; i++){

    if(array[i] == valor) contador++;

  }

  return contador;

}

export function fechaYaPaso(fechaFormulario, fechaHoy){

    //FALSE: CUANDO MUCHO ESTAMOS EN ESE DIA
    //TRUE: YA PASO

    let hoy = Date.parse(fechaHoy);

    let formulario = Date.parse(fechaFormulario);

    if(formulario > hoy) return false; //OSEA, NO HA LLEGADO LA FECHA DEL FORMULARIO

    return true; //CUANDO MUCHO ESTAMOS EN ESE DIA

}

async function agregarPagoAlRegistroDeRepresentante(cedula, numeroPago){
  try {
    let representante = await getDoc(doc(Base, "representantes", cedula));
    let array = [...representante.data().registroPagos];
    if(typeof(numeroPago) != "string") numeroPago.toString();
    array.push(numeroPago);
    await updateDoc(doc(Base, "representantes", cedula), {registroPagos: array});
  } catch (error) {
    ocultarPantallaCarga();
    console.log("ERROR AL PAGAR: ", error);
    mostrarPantallaError("Error Inesperado");
  }
}

function idFechaPagoAdministrativo(){
  let fecha;
  fecha = Date(serverTimestamp.seconds * 1000);
  let fechaProcesada = fecha.slice(8, 10);
  if(fecha.slice(4, 7) == "Jan"){
    fechaProcesada += "01";
  }
  if(fecha.slice(4, 7) == "Feb"){
    fechaProcesada += "02";
  }
  if(fecha.slice(4, 7) == "Mar"){
    fechaProcesada += "03";
  }
  if(fecha.slice(4, 7) == "Apr"){
    fechaProcesada += "04";
  }
  if(fecha.slice(4, 7) == "May"){
    fechaProcesada += "05";
  }
  if(fecha.slice(4, 7) == "Jun"){
    fechaProcesada += "06";
  }
  if(fecha.slice(4, 7) == "Jul"){
    fechaProcesada += "07";
  }
  if(fecha.slice(4, 7) == "Aug"){
    fechaProcesada += "08";
  }
  if(fecha.slice(4, 7) == "Sep"){
    fechaProcesada += "09";
  }
  if(fecha.slice(4, 7) == "Oct"){
    fechaProcesada += "10";
  }
  if(fecha.slice(4, 7) == "Nov"){
    fechaProcesada += "11";
  }
  if(fecha.slice(4, 7) == "Dec"){
    fechaProcesada += "12";
  }
  fechaProcesada += fecha.slice(11, 24);
  fechaProcesada = eliminarTodasLasOcurrenciasDeUnCaracter(fechaProcesada, " ");
  fechaProcesada = eliminarTodasLasOcurrenciasDeUnCaracter(fechaProcesada, ":");
  return fechaProcesada;
}


function extraerHorayFechaFirestore(){
  let fecha;
  fecha = Date(serverTimestamp.seconds * 1000);
  let fechaProcesada = fecha.slice(8, 10) + "/";
  if(fecha.slice(4, 7) == "Jan"){
    fechaProcesada += "01/";
  }
  if(fecha.slice(4, 7) == "Feb"){
    fechaProcesada += "02/";
  }
  if(fecha.slice(4, 7) == "Mar"){
    fechaProcesada += "03/";
  }
  if(fecha.slice(4, 7) == "Apr"){
    fechaProcesada += "04/";
  }
  if(fecha.slice(4, 7) == "May"){
    fechaProcesada += "05/";
  }
  if(fecha.slice(4, 7) == "Jun"){
    fechaProcesada += "06/";
  }
  if(fecha.slice(4, 7) == "Jul"){
    fechaProcesada += "07/";
  }
  if(fecha.slice(4, 7) == "Aug"){
    fechaProcesada += "08/";
  }
  if(fecha.slice(4, 7) == "Sep"){
    fechaProcesada += "09/";
  }
  if(fecha.slice(4, 7) == "Oct"){
    fechaProcesada += "10/";
  }
  if(fecha.slice(4, 7) == "Nov"){
    fechaProcesada += "11/";
  }
  if(fecha.slice(4, 7) == "Dec"){
    fechaProcesada += "12/";
  }
  fechaProcesada += fecha.slice(11, 24);
  console.log(fechaProcesada);
  return fechaProcesada;
}

function extraerFechaFirestore(){
  let fecha;
  fecha = Date(serverTimestamp.seconds * 1000);
  let fechaProcesada = fecha.slice(8, 10) + "/";
  if(fecha.slice(4, 7) == "Jan"){
    fechaProcesada += "01/";
  }
  if(fecha.slice(4, 7) == "Feb"){
    fechaProcesada += "02/";
  }
  if(fecha.slice(4, 7) == "Mar"){
    fechaProcesada += "03/";
  }
  if(fecha.slice(4, 7) == "Apr"){
    fechaProcesada += "04/";
  }
  if(fecha.slice(4, 7) == "May"){
    fechaProcesada += "05/";
  }
  if(fecha.slice(4, 7) == "Jun"){
    fechaProcesada += "06/";
  }
  if(fecha.slice(4, 7) == "Jul"){
    fechaProcesada += "07/";
  }
  if(fecha.slice(4, 7) == "Aug"){
    fechaProcesada += "08/";
  }
  if(fecha.slice(4, 7) == "Sep"){
    fechaProcesada += "09/";
  }
  if(fecha.slice(4, 7) == "Oct"){
    fechaProcesada += "10/";
  }
  if(fecha.slice(4, 7) == "Nov"){
    fechaProcesada += "11/";
  }
  if(fecha.slice(4, 7) == "Dec"){
    fechaProcesada += "12/";
  }
  fechaProcesada += fecha.slice(11, 15);
  return fechaProcesada;
}


function verSiEsBisiesto(anno){
  if(verSiEsNumeroEntero(anno) == 1) return 1;
  else anno = parseInt(anno);
  if((anno % 4 == 0) && (anno % 100 != 0)){
      return 0;
  }
  if(anno % 400 == 0){
      return 0;
  }
  else return 1;
}

export function determinarNumeroMesOrdinario(mes){

    let nombresMeses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"];
    let numeroMes = 0;

    for(let i = 0; i <= nombresMeses.length - 1; i++){
      if(mes.includes(nombresMeses[i])){
        numeroMes = i + 1;
        return numeroMes;
      }
    }

}

export function determinarNumeroMesOrdinarioDosDigitos(mes){

    let nombresMeses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"];

    let numeroMes = 0;

    for(let i = 0; i <= nombresMeses.length - 1; i++){
      if(mes.includes(nombresMeses[i])){
        numeroMes = i + 1;

        numeroMes = numeroMes.toString();

        if(numeroMes.length == 1){

          numeroMes = "0" + numeroMes;

        }

        return numeroMes;
      }
    }

}

function determinarProntoPago(mesEnCuestion, annoEscolarConsultado){

  let fechaHoy = fechaDeHoyFormatoJS();

  let annoConsulta;

  let numeroMesEnCuestion = determinarNumeroMesOrdinario(mesEnCuestion);

  let fechaConsulta;

  if(numeroMesEnCuestion >= 9 && numeroMesEnCuestion <= 12){

    annoConsulta = annoEscolarConsultado.split("-");
    annoConsulta = annoConsulta[0];

  }
  if(numeroMesEnCuestion >= 1 && numeroMesEnCuestion <= 8){

    annoConsulta = annoEscolarConsultado.split("-");
    annoConsulta = annoConsulta[1];

  }

  fechaConsulta = annoConsulta + "-" + numeroMesEnCuestion+ "-" + "05";

  if(Date.parse(fechaHoy) <= Date.parse(fechaConsulta)) return true;
  else return false;

}

function contarDesdeOcurrenciaDeCaracter(cadena, caracter){ //FUNCIONA BIEN
  let contador = 0;
  let marcador = false;
  for(let i = 0; i <= cadena.length - 1; i++){
    if(cadena[i] == caracter){
      marcador = true;
      continue;
    } 
    if(marcador){
      contador++;
    }
  }
  return contador;
}

function productoPrecision2Old(n1, n2){
  let proceso = n1 * n2;
  let resultado = truncarDecimales(proceso, 2);
  resultado = parseFloat(resultado);
  return resultado;
}

function productoPrecision2(n1, n2){
  let primerValor = n1.toString();
  let segundoValor = n2.toString();
  if(primerValor.includes("e") || segundoValor.includes("e")){
    return productoPrecision2Old(n1, n2);
  }
  if(primerValor[0] == "0" || segundoValor[0] == "0"){
    return productoPrecision2Old(n1, n2);
  }
  let decimales1 = contarDesdeOcurrenciaDeCaracter(primerValor, ".");
  let decimales2 = contarDesdeOcurrenciaDeCaracter(segundoValor, ".");
  let multiplicacion;
  let suma = decimales1 + decimales2;
  primerValor = eliminarTodasLasOcurrenciasDeUnCaracter(primerValor, ".");
  segundoValor = eliminarTodasLasOcurrenciasDeUnCaracter(segundoValor, ".");
  primerValor = parseInt(primerValor);
  segundoValor = parseInt(segundoValor);
  multiplicacion = primerValor * segundoValor;
  if(suma > 0){
    multiplicacion = multiplicacion.toString();
    multiplicacion = insertarCaracterEnIndice(multiplicacion, multiplicacion.length - suma, ".");
    multiplicacion = parseFloat(multiplicacion);
  }
  if(suma == 0){
    parseFloat(multiplicacion);
  }
  let resultado = truncarDecimales(multiplicacion, 2);
  resultado = parseFloat(resultado);
  return resultado;
}

function productoPrecision2PROPENSOAFALLO(n1, n2){
  let primerValor = n1.toString();
  let segundoValor = n2.toString();
  if(primerValor.includes("e") || segundoValor.includes("e")){
    return productoPrecision2Old(n1, n2);
  }
  let decimales1 = contarDesdeOcurrenciaDeCaracter(primerValor, ".");
  let decimales2 = contarDesdeOcurrenciaDeCaracter(segundoValor, ".");
  let multiplicacion;
  let suma = decimales1 + decimales2;
  if(primerValor[0] == "0") suma++;
  if(segundoValor[0] == "0") suma++;
  primerValor = eliminarTodasLasOcurrenciasDeUnCaracter(primerValor, ".");
  segundoValor = eliminarTodasLasOcurrenciasDeUnCaracter(segundoValor, ".");
  primerValor = parseInt(primerValor);
  segundoValor = parseInt(segundoValor);
  multiplicacion = primerValor * segundoValor;
  multiplicacion = multiplicacion.toString();
  debugger;
  if(suma > 0 && (multiplicacion.length - suma >= 1)){
    multiplicacion = insertarCaracterEnIndice(multiplicacion, multiplicacion.length - suma, ".");
    multiplicacion = parseFloat(multiplicacion);
  }
  if(suma > 0 && (multiplicacion.length - suma <= 0)){
    while((multiplicacion.length - suma <= 0)){
      if(multiplicacion.length - suma == 0){
        multiplicacion = "0." + multiplicacion;
        break;
      }
      else multiplicacion = "0" + multiplicacion;
    }
  }
  if(suma == 0){
    parseFloat(multiplicacion);
  }
  // if(suma > 0 && !(multiplicacion.toString()).includes(".")){
  //   return productoPrecision2Old(n1, n2);
  // }
  console.log(multiplicacion);
  let resultado = truncarDecimales(multiplicacion, 2);
  resultado = parseFloat(resultado);
  return resultado;
}



function subcadenaDesdeIndice(cadena, indice){
  let resultado = "";
  for(let i = indice; i <= cadena.length - 1; i++){
    resultado += cadena[i];
  }
  return resultado;
}

function subcadenaAntesDeIndice(cadena, indice){
  let resultado = "";
  for(let i = 0; i <= cadena.length - 1; i++){
    if(i < indice){
      resultado += cadena[i];
    }
    if(i == indice) break;
  }
  return resultado;
}

function insertarCaracterEnIndiceReversa(cadena, contador, caracter){
  let resultado;
  for(let i = cadena.length - 1; i >= 0; i--){
    if(contador > 0){
      contador--;
      continue;
    }
    if(contador == 0){
      resultado = subcadenaAntesDeIndice(cadena, i - 1) + caracter + subcadenaDesdeIndice(cadena, i + 1);
      break;
    }
  }
  return resultado;
}

function divisionPrecision2(n1, n2){
  let proceso = n1 / n2;
  let resultado = truncarDecimales(proceso, 2);
  resultado = parseFloat(resultado);
  return resultado;
}

function verSiEsNumeroEntero(cadena){ //RETORNA 0 SI ES SOLO NUMERO, DE LO CONTRARIO RETORNA 1
  let verificador = false;
  if(cadena == ""){
      return 1;
  }
  for(let k = cadena.length - 1; k >= 0; k--){
      if(cadena[k] === "0" 
      || cadena[k] === "1"
      || cadena[k] === "2"
      || cadena[k] === "3"
      || cadena[k] === "4"
      || cadena[k] === "5"
      || cadena[k] === "6"
      || cadena[k] === "7"
      || cadena[k] === "8"
      || cadena[k] === "9"){verificador = true;}
      else{return 1;}
      if(k == 0 && verificador == true){
          return 0;
      }
    }
}
                     // (ARGS EN FORMATO MONTOS)
                     // res1 - res2
function restaDecimal(res1, res2){
  let resultado;
  let num1 = eliminarTodasLasOcurrenciasDeUnCaracter(res1, ",");
  let num2 = eliminarTodasLasOcurrenciasDeUnCaracter(res2, ",");
  num1 = eliminarTodasLasOcurrenciasDeUnCaracter(num1, ".");
  num2 = eliminarTodasLasOcurrenciasDeUnCaracter(num2, ".");
  num1 = parseInt(num1);
  num2 = parseInt(num2);
  resultado = num1 - num2;
  resultado = resultado / 100;
  return resultado;
}

                     // sum1 - sum2
function sumaDecimal(sum1, sum2){
  let resultado;
  let num1 = eliminarTodasLasOcurrenciasDeUnCaracter(sum1, ",");
  let num2 = eliminarTodasLasOcurrenciasDeUnCaracter(sum2, ",");
  num1 = eliminarTodasLasOcurrenciasDeUnCaracter(num1, ".");
  num2 = eliminarTodasLasOcurrenciasDeUnCaracter(num2, ".");
  num1 = parseInt(num1);
  num2 = parseInt(num2);
  resultado = num1 + num2;
  resultado = resultado / 100;
  return resultado;
}

function productoDecimal(pr1, pr2){
  let resultado;
  resultado = Math.round(pr1 * 100 * pr2) / 100;
  return resultado;
}

function copiadorDePropiedades(origen, destino){
  for(let [nombre, valor] of Object.entries(origen)){
    destino[nombre] = valor;
  }
  return destino;
}

function formatoMontosAnumber(cadena){
  let resultado = extraerNumerosPuntosComasBarrasGuionesDeUnaCadena(cadena);
  resultado = eliminarTodasLasOcurrenciasDeUnCaracter(resultado, ".");
  resultado = reemplazarCaracteres(resultado, ",", ".");
  resultado = parseFloat(resultado);
  return resultado;
}

function numberAformatoMontos(cadena){
  if(typeof(cadena) === "number") cadena = cadena.toString();
  let resultado = truncarDecimales(cadena, 2);
  resultado = reemplazarCaracteres(resultado, ".", ",");
  if(!resultado.includes(",")) resultado += ",00";
  resultado = formatearCadenaNumerosMilesYDecimales(resultado);
  return resultado;
}

function extraerDiaDelMes(){
    let fecha;
    fecha = Date(serverTimestamp.seconds * 1000);
    let fechaProcesada = fecha[8] + fecha[9];
    return parseInt(fechaProcesada);
}

function fechaDeHoy(){
    let fechaDePago = Date(serverTimestamp.seconds * 1000);
    let fechaProcesada = fechaDePago.slice(8, 10) + "/";
    if(fechaDePago.slice(4, 7) == "Jan"){
      fechaProcesada += "01/";
    }
    if(fechaDePago.slice(4, 7) == "Feb"){
      fechaProcesada += "02/";
    }
    if(fechaDePago.slice(4, 7) == "Mar"){
      fechaProcesada += "03/";
    }
    if(fechaDePago.slice(4, 7) == "Apr"){
      fechaProcesada += "04/";
    }
    if(fechaDePago.slice(4, 7) == "May"){
      fechaProcesada += "05/";
    }
    if(fechaDePago.slice(4, 7) == "Jun"){
      fechaProcesada += "06/";
    }
    if(fechaDePago.slice(4, 7) == "Jul"){
      fechaProcesada += "07/";
    }
    if(fechaDePago.slice(4, 7) == "Aug"){
      fechaProcesada += "08/";
    }
    if(fechaDePago.slice(4, 7) == "Sep"){
      fechaProcesada += "09/";
    }
    if(fechaDePago.slice(4, 7) == "Oct"){
      fechaProcesada += "10/";
    }
    if(fechaDePago.slice(4, 7) == "Nov"){
      fechaProcesada += "11/";
    }
    if(fechaDePago.slice(4, 7) == "Dec"){
      fechaProcesada += "12/";
    }
    fechaProcesada += fechaDePago.slice(11, 15);
    return fechaProcesada;
}

function fechaDeHoyFormatoJS(){
    let fechaDePago = Date(serverTimestamp.seconds * 1000);
    let fechaProcesada = "";
    fechaProcesada += fechaDePago.slice(11, 15) + "-";

    if(fechaDePago.slice(4, 7) == "Jan"){
      fechaProcesada += "01-";
    }
    if(fechaDePago.slice(4, 7) == "Feb"){
      fechaProcesada += "02-";
    }
    if(fechaDePago.slice(4, 7) == "Mar"){
      fechaProcesada += "03-";
    }
    if(fechaDePago.slice(4, 7) == "Apr"){
      fechaProcesada += "04-";
    }
    if(fechaDePago.slice(4, 7) == "May"){
      fechaProcesada += "05-";
    }
    if(fechaDePago.slice(4, 7) == "Jun"){
      fechaProcesada += "06-";
    }
    if(fechaDePago.slice(4, 7) == "Jul"){
      fechaProcesada += "07-";
    }
    if(fechaDePago.slice(4, 7) == "Aug"){
      fechaProcesada += "08-";
    }
    if(fechaDePago.slice(4, 7) == "Sep"){
      fechaProcesada += "09-";
    }
    if(fechaDePago.slice(4, 7) == "Oct"){
      fechaProcesada += "10-";
    }
    if(fechaDePago.slice(4, 7) == "Nov"){
      fechaProcesada += "11-";
    }
    if(fechaDePago.slice(4, 7) == "Dec"){
      fechaProcesada += "12-";
    }

    fechaProcesada += fechaDePago.slice(8, 10);
    return fechaProcesada;
}

function truncarDecimales(cadena, numero){
    let resultado = "";
    let senalPunto = 0;
    let contadorPunto = 0; 
    if((typeof cadena) != "string"){
        cadena = cadena.toString();
    }
    for(let i = 0; i <= cadena.length - 1; i++){
        resultado += cadena[i];
        if(cadena[i] == "."){
            senalPunto = true;
            contadorPunto++;
            continue;
        }
        if(contadorPunto == numero) break;
        if(contadorPunto > 0 && contadorPunto <= numero){
            contadorPunto++;
        }
    }
    return resultado;
}

function extraerMesEscolar(){ //DA EL MES EN CURSO PARA EL SELECT
  let fecha;
  fecha = Date(serverTimestamp.seconds * 1000);
  let fechaProcesada = fecha.slice(8, 10) + "/";
  if(fecha.slice(4, 7) == "Jan"){
    fechaProcesada = 5;
  }
  if(fecha.slice(4, 7) == "Feb"){
    fechaProcesada = 6;
  }
  if(fecha.slice(4, 7) == "Mar"){
    fechaProcesada = 7;
  }
  if(fecha.slice(4, 7) == "Apr"){
    fechaProcesada = 8;
  }
  if(fecha.slice(4, 7) == "May"){
    fechaProcesada = 9;
  }
  if(fecha.slice(4, 7) == "Jun"){
    fechaProcesada = 10;
  }
  if(fecha.slice(4, 7) == "Jul"){
    fechaProcesada = 11;
  }
  if(fecha.slice(4, 7) == "Aug"){
    fechaProcesada = 12;
  }
  if(fecha.slice(4, 7) == "Sep"){
    fechaProcesada = 1;
  }
  if(fecha.slice(4, 7) == "Oct"){
    fechaProcesada = 2;
  }
  if(fecha.slice(4, 7) == "Nov"){
    fechaProcesada = 3;
  }
  if(fecha.slice(4, 7) == "Dec"){
    fechaProcesada = 4;
  }
  return fechaProcesada;
}

function eliminadorDeMetodos(objeto){
  let resultado = {};
  for(let [nombre, valor] of Object.entries(objeto)){
    resultado[nombre] = valor;
  }
  return resultado;
}

function determinarSiTieneAbonos(representante){

  for(let propiedad in representante){

    console.log(propiedad + ": " + representante[propiedad]);

  }

}

function reemplazarCaracteres(cadena, caracter, reemplazar){ //ESTA FUNCION REEMPLAZA TODAS LAS OCURRENCIAS DE UN CARACTER POR EL QUE LE INDIQUES
  let resultado = "";
  for(let i = 0; i <= cadena.length - 1; i++){
    if(cadena[i] === caracter){
      resultado += reemplazar;
      continue;
    }
    resultado += cadena[i];
  }
  return resultado;
}

function esUnaLetra(caracter){

  if(caracter == "a" || caracter == "á" || caracter == "A" || caracter == "Á") return true;
  if(caracter == "b" || caracter == "B") return true; 
  if(caracter == "c" || caracter == "C") return true; 
  if(caracter == "d" || caracter == "D") return true;  
  if(caracter == "e" || caracter == "é" || caracter == "É" || caracter == "E") return true; 
  if(caracter == "f" || caracter == "F") return true; 
  if(caracter == "g" || caracter == "G") return true; 
  if(caracter == "h" || caracter == "H") return true; 
  if(caracter == "i" || caracter == "í" || caracter == "Í" || caracter == "I") return true; 
  if(caracter == "j" || caracter == "J") return true; 
  if(caracter == "k" || caracter == "K") return true; 
  if(caracter == "l" || caracter == "L") return true; 
  if(caracter == "m" || caracter == "M") return true; 
  if(caracter == "n" || caracter == "N") return true; 
  if(caracter == "ñ" || caracter == "Ñ") return true; 
  if(caracter == "o" || caracter == "ó" || caracter == "Ó" || caracter == "O") return true; 
  if(caracter == "p" || caracter == "P") return true; 
  if(caracter == "q" || caracter == "Q") return true; 
  if(caracter == "r" || caracter == "R") return true;
  if(caracter == "s" || caracter == "S") return true;
  if(caracter == "t" || caracter == "T") return true;
  if(caracter == "u" || caracter == "ú" || caracter == "Ú" || caracter == "U") return true;
  if(caracter == "v" || caracter == "V") return true;
  if(caracter == "w" || caracter == "W") return true;
  if(caracter == "x" || caracter == "X") return true;
  if(caracter == "y" || caracter == "Y") return true;
  if(caracter == "z" || caracter == "Z") return true;
  return false;

}

function esUnCaracterEspecial(caracter){
  if(caracter == "*") return true;
  if(caracter == "/") return true;   
  if(caracter == "+") return true;   
  if(caracter == "-") return true;            
  if(caracter == "!") return true;   
  if(caracter == "\"") return true;   
  if(caracter == "#") return true;   
  if(caracter == "@") return true;   
  if(caracter == "$") return true;   
  if(caracter == "%") return true;   
  if(caracter == "&") return true;   
  if(caracter == "/") return true;   
  if(caracter == "(") return true;   
  if(caracter == ")") return true;   
  if(caracter == "=") return true;
  if(caracter == "?") return true;
  if(caracter == "¿") return true;
  if(caracter == "¡") return true;
  if(caracter == "{") return true;
  if(caracter == "}") return true;
  if(caracter == ";") return true;
  if(caracter == "[") return true;
  if(caracter == "]") return true;
  if(caracter == "'") return true;  
  if(caracter == ",") return true;
  if(caracter == ".") return true;
  return false;     

}

function verSiEsUnaLetraOCaracterEspecial(caracter){
  if(caracter == "a" || caracter == "A") return true;
  if(caracter == "b" || caracter == "B") return true; 
  if(caracter == "c" || caracter == "C") return true; 
  if(caracter == "d" || caracter == "D") return true;  
  if(caracter == "e" || caracter == "E") return true; 
  if(caracter == "f" || caracter == "F") return true; 
  if(caracter == "g" || caracter == "G") return true; 
  if(caracter == "h" || caracter == "H") return true; 
  if(caracter == "i" || caracter == "I") return true; 
  if(caracter == "j" || caracter == "J") return true; 
  if(caracter == "k" || caracter == "K") return true; 
  if(caracter == "l" || caracter == "L") return true; 
  if(caracter == "m" || caracter == "M") return true; 
  if(caracter == "n" || caracter == "N") return true; 
  if(caracter == "ñ" || caracter == "Ñ") return true; 
  if(caracter == "o" || caracter == "O") return true; 
  if(caracter == "p" || caracter == "P") return true; 
  if(caracter == "q" || caracter == "Q") return true; 
  if(caracter == "r" || caracter == "R") return true;
  if(caracter == "s" || caracter == "S") return true;
  if(caracter == "t" || caracter == "T") return true;
  if(caracter == "u" || caracter == "U") return true;
  if(caracter == "v" || caracter == "V") return true;
  if(caracter == "w" || caracter == "W") return true;
  if(caracter == "x" || caracter == "X") return true;
  if(caracter == "y" || caracter == "Y") return true;
  if(caracter == "z" || caracter == "Z") return true;
  if(caracter == "*") return true;
  if(caracter == "/") return true;   
  if(caracter == "+") return true;   
  if(caracter == "-") return true;            
  if(caracter == "!") return true;   
  if(caracter == "\"") return true;   
  if(caracter == "#") return true;   
  if(caracter == "@") return true;   
  if(caracter == "$") return true;   
  if(caracter == "%") return true;   
  if(caracter == "&") return true;   
  if(caracter == "/") return true;   
  if(caracter == "(") return true;   
  if(caracter == ")") return true;   
  if(caracter == "=") return true;
  if(caracter == "?") return true;
  if(caracter == "¿") return true;
  if(caracter == "¡") return true;
  if(caracter == "{") return true;
  if(caracter == "}") return true;
  if(caracter == ";") return true;
  if(caracter == "[") return true;
  if(caracter == "]") return true; 
  return false;   
}

function extraerLetrasDeUnaCadena(cadena){
  let resultado = "";
  for(let i = 0; i <= cadena.length - 1; i++){
    if(cadena[i] === "a" || cadena[i] === "A") resultado += cadena[i];
    if(cadena[i] === "b" || cadena[i] === "B") resultado += cadena[i];
    if(cadena[i] === "c" || cadena[i] === "C") resultado += cadena[i];
    if(cadena[i] === "d" || cadena[i] === "D") resultado += cadena[i];
    if(cadena[i] === "e" || cadena[i] === "E") resultado += cadena[i];
    if(cadena[i] === "f" || cadena[i] === "F") resultado += cadena[i];
    if(cadena[i] === "g" || cadena[i] === "G") resultado += cadena[i];
    if(cadena[i] === "h" || cadena[i] === "H") resultado += cadena[i];
    if(cadena[i] === "i" || cadena[i] === "I") resultado += cadena[i];
    if(cadena[i] === "j" || cadena[i] === "J") resultado += cadena[i];
    if(cadena[i] === "k" || cadena[i] === "K") resultado += cadena[i];
    if(cadena[i] === "l" || cadena[i] === "L") resultado += cadena[i];
    if(cadena[i] === "m" || cadena[i] === "M") resultado += cadena[i];
    if(cadena[i] === "n" || cadena[i] === "N") resultado += cadena[i];
    if(cadena[i] === "ñ" || cadena[i] === "Ñ") resultado += cadena[i];
    if(cadena[i] === "o" || cadena[i] === "O") resultado += cadena[i];
    if(cadena[i] === "p" || cadena[i] === "P") resultado += cadena[i];
    if(cadena[i] === "q" || cadena[i] === "Q") resultado += cadena[i];
    if(cadena[i] === "r" || cadena[i] === "R") resultado += cadena[i];
    if(cadena[i] === "s" || cadena[i] === "S") resultado += cadena[i];
    if(cadena[i] === "t" || cadena[i] === "T") resultado += cadena[i];
    if(cadena[i] === "u" || cadena[i] === "U") resultado += cadena[i];
    if(cadena[i] === "v" || cadena[i] === "V") resultado += cadena[i];
    if(cadena[i] === "w" || cadena[i] === "W") resultado += cadena[i];
    if(cadena[i] === "x" || cadena[i] === "X") resultado += cadena[i];
    if(cadena[i] === "y" || cadena[i] === "Y") resultado += cadena[i];
    if(cadena[i] === "z" || cadena[i] === "Z") resultado += cadena[i];
    if(cadena[i] === "á" || cadena[i] === "Á") resultado += cadena[i];
    if(cadena[i] === "é" || cadena[i] === "É") resultado += cadena[i];
    if(cadena[i] === "í" || cadena[i] === "Í") resultado += cadena[i];
    if(cadena[i] === "ó" || cadena[i] === "Ó") resultado += cadena[i];
    if(cadena[i] === "ú" || cadena[i] === "Ú") resultado += cadena[i];
    if(cadena[i] === " ") resultado += cadena[i];
  }
  return resultado;
}

function eliminarCaracterEnIndice(cadena, indice){
  let resultado = "";
  for(let i = 0; i <= cadena.length - 1; i++){
      if(i == indice){continue;}
      resultado += cadena[i];
  }
  return resultado;
}

function eliminarTodasLasOcurrenciasDeUnCaracter(cadena, caracter){
  let resultado = "";
  for(let i = 0; i <= cadena.length - 1; i++){
    if(caracter === cadena[i]){
      continue;
    }
    resultado += cadena[i];
  }
  return resultado;
}

function insertarCaracterEnIndice(cadena, indice, valorParaInsertar){
  let resultado = "";
  for(let i = 0; i <= cadena.length - 1; i++){
      if(i == indice){
          resultado += valorParaInsertar;
          resultado += cadena[i];
          continue;
      }
      resultado += cadena[i];
  }
  return resultado;
}

function extraerNumerosPuntosComasDeUnaCadena(cadena){
  let resultado = "";
  for(let i = 0; i <= cadena.length - 1; i++){
    if(cadena[i] === "0") resultado += cadena[i];
    if(cadena[i] === "1") resultado += cadena[i];
    if(cadena[i] === "2") resultado += cadena[i];
    if(cadena[i] === "3") resultado += cadena[i];
    if(cadena[i] === "4") resultado += cadena[i];
    if(cadena[i] === "5") resultado += cadena[i];
    if(cadena[i] === "6") resultado += cadena[i];
    if(cadena[i] === "7") resultado += cadena[i];
    if(cadena[i] === "8") resultado += cadena[i];
    if(cadena[i] === "9") resultado += cadena[i];
    if(cadena[i] === ",") resultado += cadena[i];
    if(cadena[i] === ".") resultado += cadena[i];
  }
  return resultado;
}

function subcadenaDesdeOcurrenciaDeCaracter(cadena, caracter){
  let resultado = "";
  let marcador = false;
  for(let i = 0; i <= cadena.length - 1; i++){
      if((cadena[i] == caracter) || (marcador == true)){
          resultado += cadena[i];
          marcador = true;
          continue;
      }
      else continue;
  }
  return resultado;
}

function formatearCadenaNumerosMilesYDecimales(cadena){
  let prueba = subcadenaDesdeOcurrenciaDeCaracter(cadena, ",");
  if(prueba.length == 2) cadena += "0";
  if(cadena.length < 7) return cadena;
  let resultado = "";
  let contadorPunto = 0;
  let valorParada = 3;
  for(let i = cadena.length - 1; i >= 0; i--){
    if(i >= cadena.length - 3){
      if(resultado.length == 0){
        resultado += cadena[i];
        continue;
      }
      else{
        resultado = insertarCaracterEnIndice(resultado, 0, cadena[i]);
        continue;    
      }
    }
    if(contadorPunto == valorParada){
      resultado = insertarCaracterEnIndice(resultado, 0, ".");
      resultado = insertarCaracterEnIndice(resultado, 0, cadena[i]);
      contadorPunto = 0;
      valorParada = 2;
      continue;
    }
    resultado = insertarCaracterEnIndice(resultado, 0, cadena[i]);
    contadorPunto++;
  }
  return resultado;
}

function validacionMontoEstiloBDV(){
  let valor = this.value;
  if(verSiEsUnaLetraOCaracterEspecial(valor[valor.length - 1])) valor = eliminarCaracterEnIndice(valor, valor.length - 1);
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ".");
  if(valor.length == 0){
      this.value = "0,00";
      return 0;
  }
  if(valor.length == 1){
      this.value = "0,0" + valor;
  }
  if((valor[0] === ".")){
      this.value = "0" + valor;
      return 0;
  }
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  if(valor[0] === "," && valor.length == 3) valor = "0" + valor;
  if(valor[0] === "0" && valor[1] != "," && valor.length > 1) valor = eliminarCaracterEnIndice(valor, 0);
  this.value = valor;
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  this.value = extraerNumerosPuntosComasDeUnaCadena(valor);
  this.value = formatearCadenaNumerosMilesYDecimales(valor);
};

function extraerNumerosPuntosComasBarrasGuionesDeUnaCadena(cadena){
  let resultado = "";
  for(let i = 0; i <= cadena.length - 1; i++){
      if(cadena[i] === "0") resultado += cadena[i];
      if(cadena[i] === "1") resultado += cadena[i];
      if(cadena[i] === "2") resultado += cadena[i];
      if(cadena[i] === "3") resultado += cadena[i];
      if(cadena[i] === "4") resultado += cadena[i];
      if(cadena[i] === "5") resultado += cadena[i];
      if(cadena[i] === "6") resultado += cadena[i];
      if(cadena[i] === "7") resultado += cadena[i];
      if(cadena[i] === "8") resultado += cadena[i];
      if(cadena[i] === "9") resultado += cadena[i];
      if(cadena[i] === ",") resultado += cadena[i];
      if(cadena[i] === ".") resultado += cadena[i];
      if(cadena[i] === "-") resultado += cadena[i];
      if(cadena[i] === "/") resultado += cadena[i];
    }
  return resultado;
}

function cambiarAFechaVenezolana(cadena){
  let anno = cadena.substring(0, 4);
  let mes = cadena.substring(5, 7);
  let dia = cadena.substring(8);
  let resultado = dia + "/" + mes + "/" + anno;
  return resultado;
}

function convertirAfechaHTML(cadena){
  let resultado;
  let anno = cadena.substring(6, 10);
  let mes = cadena.substring(3, 5);
  let dia = cadena.substring(0, 2);
  resultado = anno + "-" + mes + "-" + dia;

  // DD/MM/AAAA -> AAAA-MM-DD

  return resultado;
}

function eliminarOcurrenciasElementoArray(array, elemento){
  let resultado = [];
  for(let i = 0; i <= array.length - 1; i++){
    if(elemento === array[i]){
      continue;
    }
    resultado.push(array[i]);
  }
  return resultado;
}