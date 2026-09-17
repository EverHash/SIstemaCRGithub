/*global document */

import { obtenerIntervaloDeuda } from "./controlesTiposNuevaListaDeudores.js";
import { mostrarPantalla, ocultar } from "./funcionesHTML.js";
import { mostrarPantallaError, mostrarPantallaExito } from "./modal.js";
import { mediadorAnnoNuevaListaDeudores } from "./nuevaListaDeudores.js";
import { annoEnCurso } from "./obtenerPrecios.js";
import { crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

export class gestorGUIannoListaDeudores{

    limpiarInterfaz(){

        document.getElementById("annoEscolarListaDeudoresAnno").value = annoEnCurso;

        document.getElementById("mesConsultaNuevaListaDeudoresTodasLasSecciones").selectedIndex = 0;

        this.limpiarTabla();

        this.ocultarTabla();

    }

    formularioInvalido(){

        let index = document.getElementById("mesConsultaNuevaListaDeudoresTodasLasSecciones").selectedIndex;

        return index == 0; 

    }

    limpiarTabla(){

        limpiarFilasTabla("tablaListaDeudoresTodoElColegioNuevaLista", 1);        

    }

    ocultarTabla(){

        ocultar("contenedorTablaListaDeudoresTodoElColegioNuevaLista");

    }

    mostrarTabla(){

        document.getElementById("contenedorTablaListaDeudoresTodoElColegioNuevaLista").style.display = "block";

    }

    salir(){

        this.limpiarInterfaz();

        ocultar("mainContainerNuevaListaDeudoresAnno");

        mostrarPantalla("mainContainerNuevaListaDeudores");

    }

    dibujarTabla(arrayEstudiantes, mesLimite){

        let tabla = document.getElementById("tablaListaDeudoresTodoElColegioNuevaLista");

        let deudaEstudiante;

        let nombreEstudiante;

        let seccion;

        let arrayCeldas = [];

        for(let i = 0; i <= arrayEstudiantes.length - 1; i++){

            arrayCeldas = [];

            deudaEstudiante = obtenerIntervaloDeuda(arrayEstudiantes[i], mesLimite);

            if(deudaEstudiante == "SIN DEUDA") continue;

            nombreEstudiante = arrayEstudiantes[i].nombres + " " + arrayEstudiantes[i].apellidos;

            seccion = arrayEstudiantes[i].curso + " " + arrayEstudiantes[i].seccion;

            arrayCeldas.push(crearCeldaConTexto(arrayEstudiantes[i].nombreRepresentante));
            arrayCeldas.push(crearCeldaConTexto(arrayEstudiantes[i].cedulaRepresentante));

            arrayCeldas.push(crearCeldaConTexto(nombreEstudiante));

            arrayCeldas.push(crearCeldaConTexto(seccion));

            arrayCeldas.push(crearCeldaConTexto(deudaEstudiante));

            tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));


        }


    }

    obtenerDatosConsulta(){

        let annoEscolar = document.getElementById("annoEscolarListaDeudoresAnno").value;

        return annoEscolar;

    }

    obtenerMesLimite(){

        let mesLimite = document.getElementById("mesConsultaNuevaListaDeudoresTodasLasSecciones").selectedIndex;

        return mesLimite;        

    }

    noHayDeudores(){

        let tabla = document.getElementById("tablaListaDeudoresTodoElColegioNuevaLista");

        return tabla.rows.length == 1;

    }

    pantallaNoHayDeudores(){

        mostrarPantallaExito("No hay deudores para el mes consultado");

    }


}

export function salir(){

    let mediar = new mediadorAnnoNuevaListaDeudores();

    mediar.salir();

}

