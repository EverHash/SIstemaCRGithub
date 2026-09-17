/*global document */

import { mostrarPantallaError } from "./modal.js";
import { verDetallesReporte } from "./reporteEdiciones.js";
import { consultorBDreportesCedula } from "./reportesRepresentantesCedula.js";
import { verSiEsNumeroEntero } from "./utilidades.js";
import { crearCeldaConIcono, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

const err = -10;

export class gestorGUI{
    
    formularioInvalido(){

        let cedula = document.getElementById("cedulaRepresentanteReportesEdiciones").value;

        if(verSiEsNumeroEntero(cedula) != 0){

            mostrarPantallaError("Introduzca la cédula, sin carácteres especiales");
            return err;

        }

        return 0;

    }

    obtenerCedula(){

        if(this.formularioInvalido() == err){

            return err;

        }

        let cedula = document.getElementById("cedulaRepresentanteReportesEdiciones").value;

        return cedula;


    }

    dibujarTablaReportes(reportes){

        this.ocultarTabla();

        let tabla = document.getElementById("tablaListaReportesRepresentanteCedula");

        limpiarFilasTabla(tabla.id, 1);

        let arrayCeldas = [];

        let celdaIcono;

        let filaCompleta;

        for(let i = 0; i <= reportes.length - 1; i++){

            arrayCeldas = [];

            arrayCeldas.push(crearCeldaConTexto(reportes[i].nombreRepresentante));
            arrayCeldas.push(crearCeldaConTexto(reportes[i].cedulaRepresentante));
            arrayCeldas.push(crearCeldaConTexto(reportes[i].tipoEdicion));

            celdaIcono = crearCeldaConIcono("rsrcs/eye.png");

            celdaIcono.children[0].addEventListener("click", verDetallesReporte);

            arrayCeldas.push(celdaIcono);
            arrayCeldas.push(crearCeldaConTexto(reportes[i].numeroReporte));
            arrayCeldas.push(crearCeldaConTexto(reportes[i].fecha));

            filaCompleta = crearTRconCeldasApendadas(arrayCeldas);

            tabla.appendChild(filaCompleta);

        }

        this.mostrarTabla();


    }

    mostrarTabla(){

        document.getElementById("contenedorTablaReportesEdicionesRepresentanteCedula").style.display = "block";        

    }

    ocultarTabla(){

        document.getElementById("contenedorTablaReportesEdicionesRepresentanteCedula").style.display = "none";

    }

    limpiarGUI(){

        let cedula = document.getElementById("cedulaRepresentanteReportesEdiciones");

        cedula.value = "";

        let tabla = document.getElementById("tablaListaReportesRepresentanteCedula");

        this.ocultarTabla();

        limpiarFilasTabla(tabla.id, 1);

    }


}

export class mediadorReportesCedula{

    obtenerCedula(){

        let gestor = new gestorGUI();

        return gestor.obtenerCedula();

    }

    async obtenerReportes(cedula){

        let consultor = new consultorBDreportesCedula();

        let reportes = await consultor.obtenerReportes(cedula);

        if(reportes == err) return;

        let reportesRetornados = [...reportes];

        return reportesRetornados;

    }

    dibujarTablaReportes(reportes){

        let gestor = new gestorGUI();

        gestor.dibujarTablaReportes(reportes);


    }

    limpiarGUI(){

        let gestor = new gestorGUI();

        gestor.limpiarGUI();

    }

}