/*global document */

export {marcarTodosLosMesesPagar, 
        marcarTodosLosEstudiantesConsultar, 
        entrarGestionarMensualidades, 
        entrarPagarMensualidad, 
        consultarEstudianteParticular, 
        pagarEstudiantes, 
        atrasPagosMensualidades, 
        atrasConsultarEstudiantes, 
        atrasMensualidades,
        tablaConsultarBuscarEstudiantes,
        dibujarTablaConsultar,
        MostrarTablaPagar, 
        volverPantallaPagosApantallaConsultarRepresentante,
        validarFormularioConsultarRepresentante,
        ocultarElementosInterazConsultarRepresentante,
        mostrarElementosInterazConsultarRepresentante,
        validarCheckboxesConsultarEstudiantes,
        determinarMontoTotalAbonado};

import {formatoMontosAnumber,
        productoPrecision2,
        numberAformatoMontos,
        sumaDecimal,
        restaDecimal, 
        determinarProntoPago,
        validacionMontoEstiloBDV,
        verSiEsUnaLetraOCaracterEspecial,
        eliminarCaracterEnIndice,
        eliminarTodasLasOcurrenciasDeUnCaracter,
        insertarCaracterEnIndice,
        formatearCadenaNumerosMilesYDecimales,
        extraerNumerosPuntosComasDeUnaCadena,
        verSiEsNumeroEntero,
        verificarProntoPagoPorFecha,
        fechaDeHoyFormatoJS} from "./utilidades.js";

import {precioDolar, 
    precioMensualidadBachillerato as precioBasicoMensualidadBachillerato, 
    precioMensualidadPrimaria as precioBasicoMensualidadPrimaria, 
    precioMensualidadPreescolar as precioBasicoMensualidadPreescolar,
    mensualidadPreescolarProntoPagoHermanos,
    mensualidadPrimariaProntoPagoHermanos,
    mensualidadBachilleratoProntoPagoHermanos, 
    descuentoHermanos, 
    descuentoProntoPagoMensualidad as descuentoProntoPago,
    precioMensualidadBachilleratoBasicoNoAlterado,
    precioMensualidadPrimariaNoAlterado,
    precioMensualidadPreescolarBasicoNoAlterado,
    descuentoEmpleado,
    obtenerPreciosMensualidad,
    fechaMaximaDescuentoProntoPago,
    precioInscripcionPreescolar,
    precioInscripcionPrimaria,
    precioInscripcionBachillerato,
    descuentoProntoPagoInscripcion,
    obtenerPrecioInscripcion} from "./obtenerPrecios.js";

import {limpiarMetodosPago, limpiarValoresTotalPagarPantallaPagos, setTipoPago} from "./controlesEfectuarPago.js";

import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";

import {tipoRepresentante, contadorHermanos, annoEscolarConsultado} from "./mensualidad.js";
import { crearCeldaConInput, crearCeldaConSelect, crearCeldaConTexto, crearTRconCeldasApendadas } from "./utilidadesTablas.js";
import { documentoDePago } from "./objetos.js";
import { peticion } from "./handlersPrecios.js";

function validarFormularioConsultarRepresentante(){

  let cedulaRepresentante = document.getElementById("cedula-representante-consultar").value;

  if(cedulaRepresentante == ""){

    mostrarPantallaError("Introduzca la cédula del representante, por favor...");
    return 1;

  }

  if(verSiEsNumeroEntero(cedulaRepresentante) == 1){

    mostrarPantallaError("Introduzca solo números en la cédula del representante, sin separaciones...");
    return 0;

  }

}

function determinarMontoTotalAbonado(representante){

  let montoBS = "0,00";
  let montoUSD = "0,00";

  let usdAbolivares;
  
  for(let propiedad in representante){

    if(!propiedad.includes("abonos")) continue;

    //SE SUMA CADA MONEDA

    if(representante[propiedad][1] == "Bolívares"){

      montoBS = sumaDecimal(montoBS, numberAformatoMontos(representante[propiedad][2]));
      montoBS = numberAformatoMontos(montoBS);

    }

    if(representante[propiedad][1] == "Dólares"){

      montoUSD = sumaDecimal(montoUSD, numberAformatoMontos(representante[propiedad][2]));
      montoUSD = numberAformatoMontos(montoUSD);

    }

  }

  if(montoBS != "0,00" && montoUSD != "0,00"){

    //SI HAY DOLARES Y BS ENTRE EL DINERO QUE HA ABONADO EL REPRESENTANTE

    //AQUI LO QUE SE HACE ES
    //CONVERTIR LOS DOLARES A BS
    //LUEGO SE SUMA A LOS BS
    //LUEGO SE CONVIERTE A FORMATO MONTOS
    //Y FINALMENTE SE RETORNA

    montoUSD = formatoMontosAnumber(montoUSD);
    usdAbolivares = productoPrecision2(precioDolar, montoUSD);
    usdAbolivares = numberAformatoMontos(usdAbolivares);


    montoBS = sumaDecimal(montoBS, usdAbolivares);

    montoBS = numberAformatoMontos(montoBS);

    return (montoBS + " Bs Abonados");


  }

  if(montoBS != "0,00" && montoUSD == "0,00") return (montoBS + " Bs Abonados");
  if(montoBS == "0,00" && montoUSD != "0,00") return (montoUSD + " USD Abonados");

  if(montoBS == "0,00" && montoUSD == "0,00") return "0,00 Bs Abonados";



}

function validacionMontoConCorreccionPagoTotalMensualidad(){
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
  correccionSumaBSTotalPagarMensualidad();
};

function validacionMontoConCorreccionPagoTotalUSDMensualidad(){
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
  correccionSumaUSDTotalPagarMensualidad();
};

function correccionSumaBSTotalPagarMensualidad(){
    let tabla = document.getElementById("tabla-estudiante-pagado-encabezado");
    let precioTotal = 0;
    let inputBS;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            inputBS = tabla.rows[i].cells[5].children[0];
            precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), inputBS.value);
        }
    document.getElementById("Total-Pagar-consultarBS").textContent = numberAformatoMontos(precioTotal);
}

function correccionSumaUSDTotalPagarMensualidad(){
    let tabla = document.getElementById("tabla-estudiante-consultado-encabezado");
    let precioTotal = 0;
    let inputUSD;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            inputUSD = tabla.rows[i].cells[4].children[0];
            if(tabla.rows[i].cells[7].children[0].checked == true){
              precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), inputUSD.value);         
            }
        }

    document.getElementById("totalPagarMensualidad").textContent = numberAformatoMontos(precioTotal);
}

function volverPantallaPagosApantallaConsultarRepresentante(){
  limpiarMetodosPago();
  ocultarElementosInterazConsultarRepresentante();
  document.getElementById("mainContainerPagar").style.display = "none";
  document.getElementById("cedula-representante-consultar").value = "";
  document.getElementById("main-container-PagoMensualidadRealizado").style.display = "none";
  document.getElementById("mes-en-curso").selectedIndex = 0;
  document.getElementById("verificarTodosLosMeses").checked = false;
  document.getElementById("main-container-GestionMensualidades").style.display = "block";
}

function tablaConsultarBuscarEstudiantes(documento){
    let nuevoelemento = document.createElement("tr");
    let consultarBoton = document.createElement("input");
    let nombre = document.createElement("td");
    let apellidos = document.createElement("td");
    let cedula = document.createElement("td");
    let grado = document.createElement("td");
    let curso = document.createElement("td");
    let seccion = document.createElement("td");
    let consultar = document.createElement("td");
    consultarBoton.type = "checkbox";
    consultarBoton.className = "checkbox";
    consultarBoton.addEventListener("change", checarCheckboxesFilasActivarCabecera);
    nombre.textContent = documento["nombres"];
    apellidos.textContent = documento["apellidos"];
    cedula.textContent = documento["cedula"];
    grado.textContent = documento["grado"];
    curso.textContent = documento["curso"];
    seccion.textContent = documento["seccion"];
    consultar.appendChild(consultarBoton);
    nuevoelemento.appendChild(nombre);
    nuevoelemento.appendChild(apellidos);
    nuevoelemento.appendChild(cedula);
    nuevoelemento.appendChild(grado);
    nuevoelemento.appendChild(curso);
    nuevoelemento.appendChild(seccion);
    nuevoelemento.appendChild(consultar);
    document.getElementById("tabla-consultar-estudiante-encabezado").appendChild(nuevoelemento);

}

function checarCheckboxesFilasActivarCabecera(){
    //FUNCION QUE VERIFICA SI ESTAN TODOS LOS CHECKBOXES ACTIVOS
    //SI ESTAN ACTIVOS, ACTIVA EL DE LA CABECERA DE LA TABLA

    let verificador = 0;
    let tablaConsultas = document.getElementById("tabla-consultar-estudiante-encabezado");
    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){
        if(tablaConsultas.rows[i].cells[6].children[0].checked == false && document.getElementById("marcarTodosLosEstudiantesConsultar").checked == true){
            document.getElementById("marcarTodosLosEstudiantesConsultar").checked = false;
        }
        if(tablaConsultas.rows[i].cells[6].children[0].checked == true && document.getElementById("marcarTodosLosEstudiantesConsultar").checked == false){
            verificador++;
        }
    }
    if(verificador == (tablaConsultas.rows.length - 1)){
        document.getElementById("marcarTodosLosEstudiantesConsultar").checked = true;
    }
}

function marcarTodosLosMesesPagar(){
    let tablaMensualidades = document.getElementById("tabla-estudiante-consultado-encabezado");
    for(let i = 1; i <= tablaMensualidades.rows.length - 1; i++){
        tablaMensualidades.rows[i].cells[7].children[0].checked = false;
      }
    for(let i = 1; i <= tablaMensualidades.rows.length - 1; i++){
        if(document.getElementById("pagar-todos-los-meses-estudiante-input").checked == false){
            tablaMensualidades.rows[i].cells[7].children[0].checked = false;
        }
        else{
            tablaMensualidades.rows[i].cells[7].children[0].checked = true;
        }
      }
      calcularMontoTotalPagarMensualidad();
}

function marcarTodosLosEstudiantesConsultar(){
    let tabla = document.getElementById("tabla-consultar-estudiante-encabezado");
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(document.getElementById("marcarTodosLosEstudiantesConsultar").checked == true){
            tabla.rows[i].cells[6].children[0].checked = true;
        }
        else{
            tabla.rows[i].cells[6].children[0].checked = false; 
        }
      }
}

function cambiarMontoDolaresDescuento(){

  let petic = {

    tipo: "precio",
    tipo2: "mensualidad",
    tipo3: "",
    selectedIndex: this.selectedIndex

  };
  
  let curso = this.parentNode.parentNode.children[2].textContent;

  if(curso.includes("Año")) petic.tipo3 = "bachillerato";
  if(curso.includes("Grado")) petic.tipo3 = "primaria";
  if(curso.includes("Nivel")) petic.tipo3 = "preescolar";

  let inputPrecio = this.parentNode.parentNode.children[4].children[0];

  let precio = new peticion();

  inputPrecio.value = precio.procesar(petic);

  calcularMontoTotalPagarMensualidad();

}

function dibujarTablaConsultar(datosEstudiante, nombreCompleto, grado, curso, cedula){

    let monto;

    let nombresMeses = [
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

    let contenedorFlags = {

      empleado: false,
      hermanos: false

    };

    debugger;

    let mesesConsultar = document.getElementById("mes-en-curso").selectedIndex;


    //PROCEDE A COLOCAR LOS FLAGS DE HERMANOS Y EMPLEADO
    if(contadorHermanos > 1){
      contenedorFlags.hermanos = true;
    }

    if(tipoRepresentante == "Empleado"){
      contenedorFlags.empleado = true;
    }

    if(datosEstudiante.hasOwnProperty("pagoInscripcion")){

      if(!datosEstudiante.pagoInscripcion){

         monto = determinarMontoConDescuentoInscripcion(datosEstudiante.curso);

         dibujarFilaInscripcionConsultarEstudiante(datosEstudiante, monto, contenedorFlags);

      }

    }


    //COMIENZA A RECORRER EL BUCLE DE MESES PARA ESTE ESTUDIANTE

    for(let j = 0; j <= mesesConsultar - 1; j++){

        if(datosEstudiante[nombresMeses[j]] == false){ //SI EL MES NO ESTA PAGO
            
            //PROCEDE A VERIFICAR SI APLICA PRONTO PAGO

              monto = determinarCostoMensualidad(datosEstudiante.curso, contenedorFlags, nombresMeses[j]);

              dibujarFilaConceptoConsultarEstudiante(datosEstudiante, nombresMeses[j].substring(6), monto, contenedorFlags);

              //PROCEDE A VERIFICAR SI APLICA DESCUENTO POR EMPLEADO

        }
    }
}

function seleccionarDescuentoSelectInscripcion(){

    let petic = {

      tipo: "precio",
      tipo2: "inscripcion",
      tipo3: "",
      selectedIndex: this.selectedIndex

    };

    let grado = this.parentNode.parentNode.children[2].textContent;

    if(grado.includes("Año")) petic.tipo3 = "bachillerato";
    if(grado.includes("Grado")) petic.tipo3 = "primaria";
    if(grado.includes("Nivel")) petic.tipo3 = "preescolar";


    let input = this.parentNode.parentNode.children[4].children[0];

    let precio = new peticion();

    input.value = precio.procesar(petic);

    calcularMontoTotalPagarMensualidad();
}

function dibujarFilaInscripcionConsultarEstudiante(datosEstudiante, monto, contenedorFlags){

  let tabla = document.getElementById("tabla-estudiante-consultado-encabezado");

  let arrayDescuentos = [
      "Ninguno",
      "Pronto Pago",
      "Hermano",
      "Empleado",
      "Empleado + Pronto Pago"
  ];


  let col1 = crearCeldaConTexto(datosEstudiante.nombres + " " + datosEstudiante.apellidos);
  let col2 = crearCeldaConTexto(datosEstudiante.cedula);
  let col3 = crearCeldaConTexto(datosEstudiante.curso);
  let col4 = crearCeldaConTexto("Inscripción");

  //INPUT CON EL MONTO A PAGAR

  let col5 = crearCeldaConInput("text", monto, "");
  col5.children[0].addEventListener("input", validacionMontoConCorreccionPagoTotalUSDMensualidad);

  //INPUT DEL PRECIO DEL DOLAR

  let col6 = crearCeldaConInput("text", numberAformatoMontos(precioDolar), "validacionMontoEstiloBDV"); //PRECIO DOLAR

  //SELECTOR DE DESCUENTOS

  let col7 = crearCeldaConSelect(arrayDescuentos, "", 0); //SELECTOR DESCUENTOS
  col7.children[0].addEventListener("change", seleccionarDescuentoSelectInscripcion);

  let indexSelectBox = determinarSelectedIndexDescuentoInscripcion(contenedorFlags);

  col7.children[0].selectedIndex = indexSelectBox;

  //EL CHECKBOX DEL PAGO

  let col8 = crearCeldaConInput("checkbox", false, "");
  col8.children[0].addEventListener("change", seleccionarEstudiantePagar);

  let arrayCeldas = [];

  arrayCeldas.push(col1);
  arrayCeldas.push(col2);
  arrayCeldas.push(col3);
  arrayCeldas.push(col4);
  arrayCeldas.push(col5);
  arrayCeldas.push(col6);
  arrayCeldas.push(col7);
  arrayCeldas.push(col8);

  tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

function dibujarFilaConceptoConsultarEstudiante(datosEstudiante, concepto, monto, contenedorFlags){

  let tabla = document.getElementById("tabla-estudiante-consultado-encabezado");

  let arrayDescuentos = [
      "Ninguno",
      "Pronto Pago",
      "Hermano",
      "Pronto Pago + Hermanos",
      "Empleado",
      "Empleado + Pronto Pago"
  ];


  let col1 = crearCeldaConTexto(datosEstudiante.nombres + " " + datosEstudiante.apellidos);
  let col2 = crearCeldaConTexto(datosEstudiante.cedula);
  let col3 = crearCeldaConTexto(datosEstudiante.curso);
  let col4 = crearCeldaConTexto(concepto);

  //EL MONTO A PAGAR

  let col5 = crearCeldaConInput("text", monto, "");
  col5.children[0].addEventListener("input", validacionMontoConCorreccionPagoTotalUSDMensualidad);

  let col6 = crearCeldaConInput("text", numberAformatoMontos(precioDolar), "validacionMontoEstiloBDV"); //PRECIO DOLAR

  //SELECTOR DE DESCUENTOS

  let col7 = crearCeldaConSelect(arrayDescuentos, "", 0); //SELECTOR DESCUENTOS
  col7.children[0].addEventListener("change", cambiarMontoDolaresDescuento);
  col7.children[0].selectedIndex = determinarDescuentosAplicadosSelect(contenedorFlags, concepto);

  //EL CHECKBOX DEL PAGO

  let col8 = crearCeldaConInput("checkbox", false, "");
  col8.children[0].addEventListener("change", seleccionarEstudiantePagar);

  let arrayCeldas = [];

  arrayCeldas.push(col1);
  arrayCeldas.push(col2);
  arrayCeldas.push(col3);
  arrayCeldas.push(col4);
  arrayCeldas.push(col5);
  arrayCeldas.push(col6);
  arrayCeldas.push(col7);
  arrayCeldas.push(col8);

  tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));


}

function determinarMontoConDescuentoInscripcion(curso){


  let petic = {
    tipo: "precio",
    tipo2: "inscripcion",
    tipo3: "",
    flagEmpleado: false,
    flagHermanos: false,
    annoConsultado: annoEscolarConsultado
  };

  if(contadorHermanos > 1) petic.flagHermanos = true;
  if(tipoRepresentante == "Empleado") petic.flagEmpleado = true;

  if(curso.includes("Año")) petic.tipo3 = "bachillerato";
  if(curso.includes("Grado")) petic.tipo3 = "primaria";
  if(curso.includes("Nivel")) petic.tipo3 = "preescolar";

  let precio = new peticion();
  
  return precio.procesar(petic);

}

function determinarSelectedIndexDescuentoInscripcion(contenedorFlags){

    let petic = {

      tipo: "selectedIndex",
      tipo2: "descuentoInscripcion",
      flagHermanos: contenedorFlags.hermanos,
      flagEmpleado: contenedorFlags.empleado,
      annoConsultado: annoEscolarConsultado

    };

    let obtenerIndex = new peticion();
    return obtenerIndex.procesar(petic);
  
}

function determinarDescuentosAplicadosSelect(contenedorFlags, concepto){

  let petic = {
    tipo: "selectedIndex",
    tipo2: "descuentoMensualidad",
    tipo3: concepto,
    flagEmpleado: contenedorFlags.empleado,
    flagHermanos: contenedorFlags.hermanos,
    annoConsultado: annoEscolarConsultado

  };

  let obtenerIndex = new peticion();

  return obtenerIndex.procesar(petic);
}

function determinarCostoMensualidad(curso, contenedorFlags, mes){

  let petic = {

    tipo: "precio",
    tipo2: "mensualidad",
    tipo3: "",
    tipo4: mes,
    flagEmpleado: contenedorFlags.empleado,
    flagHermanos: contenedorFlags.hermanos,
    annoConsultado: annoEscolarConsultado

  };

  if(curso.includes("Año")) petic.tipo3 = "bachillerato";
  if(curso.includes("Grado")) petic.tipo3 = "primaria";
  if(curso.includes("Nivel")) petic.tipo3 = "preescolar";

  let precio = new peticion();

  return precio.procesar(petic);

}

function calcularMontoTotalPagarMensualidad(){
  let tablaMensualidades = document.getElementById("tabla-estudiante-consultado-encabezado");
  document.getElementById("totalPagarMensualidad").textContent = "0,00";
  let contadorBS = 0;
  let contadorUSD = 0;
  for(let i = 1; i <= tablaMensualidades.rows.length - 1; i++){
    if(tablaMensualidades.rows[i].cells[7].children[0].checked == true){

        contadorUSD = sumaDecimal(numberAformatoMontos(contadorUSD),
                                  tablaMensualidades.rows[i].cells[4].children[0].value);
    }
  }
  document.getElementById("totalPagarMensualidad").textContent = numberAformatoMontos(contadorUSD);
}

function seleccionarEstudiantePagar(){
    let tablaConsultas = document.getElementById("tabla-estudiante-consultado-encabezado");
    let verificador = 0;
    calcularMontoTotalPagarMensualidad();
    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){
      if(tablaConsultas.rows[i].cells[7].children[0].checked == false && document.getElementById("pagar-todos-los-meses-estudiante-input").checked == true){
        document.getElementById("pagar-todos-los-meses-estudiante-input").checked = false;
      }
      if(tablaConsultas.rows[i].cells[7].children[0].checked == true && document.getElementById("pagar-todos-los-meses-estudiante-input").checked == false){
        verificador++;
      }
    }
    if(verificador == (tablaConsultas.rows.length - 1)){
      document.getElementById("pagar-todos-los-meses-estudiante-input").checked = true;
    }
}

function sumarMontosBolivaresTablaConfirmarPagar(){
  let tablaPagos = document.getElementById("tabla-estudiante-pagado-encabezado");
  let suma = "0,00";
  for(let i = 1; i <= tablaPagos.rows.length - 1; i++){
    suma = sumaDecimal(suma, tablaPagos.rows[i].cells[5].children[0].value);
    suma = numberAformatoMontos(suma);
  }
  return suma;
}

function checkboxesInvalidos(){

  let tabla = document.getElementById("tabla-estudiante-consultado-encabezado");

  let contadorCheckboxes = 0;

  for(let i = 1; i <= tabla.rows.length - 1; i++){

    if(tabla.rows[i].cells[7].children[0].checked == true) contadorCheckboxes++; 

  }

  if(contadorCheckboxes > 0) return false;
  else{
    mostrarPantallaError("Seleccione uno o más conceptos de pago, por favor");
    return true;
  }

}

function checkboxesMesesInvalidos(){

  let tabla = document.getElementById("tabla-estudiante-consultado-encabezado");

  let cedula;

  let cedulaYaProcesada = "";

  for(let i = 1; i <= tabla.rows.length - 2; i++){

    cedula = tabla.rows[i].cells[1].textContent;

    if(cedula == cedulaYaProcesada) continue;

    cedulaYaProcesada = cedula;

    if(checkboxesMesesInvalidosPorCedula(cedula)) return true;

  }

  return false;

}

function checkboxesMesesInvalidosPorCedula(cedula){ //ME TIRE UN O((N A LA K) + M - 1) PA NO PENSAR

  let tabla = document.getElementById("tabla-estudiante-consultado-encabezado");

  let arrayMeses = [];
  
  let arrayMes;

  let cedulaTabla;

  let mesActual;

  let mesSiguiente;

  let checkMesActual;

  let checkMesSiguiente;

  for(let i = 1; i <= tabla.rows.length - 1; i++){

    cedulaTabla = tabla.rows[i].cells[1].textContent;

    if(cedula == cedulaTabla){

      arrayMes = [tabla.rows[i].cells[3].textContent, tabla.rows[i].cells[7].children[0].checked];

      arrayMeses.push(arrayMes);

    }

  }

  for(let i = 0; i <= arrayMeses.length - 1; i++){

    debugger;

    if(i == arrayMeses.length - 1) return false; //YA NO IMPORTA SI ESTA MARCADO O NO



    mesActual = arrayMeses[i][0];
    mesSiguiente = arrayMeses[i + 1][0];

    checkMesActual = arrayMeses[i][1];
    checkMesSiguiente = arrayMeses[i + 1][1];

    if(checkMesSiguiente && !checkMesActual){

      mostrarPantallaError("El mes de " + mesSiguiente + " está marcado sin haber marcado el mes de " + mesActual);
      return true;           

    }

  }

}

function precioConceptoInvalido(){

  let tabla = document.getElementById("tabla-estudiante-consultado-encabezado");

  for(let i = 1; i <= tabla.rows.length - 1; i++){

    if(tabla.rows[i].cells[4].children[0].value == "0,00"){
      mostrarPantallaError("Inserte un precio en dólares superior a cero en la fila " + i);
      return true;
    }
  }

  return false;
}

function precioDolarInvalido(){

  let tabla = document.getElementById("tabla-estudiante-consultado-encabezado");

  for(let i = 1; i <= tabla.rows.length - 1; i++){

    if(tabla.rows[i].cells[5].children[0].value == "0,00"){
      mostrarPantallaError("Inserte un precio del dólar superior a cero en la fila " + i);
      return true;
    }
  }

  return false; 

}

function MostrarTablaPagar(){

    if(checkboxesMesesInvalidos()) return;
    if(checkboxesInvalidos()) return;
    if(precioConceptoInvalido()) return;
    if(precioDolarInvalido()) return;

    let datos = {
      nombre: "",
      cedula: "",
      curso: "",
      concepto: "",
      montoUSD: "",
      montoBS: "",
      descuento: "",
      precioDelDolar: "",
    };


    let tablaMensualidades = document.getElementById("tabla-estudiante-consultado-encabezado");
    let tablaPagos = document.getElementById("tabla-estudiante-pagado-encabezado");


  
    for(let j = tablaPagos.rows.length - 1; j > 0; j--){
      tablaPagos.removeChild(tablaPagos.lastChild);
    }

    for(let i = 1; i <= tablaMensualidades.rows.length - 1; i++){

        if(tablaMensualidades.rows[i].cells[7].children[0].checked == false) continue;

        datos.nombre = tablaMensualidades.rows[i].cells[0].textContent;
        datos.cedula = tablaMensualidades.rows[i].cells[1].textContent;
        datos.curso = tablaMensualidades.rows[i].cells[2].textContent;
        datos.concepto = tablaMensualidades.rows[i].cells[3].textContent;
        datos.montoUSD = tablaMensualidades.rows[i].cells[4].children[0].value;
        datos.precioDelDolar = tablaMensualidades.rows[i].cells[5].children[0].value;
        datos.descuento = tablaMensualidades.rows[i].cells[6].children[0].options[tablaMensualidades.rows[i].cells[6].children[0].selectedIndex].textContent;
        datos.montoBS = numberAformatoMontos(productoPrecision2(formatoMontosAnumber(datos.montoUSD), formatoMontosAnumber(datos.precioDelDolar)));

        dibujarFilaConfirmar(datos);


    }
    document.getElementById("Total-Pagar-consultarUSD").textContent = document.getElementById("totalPagarMensualidad").textContent;
    document.getElementById("Total-Pagar-consultarBS").textContent = sumarMontosBolivaresTablaConfirmarPagar();
    pagarEstudiantes();
}

function dibujarFilaConfirmar(datos){

  let tablaPagos = document.getElementById("tabla-estudiante-pagado-encabezado");

  let col1 = crearCeldaConTexto(datos.nombre);
  let col2 = crearCeldaConTexto(datos.cedula);
  let col3 = crearCeldaConTexto(datos.curso);
  let col4 = crearCeldaConTexto(datos.concepto);
  let col5 = crearCeldaConTexto(datos.montoUSD);
  let col6 = crearCeldaConInput("text", datos.montoBS, "");
  let col7 = crearCeldaConTexto(datos.descuento);
  let col8 = crearCeldaConTexto(datos.precioDelDolar);

  col6.children[0].addEventListener("input", validacionMontoConCorreccionPagoTotalMensualidad);

  let arrayCeldas = [];

  arrayCeldas.push(col1);
  arrayCeldas.push(col2);
  arrayCeldas.push(col3);
  arrayCeldas.push(col4);
  arrayCeldas.push(col5);
  arrayCeldas.push(col6);
  arrayCeldas.push(col7);
  arrayCeldas.push(col8);

  tablaPagos.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

async function entrarGestionarMensualidades(){
    mostrarPantallaCarga();
    await obtenerPreciosMensualidad();
    await obtenerPrecioInscripcion();
    let mainContainerGestionMensualidades = document.getElementById("main-container-GestionMensualidades");
    let mainContainerPostLogin = document.getElementById("main-container-postLogin");
    mainContainerPostLogin.style.display = "none";
    mainContainerGestionMensualidades.style.display = "block";
    ocultarPantallaCarga();
}



function consultarEstudianteParticular(){
    document.getElementById("totalPagarMensualidad").textContent = "0,00";
    document.getElementById("main-container-GestionMensualidades").style.display = "none";
    document.getElementById("main-container-ConsultaEstudiante").style.display = "block";
}

function atrasConsultarEstudiantes(){
    document.getElementById("main-container-GestionMensualidades").style.display = "block";
    document.getElementById("main-container-ConsultaEstudiante").style.display = "none";
    document.getElementById("pagar-todos-los-meses-estudiante-input").checked = false;
}

function pagarEstudiantes(){
    document.getElementById("main-container-ConsultaEstudiante").style.display = "none";
    document.getElementById("main-container-PagarEstudiante").style.display = "block";
}

function atrasPagosMensualidades(){
    document.getElementById("main-container-PagarEstudiante").style.display = "none";
    document.getElementById("main-container-ConsultaEstudiante").style.display = "block";
    document.getElementById("Total-Pagar-consultarUSD").textContent = "";
}

function atrasMensualidades(){
  
    document.getElementById("main-container-GestionMensualidades").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";

    ocultarElementosInterazConsultarRepresentante();

    document.getElementById("mes-en-curso").selectedIndex = 0;
    document.getElementById("cedula-representante-consultar").value = "";
}

function entrarPagarMensualidad(){
    limpiarValoresTotalPagarPantallaPagos();
    document.getElementById("montoPagarDolares").textContent = document.getElementById("Total-Pagar-consultarUSD").textContent;
    document.getElementById("montoPagarBolivares").textContent = document.getElementById("Total-Pagar-consultarBS").textContent;
    document.getElementById("montoAbonarPantallaPagos").textContent = "N/A";
    document.getElementById("main-container-PagarEstudiante").style.display = "none";
    document.getElementById("mainContainerPagar").style.display = "block";
    setTipoPago("Mensualidad");
}

function validarCheckboxesConsultarEstudiantes(){

  let tablaConsultar = document.getElementById("tabla-consultar-estudiante-encabezado");
  let marcadorCheckboxes = 0;

  for(let i = 1; i <= tablaConsultar.rows.length - 1; i++){
    if(tablaConsultar.rows[i].cells[6].children[0].checked == true) marcadorCheckboxes++;
  }
  if(marcadorCheckboxes == 0){
    mostrarPantallaError("Seleccione uno o más estudiantes a consultar, por favor...");
    return 1;
  }
  return 0;

}

function mostrarElementosInterazConsultarRepresentante(){

  document.getElementById("nombre-representante-consultar").style.display = "flex";
  document.getElementById("verCuentaAbonoRepresentanteMensualidad").style.display = "flex";
  document.getElementById("totalAbonosRepresentanteConsultar").style.display = "flex";
  document.getElementById("tablaConsultar").style.display = "block"; // CONTENEDOR DE LA TABLA
  document.getElementById("consultarEstudiantes").style.display = "flex"; //BOTON DE CONSULTAR LOS ESTUDIANTES
  document.getElementById("marcarTodosLosEstudiantesConsultar").checked = false;

}

function ocultarElementosInterazConsultarRepresentante(){

  document.getElementById("nombre-representante-consultar").style.display = "none";
  document.getElementById("verCuentaAbonoRepresentanteMensualidad").style.display = "none";
  document.getElementById("totalAbonosRepresentanteConsultar").style.display = "none";
  document.getElementById("tablaConsultar").style.display = "none"; //EL CONTENEDOR DE LA TABLA
  document.getElementById("consultarEstudiantes").style.display = "none";

}