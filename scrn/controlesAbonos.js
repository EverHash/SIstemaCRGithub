/*global document */

import { representanteYaRegistrado } from "./abonosNoRegistrado.js";
import { limpiarValoresTotalPagarPantallaPagos, setTipoPago } from "./controlesEfectuarPago.js";
import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { obtenerPreciosMensualidad } from "./obtenerPrecios.js";
import { numberAformatoMontos, reemplazarCaracteres, sumaDecimal, validacionMontoEstiloBDV, verSiEsNumeroEntero } from "./utilidades.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

export{entrarAbonos,
       atrasAbonos,
       formularioInvalido,
       dibujarAbonosTablaConsultar,
       dibujarNuevaFilaTablaAbonos,
       limpiarTablaAbonos,
       entrarPantallaPagarAbono,
       limpiarTodoAtras,
       entrarTiposRepresentantesAbonos,
       atrasTiposRepresentantesAbonos,
       entrarRepresentantesNoRegistrados,
       atrasRepresentantesNoRegistrados,
       formularioInvalidoNoRegistrado,
       dibujarAbonosTablaConsultarNoRegistrado,
       atrasDatosRepresentanteNoRegistrado, 
       continuarIntroducirDatosRepresentanteNoRegistrado,
       entrarPantallaPagarAbonoNoRegistrado, 
       limpiarTodoAbonosNoRegistrado};
       

function atrasTiposRepresentantesAbonos(){

    document.getElementById("mainContainerTipoRepresentanteAbonos").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";

}

function entrarTiposRepresentantesAbonos(){ //ELIMINADA DE LOS LISTENERS

    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("mainContainerTipoRepresentanteAbonos").style.display = "block";

}

function entrarAbonos(){ //ESTA REEMPLAZO LA DE ARRIBA
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-Abonos").style.display = "block";
}
       
function atrasAbonos(){
    document.getElementById("main-container-Abonos").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    limpiarTodoAtras();
}

function entrarRepresentantesNoRegistrados(){

    document.getElementById("mainContainerTipoRepresentanteAbonos").style.display = "none";
    document.getElementById("mainContainerIntroducirDatosAbonoNoRegistrado").style.display = "block";

}

function limpiarFormularioRepresentanteNoRegistrado(){

    document.getElementById("nombresRepresentanteAbonoNoRegistrado").value = "";
    document.getElementById("apellidosRepresentanteAbonoNoRegistrado").value = "";
    document.getElementById("cedulaRepresentanteAbonoNoRegistrado").value = "";

}

function atrasDatosRepresentanteNoRegistrado(){

    document.getElementById("mainContainerIntroducirDatosAbonoNoRegistrado").style.display = "none";
    document.getElementById("mainContainerTipoRepresentanteAbonos").style.display = "block";
    limpiarFormularioRepresentanteNoRegistrado();
}

async function continuarIntroducirDatosRepresentanteNoRegistrado(){

    if(formularioInvalidoNoRegistrado()) return;

    if(await representanteYaRegistrado()){
        mostrarPantallaError("Representante ya habilitado para abonos, emplee el modulo para representantes ya registrados por favor");
        return 0;
    } 
    document.getElementById("mainContainerIntroducirDatosAbonoNoRegistrado").style.display = "none";
    document.getElementById("main-container-AbonosNoRegistrado").style.display = "block";

}

function atrasRepresentantesNoRegistrados(){

    document.getElementById("main-container-AbonosNoRegistrado").style.display = "none";
    document.getElementById("mainContainerIntroducirDatosAbonoNoRegistrado").style.display = "block";
    limpiarTodoAtrasRepresentantesNoRegistrados();

}

function limpiarTodoAtrasRepresentantesNoRegistrados(){

    limpiarFilasTabla("tablaConsultarAbonosRepresentanteNoRegistrado", 2);

    let tabla = document.getElementById("tablaConsultarAbonosRepresentanteNoRegistrado");

    tabla.rows[1].cells[0].children[0].value = "";
    tabla.rows[1].cells[1].children[0].selectedIndex = 0;
    tabla.rows[1].cells[3].children[0].value = "0,00";

}

function limpiarTodoAtras(){
    document.getElementById("tablaConsultarAbonos").style.display = "none"; //CONTAINER TABLA
    document.getElementById("abonarRepresentante").style.display = "none"; //BOTON ABONAR
    document.getElementById("cedulaRepresentanteAbonos").value = "";
    document.getElementById("nombreRepresentanteAbonos").value = "";
    limpiarTablaAbonos();
}

function limpiarTodoAbonosNoRegistrado(){
    document.getElementById("nombresRepresentanteAbonoNoRegistrado").value = "";
    document.getElementById("apellidosRepresentanteAbonoNoRegistrado").value = "";
    document.getElementById("cedulaRepresentanteAbonoNoRegistrado").value = "";
    limpiarFilasTabla("tablaConsultarAbonosRepresentanteNoRegistrado", 2);

    let tabla = document.getElementById("tablaConsultarAbonosRepresentanteNoRegistrado");

    tabla.rows[1].cells[0].children[0].value = "";
    tabla.rows[1].cells[1].children[0].selectedIndex = 0;
    tabla.rows[1].cells[3].children[0].value = "0,00";

}

function formularioInvalido(){
    let cedulaRepresentante = document.getElementById("cedulaRepresentanteAbonos").value;

    return verSiEsNumeroEntero(cedulaRepresentante);
}

function formularioInvalidoNoRegistrado(){

    let cedulaRepresentante = document.getElementById("cedulaRepresentanteAbonoNoRegistrado").value;
    let apellidosRepresentante = document.getElementById("apellidosRepresentanteAbonoNoRegistrado").value;
    let nombresRepresentante = document.getElementById("nombresRepresentanteAbonoNoRegistrado").value;

    if(verSiEsNumeroEntero(cedulaRepresentante) == 1 || cedulaRepresentante == ""){

        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca la cédula del representante sin separaciones por favor");
        return 1;

    }
    if(apellidosRepresentante == ""){

        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca los apellidos del representante");
        return 1;

    }
    if(nombresRepresentante == ""){

        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca los nombres del representante");
        return 1;

    }

    return 0;

}

function limpiarTablaAbonos(){
    let tabla = document.getElementById("tabla-consultar-abonosRepresentante");

    if(tabla.rows.length > 1){
        for(let i = tabla.rows.length - 1; i >= 1; i--){
            tabla.removeChild(tabla.lastChild);
        }   
    }
}

function nombresContenedoresRepetidos(formulario){
    let tabla = document.getElementById(formulario);
    let nombreContenedor;
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        nombreContenedor = tabla.rows[i].cells[0].children[0].value;
        for(let j = 1; j <= tabla.rows.length - 1; j++){
            if(j == i) continue;
            if(tabla.rows[j].cells[0].children[0].value == nombreContenedor) return 1;
        }
    }
    return 0;
}

function dibujarAbonosTablaConsultarNoRegistrado(datosRepresentante){
    let tabla = document.getElementById("tablaConsultarAbonosRepresentanteNoRegistrado");
    let fila;
    let celdaNombreContenedor;
    let tipoMoneda;
    let celdaAbonado;
    let celdaMonto;
    let inputNombreContenedor;
    let inputMonto;
    let marcador = false;
    let selectMoneda;
    let arrayMonedas = ["Seleccionar", "Bolívares", "Dólares"];


    for(let propiedad in datosRepresentante){
        if(!(propiedad.includes("abonos"))) continue;
        fila = document.createElement("tr");
        celdaNombreContenedor = document.createElement("td");
        tipoMoneda = document.createElement("td");
        celdaAbonado = document.createElement("td");
        celdaMonto = document.createElement("td");
        inputNombreContenedor = document.createElement("input");
        inputMonto = document.createElement("input");
        selectMoneda = document.createElement("select");
        for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.appendChild(document.createElement("option"));
        for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.children[i].textContent = arrayMonedas[i];
        if(datosRepresentante[propiedad][1] == "Dólares") selectMoneda.selectedIndex = 2;
        else selectMoneda.selectedIndex = 1;
        inputNombreContenedor.type = "text";
        inputNombreContenedor.placeholder = "Nombre Contenedor";
        inputNombreContenedor.value = datosRepresentante[propiedad][0];
        inputNombreContenedor.disabled = true;
        selectMoneda.disabled = true;
        inputMonto.type = "text";
        inputMonto.value = "0,00";
        inputMonto.addEventListener("input", validacionMontoEstiloBDV);
        celdaNombreContenedor.appendChild(inputNombreContenedor);
        tipoMoneda.appendChild(selectMoneda);
        celdaAbonado.textContent = numberAformatoMontos(datosRepresentante[propiedad][2]);
        celdaMonto.appendChild(inputMonto);
        fila.appendChild(celdaNombreContenedor);
        fila.appendChild(tipoMoneda);
        fila.appendChild(celdaAbonado);
        fila.appendChild(celdaMonto);
        tabla.appendChild(fila);
        marcador = true;
    }

    if(marcador == false){
        fila = document.createElement("tr");
        celdaNombreContenedor = document.createElement("td");
        tipoMoneda = document.createElement("td");
        celdaAbonado = document.createElement("td");
        celdaMonto = document.createElement("td");
        inputNombreContenedor = document.createElement("input");
        inputMonto = document.createElement("input");
        selectMoneda = document.createElement("select");
        for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.appendChild(document.createElement("option"));
        for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.children[i].textContent = arrayMonedas[i];
        inputNombreContenedor.type = "text";
        inputNombreContenedor.placeholder = "Nombre Contenedor";
        inputNombreContenedor.value = "";
        inputMonto.type = "text";
        inputMonto.value = "0,00";
        inputMonto.addEventListener("input", validacionMontoEstiloBDV);
        tipoMoneda.appendChild(selectMoneda);
        celdaNombreContenedor.appendChild(inputNombreContenedor);
        celdaAbonado.textContent = "0,00";
        celdaMonto.appendChild(inputMonto);
        fila.appendChild(celdaNombreContenedor);
        fila.appendChild(tipoMoneda);
        fila.appendChild(celdaAbonado);
        fila.appendChild(celdaMonto);
        tabla.appendChild(fila);
    }
    mostrarElementosUINoRegistrado();
}

function dibujarAbonosTablaConsultar(datosRepresentante){
    let contador = 1;
    let tabla = document.getElementById("tabla-consultar-abonosRepresentante");
    let fila;
    let celdaNombreContenedor;
    let tipoMoneda;
    let celdaAbonado;
    let celdaMonto;
    let inputNombreContenedor;
    let inputMonto;
    let marcador = false;
    let selectMoneda;
    let arrayMonedas = ["Seleccionar", "Bolívares", "Dólares"];


    for(let propiedad in datosRepresentante){
        if(!(propiedad.includes("abonos"))) continue;
        fila = document.createElement("tr");
        celdaNombreContenedor = document.createElement("td");
        tipoMoneda = document.createElement("td");
        celdaAbonado = document.createElement("td");
        celdaMonto = document.createElement("td");
        inputNombreContenedor = document.createElement("input");
        inputMonto = document.createElement("input");
        selectMoneda = document.createElement("select");
        for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.appendChild(document.createElement("option"));
        for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.children[i].textContent = arrayMonedas[i];
        if(datosRepresentante[propiedad][1] == "Dólares") selectMoneda.selectedIndex = 2;
        else selectMoneda.selectedIndex = 1;
        inputNombreContenedor.type = "text";
        inputNombreContenedor.placeholder = "Nombre Contenedor";
        inputNombreContenedor.value = datosRepresentante[propiedad][0];
        inputNombreContenedor.disabled = true;
        selectMoneda.disabled = true;
        inputMonto.type = "text";
        inputMonto.value = "0,00";
        inputMonto.addEventListener("input", validacionMontoEstiloBDV);
        celdaNombreContenedor.appendChild(inputNombreContenedor);
        tipoMoneda.appendChild(selectMoneda);
        celdaAbonado.textContent = numberAformatoMontos(datosRepresentante[propiedad][2]);
        celdaMonto.appendChild(inputMonto);
        fila.appendChild(celdaNombreContenedor);
        fila.appendChild(tipoMoneda);
        fila.appendChild(celdaAbonado);
        fila.appendChild(celdaMonto);
        tabla.appendChild(fila);
        marcador = true;
    }

    if(marcador == false){
        fila = document.createElement("tr");
        celdaNombreContenedor = document.createElement("td");
        tipoMoneda = document.createElement("td");
        celdaAbonado = document.createElement("td");
        celdaMonto = document.createElement("td");
        inputNombreContenedor = document.createElement("input");
        inputMonto = document.createElement("input");
        selectMoneda = document.createElement("select");
        for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.appendChild(document.createElement("option"));
        for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.children[i].textContent = arrayMonedas[i];
        inputNombreContenedor.type = "text";
        inputNombreContenedor.placeholder = "Nombre Contenedor";
        inputNombreContenedor.value = "";
        inputMonto.type = "text";
        inputMonto.value = "0,00";
        inputMonto.addEventListener("input", validacionMontoEstiloBDV);
        tipoMoneda.appendChild(selectMoneda);
        celdaNombreContenedor.appendChild(inputNombreContenedor);
        celdaAbonado.textContent = "0,00";
        celdaMonto.appendChild(inputMonto);
        fila.appendChild(celdaNombreContenedor);
        fila.appendChild(tipoMoneda);
        fila.appendChild(celdaAbonado);
        fila.appendChild(celdaMonto);
        tabla.appendChild(fila);
    }
    mostrarElementosUI();
}

function mostrarElementosUINoRegistrado(){
    document.getElementById("tablaConsultarAbonosNoRegistrado").style.display = "block"; //CONTAINER TABLA
    document.getElementById("nombreRepresentanteAbonosNoRegistrado").style.display = "block"; //NOMBRE REPRESENTANTE
}

function mostrarElementosUI(){
    document.getElementById("tablaConsultarAbonos").style.display = "block"; //CONTAINER TABLA
    document.getElementById("abonarRepresentante").style.display = "block"; //BOTON ABONAR
}


function borrarFila(){
    this.parentNode.parentNode.remove();
}

function dibujarNuevaFilaTablaAbonos(){
    let tabla = this.parentNode.parentNode.parentNode.parentNode.children[0];
    let fila = document.createElement("tr");
    let celdaNombreContenedor = document.createElement("td");
    let celdaMoneda = document.createElement("td");
    let celdaMontoAbonado = document.createElement("td");
    let celdaMontoAbonar = document.createElement("td");
    let celdaBorrar = document.createElement("th");
    let inputNombreContenedor = document.createElement("input");
    let inputMontoAbonar = document.createElement("input");
    let botonBorrarFila = document.createElement("img");
    let selectMoneda;
    let arrayMonedas = ["Seleccionar", "Bolívares", "Dólares"];


    selectMoneda = document.createElement("select");
    for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.appendChild(document.createElement("option"));
    for(let i = 0; i <= arrayMonedas.length - 1; i++) selectMoneda.children[i].textContent = arrayMonedas[i];

    let arrayClasesCeldaBorrar = ["celdaEstudianteBotonBorrar", "tdSinBorde"];

    celdaBorrar.classList.add(...arrayClasesCeldaBorrar);
    botonBorrarFila.src = "rsrcs/delete.png";
    botonBorrarFila.className = "icono";
    botonBorrarFila.addEventListener("click", borrarFila);
    inputNombreContenedor.type = "text";
    inputNombreContenedor.value = "";
    inputNombreContenedor.placeholder = "Nombre Contenedor";
    inputMontoAbonar.type = "text";
    inputMontoAbonar.value = "0,00";
    inputMontoAbonar.addEventListener("input", validacionMontoEstiloBDV);

    celdaNombreContenedor.appendChild(inputNombreContenedor);
    celdaMoneda.appendChild(selectMoneda);
    celdaMontoAbonado.textContent = "0,00";
    celdaMontoAbonar.appendChild(inputMontoAbonar);
    celdaBorrar.appendChild(botonBorrarFila);
    fila.appendChild(celdaNombreContenedor);
    fila.appendChild(celdaMoneda);
    fila.appendChild(celdaMontoAbonado);
    fila.appendChild(celdaMontoAbonar);
    fila.appendChild(celdaBorrar);
    tabla.appendChild(fila);
}

function formularioTablaInvalido(formulario){
    let tabla = document.getElementById(formulario);
    let nombreContenedor;
    let moneda;
    let montoAbonar;
    let marcador = false;
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        nombreContenedor = tabla.rows[i].cells[0].children[0];
        moneda = tabla.rows[i].cells[1].children[0];
        montoAbonar = tabla.rows[i].cells[3].children[0];

        if(nombreContenedor.value == ""){
            mostrarPantallaError("Ingrese un nombre para el contenedor de la fila " + i);
            return 1;
        }
        if(moneda.selectedIndex == 0){
            mostrarPantallaError("Ingrese una moneda en la fila " + i);
            return 1;
        }
        if(montoAbonar.value != "0,00"){
            marcador = true;
        }
    }
    if(marcador == false){
        mostrarPantallaError("Ingrese un monto a abonar a uno de los contenedores");
        return 1;
    }
}

function sumarBs(idTabla){
    let tabla = document.getElementById(idTabla);
    let montoAbonar;
    let moneda;
    let sumaBs = "0,00";
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        moneda = tabla.rows[i].cells[1].children[0];
        
        if(moneda.selectedIndex != 1) continue;
        
        montoAbonar = tabla.rows[i].cells[3].children[0];

        sumaBs = sumaDecimal(sumaBs, montoAbonar.value);
        sumaBs = numberAformatoMontos(sumaBs);
    }

    return sumaBs;
}

function sumarUSD(idTabla){
    let tabla = document.getElementById(idTabla);
    let montoAbonar;
    let moneda;
    let sumaUSD = "0,00";
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        moneda = tabla.rows[i].cells[1].children[0];
        
        if(moneda.selectedIndex != 2) continue;
        
        montoAbonar = tabla.rows[i].cells[3].children[0];

        sumaUSD = sumaDecimal(sumaUSD, montoAbonar.value);
        sumaUSD = numberAformatoMontos(sumaUSD);
    }

    return sumaUSD;

}

function ponerMontosAbonosPantallaPagos(tabla){
    let bs = sumarBs(tabla);
    let usd = sumarUSD(tabla);

    document.getElementById("montoAbonarPantallaPagos").textContent = bs + " Bs y " + usd + " USD";
}

async function entrarPantallaPagarAbono(){
    limpiarValoresTotalPagarPantallaPagos();
    if(formularioTablaInvalido("tabla-consultar-abonosRepresentante")) return;
    if(nombresContenedoresRepetidos("tabla-consultar-abonosRepresentante")){
        mostrarPantallaError("No puede haber nombres repetidos en los contenedores de abonos");
        return;
    }
    ponerMontosAbonosPantallaPagos("tabla-consultar-abonosRepresentante");
    setTipoPago("Abono");
    await obtenerPreciosMensualidad();
    document.getElementById("main-container-Abonos").style.display = "none";
    document.getElementById("mainContainerPagar").style.display = "block";
}

async function entrarPantallaPagarAbonoNoRegistrado(){
    limpiarValoresTotalPagarPantallaPagos();
    if(formularioTablaInvalido("tablaConsultarAbonosRepresentanteNoRegistrado")) return;
    if(nombresContenedoresRepetidos("tablaConsultarAbonosRepresentanteNoRegistrado")){
        mostrarPantallaError("No puede haber nombres repetidos en los contenedores de abonos");
        return;
    }
    ponerMontosAbonosPantallaPagos("tablaConsultarAbonosRepresentanteNoRegistrado");
    setTipoPago("AbonoNoRegistrado");
    await obtenerPreciosMensualidad();
    document.getElementById("main-container-AbonosNoRegistrado").style.display = "none";
    document.getElementById("mainContainerPagar").style.display = "block";
}
