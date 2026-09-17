/*global document, console, TextEncoder */

import { getDoc, doc, Base, updateDoc, setDoc } from "./firebase.js";
import { mostrarPantallaCarga, ocultarPantallaCarga, mostrarPantallaError, mostrarPantallaExito } from "./modal.js";
import { fechaDeHoy, formatoMontosAnumber, numberAformatoMontos } from "./utilidades.js";
import { armarReporteCambioAnual, armarReporteCambiosConfiguracion, asignarObjetoAnteriorConfiguracion, copiasValoresIdenticasConfiguracion, mostrarGestionDeCostos, obtenerCopiaValoresInterfazConfiguracion } from "./controlesGestionCostos.js";
export {gestionCostos, actualizarCostos};

let copiaValoresInterfaz;

const err = -10;

async function gestionCostos(){
    try {
      mostrarPantallaCarga();

      //CONSULTAR LA BASE DE DATOS

      let ObtenerPrecioMensualidades = await getDoc(doc(Base, "constantes", "precioMensualidad"));
      let ObtenerPrecioAdministrativo = await getDoc(doc(Base, "constantes", "precioAdministrativo"));
      let ObtenerPrecioInscripcion = await getDoc(doc(Base, "constantes", "PrecioInscripcion"));
      let ObtenerPrecioPreinscripcion = await getDoc(doc(Base, "constantes", "precioPreinscripcion"));

      //OBTENER DATOS DE DESCUENTOS

      let descuentoHermanos = ObtenerPrecioMensualidades.data().DescuentoHermanos;
      let descuentoEmpleado = ObtenerPrecioMensualidades.data().DescuentoEmpleado;

      //OBTENER DATOS DE PRECIO DE MENSUALIDAD

      let precioMensualidadPreescolar = ObtenerPrecioMensualidades.data().Preescolar;
      let precioMensualidadPrimaria = ObtenerPrecioMensualidades.data().Primaria;
      let precioMensualidadBachillerato = ObtenerPrecioMensualidades.data().Bachillerato;
      let descuentoProntoPagoMensualidad = ObtenerPrecioMensualidades.data().DescuentoProntoPago;

      let precioPreescolarHermanoProntoPago = ObtenerPrecioMensualidades.data().preescolarHermanoProntoPago;
      let precioPrimariaHermanoProntoPago = ObtenerPrecioMensualidades.data().primariaHermanoProntoPago;
      let precioBachilleratoHermanoProntoPago = ObtenerPrecioMensualidades.data().bachilleratoHermanoProntoPago;

      //OBTENER DATOS DE PRECIO INSCRIPCION

      let precioInscripcionPreescolar = ObtenerPrecioInscripcion.data().inscripcionPreescolar;
      let precioInscripcionPrimaria = ObtenerPrecioInscripcion.data().inscripcionPrimaria;
      let PrecioInscripcionBachillerato = ObtenerPrecioInscripcion.data().inscripcionBachillerato;
      let descuentoProntoPagoInscripcion = ObtenerPrecioInscripcion.data().DescuentoProntoPago;

      let fechaMaximaDescuentoProntoPagoInscripcion = ObtenerPrecioInscripcion.data().fechaMaximaProntoPago;

      //OBTENER DATOS DE PRECIO PREINSCRIPCION

      let precioPreinscripcionPreescolar = ObtenerPrecioPreinscripcion.data().preescolar;
      let precioPreinscripcionPrimaria = ObtenerPrecioPreinscripcion.data().primaria;
      let PrecioPreinscripcionBachillerato = ObtenerPrecioPreinscripcion.data().bachillerato;

      //OBTENER DATOS DE PRECIOS ADMINISTRATIVOS

      let precioRetiroPapeles = ObtenerPrecioAdministrativo.data().retiroPapeles;
      let precioRetiroTitulo = ObtenerPrecioAdministrativo.data().retiroTitulo;
      let precioCertificacionFondoNegro = ObtenerPrecioAdministrativo.data().certificacionFondoNegro;
      let precioNotasCertificadas = ObtenerPrecioAdministrativo.data().notasCertificadas;

      //OBTENER DATOS DE VARIABLES GENERALES

      let precioDolar = ObtenerPrecioMensualidades.data().dolar;
      let verificacionZelle = ObtenerPrecioMensualidades.data().requerirVerificarZelle;
      let verificacionTransf = ObtenerPrecioMensualidades.data().requerirVerificarTransferencia;
      let verificacionDolares = ObtenerPrecioMensualidades.data().requerirVerificarDolares;
      let annoEscolar = ObtenerPrecioInscripcion.data().AnnoEscolarEnCurso;


      
      //MENSUALIDADES
      
      document.getElementById("CostoMensualidadPreescolar").value = numberAformatoMontos(precioMensualidadPreescolar);
      document.getElementById("CostoMensualidadPrimaria").value = numberAformatoMontos(precioMensualidadPrimaria);
      document.getElementById("CostoMensualidadBachillerato").value = numberAformatoMontos(precioMensualidadBachillerato);
      document.getElementById("descuentoProntoPagoMensualidad").value = numberAformatoMontos(descuentoProntoPagoMensualidad);
      document.getElementById("mensualidadPreescolarHermanosProntoPago").value = numberAformatoMontos(precioPreescolarHermanoProntoPago);
      document.getElementById("mensualidadPrimariaHermanosProntoPago").value = numberAformatoMontos(precioPrimariaHermanoProntoPago);
      document.getElementById("mensualidadBachilleratoHermanosProntoPago").value = numberAformatoMontos(precioBachilleratoHermanoProntoPago);


      //DESCUENTOS

      document.getElementById("DescuentoHermanos").value = numberAformatoMontos(descuentoHermanos);
      document.getElementById("DescuentoEmpleado").value = numberAformatoMontos(descuentoEmpleado);
      
      //PREINSCRION

      document.getElementById("CostoPreinscripcionPreescolar").value = numberAformatoMontos(precioPreinscripcionPreescolar);
      document.getElementById("CostoPreinscripcionPrimaria").value = numberAformatoMontos(precioPreinscripcionPrimaria);
      document.getElementById("CostoPreinscripcionBachillerato").value = numberAformatoMontos(PrecioPreinscripcionBachillerato);

      //INSCRIPCION
      
      document.getElementById("CostoInscripcionPreescolar").value = numberAformatoMontos(precioInscripcionPreescolar);
      document.getElementById("CostoInscripcionPrimaria").value = numberAformatoMontos(precioInscripcionPrimaria);
      document.getElementById("CostoInscripcionBachillerato").value = numberAformatoMontos(PrecioInscripcionBachillerato);
      document.getElementById("descuentoProntoPagoInscripcion").value = numberAformatoMontos(descuentoProntoPagoInscripcion);
      document.getElementById("fechaMaximaProntoPagoInscripcion").value = fechaMaximaDescuentoProntoPagoInscripcion;

      //COSTOS ADMINISTRATIVOS
      

      document.getElementById("CostoRetiroPapeles").value = numberAformatoMontos(precioRetiroPapeles);
      document.getElementById("CostoRetiroTitulo").value = numberAformatoMontos(precioRetiroTitulo);
      document.getElementById("CostoCertificacionFondoNegro").value = numberAformatoMontos(precioCertificacionFondoNegro);
      document.getElementById("CostoNotasCertificadas").value = numberAformatoMontos(precioNotasCertificadas);

      //DOLAR
      
      document.getElementById("CostoDolar").value = numberAformatoMontos(precioDolar);

      //VERIFICADORES

      if(!verificacionZelle) document.getElementById("requerirVerificacionZelle").checked = false;
      else document.getElementById("requerirVerificacionZelle").checked = true;
      if(!verificacionTransf) document.getElementById("requerirVerificacionTransferencia").checked  = false;
      else document.getElementById("requerirVerificacionTransferencia").checked = true;
      if(!verificacionDolares) document.getElementById("requerirVerificacionDolares").checked = false;
      else document.getElementById("requerirVerificacionDolares").checked = true;

      // AÑO ESCOLAR

      document.getElementById("annoEscolarEnCurso").value = annoEscolar;

      copiaValoresInterfaz = obtenerCopiaValoresInterfazConfiguracion();

      asignarObjetoAnteriorConfiguracion(copiaValoresInterfaz);

      mostrarGestionDeCostos();
      ocultarPantallaCarga();
    } catch (error) {
      console.log("ERROR AL OBTENER COSTOS: ", error);
      ocultarPantallaCarga();
      mostrarPantallaError("Error Inesperado");
    }
  }

  async function actualizarCostos(){

    let nuevaCopiaValoresInterfaz = obtenerCopiaValoresInterfazConfiguracion();

    if(copiasValoresIdenticasConfiguracion(nuevaCopiaValoresInterfaz, copiaValoresInterfaz)){

      mostrarPantallaError("No se realizaron cambios");
      return;

    }


    try {
      mostrarPantallaCarga();
      if(document.getElementById("annoEscolarEnCurso").value == ""){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el año escolar en curso");
        return 0;  
      }
      if(document.getElementById("CostoMensualidadPreescolar").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la mensualidad de preescolar");
        return 0;
      }
      if(document.getElementById("CostoMensualidadPrimaria").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la mensualidad de primaria");
        return 0;
      }
      if(document.getElementById("CostoMensualidadBachillerato").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la mensualidad de bachillerato");
        return 0;
      }
      if(document.getElementById("CostoDolar").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el costo del dolar en Bs");
        return 0;
      }
      if(document.getElementById("DescuentoEmpleado").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el porcentaje de descuento por empleado");
        return 0;
      }
            if(document.getElementById("CostoPreinscripcionPreescolar").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la inscripción de preescolar");
        return 0;
      }
      if(document.getElementById("CostoPreinscripcionPrimaria").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la inscripción de primaria");
        return 0;
      }
      if(document.getElementById("CostoPreinscripcionBachillerato").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la inscripción de bachillerato");
        return 0;
      }
      if(document.getElementById("CostoInscripcionPreescolar").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la inscripción de preescolar");
        return 0;
      }
      if(document.getElementById("CostoInscripcionPrimaria").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la inscripción de primaria");
        return 0;
      }
      if(document.getElementById("CostoInscripcionBachillerato").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la inscripción de bachillerato");
        return 0;
      }
      if(document.getElementById("CostoRetiroPapeles").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto del retiro de papeles");
        return 0;
      }
      if(document.getElementById("CostoRetiroTitulo").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto del retiro de título");
        return 0;
      }
      if(document.getElementById("CostoCertificacionFondoNegro").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de la certificación de fondo negro");
        return 0;
      }
      if(document.getElementById("CostoNotasCertificadas").value == "0,00"){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el monto de las notas certificadas");
        return 0;
      }

      //CONEXION A LA BASE DE DATOS

      let PrecioMensualidades = await doc(Base, "constantes", "precioMensualidad");
      let PrecioPreinscripcion = await doc(Base, "constantes", "precioPreinscripcion");
      let PrecioInscripcion = await doc(Base, "constantes", "PrecioInscripcion");
      let PrecioAdministrativo = await doc(Base, "constantes", "precioAdministrativo");

      //INPUT PRECIOS DE MENSUALIDAD

      let inputMensualidadBachillerato = document.getElementById("CostoMensualidadBachillerato").value;
      let inputMensualidadPrimaria = document.getElementById("CostoMensualidadPrimaria").value;
      let inputMensualidadPreescolar = document.getElementById("CostoMensualidadPreescolar").value;

      let inputProntoPagoMensualidad = document.getElementById("descuentoProntoPagoMensualidad").value;

      let inputMensualidadPreescolarHermanoProntoPago = document.getElementById("mensualidadPreescolarHermanosProntoPago").value;
      let inputMensualidadPrimariaHermanoProntoPago = document.getElementById("mensualidadPrimariaHermanosProntoPago").value;
      let inputMensualidadBachilleratoHermanoProntoPago = document.getElementById("mensualidadBachilleratoHermanosProntoPago").value;

      //INPUT PRECIOS PREINSCRIPCION

      let inputPreinscripcionPrimaria = document.getElementById("CostoPreinscripcionPrimaria").value;
      let inputPreinscripcionPreescolar = document.getElementById("CostoPreinscripcionPreescolar").value;
      let inputPreinscripcionBachillerato = document.getElementById("CostoPreinscripcionBachillerato").value;

      //INPUTS PRECIOS INSCRIPCION

      let inputInscripcionPrimaria = document.getElementById("CostoInscripcionPrimaria").value;
      let inputInscripcionPreescolar = document.getElementById("CostoInscripcionPreescolar").value;
      let inputInscripcionBachillerato = document.getElementById("CostoInscripcionBachillerato").value;
      let inputProntoPagoInscripcion = document.getElementById("descuentoProntoPagoInscripcion").value;
      let fechaMaximaDescuentoProntoPagoInscripcion = document.getElementById("fechaMaximaProntoPagoInscripcion").value;

      //INPUT DESCUENTOS

      let inputDescuentoHermanos = document.getElementById("DescuentoHermanos").value;
      let inputDescuentoRepresentante = document.getElementById("DescuentoEmpleado").value;

      //INPUT PRECIOS ADMINISTRATIVOS

      let inputRetiroPapeles = document.getElementById("CostoRetiroPapeles").value;
      let inputRetiroTitulo = document.getElementById("CostoRetiroTitulo").value;
      let inputRetiroFondoNegro = document.getElementById("CostoCertificacionFondoNegro").value;
      let inputNotasCertificadas = document.getElementById("CostoNotasCertificadas").value;

      //INPUT VARIABLES

      let verificarZelle = document.getElementById("requerirVerificacionZelle").checked;
      let verificarTransf = document.getElementById("requerirVerificacionTransferencia").checked;
      let verificarDolares = document.getElementById("requerirVerificacionDolares").checked;
      let annoEscolar = document.getElementById("annoEscolarEnCurso").value;
      let inputDolar = document.getElementById("CostoDolar").value;

      //SE PROCEDE A PROCESAR LOS DATOS A ACTUALIZAR
      //DENTRO DE LA BASE DE DATOS


      //MENSUALIDADES

      inputMensualidadBachillerato = formatoMontosAnumber(inputMensualidadBachillerato);
      inputMensualidadPrimaria = formatoMontosAnumber(inputMensualidadPrimaria);
      inputMensualidadPreescolar = formatoMontosAnumber(inputMensualidadPreescolar);
      inputMensualidadPreescolarHermanoProntoPago = formatoMontosAnumber(inputMensualidadPreescolarHermanoProntoPago);
      inputMensualidadPrimariaHermanoProntoPago = formatoMontosAnumber(inputMensualidadPrimariaHermanoProntoPago);
      inputMensualidadBachilleratoHermanoProntoPago = formatoMontosAnumber(inputMensualidadBachilleratoHermanoProntoPago);


      //DESCUENTOS

      inputDescuentoHermanos = formatoMontosAnumber(inputDescuentoHermanos);

      inputProntoPagoInscripcion = formatoMontosAnumber(inputProntoPagoInscripcion);
      inputProntoPagoMensualidad = formatoMontosAnumber(inputProntoPagoMensualidad);

      inputDescuentoRepresentante = formatoMontosAnumber(inputDescuentoRepresentante);

      //PREIINSCRIPCION

      inputPreinscripcionBachillerato = formatoMontosAnumber(inputPreinscripcionBachillerato);
      inputPreinscripcionPrimaria = formatoMontosAnumber(inputPreinscripcionPrimaria);
      inputPreinscripcionPreescolar = formatoMontosAnumber(inputPreinscripcionPreescolar);

      //INSCRIPCION

      inputInscripcionBachillerato = formatoMontosAnumber(inputInscripcionBachillerato);
      inputInscripcionPrimaria = formatoMontosAnumber(inputInscripcionPrimaria);
      inputInscripcionPreescolar = formatoMontosAnumber(inputInscripcionPreescolar);

      //ADMINISTRATIVO

      inputRetiroPapeles = formatoMontosAnumber(inputRetiroPapeles);
      inputRetiroTitulo = formatoMontosAnumber(inputRetiroTitulo);
      inputRetiroFondoNegro = formatoMontosAnumber(inputRetiroFondoNegro);
      inputNotasCertificadas = formatoMontosAnumber(inputNotasCertificadas);

      //DOLAR

      inputDolar = formatoMontosAnumber(inputDolar);

      //VALIDACION DE PORCENTAJE DE DESCUENTO DE EMPLEADO

      if(inputDescuentoRepresentante > 100) {
        ocultarPantallaCarga();
        mostrarPantallaError("El porcentaje de descuento por empleado no puede ser mayor de 100");
        return 0;
      }

      await updateDoc(PrecioMensualidades, {Preescolar: inputMensualidadPreescolar,
                                            Primaria: inputMensualidadPrimaria,
                                            Bachillerato: inputMensualidadBachillerato,
                                            preescolarHermanoProntoPago: inputMensualidadPreescolarHermanoProntoPago,
                                            primariaHermanoProntoPago: inputMensualidadPrimariaHermanoProntoPago,
                                            bachilleratoHermanoProntoPago: inputMensualidadBachilleratoHermanoProntoPago,
                                            DescuentoProntoPago: inputProntoPagoMensualidad,
                                            DescuentoHermanos: inputDescuentoHermanos,
                                            DescuentoEmpleado: inputDescuentoRepresentante,
                                            requerirVerificarZelle: verificarZelle,
                                            requerirVerificarTransferencia: verificarTransf,
                                            requerirVerificarDolares: verificarDolares,
                                            AnnoEscolarEnCurso: annoEscolar,
                                            dolar: inputDolar
      });
      await updateDoc(PrecioInscripcion, {inscripcionPreescolar: inputInscripcionPreescolar,
                                          inscripcionPrimaria: inputInscripcionPrimaria,
                                          inscripcionBachillerato: inputInscripcionBachillerato,
                                          DescuentoProntoPago: inputProntoPagoInscripcion,
                                          DescuentoHermanos: inputDescuentoHermanos,
                                          DescuentoEmpleado: inputDescuentoRepresentante,
                                          requerirVerificarZelle: verificarZelle,
                                          requerirVerificarTransferencia: verificarTransf,
                                          requerirVerificarDolares: verificarDolares,
                                          AnnoEscolarEnCurso: annoEscolar,
                                          fechaMaximaProntoPago: fechaMaximaDescuentoProntoPagoInscripcion,
                                          dolar: inputDolar
      });
      await updateDoc(PrecioAdministrativo, {retiroPapeles: inputRetiroPapeles,
                                             retiroTitulo: inputRetiroTitulo,
                                             certificacionFondoNegro: inputRetiroFondoNegro,
                                             notasCertificadas: inputNotasCertificadas,
                                             requerirVerificarZelle: verificarZelle,
                                             requerirVerificarTransferencia: verificarTransf,
                                             requerirVerificarDolares: verificarDolares,
                                             dolar: inputDolar
      });
      await updateDoc(PrecioPreinscripcion, {preescolar: inputPreinscripcionPreescolar,
                                             primaria: inputPreinscripcionPrimaria,
                                             bachillerato: inputPreinscripcionBachillerato,
                                             requerirVerificarZelle: verificarZelle,
                                             requerirVerificarTransferencia: verificarTransf,
                                             requerirVerificarDolares: verificarDolares,
                                             AnnoEscolarEnCurso: annoEscolar,
                                             dolar: inputDolar
      });

      let reporte = armarReporteCambiosConfiguracion();

      let IdReporte;

      let obtenerNumeroDeReporte = await doc(Base, "variables", "numeroReportesVariables");

    try { //SE OBTIENE EL NUMERO DE REPORTE
        
        let numeroDeReporte = await getDoc(obtenerNumeroDeReporte);
        let IdReporteObtener = numeroDeReporte.data();

        IdReporte = IdReporteObtener.numero + 1;

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return "ERROR";
    }

      reporte["numeroReporte"] = IdReporte;

      await setDoc(doc(Base, "reportesVariablesDiarias/" + reporte.numeroReporte), reporte);
      await updateDoc(obtenerNumeroDeReporte, {numero: reporte.numeroReporte});

    let procesarCambios = await procesarCambiosPrecios();

    if(procesarCambios == err) return;

    ocultarPantallaCarga();
    mostrarPantallaExito("Costos Actualizados!");

    await gestionCostos();

    } catch (error) {
      console.log("ERROR AL ACTUALIZAR COSTOS: ", error);
      ocultarPantallaCarga();
      mostrarPantallaError("Error Inesperado");
    }
  }

  async function procesarCambiosPrecios(){

    try {
      
    let fecha = fechaDeHoy();

    let fechaHoyCompleta = fecha;

    fecha = fecha.split("/");

    let anno = fecha[2];

    // SE BUSCA EL REPORTE POR PRIMERA VEZ
    // SE BUSCA EL REPORTE POR PRIMERA VEZ
    // SE BUSCA EL REPORTE POR PRIMERA VEZ

    let documentoReporte = await doc(Base, "reportesVariablesAnuales", anno);

    let obtenerReportesAnno = await getDoc(documentoReporte);

    let datosObtenidos;

    datosObtenidos = obtenerReportesAnno.data();
    
    //SE VERIFICA SI EXISTE EL REPORTE, SI NO EXISTE, SE CREA
    //SE VERIFICA SI EXISTE EL REPORTE, SI NO EXISTE, SE CREA
    //SE VERIFICA SI EXISTE EL REPORTE, SI NO EXISTE, SE CREA


    if(!obtenerReportesAnno.exists()){

      let creacion = await crearDocumentoReporteAnual(anno);

      if(creacion == err) return err;

      datosObtenidos = {contador: 0};

    }

    let reporte = armarReporteCambioAnual(datosObtenidos.contador, fechaHoyCompleta);

    //SE ACTUALIZA, Y EN CASO DE QUE NO SE CAMBIARA NADA
    //SE SUBE UNICAMENTE EL CONTADOR, EL CUAL QUEDA IGUAL

    await updateDoc(documentoReporte, reporte);

    } catch (error) {
      ocultarPantallaCarga();
      mostrarPantallaError(error);
      return err;
    }


  }

  async function crearDocumentoReporteAnual(anno) {

    try {

        let objeto = {

          contador: 0

        };

        await setDoc(doc(Base, "reportesVariablesAnuales/" + anno), objeto);
        
        return 0;
      
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return err;
    }

  }