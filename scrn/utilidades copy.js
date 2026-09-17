import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
export{extraerDiaDelMes,
       fechaDeHoy,
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
       determinarProntoPago
};

function subcadenaDesdeIndice(cadena, indice){
  let resultado = "";
  for(let i = indice; i <= cadena.length - 1; i++){
    resultado += cadena[i];
  }
  return resultado;
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

function determinarNumeroMes(mes){
  let nombresMeses = [
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
    let numeroMes = 0;

    for(let i = 0; i <= nombresMeses.length - 1; i++){
      if(mes.includes(nombresMeses[i])){
        numeroMes = i + 1;
        return numeroMes;
      }
    }

}

function determinarProntoPago(mesEnCuestion){
  let mesActual = extraerMesEscolar();
  let numeroMesEnCuestion = determinarNumeroMes(mesEnCuestion);
  let diaActual = extraerDiaDelMes();
  if(mesActual < numeroMesEnCuestion) return true;
  else if((mesActual == numeroMesEnCuestion) && diaActual <= 5) return true;
  return false;
}

function productoPrecision2(n1, n2){
  let proceso = n1 * n2;
  let resultado = truncarDecimales(proceso, 2);
  resultado = parseFloat(resultado);
  return resultado;
}

function divisionPrecision2(n1, n2){
  let proceso = n1 / n2;
  let resultado = truncarDecimales(proceso, 2);
  resultado = parseFloat(resultado);
  return resultado;
}

function verSiEsNumeroEntero(cadena){
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