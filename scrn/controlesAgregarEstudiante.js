/*global document, console */

import {extraerNumerosPuntosComasDeUnaCadena, 
        productoPrecision2, 
        numberAformatoMontos, 
        eliminarOcurrenciasElementoArray, 
        extraerDiaDelMes, 
        verSiEsNumeroEntero, 
        cambiarAFechaVenezolana, 
        extraerNumerosPuntosComasBarrasGuionesDeUnaCadena,
        sumaDecimal, 
        restaDecimal} from "./utilidades.js";

import {precioInscripcionPreescolar, 
        precioInscripcionPrimaria, 
        precioInscripcionBachillerato, 
        descuentoEmpleado, 
        descuentoHermanos, 
        descuentoProntoPagoInscripcion as descuentoProntoPago, 
        precioDolar as precioDolarInscripcion, 
        annoEnCurso} from "./obtenerPrecios.js";

import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { setTipoPago } from "./controlesEfectuarPago.js";
import { generarImagen } from "./impresion.js";

export {escribirFormularioDigitalRepresentanteAgregar, 
        paginaSiguienteAgregar, 
        paginaAnteriorAgregar, 
        agregarPaginaEstudianteAgregar, 
        eventListenerCalcularCostoAgregar, 
        eventListenerTipoRepresentanteInscribir, 
        entrarConsultaImpresionAgregar, 
        entrarPantallaPagosAgregar, 
        limpiarFormulariosAgregar, 
        respuestaSIFormularioImprimirAgregar, 
        respuestaNOFormularioImprimirAgregar, 
        listaDeCursosAgregar, 
        tipoDescuentoDeterminado, 
        calcularCostosAgregar
};

let numeroPaginaFormulariosAgregarImprimir = 1;
let arrayPaginasAgregar = ["agregarPG1", "agregarPG2"];
let flagEmpleado = 0;
let flagProntoPago = 0;
let tipoDescuentoDeterminado = "Ninguno";

function entrarConsultaImpresionAgregar(){
    let tabla = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
    document.getElementById("main-container-PagoAgregarRealizado").style.display = "none";
    document.getElementById("PantallaPreguntaImprimirFormularioAgregar").style.display = "block";
    if(numeroPaginaFormulariosAgregarImprimir != 1) numeroPaginaFormulariosAgregarImprimir = 1;
    document.getElementById("mensajePreguntaImprimirFormularioAgregar").innerHTML = "¿Imprimir Formulario de Inscripción para ";
    document.getElementById("mensajePreguntaImprimirFormularioAgregar").innerHTML += tabla[1].children[0].value + " " + tabla[1].children[1].value + " (estudiante " + numeroPaginaFormulariosAgregarImprimir + ")?";
}

function eliminarPaginasExtraFormulariosAgregar(){
    let tabla = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
    while(true){
        if(tabla.length > 2){
            document.getElementById("contenedorInscripcionAgregar").removeChild(document.getElementById("contenedorInscripcionAgregar").children[document.getElementById("contenedorInscripcionAgregar").children.length - 2]);
        }
        else{
            break;
        }
    }
    arrayPaginasAgregar = ["agregarPG1", "agregarPG2"];
    document.getElementById("PgListaAgregar").textContent = 1;
  }
  
  function limpiarFormulariosRepresentanteAgregar(){
    let formulario = document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0];
    formulario.children[0].value = "";
    formulario.children[1].value = "";
    formulario.children[2].value = "";
    formulario.children[3].value = "";
    formulario.children[4].selectedIndex = 0;
    formulario.children[5].value = "";
    formulario.children[6].value = "";
    formulario.children[7].value = "";
    formulario.children[8].value = "";
    formulario.children[9].value = "";
  }
  
  function limpiarFormulariosEstudianteAgregar(){
    let formulario = document.getElementsByClassName("subcajaFormularioAgregarDerecha")[1];
    formulario.children[0].value = "";
    formulario.children[1].value = "";
    formulario.children[2].value = "";
    formulario.children[3].selectedIndex = 0;
    formulario.children[4].selectedIndex = 0;
    formulario.children[5].selectedIndex = 0;
    formulario.children[6].selectedIndex = 0;
    formulario.children[7].value = "";
    formulario.children[8].value = "";
    formulario.children[9].selectedIndex = 0;
    formulario.children[10].value = "";
  }
  
  function ocultarSelectsCursoAgregarEstudiante(){
    let cursoSelect = document.getElementsByClassName("subcajaFormularioAgregarDerecha")[1].children[5];
    for(let i = 1; i <= cursoSelect.children.length - 1; i++){
        cursoSelect.children[i].style.display = "none";
    }
  }
  
  function limpiarFormulariosAgregar(){ //ESTA VA EXPORTADA
    eliminarPaginasExtraFormulariosAgregar();
    limpiarFormulariosRepresentanteAgregar();
    limpiarFormulariosEstudianteAgregar();
    ocultarSelectsCursoAgregarEstudiante();
    document.getElementById("agregarPG1").style.display = "block";
    document.getElementById("agregarPG2").style.display = "none";
    document.getElementById("agregarAtras").style.visibility = "hidden";
    document.getElementById("agregarSiguiente").style.display = "flex";
    document.getElementById("agregarAgregar").style.display = "none";
    document.getElementById("totalPagarAgregar").textContent = "0,00";
    document.getElementById("totalPagarAgregarBolivares").textContent = "0,00";
    document.getElementById("cedulaRepresentanteAgregar").value = "";
    document.getElementById("tipoDescuentoAgregar").textContent = "Ninguno";
  }
  
  function limpiarFormularioAgregarPostPago(){
  
      //REVISAR LOS FORMULARIOS QUE CONTIENEN LOS INPUTS OCULTOS DE ESTUDIANTES
      eliminarPaginasExtraFormulariosAgregar();
      limpiarFormulariosRepresentanteAgregar();
      limpiarFormulariosEstudianteAgregar();
      ocultarSelectsCursoAgregarEstudiante();
      document.getElementById("agregarPG1").style.display = "block";
      document.getElementById("agregarPG2").style.display = "none";
      document.getElementById("agregarAtras").style.visibility = "hidden";
      document.getElementById("agregarSiguiente").style.display = "flex";
      document.getElementById("agregarAgregar").style.display = "none";
      document.getElementById("main-container-PagoAgregarRealizado").style.display = "none";
      document.getElementById("mainContainerAgregarEstudiante").style.display = "block";
      document.getElementById("totalPagarAgregar").textContent = "0,00";
      document.getElementById("totalPagarAgregarBolivares").textContent = "0,00";
      document.getElementById("tablaAgregarImprimir").removeChild(document.getElementById("tablaAgregarImprimir").children[0]);
      document.getElementById("cedulaRepresentanteAgregar").value = "";
      document.getElementById("tipoDescuentoAgregar").textContent = "Ninguno";
  }
  
  async function crearFormularioInscripcionAgregar(tabla, i){
      await generarImagen(tabla[i].children[0].value, 
          tabla[i].children[1].value, 
          tabla[i].children[2].value,
          tabla[i].children[3].options[tabla[i].children[3].selectedIndex].textContent,
          cambiarAFechaVenezolana(tabla[i].children[7].value, tabla[i].children[8].value),
          tabla[i].children[8].value, 
          tabla[i].children[9].options[tabla[i].children[9].selectedIndex].textContent,
          tabla[i].children[10].value, 
          tabla[0].children[0].value + " " + tabla[0].children[1].value,
          tabla[0].children[2].value, 
          tabla[0].children[5].value, 
          tabla[0].children[3].value, 
          tabla[0].children[6].value,
          tabla[0].children[7].value, 
          tabla[0].children[8].value, 
          tabla[0].children[9].value,
          tabla[i].children[5].options[tabla[i].children[5].selectedIndex].textContent, 
          extraerNumerosPuntosComasDeUnaCadena(document.getElementById("tablaAgregarImprimir").children[0].children[6].children[0].textContent), 
          extraerNumerosPuntosComasBarrasGuionesDeUnaCadena(document.getElementById("tablaAgregarImprimir").children[0].children[5].children[0].textContent),
          annoEnCurso);
  }

  async function respuestaSIFormularioImprimirAgregar(){
      let i = numeroPaginaFormulariosAgregarImprimir;                                      
      let tabla = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
      crearFormularioInscripcionAgregar(tabla, i);
      numeroPaginaFormulariosAgregarImprimir++;
      if(numeroPaginaFormulariosAgregarImprimir == (tabla.length)){
          document.getElementById("PantallaPreguntaImprimirFormularioAgregar").style.display = "none";
          limpiarFormularioAgregarPostPago();
      }
      else{
          document.getElementById("mensajePreguntaImprimirFormularioAgregar").innerHTML = "¿Imprimir Formulario de Inscripción para ";
          document.getElementById("mensajePreguntaImprimirFormularioAgregar").innerHTML += tabla[numeroPaginaFormulariosAgregarImprimir].children[0].value + " " + tabla[numeroPaginaFormulariosAgregarImprimir].children[1].value + " (estudiante #" + numeroPaginaFormulariosAgregarImprimir + ")?";
      }
  }
  
  function respuestaNOFormularioImprimirAgregar(){
      let i = numeroPaginaFormulariosAgregarImprimir;                                      
      let tabla = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
      numeroPaginaFormulariosAgregarImprimir++;
      if(numeroPaginaFormulariosAgregarImprimir == tabla.length){
          document.getElementById("PantallaPreguntaImprimirFormularioAgregar").style.display = "none";
          limpiarFormularioAgregarPostPago();
      }
      else{
          document.getElementById("mensajePreguntaImprimirFormularioAgregar").textContent = "¿Imprimir Formulario de Inscripción para ";
          document.getElementById("mensajePreguntaImprimirFormularioAgregar").textContent += tabla[numeroPaginaFormulariosAgregarImprimir].children[0].value + " " + tabla[numeroPaginaFormulariosAgregarImprimir].children[1].value + " (estudiante " + numeroPaginaFormulariosAgregarImprimir + ")?";
      }
  }

function eventListenerTipoRepresentanteInscribir(){
    flagEmpleado = 0;
    flagProntoPago = 0;
    let formularios = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
    let tipoRepresentante = formularios[0].children[4];
    if(tipoRepresentante.selectedIndex == 2){
      flagEmpleado = 1;
    }
    calcularCostosAgregar();
  }

function paginaSiguienteAgregar(){
    let paginaActual = document.getElementById("PgListaAgregar").textContent;
    console.log(arrayPaginasAgregar);
    paginaActual = parseInt(paginaActual);
    let nombreIdPagina = arrayPaginasAgregar[paginaActual - 1];
    document.getElementById(arrayPaginasAgregar[paginaActual - 1]).style.display = "none";
    document.getElementById(arrayPaginasAgregar[paginaActual]).style.display = "block";
    document.getElementById("PgListaAgregar").textContent = paginaActual + 1;
    document.getElementById("agregarAtras").style.visibility = "visible";
    if(arrayPaginasAgregar[arrayPaginasAgregar.length - 1] == arrayPaginasAgregar[paginaActual]){
        document.getElementById("agregarAgregar").style.display = "block";
        document.getElementById("agregarSiguiente").style.display = "none";     
    }
}

function paginaAnteriorAgregar(){
    let paginaActual = document.getElementById("PgListaAgregar").textContent;
    console.log(arrayPaginasAgregar);
    paginaActual = parseInt(paginaActual);
    let nombreIdPagina = arrayPaginasAgregar[paginaActual - 1];
    document.getElementById(arrayPaginasAgregar[paginaActual - 1]).style.display = "none";
    document.getElementById(arrayPaginasAgregar[paginaActual - 2]).style.display = "block";
    document.getElementById("PgListaAgregar").textContent = paginaActual - 1;
    document.getElementById("agregarSiguiente").style.display = "flex"; 
    document.getElementById("agregarAtras").style.visibility = "visible";
    document.getElementById("agregarAgregar").style.display = "none";
    if(arrayPaginasAgregar[0] == arrayPaginasAgregar[paginaActual - 2]){
        document.getElementById("agregarAtras").style.visibility = "hidden";
    }
}

function calcularCostosAgregar(){
    flagEmpleado = 0;
    flagProntoPago = 0;  
    let formularios = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
    let tipoRepresentante = formularios[0].children[4];
    if(tipoRepresentante.selectedIndex == 2){
      flagEmpleado = 1;
    }
    if(extraerDiaDelMes() <= 5) flagProntoPago = 1;
    let totalPagar = document.getElementById("totalPagarAgregar");
    let totalPagarBolivares = document.getElementById("totalPagarAgregarBolivares");
    let sumadorPreescolar = 0;
    let sumadorPrimaria = 0;
    let sumadorBachillerato = 0;
    let totalProcesado;
    let totalProcesadoBolivares;
    let hermanos = formularios.length - 1;
    let estudiantes = formularios.length - 1;
    let tipoDescuento = document.getElementById("tipoDescuentoAgregar");
    totalPagar.textContent = "";
    totalPagarBolivares.textContent = "";

    if(flagEmpleado == 1){
      hermanos = 0;
      flagProntoPago = 0;
      tipoDescuento.textContent = "Empleado";
      tipoDescuentoDeterminado = "Empleado";
    }
    if(flagProntoPago == 1){
      hermanos = 0;
      tipoDescuento.textContent = "Pronto Pago";
      tipoDescuentoDeterminado = "Pronto Pago";
    }
    if(hermanos >= 2){
      tipoDescuento.textContent = "Hermanos";
      tipoDescuentoDeterminado = "Hermanos";
    }

    if(!(flagEmpleado) && !(flagProntoPago) && !(hermanos >= 2)) {
        hermanos = 0;
        tipoDescuento.textContent = "Ninguno";
        tipoDescuentoDeterminado = "Ninguno";
    }

    for(let i = 1; i <= formularios.length - 1; i++){
        if(formularios[i].children[4].selectedIndex == 1){
            sumadorPreescolar++;          
        }
        if(formularios[i].children[4].selectedIndex == 2){
            sumadorPrimaria++;         
        }
        if(formularios[i].children[4].selectedIndex == 3){
            sumadorBachillerato++;      
        }
    }


    //CALCULO

    totalProcesado = productoPrecision2(sumadorPreescolar, precioInscripcionPreescolar);
    totalProcesado = sumaDecimal(numberAformatoMontos(totalProcesado), 
                                 numberAformatoMontos(productoPrecision2(sumadorPrimaria, precioInscripcionPrimaria)));
    totalProcesado = sumaDecimal(numberAformatoMontos(totalProcesado), 
                                 numberAformatoMontos(productoPrecision2(sumadorBachillerato, precioInscripcionBachillerato)));
    
    totalProcesado = restaDecimal(numberAformatoMontos(totalProcesado), 
                                  numberAformatoMontos(productoPrecision2(hermanos, descuentoHermanos)));
    if(flagEmpleado == 1) totalProcesado = productoPrecision2(totalProcesado, descuentoEmpleado);
    if(flagProntoPago == 1){
      totalProcesado = restaDecimal(numberAformatoMontos(totalProcesado), 
                                    numberAformatoMontos(productoPrecision2(estudiantes, descuentoProntoPago)));
    }

    totalProcesadoBolivares = productoPrecision2(totalProcesado, precioDolarInscripcion);

    //PARTE DE DOLARES

    totalPagar.textContent = numberAformatoMontos(totalProcesado);

    //PARTE DE BOLIVARES

    totalPagarBolivares.textContent = numberAformatoMontos(totalProcesadoBolivares);

    //CORRECCION EN CASO DE QUE SEA NEGATIVO

    if(totalProcesado < 0){
      totalPagar.textContent = "0,00";
      totalPagarBolivares.textContent = "0,00";
    }
}

function borrarPaginaEstudianteAgregar(){
    let paginaActual = document.getElementById("PgListaAgregar").textContent;
    let numeroContador = parseInt(paginaActual);
    this.parentNode.parentNode.style.display = "none";
    document.getElementById(arrayPaginasAgregar[numeroContador - 2]).style.display = "block";
    arrayPaginasAgregar = eliminarOcurrenciasElementoArray(arrayPaginasAgregar, arrayPaginasAgregar[numeroContador - 1]);
    document.getElementById("PgListaAgregar").textContent = numeroContador - 1;
    this.parentNode.parentNode.remove();
    calcularCostosAgregar();
}

function listaDeCursosAgregar(){
    let preescolar = this.parentNode.children[5].getElementsByClassName("curso-preescolar");
    let primaria = this.parentNode.children[5].getElementsByClassName("curso-primaria");
    let bachillerato = this.parentNode.children[5].getElementsByClassName("curso-bachillerato");
    this.parentNode.children[5].selectedIndex = 0;
    if(this.selectedIndex == 0){ //OCULTAR TODOS LOS CURSOS AL SELECCIONAR "CURSO"
        for(let i = 0; i <= 2; i++){
            preescolar[i].style.display = "none";
        }
        for(let i = 0; i <= 5; i++){
            primaria[i].style.display = "none";
        }
        for(let i = 0; i <= 4; i++){
            bachillerato[i].style.display = "none";
        }
    }
    if(this.selectedIndex == 1){ //MOSTRAR LOS CURSOS DE PREESCOLAR
        for(let i = 0; i <= 2; i++){
            preescolar[i].style.display = "block";
        }
        for(let i = 0; i <= 5; i++){
            primaria[i].style.display = "none";
        }
        for(let i = 0; i <= 4; i++){
            bachillerato[i].style.display = "none";
        }
    }
    if(this.selectedIndex == 2){ //MOSTRAR LOS CURSOS DE PRIMARIA
        for(let i = 0; i <= 2; i++){
            preescolar[i].style.display = "none";
        }
        for(let i = 0; i <= 5; i++){
            primaria[i].style.display = "block";
        }
        for(let i = 0; i <= 4; i++){
            bachillerato[i].style.display = "none";
        }
    }
    if(this.selectedIndex == 3){ //MOSTRAR LOS CURSOS DE BACHILLERATO
        for(let i = 0; i <= 2; i++){
            preescolar[i].style.display = "none";
        }
        for(let i = 0; i <= 5; i++){
            primaria[i].style.display = "none";
        }
        for(let i = 0; i <= 4; i++){
            bachillerato[i].style.display = "block";
        }
    }
}

function eventListenerCalcularCostoAgregar(){
    flagEmpleado = 0;
    flagProntoPago = 0;
    let formularios = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
    let tipoRepresentante = formularios[0].children[4];
    if(tipoRepresentante.selectedIndex == 0){
      mostrarPantallaError("Introduzca la Cédula del Representante para Obtener los Datos");
      this.selectedIndex = 0;
      return 0;
    }
    if(tipoRepresentante.selectedIndex == 2){
      flagEmpleado = 1;
    }
    calcularCostosAgregar();
  }

function agregarPaginaEstudianteAgregar(){
    let numeroContador = document.getElementById("PgListaAgregar").textContent;
    numeroContador = parseInt(numeroContador);
    let numeroExtrayendo = extraerNumerosPuntosComasDeUnaCadena(arrayPaginasAgregar[numeroContador - 1]);
    numeroExtrayendo = parseInt(numeroExtrayendo);
    let numeroPaginaSiguiente = numeroExtrayendo + 1;
    let cadenaSiguienteElemento = "agregarPG" + numeroPaginaSiguiente;
    arrayPaginasAgregar.push(cadenaSiguienteElemento);
    document.getElementById("PgListaAgregar").textContent = numeroContador + 1;
    let nuevaPagina = document.createElement("div");
    let contenedorDiv = document.createElement("div");
    let botonBorrar = document.createElement("img");
    botonBorrar.src = "rsrcs/delete.png";
    botonBorrar.className = "icono";
    botonBorrar.addEventListener("click", borrarPaginaEstudianteAgregar);
    let h1 = document.createElement("h1");
    let cajaLabels = document.createElement("div");
    let cajaContenedora = document.createElement("div");
    let cajaInputs = document.createElement("div");
    let sexoArray = ["Sexo", "Masculino", "Femenino"];
    let gradoArray = ["Grado de Instrucción", "Preescolar", "Primaria", "Bachillerato"];
    let cursoArray = ["Curso", "Primer Nivel", "Segundo Nivel", "Tercer Nivel", "Primer Grado", 
    "Segundo Grado", "Tercer Grado", "Cuarto Grado", "Quinto Grado", "Sexto Grado", 
    "Primer Año", "Segundo Año", "Tercer Año", "Cuarto Año", "Quinto Año"];
    let seccionArray = ["Sección", "Sección A", "Sección B"];
    let estadoArray = ["Estado", "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas",
        "Bolívar", "Carabobo", "Cojedes", "Delta Amacuro", "Dependencias Federales",
        "Distrito Federal", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", "Monagas",
        "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"];
    let mesesArray = ["Septiembre", "Octubre", "Noviembre", "Diciembre", 
                      "Enero","Febrero", "Marzo", "Abril", "Mayo"]; 
    let labelNombres = document.createElement("label");
    let labelApellidos = document.createElement("label");
    let labelCedula = document.createElement("label");
    let labelSexo = document.createElement("label");
    let labelFecha = document.createElement("label");
    let labelLugar = document.createElement("label");
    let labelEstado = document.createElement("label");
    let labelDirección = document.createElement("label");
    let labelGrado = document.createElement("label");
    let labelCurso = document.createElement("label");
    let labelSeccion = document.createElement("label");
    let labelMes = document.createElement("label");
    let inputNombres = document.createElement("input");
    let inputApellidos = document.createElement("input");
    let inputCedula = document.createElement("input");
    let inputSexo = document.createElement("select");
    let inputGrado = document.createElement("select");
    let inputCurso = document.createElement("select");
    let inputSeccion = document.createElement("select");
    let inputFecha = document.createElement("input");
    let inputLugar = document.createElement("input");
    let inputEstado = document.createElement("select");
    let inputDireccion = document.createElement("input");
    let inputMeses = document.createElement("select");
    labelNombres.textContent = "Nombres: ";
    labelApellidos.textContent = "Apellidos: ";
    labelCedula.textContent = "Cédula de Identidad: ";
    labelSexo.textContent = "Sexo: ";
    labelFecha.textContent = "Fecha de Nacimiento: ";
    labelLugar.textContent = "Lugar de Nacimiento: ";
    labelEstado.textContent = "Estado: ";
    labelDirección.textContent = "Dirección: ";
    labelGrado.textContent = "Grado de Instrucción: ";
    labelCurso.textContent = "Curso: ";
    labelSeccion.textContent = "Sección: ";
    labelMes.textContent = "Solvente Hasta: ";
    inputNombres.type = "text";
    inputNombres.placeholder = "Nombres";
    inputApellidos.type = "text";
    inputApellidos.placeholder = "Apellidos";
    inputCedula.type = "number";
    inputCedula.placeholder = "Cédula";
    for(let i = 0; i <= 2; i++) inputSexo.appendChild(document.createElement("option"));
    for(let i = 0; i <= 2; i++) inputSexo.children[i].textContent = sexoArray[i];
    for(let i = 0; i <= 3; i++) inputGrado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 3; i++) inputGrado.children[i].textContent = gradoArray[i];
    inputGrado.addEventListener("change", listaDeCursosAgregar);
    inputGrado.addEventListener("change", eventListenerCalcularCostoAgregar);
    for(let i = 0; i <= 14; i++) inputCurso.appendChild(document.createElement("option"));
    for(let i = 0; i <= 14; i++) inputCurso.children[i].textContent = cursoArray[i];
    for(let i = 1; i <= 3; i++) inputCurso.children[i].className = "curso-preescolar";
    for(let i = 4; i <= 9; i++) inputCurso.children[i].className = "curso-primaria";
    for(let i = 10; i <= 14; i++) inputCurso.children[i].className = "curso-bachillerato";
    for(let i = 0; i <= 2; i++) inputSeccion.appendChild(document.createElement("option"));
    for(let i = 0; i <= 2; i++) inputSeccion.children[i].textContent = seccionArray[i]; 
    for(let i = 0; i <= 8; i++) inputMeses.appendChild(document.createElement("option"));
    for(let i = 0; i <= 8; i++) inputMeses.children[i].textContent = mesesArray[i];
    inputFecha.type = "date";
    inputLugar.type = "text";
    inputLugar.placeholder = "Lugar de Nacimiento";
    for(let i = 0; i <= 25; i++) inputEstado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 25; i++) inputEstado.children[i].textContent = estadoArray[i];
    inputDireccion.type = "text";
    inputDireccion.placeholder = "Dirección";
    cajaLabels.classList.add("subcajaFormularioInscripcion");
    cajaInputs.classList.add("subcajaFormularioAgregarDerecha");
    cajaLabels.appendChild(labelNombres);
    cajaLabels.appendChild(labelApellidos);
    cajaLabels.appendChild(labelCedula);
    cajaLabels.appendChild(labelSexo);
    cajaLabels.appendChild(labelGrado);
    cajaLabels.appendChild(labelCurso);
    cajaLabels.appendChild(labelSeccion);
    cajaLabels.appendChild(labelFecha);
    cajaLabels.appendChild(labelLugar);
    cajaLabels.appendChild(labelEstado);
    cajaLabels.appendChild(labelDirección);
    cajaLabels.appendChild(labelMes);
    cajaInputs.appendChild(inputNombres);
    cajaInputs.appendChild(inputApellidos);
    cajaInputs.appendChild(inputCedula);
    cajaInputs.appendChild(inputSexo);
    cajaInputs.appendChild(inputGrado);
    cajaInputs.appendChild(inputCurso);
    cajaInputs.appendChild(inputSeccion);
    cajaInputs.appendChild(inputFecha);
    cajaInputs.appendChild(inputLugar);
    cajaInputs.appendChild(inputEstado);
    cajaInputs.appendChild(inputDireccion);
    cajaInputs.appendChild(inputMeses);
    nuevaPagina.id = cadenaSiguienteElemento;
    h1.classList.add("centradoNoFlex");
    h1.textContent = "Datos Estudiante";
    cajaContenedora.classList.add("cajaFormularioInscripcion");
    cajaContenedora.appendChild(cajaLabels);
    cajaContenedora.appendChild(cajaInputs);
    contenedorDiv.appendChild(h1);
    contenedorDiv.appendChild(botonBorrar);
    contenedorDiv.style.display = "flex";
    contenedorDiv.style.flexDirection = "row";
    contenedorDiv.style.justifyContent = "space-between";
    nuevaPagina.appendChild(contenedorDiv);
    nuevaPagina.appendChild(cajaContenedora);
    document.getElementById("agregarPG" + numeroExtrayendo).style.display = "none";
    document.getElementById("contenedorInscripcionAgregar").insertBefore(nuevaPagina, document.getElementById("contenedorInscripcionAgregar").children[document.getElementById("contenedorInscripcionAgregar").children.length - 1]);
}

function escribirFormularioDigitalRepresentanteAgregar(datosRepresentante){
    document.getElementById("contenedorInscripcionAgregar").style.display = "none";
    document.getElementById("tipoDescuentoAgregar").textContent = "Ninguno";
    let formularios = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
    formularios[0].children[0].value = datosRepresentante.nombres;
    formularios[0].children[1].value = datosRepresentante.apellidos;
    formularios[0].children[2].value = datosRepresentante.cedula;
    formularios[0].children[3].value = datosRepresentante.telefono;
    if(datosRepresentante.tipoRepresentante == "Regular") formularios[0].children[4].selectedIndex = 1;
    if(datosRepresentante.tipoRepresentante == "Empleado"){
      formularios[0].children[4].selectedIndex = 2;
      document.getElementById("tipoDescuentoAgregar").textContent = "Empleado";
    } 
    formularios[0].children[5].value = datosRepresentante.direccionRepresentante;
    formularios[0].children[6].value = datosRepresentante.nombrePadre;
    formularios[0].children[7].value = datosRepresentante.cedulaPadre;
    formularios[0].children[8].value = datosRepresentante.nombreMadre;
    formularios[0].children[9].value = datosRepresentante.cedulaMadre;
    document.getElementById("contenedorInscripcionAgregar").style.display = "flex";
    for(let i = 0; i <= 9; i++) formularios[0].children[i].disabled = true; 
}

function entrarPantallaPagosAgregar(){
    let formularios;
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[0].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(0);
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[1].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(1);
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[2].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(2);
      return 0;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[2].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[3].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(3);
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[4].selectedIndex == 0){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(4);
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[5].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(5);
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[6].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(6);
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[7].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(7);
      return 0;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[7].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[8].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(8);
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[9].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      console.log(9);
      return 0;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioAgregarDerecha")[0].children[9].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 0;
    }
    formularios = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
    for(let i = 1; i <= formularios.length - 1; i++){
      if(formularios[i].children[0].value == ""){
        console.log(formularios[i].children[0].value);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        console.log(0);
        return 0;
      }
      if(formularios[i].children[1].value == ""){
        console.log(formularios[i].children[1].value);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[2].value == ""){
        console.log(formularios[i].children[2].value);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[3].selectedIndex == 0){
        console.log(formularios[i].children[3].selectedIndex);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[4].selectedIndex == 0){
        console.log(formularios[i].children[4].selectedIndex);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[5].selectedIndex == 0){
        console.log(formularios[i].children[5].selectedIndex);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[6].selectedIndex == 0){
        console.log(formularios[i].children[6].selectedIndex);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[7].value == ""){
        console.log(formularios[i].children[7].value);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[8].value == ""){
        console.log(formularios[i].children[8].value);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[9].selectedIndex == 0){
        console.log(formularios[i].children[9].selectedIndex);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
      if(formularios[i].children[10].value == ""){
        console.log(formularios[i].children[10].value);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 0;
      }
    }
    document.getElementById("montoPagarDolares").textContent = document.getElementById("totalPagarAgregar").textContent;
    document.getElementById("montoPagarBolivares").textContent = document.getElementById("totalPagarAgregarBolivares").textContent;
    document.getElementById("mainContainerAgregarEstudiante").style.display = "none";
    document.getElementById("mainContainerPagar").style.display = "block";
    setTipoPago("Agregar");
}