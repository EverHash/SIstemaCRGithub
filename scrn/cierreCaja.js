/*global document, console */

import { ocultarPantallaCarga, mostrarPantallaError, obtenerDatosPagoIndividual, mostrarPantallaCarga } from "./modal.js";
import { Base, query, collection, getDocs, where } from "./firebase.js";
import { extraerHorayFechaFirestore, extraerFechaFirestore, truncarDecimales, extraerLetrasDeUnaCadena, reemplazarCaracteres, divisionPrecision2, formatoMontosAnumber, numberAformatoMontos, sumaDecimal, fechaDeHoy } from "./utilidades.js";
import { establecerModoVerificarPago, establecerNumeroDePago, numeroPago } from "./verificarPago.js";
import { sumarMetodosBS, sumarMetodosBSConConversion, sumarMetodosUSD } from "./controlesCierreCaja.js";
import { crearCeldaConTexto, crearTRconCeldasApendadas } from "./utilidadesTablas.js";

export {calcularCierre, colocarIconoPalomitaCierre};

function colocarIconoPalomitaCierre(){
  let tablaListaPagos = document.getElementById("tablaListaPagosCierre");
  for(let i = 1; i <= tablaListaPagos.rows.length - 1; i++){
    if(tablaListaPagos.rows[i].cells.length == 8){
      if(tablaListaPagos.rows[i].cells[6].textContent == numeroPago){
        tablaListaPagos.rows[i].cells[7].children[0].src = "rsrcs/checked.png";
      }
    }
  }
}

function insertarTodosLosElementosAotroArray(destino, origen){
  for(let i = 0; i <= origen.length -1; i++){
    destino.push(origen[i]);
  }
  return destino;
}

function formularioInvalido(){
  document.getElementById("containerTablasCierre").style.display = "none";
  
  if(document.getElementById("SeleccionarDia").selectedIndex == 0){
    mostrarPantallaError("Seleccione el día");
    return 1;
  }
  if(document.getElementById("SeleccionarMes").selectedIndex == 0){
    mostrarPantallaError("Seleccione el mes");
    return 1;
  }
  if(document.getElementById("SeleccionarAnno").value == ""){
    mostrarPantallaError("Seleccione el año");
    return 1;
  }
}

function limpiarTabla(){

  // if(document.getElementById("tablaListaPagosCierre").children.length > 0)   document.getElementById("tablaListaPagosCierre").children[0].remove();

  // let tablaListaPagos = document.getElementById("tablaListaPagosCierre");
  // tablaListaPagos.remove();
  // let tablaBodyListaPagos = document.createElement("tbody");

  // let fila = document.createElement("tr");
  // let col1 = document.createElement("th");
  // let col2, col3, col4, col5, col6, col7, col8;

  // fila = document.createElement("tr");
  // col1 = document.createElement("th");
  // col2 = document.createElement("th");
  // col3 = document.createElement("th");
  // col4 = document.createElement("th");
  // col5 = document.createElement("th");
  // col6 = document.createElement("th");
  // col7 = document.createElement("th");
  // col8 = document.createElement("th");
  // col1.textContent = "Nombre del Representante";
  // col2.textContent = "Cédula de Identidad";
  // col3.textContent = "Estudiante(s) / Contenedor Abono";
  // col4.textContent = "Concepto de Pago";
  // col5.textContent = "Detalles de Pago";
  // col6.textContent = "Tipo de Pago";
  // col7.textContent = "Número de Recibo";
  // col8.textContent = "Verificación";
  // fila.appendChild(col1);
  // fila.appendChild(col2);
  // fila.appendChild(col3);
  // fila.appendChild(col4);
  // fila.appendChild(col6);
  // fila.appendChild(col5);
  // fila.appendChild(col7);
  // fila.appendChild(col8);
  // tablaBodyListaPagos.appendChild(fila);
  // tablaListaPagos.appendChild(tablaBodyListaPagos);
  // document.getElementById("containerTablasCierre").appendChild(tablaListaPagos);

    let tablaBodyListaPagos = document.getElementById("tablaListaPagosCierre");

    if(tablaBodyListaPagos.rows.length > 1){
      for(let i = tablaBodyListaPagos.rows.length - 1; i >= 1; i--){
        tablaBodyListaPagos.removeChild(tablaBodyListaPagos.lastChild);
      }   
    }
}

function escribirPagoVer5(documento){

  console.log(documento);

  let tablaBodyListaPagos = document.getElementById("tablaListaPagosCierre");

  let numeroConceptos = 1;

  while(true){

    if(documento.hasOwnProperty("concepto" + (numeroConceptos + 1))){

      numeroConceptos++;
      continue;

    }
    else break;
  }

  let col1 = crearCeldaConTexto(documento.nombreRepresentante);
  let col2 = crearCeldaConTexto(documento.cedulaRepresentante);
  let col5 = crearCeldaConTexto(documento.tipoDePago);

  //ESTA COLUMNA SE CREA APARTE PRO EL SIMPLE HECHO DE NO ESCRIBIR UNA FUNCION
  //PARA METER UNA IMAGEN DENTRO DE UN TD, DIOS MIO SEÑOR

  let col6 = document.createElement("td");
  let imgOjo = document.createElement("img");
  imgOjo.src = "rsrcs/eye.png";
  imgOjo.style.width = "25px";
  imgOjo.style.height = "25px";
  imgOjo.addEventListener("click", verDetallesPago);
  col6.appendChild(imgOjo);

  //CONTINUA EL PROCESO EN 7

  let col7 = crearCeldaConTexto(documento.IdPago);

  //HACEMOS LO MISMO CON LA 8 PARA METER UNA IMAGEN 

  let col8 = document.createElement("td");
  let imgVerif = document.createElement("img");
  imgVerif.src = "rsrcs/checked.png";
  imgVerif.style.width = "25px";
  imgVerif.style.height = "25px";
  col8.appendChild(imgVerif);

  //SE PONEN LOS ROWSPAN

  col1.rowSpan = numeroConceptos;
  col2.rowSpan = numeroConceptos;
  col5.rowSpan = numeroConceptos;
  col6.rowSpan = numeroConceptos;
  col7.rowSpan = numeroConceptos;
  col8.rowSpan = numeroConceptos;
  
    let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // MONTO USD
      ""  // MONTO BS
    ];

    //HABIENDO HECHO TODO ESTE PROCESO, SE INTRODUCEN AHORA LOS DATOS DEL PRIMER ESTUDIANTE

    let col3 = crearCeldaConTexto(documento["concepto1"][0]);
    let col4 = crearCeldaConTexto(documento["concepto1"][1]);

    //AHORA, SE PROCEDE A CREAR EL ARRAY PARA INTRODUCIR TODO A LA TABLA

    let arrayFila = [];

    arrayFila.push(col1);
    arrayFila.push(col2);
    arrayFila.push(col3);
    arrayFila.push(col4);
    arrayFila.push(col5);
    arrayFila.push(col6);
    arrayFila.push(col7);
    arrayFila.push(col8);

    tablaBodyListaPagos.appendChild(crearTRconCeldasApendadas(arrayFila));

    //A PARTIR DE ESTE PUNTO, ES UN BUCLE PARA PONER LOS OTROS ESTUDIANTES

    if(numeroConceptos >= 2){

      for(let n = 2; n <= numeroConceptos; n++){

        col3 = crearCeldaConTexto(documento["concepto" + n][0]);
        col4 = crearCeldaConTexto(documento["concepto" + n][1]);

        arrayFila = [];
        arrayFila.push(col3);
        arrayFila.push(col4);

        tablaBodyListaPagos.appendChild(crearTRconCeldasApendadas(arrayFila));

      }

    }

}

function escribirPagoEdicionMensualidad(documento){
  console.log(documento);

  let tablaBodyListaPagos = document.getElementById("tablaListaPagosCierre");

  let numeroConceptos = 1;

  while(true){

    if(documento.hasOwnProperty("concepto" + (numeroConceptos + 1))){

      numeroConceptos++;
      continue;

    }
    else break;
  }

  let col1 = crearCeldaConTexto(documento.nombreRepresentante);
  let col2 = crearCeldaConTexto(documento.cedulaRepresentante);
  let col5 = crearCeldaConTexto(documento.tipoDePago);

  //ESTA COLUMNA SE CREA APARTE PRO EL SIMPLE HECHO DE NO ESCRIBIR UNA FUNCION
  //PARA METER UNA IMAGEN DENTRO DE UN TD, DIOS MIO SEÑOR

  let col6 = document.createElement("td");
  let imgOjo = document.createElement("img");
  imgOjo.src = "rsrcs/grayEye.png";
  imgOjo.style.width = "25px";
  imgOjo.style.height = "25px";
  col6.appendChild(imgOjo);

  //CONTINUA EL PROCESO EN 7

  let col7 = crearCeldaConTexto(documento.IdPago);

  //HACEMOS LO MISMO CON LA 8 PARA METER UNA IMAGEN 

  let col8 = document.createElement("td");
  let imgVerif = document.createElement("img");
  imgVerif.src = "rsrcs/checked.png";
  imgVerif.style.width = "25px";
  imgVerif.style.height = "25px";
  col8.appendChild(imgVerif);

  //SE PONEN LOS ROWSPAN

  col1.rowSpan = numeroConceptos;
  col2.rowSpan = numeroConceptos;
  col5.rowSpan = numeroConceptos;
  col6.rowSpan = numeroConceptos;
  col7.rowSpan = numeroConceptos;
  col8.rowSpan = numeroConceptos;
  
    let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // CAMBIO REALIZADO
    ];

    //HABIENDO HECHO TODO ESTE PROCESO, SE INTRODUCEN AHORA LOS DATOS DEL PRIMER ESTUDIANTE

    let col3 = crearCeldaConTexto(documento["concepto1"][0]);
    let col4 = crearCeldaConTexto(documento["concepto1"][1]);

    //AHORA, SE PROCEDE A CREAR EL ARRAY PARA INTRODUCIR TODO A LA TABLA

    let arrayFila = [];

    arrayFila.push(col1);
    arrayFila.push(col2);
    arrayFila.push(col3);
    arrayFila.push(col4);
    arrayFila.push(col5);
    arrayFila.push(col6);
    arrayFila.push(col7);
    arrayFila.push(col8);

    tablaBodyListaPagos.appendChild(crearTRconCeldasApendadas(arrayFila));

    //A PARTIR DE ESTE PUNTO, ES UN BUCLE PARA PONER LOS OTROS ESTUDIANTES

    if(numeroConceptos >= 2){

      for(let n = 2; n <= numeroConceptos; n++){

        col3 = crearCeldaConTexto(documento["concepto" + n][0]);
        col4 = crearCeldaConTexto(documento["concepto" + n][1]);

        arrayFila = [];
        arrayFila.push(col3);
        arrayFila.push(col4);

        tablaBodyListaPagos.appendChild(crearTRconCeldasApendadas(arrayFila));

      }

    }

}

function escribirPago(documento){
  let tablaBodyListaPagos = document.getElementById("tablaListaPagosCierre");
  let numeroEstudiante = 1;
  let img;
  let imgVerificar;
  let fila = document.createElement("tr");
  let col1 = document.createElement("th");
  let col2, col3, col4, col5, col6, col7, col8;

  //DETERMINAR EL NUMERO DE PROPIEDADES DE ESTUDIANTE

  while(true){
    if(documento.hasOwnProperty("estudiante" + (numeroEstudiante + 1))){
      numeroEstudiante++;
      continue;
    }
    else{
      break;
    }
  }


  fila = document.createElement("tr");
  col1 = document.createElement("td");
  col2 = document.createElement("td");
  col3 = document.createElement("td");
  col4 = document.createElement("td");
  col5 = document.createElement("td");
  col6 = document.createElement("td");
  col7 = document.createElement("td");
  col8 = document.createElement("td");
  col1.rowSpan = numeroEstudiante;
  col2.rowSpan = numeroEstudiante;
  col5.rowSpan = numeroEstudiante;
  col6.rowSpan = numeroEstudiante;
  col7.rowSpan = numeroEstudiante;
  col8.rowSpan = numeroEstudiante;
  col1.textContent = documento.nombreRepresentante;
  col2.textContent = documento.cedulaRepresentante;
  col3.textContent = documento.estudiante1[0];
  col4.textContent = "";
  for(let i = 1; i <= documento.estudiante1.length - 1; i++){
    if(i == documento.estudiante1.length - 1){
      col4.textContent += extraerLetrasDeUnaCadena(documento.estudiante1[i]);
      break;
    }
    col4.textContent += extraerLetrasDeUnaCadena(documento.estudiante1[i]) + ", ";
  }
  img = document.createElement("img");
  img.src = "rsrcs/eye.png";
  img.style.width = "25px";
  img.style.height = "25px";
  img.addEventListener("click", verDetallesPago);
  imgVerificar = document.createElement("img");
  imgVerificar.style.height = "25px";
  imgVerificar.style.width = "25px";
  if(documento.flagVerificar == true){
    imgVerificar.src = "rsrcs/cross.png";
  }
  else imgVerificar.src = "rsrcs/checked.png";
  col5.appendChild(img);
  col6.textContent = documento.tipoDePago;        
  col7.textContent = documento.IdPago;
  col8.appendChild(imgVerificar);                              
  fila.appendChild(col1);
  fila.appendChild(col2);
  fila.appendChild(col3);
  fila.appendChild(col4);
  fila.appendChild(col6);
  fila.appendChild(col5);
  fila.appendChild(col7);
  fila.appendChild(col8);
  tablaBodyListaPagos.appendChild(fila);


  //AGREGAR DATOS DEL RECIBO EN CASO DE SER MAS DE UN PAGO DE ESTUDIANTE

  if(numeroEstudiante >= 2){
    for(let i = 2; i <= numeroEstudiante; i++){
      fila = document.createElement("tr");
      col3 = document.createElement("td");
      col4 = document.createElement("td");
      col3.textContent = documento["estudiante" + i][0]; 
      for(let k = 1; k <= documento["estudiante" + i].length; k++){
        if(k == documento["estudiante" + i].length - 1){
            col4.textContent += extraerLetrasDeUnaCadena(documento["estudiante" + i][k]);
            break;
          }
          col4.textContent += extraerLetrasDeUnaCadena(documento["estudiante" + i][k]) + ", ";
        }
      fila.appendChild(col3);
      fila.appendChild(col4);
      tablaBodyListaPagos.appendChild(fila);
    }
  }
}

function escribirPagoAbono(documento){
  let tablaBodyListaPagos = document.getElementById("tablaListaPagosCierre");
  let numeroAbono = 1;
  let img;
  let imgVerificar;
  let fila = document.createElement("tr");
  let col1 = document.createElement("th");
  let col2, col3, col4, col5, col6, col7, col8;

  //DETERMINAR EL NUMERO DE PROPIEDADES DE ESTUDIANTE

  while(true){
    if(documento.hasOwnProperty("abono" + (numeroAbono + 1))){
      numeroAbono++;
      continue;
    }
    else{
      break;
    }
  }


  fila = document.createElement("tr");
  col1 = document.createElement("td");
  col2 = document.createElement("td");
  col3 = document.createElement("td");
  col4 = document.createElement("td");
  col5 = document.createElement("td");
  col6 = document.createElement("td");
  col7 = document.createElement("td");
  col8 = document.createElement("td");
  col1.rowSpan = numeroAbono;
  col2.rowSpan = numeroAbono;
  col5.rowSpan = numeroAbono;
  col6.rowSpan = numeroAbono;
  col7.rowSpan = numeroAbono;
  col8.rowSpan = numeroAbono;
  col1.textContent = documento.nombreRepresentante;
  col2.textContent = documento.cedulaRepresentante;
  col3.textContent = documento.abono1[0];
  col4.textContent = "N/A";
  img = document.createElement("img");
  img.src = "rsrcs/eye.png";
  img.style.width = "25px";
  img.style.height = "25px";
  img.addEventListener("click", verDetallesPago);
  imgVerificar = document.createElement("img");
  imgVerificar.style.height = "25px";
  imgVerificar.style.width = "25px";
  if(documento.flagVerificar == true){
    imgVerificar.src = "rsrcs/cross.png";
  }
  else imgVerificar.src = "rsrcs/checked.png";
  col5.appendChild(img);
  col6.textContent = documento.tipoDePago;        
  col7.textContent = documento.IdPago;
  col8.appendChild(imgVerificar);                              
  fila.appendChild(col1);
  fila.appendChild(col2);
  fila.appendChild(col3);
  fila.appendChild(col4);
  fila.appendChild(col6);
  fila.appendChild(col5);
  fila.appendChild(col7);
  fila.appendChild(col8);
  tablaBodyListaPagos.appendChild(fila);


  //AGREGAR DATOS DEL RECIBO EN CASO DE SER MAS DE UN PAGO DE ESTUDIANTE

  if(numeroAbono >= 2){
    for(let i = 2; i <= numeroAbono; i++){
      fila = document.createElement("tr");
      col3 = document.createElement("td");
      col4 = document.createElement("td");
      col3.textContent = documento["abono" + i][0]; 
      col4.textContent = "N/A";
      fila.appendChild(col3);
      fila.appendChild(col4);
      tablaBodyListaPagos.appendChild(fila);
    }
  }
}

async function calcularCierreTodoElMes(){

}

async function calcularCierreDiaConcreto(){

}



async function calcularCierre(){
    try {
      
      if(formularioInvalido()){
        return;
      }

      mostrarPantallaCarga();
      limpiarTabla();
      let coleccionPagos = await collection(Base, "pagos/");
      let obtenerDocumentosDePago;
      let documentosDePago;
      let arrayDocumentoPagos = [];
      let fecha;
      let documento;
      let hayPagos = false;
      let anno = document.getElementById("SeleccionarAnno").value;
      let mes = document.getElementById("SeleccionarMes");
      let dia = document.getElementById("SeleccionarDia");
      let diaBucle;
      dia = dia.options[dia.selectedIndex].textContent;
      mes = mes.options[mes.selectedIndex].textContent;

      document.getElementById("fechaDeConsultaCierreCajaRecibos").textContent = "Fecha de Realización de Consulta: " + fechaDeHoy();

      let meses = ["Enero","Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", 
        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        

        //AUN EN DESUSO

      if(document.getElementById("cierreFechaActual").checked == true){
        fecha = extraerFechaFirestore();
        obtenerDocumentosDePago = await query(coleccionPagos, where("fecha", "==", fecha));
        documentosDePago = await getDocs(obtenerDocumentosDePago);
        documentosDePago.forEach((documento) => {
          arrayDocumentoPagos.push(documento.data());
        });   
      }




      else if(dia != "Todo el mes"){
        for(let i = 0; i <= meses.length - 1; i++){
          if(mes === meses[i]){
            if(i < 9) mes = "0" + (i + 1);
            else mes = i + 1;
            break;
          }
        }
        fecha = dia + "/" + mes + "/" + anno;
        document.getElementById("fechaConsultadaCierreCajaRecibos").textContent = "Fecha Consultada: " + fecha;
        obtenerDocumentosDePago = await query(coleccionPagos, where("fecha", "==", fecha));
        documentosDePago = await getDocs(obtenerDocumentosDePago);
        documentosDePago.forEach((documento) => {
          arrayDocumentoPagos.push(documento.data());
        });     
      }

      
      
      if(dia == "Todo el mes"){
        for(let i = 0; i <= meses.length - 1; i++){
          if(mes === meses[i]){
            if(i < 9) mes = "0" + (i + 1);
            else mes = i + 1;
            break;
          }
        }
        for(let i = 1; i <= 31; i++){
          diaBucle = i.toString();
          if(diaBucle.length == 1) diaBucle = "0" + diaBucle;
          fecha = diaBucle + "/" + mes + "/" + anno;
          obtenerDocumentosDePago = await query(coleccionPagos, where("fecha", "==", fecha));
          documentosDePago = await getDocs(obtenerDocumentosDePago);
          documentosDePago.forEach((documento) => {
            arrayDocumentoPagos.push(documento.data());
          });
        }
        document.getElementById("fechaConsultadaCierreCajaRecibos").textContent = "Fecha Consultada: " + "Todo el mes/" + mes + "/" + anno;
      }
      for(let j = 0; j <= arrayDocumentoPagos.length - 1; j++){
        documento = arrayDocumentoPagos[j];

        if(documento.tipoDePago == "Edición de Mensualidad"){

          escribirPagoEdicionMensualidad(documento);
          hayPagos = true;
        }
        else{
          if(documento.version == 5){
  
            escribirPagoVer5(documento);
  
          }
          if(documento.tipoDePago != "Abono" && documento.version != 5) escribirPago(documento);
          if(documento.tipoDePago == "Abono" && documento.version != 5) escribirPagoAbono(documento);
          hayPagos = true;
        }

      }
      if(!hayPagos){
        ocultarPantallaCarga();
        mostrarPantallaError("No hay recibos registrados para este día");
        return;
      }
      sumarMetodosBS(arrayDocumentoPagos);
      sumarMetodosUSD(arrayDocumentoPagos);
      sumarMetodosBSConConversion(arrayDocumentoPagos);
      document.getElementById("containerTablasCierre").style.display = "block";
      ocultarPantallaCarga();
    } catch (error) {
      console.log("ERROR AL CALCULAR EL CIERRE: ", error);
      ocultarPantallaCarga();
      mostrarPantallaError();
    }
  }

  function verDetallesPago(){
    establecerNumeroDePago(this.parentNode.parentNode.children[6].textContent);
    establecerModoVerificarPago("Cierre");
    obtenerDatosPagoIndividual();
  }