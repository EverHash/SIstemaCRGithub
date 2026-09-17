/*global document, console */

import { crearCeldaConInput, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

export{dibujarTablaEstudiante, 
       guardarEstatusTabla, 
       tablaInvalida, 
       mesCambiado, 
       separarSufijoYprefijoDePropiedadEstudiante, 
       ocultarYlimpiar,
       mostrarTablaYboton};

    let arrayCeldas = [];

    let arrayFilas = [];

function dibujarTablaEstudiante(estudiante){

    let tabla = document.getElementById("tbodyMesesEditor");

    let arrayMeses = ["pago09Septiembre",
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

    let c1 = crearCeldaConTexto(estudiante.nombres + " " + estudiante.apellidos);
    let c2;
        
    if(estudiante.hasOwnProperty("pagoInscripcion")){

        c2 = crearCeldaConInput("checkbox", estudiante["pagoInscripcion"], "");

        c2.children[0].style.accentColor = "green";

    }
    else{

        c2 = crearCeldaConInput("checkbox", true, "");
        c2.children[0].disabled = true; 
        
    } 

    let arrayCeldasMeses = [];

    let celdaNA;

    let imagenNA;

    let celdaActual;

    for(let i = 0; i <= 11; i++){

        if(estudiante[arrayMeses[i]]){

            if(estudiante[arrayMeses[i]] != "N/A"){

                celdaActual = crearCeldaConInput("checkbox", estudiante[arrayMeses[i]], "");
                celdaActual.children[0].style.accentColor = "green";

                arrayCeldasMeses.push(celdaActual);
                continue;

            }

            celdaNA = crearCeldaConInput("checkbox", estudiante[arrayMeses[i]], "");
            
            imagenNA = document.createElement("img");
            imagenNA.src = "rsrcs/noAplica.png";
            imagenNA.style.width = "21px";
            imagenNA.style.height = "21px";

            celdaNA.appendChild(imagenNA);
            celdaNA.children[0].style.display = "none";

            arrayCeldasMeses.push(celdaNA);

            continue;

        }

        celdaActual = crearCeldaConInput("checkbox", estudiante[arrayMeses[i]], "");
        celdaActual.children[0].style.accentColor = "green";

        arrayCeldasMeses.push(celdaActual);                

    }
    


    let arrayCeldas = [];

    arrayCeldas.push(c1);
    arrayCeldas.push(c2);

    for(let i = 0; i <= arrayCeldasMeses.length - 1; i++){

        arrayCeldas.push(arrayCeldasMeses[i]);

    }

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

function guardarEstatusTabla(){

    let tabla = document.getElementById("tbodyMesesEditor");

    arrayFilas = [];

    for(let i = 2; i <= tabla.rows.length - 1; i++){

        arrayCeldas = [];

        for(let j = 1; j <= tabla.rows[i].cells.length - 1; j++){

            arrayCeldas.push(tabla.rows[i].cells[j].children[0].checked);

        }

        arrayFilas.push(arrayCeldas);

    }
    
}

function huboCambiosFila(fila){

    let tabla = document.getElementById("tbodyMesesEditor");

    let arrayCeldasInterno = [];


    //PRIMERO OBTENEMOS LOS DATOS ACTUALES DE LA FILA

    for(let j = 1; j <= tabla.rows[fila].cells.length - 1; j++){

        arrayCeldasInterno.push(tabla.rows[fila].cells[j].children[0].checked);

    }


    //AHORA COMPARAMOS SI HUBO CAMBIOS
    //arrayFilas[fila - 2] FILA - 2 PA QUE ENCAJEN LOS DOS INDICES

    for(let i = 0; i <= arrayCeldasInterno.length - 1; i++){

        if(arrayFilas[fila - 2][i] != arrayCeldasInterno[i]){

            console.log("cambio: ", i);
            return true; //HUBO CAMBIOS

        }

    }

    return false; //NO HUBO CAMBIOS

}

function tablaInvalida(){

    let tabla = document.getElementById("tbodyMesesEditor");

    for(let i = 2; i <= tabla.rows.length - 1; i++){

        if(huboCambiosFila(i)) return false;

    }

    return true;   

}

function determinarCeldaConNombrePropiedad(propiedad){

    let arrayMeses = ["pagoInscripcion",
                      "pago09Septiembre",
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

    for(let i = 0; i <= arrayMeses.length - 1; i++){

        if(propiedad == arrayMeses[i]) return i;

    }

}

function mesCambiado(propiedadMes, fila){

    let tabla = document.getElementById("tbodyMesesEditor");

    let nCelda = determinarCeldaConNombrePropiedad(propiedadMes);

    return arrayFilas[fila - 2][nCelda] != tabla.rows[fila].cells[nCelda + 1].children[0].checked;

}

function separarSufijoYprefijoDePropiedadEstudiante(propiedad){

    if(propiedad == "pagoInscripcion") return "Inscripción";

    else return propiedad.substring(6);

}

function ocultarYlimpiar(){

    limpiarFilasTabla("tbodyMesesEditor", 2); //LIMPIA LA TABLA

    document.getElementById("cedulaRepresentanteEditorMensualidad").value = "";

    document.getElementById("cajaTablaEditorMeses").style.display = "none";

    document.getElementById("editarMensualidades").style.display = "none";

}

function mostrarTablaYboton(){

    document.getElementById("cajaTablaEditorMeses").style.display = "block";

    document.getElementById("editarMensualidades").style.display = "flex";    

}