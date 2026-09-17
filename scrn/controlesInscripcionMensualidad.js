/*global document */

import { limpiarValoresTotalPagarPantallaPagos, tipoDePago } from "./controlesEfectuarPago.js";
import {sumaDecimal,
        restaDecimal,
        productoPrecision2,
        numberAformatoMontos,
        verSiEsUnaLetraOCaracterEspecial,
        eliminarCaracterEnIndice,
        eliminarTodasLasOcurrenciasDeUnCaracter,
        insertarCaracterEnIndice,
        extraerNumerosPuntosComasDeUnaCadena,
        formatearCadenaNumerosMilesYDecimales,
        validacionMontoEstiloBDV,
        determinarProntoPago,
        verificarProntoPagoPorFecha,
        fechaDeHoyFormatoJS,
        } from "./utilidades.js";

import {precioDolar as precioDolarInscripcion,
        precioMensualidadBachillerato,
        precioMensualidadPrimaria,
        precioMensualidadPreescolar,
        descuentoEmpleado,
        descuentoHermanos,
        mensualidadBachilleratoProntoPagoHermanos,
        mensualidadPrimariaProntoPagoHermanos,
        mensualidadPreescolarProntoPagoHermanos,
        precioInscripcionPrimaria,
        precioInscripcionPreescolar,
        precioInscripcionBachillerato,
        fechaMaximaDescuentoProntoPago,
        annoEnCurso
        } from "./obtenerPrecios.js";
import { crearCeldaConInput, crearCeldaConSelect, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

export {atrasPantallasMesesSolventes,
        rellenarMesesSolventesInscripcion,
        limpiarTablaMesesSolventesInscribir,
        limpiarTablaMesesPagarEstudiantesInscribir,
        todosMesesSolventesInscripcion,
        entrarMensualidadesInscribir,
        atrasMesesPagarInscripcion,
        seleccionarTodosMesesPagarInscripcion,
        validacionMontoConCorreccionPagoTotalUSDInscripcion,
        validacionMontoConCorreccionPagoTotalBSInscripcion,
        seleccionarMesPagarInscripcion,
        determinarTipoEmpleado,
        entrarPantallaConfirmarInscribir,
        atrasPantallaConfirmarInscribir,
        entrarPantallaPagarMensualidadInscribir};

import {
  crearFilaMesesPagarConfirmarInscribir,
        crearFilaMesesPagarInscripcion } from "./inscripcion/tablas.js";
import { determinarMontoConDescuentoInscripcion } from "./inscripcion/aritmetica.js";
import { mostrarPantallaError } from "./modal.js";
import { tipoInscripcion, tipoProcedimiento } from "./controlesGestionEstudiantes.js";
import { peticion } from "./handlersPrecios.js";
import { mostrarPantalla, ocultar } from "./funcionesHTML.js";
import { determinarConceptosConvenioInscripcion, entrarSeleccionarConceptosConvenioInscripcion } from "./controlesInscripcionConvenio.js";

export {determinarDescuentosAplicadosSelect,
        correccionSumaUSDTotalPagarInscripcion,
        correccionSumaBSTotalPagarInscripcion
};

function determinarTipoEmpleado(planilla){

  let tipoRepresentante = document.getElementsByClassName(planilla)[0].children[4].selectedIndex;
  if(tipoRepresentante == 2) tipoRepresentante = "Empleado";

  return tipoRepresentante;

}

function atrasPantallasMesesSolventes(){

  document.getElementById("mainContainerMesesSolventesInscripcion").style.display = "none";
  document.getElementById("todosMesesSolventesInscripcion").checked = false;

  document.getElementById("mainContainerInscribirEstudiante").style.display = "block";

}



function correccionSumaUSDTotalPagarInscripcion(){
    let tabla = document.getElementById("tablaPagarMesesInscripcion");
    let precioTotal = 0;
    let inputUSD;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            inputUSD = tabla.rows[i].cells[4].children[0];
            if(tabla.rows[i].cells[7].children[0].checked == true){
              precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), inputUSD.value);         
            }
        }

    document.getElementById("totalPagarInscripcionUSDmeses").textContent = numberAformatoMontos(precioTotal);
}

function correccionSumaBSTotalPagarInscripcion(){
    let tabla = document.getElementById("tablaConfirmarMesesInscribir");
    let precioTotal = 0;
    let inputBS;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            inputBS = tabla.rows[i].cells[5].children[0];
            precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), inputBS.value);               
        }

    document.getElementById("totalPagarInscripcionBSmesesConfirmar").textContent = numberAformatoMontos(precioTotal);
}

function validacionMontoConCorreccionPagoTotalUSDInscripcion(){
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
  correccionSumaUSDTotalPagarInscripcion();
};

function validacionMontoConCorreccionPagoTotalBSInscripcion(){
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
  correccionSumaBSTotalPagarInscripcion();
};

function limpiarTablaMesesPagarEstudiantesInscribir(){
  let tabla = document.getElementById("tablaPagarMesesInscripcion");

  while(tabla.rows.length > 1){
    tabla.removeChild(tabla.lastChild);
  }
}

function limpiarTablaMesesSolventesInscribir(){
  let tabla = document.getElementById("tablaMesesSolventesInscripcion");

  while(tabla.rows.length > 1){
    tabla.removeChild(tabla.lastChild);
  }
}

function crearFilaInscripcion(cedula){

  let datosEstudiante = obtenerDatosEstudianteMesesSolventesSeleccionados(cedula);

  let arrayCeldas = [];

  let monto = determinarMontoConDescuentoInscripcion(datosEstudiante.curso);

  let arrayDescuentos = ["Ninguno", "Pronto Pago", "Hermano", "Empleado", "Empleado + Pronto Pago"];

  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.nombreCompleto));
  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.cedula));
  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.curso));
  arrayCeldas.push(crearCeldaConTexto("Inscripción"));
  arrayCeldas.push(crearCeldaConInput("text", monto, "validacionMontoConCorreccionPagoTotalUSDInscripcion"));
  arrayCeldas.push(crearCeldaConInput("text", numberAformatoMontos(precioDolarInscripcion), "validacionMontoEstiloBDV"));
  arrayCeldas.push(crearCeldaConSelect(arrayDescuentos, "seleccionarDescuentoSelectInscripcion", determinarSelectedIndexDescuentoInscripcion()));
  arrayCeldas.push(crearCeldaConInput("checkbox", true));

  document.getElementById("tablaPagarMesesInscripcion").appendChild(crearTRconCeldasApendadas(arrayCeldas));
  arrayCeldas[arrayCeldas.length - 1].children[0].disabled = true;
}

export function determinarSelectedIndexDescuentoInscripcion(){

    let planilla;
  
    planilla = "subcajaFormularioInscripcionDerecha";
  
    let formularios = document.getElementsByClassName(planilla);

    let flagEmplead = false;
    let flagHermano = false;
  
    let nEstudiantes = formularios.length - 1;
  
    let tipoRepresentante = determinarTipoEmpleado(planilla);

  
    if(nEstudiantes > 1) flagHermano = true;
    if(tipoRepresentante == "Empleado") flagEmplead = true;
  
    let petic = {

      tipo: "selectedIndex",
      tipo2: "descuentoInscripcion",
      flagEmpleado: flagEmplead,
      flagHermanos: flagHermano

    };

    let petici = new peticion();

    return petici.procesar(petic);

}

function entrarMensualidadesInscribir(){

  if(tipoProcedimiento == "inscripcionRegular"){

    determinarMesesCobrarMensualidad();
    document.getElementById("mainContainerMesesSolventesInscripcion").style.display = "none";
    document.getElementById("mainContainerMesesPagarInscripcion").style.display = "block";

  }

  if(tipoProcedimiento == "inscripcionConvenio"){

    determinarConceptosConvenioInscripcion();
    entrarSeleccionarConceptosConvenioInscripcion();

  }

}

function determinarMesesCobrarMensualidad(){

    limpiarTablaMesesPagarEstudiantesInscribir();

    let flagHermanos = false;

    let flagEmpleado;

    let datosEstudiante;

    let arrayMeses = ["Septiembre",
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

    let arrayCedulas;

    arrayCedulas = obtenerCedulasInscribir("subcajaFormularioInscripcionDerecha");
      
    flagEmpleado = descuentoEmpleadoMesesInscripcion("subcajaFormularioInscripcionDerecha");
    
    if(arrayCedulas.length > 1) flagHermanos = true;

    let idAnnoEscolar;

    if(tipoInscripcion == "Nuevo Ingreso") idAnnoEscolar = "AnnoEscolarNuevoIngreso";
    if(tipoInscripcion == "Prosecucion") idAnnoEscolar = "AnnoEscolarProsecucion";

    let annoEscolarConsultado = document.getElementById(idAnnoEscolar).value;

    for(let i = 0; i <= arrayCedulas.length - 1; i++){

      crearFilaInscripcion(arrayCedulas[i]);

      for(let j = 0; j <= arrayMeses.length - 1; j++){

        if(!mesSolventeSeleccionado(arrayCedulas[i], arrayMeses[j])){

          datosEstudiante = obtenerDatosEstudianteMesesSolventesSeleccionados(arrayCedulas[i]);

          crearFilaMesesPagarInscripcion(datosEstudiante, arrayMeses[j], flagHermanos, annoEscolarConsultado, flagEmpleado);


        }

      }

    }

    calcularMontoTotalPagarMensualidadInscripcion();

}

export function descuentoEmpleadoMesesInscripcion(planillas){
  
  let formulario = document.getElementsByClassName(planillas);

  let valorSeleccionado = formulario[0].children[4].selectedIndex;

  //EL VALOR 0 ES SELECCIONE
  //EL VALOR 1 ES REGULAR
  //EL VALOR 2 ES EMPLEADO

  if(valorSeleccionado == 2) return true;

  else return false;

}

export function obtenerDatosEstudianteMesesSolventesSeleccionados(cedula){

      let tabla = document.getElementById("tablaMesesSolventesInscripcion");

      let cedulaTabla;

      let datosEstudiante = {

        nombreCompleto:"",
        cedula:"",
        curso:""

      };

      for(let i = 1; i <= tabla.rows.length - 1; i++){

        //AQUI TOME LOS DATOS QUE NECESITABA

        cedulaTabla = tabla.rows[i].cells[1].textContent;


        //AQUI VEO SI LOS DATOS NO SON LOS QUE QUIERO CONSULTAR

        if(cedula != cedulaTabla) continue;

        datosEstudiante.nombreCompleto = tabla.rows[i].cells[0].textContent;
        datosEstudiante.cedula = cedulaTabla;
        datosEstudiante.curso = tabla.rows[i].cells[2].textContent;

        return datosEstudiante;

      }

}

export function mesSolventeSeleccionado(cedulaConsulta, mesConsulta){

      let tabla = document.getElementById("tablaMesesSolventesInscripcion");

      let cedulaTabla;

      let mesTabla;

      let mesSeleccionado;

      for(let i = 1; i <= tabla.rows.length - 1; i++){

        //AQUI TOME LOS DATOS QUE NECESITABA

        cedulaTabla = tabla.rows[i].cells[1].textContent;

        mesTabla = tabla.rows[i].cells[3].textContent;

        mesSeleccionado = tabla.rows[i].cells[4].children[0].checked;

        //AQUI VEO SI LOS DATOS NO SON LOS QUE QUIERO CONSULTAR

        if(cedulaConsulta != cedulaTabla) continue;

        if(mesTabla != mesConsulta) continue;

        //SI LOS DATOS SON LOS QUE QUIERO CONSULTAR
        //ENTONCES REVISO EL SELECT
        //Y RETORNO SEGUN EL VALOR

        if(mesSeleccionado) return true;
        else return false;

        //PUDE HABER DICHO RETURN MESSELECCIONADO, PERO LO HICE MAS IDIOMATICO

      }

}

export function obtenerCedulasInscribir(planillas){

  let formularios = document.getElementsByClassName(planillas);

  let arrayCedulas = [];

  for(let i = 1; i <= formularios.length - 1; i++){

    arrayCedulas.push(formularios[i].children[2].value);

  }

  return arrayCedulas;

}

function crearFilaMesesSolventesInscripcion(datosEstudiante, mes){

    let tabla = document.getElementById("tablaMesesSolventesInscripcion");

    let fila = document.createElement("tr");

    let nombre = document.createElement("td");
    let cedula = document.createElement("td");
    let curso = document.createElement("td");
    let mesSolvencia = document.createElement("td");
    let solvencia = document.createElement("td");

    let inputSolvencia = document.createElement("input");
    inputSolvencia.type = "checkbox";
    inputSolvencia.className = "checkbox";
    inputSolvencia.addEventListener("change", seleccionarMesSolvente);
    solvencia.appendChild(inputSolvencia);

    nombre.textContent = datosEstudiante.nombre;
    cedula.textContent = datosEstudiante.cedula;
    curso.textContent = datosEstudiante.curso;
    mesSolvencia.textContent = mes;

    fila.appendChild(nombre);
    fila.appendChild(cedula);
    fila.appendChild(curso);
    fila.appendChild(mesSolvencia);
    fila.appendChild(solvencia);

    tabla.appendChild(fila);

}

function determinarDescuentosAplicadosSelect(hermanos, empleado, anno, mes){

  let petic = {
    tipo: "selectedIndex",
    tipo2: "descuentoMensualidad",
    tipo3: mes,
    flagEmpleado: empleado,
    flagHermanos: hermanos,
    annoConsultado: anno

  };

  let obtenerIndex = new peticion();

  return obtenerIndex.procesar(petic);
}

function todosMesesSolventesInscripcion(){
    let tablaMeses = document.getElementById("tablaMesesSolventesInscripcion");
    for(let i = 1; i <= tablaMeses.rows.length - 1; i++){
        if(document.getElementById("todosMesesSolventesInscripcion").checked == false){
            tablaMeses.rows[i].cells[4].children[0].checked = false;
        }
        else{
            tablaMeses.rows[i].cells[4].children[0].checked = true;
        }
      }
}

function atrasMesesPagarInscripcion(){

  document.getElementById("mainContainerMesesPagarInscripcion").style.display = "none";
  document.getElementById("mainContainerMesesSolventesInscripcion").style.display = "block";

}

function seleccionarMesSolvente(){
    let tablaMeses = document.getElementById("tablaMesesSolventesInscripcion");
    let verificador = 0;
    for(let i = 1; i <= tablaMeses.rows.length - 1; i++){
      if(tablaMeses.rows[i].cells[4].children[0].checked == false && document.getElementById("todosMesesSolventesInscripcion").checked == true){
        document.getElementById("todosMesesSolventesInscripcion").checked = false;
      }
      if(tablaMeses.rows[i].cells[4].children[0].checked == true && document.getElementById("todosMesesSolventesInscripcion").checked == false){
        verificador++;
      }
    }
    if(verificador == (tablaMeses.rows.length - 1)){
      document.getElementById("todosMesesSolventesInscripcion").checked = true;
    }
}


function rellenarMesesSolventesInscripcion(){

    let formularios;

    formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");

    let arrayMeses = ["Septiembre",
                      "Octubre", 
                      "Noviembre", 
                      "Diciembre", 
                      "Enero", 
                      "Febrero",
                      "Marzo",
                      "Abril",
                      "Mayo"];

    let datosEstudiante = {
        nombre: "",
        cedula: "",
        curso: ""
    };

    for(let i = 1; i <= formularios.length - 1; i++){

        datosEstudiante.nombre = formularios[i].children[0].value + " " + formularios[i].children[1].value;
        datosEstudiante.cedula = formularios[i].children[2].value;
        datosEstudiante.curso = formularios[i].children[5].options[formularios[i].children[5].selectedIndex].textContent;

        for(let i = 0; i <= arrayMeses.length - 1; i++) crearFilaMesesSolventesInscripcion(datosEstudiante, arrayMeses[i]);

    }
}

function seleccionarMesPagarInscripcion(){

    calcularMontoTotalPagarMensualidadInscripcion();
    let tablaMeses = document.getElementById("tablaPagarMesesInscripcion");
    let verificador = 0;
    for(let i = 1; i <= tablaMeses.rows.length - 1; i++){
      if(tablaMeses.rows[i].cells[7].children[0].checked == false && document.getElementById("pagarTodosLosMesesInscripcionInput").checked == true){
        document.getElementById("pagarTodosLosMesesInscripcionInput").checked = false;
      }
      if(tablaMeses.rows[i].cells[7].children[0].checked == true && document.getElementById("pagarTodosLosMesesInscripcionInput").checked == false){
        verificador++;
      }
    }
    if(verificador == (tablaMeses.rows.length - 1)){
      document.getElementById("pagarTodosLosMesesInscripcionInput").checked = true;
    }

}

function calcularMontoTotalPagarMensualidadInscripcion(){

  let tablaMensualidades = document.getElementById("tablaPagarMesesInscripcion");
  document.getElementById("totalPagarInscripcionUSDmeses").textContent = "0,00";
  let contadorUSD = 0;
  for(let i = 1; i <= tablaMensualidades.rows.length - 1; i++){
    if(tablaMensualidades.rows[i].cells[7].children[0].checked == true){

        contadorUSD = sumaDecimal(numberAformatoMontos(contadorUSD),
                                  tablaMensualidades.rows[i].cells[4].children[0].value);
    }
  }
  document.getElementById("totalPagarInscripcionUSDmeses").textContent = numberAformatoMontos(contadorUSD);

}

function seleccionarTodosMesesPagarInscripcion(){

  debugger;
    let tablaMeses = document.getElementById("tablaPagarMesesInscripcion");
    for(let i = 2; i <= tablaMeses.rows.length - 1; i++){
      
      if(tablaMeses.rows[i].cells[7].children[0].disabled == true) continue;
        if(document.getElementById("pagarTodosLosMesesInscripcionInput").checked == false){


            tablaMeses.rows[i].cells[7].children[0].checked = false;
        }
        else{
            tablaMeses.rows[i].cells[7].children[0].checked = true;
        }
      }
      calcularMontoTotalPagarMensualidadInscripcion();
}

function entrarPantallaConfirmarInscribir(){

  let formulariosInvalidosPrecioUSD = formulariosInvalidosPrecioDolar();
  let formulariosInvalidosMontos = formulariosInvalidosMontosMesesEnUSD();

  if(formulariosInvalidosMontos == 1 || formulariosInvalidosPrecioUSD == 1) return;

  document.getElementById("mainContainerMesesPagarInscripcion").style.display = "none";
  document.getElementById("mainContainerConfirmarInscribir").style.display = "block";

  limpiarFilasTabla("tablaConfirmarMesesInscribir", 1);
  crearFilaMesesPagarConfirmarInscribir();

  document.getElementById("totalPagarInscripcionUSDmesesConfirmar").textContent = document.getElementById("totalPagarInscripcionUSDmeses").textContent;

}

function atrasPantallaConfirmarInscribir() {
  
  document.getElementById("mainContainerConfirmarInscribir").style.display = "none";
  document.getElementById("mainContainerMesesPagarInscripcion").style.display = "block";

}

function formulariosInvalidosPrecioDolar(){

  let tabla = document.getElementById("tablaPagarMesesInscripcion");
  let input;

  for(let i = 1; i <= tabla.rows.length - 1; i++){

    input = tabla.rows[i].cells[5].children[0].value;
    if(input == "0,00"){

      mostrarPantallaError("No puede haber montos en 0,00");
      return 1;

    }

  }

  return 0;

}

function formulariosInvalidosMontosMesesEnUSD(){

  let tabla = document.getElementById("tablaPagarMesesInscripcion");
  let input;

  for(let i = 1; i <= tabla.rows.length - 1; i++){

    input = tabla.rows[i].cells[4].children[0].value;
    if(input == "0,00"){

      mostrarPantallaError("No puede haber montos en 0,00");
      return 1;

    }

  }

  return 0;

}

function formulariosInvalidosMontosMesesEnBS(){

  let tabla = document.getElementById("tablaConfirmarMesesInscribir");
  let input;

  for(let i = 1; i <= tabla.rows.length - 1; i++){

    input = tabla.rows[i].cells[5].children[0].value;
    if(input == "0,00"){

      mostrarPantallaError("No puede haber montos en 0,00");
      return 1;

    }

  }

  return 0;

}

function entrarPantallaPagarMensualidadInscribir(){

  let formularioInvalido = formulariosInvalidosMontosMesesEnBS();

  if(formularioInvalido) return;

  document.getElementById("mainContainerConfirmarInscribir").style.display = "none";
  document.getElementById("mainContainerPagar").style.display = "block";

  limpiarValoresTotalPagarPantallaPagos();

  document.getElementById("montoPagarDolares").textContent = document.getElementById("totalPagarInscripcionUSDmesesConfirmar").textContent;
  document.getElementById("montoPagarBolivares").textContent = document.getElementById("totalPagarInscripcionBSmesesConfirmar").textContent;


}