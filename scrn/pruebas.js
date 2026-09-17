/*global console */

import { peticionObtenerSelectedIndexDescuentoInscripcion, peticionObtenerSelectedIndexDescuentoMensualidad, peticionPrecioInscripcionBachilleratoFlags, peticionPrecioInscripcionPreescolarFlags, peticionPrecioInscripcionPrimariaFlags, peticionPrecioMensualidadBachilleratoFlags, peticionPrecioMensualidadPreescolarFlags, peticionPrecioMensualidadPrimariaFlags } from "./handlersPrecios.js";

export function probarFuncion(){

    let arrayTablaVerdad = [];

    let flagEmpleado = true;
    let flagHermanos = true;
    let flagProntoPago = true;

    let bucleEmpleado;
    let bucleProntoPago;
    let bucleHermanos;

    arrayTablaVerdad.push([ flagHermanos,  flagEmpleado,  flagProntoPago]); // 1 ->  4
    arrayTablaVerdad.push([ flagHermanos,  flagEmpleado, !flagProntoPago]); // 2 ->  3 
    arrayTablaVerdad.push([ flagHermanos, !flagEmpleado,  flagProntoPago]); // 3 ->  1 
    arrayTablaVerdad.push([ flagHermanos, !flagEmpleado, !flagProntoPago]); // 4 ->  2  
    arrayTablaVerdad.push([!flagHermanos,  flagEmpleado,  flagProntoPago]); // 5 ->  4 
    arrayTablaVerdad.push([!flagHermanos,  flagEmpleado, !flagProntoPago]); // 6 ->  3    
    arrayTablaVerdad.push([!flagHermanos, !flagEmpleado,  flagProntoPago]); // 7 ->  1       
    arrayTablaVerdad.push([!flagHermanos, !flagEmpleado, !flagProntoPago]); // 8 ->  0        

    let respuestas = [];

    respuestas.push(4); // 1
    respuestas.push(3); // 2
    respuestas.push(1); // 3
    respuestas.push(2); // 4
    respuestas.push(4); // 5
    respuestas.push(3); // 6
    respuestas.push(1); // 7
    respuestas.push(0); // 8

    let obtenerResultado;
    let resultado;

    for(let i = 0; i <= arrayTablaVerdad.length - 1; i++){

        bucleHermanos = arrayTablaVerdad[i][0];
        bucleEmpleado = arrayTablaVerdad[i][1];
        bucleProntoPago = arrayTablaVerdad[i][2];

        //obtenerResultado = new peticionPrecioInscripcionBachilleratoFlags();
        //obtenerResultado = new peticionPrecioInscripcionPrimariaFlags();
        //obtenerResultado = new peticionPrecioInscripcionPreescolarFlags();
        //obtenerResultado = new peticionPrecioMensualidadBachilleratoFlags();
        //obtenerResultado = new peticionPrecioMensualidadPreescolarFlags();
        //obtenerResultado = new peticionPrecioMensualidadPrimariaFlags();

        //obtenerResultado = new peticionObtenerSelectedIndexDescuentoMensualidad();
        obtenerResultado = new peticionObtenerSelectedIndexDescuentoInscripcion();

        resultado = obtenerResultado.procesar(bucleHermanos, bucleEmpleado, bucleProntoPago);

        if(resultado == respuestas[i]) console.log("BIEN");
        else console.log("ERROR, i: " + i);


    }


}