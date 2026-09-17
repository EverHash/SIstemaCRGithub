/*global document, console */

import {mostrarPantallaError,
        mostrarPantallaCarga,
        ocultarPantallaCarga} from "./modal.js";

import {formularioInvalido,
        dibujarTablaMontosCierre,
        dibujarPago,
        obtenerFechaFormulario,
        dibujarEncabezadoTablaDetalles,
        obtenerNumeroMes} from "./controlesCierreCajaMetodos.js";

import { Base, query, collection, getDocs, where } from "./firebase.js";

import {invertirOrdenArray} from "./utilidades.js";

export {determinarTipoCierre};

async function cierreCajaMetodosMES(){
    mostrarPantallaCarga();
    let anno = document.getElementById("SeleccionarAnnoMetodos").value;
    let mes = document.getElementById("SeleccionarMesMetodos");
    let dia;
    let mesObtenido = mes.options[mes.selectedIndex].textContent;
    mesObtenido = obtenerNumeroMes(mesObtenido);
    let arrayTodo = [];
    let contador = 0;
    let coleccionPagos = await collection(Base, "pagosMetodos/");
    let obtenerDatos;
    let documentos;
    let fecha;
    let archivo;
    for(let i = 1; i <= 31; i++){
        if(i <= 9) dia = "0" + i;
        else dia = i;
        fecha = dia + "/" + mesObtenido + "/" + anno;
        obtenerDatos = await query(coleccionPagos, where("fecha", "==", fecha));
        documentos = await getDocs(obtenerDatos);
        documentos.forEach(documento => {
            archivo = documento.data();
            arrayTodo.push(archivo);
            contador++;
        });
    }
    if(contador == 0){
        mostrarPantallaError("No hay transacciones registradas para este mes");
        ocultarPantallaCarga();
        return 1;
    }
    arrayTodo = invertirOrdenArray(arrayTodo);
    dibujarEncabezadoTablaDetalles();
    dibujarTablaMontosCierre(arrayTodo);
    for(let i = 0; i <= arrayTodo.length - 1; i++){
        dibujarPago(arrayTodo[i]);
    }
    ocultarPantallaCarga();
}

async function determinarTipoCierre(){

    document.getElementById("containerTablasCierreMetodos").style.display = "none";
    if( document.getElementById("metodosCierreTbody") != null){
        document.getElementById("metodosCierreTbody").remove();
        document.getElementById("datosPagosMetodosTbody").remove();
    }

    let dia = document.getElementById("SeleccionarDiaMetodos");

    let resultadoConsulta;

    if(dia.selectedIndex == 32) resultadoConsulta = await cierreCajaMetodosMES();
    else resultadoConsulta = await cierreCajaMetodos();

    if(resultadoConsulta == 1){
        document.getElementById("containerTablasCierreMetodos").style.display = "none";
    }
    else document.getElementById("containerTablasCierreMetodos").style.display = "block";
}

async function cierreCajaMetodos(){
    try {
        mostrarPantallaCarga();
        if(formularioInvalido()){
            document.getElementById("containerTablasCierreMetodos").style.display = "none";
            ocultarPantallaCarga();
            return 1;  
        } 
        let fecha = obtenerFechaFormulario();
        let coleccionPagos = await collection(Base, "pagosMetodos/");
        let obtenerDatos = await query(coleccionPagos, where("fecha", "==", fecha));
        let documentos = await getDocs(obtenerDatos);
        let arrayArchivos = [];
        let archivo;
        let contador = 0;
        documentos.forEach(documento => {
            archivo = documento.data();
            arrayArchivos.push(archivo);
            contador++;
        });
        if(contador == 0){
            mostrarPantallaError("No hay transacciones registradas para este día");
            ocultarPantallaCarga();
            return 1;
        }
        arrayArchivos = invertirOrdenArray(arrayArchivos);
        dibujarEncabezadoTablaDetalles();
        dibujarTablaMontosCierre(arrayArchivos);
        for(let i = 0; i <= arrayArchivos.length - 1; i++){
            dibujarPago(arrayArchivos[i]);
        }
        ocultarPantallaCarga();
    } catch (error) {
        ocultarPantallaCarga();
        console.log("Error al realizar el cierre de caja: ", error);
        mostrarPantallaError("Error: " + error);
    }
}