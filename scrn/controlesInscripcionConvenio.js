/*global document */

import { corregirEnCasoDeSoloUnMes } from "./controlesConvenioPagos.js";
import { limpiarFormularioEstudiantesProsecucion, limpiarFormularioRepresentanteNuevoIngreso, limpiarFormularioRepresentanteProsecucion, limpiarPantallaNuevoIngreso, tipoInscripcion } from "./controlesGestionEstudiantes.js";
import { eliminarPaginasExtraFormulariosIncripcion, limpiarFlagsSelectsNuevoIngreso, limpiarFormulariosEstudianteInscripcion, limpiarFormulariosRepresentanteInscripcion, numeroPaginaFormulariosInscribirImprimir, obtenerAnnoEscolarInscripcion, ocultarSelectsCursoInscribirEstudiante, reiniciarContadorFormulariosImpresion } from "./controlesInscripcion.js";
import { descuentoEmpleadoMesesInscripcion, determinarDescuentosAplicadosSelect, determinarSelectedIndexDescuentoInscripcion, mesSolventeSeleccionado, obtenerCedulasInscribir, obtenerDatosEstudianteMesesSolventesSeleccionados } from "./controlesInscripcionMensualidad.js";
import { crearReporteConvenio } from "./conveniosPagos.js";
import { mostrarPantalla, ocultar } from "./funcionesHTML.js";
import { peticion } from "./handlersPrecios.js";
import { generarImagen, generarImagenConvenioIndividual, generarImagenConvenioPares } from "./impresion.js";
import { inscribirConConvenio } from "./inscribirConvenio.js";
import { determinarCostoMensualidad, determinarMontoConDescuentoInscripcion } from "./inscripcion/aritmetica.js";
import { mostrarPantallaError } from "./modal.js";
import { estudiante, estudianteRepresentante, representante } from "./objetos.js";
import { cambiarAFechaVenezolana, eliminadorDeMetodos, existeEnElArray, fechaDeHoy, fechaDeHoyFormatoJS, fechaYaPaso, numberAformatoMontos, sumaDecimal } from "./utilidades.js";
import { crearCeldaConInput, crearCeldaConSelect, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

export let arrayObjetosEstudiantesRepresentante = [];
export let arrayObjetosEstudiantesSeccion = [];

let contadorEstudiantesImpresion = 1;

let repre;

export function entrarSeleccionarConceptosConvenioInscripcion(){

    ocultar("mainContainerMesesSolventesInscripcion");
    mostrarPantalla("mainContainerMesesConvenioInscripcion");

}

export function determinarConceptosConvenioInscripcion(){

    limpiarFilasTabla("tablaSeleccionarMesesConvenioInscripcion", 1);

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

          crearFilaMesesInscripcion(datosEstudiante, arrayMeses[j], flagHermanos, annoEscolarConsultado, flagEmpleado);


        }

      }

    }

    correccionSumaUSDTotalPagarInscripcionConvenio();

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
  arrayCeldas.push(crearCeldaConTexto(monto));

  let celdaSelect = crearCeldaConSelect(arrayDescuentos, "", determinarSelectedIndexDescuentoInscripcion());
  let celdaInput = crearCeldaConInput("checkbox", true);

  celdaSelect.children[0].addEventListener("change", seleccionarDescuentoSelectInscripcion);
  celdaInput.children[0].disabled = true;

  arrayCeldas.push(celdaSelect);
  arrayCeldas.push(celdaInput);

  document.getElementById("tablaSeleccionarMesesConvenioInscripcion").appendChild(crearTRconCeldasApendadas(arrayCeldas));

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

    let input = this.parentNode.parentNode.children[4];

    input.textContent = obtenerPrecio.procesar(peticionPrecio);

    correccionSumaUSDTotalPagarInscripcionConvenio();

}

function crearFilaMesesInscripcion(datosEstudiante, mes, flagHermanos, annoConsultado, flagEmpleado){

  //CREA TODAS LAS VARIABLES QUE SE VAN A EMPLEAR

  let tabla = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");

  let arrayCeldas = [];

  let selectDescuento = document.createElement("select");

  let arrayDescuentos = ["Ninguno", 
                        "Pronto Pago", 
                        "Hermanos", 
                        "Pronto Pago + Hermanos", 
                        "Empleado", 
                        "Empleado + Pronto Pago"];
 
  //CREA TODAS LAS CELDAS QUE SON SOLO DE TEXTO

  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.nombreCompleto));
  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.cedula));
  arrayCeldas.push(crearCeldaConTexto(datosEstudiante.curso));
  arrayCeldas.push(crearCeldaConTexto(mes));

  //AQUI SE CREA LA CELDA CON EL MONTO

  arrayCeldas.push(crearCeldaConTexto(determinarCostoMensualidad(datosEstudiante.curso,
                                                                flagHermanos,
                                                                flagEmpleado,
                                                                mes,
                                                                annoConsultado)));


  //ESTOS SON LOS SELECTS DEL DESCUENTO

  selectDescuento = crearCeldaConSelect(arrayDescuentos, "");
  selectDescuento.children[0].addEventListener("change", cambiarMontoDolaresDescuentoInscripcion);
  selectDescuento.children[0].selectedIndex = determinarDescuentosAplicadosSelect(flagHermanos, flagEmpleado, annoConsultado, mes);

  arrayCeldas.push(selectDescuento);

  //FINALMENTE ESTE ES EL CHECKBOX DE SELECCIONAR EL MES A PAGAR
  
  let celdaCheckbox = crearCeldaConInput("checkbox", false, "");

  celdaCheckbox.addEventListener("change", seleccionarMesPagarInscripcion);

  arrayCeldas.push(celdaCheckbox);

  tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

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

  this.parentNode.parentNode.children[4].textContent = precioMensualidad; //EL INPUT QUE CONTIENE EL PRECIO

  correccionSumaUSDTotalPagarInscripcionConvenio();

}

export function correccionSumaUSDTotalPagarInscripcionConvenio(){

    let tabla = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");
    let precioTotal = 0;
    let valorUSD;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            valorUSD = tabla.rows[i].cells[4].textContent;
            if(tabla.rows[i].cells[6].children[0].checked == true){
              precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), valorUSD);         
            }
        }

    document.getElementById("totalPagarSeleccionarConvenioInscripcionUSD").textContent = numberAformatoMontos(precioTotal);


}

function seleccionarMesPagarInscripcion(){

    correccionSumaUSDTotalPagarInscripcionConvenio();
    let tablaMeses = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");
    let verificador = 0;
    for(let i = 1; i <= tablaMeses.rows.length - 1; i++){
      if(tablaMeses.rows[i].cells[6].children[0].checked == false && document.getElementById("seleccionarTodosLosMesesConvenioInscripcionInput").checked == true){
        document.getElementById("seleccionarTodosLosMesesConvenioInscripcionInput").checked = false;
      }
      if(tablaMeses.rows[i].cells[6].children[0].checked == true && document.getElementById("seleccionarTodosLosMesesConvenioInscripcionInput").checked == false){
        verificador++;
      }
    }
    if(verificador == (tablaMeses.rows.length - 1)){
      document.getElementById("seleccionarTodosLosMesesConvenioInscripcionInput").checked = true;
    }

}

export function seleccionarTodosMesesPagarInscripcionConvenio(){
    let tablaMeses = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");
    for(let i = 2; i <= tablaMeses.rows.length - 1; i++){

        if(tablaMeses.rows[i].cells[6].children[0].disabled == true) continue;
        if(document.getElementById("seleccionarTodosLosMesesConvenioInscripcionInput").checked == false){

            tablaMeses.rows[i].cells[6].children[0].checked = false;
        }
        else{
            tablaMeses.rows[i].cells[6].children[0].checked = true;
        }
      }
      correccionSumaUSDTotalPagarInscripcionConvenio();
}

export function continuarAconfirmarDatosConvenioInscripcion(){

    if(checkboxesInvalidos()) return;

    if(checkboxesMesesInvalidos()) return;

    if(intervalosMesesInvalidos()) return;

    let datosFila = {
        nombre: "",
        cedula: "",
        curso: "",
        concepto: "",
        monto: "",
        descuento: ""

    };

    limpiarFilasTabla("tbodyConfirmarMesesConvenioInscripcion", 1);

    let tabla = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");

    let descuentoConcepto;

    let selectDescuento;

    let checkboxFlag;

    for(let i = 1; i <= tabla.rows.length - 1; i++){
    
        checkboxFlag = tabla.rows[i].cells[6].children[0].checked;

        if(checkboxFlag){

            selectDescuento = tabla.rows[i].cells[5].children[0];
    
            descuentoConcepto = selectDescuento.options[selectDescuento.selectedIndex].textContent;
    
            datosFila.nombre = tabla.rows[i].cells[0].textContent;
            datosFila.cedula = tabla.rows[i].cells[1].textContent;
            datosFila.curso = tabla.rows[i].cells[2].textContent;
            datosFila.concepto = tabla.rows[i].cells[3].textContent;
            datosFila.monto = tabla.rows[i].cells[4].textContent;
            datosFila.descuento = descuentoConcepto;
    
            dibujarFilaTablaMesesConfirmar(datosFila);


        }


    }

    document.getElementById("totalPagarUSDconfirmarMesesConvenioInscripcion").textContent = document.getElementById("totalPagarSeleccionarConvenioInscripcionUSD").textContent;

    entrarConfirmarMesesConvenios();

}

function checkboxesInvalidos(){

    let tabla = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");

    let contadorCheckboxes = 0;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[6].children[0].checked == true) contadorCheckboxes++; 

    }

    if(contadorCheckboxes > 0) return false;

    else{
    
        mostrarPantallaError("Seleccione uno o más conceptos de pago, por favor");
    
        return true;
  
    }

}

function checkboxesMesesInvalidos(){

    let tabla = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");

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

    let tabla = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");

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

            arrayMes = [tabla.rows[i].cells[3].textContent, tabla.rows[i].cells[6].children[0].checked];

            arrayMeses.push(arrayMes);

        }

    }

    for(let i = 0; i <= arrayMeses.length - 1; i++){

        if(i == arrayMeses.length - 1) return false; //YA NO IMPORTA SI ESTA MARCADO O NO

        mesActual = arrayMeses[i][0];
        mesSiguiente = arrayMeses[i + 1][0];

        checkMesActual = arrayMeses[i][1];
        checkMesSiguiente = arrayMeses[i + 1][1];

        if(checkMesSiguiente && !checkMesActual){

            mostrarPantallaError(mesSiguiente + " está marcado sin haber marcado " + mesActual);
            return true;           

        }

    }

}

function dibujarFilaTablaMesesConfirmar(datosFila){

    let tabla = document.getElementById("tbodyConfirmarMesesConvenioInscripcion");

    let arrayCeldas = [];

    arrayCeldas.push(crearCeldaConTexto(datosFila.nombre));
    arrayCeldas.push(crearCeldaConTexto(datosFila.cedula));
    arrayCeldas.push(crearCeldaConTexto(datosFila.curso));
    arrayCeldas.push(crearCeldaConTexto(datosFila.concepto));
    arrayCeldas.push(crearCeldaConTexto(datosFila.monto));
    arrayCeldas.push(crearCeldaConTexto(datosFila.descuento));

    let fila = crearTRconCeldasApendadas(arrayCeldas);

    tabla.appendChild(fila);

}

function intervalosMesesInvalidos(){ //SE VALIDA EL LIMITE SUPERIOR

    debugger;

    let cedulas = obtenerCedulasSeleccionarMeses();

    let arrayMeses;

    arrayMeses = obtenerMesesPorCedula(cedulas[0]);

    let mesMaximo = arrayMeses[arrayMeses.length - 1];

    let mesMaximoBucle;

    for(let i = 1; i <= cedulas.length - 1; i++){ //Y SI LA LONGITUD ES 1?

        arrayMeses = obtenerMesesPorCedula(cedulas[i]);

        mesMaximoBucle = arrayMeses[arrayMeses.length - 1];

        if(mesMaximo != mesMaximoBucle){

            mostrarPantallaError("Todos los estudiantes marcados deben tener el mismo mes máximo en el convenio");
            return true;

        }

    }

    return false;

}

function obtenerCedulasSeleccionarMeses(){

    let tabla = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");
    
    let checkbox;

    let array = [];

    let cedula;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        checkbox = tabla.rows[i].cells[6].children[0];

        if(checkbox.checked){

            cedula = tabla.rows[i].cells[1].textContent;

            if(array.length == 0){

                array.push(cedula);
                continue;

            }

            if(existeEnElArray(array, cedula)) continue;

            array.push(cedula); //SI NO ESTA EN EL ARRAY NI ESTA VACIO EL ARRAY SE INSERTA

        }

    }

    return array;

}

function obtenerMesesPorCedula(cedula){

    let tabla = document.getElementById("tablaSeleccionarMesesConvenioInscripcion");

    let array = [];

    let cedulaBucle;

    let mes;

    let check;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        cedulaBucle = tabla.rows[i].cells[1].textContent;

        check = tabla.rows[i].cells[6].children[0].checked;

        if(cedulaBucle == cedula && check){

            mes = tabla.rows[i].cells[3].textContent;

            array.push(mes);

        }

    }

    return array;

}

function entrarConfirmarMesesConvenios(){

  ocultar("mainContainerMesesConvenioInscripcion");
  mostrarPantalla("mainContainerConfirmarMesesConvenioInscripcion");

}

export function entrarConfirmarYcrearConveniosInscripcion(){

    asignarDatosConfirmarYcrearConvenio();

    document.getElementById("mainContainerConfirmarMesesConvenioInscripcion").style.display = "none";
    document.getElementById("mainContainerConfirmarYcrearConvenioInscripcion").style.display = "block";       


}

function asignarDatosConfirmarYcrearConvenio(){

    let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");

    repre = new representante();

    repre.obtenerDatosRepresentante(formularios);

    let inputNombres = document.getElementById("nombresRepresentanteCrearConvenioInscripcion");
    let inputApellidos = document.getElementById("apellidosRepresentanteCrearConvenioInscripcion");
    let inputFecha = document.getElementById("fechaDePagoCrearConvenioInscripcion");

    inputFecha.value = "";

    inputApellidos.value = repre.apellidos;

    inputNombres.value = repre.nombres;

}

export function atrasSeleccionarMesesConvenioInscripcion(){

    document.getElementById("mainContainerMesesConvenioInscripcion").style.display = "none";
    document.getElementById("mainContainerMesesSolventesInscripcion").style.display = "block";

    document.getElementById("totalPagarSeleccionarConvenioInscripcionUSD").textContent = "0,00";

}

export function atrasConfirmarMesesConveniosInscripcion(){

    document.getElementById("mainContainerConfirmarMesesConvenioInscripcion").style.display = "none";
    document.getElementById("mainContainerMesesConvenioInscripcion").style.display = "block";    

}

export function atrasConfirmarCrearConvenioInscripcion(){

    ocultar("mainContainerConfirmarYcrearConvenioInscripcion");
    mostrarPantalla("mainContainerConfirmarMesesConvenioInscripcion");
    document.getElementById("fechaDePagoCrearConvenioInscripcion").value = "";

}

function fechaInvalidaFormulario(){

    let fechaHoy = fechaDeHoyFormatoJS();

    let fechaFormulario = document.getElementById("fechaDePagoCrearConvenioInscripcion").value;

    if(fechaFormulario == ""){

        mostrarPantallaError("El campo de fecha para el convenio está vacío");
        return true;

    }

    if(fechaYaPaso(fechaFormulario, fechaHoy)){

        mostrarPantallaError("La fecha seleccionada es de hoy o anterior a hoy");
        return true;

    }

    return false;

}

export async function prepararDatosPantallaPreguntaImprimirInscripcion(){ 

    debugger;

    //ESTA SOLO SE EJECUTA UNA VEZ
    //Y ES CUANDO SE MUESTRA LA
    //PANTALLA DONDE SE PIDE LA FECHA

    if(fechaInvalidaFormulario()) return;

    obtenerDatosEstudiantes();

    obtenerDatosParaContrato(); //LES PONE LAS PROPIEDADES DE CONVENIO

    //HACER UN ARRAY CON LAS CEDULAS (COPIA) POR SI ACASO

    let respuesta = await inscribirConConvenio();

    if(respuesta == "ERROR") return;

    let resultadoReporte = await crearReporteConvenio(1); //1 POR SER CONVENIO INSCRIPCION
        
    if(resultadoReporte != 0) return "ERROR";
    
    ocultar("mainContainerConfirmarYcrearConvenioInscripcion"); //OCULTA ESTA PANTALLA

    if(arrayObjetosEstudiantesRepresentante.length >= 2){

        dibujarTablaPreguntaImprimirPares(); 
        mostrarPantalla("pantallaPreguntaImprimirFormularioConvenioParesInscripcion");
        
    } 
    else{
        dibujarTablaPreguntaImprimirIndividual();
        mostrarPantalla("pantallaPreguntaImprimirFormularioConvenioIndividualInscripcion");

    }



}

function obtenerObjetoEstudiante(formularios, indiceEstudiante){

  const estudia = new estudiante();

  //OBTENER DATOS

  estudia.obtenerDatosRepresentante(formularios[0]);
  estudia.obtenerDatos(formularios[indiceEstudiante]);
  estudia.solvenciaDeInscripcion();

  return estudia;

}

function obtenerObjetoEstudianteRepresentante(formularios, indiceEstudiante){

  const estudia = new estudianteRepresentante();

  estudia.obtenerDatos(formularios[indiceEstudiante]);
  estudia.solvenciaDeInscripcion();

  return estudia;

}

function obtenerDatosEstudiantes(){


      //DEJANDO VACIOS LOS ARRAYS PARA QUE NO HAYA ERRORES

      arrayObjetosEstudiantesRepresentante = [];
      arrayObjetosEstudiantesSeccion = [];

      let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
      let estudianteSubir, estudianteRepreSubir;
      let estudia;
      let estudianteRepre;



      //BUCLE DE ASIGNACION Y SUBIDA DE DATOS

        for(let i = 1; i <= formularios.length - 1; i++){

          //ASIGNACION DE DATOS REQUERIDOS
          
          estudia = obtenerObjetoEstudiante(formularios, i);
          estudianteRepre = obtenerObjetoEstudianteRepresentante(formularios, i);     

          //CREAR LOS OBJETOS SIN METODOS PARA QUE PUEDAN SER SUBIDOS
          //A FIREBASE

          estudianteSubir = eliminadorDeMetodos(estudia);
          estudianteRepreSubir = eliminadorDeMetodos(estudianteRepre);

          arrayObjetosEstudiantesSeccion.push(estudianteSubir);
          arrayObjetosEstudiantesRepresentante.push(estudianteRepreSubir);
   
        }

}

function obtenerDatosParaContrato(){

    let tabla = document.getElementById("tbodyConfirmarMesesConvenioInscripcion");

    let fecha = document.getElementById("fechaDePagoCrearConvenioInscripcion").value;

    fecha = cambiarAFechaVenezolana(fecha);

    let concepto;

    for(let i = 0; i <= arrayObjetosEstudiantesRepresentante.length - 1; i++){

        for(let j = 1; j <= tabla.rows.length - 1; j++){

            concepto = tabla.rows[j].cells[3].textContent;

            if(concepto == "Inscripción") concepto = "Inscripcion";

            arrayObjetosEstudiantesSeccion[i]["convenio" + concepto] = fecha;
            arrayObjetosEstudiantesRepresentante[i]["convenio" + concepto] = fecha;

        }

    }

}

export function armarDirectorioRepresentante(cedulaEstudiante, cedulaRepre){

    let directorio;

    let annoEscolar = obtenerAnnoEscolarInscripcion();

    directorio = "representantes/" + cedulaRepre + "/estudiantes" + annoEscolar + "/" + cedulaEstudiante;

    return directorio;

}

export function armarDirectorioEstudiante(estudiante){

    let annoEscolar = obtenerAnnoEscolarInscripcion();

    let directorio;

    directorio = "estudiantes/" + annoEscolar + "/" + estudiante.grado + "/" + estudiante.curso + " " + estudiante.seccion + "/" + "Estudiantes/";

    return directorio;

}

function dibujarTablaPreguntaImprimirPares(){ //CAMBIAR LA FUENTE DE LOS DATOS A UN ARRAY PREOBTENIDO
                                              //PARA SIMPLIFICAR

    let primerEstudiante = arrayObjetosEstudiantesSeccion[0];
    let segundoEstudiante = arrayObjetosEstudiantesSeccion[1];

    let intervaloPrimerEstudiante = obtenerIntervaloIndividual(primerEstudiante);

    let intervaloSegundoEstudiante = obtenerIntervaloIndividual(segundoEstudiante);

    let intervaloVacioPrimerEstudiante = intervaloPrimerEstudiante[0] === "";

    let intervaloVacioSegundoEstudiante = intervaloSegundoEstudiante[0] === "";

    if(!intervaloVacioPrimerEstudiante){

        intervaloPrimerEstudiante = convertirIntervaloAmeses(intervaloPrimerEstudiante);
        
        intervaloPrimerEstudiante = corregirEnCasoDeSoloUnMes(intervaloPrimerEstudiante);

        intervaloPrimerEstudiante = "Ins. + " + intervaloPrimerEstudiante;

    }
    else{ //EN CASO DE QUE ESTE VACIO

        intervaloPrimerEstudiante = "Inscripción";

    }
    
    if(!intervaloVacioSegundoEstudiante){
        
        intervaloSegundoEstudiante = convertirIntervaloAmeses(intervaloSegundoEstudiante);
        
        intervaloSegundoEstudiante = corregirEnCasoDeSoloUnMes(intervaloSegundoEstudiante);

        intervaloSegundoEstudiante = "Ins. + " + intervaloSegundoEstudiante;
        
    }
    else{ //EN CASO DE QUE ESTE VACIO

        intervaloSegundoEstudiante = "Inscripción";

    }

    let tabla = document.getElementById("tablaImprimirFormularioConvenioParesInscripcion");

    //PRIMER ESTUDIANTE

    tabla.rows[1].cells[0].textContent = primerEstudiante.nombres;
    tabla.rows[1].cells[1].textContent = primerEstudiante.apellidos;
    tabla.rows[1].cells[2].textContent = intervaloPrimerEstudiante;

    //SEGUNDO ESTUDIANTE

    tabla.rows[2].cells[0].textContent = segundoEstudiante.nombres;
    tabla.rows[2].cells[1].textContent = segundoEstudiante.apellidos;
    tabla.rows[2].cells[2].textContent = intervaloSegundoEstudiante;

};

function dibujarTablaPreguntaImprimirIndividual(){

    let primerEstudiante = arrayObjetosEstudiantesSeccion[0];

    let intervaloPrimerEstudiante = obtenerIntervaloIndividual(primerEstudiante);

    let intervaloVacioPrimerEstudiante = intervaloPrimerEstudiante[0] === "";

    if(!intervaloVacioPrimerEstudiante){

        intervaloPrimerEstudiante = convertirIntervaloAmeses(intervaloPrimerEstudiante);
        
        intervaloPrimerEstudiante = corregirEnCasoDeSoloUnMes(intervaloPrimerEstudiante);

        intervaloPrimerEstudiante = "Ins. + " + intervaloPrimerEstudiante;

    }
    else{ //EN CASO DE QUE ESTE VACIO

        intervaloPrimerEstudiante = "Inscripción";

    }

    let tabla = document.getElementById("tablaImprimirFormularioConvenioIndividualInscripcion");

    //PRIMER ESTUDIANTE

    tabla.rows[1].cells[0].textContent = primerEstudiante.nombres;
    tabla.rows[1].cells[1].textContent = primerEstudiante.apellidos;
    tabla.rows[1].cells[2].textContent = intervaloPrimerEstudiante;

};

function obtenerIntervaloIndividual(estudiante){

    let propiedades = ["Septiembre",
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

    let intervalo = ["", ""]; //NO INCLUYE LA INSCRIPCION

    //DADO QUE EL MODULO QUE ESTA CORRIENDO ES EL DE INSCRIPCION
    //SE SOBREENTIENDE QUE LA INSCRIPCION ESTA INCLUIDA EN EL CONVENIO

    for(let i = 0; i <= propiedades.length - 1; i++){

        if(estudiante.hasOwnProperty("convenio" + propiedades[i])){

            if(intervalo[0] === ""){

                intervalo[0] = i;
                continue;
            }

            intervalo[1] = i;

        } 

    }

    if(intervalo[1] == "") intervalo[1] = intervalo[0]; //ESTO ES POR SI ES SOLO UN MES

    return intervalo;

}

function convertirIntervaloAmeses(intervalo){ //ES UN ARRAY DE DOS ELEMENTOS, DOS NUMBER

    let resultado;

    let propiedades = ["Septiembre",
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
                       
    resultado = propiedades[intervalo[0]] + " - " + propiedades[intervalo[1]];

    return resultado;

}

function obtenerIntervaloCompuesto(intervalo1, intervalo2){

    let primerValorI1 = intervalo1[0];
    let primerValorI2 = intervalo2[0];

    let segundoValorI1 = intervalo1[1];
    let segundoValorI2 = intervalo2[1];

    //PRIMER VALOR
    //PRIMER VALOR
    //PRIMER VALOR

    let resultado = ["", ""];

    if(primerValorI1 < primerValorI2 || primerValorI1 == primerValorI2){

        resultado[0] = primerValorI1;

    }
    else resultado[0] = primerValorI2;

    //SEGUNDO VALOR
    //SEGUNDO VALOR
    //SEGUNDO VALOR

    if(segundoValorI1 > segundoValorI2 || segundoValorI1 == segundoValorI2){

        resultado[1] = segundoValorI1;

    }
    else resultado[1] = segundoValorI2;


    return resultado;
}

export async function botonSiImprimirConvenioIndividualInscripcion(){ //EL REPRESENTANTE LO DEJA EN MEMORIA OTRA FUNCION

    debugger;

    let nombreRepresentanteConvenio = repre.nombres + " " + repre.apellidos;
    let cedulaRepresentanteConvenio = repre.cedula;

    //OBTENIENDO EL INTERVALO

    let estudiante = arrayObjetosEstudiantesRepresentante[0];

    let intervaloC = obtenerIntervaloIndividual(estudiante);

    let flagIntervaloVacio = intervaloC[0] === "";

    if(!flagIntervaloVacio){

        intervaloC = convertirIntervaloAmeses(intervaloC);
    
        intervaloC = corregirEnCasoDeSoloUnMes(intervaloC);
    
        intervaloC = "Ins. + " + intervaloC;

    }
    else{ //ESTA VACIO

        intervaloC = "Inscripción";

    }


    //LA FECHA Y ARMANDO EL OBJETO

    let fechaPago = document.getElementById("fechaDePagoCrearConvenioInscripcion").value;

    fechaPago = cambiarAFechaVenezolana(fechaPago);

    let annoInscribir = obtenerAnnoEscolarInscripcion();

    let datosConvenio = {
        nombreRepresentante: nombreRepresentanteConvenio,
        cedulaRepresentante: cedulaRepresentanteConvenio,
        
        apellidosEstudiante1: estudiante.apellidos,
        nombresEstudiante1: estudiante.nombres,
        cursoEstudiante1: estudiante.curso,

        intervalo: intervaloC,

        fecha: fechaPago,

        anno: annoInscribir

    };

    await generarImagenConvenioIndividual(datosConvenio);

    determinarSiguientePasoConvenioInscripcion();

}

export function determinarSiguientePasoConvenioInscripcion(){

    debugger;

    arrayObjetosEstudiantesRepresentante.shift();
    arrayObjetosEstudiantesRepresentante.shift();
    arrayObjetosEstudiantesSeccion.shift();
    arrayObjetosEstudiantesSeccion.shift();

    ocultar("pantallaPreguntaImprimirFormularioConvenioParesInscripcion");
    ocultar("pantallaPreguntaImprimirFormularioConvenioIndividualInscripcion");

    if(arrayObjetosEstudiantesSeccion.length >= 2){

        dibujarTablaPreguntaImprimirPares(); 
        mostrarPantalla("pantallaPreguntaImprimirFormularioConvenioParesInscripcion");
        
    } 

    if(arrayObjetosEstudiantesSeccion.length == 1){
        dibujarTablaPreguntaImprimirIndividual();
        mostrarPantalla("pantallaPreguntaImprimirFormularioConvenioIndividualInscripcion");
    }

    if(arrayObjetosEstudiantesSeccion.length == 0){

        entrarConsultaImpresionInscripcionConvenio();

    }

}

export async function botonSiImprimirConvenioParesInscripcion(){

    debugger;

    let nombreRepresentanteConvenio = repre.nombres + " " + repre.apellidos;
    let cedulaRepresentanteConvenio = repre.cedula;

    //NO TOCADO DE AQUI A ABAJO

    let intervalo1, intervalo2;

    let intervaloConvenio;

    let intervaloFinal;
    
    
    intervalo1 = obtenerIntervaloIndividual(arrayObjetosEstudiantesRepresentante[0]);
    
    intervalo2 = obtenerIntervaloIndividual(arrayObjetosEstudiantesRepresentante[1]);
    
    let flagIntervaloVacio = intervalo1[0] === "";
    
    if(!flagIntervaloVacio){

        intervaloConvenio = obtenerIntervaloCompuesto(intervalo1, intervalo2); 
    
        intervaloConvenio = convertirIntervaloAmeses(intervaloConvenio);
    
        intervaloConvenio = corregirEnCasoDeSoloUnMes(intervaloConvenio);

        intervaloFinal = "Ins. + " + intervaloConvenio;

    }
    else{ //ESTA VACIO

        intervaloFinal = "Inscripción";

    }


    let fechaPago = document.getElementById("fechaDePagoCrearConvenioInscripcion").value;

    fechaPago = cambiarAFechaVenezolana(fechaPago);

    let annoInscribir = obtenerAnnoEscolarInscripcion();

    let datosConvenio = {
        nombreRepresentante: nombreRepresentanteConvenio,
        cedulaRepresentante: cedulaRepresentanteConvenio,
        
        apellidosEstudiante1: arrayObjetosEstudiantesRepresentante[0].apellidos,
        nombresEstudiante1: arrayObjetosEstudiantesRepresentante[0].nombres,
        cursoEstudiante1: arrayObjetosEstudiantesRepresentante[0].curso,


        apellidosEstudiante2: arrayObjetosEstudiantesRepresentante[1].apellidos,
        nombresEstudiante2: arrayObjetosEstudiantesRepresentante[1].nombres,
        cursoEstudiante2: arrayObjetosEstudiantesRepresentante[1].curso,

        intervalo: intervaloFinal,

        fecha: fechaPago,

        anno: annoInscribir

    };

    await generarImagenConvenioPares(datosConvenio);

    determinarSiguientePasoConvenioInscripcion();

}

function entrarConsultaImpresionInscripcionConvenio(){

    debugger;

    contadorEstudiantesImpresion = 1;

    mostrarPantalla("PantallaPreguntaImprimirFormularioInscripcionConvenio");

    escribirDatosModalImpresionFormulario();

}

export async function imprimirFormularioInscripcionConvenio(){

    let datosRepre = obtenerDatosRepresentanteFormularioInscripcion();

    let datosEstudiante = obtenerDatosEstudianteFormularioInscripcion();

    let anno = obtenerAnnoEscolarInscripcion();

    let fechaHoy = fechaDeHoy();

    await generarImagen(datosEstudiante.nombreEstudiante,
                        datosEstudiante.apellidoEstudiante,
                        datosEstudiante.cedulaEstudiante,
                        datosEstudiante.sexoEstudiante,
                        datosEstudiante.fechaNacimiento,
                        datosEstudiante.lugarNacimiento,
                        datosEstudiante.estado,
                        datosEstudiante.direccion,
                        datosRepre.nombreCompletoRepresentante,
                        datosRepre.cedulaRepresentante,
                        datosRepre.direccionRepresentante,
                        datosRepre.telefono,
                        datosRepre.nombrePadre,
                        datosRepre.cedulaPadre,
                        datosRepre.nombreMadre,
                        datosRepre.cedulaMadre,
                        datosEstudiante.curso,
                        " ",
                        fechaHoy,
                        anno
    );

    determinarSiguientePasoFormularioInscripcion();

}

export function determinarSiguientePasoFormularioInscripcion(){

    contadorEstudiantesImpresion++;

    let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");

    if(contadorEstudiantesImpresion > formularios.length - 1){

        limpiarFormularioInscripcionPostConvenio();
        ocultar("PantallaPreguntaImprimirFormularioInscripcionConvenio");
        mostrarPantalla("main-container-GestionEstudiantes");

    }
    else{

        escribirDatosModalImpresionFormulario();

    }

}


function obtenerDatosEstudianteFormularioInscripcion(){

    let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[contadorEstudiantesImpresion];

    let objetoEstudiante = {};

    objetoEstudiante["nombreEstudiante"] = formulario.children[0].value;
    objetoEstudiante["apellidoEstudiante"] = formulario.children[1].value;
    objetoEstudiante["cedulaEstudiante"] = formulario.children[2].value;

    let sexo = formulario.children[3].selectedIndex;

    if(sexo == 1) objetoEstudiante["sexoEstudiante"] = "Masculino";
    else objetoEstudiante["sexoEstudiante"] = "Femenino";

    let fechaNacimiento = formulario.children[7].value;

    objetoEstudiante["fechaNacimiento"] = cambiarAFechaVenezolana(fechaNacimiento);

    objetoEstudiante["lugarNacimiento"] = formulario.children[8].value;

    let selectEstado = formulario.children[9];

    let estadoEstudiante = selectEstado.options[selectEstado.selectedIndex].textContent;

    objetoEstudiante["estado"] = estadoEstudiante;

    objetoEstudiante["direccion"] = formulario.children[10].value;

    let selectCurso = formulario.children[5];

    let cursoEstudiante = selectCurso.options[selectCurso.selectedIndex].textContent;

    objetoEstudiante["curso"] = cursoEstudiante;

    return objetoEstudiante;

}

function obtenerDatosRepresentanteFormularioInscripcion(){

    let formularioRepresentante = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0];

    let objetoRepresentante = {};

    objetoRepresentante["nombreCompletoRepresentante"] = formularioRepresentante.children[0].value;
    objetoRepresentante["nombreCompletoRepresentante"] += " " + formularioRepresentante.children[1].value;

    objetoRepresentante["cedulaRepresentante"] = formularioRepresentante.children[2].value;

    objetoRepresentante["direccionRepresentante"] = formularioRepresentante.children[6].value;

    objetoRepresentante["telefono"] = formularioRepresentante.children[3].value;

    objetoRepresentante["nombrePadre"] = formularioRepresentante.children[6].value;

    objetoRepresentante["cedulaPadre"] = formularioRepresentante.children[7].value;

    objetoRepresentante["nombreMadre"] = formularioRepresentante.children[8].value;

    objetoRepresentante["cedulaMadre"] = formularioRepresentante.children[9].value;

    return objetoRepresentante;

}

function escribirDatosModalImpresionFormulario(){

    let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[contadorEstudiantesImpresion];

    let nombreEstudiante = formulario.children[0].value;
    let apellidoEstudiante = formulario.children[1].value;

    let cadenaCompleta = "¿Imprimir formulario de inscripción para " + nombreEstudiante + " " + apellidoEstudiante;
    cadenaCompleta += " (estudiante " + contadorEstudiantesImpresion + ")?";

    let elementoInterfaz = document.getElementById("mensajePreguntaImprimirFormularioInscripcionConvenio");

    elementoInterfaz.innerHTML = cadenaCompleta;

}

function limpiarFormularioInscripcionPostConvenio(){

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
    document.getElementById("PgListaInscribir").textContent = "1";
}