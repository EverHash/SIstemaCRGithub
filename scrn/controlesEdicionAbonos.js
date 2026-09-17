/*global document */

import { eliminarAbono } from "./edicionAbonos.js";
import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { formatoMontosAnumber, numberAformatoMontos } from "./utilidades.js";
import { crearCeldaConInput, crearCeldaConSelect, crearTHconIcono, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

export let tablaNoEditadaCopia = [];
export let tablaCopiaComprobacion = [];
export let listaCambios = [];
export let nombreContenedorBorrar;
export let abonoBorrado;

const flagContenedorExistente = true;

const flagContenedorNoExistente = false;


export function entrarEdicionAbonos(){

    document.getElementById("mainContainerTipoEdicion").style.display = "none";
    document.getElementById("mainContainerEdicionAbonos").style.display = "block";

}

export function atrasEdicionAbonos(){

    document.getElementById("mainContainerEdicionAbonos").style.display = "none";
    document.getElementById("mainContainerTipoEdicion").style.display = "block";
    limpiarFormularios();
}

export function representanteNoExiste(representante){

    if(representante.exists()) return false;

    ocultarPantallaCarga();
    mostrarPantallaError("El representante no está registrado en la base de datos");
    return true;

}

function limpiarFormularios(){

    document.getElementById("cedulaRepresentanteEdicionAbonos").value = "";
    document.getElementById("nombreRepresentanteEdicionAbonos").value = "";
    document.getElementById("nombreRepresentanteEdicionAbonos").style.display = "none";
    document.getElementById("tablaConsultarEdicionAbonos").style.display = "none";
    document.getElementById("editarAbonosRepresentante").style.display = "none";
    limpiarFilasTabla("tablaEditarAbonosRepresentante", 1);

}

export function asignarDatosRepresentanteEnInterfaz(representante){

    let formularioNombre = document.getElementById("nombreRepresentanteEdicionAbonos");

    formularioNombre.value = representante.nombres + " " + representante.apellidos;

    if(representanteSinAbonos(representante)) dibujarTablaAbonosNoExistentes();
    else dibujarTablaAbonosExistentes(representante);

    mostrarElementosInterfaz();

}

function representanteSinAbonos(representante){

    for(let propiedad in representante){

        if(propiedad.includes("abonos")) return false;

    }

    return true;

}

function dibujarTablaAbonosExistentes(representante){

    let col1;
    let col2;
    let col3;
    let col4;

    let montoAbonado;

    let arrayCeldas;

    let arrayOpciones = ["Seleccionar", "Bolívares", "Dólares"];

    let tabla = document.getElementById("tablaEditarAbonosRepresentante");

    for(let propiedad in representante){

        if(!propiedad.includes("abonos")) continue;

        col1 = crearCeldaConInput("text", representante[propiedad][0], "");

        col1.children[0].disabled = true;
        
        if(representante[propiedad][1] == "Bolívares") col2 = crearCeldaConSelect(arrayOpciones, "", 1);
        if(representante[propiedad][1] == "Dólares") col2 = crearCeldaConSelect(arrayOpciones, "", 2);

        montoAbonado = numberAformatoMontos(representante[propiedad][2]);

        col3 = crearCeldaConInput("text", montoAbonado, "validacionMontoEstiloBDV");

        col4 = crearTHconIcono("rsrcs/delete.png");
        col4.className = "tdSinBorde";
        col4.children[0].style.width = "30px";
        col4.children[0].style.height = "30px";
        col4.children[0].addEventListener("click", mostrarModalBorrarContenedor);

        arrayCeldas = [];

        arrayCeldas.push(col1);
        arrayCeldas.push(col2);
        arrayCeldas.push(col3);
        arrayCeldas.push(col4);

        tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

    }

}

function dibujarTablaAbonosNoExistentes(){

    let arrayOpciones = ["Seleccionar", "Bolívares", "Dólares"];

    let col1 = crearCeldaConInput("text", "", "");
    let col2 = crearCeldaConSelect(arrayOpciones, "", 0);
    let col3 = crearCeldaConInput("text", "0,00", "validacionMontoEstiloBDV");

    col1.children[0].placeholder = "Nombre Contenedor";

    let arrayCeldas = [];

    arrayCeldas.push(col1);
    arrayCeldas.push(col2);
    arrayCeldas.push(col3);

    let tabla = document.getElementById("tablaEditarAbonosRepresentante");

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

export function agregarFilaAbonos(){

    let arrayOpciones = ["Seleccionar", "Bolívares", "Dólares"];

    let col1 = crearCeldaConInput("text", "", "");
    let col2 = crearCeldaConSelect(arrayOpciones, "", 0);
    let col3 = crearCeldaConInput("text", "0,00", "validacionMontoEstiloBDV");
    let col4 = crearTHconIcono("rsrcs/delete blue.png");

    col1.children[0].placeholder = "Nombre Contenedor";

    col4.children[0].style.width = "30px";
    col4.children[0].style.height = "30px";

    col4.children[0].addEventListener("click", function(){
        this.parentNode.parentNode.remove();
    });

    col4.className = "tdSinBorde";

    let arrayCeldas = [];

    arrayCeldas.push(col1);
    arrayCeldas.push(col2);
    arrayCeldas.push(col3);
    arrayCeldas.push(col4);

    let tabla = document.getElementById("tablaEditarAbonosRepresentante");

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

    let arrayCopiaFila = [];

    arrayCopiaFila.push("");
    arrayCopiaFila.push(0);
    arrayCopiaFila.push("0,00");
    arrayCopiaFila.push(flagContenedorNoExistente);

    tablaNoEditadaCopia.push(arrayCopiaFila);


}

export function formularioInvalido(){

    let tabla = document.getElementById("tablaEditarAbonosRepresentante");

    let nombreContenedor;

    let moneda;

    let monto;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        monto = tabla.rows[i].cells[2].children[0].value;

        moneda = tabla.rows[i].cells[1].children[0].selectedIndex;

        nombreContenedor = tabla.rows[i].cells[0].children[0].value;

        if(monto == "0,00"){

            mostrarPantallaError("No puede haber montos en 0,00 (fila " + i + ")");
            return true;

        }

        if(moneda == 0){

            mostrarPantallaError("No puede haber contenedores sin moneda (fila " + i + ")");
            return true;

        }

        if(nombreContenedor == ""){

            mostrarPantallaError("No puede haber contenedores sin nombre (fila " + i + ")");
            return true;

        }


    }

    return false;

}

function mostrarElementosInterfaz(){

    document.getElementById("nombreRepresentanteEdicionAbonos").style.display = "block";
    document.getElementById("tablaConsultarEdicionAbonos").style.display = "block";
    document.getElementById("editarAbonosRepresentante").style.display = "block";

}

export function noHuboCambios(){



}

export function copiarTablaAbonosNoEditada(){

    tablaNoEditadaCopia = [];

    let arrayCopiaFila;

    let tabla = document.getElementById("tablaEditarAbonosRepresentante");

    let nombreContenedor;

    let moneda;

    let monto;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        arrayCopiaFila = [];

        nombreContenedor = tabla.rows[i].cells[0].children[0].value;

        moneda = tabla.rows[i].cells[1].children[0].selectedIndex;

        monto = tabla.rows[i].cells[2].children[0].value;

        arrayCopiaFila.push(nombreContenedor);
        arrayCopiaFila.push(moneda);
        arrayCopiaFila.push(monto);

        if(nombreContenedor == "") arrayCopiaFila.push(flagContenedorNoExistente);
        else arrayCopiaFila.push(flagContenedorExistente);

        tablaNoEditadaCopia.push(arrayCopiaFila);

    }

}

export function copiarTablaParaComprobar(){

    tablaCopiaComprobacion = [];

    let arrayCopiaFila;

    let tabla = document.getElementById("tablaEditarAbonosRepresentante");

    let nombreContenedor;

    let moneda;

    let monto;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        arrayCopiaFila = [];

        nombreContenedor = tabla.rows[i].cells[0].children[0].value;

        moneda = tabla.rows[i].cells[1].children[0].selectedIndex;

        monto = tabla.rows[i].cells[2].children[0].value;

        arrayCopiaFila.push(nombreContenedor);
        arrayCopiaFila.push(moneda);
        arrayCopiaFila.push(monto);

        tablaCopiaComprobacion.push(arrayCopiaFila);

    }

}

export function determinarCambiosTabla(){

    listaCambios = [];

    let arrayCambiosFila = [];
    //[0]: FLAG CAMBIO
    //[1]: ESTADO ANTERIOR
    //[2]: NUEVO ESTADO

    let flagHuboCambio = true;
    let flagNoHuboCambio = false;

    for(let i = 0; i <= tablaNoEditadaCopia.length - 1; i++){ //ES VALIDO AGARRAR CUALQUIERA DE LAS DOS

        arrayCambiosFila = [];

        debugger;

        if(tablaNoEditadaCopia[i][3] == flagContenedorNoExistente){

            arrayCambiosFila.push(flagHuboCambio);
            arrayCambiosFila.push("No existente");
            arrayCambiosFila.push(resumenContenedor(i, "Comprobacion")); //FUNCION QUE ME DA EL NOMBRE + MONTO (MONEDA)
            listaCambios.push(arrayCambiosFila);
            continue;
        }

        if(huboCambiosFilaTabla(i)){

            arrayCambiosFila.push(flagHuboCambio);
            arrayCambiosFila.push(resumenContenedor(i, "Original"));
            arrayCambiosFila.push(resumenContenedor(i, "Comprobacion")); //FUNCION QUE ME DA EL NOMBRE + MONTO (MONEDA)
            listaCambios.push(arrayCambiosFila);            
            continue;

        }
        else{

            arrayCambiosFila.push(flagNoHuboCambio);
            arrayCambiosFila.push("N/A");
            arrayCambiosFila.push("N/A");
            listaCambios.push(arrayCambiosFila);            
            continue;

        }

    } 

    debugger;


}

function huboCambiosFilaTabla(indice){ //USA EL INDICE DEL ARRAY, NO EL DE LA TABLA

    if(tablaNoEditadaCopia[indice][0] != tablaCopiaComprobacion[indice][0]) return true;
    if(tablaNoEditadaCopia[indice][1] != tablaCopiaComprobacion[indice][1]) return true;
    if(tablaNoEditadaCopia[indice][2] != tablaCopiaComprobacion[indice][2]) return true;

    return false;

}

export function flagHuboCambiosContenedores(){

    let huboCambio = false;

    for(let i = 0; i <= listaCambios.length - 1; i++){

        if(listaCambios[i][0] == true) huboCambio = true; 

    }

    return huboCambio;

}

function resumenContenedor(indice, tipo){

    let nombre;

    let moneda;

    let monto;

    let resultado;

    if(tipo == "Comprobacion"){

        nombre = tablaCopiaComprobacion[indice][0];

        if(tablaCopiaComprobacion[indice][1] == 1) moneda = "Bs";
        if(tablaCopiaComprobacion[indice][1] == 2) moneda = "$";

        monto = tablaCopiaComprobacion[indice][2];
        
        resultado = nombre + " (" + monto + " " + moneda + ")";

        return resultado;
    }

    if(tipo == "Original"){

        nombre = tablaNoEditadaCopia[indice][0];

        if(tablaNoEditadaCopia[indice][1] == 1) moneda = "Bs";
        if(tablaNoEditadaCopia[indice][1] == 2) moneda = "$";

        monto = tablaNoEditadaCopia[indice][2];
        
        resultado = nombre + " (" + monto + " " + moneda + ")";

        return resultado;        

    }


}

export function construirObjetoRepresentanteSinAbonos(representante){

    let resultado = {};

    for(let propiedad in representante){

        if(propiedad.includes("abonos")) continue;

        resultado[propiedad] = representante[propiedad];

    }

    return resultado;

}

export function construirObjetoRepresentanteCompleto(representante){

    let resultado = {};

    for(let propiedad in representante) resultado[propiedad] = representante[propiedad];

    return resultado;

}

export function noHubieronCambios(){



}

export function obtenerDatosPropiedadDeFila(nFila){

    let tabla = document.getElementById("tablaEditarAbonosRepresentante");

    let arrayPropiedad = [];

    let nombreContenedor = tabla.rows[nFila].cells[0].children[0].value;

    let moneda = "";

    let montoAbonado = 0;

    if(tabla.rows[nFila].cells[1].children[0].selectedIndex == 1) moneda = "Bolívares";
    if(tabla.rows[nFila].cells[1].children[0].selectedIndex == 2) moneda = "Dólares";

    montoAbonado = tabla.rows[nFila].cells[2].children[0].value;

    montoAbonado = formatoMontosAnumber(montoAbonado);

    arrayPropiedad.push(nombreContenedor);
    arrayPropiedad.push(moneda);
    arrayPropiedad.push(montoAbonado);

    return arrayPropiedad;

}

export function obtenerNombrePropiedadDeFila(nFila){

    let tabla = document.getElementById("tablaEditarAbonosRepresentante");

    let nombreContenedor = tabla.rows[nFila].cells[0].children[0].value;

    return "abonos" + nombreContenedor;

}

export function cerrarModalEditarAbonos(){

    document.getElementById("modalConfirmarEditarAbonos").style.display = "none";

}

export function mostrarModalEditarAbonos(){

    if(formularioInvalido()) return;

    copiarTablaParaComprobar();

    determinarCambiosTabla();

    if(!flagHuboCambiosContenedores()){

        ocultarPantallaCarga();
        mostrarPantallaError("No hubo cambios en los contenedores");
        return;

    }

    document.getElementById("modalConfirmarEditarAbonos").style.display = "block";

}

function mostrarModalBorrarContenedor(){

    nombreContenedorBorrar = this.parentNode.parentNode.children[0].children[0].value; //EL INPUT CON EL NOMBRE

    let moneda = this.parentNode.parentNode.children[1].children[0].selectedIndex;

    if(moneda == 1) moneda = "Bs";
    if(moneda == 2) moneda = "$";

    let monto = this.parentNode.parentNode.children[2].children[0].value;

    abonoBorrado = [];

    abonoBorrado.push(nombreContenedorBorrar + " (" + monto + " " + moneda + ")");
    abonoBorrado.push("Eliminado");

    document.getElementById("modalConfirmarBorrarContenedor").style.display = "block";


}

export function cerrarModalBorrarContenedor(){

    document.getElementById("modalConfirmarBorrarContenedor").style.display = "none";

}