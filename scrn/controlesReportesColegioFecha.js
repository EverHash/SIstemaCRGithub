/*global document */

import { mostrarPantallaError } from "./modal.js";
import { consultorBDcolegioFecha, verDetallesReporteColegio } from "./reportesColegioFecha.js";
import { determinarNumeroMesOrdinarioDosDigitos, verSiEsNumeroEntero } from "./utilidades.js";
import { crearCeldaConIcono, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

const err = -10;

export class gestorGUIColegioFechas{

    obtenerFechas(){

        if(this.formularioInvalido()){

            return err;

        }

        let anno = document.getElementById("SeleccionarAnnoReportesVariables").value;

        let mes = document.getElementById("SeleccionarMesReportesVariables");

        let dia = document.getElementById("SeleccionarDiaReportesVariables");

        mes = mes.options[mes.selectedIndex].textContent;

        mes = determinarNumeroMesOrdinarioDosDigitos(mes);

        dia = dia.options[dia.selectedIndex].textContent;
        
        let fechaProcesada = dia + "/" + mes + "/" + anno;

        return fechaProcesada;

    }

    formularioInvalido(){

        let anno = document.getElementById("SeleccionarAnnoReportesVariables").value;

        let mes = document.getElementById("SeleccionarMesReportesVariables");

        let dia = document.getElementById("SeleccionarDiaReportesVariables");

        if(anno == ""){

            mostrarPantallaError("Ingrese el año a consultar");
            return true;

        }

        if(verSiEsNumeroEntero(anno)){

            mostrarPantallaError("Ingrese solo digitos en el campo de año");
            return true;

        }

        if(mes.selectedIndex == 0 || dia.selectedIndex == 0){

            mostrarPantallaError("Seleccione el mes y el día");
            return true;

        }

    }

    limpiarTabla(){

        let idTabla = "tablaListaReportesVariablesFecha";

        limpiarFilasTabla(idTabla, 1);

    }

    limpiarGUI(){

        this.limpiarTabla();

        let anno = document.getElementById("SeleccionarAnnoReportesVariables");

        let mes = document.getElementById("SeleccionarMesReportesVariables");

        let dia = document.getElementById("SeleccionarDiaReportesVariables");

        anno.value = "";

        mes.selectedIndex = 0;

        dia.selectedIndex = 0;

        this.ocultarTabla();


    }

    ocultarTabla(){

        let contenedorTabla = document.getElementById("contenedorTablaReportesVariablesFecha");

        contenedorTabla.style.display = "none";

    }

    mostrarTabla(){

        let contenedorTabla = document.getElementById("contenedorTablaReportesVariablesFecha");

        contenedorTabla.style.display = "block";
    
    }

    dibujarTabla(reportes){

        this.ocultarTabla();

        let tabla = document.getElementById("tablaListaReportesVariablesFecha");

        this.limpiarTabla();

        let arrayCeldas = [];

        let celdaIcono;

        let filaCompleta;

        for(let i = 0; i <= reportes.length - 1; i++){

            arrayCeldas = [];

            arrayCeldas.push(crearCeldaConTexto(reportes[i].tipoEdicion));

            celdaIcono = crearCeldaConIcono("rsrcs/eye.png");

            celdaIcono.children[0].addEventListener("click", verDetallesReporteColegio);

            arrayCeldas.push(celdaIcono);
            arrayCeldas.push(crearCeldaConTexto(reportes[i].numeroReporte));
            arrayCeldas.push(crearCeldaConTexto(reportes[i].fecha));

            filaCompleta = crearTRconCeldasApendadas(arrayCeldas);

            tabla.appendChild(filaCompleta);

        }

        this.mostrarTabla();

    }

}

export class mediadorColegioFecha{

    dibujarTabla(reportes){

        let gestor = new gestorGUIColegioFechas();

        gestor.dibujarTabla(reportes);

    }

    mostrarTabla(){

        let gestor = new gestorGUIColegioFechas();

        gestor.mostrarTabla();

    }

    ocultarTabla(){

        let gestor = new gestorGUIColegioFechas();

        gestor.ocultarTabla();

    }

    limpiarGUI(){

        let gestor = new gestorGUIColegioFechas();

        gestor.limpiarGUI();

    }

    limpiarTabla(){

        let gestor = new gestorGUIColegioFechas();

        gestor.limpiarTabla();

    }

    obtenerFechas(){

        let gestor = new gestorGUIColegioFechas();

        return gestor.obtenerFechas();

    }

    async obtenerReportes(fecha){

        let consultor = new consultorBDcolegioFecha();

        let reportes = await consultor.obtenerReportes(fecha);

        return reportes;

    }


}