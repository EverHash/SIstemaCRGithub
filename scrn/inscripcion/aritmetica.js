/*global document */

import { correccionSumaUSDTotalPagarInscripcion, determinarTipoEmpleado } from "../controlesInscripcionMensualidad.js";

import { peticion } from "../handlersPrecios.js";

export {determinarCostoMensualidad,
        cambiarMontoDolaresDescuentoInscripcion,
        determinarMontoConDescuentoInscripcion,
        seleccionarDescuentoSelectInscripcion
};

function determinarCostoMensualidad(curso, hermanos, empleado, mes, anno){

  let grado;

  if(curso.includes("Nivel")) grado = "preescolar";
  if(curso.includes("Grado")) grado = "primaria";
  if(curso.includes("Año")) grado = "bachillerato";

  let peticionPrecio = {

    tipo:"precio",
    tipo2: "mensualidad",
    tipo3: grado,
    tipo4: mes,
    flagHermanos: hermanos,
    flagEmpleado: empleado,
    annoConsultado: anno

  };

  let obtenerPrecio = new peticion();

  return obtenerPrecio.procesar(peticionPrecio);

}

function cambiarMontoDolaresDescuentoInscripcion(){

  let peticionPrecio = {
    tipo: "precio",
    tipo2: "mensualidad",
    tipo3: "",
    selectedIndex: this.selectedIndex

  };

  let curso = this.parentNode.parentNode.children[2].textContent;

  if(curso.includes("Nivel")) peticionPrecio.tipo3 = "preescolar";
  if(curso.includes("Grado")) peticionPrecio.tipo3 = "primaria";
  if(curso.includes("Año")) peticionPrecio.tipo3 = "bachillerato";

  let precio = new peticion();

  let precioMensualidad = precio.procesar(peticionPrecio);

  this.parentNode.parentNode.children[4].children[0].value = precioMensualidad; //EL INPUT QUE CONTIENE EL PRECIO

  correccionSumaUSDTotalPagarInscripcion();

}

function determinarMontoConDescuentoInscripcion(grado){

  let planilla;

  debugger;

  planilla = "subcajaFormularioInscripcionDerecha";

  let formularios = document.getElementsByClassName(planilla);

  let flagEmplead = false;
  let flagHermano = false;

  let nEstudiantes = formularios.length - 1;

  let tipoRepresentante = determinarTipoEmpleado(planilla);

  if(nEstudiantes > 1) flagHermano = true;
  if(tipoRepresentante == "Empleado") flagEmplead = true;

  let peticionPrecio = {

    tipo: "precio",
    tipo2: "inscripcion",
    tipo3: "",
    flagHermanos: flagHermano,
    flagEmpleado: flagEmplead

  };

  if(grado.includes("Nivel")) peticionPrecio.tipo3 = "preescolar";
  if(grado.includes("Grado")) peticionPrecio.tipo3 = "primaria";
  if(grado.includes("Año")) peticionPrecio.tipo3 = "bachillerato";

  let precio = new peticion();

  return precio.procesar(peticionPrecio);
  

}

function seleccionarDescuentoSelectInscripcion(){

    let peticionPrecio = {
      tipo:"precio",
      tipo2: "inscripcion",
      tipo3: "",
      selectedIndex: this.selectedIndex
    };

    let grado = this.parentNode.parentNode.children[2].textContent;

    if(grado.includes("Nivel")) peticionPrecio.tipo3 = "preescolar";
    if(grado.includes("Grado")) peticionPrecio.tipo3 = "primaria";
    if(grado.includes("Año")) peticionPrecio.tipo3 = "bachillerato";

    let obtenerPrecio = new peticion();

    let input = this.parentNode.parentNode.children[4].children[0];

    input.value = obtenerPrecio.procesar(peticionPrecio);

    correccionSumaUSDTotalPagarInscripcion();

}

