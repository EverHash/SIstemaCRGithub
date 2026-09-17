/*global document, console */

import { precioDolar, obtenerPrecioAdministrativo } from "./obtenerPrecios.js";
import { numberAformatoMontos, productoPrecision2, sumaDecimal } from "./utilidades.js";

export {dibujarTablaDeudaAdministrativa, 
        entrarDeudasAdministrativas, 
        atrasDeudasAdministrativas,
        seleccionarPagarTodasLasDeudas
 };

function calcularMontoTotalPagarDeudaAdministrativa(){
  let tablaMensualidades = document.getElementById("tablaDatosPagosPendientesAdministrativos");
  document.getElementById("totalPagarAdministrativoPendiente").textContent = "0,00";
  document.getElementById("totalPagarAdministrativoBolivaresPendiente").textContent = "0,00";
  let contadorBS = 0;
  let contadorUSD = 0;
  for(let i = 1; i <= tablaMensualidades.rows.length - 1; i++){
    if(tablaMensualidades.rows[i].cells[4].children[0].checked == true){
        contadorBS = sumaDecimal(numberAformatoMontos(contadorBS),
                                 tablaMensualidades.rows[i].cells[3].textContent); 

        contadorUSD = sumaDecimal(numberAformatoMontos(contadorUSD),
                                  tablaMensualidades.rows[i].cells[2].textContent);
    }
  }
  document.getElementById("totalPagarAdministrativoBolivaresPendiente").textContent = numberAformatoMontos(contadorBS);
  document.getElementById("totalPagarAdministrativoPendiente").textContent = numberAformatoMontos(contadorUSD);
}

function seleccionarPagarTodasLasDeudas(){
  let tabla = document.getElementById("tablaDatosPagosPendientesAdministrativos");
  for(let i = 1; i <= tabla.rows.length - 1; i++){
    if(document.getElementById("casillaPagosAdministrativos").checked == true){
      tabla.rows[i].cells[4].children[0].checked = true;
    }
    else{
      tabla.rows[i].cells[4].children[0].checked = false; 
    }
  }
  calcularMontoTotalPagarDeudaAdministrativa();
}

function seleccionarPagoDeuda(){
    let tablaConsultas = document.getElementById("tablaDatosPagosPendientesAdministrativos");
    let verificador = 0;
    let casillaIterada;
    let casillaEncabezado = document.getElementById("casillaPagosAdministrativos");
    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){
        casillaIterada = tablaConsultas.rows[i].cells[4].children[0].checked;
      if(casillaIterada == false && casillaEncabezado.checked == true){
        casillaEncabezado.checked = false;
      }
      if(casillaIterada == true && casillaEncabezado.checked == false){
        verificador++;
      }
    }
    if(verificador == (tablaConsultas.rows.length - 1)){
        casillaEncabezado.checked = true;
    }
    calcularMontoTotalPagarDeudaAdministrativa();
}

function dibujarTrTablaDeuda(datosRepresentante, propiedad){
    let tr = document.createElement("tr");
    let nombre = document.createElement("td");
    let concepto = document.createElement("td");
    let deudaRestanteUSD = document.createElement("td");
    let deudaRestanteBs = document.createElement("td");
    let seleccionarPago = document.createElement("td");
    let inputSeleccionarPago = document.createElement("input");
    let tdOculto = document.createElement("td");
    let tablaConsultas = document.getElementById("tablaDatosPagosPendientesAdministrativos");

    //WARNING: VERIFICAR ESTO DE LOS MONTOS, LO DIGO POR LA PRECISION EN LOS CASOS RAROS
    deudaRestanteUSD.textContent = numberAformatoMontos(datosRepresentante[propiedad][0]);
    deudaRestanteBs.textContent = numberAformatoMontos(productoPrecision2(datosRepresentante[propiedad][0], precioDolar));
    concepto.textContent = datosRepresentante[propiedad][2];
    nombre.textContent = datosRepresentante[propiedad][1];
    inputSeleccionarPago.type = "checkbox";
    inputSeleccionarPago.addEventListener("change", seleccionarPagoDeuda);
    seleccionarPago.appendChild(inputSeleccionarPago);
    tdOculto.textContent = datosRepresentante[propiedad][3];
    // tdOculto.style.display = "none";

    //INSERTAR A LA FILA

    tr.appendChild(nombre);
    tr.appendChild(concepto);
    tr.appendChild(deudaRestanteUSD);
    tr.appendChild(deudaRestanteBs);
    tr.appendChild(seleccionarPago);
    tr.appendChild(tdOculto);
    tablaConsultas.appendChild(tr);
}

function dibujarTablaDeudaAdministrativa(datosRepresentante){
    let cadenaParse;
    let contador = 1;
    while(true){
      if(!datosRepresentante.hasOwnProperty("pago" + contador + "CertificacionFondoNegro")) break;
      if(datosRepresentante["pago" + contador + "CertificacionFondoNegro"][0] == 0) {
        contador++;
        continue;
      }
      cadenaParse = "pago" + contador + "CertificacionFondoNegro";
      dibujarTrTablaDeuda(datosRepresentante, cadenaParse);
      contador++;
    }
    contador = 1;
    while(true){
      if(!datosRepresentante.hasOwnProperty("pago" + contador + "RetiroPapeles")) break;
      if(datosRepresentante["pago" + contador + "RetiroPapeles"][0] == 0) {
        contador++;
        continue;
      }
      cadenaParse = "pago" + contador + "RetiroPapeles";
      dibujarTrTablaDeuda(datosRepresentante, cadenaParse);
      contador++;
    }
    contador = 1;
    while(true){
      if(!datosRepresentante.hasOwnProperty("pago" + contador + "RetiroTitulo")) break;
      if(datosRepresentante["pago" + contador + "RetiroTitulo"][0] == 0) {
        contador++;
        continue;
      }
      cadenaParse = "pago" + contador + "RetiroTitulo";
      dibujarTrTablaDeuda(datosRepresentante, cadenaParse);
      contador++;
    }
    contador = 1;
    while(true){
      if(!datosRepresentante.hasOwnProperty("pago" + contador + "NotasCertificadas")) break;
      if(datosRepresentante["pago" + contador + "NotasCertificadas"][0] == 0) {
        contador++;
        continue;
      }
      cadenaParse = "pago" + contador + "NotasCertificadas";
      dibujarTrTablaDeuda(datosRepresentante, cadenaParse);
      contador++;
    }
}

function entrarDeudasAdministrativas(){
  document.getElementById("mainContainerSeleccionarTipoPagoAdministrativo").style.display = "none";
  document.getElementById("main-container-PagosAdministrativosPendientes").style.display = "block";
  obtenerPrecioAdministrativo();
}

function atrasDeudasAdministrativas(){
  document.getElementById("main-container-PagosAdministrativosPendientes").style.display = "none";
  document.getElementById("mainContainerSeleccionarTipoPagoAdministrativo").style.display = "block";
}