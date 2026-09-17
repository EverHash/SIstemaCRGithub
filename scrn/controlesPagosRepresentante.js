/*global document */

export {entrarPagosRepresentante, 
        atrasPagosRepresentante,
        dibujarTablaPagosRepresentante,
        colocarIconoPalomitaRepresentante,
        mostrarTablaPagosRepresentante,
        ocultarTablaPagosRepresentante,
        limpiarListaPagosRepresentantes,
        formularioInvalido,
        escribirPagoVer5
};

import {extraerLetrasDeUnaCadena, verSiEsNumeroEntero } from "./utilidades.js";
import { establecerNumeroDePago, establecerModoVerificarPago, numeroPago } from "./verificarPago.js";
import { mostrarPantallaError, obtenerDatosPagoIndividual } from "./modal.js";
import { crearCeldaConTexto, crearTRconCeldasApendadas } from "./utilidadesTablas.js";

function entrarPagosRepresentante(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("mainContainerPagosRepresentante").style.display = "block";
}

function atrasPagosRepresentante(){
    document.getElementById("mainContainerPagosRepresentante").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    limpiarListaPagosRepresentantes();
    ocultarTablaPagosRepresentante();
}

function mostrarTablaPagosRepresentante(){
  document.getElementById("containerTablaPagosRepresentante").style.display = "block";
}

function ocultarTablaPagosRepresentante(){
  document.getElementById("containerTablaPagosRepresentante").style.display = "none";
}

function colocarIconoPalomitaRepresentante(){
    let tablaListaPagos = document.getElementById("tablaListaPagosRepresentante");
    for(let i = 1; i <= tablaListaPagos.rows.length - 1; i++){
      if(tablaListaPagos.rows[i].cells.length == 9){
        if(tablaListaPagos.rows[i].cells[6].textContent == numeroPago){
          tablaListaPagos.rows[i].cells[7].children[0].src = "rsrcs/checked.png";
        }
      }
    }
  }

function limpiarListaPagosRepresentantes(){
  let tabla = document.getElementById("tablaListaPagosRepresentante");
  for(let j = tabla.rows.length - 1; j > 0; j--){
    tabla.removeChild(tabla.lastChild);
  }
}

export function escribirPagoExonerado(documento){

  let tablaBodyListaPagos = document.getElementById("tablaListaPagosRepresentante");

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

  //LA FECHA

  let col9 = crearCeldaConTexto(documento.fecha);

  //SE PONEN LOS ROWSPAN

  col1.rowSpan = numeroConceptos;
  col2.rowSpan = numeroConceptos;
  col5.rowSpan = numeroConceptos;
  col6.rowSpan = numeroConceptos;
  col7.rowSpan = numeroConceptos;
  col8.rowSpan = numeroConceptos;
  col9.rowSpan = numeroConceptos;
  
    let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // EDICION REALIZADA
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
    arrayFila.push(col9);

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

function escribirPagoVer5(documento){

  let tablaBodyListaPagos = document.getElementById("tablaListaPagosRepresentante");

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
  imgOjo.addEventListener("click", verDetallesPagoListaPagosRepresentante);
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

  //LA FECHA

  let col9 = crearCeldaConTexto(documento.fecha);

  //SE PONEN LOS ROWSPAN

  col1.rowSpan = numeroConceptos;
  col2.rowSpan = numeroConceptos;
  col5.rowSpan = numeroConceptos;
  col6.rowSpan = numeroConceptos;
  col7.rowSpan = numeroConceptos;
  col8.rowSpan = numeroConceptos;
  col9.rowSpan = numeroConceptos;
  
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
    arrayFila.push(col9);

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

function determinarNumeroEstudiantesDocumentoPago(datosPago){
    let resultado = 0;
    while(true){
        if(datosPago.hasOwnProperty("estudiante" + (resultado + 1))){
            resultado++;
        }
        else return resultado;
    }
}

function determinarNumeroAbonosDocumentoPago(datosPago){
  let resultado = 0;
  while(true){
      if(datosPago.hasOwnProperty("abono" + (resultado + 1))){
          resultado++;
      }
      else return resultado;
  }
}

function formularioInvalido(){
  let cedulaRepresentante = document.getElementById("cedulaPagosRepresentante").value;
  if(verSiEsNumeroEntero(cedulaRepresentante) == 1){
    mostrarPantallaError("Ingrese en el formulario solo números enteros, sin separaciones");
    return true;
  } 
  else return false;
}

function crearPrimerTrListaPagos(datosPago, contadorEstudiantes){
    let fila, cedula, meses, estudiantes, monto, tipoDePago; 
    let idPago, nombreRepresentante, verif, img, imgVerificar, fecha;
    let verificador = 0;
    let tabla = document.getElementById("tablaListaPagosRepresentante");
    //CREAR LOS ELEMENTOS

    fila = document.createElement("tr");
    nombreRepresentante = document.createElement("td");
    cedula = document.createElement("td");
    estudiantes = document.createElement("td");
    meses = document.createElement("td");
    monto = document.createElement("td");
    tipoDePago = document.createElement("td");
    idPago = document.createElement("td");
    verif = document.createElement("td");
    fecha = document.createElement("td");

    //CLASES DE ESTILO

    nombreRepresentante.className = "tdConPadding";
    cedula.className = "tdConPadding";
    estudiantes.className = "tdConPadding";
    meses.className = "tdConPadding";
    monto.className = "tdConPadding";
    tipoDePago.className = "tdConPadding";
    idPago.className = "tdConPadding";
    verif.className = "tdConPadding";
    fecha.className = "tdConPadding";

    //ASIGNACION DE DATOS

    nombreRepresentante.textContent = datosPago.nombreRepresentante;
    cedula.textContent = datosPago.cedulaRepresentante;
    if(datosPago.tipoDePago == "Abono"){
      estudiantes.textContent = datosPago["abono1"][0];
    }
    else estudiantes.textContent = datosPago["estudiante1"][0];
    tipoDePago.textContent = datosPago.tipoDePago;
    fecha.textContent = datosPago.fecha;
    idPago.textContent = datosPago.IdPago;

    //ASIGNAR MES O CURSO DEPENDIENDO DE SI ES INSCRIPCION O MENSUALIDAD

    if(datosPago.tipoDePago == "Inscripción"){
        meses.textContent = datosPago["cursoEstudiante1"];
      }
      else if(datosPago.tipoDePago != "Abono"){ //MENSUALIDAD
        for(let i = 1; i<= datosPago["estudiante1"].length - 1; i++){
          if(verificador > 0 && i < (datosPago["estudiante1"].length - 1)  && i != 1){
            meses.textContent += ", ";
          }
          meses.textContent = extraerLetrasDeUnaCadena(datosPago["estudiante1"][i]);
          verificador++;
        }
      }

      if(datosPago.tipoDePago == "Abono") meses.textContent = "N/A";


      img = document.createElement("img");
      img.src = "rsrcs/eye.png";
      img.style.width = "25px";
      img.style.height = "25px";
      img.addEventListener("click", verDetallesPagoListaPagosRepresentante);
      monto.appendChild(img);
      imgVerificar = document.createElement("img");
      if(datosPago.flagVerificar == true){
        imgVerificar.src = "rsrcs/cross.png";
      }
      else imgVerificar.src = "rsrcs/checked.png";
      imgVerificar.style.width = "25px";
      imgVerificar.style.height = "25px";
      verif.appendChild(imgVerificar);
      verif.rowSpan = contadorEstudiantes;
      nombreRepresentante.rowSpan = contadorEstudiantes;
      cedula.rowSpan = contadorEstudiantes;
      monto.rowSpan = contadorEstudiantes;
      tipoDePago.rowSpan = contadorEstudiantes;
      idPago.rowSpan = contadorEstudiantes;
      fecha.rowSpan = contadorEstudiantes;
      fila.appendChild(nombreRepresentante);
      fila.appendChild(cedula);
      fila.appendChild(estudiantes);
      fila.appendChild(meses);
      fila.appendChild(tipoDePago);
      fila.appendChild(monto);
      fila.appendChild(idPago);
      fila.appendChild(verif);
      fila.appendChild(fecha);
      tabla.appendChild(fila);
}

function crearNsimoTr(datosPago, numero){
    let verificador = 0;
    let tabla = document.getElementById("tablaListaPagosRepresentante");
    let propiedadEstudiante;
    let fila, meses, estudiantes;
    if(datosPago.tipoDePago == "Inscripción"){
        fila = document.createElement("tr");
        meses = document.createElement("td");
        meses.textContent = datosPago["cursoEstudiante" + numero];
        estudiantes = document.createElement("td");
        estudiantes.className = "tdConPadding";
        estudiantes.textContent = datosPago["estudiante" + numero][0];
        fila.appendChild(estudiantes);
        fila.appendChild(meses);
        tabla.appendChild(fila);
    }
    if(datosPago.tipoDePago == "Abono"){
      fila = document.createElement("tr");
      meses = document.createElement("td");
      meses.textContent = "N/A";
      estudiantes = document.createElement("td");
      estudiantes.className = "tdConPadding";
      estudiantes.textContent = datosPago["abono" + numero][0];
      fila.appendChild(estudiantes);
      fila.appendChild(meses);
      tabla.appendChild(fila);
    }
    else{
        fila = document.createElement("tr");
        estudiantes = document.createElement("td");
        estudiantes.textContent = datosPago["estudiante" + numero][0];
        meses = document.createElement("td");
        estudiantes.className = "tdConPadding";
        meses.className = "tdConPadding";
        for(let j = 1; j <= datosPago["estudiante" + numero].length - 1; j++){
          if(verificador > 0 && j < (datosPago["estudiante" + numero].length - 1) && j != 1){
            meses.textContent += ", ";
          }
          propiedadEstudiante = datosPago["estudiante" + numero][j];
          meses.textContent = extraerLetrasDeUnaCadena(propiedadEstudiante);
          verificador++;
        }
        fila.appendChild(estudiantes);
        fila.appendChild(meses);
        tabla.appendChild(fila);
    }
}

function dibujarTablaPagosRepresentante(datosPago){
    let numeroEstudiantes = determinarNumeroEstudiantesDocumentoPago(datosPago);
    if(datosPago.tipoDePago == "Abono") numeroEstudiantes = determinarNumeroAbonosDocumentoPago(datosPago);
    crearPrimerTrListaPagos(datosPago, numeroEstudiantes);
    if(numeroEstudiantes > 1){
        for(let i = 2; i <= numeroEstudiantes; i++) crearNsimoTr(datosPago, i);
    }
}

function verDetallesPagoListaPagosRepresentante(){
    establecerNumeroDePago(this.parentNode.parentNode.children[6].textContent);
    establecerModoVerificarPago("Representante");
    obtenerDatosPagoIndividual();
}