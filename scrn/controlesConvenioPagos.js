/*global document */

import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { annoEnCurso, obtenerPrecioInscripcion, obtenerPreciosMensualidad } from "./obtenerPrecios.js";
import { crearCeldaConInput, crearCeldaConSelect, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

import { peticion } from "./handlersPrecios.js";
import { arrayEstudiantesConvenio, crearConvenio, flagEmpleadoConvenio, flagHermanosConvenio, representanteConvenio } from "./conveniosPagos.js";
import { cambiarAFechaVenezolana, convertirAfechaHTML, determinarConceptoPorNumero, determinarNumeroConcepto, existeEnElArray, fechaDeHoyFormatoJS, fechaYaPaso, numberAformatoMontos, sumaDecimal, verificarProntoPagoPorFecha } from "./utilidades.js";
import { generarImagenConvenioPares, generarImagenConvenioIndividual } from "./impresion.js";
import { mostrarPantalla, ocultar } from "./funcionesHTML.js";

let arrayCedulasContrato = [];
let arrayObjetosEstudiantes = [];

export function estudianteTieneConvenioPorMes(estudiante, indice){

    let propiedades = ["Inscripcion",
                       "Septiembre",
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

    let tieneLaPropiedad = estudiante.hasOwnProperty("convenio" + propiedades[indice]);

    if(tieneLaPropiedad) return true;

    return false;

}

export function estudianteNoElegible(estudiante){

    let array = ["Inscripcion",
                 "Septiembre",
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

    let fechaHoy = fechaDeHoyFormatoJS();

    let fechaConvenio;

    //EL DATO SE CREA DURANTE EL PAGO EN MENSUALIDAD.JS

    for(let i = 0; i <= array.length - 1; i++){

        if(estudiante.hasOwnProperty("convenioFallido" + array[i])){

            return true;

        }

        if(estudiante.hasOwnProperty("convenio" + array[i])){

            fechaConvenio = estudiante["convenio" + array[i]];

            fechaConvenio = convertirAfechaHTML(fechaConvenio);

            if(fechaConvenioVencida(fechaConvenio, fechaHoy)) return true;

        }

    }
    
    return false;
}

export function pantallaConsultaMensualidadesVacia(){

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");

    return tabla.rows.length == 1;

}

export async function entrarConvenios(){

    try {
        
        mostrarPantallaCarga();
        await obtenerPrecioInscripcion();
        await obtenerPreciosMensualidad();
        document.getElementById("main-container-postLogin").style.display = "none";
        document.getElementById("mainContainerConveniosMensualidad").style.display = "block";

        ocultarPantallaCarga();

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }


}

function limpiarFormularioCompletoInterfazConsulta(){

    limpiarFormulariosInterfazConsulta(); //LA TABLA Y EL NOMBRE
    document.getElementById("cedulaRepresentanteConvenios").value = "";
    document.getElementById("nombreRepresentanteConvenio").style.display = "none";
    document.getElementById("tablaConsultarMesesConvenios").style.display = "none"; 
    document.getElementById("continuarCrearConvenio").style.display = "none";


}

export function salirConvenios(){

    document.getElementById("mainContainerConveniosMensualidad").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    document.getElementById("cedulaRepresentanteConvenios").value = "";
    ocultarElementosInterfazConsulta();
}

export function mostrarElementosInterfazConsulta(){

    document.getElementById("nombreRepresentanteConvenio").style.display = "block";
    document.getElementById("tablaConsultarMesesConvenios").style.display = "block";
    document.getElementById("continuarCrearConvenio").style.display = "block";

}

export function ocultarElementosInterfazConsulta(){

    document.getElementById("nombreRepresentanteConvenio").style.display = "none";
    document.getElementById("tablaConsultarMesesConvenios").style.display = "none";
    document.getElementById("continuarCrearConvenio").style.display = "none";
    
}

export function limpiarFormulariosInterfazConsulta(){ //NO SE INCLUYE LA CEDULA (PARA BUSQUEDA)

    document.getElementById("nombreRepresentanteConvenio").value = "";
    limpiarFilasTabla("tablaEstudiantesConvenio", 1);

}



export function insertarDatosRepresentante(representante){

    let formulario = document.getElementById("nombreRepresentanteConvenio");

    let nombre = representante.nombres + " " + representante.apellidos;

    formulario.value = nombre;

}

export function dibujarFilaTabla(estudiante, indiceMesEnCurso){

    let arrayCeldas = [];

    arrayCeldas.push(crearCeldaConTexto(estudiante.nombres));
    arrayCeldas.push(crearCeldaConTexto(estudiante.apellidos));
    arrayCeldas.push(crearCeldaConTexto(estudiante.cedula));
    arrayCeldas.push(crearCeldaConTexto(estudiante.curso));
    arrayCeldas.push(crearCeldaConTexto(estudiante.seccion));

    let deuda = obtenerIntervaloMeses(estudiante, indiceMesEnCurso);

    arrayCeldas.push(crearCeldaConTexto(deuda));

    let tabla = document.getElementById("tablaEstudiantesConvenio");

    let fila = crearTRconCeldasApendadas(arrayCeldas);

    tabla.appendChild(fila);

}

function obtenerIntervaloMeses(estudiante, mesEnCurso){

    let deuda = false;

    let propiedadesMeses = ["pago09Septiembre",
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

    let intervaloMeses = [];

    if(estudiante.hasOwnProperty("pagoInscripcion")){

        if(!estudiante.pagoInscripcion){

            deuda = true;
            intervaloMeses.push("Inscripción");

        }

    }

    for(let i = 0; i <= mesEnCurso; i++){

        if(estudiante[propiedadesMeses[i]]) continue;

        intervaloMeses.push(propiedadesMeses[i].substring(6)); //INSERTA EL NOMBRE DEL MES

        deuda = true;
    }

    if(!deuda) return "Solvente";

    if(intervaloMeses.length == 1) return intervaloMeses[0];

    return intervaloMeses[0] + " - " + intervaloMeses[intervaloMeses.length - 1];

}


export function entrarSeleccionarMesesConvenio(){

    document.getElementById("mainContainerConveniosMensualidad").style.display = "none";
    document.getElementById("mainContainerDetallesMensualidadesConvenios").style.display = "block";
    document.getElementById("seleccionarTodosLosMesesConvenio").checked = false;


}

export function dibujarFilaTablaDetallesMeses(estudiante, nPropiedad){

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");

    let arrayConceptos =   ["Inscripción",
                            "Septiembre",
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

  let arrayDescuentos = ["Ninguno", //0
                         "Pronto Pago", //1 
                         "Hermanos", //2
                         "Hermanos + Pronto Pago", //3 
                         "Empleado",  //4
                         "Empleado + Pronto Pago"]; //5

  let arrayDescuentosInscripcion = ["Ninguno", //0
                         "Pronto Pago", //1 
                         "Hermanos", //2
                         "Empleado",  //4
                         "Empleado + Pronto Pago"]; //5

    let arrayCeldas = [];

    

    let nombreCompleto = estudiante.nombres + " " + estudiante.apellidos;

    arrayCeldas.push(crearCeldaConTexto(nombreCompleto));

    arrayCeldas.push(crearCeldaConTexto(estudiante.cedula));

    arrayCeldas.push(crearCeldaConTexto(estudiante.curso));

    arrayCeldas.push(crearCeldaConTexto(arrayConceptos[nPropiedad]));

    //SE PREPARA UNA PETICION
    //PARA OBTENER EL PRECIO
    //A PAGAR POR EL CONCEPTO
    //EN CUESTION

    let peti = {

        tipo: "precio",
        tipo2: "",
        tipo3: "",
        tipo4: "",
        flagEmpleado: false,
        flagHermanos: false,
        annoConsultado: annoEnCurso

    };

    if(nPropiedad >= 1){
        
        peti.tipo2 = "mensualidad";

        peti.tipo4 = arrayConceptos[nPropiedad];
    
    }

    if(nPropiedad < 1) peti.tipo2 = "inscripcion";

    if(estudiante.curso.includes("Nivel")) peti.tipo3 = "preescolar";

    if(estudiante.curso.includes("Grado")) peti.tipo3 = "primaria";

    if(estudiante.curso.includes("Año")) peti.tipo3 = "bachillerato";

    peti.flagEmpleado = flagEmpleadoConvenio;
    peti.flagHermanos = flagHermanosConvenio;

    let petici = new peticion();

    let precio = petici.procesar(peti);

    precio = numberAformatoMontos(precio);

    //SE PIDE EL SELECTED INDEX DEL CONCEPTO
    //SE PIDE EL SELECTED INDEX DEL CONCEPTO
    //SE PIDE EL SELECTED INDEX DEL CONCEPTO

    let peticionSelectedIndex = {

        tipo: "selectedIndex",
        tipo2: "",
        tipo3: "",
        flagEmpleado: flagEmpleadoConvenio,
        flagHermanos: flagHermanosConvenio,
        annoConsultado: annoEnCurso

    };

    if(nPropiedad >= 1){

        peticionSelectedIndex.tipo2 = "descuentoMensualidad";
        peticionSelectedIndex.tipo3 = arrayConceptos[nPropiedad];

    }
    else peticionSelectedIndex.tipo2 = "descuentoInscripcion";

    debugger;

    let selectedIndex = petici.procesar(peticionSelectedIndex);

    let celdaConSelect;
    
    if(nPropiedad >= 1) celdaConSelect = crearCeldaConSelect(arrayDescuentos, "", selectedIndex);
    else celdaConSelect = crearCeldaConSelect(arrayDescuentosInscripcion, "", selectedIndex); 

    celdaConSelect.children[0].addEventListener("change", cambiarTipoDescuento);


    //SE CONTINUA PONIENDO LOS DATOS EN LA TABLA

    arrayCeldas.push(crearCeldaConTexto(precio));
    arrayCeldas.push(celdaConSelect);

    let celdaCheckbox = crearCeldaConInput("checkbox", false, "");

    celdaCheckbox.children[0].addEventListener("change", seleccionarMesConvenio);

    arrayCeldas.push(celdaCheckbox);

    let fila = crearTRconCeldasApendadas(arrayCeldas);

    tabla.appendChild(fila);


}

function cambiarTipoDescuento(){

    let seleccionado = this.selectedIndex;

    let concepto = this.parentNode.parentNode.children[3].textContent;

    let curso = this.parentNode.parentNode.children[2].textContent;

    let casillaPrecio = this.parentNode.parentNode.children[4];

    let petic = {
        tipo: "precio",
        tipo2: "",
        tipo3: "",
        selectedIndex: seleccionado

    };
    
    if(concepto == "Inscripción") petic.tipo2 = "inscripcion";
    else petic.tipo2 = "mensualidad";
    
    if(curso.includes("Año")) petic.tipo3 = "bachillerato";
    if(curso.includes("Grado")) petic.tipo3 = "primaria";
    if(curso.includes("Nivel")) petic.tipo3 = "preescolar";

    let obtenerPrecio = new peticion();

    casillaPrecio.textContent = obtenerPrecio.procesar(petic);

}

export function atrasSeleccionarMesesConvenio(){

    document.getElementById("mainContainerDetallesMensualidadesConvenios").style.display = "none";
    document.getElementById("mainContainerConveniosMensualidad").style.display = "block";

    document.getElementById("totalPagarConveniosDetalles").textContent = "0,00";

}

export function seleccionarTodosLosMesesConvenio(){

    let estadoAsignar = this.checked;

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");

    let checkbox;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        checkbox = tabla.rows[i].cells[6].children[0];

        checkbox.checked = estadoAsignar;

    }

    calcularMontoTotalPagar();

}

function calcularMontoTotalPagar(){

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");
    
    let totalPagar = document.getElementById("totalPagarConveniosDetalles");
    
    let contadorUSD = 0;

    let contadorDecimal;

    let valorTablaIteracion;
    
    totalPagar.textContent = "0,00";

    for(let i = 1; i <= tabla.rows.length - 1; i++){
    
        if(tabla.rows[i].cells[6].children[0].checked){

            contadorDecimal = numberAformatoMontos(contadorUSD);

            valorTablaIteracion = tabla.rows[i].cells[4].textContent;

            contadorUSD = sumaDecimal(contadorDecimal, valorTablaIteracion);
        }
    }

    totalPagar.textContent = numberAformatoMontos(contadorUSD);
}

function seleccionarMesConvenio(){

    let tablaConsultas = document.getElementById("tbodyDetallesMensualidadesConvenio");
    
    let verificador = 0;
    
    calcularMontoTotalPagar();
    
    let checkboxEncabezado = document.getElementById("seleccionarTodosLosMesesConvenio");

    let checkboxBucle;

    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){

        checkboxBucle = tablaConsultas.rows[i].cells[6].children[0];

        if(!checkboxBucle.checked && checkboxEncabezado.checked){//HAY POR LO MENOS UN CONCEPTO DESACTIVADO

            checkboxEncabezado.checked = false;
        
        }

        if(checkboxBucle.checked && !checkboxEncabezado.checked){//CONCEPTO ACTIVADO ENCONTRADO
            
            verificador++;
        
        }
    }

    if(verificador == (tablaConsultas.rows.length - 1)){
      
        checkboxEncabezado.checked = true;
    
    }
}

export function checkboxesInvalidos(){//AQUI QUEDO EL REFACTOR

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");

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

export function checkboxesMesesInvalidos(){

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");

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

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");

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

export function continuarAconfirmarDatosConvenio(){

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

    limpiarFilasTabla("tbodyConfirmarMesesConvenio", 1);

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");

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

    document.getElementById("totalPagarUSDconfirmarMesesConvenio").textContent = document.getElementById("totalPagarConveniosDetalles").textContent;

    entrarConfirmarMesesConvenios();

}

function dibujarFilaTablaMesesConfirmar(datosFila){

    let tabla = document.getElementById("tbodyConfirmarMesesConvenio");

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

function entrarConfirmarMesesConvenios(){

    document.getElementById("mainContainerDetallesMensualidadesConvenios").style.display = "none";    
    document.getElementById("mainContainerConfirmarMesesConvenio").style.display = "block";

}

export function atrasConfirmarMesesConvenios(){

    document.getElementById("mainContainerConfirmarMesesConvenio").style.display = "none";
    document.getElementById("mainContainerDetallesMensualidadesConvenios").style.display = "block";    

}

export function entrarConfirmarYcrearConvenios(){

    asignarDatosConfirmarYcrearConvenio();

    document.getElementById("mainContainerConfirmarMesesConvenio").style.display = "none";
    document.getElementById("mainContainerConfirmarYcrearConvenio").style.display = "block";       


}

function asignarDatosConfirmarYcrearConvenio(){

    let inputNombres = document.getElementById("nombresRepresentanteCrearConvenio");
    let inputApellidos = document.getElementById("apellidosRepresentanteCrearConvenio");
    let inputFecha = document.getElementById("fechaDePagoCrearConvenio");

    inputFecha.value = "";

    inputApellidos.value = representanteConvenio.apellidos;

    inputNombres.value = representanteConvenio.nombres;

}

function obtenerDatosParaContrato(cedulaArgumento){

    let estudiante;

    let estudianteContrato = {};

    for(let i = 0; i <= arrayEstudiantesConvenio.length - 1; i++){

        estudiante = arrayEstudiantesConvenio[i];

        if(estudiante.cedula != cedulaArgumento) continue;

        estudianteContrato["nombres"] = estudiante.nombres; 
        estudianteContrato["apellidos"] = estudiante.apellidos; 
        estudianteContrato["cedula"] = estudiante.cedula;
        estudianteContrato["curso"] = estudiante.curso; 
        estudianteContrato["intervalo"] = determinarIntervaloDeuda(estudiante.cedula);

        return estudianteContrato;

    }

}

export function fechaConvenioVencida(fechaConvenio, fechaHoy){

    let hoy = Date.parse(fechaHoy);

    let convenio = Date.parse(fechaConvenio);

    if(convenio >= hoy) return false; //OSEA, NO HA LLEGADO LA FECHA DEL FORMULARIO

    return true; //YA EL DIA HA PASADO


}

function fechaInvalidaFormulario(){

    let fechaHoy = fechaDeHoyFormatoJS();

    let fechaFormulario = document.getElementById("fechaDePagoCrearConvenio").value;

    debugger;

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

export async function prepararDatosPantallaPreguntaImprimir(){ 

    //ESTA SOLO SE EJECUTA UNA VEZ
    //Y ES CUANDO SE MUESTRA LA
    //PANTALLA DONDE SE PIDE LA FECHA

    if(fechaInvalidaFormulario()) return;

    arrayCedulasContrato = obtenerTodasLasCedulas();
    arrayObjetosEstudiantes = [];
    
    for(let i = 0; i <= arrayCedulasContrato.length - 1; i++){

        arrayObjetosEstudiantes.push(obtenerDatosParaContrato(arrayCedulasContrato[i]));

    }

    debugger;

    let respuesta = await crearConvenio();

    if(respuesta == "ERROR") return;
    
    ocultar("mainContainerConfirmarYcrearConvenio"); //OCULTA ESTA PANTALLA

    if(arrayCedulasContrato.length >= 2){

        dibujarTablaPreguntaImprimirPares(); 
        mostrarPantalla("pantallaPreguntaImprimirFormularioConvenioPares");
        
    } 
    else{
        dibujarTablaPreguntaImprimirIndividual();
        mostrarPantalla("pantallaPreguntaImprimirFormularioConvenioIndividual");

    }



}

function dibujarTablaPreguntaImprimirPares(){ //CAMBIAR LA FUENTE DE LOS DATOS A UN ARRAY PREOBTENIDO
                                              //PARA SIMPLIFICAR

    debugger;

    let primerEstudiante = obtenerDatosParaContrato(arrayCedulasContrato[0]);
    let segundoEstudiante = obtenerDatosParaContrato(arrayCedulasContrato[1]);

    let intervaloPrimerEstudiante = convertirIntervaloAmeses(primerEstudiante.intervalo);

    let intervaloSegundoEstudiante = convertirIntervaloAmeses(segundoEstudiante.intervalo);

    intervaloPrimerEstudiante = corregirEnCasoDeSoloUnMes(intervaloPrimerEstudiante);
    intervaloSegundoEstudiante = corregirEnCasoDeSoloUnMes(intervaloSegundoEstudiante);

    let tabla = document.getElementById("tablaImprimirFormularioConvenioPares");

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

    let primerEstudiante = obtenerDatosParaContrato(arrayCedulasContrato[0]);

    let intervaloPrimerEstudiante = convertirIntervaloAmeses(primerEstudiante.intervalo);

    intervaloPrimerEstudiante = corregirEnCasoDeSoloUnMes(intervaloPrimerEstudiante);

    let tabla = document.getElementById("tablaImprimirFormularioConvenioIndividual");

    //PRIMER ESTUDIANTE

    tabla.rows[1].cells[0].textContent = primerEstudiante.nombres;
    tabla.rows[1].cells[1].textContent = primerEstudiante.apellidos;
    tabla.rows[1].cells[2].textContent = intervaloPrimerEstudiante;

};

export async function botonSiImprimirConvenioPares(){

    let nombreRepresentanteConvenio = representanteConvenio.nombres + " " + representanteConvenio.apellidos;
    let cedulaRepresentanteConvenio = representanteConvenio.cedula;

    let intervaloConvenio = obtenerIntervaloCompuesto(arrayObjetosEstudiantes[0].intervalo, arrayObjetosEstudiantes[1].intervalo); 

    intervaloConvenio = convertirIntervaloAmeses(intervaloConvenio);

    intervaloConvenio = corregirEnCasoDeSoloUnMes(intervaloConvenio);

    let fechaPago = document.getElementById("fechaDePagoCrearConvenio").value;

    fechaPago = cambiarAFechaVenezolana(fechaPago);

    let datosConvenio = {
        nombreRepresentante: nombreRepresentanteConvenio,
        cedulaRepresentante: cedulaRepresentanteConvenio,
        
        apellidosEstudiante1: arrayObjetosEstudiantes[0].apellidos,
        nombresEstudiante1: arrayObjetosEstudiantes[0].nombres,
        cursoEstudiante1: arrayObjetosEstudiantes[0].curso,


        apellidosEstudiante2: arrayObjetosEstudiantes[1].apellidos,
        nombresEstudiante2: arrayObjetosEstudiantes[1].nombres,
        cursoEstudiante2: arrayObjetosEstudiantes[1].curso,

        intervalo: intervaloConvenio,

        fecha: fechaPago

    };

    await generarImagenConvenioPares(datosConvenio);

    determinarSiguientePaso();

}

export function corregirEnCasoDeSoloUnMes(intervaloConvenio){ //USANDOSE EN INSCRIPCION TAMBIEN

    let cadenaVerificacion = intervaloConvenio.split(" ");

    if(cadenaVerificacion[0] == cadenaVerificacion[2]) return cadenaVerificacion[0];

    else return intervaloConvenio;

}

export async function botonSiImprimirConvenioIndividual(){

    let nombreRepresentanteConvenio = representanteConvenio.nombres + " " + representanteConvenio.apellidos;
    let cedulaRepresentanteConvenio = representanteConvenio.cedula;

    let intervaloConvenio = convertirIntervaloAmeses(arrayObjetosEstudiantes[0].intervalo);
    
    intervaloConvenio = corregirEnCasoDeSoloUnMes(intervaloConvenio);

    let fechaPago = document.getElementById("fechaDePagoCrearConvenio").value;

    fechaPago = cambiarAFechaVenezolana(fechaPago);

    let datosConvenio = {
        nombreRepresentante: nombreRepresentanteConvenio,
        cedulaRepresentante: cedulaRepresentanteConvenio,
        
        apellidosEstudiante1: arrayObjetosEstudiantes[0].apellidos,
        nombresEstudiante1: arrayObjetosEstudiantes[0].nombres,
        cursoEstudiante1: arrayObjetosEstudiantes[0].curso,

        intervalo: intervaloConvenio,

        fecha: fechaPago

    };

    await generarImagenConvenioIndividual(datosConvenio);

    determinarSiguientePaso();

}

export function determinarSiguientePaso(){

    arrayObjetosEstudiantes.shift();
    arrayObjetosEstudiantes.shift();
    arrayCedulasContrato.shift();
    arrayCedulasContrato.shift();

    ocultar("pantallaPreguntaImprimirFormularioConvenioPares");
    ocultar("pantallaPreguntaImprimirFormularioConvenioIndividual");

    if(arrayCedulasContrato.length >= 2){

        dibujarTablaPreguntaImprimirPares(); 
        mostrarPantalla("pantallaPreguntaImprimirFormularioConvenioPares");
        
    } 

    if(arrayCedulasContrato.length == 1){
        dibujarTablaPreguntaImprimirIndividual();
        mostrarPantalla("pantallaPreguntaImprimirFormularioConvenioIndividual");
    }

    if(arrayCedulasContrato.length == 0){

        limpiarFormularioCompletoInterfazConsulta();
        mostrarPantalla("mainContainerConveniosMensualidad");

    }

}

export function obtenerTodasLasCedulas(){

    let tabla = document.getElementById("tbodyConfirmarMesesConvenio");

    let arrayCedulas = [];

    let cedula;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        cedula = tabla.rows[i].cells[1].textContent;

        if(arrayCedulas == []) arrayCedulas.push(cedula);
        
        else{

            if(existeEnElArray(arrayCedulas, cedula)) continue;

            else arrayCedulas.push(cedula);

        }

    }

    return arrayCedulas;

}

function determinarIntervaloDeuda(cedulaArgumento){

    let tabla = document.getElementById("tbodyConfirmarMesesConvenio");

    let arrayConceptos = [];

    let concepto;

    let cedulaTabla;

    let intervalo;

    let ultimoElemento;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        cedulaTabla = tabla.rows[i].cells[1].textContent;

        concepto = tabla.rows[i].cells[3].textContent;

        if(cedulaArgumento == cedulaTabla) arrayConceptos.push(concepto);

    }

    if(arrayConceptos.length > 1){

        ultimoElemento = arrayConceptos.length - 1;

        intervalo = determinarNumeroConcepto(arrayConceptos[0]);

        intervalo += "-" + determinarNumeroConcepto(arrayConceptos[ultimoElemento]);

    }

    if(arrayConceptos.length == 1){

        intervalo = determinarNumeroConcepto(arrayConceptos[0]);

        intervalo += "-" + intervalo;

    }

    return intervalo;

}

function obtenerIntervaloCompuesto(intervalo1, intervalo2){

    let intervaloCompuesto = "";

    intervalo1 = intervalo1.split("-");
    intervalo2 = intervalo2.split("-");

    let primerValorI1 = parseInt(intervalo1[0]);
    let primerValorI2 = parseInt(intervalo2[0]);

    let segundoValorI1 = parseInt(intervalo1[1]);
    let segundoValorI2 = parseInt(intervalo2[1]);

    //PRIMER VALOR
    //PRIMER VALOR
    //PRIMER VALOR

    if(primerValorI1 < primerValorI2 || primerValorI1 == primerValorI2){

        intervaloCompuesto = primerValorI1 + "-";

    }
    else intervaloCompuesto = primerValorI2 + "-";

    //SEGUNDO VALOR
    //SEGUNDO VALOR
    //SEGUNDO VALOR

    if(segundoValorI1 > segundoValorI2 || segundoValorI1 == segundoValorI2){

        intervaloCompuesto += segundoValorI1;

    }
    else intervaloCompuesto += segundoValorI2;


    return intervaloCompuesto;
}

function convertirIntervaloAmeses(intervalo){

    intervalo = intervalo.split("-");

    let primerConcepto = determinarConceptoPorNumero(intervalo[0]);
    let segundoConcepto = determinarConceptoPorNumero(intervalo[1]);

    return primerConcepto + " - " + segundoConcepto;

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

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");
    
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

    let tabla = document.getElementById("tbodyDetallesMensualidadesConvenio");

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

export function atrasConfirmarCrearConvenio(){

    ocultar("mainContainerConfirmarYcrearConvenio");
    mostrarPantalla("mainContainerConfirmarMesesConvenio");
    document.getElementById("fechaDePagoCrearConvenio").value = "";

}

export function armarDirectorioRepresentante(cedulaEstudiante, cedulaRepre){

    let directorio;

    directorio = "representantes/" + cedulaRepre + "/estudiantes" + annoEnCurso + "/" + cedulaEstudiante;

    return directorio;

}

export function armarDirectorioEstudiante(cedulaEstudiante){

    let directorio;

    let estudiante;

    for(let i = 0; i <= arrayEstudiantesConvenio.length - 1; i++){

        estudiante = arrayEstudiantesConvenio[i];

        if(estudiante.cedula == cedulaEstudiante){

            directorio = "estudiantes/" + annoEnCurso + "/" + estudiante.grado + "/" + estudiante.curso + " " + estudiante.seccion + "/" + "Estudiantes/" + cedulaEstudiante;

            return directorio;

        }

    }

}