/*global document, console */

import {eliminarOcurrenciasElementoArray, 
        extraerDiaDelMes, 
        extraerNumerosPuntosComasBarrasGuionesDeUnaCadena, 
        extraerNumerosPuntosComasDeUnaCadena, 
        numberAformatoMontos, 
        productoPrecision2, 
        verSiEsNumeroEntero, 
        cambiarAFechaVenezolana,
        sumaDecimal,
        restaDecimal} from "./utilidades.js";
import {mostrarPantallaError, 
        ocultarPantallaCarga} from "./modal.js";
import {precioInscripcionBachillerato, 
        precioInscripcionPreescolar, 
        precioInscripcionPrimaria, 
        precioDolar as precioDolarInscripcion, 
        descuentoHermanos, 
        descuentoProntoPagoInscripcion as descuentoProntoPago, 
        descuentoEmpleado,
        annoEnCurso} from "./obtenerPrecios.js";

import { setTipoPago } from "./controlesEfectuarPago.js";
import { generarImagen } from "./impresion.js";
import { verificarSolvenciaReinscripcion } from "./reinscribir.js";

export {acomodarArrayListaEstudiantes, 
        escribirFormularioDigitalEstudiante, 
        escribirFormularioDigitalRepresentante, 
        agregarPaginaEstudianteReinscripcion, 
        paginaAnteriorReinscripcion, 
        paginaSiguienteReinscripcion, 
        limpiarFormulariosReinscripcion,
        listaDeCursosReinscribir, 
        eventListenerCalcularCostoReinscripcion, 
        entrarPantallaPagosReinscribir, 
        respuestaSIFormularioImprimirReinscripcion, 
        respuestaNOFormularioImprimirReinscripcion, 
        entrarConsultaImpresionReinscripcion, 
        limpiarFormulariosReinscripcionBuscar, 
        tipoDescuentoDeterminado};

let numeroPaginaFormulariosReinscribirImprimir = 1;
let arrayPaginasReinscribir = ["reinscribirPG1", "reinscribirPG2"];
let flagEmpleado = 0;
let flagProntoPago = 0;
let tipoDescuentoDeterminado;

function eventListenerTipoRepresentanteReinscribir(){
    flagEmpleado = 0;
    flagProntoPago = 0;
    let formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    let tipoRepresentante = formularios[0].children[4];
    if(tipoRepresentante.selectedIndex == 2){
      flagEmpleado = 1;
    }
    calcularCostosReinscripcion();
}

function entrarConsultaImpresionReinscripcion(){
    let tabla = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    document.getElementById("main-container-PagoReinscripcionRealizado").style.display = "none";
    document.getElementById("PantallaPreguntaImprimirFormularioReinscribir").style.display = "block";
    if(numeroPaginaFormulariosReinscribirImprimir != 1) numeroPaginaFormulariosReinscribirImprimir = 1;
    document.getElementById("mensajePreguntaImprimirFormularioReinscribir").innerHTML = "¿Imprimir Formulario de Inscripción para ";
    document.getElementById("mensajePreguntaImprimirFormularioReinscribir").innerHTML += tabla[1].children[0].value + " " + tabla[1].children[1].value + " (estudiante " + numeroPaginaFormulariosReinscribirImprimir + ")?";
}

function eliminarPaginasExtraFormulariosReincripcion(){
    let tabla = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    while(true){
        if(tabla.length > 2){
            document.getElementById("contenedorReinscripcion").removeChild(document.getElementById("contenedorReinscripcion").children[document.getElementById("contenedorReinscripcion").children.length - 2]);
        }
        else{
            break;
        }
    }
    arrayPaginasReinscribir = ["reinscribirPG1", "reinscribirPG2"];
    document.getElementById("PgListaReinscribir").textContent = 1;
  }
  
  function limpiarFormulariosRepresentanteReinscripcion(){
    let formulario = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0];
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
  
  function limpiarFormulariosEstudianteReinscripcion(){
    let formulario = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[1];
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
  
  function ocultarSelectsCursoReinscribirEstudiante(){
    let cursoSelect = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[1].children[5];
    for(let i = 1; i <= cursoSelect.children.length - 1; i++){
        cursoSelect.children[i].style.display = "none";
    }
  }
  
  function limpiarFormulariosReinscripcion(){
    eliminarPaginasExtraFormulariosReincripcion();
    limpiarFormulariosRepresentanteReinscripcion();
    limpiarFormulariosEstudianteReinscripcion();
    ocultarSelectsCursoReinscribirEstudiante();
    document.getElementById("reinscribirPG1").style.display = "block";
    document.getElementById("reinscribirPG2").style.display = "none";
    document.getElementById("reinscribirAtras").style.visibility = "hidden";
    document.getElementById("reinscribirSiguiente").style.visibility = "visible";
    document.getElementById("reinscribirAgregar").style.display = "none";
    document.getElementById("totalPagarReinscripcion").textContent = "0,00";
    document.getElementById("totalPagarReinscripcionBolivares").textContent = "0,00";
    document.getElementById("cedulaRepresentanteReinscribir").value = "";
    document.getElementById("tipoDescuentoReinscripcion").textContent = "Ninguno";
  }

  function limpiarFormulariosReinscripcionBuscar(){
    eliminarPaginasExtraFormulariosReincripcion();
    limpiarFormulariosRepresentanteReinscripcion();
    limpiarFormulariosEstudianteReinscripcion();
    ocultarSelectsCursoReinscribirEstudiante();
    document.getElementById("reinscribirPG1").style.display = "block";
    document.getElementById("reinscribirPG2").style.display = "none";
    document.getElementById("reinscribirAtras").style.visibility = "hidden";
    document.getElementById("reinscribirSiguiente").style.visibility = "visible";
    document.getElementById("reinscribirAgregar").style.display = "none";
    document.getElementById("totalPagarReinscripcion").textContent = "0,00";
    document.getElementById("totalPagarReinscripcionBolivares").textContent = "0,00";
  }
  
  function limpiarFormularioReinscripcionPostPago(){
  
      //REVISAR LOS FORMULARIOS QUE CONTIENEN LOS INPUTS OCULTOS DE ESTUDIANTES
      eliminarPaginasExtraFormulariosReincripcion();
      limpiarFormulariosRepresentanteReinscripcion();
      limpiarFormulariosEstudianteReinscripcion();
      ocultarSelectsCursoReinscribirEstudiante();
      document.getElementById("reinscribirPG1").style.display = "block";
      document.getElementById("reinscribirPG2").style.display = "none";
      document.getElementById("reinscribirAtras").style.visibility = "hidden";
      document.getElementById("reinscribirSiguiente").style.visibility = "visible";
      document.getElementById("reinscribirAgregar").style.display = "none";
      document.getElementById("main-container-PagoReinscripcionRealizado").style.display = "none";
      document.getElementById("main-container-reinscribirEstudiante").style.display = "block";
      document.getElementById("totalPagarReinscripcion").textContent = "0,00";
      document.getElementById("totalPagarReinscripcionBolivares").textContent = "0,00";
      document.getElementById("tablaReinscripcionImprimir").removeChild(document.getElementById("tablaReinscripcionImprimir").children[0]);
      document.getElementById("cedulaRepresentanteReinscribir").value = "";
      document.getElementById("tipoDescuentoReinscripcion").textContent = "Ninguno";
    }
  
  async function crearFormularioInscripcion(tabla, i){
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
          extraerNumerosPuntosComasDeUnaCadena(document.getElementById("tablaReinscripcionImprimir").children[0].children[6].children[0].textContent), 
          extraerNumerosPuntosComasBarrasGuionesDeUnaCadena(document.getElementById("tablaReinscripcionImprimir").children[0].children[5].children[0].textContent),
          annoEnCurso);
  }
  
  async function respuestaSIFormularioImprimirReinscripcion(){
      let i = numeroPaginaFormulariosReinscribirImprimir;                                      
      let tabla = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
      crearFormularioInscripcion(tabla, i);
      numeroPaginaFormulariosReinscribirImprimir++;
      if(numeroPaginaFormulariosReinscribirImprimir == (tabla.length)){
          document.getElementById("PantallaPreguntaImprimirFormularioReinscribir").style.display = "none";
          limpiarFormularioReinscripcionPostPago();
      }
      else{
          document.getElementById("mensajePreguntaImprimirFormularioReinscribir").innerHTML = "¿Imprimir Formulario de Inscripción para ";
          document.getElementById("mensajePreguntaImprimirFormularioReinscribir").innerHTML += tabla[numeroPaginaFormulariosReinscribirImprimir].children[0].value + " " + tabla[numeroPaginaFormulariosReinscribirImprimir].children[1].value + " (estudiante #" + numeroPaginaFormulariosReinscribirImprimir + ")?";
      }
  }
  
  function respuestaNOFormularioImprimirReinscripcion(){
      let i = numeroPaginaFormulariosReinscribirImprimir;                                      
      let tabla = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
      numeroPaginaFormulariosReinscribirImprimir++;
      if(numeroPaginaFormulariosReinscribirImprimir == tabla.length){
          document.getElementById("PantallaPreguntaImprimirFormularioReinscribir").style.display = "none";
          limpiarFormularioReinscripcionPostPago();
      }
      else{
          document.getElementById("mensajePreguntaImprimirFormularioReinscribir").textContent = "¿Imprimir Formulario de Inscripción para ";
          document.getElementById("mensajePreguntaImprimirFormularioReinscribir").textContent += tabla[numeroPaginaFormulariosReinscribirImprimir].children[0].value + " " + tabla[numeroPaginaFormulariosReinscribirImprimir].children[1].value + " (estudiante " + numeroPaginaFormulariosReinscribirImprimir + ")?";
      }
  }

function calcularCostosReinscripcion(){
    flagEmpleado = 0;
    flagProntoPago = 0;  
    let formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    let tipoRepresentante = formularios[0].children[4];
    if(tipoRepresentante.selectedIndex == 2){
      flagEmpleado = 1;
    }
    if(extraerDiaDelMes() <= 5) flagProntoPago = 1;
    let totalPagar = document.getElementById("totalPagarReinscripcion");
    let totalPagarBolivares = document.getElementById("totalPagarReinscripcionBolivares");
    let sumadorPreescolar = 0;
    let sumadorPrimaria = 0;
    let sumadorBachillerato = 0;
    let totalProcesado;
    let totalProcesadoBolivares;
    let hermanos = formularios.length - 1;
    let estudiantes = formularios.length - 1;
    let tipoDescuento = document.getElementById("tipoDescuentoReinscripcion");
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

    if(!(flagEmpleado) && !(flagProntoPago) && !(hermanos >= 2)){
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

function acomodarArrayListaEstudiantes(){
    arrayPaginasReinscribir = [];
    let formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    for(let i = 0; i <= formularios.length - 1; i++){
        arrayPaginasReinscribir.push(formularios[i].parentNode.parentNode.id);
    }
    document.getElementById("PgListaReinscribir").textContent = "1";
    document.getElementById("reinscribirAtras").style.visibility = "hidden";
}

function escribirFormularioDigitalRepresentante(datosRepresentante){
    document.getElementById("contenedorReinscripcion").style.display = "none";
    let formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    document.getElementById("tipoDescuentoReinscripcion").textContent = "Ninguno";
    formularios[0].children[0].value = datosRepresentante.nombres;
    formularios[0].children[1].value = datosRepresentante.apellidos;
    formularios[0].children[2].value = datosRepresentante.cedula;
    formularios[0].children[3].value = datosRepresentante.telefono;
    if(datosRepresentante.tipoRepresentante == "Regular") formularios[0].children[4].selectedIndex = 1;
    if(datosRepresentante.tipoRepresentante == "Empleado"){
      formularios[0].children[4].selectedIndex = 2;
      document.getElementById("tipoDescuentoReinscripcion").textContent = "Empleado";
    } 
    formularios[0].children[5].value = datosRepresentante.direccionRepresentante;
    formularios[0].children[6].value = datosRepresentante.nombrePadre;
    formularios[0].children[7].value = datosRepresentante.cedulaPadre;
    formularios[0].children[8].value = datosRepresentante.nombreMadre;
    formularios[0].children[9].value = datosRepresentante.cedulaMadre;
    document.getElementById("contenedorReinscripcion").style.display = "flex";
    for(let i = 0; i <= 9; i++) formularios[0].children[i].disabled = true; 
}

function listaDeCursosReinscribir(){
    let preescolar = this.parentNode.children[5].getElementsByClassName("curso-preescolar");
    let primaria = this.parentNode.children[5].getElementsByClassName("curso-primaria");
    let bachillerato = this.parentNode.children[5].getElementsByClassName("curso-bachillerato");
    this.parentNode.children[5].selectedIndex = 0;
    if(this.selectedIndex == 0){
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
    if(this.selectedIndex == 1){
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
    if(this.selectedIndex == 2){
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
    if(this.selectedIndex == 3){
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

function eventListenerCalcularCostoReinscripcion(){
    flagEmpleado = 0;
    flagProntoPago = 0;
    let formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    let tipoRepresentante = formularios[0].children[4];
    if(tipoRepresentante.selectedIndex == 0){
      mostrarPantallaError("Seleccione el tipo de representante");
      this.selectedIndex = 0;
      return 0;
    }
    if(tipoRepresentante.selectedIndex == 2){
      flagEmpleado = 1;
    }
    calcularCostosReinscripcion();
  }

function escribirFormularioDigitalEstudiante(datosEstudiante, numero, flag){
    let nuevaPagina = document.createElement("div");
    let h1 = document.createElement("h1");
    let cajaLabels = document.createElement("div");
    let cajaContenedora = document.createElement("div");
    let cajaInputs = document.createElement("div");
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
    labelNombres.textContent = "Nombres";
    labelApellidos.textContent = "Apellidos";
    labelCedula.textContent = "Cédula de Identidad";
    labelSexo.textContent = "Sexo";
    labelFecha.textContent = "Fecha de Nacimiento";
    labelLugar.textContent = "Lugar de Nacimiento";
    labelEstado.textContent = "Estado";
    labelDirección.textContent = "Dirección";
    labelGrado.textContent = "Grado de Instrucción";
    labelCurso.textContent = "Curso";
    labelSeccion.textContent = "Sección";
    inputNombres.type = "text";
    inputNombres.placeholder = "Nombres";
    inputNombres.disabled = true;
    inputNombres.value = datosEstudiante.nombres;
    inputApellidos.type = "text";
    inputApellidos.placeholder = "Apellidos";
    inputApellidos.disabled = true;
    inputApellidos.value = datosEstudiante.apellidos;
    inputCedula.type = "number";
    inputCedula.placeholder = "Cédula";
    inputCedula.disabled = true;
    inputCedula.value = datosEstudiante.cedula;
    for(let i = 0; i <= 2; i++) inputSexo.appendChild(document.createElement("option"));
    inputSexo.children[0].textContent = "Sexo";
    inputSexo.children[1].textContent = "Masculino";
    inputSexo.children[2].textContent = "Femenino";
    if(datosEstudiante.sexo == "Masculino") inputSexo.selectedIndex = 1;
    if(datosEstudiante.sexo == "Femenino") inputSexo.selectedIndex = 2;
    inputSexo.disabled = true;
    for(let i = 0; i <= 3; i++) inputGrado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 3; i++) inputGrado.children[i].textContent = gradoArray[i];
    inputGrado.addEventListener("change", listaDeCursosReinscribir);
    inputGrado.addEventListener("change", eventListenerCalcularCostoReinscripcion);
    for(let i = 0; i <= 14; i++) inputCurso.appendChild(document.createElement("option"));
    for(let i = 0; i <= 14; i++) inputCurso.children[i].textContent = cursoArray[i];
    for(let i = 1; i <= 3; i++) inputCurso.children[i].className = "curso-preescolar";
    for(let i = 4; i <= 9; i++) inputCurso.children[i].className = "curso-primaria";
    for(let i = 10; i <= 14; i++) inputCurso.children[i].className = "curso-bachillerato";
    for(let i = 0; i <= 2; i++) inputSeccion.appendChild(document.createElement("option"));
    for(let i = 0; i <= 2; i++) inputSeccion.children[i].textContent = seccionArray[i];
    inputFecha.type = "date";
    inputFecha.value = datosEstudiante.fechaNacimiento;
    inputFecha.disabled = true;
    inputLugar.type = "text";
    inputLugar.placeholder = "Lugar de Nacimiento";
    inputLugar.disabled = true;
    inputLugar.value = datosEstudiante.lugarNacimiento;
    for(let i = 0; i <= 25; i++) inputEstado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 25; i++) inputEstado.children[i].textContent = estadoArray[i];
    for(let i = 0; i <= 25; i++){
        if(estadoArray[i] == datosEstudiante.estado){
            inputEstado.selectedIndex = i;
        }
    }
    inputEstado.disabled = true;
    inputDireccion.type = "text";
    inputDireccion.placeholder = "Dirección";
    inputDireccion.disabled = true;
    inputDireccion.value = datosEstudiante.direccion;
    cajaLabels.classList.add("subcajaFormularioInscripcion");
    cajaInputs.classList.add("subcajaFormularioReinscripcionDerecha");
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
    h1.textContent = "Datos Estudiante";
    h1.className = "centradoNoFlex";
    cajaContenedora.appendChild(cajaLabels);
    cajaContenedora.appendChild(cajaInputs);
    cajaContenedora.className = "cajaFormularioInscripcion";
    nuevaPagina.appendChild(h1);
    nuevaPagina.appendChild(cajaContenedora);
    nuevaPagina.className = "oculto";
    nuevaPagina.id = "reinscribirPG" + (numero + 1);
    document.getElementById("contenedorReinscripcion").insertBefore(nuevaPagina, document.getElementById("reinscribirPG" + numero).nextSibling);
}

function agregarPaginaEstudianteReinscripcion(){
    let numeroContador = document.getElementById("PgListaReinscribir").textContent;
    numeroContador = parseInt(numeroContador);
    let numeroExtrayendo = extraerNumerosPuntosComasDeUnaCadena(arrayPaginasReinscribir[numeroContador - 1]);
    numeroExtrayendo = parseInt(numeroExtrayendo);
    let numeroPaginaSiguiente = numeroExtrayendo + 1;
    let cadenaSiguienteElemento = "reinscribirPG" + numeroPaginaSiguiente;
    arrayPaginasReinscribir.push(cadenaSiguienteElemento);
    document.getElementById("PgListaReinscribir").textContent = numeroContador + 1;
    let nuevaPagina = document.createElement("div");
    let contenedorDiv = document.createElement("div");
    let botonBorrar = document.createElement("img");
    botonBorrar.src = "rsrcs/delete.png";
    botonBorrar.className = "icono";
    botonBorrar.addEventListener("click", borrarPaginaEstudianteReinscripcion);
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
    inputGrado.addEventListener("change", listaDeCursosReinscribir);
    inputGrado.addEventListener("change", eventListenerCalcularCostoReinscripcion);
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
    cajaInputs.classList.add("subcajaFormularioReinscripcionDerecha");
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
    document.getElementById("reinscribirPG" + numeroExtrayendo).style.display = "none";
    document.getElementById("contenedorReinscripcion").insertBefore(nuevaPagina, document.getElementById("contenedorReinscripcion").children[document.getElementById("contenedorReinscripcion").children.length - 1]);
}

async function entrarPantallaPagosReinscribir(){
    let formularios;
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[0].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[1].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[2].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[2].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[3].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[4].selectedIndex == 0){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[5].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[6].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[7].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[7].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[8].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[9].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 0;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioReinscripcionDerecha")[0].children[9].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 0;
    }
    formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    for(let i = 1; i <= formularios.length - 1; i++){
      if(formularios[i].children[0].value == ""){
        console.log(formularios[i].children[0].value);
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
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
    if(await verificarSolvenciaReinscripcion() == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("El representante no está solvente con uno o más estudiantes");
      return 0;
    }
    if(await verificarSolvenciaReinscripcion() == 2){
      ocultarPantallaCarga();
      mostrarPantallaError("Error Inesperado...");
      return 0;
    }
    document.getElementById("montoPagarDolares").textContent = document.getElementById("totalPagarReinscripcion").textContent;
    document.getElementById("montoPagarBolivares").textContent = document.getElementById("totalPagarReinscripcionBolivares").textContent;
    document.getElementById("main-container-reinscribirEstudiante").style.display = "none";
    document.getElementById("mainContainerPagar").style.display = "block";
    setTipoPago("Reinscripcion");
}

function borrarPaginaEstudianteReinscripcion(){
    let paginaActual = document.getElementById("PgListaReinscribir").textContent;
    let numeroContador = parseInt(paginaActual);
    this.parentNode.parentNode.style.display = "none";
    document.getElementById(arrayPaginasReinscribir[numeroContador - 2]).style.display = "block";
    arrayPaginasReinscribir = eliminarOcurrenciasElementoArray(arrayPaginasReinscribir, arrayPaginasReinscribir[numeroContador - 1]);
    document.getElementById("PgListaReinscribir").textContent = numeroContador - 1;
    this.parentNode.parentNode.remove();
    calcularCostosReinscripcion();
}

function paginaAnteriorReinscripcion(){
    let paginaActual = document.getElementById("PgListaReinscribir").textContent;
    paginaActual = parseInt(paginaActual);
    let nombreIdPagina = arrayPaginasReinscribir[paginaActual - 1];
    document.getElementById(arrayPaginasReinscribir[paginaActual - 1]).style.display = "none";
    document.getElementById(arrayPaginasReinscribir[paginaActual - 2]).style.display = "block";
    document.getElementById("PgListaReinscribir").textContent = paginaActual - 1;
    document.getElementById("reinscribirSiguiente").style.visibility = "visible"; 
    document.getElementById("reinscribirAtras").style.visibility = "visible";
    document.getElementById("reinscribirAgregar").style.display = "none";
    if(arrayPaginasReinscribir[0] == arrayPaginasReinscribir[paginaActual - 2]){
        document.getElementById("reinscribirAtras").style.visibility = "hidden";
    }
}

function paginaSiguienteReinscripcion(){
    let paginaActual = document.getElementById("PgListaReinscribir").textContent;
    paginaActual = parseInt(paginaActual);
    let nombreIdPagina = arrayPaginasReinscribir[paginaActual - 1];
    document.getElementById(arrayPaginasReinscribir[paginaActual - 1]).style.display = "none";
    document.getElementById(arrayPaginasReinscribir[paginaActual]).style.display = "block";
    document.getElementById("PgListaReinscribir").textContent = paginaActual + 1;
    document.getElementById("reinscribirAtras").style.visibility = "visible";
    if(arrayPaginasReinscribir[arrayPaginasReinscribir.length - 1] == arrayPaginasReinscribir[paginaActual]){
        document.getElementById("reinscribirSiguiente").style.visibility = "hidden";     
    }
}