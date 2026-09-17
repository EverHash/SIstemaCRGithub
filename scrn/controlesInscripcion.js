/*global document, console*/

import { tipoDePago } from "./controlesEfectuarPago.js";
import { annoEnCurso} from "./obtenerPrecios.js";
import { verSiEsNumeroEntero, extraerNumerosPuntosComasDeUnaCadena, extraerNumerosPuntosComasBarrasGuionesDeUnaCadena, cambiarAFechaVenezolana, eliminarOcurrenciasElementoArray, numberAformatoMontos, productoPrecision2, validacionMontoEstiloBDV, contarOcurrenciasArray } from "./utilidades.js";
import { generarImagen } from "./impresion.js";
import { mostrarPantallaCarga, ocultarPantallaCarga, mostrarPantallaError } from "./modal.js";

import { limpiarTablaMesesSolventesInscribir, rellenarMesesSolventesInscripcion } from "./controlesInscripcionMensualidad.js";
import { estudiantesYaInscritos, estudiantesYaInscritosRepresentante, verificarRepresentanteTipoInscripcion } from "./inscribir.js";
import { asignarCedulaRepresentanteMetodosPagos } from "./pagosMetodos.js";
import { determinarMontoTotalAbonado } from "./controlesMensualidad.js";
import { mostrarVariable } from "./debugWIndow.js";
import { limpiarFormularioEstudiantesProsecucion, limpiarFormularioRepresentanteNuevoIngreso, limpiarFormularioRepresentanteProsecucion, limpiarPantallaNuevoIngreso, tipoInscripcion, tipoProcedimiento } from "./controlesGestionEstudiantes.js";
import { mostrarPantalla } from "./funcionesHTML.js";

export{limpiarFormularioInscripcionPostPago,
       limpiarFormulariosInscripcion,
       paginaAnteriorInscripcion,
       paginaSiguienteInscripcion,
       agregarPaginaEstudianteInscripcion,
       listaDeCursos,
       continuarProcesoInscripcion,
       entrarConsultaImpresion,
       respuestaSIFormularioImprimir,
       respuestaNOFormularioImprimir, 
       tipoDescuentoDeterminado,
       obtenerAnnoEscolarInscripcion,
       deshabilitarFormularioRepresentante,
       habilitarFormularioRepresentante,
       escribirFormularioDigitalRepresentante,
       escribirFormularioDigitalEstudiante,
       inicializarArrayPaginasInscribirConsulta,
       arrayPaginasInscribir,
       retornarFormulariosEstudiantesAestadoOriginal,
       escribirFormularioDigitalPrimerEstudiante,
       extraerPropiedadesAbono,
       introducirDatosRepresentanteNoRegistradoAbono};

export let numeroPaginaFormulariosInscribirImprimir = 1;
let arrayPaginasInscribir = ["inscribirPG1", "inscribirPG2"];

export function reiniciarContadorFormulariosImpresion(){

  numeroPaginaFormulariosInscribirImprimir = 1;

}

let flagEmpleado;
let flagProntoPago = 0;

export let flagRepresentanteRegistrado = true;
export let flagAbonoRepreNoRegistrado = false;


let tipoDescuentoDeterminado;

function retornarFormulariosEstudiantesAestadoOriginal(){

  //FUNCION DESTINADA A USARSE EN modalProsecucion.js

  //MUESTRO SOLO EL FORMULARIO DEL REPRESENTANTE
  //NO ELIMINO EL PRIMERO DE ESTUDIANTE SINO QUE LE
  //DEDICO UNA FUNCION PARA ESCRIBIR LOS DATOS
  //DE ESTA MANERA, NO SE ELIMINA NINGUN FORMULARIO

  document.getElementById("inscribirPG2").style.display = "none";
  document.getElementById("inscribirPG1").style.display = "block";

  limpiarFormulariosEstudianteInscripcion(); //LIMPIAR EL PRIMER ESTUDIANTE
  eliminarPaginasExtraFormulariosIncripcion(); //ELIMINA TODOS LOS DEMAS, ARREGLA EL ARRAY Y EL N PAGINA


  document.getElementById("inscribirAgregar").style.display = "none";
  document.getElementById("inscribirSiguiente").style.display = "block";    
  document.getElementById("inscribirAtras").style.visibility = "hidden";

}

function inicializarArrayPaginasInscribirConsulta(){

  arrayPaginasInscribir = ["inscribirPG1"];

}

function obtenerAnnoEscolarInscripcion(){

  let idAnnoEscolar;

  if(tipoInscripcion == "Nuevo Ingreso") idAnnoEscolar = "AnnoEscolarNuevoIngreso";
  if(tipoInscripcion == "Prosecucion") idAnnoEscolar = "AnnoEscolarProsecucion";

  let annoEscolarInscripcion = document.getElementById(idAnnoEscolar).value;

  return annoEscolarInscripcion;

}

function deshabilitarFormularioRepresentante(){

  let pagina = document.getElementById("inscribirPG1");

  let arrayInputs = pagina.children[1].children[1];

  for(let i = 0; i <= 9; i++){

    arrayInputs.children[i].disabled = true;

  }

}

function deshabilitarFormularioRepresentanteAbonoNoRegistrado(){

  let pagina = document.getElementById("inscribirPG1");

  let arrayInputs = pagina.children[1].children[1];

  for(let i = 0; i <= 2; i++){

    arrayInputs.children[i].disabled = true;

  }  

}

function habilitarFormularioRepresentante(){

  // let pagina = document.getElementById("inscribirPG1");

  // let arrayInputs = pagina.children[1].children[1];

  // for(let i = 0; i <= 9; i++){

  //   arrayInputs.children[i].disabled = false;

  // }

  //LAS LINEAS HAN SIDO COMENTADAS PARA QUE EL SISTEMA NO SE ROMPA
  //Y NO SE LLEGUE A ACTIVAR EN NINGUN MOMENTO

  console.log("ALGO AQUI POR LO MENOS POR SI ACASO");

}

function escribirFormularioDigitalRepresentante(datosRepresentante){
    document.getElementById("contenedorInscripcion").style.display = "none";
    let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
    formularios[0].children[0].value = datosRepresentante.nombres;
    formularios[0].children[1].value = datosRepresentante.apellidos;
    formularios[0].children[2].value = datosRepresentante.cedula;
    formularios[0].children[3].value = datosRepresentante.telefono;
    if(datosRepresentante.tipoRepresentante == "N/A") formularios[0].children[4].selectedIndex = 0;
    if(datosRepresentante.tipoRepresentante == "Regular") formularios[0].children[4].selectedIndex = 1;
    if(datosRepresentante.tipoRepresentante == "Empleado") formularios[0].children[4].selectedIndex = 2;
    formularios[0].children[5].value = datosRepresentante.direccionRepresentante;
    formularios[0].children[6].value = datosRepresentante.nombrePadre;
    formularios[0].children[7].value = datosRepresentante.cedulaPadre;
    formularios[0].children[8].value = datosRepresentante.nombreMadre;
    formularios[0].children[9].value = datosRepresentante.cedulaMadre;
    document.getElementById("contenedorInscripcion").style.display = "flex";
}

function escribirFormularioDigitalPrimerEstudiante(datosEstudiante){

  let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[1];
  formulario.children[0].value = datosEstudiante.nombres;
  formulario.children[1].value = datosEstudiante.apellidos;
  formulario.children[2].value = datosEstudiante.cedula;

  if(datosEstudiante.sexo == "Masculino") formulario.children[3].selectedIndex = 1;
  else formulario.children[3].selectedIndex = 2;

  //ESTOS SE QUEDAN VACIOS PORQUE DEPENDE DEL CURSO
  //AL QUE SE LES VAYA A INSCRIBIR

  formulario.children[4].selectedIndex = 0;
  formulario.children[5].selectedIndex = 0;
  formulario.children[6].selectedIndex = 0;



  formulario.children[7].value = datosEstudiante.fechaNacimiento;
  formulario.children[8].value = datosEstudiante.lugarNacimiento;

    let estadoArray = ["Estado", "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas",
        "Bolívar", "Carabobo", "Cojedes", "Delta Amacuro", "Dependencias Federales",
        "Distrito Federal", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", "Monagas",
        "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"];

  for(let i = 1; i <= estadoArray.length - 1; i++){

    if(datosEstudiante.estado == estadoArray[i]) formulario.children[9].selectedIndex = i;

  }

  formulario.children[10].value = datosEstudiante.direccion;

}

function escribirFormularioDigitalEstudiante(datosEstudiante, numero){
    let nuevaPagina = document.createElement("div");
    let h1 = document.createElement("h1");
    let cajaLabels = document.createElement("div");
    let cajaContenedora = document.createElement("div");
    let contenedorDiv = document.createElement("div");
    let botonBorrar = document.createElement("img");
    botonBorrar.src = "rsrcs/delete.png";
    botonBorrar.className = "icono";
    botonBorrar.addEventListener("click", borrarPaginaEstudianteInscripcion);
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
    inputNombres.value = datosEstudiante.nombres;
    inputApellidos.type = "text";
    inputApellidos.placeholder = "Apellidos";
    inputApellidos.value = datosEstudiante.apellidos;
    inputCedula.type = "number";
    inputCedula.placeholder = "Cédula";
    inputCedula.value = datosEstudiante.cedula;
    for(let i = 0; i <= 2; i++) inputSexo.appendChild(document.createElement("option"));
    inputSexo.children[0].textContent = "Sexo";
    inputSexo.children[1].textContent = "Masculino";
    inputSexo.children[2].textContent = "Femenino";
    if(datosEstudiante.sexo == "Masculino") inputSexo.selectedIndex = 1;
    if(datosEstudiante.sexo == "Femenino") inputSexo.selectedIndex = 2;
    for(let i = 0; i <= 3; i++) inputGrado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 3; i++) inputGrado.children[i].textContent = gradoArray[i];
    inputGrado.addEventListener("change", listaDeCursos);
    for(let i = 0; i <= 14; i++) inputCurso.appendChild(document.createElement("option"));
    for(let i = 0; i <= 14; i++) inputCurso.children[i].textContent = cursoArray[i];
    for(let i = 1; i <= 3; i++) inputCurso.children[i].className = "curso-preescolar";
    for(let i = 4; i <= 9; i++) inputCurso.children[i].className = "curso-primaria";
    for(let i = 10; i <= 14; i++) inputCurso.children[i].className = "curso-bachillerato";
    for(let i = 0; i <= 2; i++) inputSeccion.appendChild(document.createElement("option"));
    for(let i = 0; i <= 2; i++) inputSeccion.children[i].textContent = seccionArray[i];
    inputFecha.type = "date";
    inputFecha.value = datosEstudiante.fechaNacimiento;
    inputLugar.type = "text";
    inputLugar.placeholder = "Lugar de Nacimiento";
    inputLugar.value = datosEstudiante.lugarNacimiento;
    for(let i = 0; i <= 25; i++) inputEstado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 25; i++) inputEstado.children[i].textContent = estadoArray[i];
    for(let i = 0; i <= 25; i++){
        if(estadoArray[i] == datosEstudiante.estado){
            inputEstado.selectedIndex = i;
        }
    }
    inputDireccion.type = "text";
    inputDireccion.placeholder = "Dirección";
    inputDireccion.value = datosEstudiante.direccion;
    cajaLabels.classList.add("subcajaFormularioInscripcion");
    cajaInputs.classList.add("subcajaFormularioInscripcionDerecha");
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
    contenedorDiv.appendChild(h1);
    if(numero != 1) contenedorDiv.appendChild(botonBorrar);
    contenedorDiv.style.display = "flex";
    contenedorDiv.style.flexDirection = "row";
    contenedorDiv.style.justifyContent = "space-between";
    nuevaPagina.appendChild(contenedorDiv);
    nuevaPagina.appendChild(cajaContenedora);
    nuevaPagina.className = "oculto";
    nuevaPagina.id = "inscribirPG" + (numero + 1);
    arrayPaginasInscribir.push(nuevaPagina.id);
    document.getElementById("contenedorInscripcion").insertBefore(nuevaPagina, document.getElementById("inscribirPG" + numero).nextSibling);
}

function entrarConsultaImpresion(){
    let tabla = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
    document.getElementById("main-container-PagoInscripcionRealizado").style.display = "none";
    document.getElementById("PantallaPreguntaImprimirFormulario").style.display = "block";
    if(numeroPaginaFormulariosInscribirImprimir != 1) numeroPaginaFormulariosInscribirImprimir = 1;
    document.getElementById("mensajePreguntaImprimirFormulario").innerHTML = "¿Imprimir Formulario de Inscripción para ";
    document.getElementById("mensajePreguntaImprimirFormulario").innerHTML += tabla[1].children[0].value + " " + tabla[1].children[1].value + " (estudiante " + numeroPaginaFormulariosInscribirImprimir + ")?";
}

export function eliminarPaginasExtraFormulariosIncripcion(){
  let tabla = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
  if(arrayPaginasInscribir.length > 2){

    for(let i = 2; i <= arrayPaginasInscribir.length - 1; i++){

    document.getElementById(arrayPaginasInscribir[i]).remove();

    }
  }
  arrayPaginasInscribir = ["inscribirPG1", "inscribirPG2"];
  document.getElementById("PgListaInscribir").textContent = 1;
}

export function limpiarFormulariosRepresentanteInscripcion(){
  let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0];
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

export function limpiarFormulariosEstudianteInscripcion(){
  let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[1];
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

export function ocultarSelectsCursoInscribirEstudiante(){
  let cursoSelect = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[1].children[5];
  for(let i = 1; i <= cursoSelect.children.length - 1; i++){
      cursoSelect.children[i].style.display = "none";
  }
}

function limpiarFormulariosInscripcion(){
  eliminarPaginasExtraFormulariosIncripcion();
  limpiarFormulariosRepresentanteInscripcion();
  limpiarFormulariosEstudianteInscripcion();
  ocultarSelectsCursoInscribirEstudiante();
  document.getElementById("inscribirPG1").style.display = "block";
  document.getElementById("inscribirPG2").style.display = "none";
  document.getElementById("inscribirAtras").style.visibility = "hidden";
  document.getElementById("inscribirSiguiente").style.display = "flex";
  document.getElementById("inscribirAgregar").style.display = "none";
}

function limpiarFormularioInscripcionPostPago(){

    //NUEVO INGRESO

    limpiarPantallaNuevoIngreso();
    limpiarFlagsSelectsNuevoIngreso();
    limpiarFormularioRepresentanteNuevoIngreso();

    //PROSECUCION

    limpiarFormularioEstudiantesProsecucion();
    limpiarFormularioRepresentanteProsecucion();


    eliminarPaginasExtraFormulariosIncripcion();
    limpiarFormulariosRepresentanteInscripcion();
    limpiarFormulariosEstudianteInscripcion();
    ocultarSelectsCursoInscribirEstudiante();
    document.getElementById("inscribirPG1").style.display = "block";
    document.getElementById("inscribirPG2").style.display = "none";
    document.getElementById("inscribirAtras").style.visibility = "hidden";
    document.getElementById("inscribirSiguiente").style.display = "flex";
    document.getElementById("inscribirAgregar").style.display = "none";
    document.getElementById("main-container-PagoInscripcionRealizado").style.display = "none";
    mostrarPantalla("main-container-GestionEstudiantes");
    document.getElementById("tablaInscripcionImprimir").removeChild(document.getElementById("tablaInscripcionImprimir").children[0]);
    document.getElementById("PgListaInscribir").textContent = "1";
}

async function crearFormularioInscripcion(tabla, i){

  let idAnnoEscolar;

  if(tipoInscripcion == "Nuevo Ingreso") idAnnoEscolar = "AnnoEscolarNuevoIngreso";
  if(tipoInscripcion == "Prosecucion") idAnnoEscolar = "AnnoEscolarProsecucion";

  let annoInscrito = document.getElementById(idAnnoEscolar).value;

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
        extraerNumerosPuntosComasDeUnaCadena(document.getElementById("tablaInscripcionImprimir").children[0].children[6].children[0].textContent), 
        extraerNumerosPuntosComasBarrasGuionesDeUnaCadena(document.getElementById("tablaInscripcionImprimir").children[0].children[5].children[0].textContent),
        annoInscrito);
}

async function respuestaSIFormularioImprimir(){
    let i = numeroPaginaFormulariosInscribirImprimir;                                      
    let tabla = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
    crearFormularioInscripcion(tabla, i);
    numeroPaginaFormulariosInscribirImprimir++;
    if(numeroPaginaFormulariosInscribirImprimir == (tabla.length)){
        document.getElementById("PantallaPreguntaImprimirFormulario").style.display = "none";
        limpiarFormularioInscripcionPostPago();
    }
    else{
        document.getElementById("mensajePreguntaImprimirFormulario").innerHTML = "¿Imprimir Formulario de Inscripción para ";
        document.getElementById("mensajePreguntaImprimirFormulario").innerHTML += tabla[numeroPaginaFormulariosInscribirImprimir].children[0].value + " " + tabla[numeroPaginaFormulariosInscribirImprimir].children[1].value + " (estudiante #" + numeroPaginaFormulariosInscribirImprimir + ")?";
    }
}

function respuestaNOFormularioImprimir(){
    let i = numeroPaginaFormulariosInscribirImprimir;                                      
    let tabla = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
    numeroPaginaFormulariosInscribirImprimir++;
    if(numeroPaginaFormulariosInscribirImprimir == tabla.length){
        document.getElementById("PantallaPreguntaImprimirFormulario").style.display = "none";
        limpiarFormularioInscripcionPostPago();
    }
    else{
        document.getElementById("mensajePreguntaImprimirFormulario").textContent = "¿Imprimir Formulario de Inscripción para ";
        document.getElementById("mensajePreguntaImprimirFormulario").textContent += tabla[numeroPaginaFormulariosInscribirImprimir].children[0].value + " " + tabla[numeroPaginaFormulariosInscribirImprimir].children[1].value + " (estudiante " + numeroPaginaFormulariosInscribirImprimir + ")?";
    }
}

function listaDeCursos(){
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

function paginaAnteriorInscripcion(){
    let paginaActual = document.getElementById("PgListaInscribir").textContent;
    console.log(arrayPaginasInscribir);
    paginaActual = parseInt(paginaActual);
    let nombreIdPagina = arrayPaginasInscribir[paginaActual - 1];
    document.getElementById(arrayPaginasInscribir[paginaActual - 1]).style.display = "none";
    document.getElementById(arrayPaginasInscribir[paginaActual - 2]).style.display = "block";
    document.getElementById("PgListaInscribir").textContent = paginaActual - 1;
    document.getElementById("inscribirSiguiente").style.display = "flex"; 
    document.getElementById("inscribirAtras").style.visibility = "visible";
    document.getElementById("inscribirAgregar").style.display = "none";
    if(arrayPaginasInscribir[0] == arrayPaginasInscribir[paginaActual - 2]){
        document.getElementById("inscribirAtras").style.visibility = "hidden";
    }
}

function paginaSiguienteInscripcion(){
    let paginaActual = document.getElementById("PgListaInscribir").textContent;
    console.log(arrayPaginasInscribir);
    paginaActual = parseInt(paginaActual);
    let nombreIdPagina = arrayPaginasInscribir[paginaActual - 1];
    document.getElementById(arrayPaginasInscribir[paginaActual - 1]).style.display = "none";
    document.getElementById(arrayPaginasInscribir[paginaActual]).style.display = "block";
    document.getElementById("PgListaInscribir").textContent = paginaActual + 1;
    document.getElementById("inscribirAtras").style.visibility = "visible";
    if(arrayPaginasInscribir[arrayPaginasInscribir.length - 1] == arrayPaginasInscribir[paginaActual]){
        document.getElementById("inscribirAgregar").style.display = "block";
        document.getElementById("inscribirSiguiente").style.display = "none";     
    }
}

function borrarPaginaEstudianteInscripcion(){
    let paginaActual = document.getElementById("PgListaInscribir").textContent;
    let numeroContador = parseInt(paginaActual);
    this.parentNode.parentNode.style.display = "none";
    document.getElementById(arrayPaginasInscribir[numeroContador - 2]).style.display = "block";
    arrayPaginasInscribir = eliminarOcurrenciasElementoArray(arrayPaginasInscribir, arrayPaginasInscribir[numeroContador - 1]);
    document.getElementById("PgListaInscribir").textContent = numeroContador - 1;
    this.parentNode.parentNode.remove();
}

function agregarPaginaEstudianteInscripcion(){
    let numeroContador = document.getElementById("PgListaInscribir").textContent;
    numeroContador = parseInt(numeroContador);
    let numeroExtrayendo = extraerNumerosPuntosComasDeUnaCadena(arrayPaginasInscribir[numeroContador - 1]);
    numeroExtrayendo = parseInt(numeroExtrayendo);
    let numeroPaginaSiguiente = numeroExtrayendo + 1;
    let cadenaSiguienteElemento = "inscribirPG" + numeroPaginaSiguiente;
    arrayPaginasInscribir.push(cadenaSiguienteElemento);
    document.getElementById("PgListaInscribir").textContent = numeroContador + 1;
    let nuevaPagina = document.createElement("div");
    let contenedorDiv = document.createElement("div");
    let botonBorrar = document.createElement("img");
    botonBorrar.src = "rsrcs/delete.png";
    botonBorrar.className = "icono";
    botonBorrar.addEventListener("click", borrarPaginaEstudianteInscripcion);
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
    inputGrado.addEventListener("change", listaDeCursos);
    for(let i = 0; i <= 14; i++) inputCurso.appendChild(document.createElement("option"));
    for(let i = 0; i <= 14; i++) inputCurso.children[i].textContent = cursoArray[i];
    for(let i = 1; i <= 3; i++) inputCurso.children[i].className = "curso-preescolar";
    for(let i = 4; i <= 9; i++) inputCurso.children[i].className = "curso-primaria";
    for(let i = 10; i <= 14; i++) inputCurso.children[i].className = "curso-bachillerato";
    for(let i = 0; i <= 2; i++) inputSeccion.appendChild(document.createElement("option"));
    for(let i = 0; i <= 2; i++) inputSeccion.children[i].textContent = seccionArray[i]; 
    inputFecha.type = "date";
    inputLugar.type = "text";
    inputLugar.placeholder = "Lugar de Nacimiento";
    for(let i = 0; i <= 25; i++) inputEstado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 25; i++) inputEstado.children[i].textContent = estadoArray[i];
    inputDireccion.type = "text";
    inputDireccion.placeholder = "Dirección";
    cajaLabels.classList.add("subcajaFormularioInscripcion");
    cajaInputs.classList.add("subcajaFormularioInscripcionDerecha");
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
    document.getElementById("inscribirPG" + numeroExtrayendo).style.display = "none";
    document.getElementById("contenedorInscripcion").insertBefore(nuevaPagina, document.getElementById("contenedorInscripcion").children[document.getElementById("contenedorInscripcion").children.length - 1]);
}

function formularioInvalido(){
    let formularios;
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[0].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[1].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[2].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[2].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[3].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[4].selectedIndex == 0){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[5].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[6].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[7].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[7].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[8].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[9].value == ""){
      ocultarPantallaCarga();
      mostrarPantallaError("Llene los Formularios por favor...");
      return 1;
    }
    if(verSiEsNumeroEntero(document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0].children[9].value) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo números en la cédula del representante");
      return 1;
    }
    formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
    for(let i = 1; i <= formularios.length - 1; i++){
      if(formularios[i].children[0].value == ""){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[1].value == ""){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[2].value == ""){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[3].selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[4].selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[5].selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[6].selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[7].value == ""){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[8].value == ""){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[9].selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
      if(formularios[i].children[10].value == ""){
        ocultarPantallaCarga();
        mostrarPantallaError("Llene los Formularios por favor...");
        return 1;
      }
    }
}

function annoEscolarInvalido(){

  let idAnnoEscolar;

  if(tipoInscripcion == "Nuevo Ingreso") idAnnoEscolar = "AnnoEscolarNuevoIngreso";
  if(tipoInscripcion == "Prosecucion") idAnnoEscolar = "AnnoEscolarProsecucion";

  let annoEscolarInscripcion = document.getElementById(idAnnoEscolar).value;

  annoEscolarInscripcion = annoEscolarInscripcion.split("-");

  let inscrip1 = parseInt(annoEscolarInscripcion[0]);
  let inscrip2 = parseInt(annoEscolarInscripcion[1]);

  let annoEscolarEnCurso = annoEnCurso.split("-");

  let curso1 = parseInt(annoEscolarEnCurso[0]);
  let curso2 = parseInt(annoEscolarEnCurso[1]);

  if(inscrip1 < curso1 && inscrip2 < curso2){
    ocultarPantallaCarga();
    mostrarPantallaError("El año escolar al que se está queriendo inscribir es anterior al año en curso");
    return true;
  } 
  else return false;

  //AQUI LO QUE HACE ES VER SI EL AÑO AL CUAL
  //SE ESTA QUERIENDO INSCRIBIR ES ANTERIOR AL
  //AÑO ESCOLAR EN CURSO ACTUALMENTE

}

function cedulasRepetidas(){

  let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
  let arrayCedulas = [];
  let conteo;
  let cedula;

  //COPIAR EL ARRAY

  for(let i = 1; i <= formularios.length - 1; i++){

    cedula = formularios[i].children[2].value;

    arrayCedulas.push(cedula);

  }

  //COMPARAR

  for(let i = 0; i <= arrayCedulas.length - 1; i++){

    conteo = contarOcurrenciasArray(arrayCedulas, arrayCedulas[i]);

    if(conteo > 1) return true;

  }

  return false;

}

async function continuarProcesoInscripcion(){

    mostrarPantallaCarga();

    if(formularioInvalido()){
      ocultarPantallaCarga();
      return;
    }

    if(cedulasRepetidas()){

      ocultarPantallaCarga();
      mostrarPantallaError("Hay una o más cédulas repetidas de estudiantes");
      return;

    }
    
    let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0];

    let cedulaRepresentanteInscripcion = formulario.children[2].value;

    let representanteRegistrado = await verificarRepresentanteTipoInscripcion();

    let estudiantesRegistrados = await estudiantesYaInscritos();

    let estudiantesRegistradosRepre = await estudiantesYaInscritosRepresentante();

    if(annoEscolarInvalido()){
      ocultarPantallaCarga();
      return;
    }

    if(estudiantesRegistrados) return;

    if(estudiantesRegistradosRepre){
      ocultarPantallaCarga();
      return;
    }

    if(representanteRegistrado){ 

      if(tipoInscripcion == "Nuevo Ingreso" && !flagAbonoRepreNoRegistrado && !flagRepresentanteRegistrado){
        ocultarPantallaCarga();
        mostrarPantallaError("Representante ya registrado, indique en el módulo de nuevo ingreso que está registrado");
        return;
      }

    }
    
    limpiarTablaMesesSolventesInscribir();
    rellenarMesesSolventesInscripcion();
    asignarCedulaRepresentanteMetodosPagos(cedulaRepresentanteInscripcion);
    document.getElementById("mainContainerInscribirEstudiante").style.display = "none";
    document.getElementById("mainContainerMesesSolventesInscripcion").style.display = "block";
    ocultarPantallaCarga();
    return 0;
    
}

function extraerPropiedadesAbono(representante){

    let objetoAbonos = {};

    for(let propiedad in representante){
      if(propiedad.includes("abonos")){
        objetoAbonos[propiedad] = representante[propiedad];
      }
    }

    return objetoAbonos;

}

function introducirDatosRepresentanteNoRegistradoAbono(representante){

    let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
    formularios[0].children[0].value = representante.nombres;
    formularios[0].children[1].value = representante.apellidos;
    formularios[0].children[2].value = representante.cedula;

}

function ocultarCuestionarioAbonoNoRegistrado(){

  document.getElementById("cuestionarioAbonoNoRegistrado").style.display = "none";

}

function mostrarCuestionarioAbonoNoRegistrado(){

  document.getElementById("cuestionarioAbonoNoRegistrado").style.display = "table-row";

}

export function selectorRepresentanteRegistrado(){

  //CODIGO MUERTO
  //CODIGO MUERTO
  //CODIGO MUERTO

  let selectAbonoRepre = document.getElementById("representanteNoRegistradoAbonoInscripcion");

  flagAbonoRepreNoRegistrado = false;

  if(this.selectedIndex != 2){ //SI EL SELECT NO ESTA EN "NO REGISTRADO"

    ocultarCuestionarioAbonoNoRegistrado();
    flagRepresentanteRegistrado = true;
    deshabilitarFormularioRepresentante();
    selectAbonoRepre.selectedIndex = 0;
    return;

  }

  mostrarCuestionarioAbonoNoRegistrado();
  flagRepresentanteRegistrado = false;
  habilitarFormularioRepresentante();

}

export function selectorAbonoRepresentanteNoRegistrado(){

  //SI TIENE ABONO Y NO ESTA REGISTRADO SE ACTIVA EL FLAG

  //CODIGO MUERTO
  //CODIGO MUERTO
  //CODIGO MUERTO

  if(this.selectedIndex == 1){

    deshabilitarFormularioRepresentanteAbonoNoRegistrado();
    flagAbonoRepreNoRegistrado = true;
  } 
  else{

    habilitarFormularioRepresentante();
    flagAbonoRepreNoRegistrado = false;    
    
  } 


}

function formularioInvalidoPantallaConsultaNuevoIngreso(){

  let selectRepresentante = document.getElementById("representanteRegistradoInscripcion");

  let selectAbonoRepre = document.getElementById("representanteNoRegistradoAbonoInscripcion");

  if(selectRepresentante.selectedIndex == 0){

    mostrarPantallaError("Indique si el representante está registrado por favor");
    return true;

  }

  if(selectRepresentante.selectedIndex == 2 && selectAbonoRepre.selectedIndex == 0){

    mostrarPantallaError("Indique si el representante tiene abonos por favor");
    return true;

  }

  return false;

}

export function continuarNuevoIngreso(){

  if(formularioInvalidoPantallaConsultaNuevoIngreso()) return;

  //ESTE CODIGO ESTA MUERTO
  //ESTE CODIGO ESTA MUERTO
  //ESTE CODIGO ESTA MUERTO

  //SI EL REPRESENTANTE ESTA REGISTRADO O SI TIENE UN ABONO PREVIO
  if(flagAbonoRepreNoRegistrado || flagRepresentanteRegistrado){

    entrarPantallaConsultaDatosRepresentanteNuevoIngreso();

    return;

  }
  else{

    entrarPantallaFormularioInscripcion();
    return;

  }

}

function entrarPantallaConsultaDatosRepresentanteNuevoIngreso(){

  let pantallaIntroducirDatos = document.getElementById("mainContainerDatosRepresentanteRegistradoInscripcion");
  let pantallaActual = document.getElementById("mainContainerIntroducirDatosNuevoIngreso");


  pantallaActual.style.display = "none";
  pantallaIntroducirDatos.style.display = "block"; 

}

export function entrarPantallaFormularioInscripcion(){

  let pantallaConsulta = document.getElementById("mainContainerDatosRepresentanteRegistradoInscripcion");
  let pantallaFormulario = document.getElementById("mainContainerInscribirEstudiante");
  let pantallaActual = document.getElementById("mainContainerIntroducirDatosNuevoIngreso");


  pantallaActual.style.display = "none";
  pantallaConsulta.style.display = "none";
  pantallaFormulario.style.display = "block"; 

}

export function llenarDatosRepresentanteNuevoIngreso(datosRepresentante){

  let inputNombres  = document.getElementById("nombresRepresentanteNuevoIngreso");
  let inputApellidos = document.getElementById("apellidosRepresentanteNuevoIngreso");
  let inputMontoAbonado = document.getElementById("totalAbonadoRepresentanteNuevoIngreso");


  let montoAbonado = determinarMontoTotalAbonado(datosRepresentante);

  inputMontoAbonado.value = montoAbonado;

  inputApellidos.value = datosRepresentante.apellidos;

  inputNombres.value = datosRepresentante.nombres;

}

export function llenarDatosRepresentanteProsecucion(datosRepresentante){

  let inputNombres  = document.getElementById("nombresRepresentanteProsecucion");
  let inputApellidos = document.getElementById("apellidosRepresentanteProsecucion");
  let inputMontoAbonado = document.getElementById("totalAbonadoRepresentanteProsecucion");


  let montoAbonado = determinarMontoTotalAbonado(datosRepresentante);

  inputMontoAbonado.value = montoAbonado;

  inputApellidos.value = datosRepresentante.apellidos;

  inputNombres.value = datosRepresentante.nombres;

}

export function limpiarFlagsSelectsNuevoIngreso(){

  flagAbonoRepreNoRegistrado = false;
  flagRepresentanteRegistrado = true;
}

export function formularioInvalidoConsultaDatosNuevoIngreso(){

  let apellidos = document.getElementById("apellidosRepresentanteNuevoIngreso");

  if(apellidos.value == ""){

    ocultarPantallaCarga();
    mostrarPantallaError("Introduzca y consulte la cédula de un representante, por favor");
    return true;

  }

}

export function formularioInvalidoConsultaDatosProsecucion(){

  let apellidos = document.getElementById("apellidosRepresentanteProsecucion");

  if(apellidos.value == ""){

    mostrarPantallaError("Introduzca y consulte la cédula de un representante, por favor");
    return true;

  }

}

export function entrarPantallaSeleccionarEstudiantesProsecucion(){

  document.getElementById("mainContainerDatosRepresentanteProsecucion").style.display = "none";
  document.getElementById("mainContainerDatosProsecucion").style.display = "block";

}

export function retrocederHaciaEstudiantesProsecucion(){

  document.getElementById("mainContainerInscribirEstudiante").style.display = "none";
  document.getElementById("mainContainerDatosProsecucion").style.display = "block";

}

export function retrocederHaciaConsultaDatosNuevoIngreso(){

  document.getElementById("mainContainerInscribirEstudiante").style.display = "none";
  document.getElementById("mainContainerDatosRepresentanteRegistradoInscripcion").style.display = "block";

}

export function retrocederHaciaTipoRepresentanteNuevoIngreso(){

  document.getElementById("mainContainerInscribirEstudiante").style.display = "none";
  document.getElementById("mainContainerIntroducirDatosNuevoIngreso").style.display = "block";

}