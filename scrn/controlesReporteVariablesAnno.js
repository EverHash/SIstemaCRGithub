/*global document */

import { mostrarPantallaError } from "./modal.js";
import { consultorBDreporteAnno } from "./reporteVariablesAnno.js";
import { crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

const err = -10;

class gestorGUIvariablesAnno{

    obtenerFecha(){

        let valor = document.getElementById("annoReportesVariablesAnual").value;

        if(this.formularioInvalido(valor)) return err;

        return valor;

    }

    formularioInvalido(valor){

        if(valor == ""){

            mostrarPantallaError("Introduzca el año a consultar");
            return err;

        }

    }

    limpiarTabla(){

        let idTabla = "tablaListaReportesVariablesAnno";

        limpiarFilasTabla(idTabla, 1);

    }

    limpiarGUI(){

        this.limpiarTabla();

        this.ocultarTabla();
        
        document.getElementById("annoReportesVariablesAnual").value = "";

    }

    mostrarTabla(){

        document.getElementById("contenedorTablaReportesVariablesAnno").style.display = "block";

    }

    ocultarTabla(){

        document.getElementById("contenedorTablaReportesVariablesAnno").style.display = "none";

    }

    dibujarTabla(reporte){

        let contador = reporte.contador;

        let tabla = document.getElementById("tablaListaReportesVariablesAnno");

        let arrayCeldas;

        let fila;

        for(let i = contador; i >= 1; i--){

            arrayCeldas = [];

            arrayCeldas.push(crearCeldaConTexto(reporte["cambio" + i][0])); //CONCEPTO
            arrayCeldas.push(crearCeldaConTexto(reporte["cambio" + i][1])); //VALOR ANTERIOR
            arrayCeldas.push(crearCeldaConTexto(reporte["cambio" + i][2])); //VALOR ACTUAL
            arrayCeldas.push(crearCeldaConTexto(reporte["cambio" + i][3])); //FECHA

            fila = crearTRconCeldasApendadas(arrayCeldas);

            tabla.appendChild(fila);

        }

    }

}

export class mediadorVariablesAnno{

    obtenerFecha(){

        let gestor = new gestorGUIvariablesAnno();

        return gestor.obtenerFecha();

    }

    limpiarTabla(){

        let gestor = new gestorGUIvariablesAnno();

        return gestor.limpiarTabla();
        
    }

    limpiarGUI(){

        let gestor = new gestorGUIvariablesAnno();

        return gestor.limpiarGUI();

    }

    mostrarTabla(){

        let gestor = new gestorGUIvariablesAnno();

        return gestor.mostrarTabla();        

    }

    ocultarTabla(){

        let gestor = new gestorGUIvariablesAnno();

        return gestor.ocultarTabla();

    }

    dibujarTabla(reporte){

        let gestor = new gestorGUIvariablesAnno();

        gestor.dibujarTabla(reporte);

    }

    async obtenerReporte(anno){

        let consultor = new consultorBDreporteAnno();

        let reporte = await consultor.obtenerReporte(anno);

        if(reporte == err) return err;

        return reporte;

    }

}