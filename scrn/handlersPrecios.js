/*global document */

import {annoEnCurso, 
        descuentoEmpleado, 
        descuentoHermanos, 
        descuentoProntoPagoInscripcion, 
        descuentoProntoPagoMensualidad, 
        fechaMaximaDescuentoProntoPago, 
        mensualidadBachilleratoProntoPagoHermanos, 
        mensualidadPreescolarProntoPagoHermanos, 
        mensualidadPrimariaProntoPagoHermanos, 
        precioInscripcionBachillerato, 
        precioInscripcionPreescolar, 
        precioInscripcionPrimaria, 
        precioMensualidadBachillerato, 
        precioMensualidadPreescolar, 
        precioMensualidadPrimaria } from "./obtenerPrecios.js";

import {determinarProntoPago, 
        fechaDeHoyFormatoJS, 
        numberAformatoMontos, 
        productoPrecision2, 
        restaDecimal, 
        verificarProntoPagoPorFecha } from "./utilidades.js";


/*
PARA PRECIOS

peticion{

    tipo:"precio",
    tipo2: "mensualidad" | "inscripcion",
    tipo3: "preescolar" | "primaria" | "bachillerato"
    tipo4: MES (SOLO PASARLA EN CASO MENSUALIDAD)
    annoConsultado: ANNO (NECESARIO PARA QUE FUNCIONE BIEN EN EL MODULO DE INSCRIPCION)
    selectedIndex: 0-5 (PROPIEDAD SOLO PRESENTE EN PETICION SELECTED INDEX)
    flagEmpleado: bool,
    flagHermanos: bool,


}


*/

/*

PARA SELECTED INDEX DESCUENTO

peticion{

    tipo: "selectedIndex",
    tipo2: "descuentoMensualidad" || "descuentoInscripcion",
    tipo3: MES (SOLO PRESENTE EN DESCUENTO MENSUALIDAD POR SUPUESTO)
    flagEmpleado: bool,
    flagHermanos: bool,
    annoConsultado: ANNO


}



*/


/*

PARA NOMBRE DESCUENTO

peticion{

    tipo: "precio",
    tipo2: "tipoDescuento",
    tipo3: "inscripcion" | MES
    flagEmpleado: bool,
    flagHermanos: bool,    

}



*/

export class peticion{

    procesar(peticion){
        if(peticion.tipo == "precio"){

            let precionPreci = new peticionPrecio();
            return precionPreci.procesar(peticion);

        }

        if(peticion.tipo == "selectedIndex"){

            let selectedIndexPeticion = new peticionSelectedIndex();
            return selectedIndexPeticion.procesar(peticion);

        }

    } 

}

class peticionSelectedIndex{

    procesar(peticion){

        if(peticion.tipo2 == "descuentoMensualidad"){

            let selectedIndexDescuentoPeticion = new peticionSelectedIndexDescuentoMensualidad();
            return selectedIndexDescuentoPeticion.procesar(peticion);

        }

        if(peticion.tipo2 == "descuentoInscripcion"){

            let selectedIndexDescuentoPeticion = new peticionSelectedIndexDescuentoInscripcion();
            return selectedIndexDescuentoPeticion.procesar(peticion);

        }

    }

}

class peticionSelectedIndexDescuentoMensualidad{

    procesar(peticion){

        let flagProntoPago = false;

        let flagHermanos = peticion.flagHermanos;

        let flagEmpleado = peticion.flagEmpleado;        

        flagProntoPago = determinarProntoPago(peticion.tipo3, peticion.annoConsultado);

        let selectedIndex = new peticionObtenerSelectedIndexDescuentoMensualidad();

        return selectedIndex.procesar(flagHermanos, flagEmpleado, flagProntoPago);

    }

}

class peticionSelectedIndexDescuentoInscripcion{

    procesar(peticion){

        let flagProntoPago = false;

        let flagHermanos = peticion.flagHermanos;

        let flagEmpleado = peticion.flagEmpleado;        

        if(verificarProntoPagoPorFecha(fechaDeHoyFormatoJS(), fechaMaximaDescuentoProntoPago)) flagProntoPago = true;

        let selectedIndex = new peticionObtenerSelectedIndexDescuentoInscripcion();

        return selectedIndex.procesar(flagHermanos, flagEmpleado, flagProntoPago);

    }

}

export class peticionObtenerSelectedIndexDescuentoMensualidad{

    procesar(flagHermanos, flagEmpleado, flagProntoPago){

        let arrayDescuentos = [
            "Ninguno", //0
            "Pronto Pago", //1
            "Hermano", //2
            "Pronto Pago + Hermanos", //3
            "Empleado", //4
            "Empleado + Pronto Pago" //5
        ];

        if(!flagEmpleado && !flagHermanos && !flagProntoPago){ //NINGUNO

            return 0;

        }

        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(flagEmpleado && !flagProntoPago && flagHermanos){ //EMPLEADO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(flagProntoPago && !flagEmpleado && !flagHermanos){ //PRONTO PAGO

            return 1;

        }

        if(!flagProntoPago && flagHermanos && !flagEmpleado){ //HERMANOS

            return 2;

        }

        if(flagProntoPago && !flagEmpleado && flagHermanos){ //PRONTO PAGO + HERMANOS

            return 3;

        }



        if(flagEmpleado && !flagProntoPago && !flagHermanos){ //EMPLEADO

            return 4;

        }

        if(flagEmpleado && flagProntoPago && !flagHermanos){ //EMPLEADO + PRONTO PAGO

            return 5;

        }

    }

}

export class peticionObtenerSelectedIndexDescuentoInscripcion{

    procesar(flagHermanos, flagEmpleado, flagProntoPago){


        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(flagEmpleado && !flagProntoPago && flagHermanos){ //EMPLEADO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(!flagEmpleado && flagProntoPago && flagHermanos){ //PRONTO PAGO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(!flagEmpleado && !flagHermanos && !flagProntoPago){ //NINGUNO

            return 0;

        }

        if(flagProntoPago && !flagEmpleado && !flagHermanos){ //PRONTO PAGO

            return 1;

        }

        if(!flagProntoPago && flagHermanos && !flagEmpleado){ //HERMANOS

            return 2;

        }


        if(flagEmpleado && !flagProntoPago && !flagHermanos){ //EMPLEADO

            return 3;

        }

        if(flagEmpleado && flagProntoPago && !flagHermanos){ //EMPLEADO + PRONTO PAGO

            return 4;

        }
     


    }

}

//DIRIGIR LOS DE PRECIO
//DIRIGIR LOS DE PRECIO
//DIRIGIR LOS DE PRECIO


class peticionPrecio{

    procesar(peticion){

        if(peticion.tipo2 == "mensualidad"){

            let peticionPrecioMensuali = new peticionPrecioMensualidad();
            return peticionPrecioMensuali.procesar(peticion);

        }
        
        if(peticion.tipo2 == "inscripcion"){

            let peticionPrecioInscripci = new peticionPrecioInscripcion();
            return peticionPrecioInscripci.procesar(peticion);

        }

        if(peticion.tipo2 == "tipoDescuento"){

            let peticionNombreDescuen = new peticionNombreDescuento();
            return peticionNombreDescuen.procesar(peticion);

        }

    }

}

//OBTENER NOMBRE DESCUENTO
//OBTENER NOMBRE DESCUENTO
//OBTENER NOMBRE DESCUENTO

class peticionNombreDescuento{

    procesar(peticion){

        let flagProntoPago = false;

        let flagHermanos = peticion.flagHermanos;

        let flagEmpleado = peticion.flagEmpleado;        

        if(peticion.tipo3 == "inscripcion"){

            if(verificarProntoPagoPorFecha(fechaDeHoyFormatoJS(), fechaMaximaDescuentoProntoPago)) flagProntoPago = true;            

        }
        else{

            flagProntoPago = determinarProntoPago(peticion.tipo3, annoEnCurso);

        }

        if(!flagEmpleado && !flagHermanos && !flagProntoPago){ //NINGUNO

            return "Ninguno";

        }

        if(flagProntoPago && !flagEmpleado && flagHermanos){ //PRONTO PAGO + HERMANOS

            return "Hermanos + Pronto Pago";

        }

        if(flagProntoPago && !flagEmpleado && !flagHermanos){ //PRONTO PAGO

            return "Pronto Pago";

        }

        if(!flagProntoPago && flagHermanos && !flagEmpleado){ //HERMANOS

        return "Hermanos";

        }

        if(flagEmpleado && !flagProntoPago && !flagHermanos){ //EMPLEADO

            return "Empleado";

        }

        if(flagEmpleado && flagProntoPago && !flagHermanos){ //EMPLEADO + PRONTO PAGO

            return "Empleado + Pronto Pago";

        }

    }

}


//OBTENER PRECIOS INSCRIPCION
//OBTENER PRECIOS INSCRIPCION
//OBTENER PRECIOS INSCRIPCION
//OBTENER PRECIOS INSCRIPCION


class peticionPrecioInscripcion{

    procesar(peticion){

        if(peticion.tipo3 == "preescolar"){

            if(peticion.hasOwnProperty("selectedIndex")){

                let peticionSelectedIndex = new peticionPrecioInscripcionPreescolarSelectedIndex();
                return peticionSelectedIndex.procesar(peticion);

            }

            let peticionPrecioInscripcionPreesco = new peticionPrecioInscripcionPreescolar();
            return peticionPrecioInscripcionPreesco.procesar(peticion);

        }

        if(peticion.tipo3 == "primaria"){

            if(peticion.hasOwnProperty("selectedIndex")){

                let peticionSelectedIndex = new peticionPrecioInscripcionPrimariaSelectedIndex();
                return peticionSelectedIndex.procesar(peticion);

            }

            let peticionPrecioInscripcionPrimari = new peticionPrecioInscripcionPrimaria();
            return peticionPrecioInscripcionPrimari.procesar(peticion);

        }

        if(peticion.tipo3 == "bachillerato"){

            if(peticion.hasOwnProperty("selectedIndex")){

                let peticionSelectedIndex = new peticionPrecioInscripcionBachilleratoSelectedIndex();
                return peticionSelectedIndex.procesar(peticion);

            }

            let peticionPrecioInscripcionBachillera = new peticionPrecioInscripcionBachillerato();
            return peticionPrecioInscripcionBachillera.procesar(peticion);


        }     

    }


}

class peticionPrecioInscripcionPreescolar{ //LISTO

    procesar(peticion){

        let flagProntoPago = false;

        if(verificarProntoPagoPorFecha(fechaDeHoyFormatoJS(), fechaMaximaDescuentoProntoPago)) flagProntoPago = true;

        let flagHermanos = peticion.flagHermanos;

        let flagEmpleado = peticion.flagEmpleado;

        let obtenerPrecio = new peticionPrecioInscripcionPreescolarFlags();

        return obtenerPrecio.procesar(flagHermanos, flagEmpleado, flagProntoPago);


    }

}

class peticionPrecioInscripcionPrimaria{ //LISTO

    procesar(peticion){

      let flagProntoPago = false;

      if(verificarProntoPagoPorFecha(fechaDeHoyFormatoJS(), fechaMaximaDescuentoProntoPago)) flagProntoPago = true;

      let flagHermanos = peticion.flagHermanos;

      let flagEmpleado = peticion.flagEmpleado;

      let obtenerPrecio = new peticionPrecioInscripcionPrimariaFlags();

      return obtenerPrecio.procesar(flagHermanos, flagEmpleado, flagProntoPago);


    }

}

class peticionPrecioInscripcionBachillerato{ //LISTO

    procesar(peticion){

      let flagProntoPago = false;

      let flagHermanos = peticion.flagHermanos;

      let flagEmpleado = peticion.flagEmpleado;

      if(verificarProntoPagoPorFecha(fechaDeHoyFormatoJS(), fechaMaximaDescuentoProntoPago)) flagProntoPago = true;

      let obtenerPrecio = new peticionPrecioInscripcionBachilleratoFlags();

      return obtenerPrecio.procesar(flagHermanos, flagEmpleado, flagProntoPago);

    }

}

//DIRIGIR A COSTOS DE MENSUALIDAD
//DIRIGIR A COSTOS DE MENSUALIDAD
//DIRIGIR A COSTOS DE MENSUALIDAD
//DIRIGIR A COSTOS DE MENSUALIDAD


class peticionPrecioMensualidad{

    procesar(peticion){

        if(peticion.tipo3 == "preescolar"){

            if(peticion.hasOwnProperty("selectedIndex")){

                let peticionSelectedIndexPreescola = new peticionPrecioMensualidadPreescolarSelectedIndex();
                return peticionSelectedIndexPreescola.procesar(peticion);

            }

            let peticionPrecioMensualidadPreescola = new peticionPrecioMensualidadPreescolar();
            return peticionPrecioMensualidadPreescola.procesar(peticion);

        }

        if(peticion.tipo3 == "primaria"){

            if(peticion.hasOwnProperty("selectedIndex")){

                let peticionSelectedIndexPrimari = new peticionPrecioMensualidadPrimariaSelectedIndex();
                return peticionSelectedIndexPrimari.procesar(peticion);                

            }

            let peticionPrecioMensualidadPrimari = new peticionPrecioMensualidadPrimaria();
            return peticionPrecioMensualidadPrimari.procesar(peticion);

        }

        if(peticion.tipo3 == "bachillerato"){

            if(peticion.hasOwnProperty("selectedIndex")){

                let peticionSelectedIndexBachillera = new peticionPrecioMensualidadBachilleratoSelectedIndex();
                return peticionSelectedIndexBachillera.procesar(peticion);

            }

            let peticionPrecioMensualidadBachillera = new peticionPrecioMensualidadBachillerato();
            return peticionPrecioMensualidadBachillera.procesar(peticion);


        }


    }

}

class peticionPrecioMensualidadBachillerato{ //LISTO

    procesar(peticion){

        let flagProntoPago = determinarProntoPago(peticion.tipo4, peticion.annoConsultado);

        let flagHermanos = peticion.flagHermanos;

        let flagEmpleado = peticion.flagEmpleado;

        let obtenerPrecio = new peticionPrecioMensualidadBachilleratoFlags();

        return obtenerPrecio.procesar(flagHermanos, flagEmpleado, flagProntoPago);


    }


}

class peticionPrecioMensualidadPrimaria{ // LISTO

    procesar(peticion){

        let flagProntoPago = determinarProntoPago(peticion.tipo4, peticion.annoConsultado);

        let flagHermanos = peticion.flagHermanos;

        let flagEmpleado = peticion.flagEmpleado;

        let obtenerPrecio = new peticionPrecioMensualidadPrimariaFlags();

        return obtenerPrecio.procesar(flagHermanos, flagEmpleado, flagProntoPago);

    }

}

class peticionPrecioMensualidadPreescolar{ //LISTO

    procesar(peticion){

        let flagProntoPago = determinarProntoPago(peticion.tipo4, peticion.annoConsultado);

        let flagHermanos = peticion.flagHermanos;

        let flagEmpleado = peticion.flagEmpleado;

        let obtenerPrecio = new peticionPrecioMensualidadPreescolarFlags();

        return obtenerPrecio.procesar(flagHermanos, flagEmpleado, flagProntoPago);

    }

}

//OBTENER COSTOS MENSUALIDAD POR FLAGS
//OBTENER COSTOS MENSUALIDAD POR FLAGS
//OBTENER COSTOS MENSUALIDAD POR FLAGS

export class peticionPrecioMensualidadBachilleratoFlags{ //LISTO

    procesar(flagHermanos, flagEmpleado, flagProntoPago){

        let resultado;

        let precioBasicoDecimal;
        let sustraendoDecimal;

        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(flagEmpleado && !flagProntoPago && flagHermanos){ //EMPLEADO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(flagHermanos && !flagEmpleado && !flagProntoPago){ // HERMANO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadBachillerato);
            sustraendoDecimal = numberAformatoMontos(descuentoHermanos);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }


        if(!flagHermanos && !flagEmpleado && flagProntoPago){ // PRONTO PAGO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadBachillerato);
            sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoMensualidad);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        if(flagHermanos && !flagEmpleado && flagProntoPago){ //PRONTO PAGO + HERMANO

            resultado = mensualidadBachilleratoProntoPagoHermanos;
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        if(!flagHermanos && flagEmpleado && !flagProntoPago){ // EMPLEADO

            resultado = productoPrecision2(precioMensualidadBachillerato, descuentoEmpleado);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        if(!flagHermanos && flagEmpleado && flagProntoPago){ // EMPLEADO + PRONTO PAGO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadBachillerato);
            sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoMensualidad);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = productoPrecision2(resultado, descuentoEmpleado);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        return numberAformatoMontos(precioMensualidadBachillerato);


    }


}

export class peticionPrecioMensualidadPrimariaFlags{ //LISTO

    procesar(flagHermanos, flagEmpleado, flagProntoPago){

        let resultado;

        let precioBasicoDecimal;
        let sustraendoDecimal;

        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(flagEmpleado && !flagProntoPago && flagHermanos){ //EMPLEADO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(flagHermanos && !flagEmpleado && !flagProntoPago){ // HERMANO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadPrimaria);
            sustraendoDecimal = numberAformatoMontos(descuentoHermanos);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }


        if(!flagHermanos && !flagEmpleado && flagProntoPago){ // PRONTO PAGO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadPrimaria);
            sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoMensualidad);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        if(flagHermanos && !flagEmpleado && flagProntoPago){ //PRONTO PAGO + HERMANO

            resultado = mensualidadPrimariaProntoPagoHermanos;
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        if(!flagHermanos && flagEmpleado && !flagProntoPago){ // EMPLEADO

            resultado = productoPrecision2(precioMensualidadPrimaria, descuentoEmpleado);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(!flagHermanos && flagEmpleado && flagProntoPago){ // EMPLEADO + PRONTO PAGO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadPrimaria);
            sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoMensualidad);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = productoPrecision2(resultado, descuentoEmpleado);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        return numberAformatoMontos(precioMensualidadPrimaria);

    }

}

export class peticionPrecioMensualidadPreescolarFlags{ //LISTO

    procesar(flagHermanos, flagEmpleado, flagProntoPago){

        let resultado;

        let precioBasicoDecimal;
        let sustraendoDecimal;

        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(flagEmpleado && !flagProntoPago && flagHermanos){ //EMPLEADO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(flagHermanos && !flagEmpleado && !flagProntoPago){ // HERMANO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadPreescolar);
            sustraendoDecimal = numberAformatoMontos(descuentoHermanos);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }


        if(!flagHermanos && !flagEmpleado && flagProntoPago){ // PRONTO PAGO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadPreescolar);
            sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoMensualidad);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        if(flagHermanos && !flagEmpleado && flagProntoPago){ //PRONTO PAGO + HERMANO

            resultado = mensualidadPreescolarProntoPagoHermanos;
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        if(!flagHermanos && flagEmpleado && !flagProntoPago){ // EMPLEADO

            resultado = productoPrecision2(precioMensualidadPreescolar, descuentoEmpleado);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

      if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

        flagHermanos = false;

        //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

      }



        if(!flagHermanos && flagEmpleado && flagProntoPago){ // EMPLEADO + PRONTO PAGO

            precioBasicoDecimal = numberAformatoMontos(precioMensualidadPreescolar);
            sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoMensualidad);

            resultado = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            resultado = productoPrecision2(resultado, descuentoEmpleado);
            resultado = numberAformatoMontos(resultado);
            return resultado;

        }

        return numberAformatoMontos(precioMensualidadPreescolar);

    }

}

//OBTENER COSTOS DE INSCRIPCION POR FLAGS
//OBTENER COSTOS DE INSCRIPCION POR FLAGS
//OBTENER COSTOS DE INSCRIPCION POR FLAGS

export class peticionPrecioInscripcionPreescolarFlags{

    procesar(flagHermanos, flagEmpleado, flagProntoPago){

      let monto;

      let sustraendoDecimal;

      let precioBasicoDecimal;
      
        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(flagEmpleado && !flagProntoPago && flagHermanos){ //EMPLEADO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(!flagEmpleado && flagProntoPago && flagHermanos){ //PRONTO PAGO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }


      if(!flagEmpleado && !flagHermanos && !flagProntoPago){ //NINGUNO

            return numberAformatoMontos(precioInscripcionPreescolar);

      }

      if(flagProntoPago && !flagEmpleado && !flagHermanos){ //PRONTO PAGO

            precioBasicoDecimal = numberAformatoMontos(precioInscripcionPreescolar);
            sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoInscripcion);

            monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);

            return numberAformatoMontos(monto);

      }

      if(!flagProntoPago && flagHermanos && !flagEmpleado){ //HERMANOS

            precioBasicoDecimal = numberAformatoMontos(precioInscripcionPreescolar);
            sustraendoDecimal = numberAformatoMontos(descuentoHermanos);

            monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            return numberAformatoMontos(monto);

      }
  
      if(flagEmpleado && !flagProntoPago && !flagHermanos){ //EMPLEADO

            monto = precioInscripcionPreescolar;
            monto = productoPrecision2(monto, descuentoEmpleado);
            return numberAformatoMontos(monto);

      }

      if(flagEmpleado && flagProntoPago && !flagHermanos){ //EMPLEADO + PRONTO PAGO

            precioBasicoDecimal = numberAformatoMontos(precioInscripcionPreescolar);
            sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoInscripcion);

            monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
            monto = productoPrecision2(monto, descuentoEmpleado);
            return numberAformatoMontos(monto);

      }


    }

}

export class peticionPrecioInscripcionPrimariaFlags{

    procesar(flagHermanos, flagEmpleado, flagProntoPago){

      let monto;

      let sustraendoDecimal;

      let precioBasicoDecimal;

        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(flagEmpleado && !flagProntoPago && flagHermanos){ //EMPLEADO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(!flagEmpleado && flagProntoPago && flagHermanos){ //PRONTO PAGO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

      if(!flagEmpleado && !flagHermanos && !flagProntoPago){ //NINGUNO

        return numberAformatoMontos(precioInscripcionPrimaria);

      }

      if(flagProntoPago && !flagEmpleado && flagHermanos){ //PRONTO PAGO + HERMANOS

        flagHermanos = false;

      }

      if(flagProntoPago && !flagEmpleado && !flagHermanos){ //PRONTO PAGO

        precioBasicoDecimal = numberAformatoMontos(precioInscripcionPrimaria);
        sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoInscripcion);

        monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);

        return numberAformatoMontos(monto);

      }

      if(!flagProntoPago && flagHermanos && !flagEmpleado){ //HERMANOS

        precioBasicoDecimal = numberAformatoMontos(precioInscripcionPrimaria);
        sustraendoDecimal = numberAformatoMontos(descuentoHermanos);

        monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
        return numberAformatoMontos(monto);

      }
  
      if(flagEmpleado && !flagProntoPago && !flagHermanos){ //EMPLEADO

        monto = precioInscripcionPrimaria;
        monto = productoPrecision2(monto, descuentoEmpleado);
        return numberAformatoMontos(monto);

      }


      if(flagEmpleado && flagProntoPago && !flagHermanos){ //EMPLEADO + PRONTO PAGO

        precioBasicoDecimal = numberAformatoMontos(precioInscripcionPrimaria);
        sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoInscripcion);

        monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
        monto = productoPrecision2(monto, descuentoEmpleado);
        return numberAformatoMontos(monto);

      }


    }

}

export class peticionPrecioInscripcionBachilleratoFlags{

    procesar(flagHermanos, flagEmpleado, flagProntoPago){

      let monto;

      let sustraendoDecimal;

      let precioBasicoDecimal;
      
        if(flagEmpleado && flagProntoPago && flagHermanos){ //TODOS LOS FLAGS

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 3 FLAGS

        }

        if(flagEmpleado && !flagProntoPago && flagHermanos){ //EMPLEADO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }

        if(!flagEmpleado && flagProntoPago && flagHermanos){ //PRONTO PAGO + HERMANO

            flagHermanos = false;

            //MECANISMO DISEÑADO EN CASO DE QUE SE ACTIVASEN LOS 2 FLAGS

        }


      if(!flagEmpleado && !flagHermanos && !flagProntoPago){ //NINGUNO

        return numberAformatoMontos(precioInscripcionBachillerato);

      }

      if(flagProntoPago && !flagEmpleado && flagHermanos){ //PRONTO PAGO + HERMANOS

        flagHermanos = false;

      }

      if(flagProntoPago && !flagEmpleado && !flagHermanos){ //PRONTO PAGO

        precioBasicoDecimal = numberAformatoMontos(precioInscripcionBachillerato);
        sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoInscripcion);

        monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);

        return numberAformatoMontos(monto);

      }

      if(!flagProntoPago && flagHermanos && !flagEmpleado){ //HERMANOS

        precioBasicoDecimal = numberAformatoMontos(precioInscripcionBachillerato);
        sustraendoDecimal = numberAformatoMontos(descuentoHermanos);

        monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
        return numberAformatoMontos(monto);

      }
  
      if(flagEmpleado && !flagProntoPago && !flagHermanos){ //EMPLEADO

        monto = precioInscripcionBachillerato;
        monto = productoPrecision2(monto, descuentoEmpleado);
        return numberAformatoMontos(monto);

      }

      if(flagEmpleado && flagProntoPago && !flagHermanos){ //EMPLEADO + PRONTO PAGO

        precioBasicoDecimal = numberAformatoMontos(precioInscripcionBachillerato);
        sustraendoDecimal = numberAformatoMontos(descuentoProntoPagoInscripcion);

        monto = restaDecimal(precioBasicoDecimal, sustraendoDecimal);
        monto = productoPrecision2(monto, descuentoEmpleado);
        return numberAformatoMontos(monto);

      }


    }

}


//OBTENER COSTOS DE MENSUALIDAD SELECTED INDEX
//OBTENER COSTOS DE MENSUALIDAD SELECTED INDEX
//OBTENER COSTOS DE MENSUALIDAD SELECTED INDEX

class peticionPrecioMensualidadBachilleratoSelectedIndex{

    procesar(peticion){

        let obtenerPrecio = new peticionPrecioMensualidadBachilleratoFlags();

        if(peticion.selectedIndex == 0){ //NINGUNO

            return obtenerPrecio.procesar(false, false, false);

        }

        if(peticion.selectedIndex == 1){ //PRONTO PAGO

            return obtenerPrecio.procesar(false, false, true);

        }

        if(peticion.selectedIndex == 2){ //HERMANOS

            return obtenerPrecio.procesar(true, false, false);

        }

        if(peticion.selectedIndex == 3){ //HERMANOS + PRONTO PAGO

            return obtenerPrecio.procesar(true, false, true);

        }


        if(peticion.selectedIndex == 4){ //EMPLEADO

            return obtenerPrecio.procesar(false, true, false);

        }

        if(peticion.selectedIndex == 5){ // EMPLEADO + PRONTO PAGO

            return obtenerPrecio.procesar(false, true, true);

        }


    }

}

class peticionPrecioMensualidadPrimariaSelectedIndex{

    procesar(peticion){

        let obtenerPrecio = new peticionPrecioMensualidadPrimariaFlags();

        if(peticion.selectedIndex == 0){ //NINGUNO

            return obtenerPrecio.procesar(false, false, false);

        }

        if(peticion.selectedIndex == 1){ //PRONTO PAGO

            return obtenerPrecio.procesar(false, false, true);

        }

        if(peticion.selectedIndex == 2){ //HERMANOS

            return obtenerPrecio.procesar(true, false, false);

        }

        if(peticion.selectedIndex == 3){ //HERMANOS + PRONTO PAGO

            return obtenerPrecio.procesar(true, false, true);

        }


        if(peticion.selectedIndex == 4){ //EMPLEADO

            return obtenerPrecio.procesar(false, true, false);

        }

        if(peticion.selectedIndex == 5){ // EMPLEADO + PRONTO PAGO

            return obtenerPrecio.procesar(false, true, true);

        }

    }

}

class peticionPrecioMensualidadPreescolarSelectedIndex{

    procesar(peticion){

        let obtenerPrecio = new peticionPrecioMensualidadPreescolarFlags();

        if(peticion.selectedIndex == 0){ //NINGUNO

            return obtenerPrecio.procesar(false, false, false);

        }

        if(peticion.selectedIndex == 1){ //PRONTO PAGO

            return obtenerPrecio.procesar(false, false, true);

        }

        if(peticion.selectedIndex == 2){ //HERMANOS

            return obtenerPrecio.procesar(true, false, false);

        }

        if(peticion.selectedIndex == 3){ //HERMANOS + PRONTO PAGO

            return obtenerPrecio.procesar(true, false, true);

        }


        if(peticion.selectedIndex == 4){ //EMPLEADO

            return obtenerPrecio.procesar(false, true, false);

        }

        if(peticion.selectedIndex == 5){ // EMPLEADO + PRONTO PAGO

            return obtenerPrecio.procesar(false, true, true);

        }

    }

}

//OBTENER COSTOS DE INSCRIPCION SELECT INDEX
//OBTENER COSTOS DE INSCRIPCION SELECT INDEX
//OBTENER COSTOS DE INSCRIPCION SELECT INDEX

class peticionPrecioInscripcionBachilleratoSelectedIndex{

    procesar(peticion){

        let obtenerPrecio = new peticionPrecioInscripcionBachilleratoFlags();

        if(peticion.selectedIndex == 0){ //NINGUNO

            return obtenerPrecio.procesar(false, false, false);

        }

        if(peticion.selectedIndex == 1){ //PRONTO PAGO

            return obtenerPrecio.procesar(false, false, true);

        }

        if(peticion.selectedIndex == 2){ //HERMANOS

            return obtenerPrecio.procesar(true, false, false);

        }


        if(peticion.selectedIndex == 3){ //EMPLEADO

            return obtenerPrecio.procesar(false, true, false);

        }

        if(peticion.selectedIndex == 4){ // EMPLEADO + PRONTO PAGO

            return obtenerPrecio.procesar(false, true, true);

        }


    }

}

class peticionPrecioInscripcionPrimariaSelectedIndex{

    procesar(peticion){

        let obtenerPrecio = new peticionPrecioInscripcionPrimariaFlags();

        if(peticion.selectedIndex == 0){ //NINGUNO

            return obtenerPrecio.procesar(false, false, false);

        }

        if(peticion.selectedIndex == 1){ //PRONTO PAGO

            return obtenerPrecio.procesar(false, false, true);

        }

        if(peticion.selectedIndex == 2){ //HERMANOS

            return obtenerPrecio.procesar(true, false, false);

        }


        if(peticion.selectedIndex == 3){ //EMPLEADO

            return obtenerPrecio.procesar(false, true, false);

        }

        if(peticion.selectedIndex == 4){ // EMPLEADO + PRONTO PAGO

            return obtenerPrecio.procesar(false, true, true);

        }

    }

}

class peticionPrecioInscripcionPreescolarSelectedIndex{

    procesar(peticion){

        let obtenerPrecio = new peticionPrecioInscripcionPreescolarFlags();

        if(peticion.selectedIndex == 0){ //NINGUNO

            return obtenerPrecio.procesar(false, false, false);

        }

        if(peticion.selectedIndex == 1){ //PRONTO PAGO

            return obtenerPrecio.procesar(false, false, true);

        }

        if(peticion.selectedIndex == 2){ //HERMANOS

            return obtenerPrecio.procesar(true, false, false);

        }


        if(peticion.selectedIndex == 3){ //EMPLEADO

            return obtenerPrecio.procesar(false, true, false);

        }

        if(peticion.selectedIndex == 4){ // EMPLEADO + PRONTO PAGO

            return obtenerPrecio.procesar(false, true, true);

        }

    }

}