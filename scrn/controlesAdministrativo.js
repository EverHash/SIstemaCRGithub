/*global document, console */

import {verSiEsNumeroEntero, 
        numberAformatoMontos, 
        productoPrecision2, 
        sumaDecimal, 
        validacionMontoEstiloBDV,
        verSiEsUnaLetraOCaracterEspecial,
        eliminarCaracterEnIndice,
        eliminarTodasLasOcurrenciasDeUnCaracter,
        extraerNumerosPuntosComasDeUnaCadena,
        formatearCadenaNumerosMilesYDecimales,
        insertarCaracterEnIndice,
        formatoMontosAnumber,
        eliminarOcurrenciasElementoArray} from "./utilidades.js";

import {obtenerPrecioAdministrativo, 
        precioDolar, 
        precioCertificacionFondoNegro, 
        precioNotasCertificadas, 
        precioRetiroTitulo, 
        precioRetiroPapeles } from "./obtenerPrecios.js";

import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { limpiarValoresTotalPagarPantallaPagos, setTipoPago } from "./controlesEfectuarPago.js";
import { borrarElementoHTML, cambiarTextContent, consultarInputText, consultarInputTextHTML, deshabilitarInput, habilitarInput, limpiarInputText, mostrarBlock, mostrarBlockHTML, mostrarPantalla, obtenerElementoHTML, obtenerSelectedIndex, obtenerTextContent, obtenerTextContentHTML, obtenerTextContentSelectedIndex, ocultar, ocultarHTML, reiniciarSelect } from "./funcionesHTML.js";
import { crearCeldaConInput, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";
import { reiniciarContenedoresAbono } from "./mensualidad.js";

export {entrarPagarAdministrativo, 
        calcularPrecioPagarAdministrativo, 
        atrasPagosNuevosAdministrativos, 
        validacionMontoConCorreccionPagoTotalAdministrativo,
        validacionMontoUSDConCorreccionPagoConceptoAdministrativo};

//WARNING: MOVI LAS SIGUIENTES FUNCIONES
//ENTRAR SELECCIONAR
//ATRAS PAGOS NUEVOS

//ESTO DE AQUI SON LOS CONTROLES DEL FORMULARIO
//ESTO DE AQUI SON LOS CONTROLES DEL FORMULARIO
//ESTO DE AQUI SON LOS CONTROLES DEL FORMULARIO

export class gestorFormularioAdministrativo{

    constructor(){

        this.arrayListaPaginas = ["administrativoPG1"];
        this.paginaActual = 0; //A CERO PARA QUE VAYA A LA PAR DEL ARRAY

    }

    limpiarInterfaz(){

        mostrarBlock("administrativoPG1");

        if(this.arrayListaPaginas.length > 1){

            let elemento;

            //A ELIMINAR LAS PAGINAS EXTRAS SI LAS HUBIERAN

            let contenedor = document.getElementById("contenedorAdministrativo");

            for(let i = 1; i <= this.arrayListaPaginas.length - 1; i++){

                elemento = obtenerElementoHTML(this.arrayListaPaginas[i]);
                contenedor.removeChild(elemento);

            }

        }

        this.arrayListaPaginas = ["administrativoPG1"];
        this.paginaActual = 0;

        //A LIMPIAR AHORA LA PRIMERA PAGINA DE FORMULARIO

        let primeraPagina = document.getElementById("administrativoPG1").children[1].children[1];

        primeraPagina.children[0].value = "";        
        primeraPagina.children[1].value = "";
        primeraPagina.children[2].selectedIndex = 0;
        primeraPagina.children[3].value = "";

        //PARA QUE EL CODIGO DE OCULTAR EL OTRO CONCEPTO SOLO DEPENDA DEL
        //CURSOR DEL PANEL INFERIOR, PROCEDO A REINICIAR EL PANEL INFERIOR
        //Y LUEGO LLAMO AL METODO QUE OCULTA EL OTRO CONCEPTO

        this.reiniciarPanelInferior(); 

        this.ocultarOtroConcepto();


    }

    reiniciarPanelInferior(){

        cambiarTextContent("paginaListaAdministrativo", "1");
        
        document.getElementById("pgAtrasAdministrativo").style.visibility = "hidden";

        document.getElementById("pgSiguienteAdministrativo").style.display = "none";
        document.getElementById("pgAgregarAdministrativo").style.display = "flex";

    }

    eliminarPagina(elementoHTML){ //ESTO RECIBE NO EL ID, SINO EL ELEMENTO MISMO

        let paginaActual = obtenerTextContent("paginaListaAdministrativo");
        
        let numeroContador = parseInt(paginaActual);

        ocultarHTML(elementoHTML); //ESTA ES LA PAGINA

        mostrarBlock(this.arrayListaPaginas[this.paginaActual - 1]); // -1 PORQUE AUN NO HE BORRADO LA PAGINA

        this.arrayListaPaginas = eliminarOcurrenciasElementoArray(this.arrayListaPaginas, 
                                                                  elementoHTML.id);

        cambiarTextContent("paginaListaAdministrativo", numeroContador - 1);

        borrarElementoHTML(elementoHTML);

        this.paginaActual = this.paginaActual - 1; 
        this.determinarBotonesNavegacion();

        console.log(this.arrayListaPaginas);

    }

    agregarPagina(){

        let paginaActual = obtenerTextContent("paginaListaAdministrativo");
        
        let numeroContador = parseInt(paginaActual);

        let copiaArrayListaPaginas = [...this.arrayListaPaginas];

        let numeroIdPag = extraerNumerosPuntosComasDeUnaCadena(this.arrayListaPaginas[numeroContador - 1]);

        let numeroPagActual = parseInt(numeroIdPag);

        let numeroPagSiguiente = numeroPagActual + 1;

        let cadenaSiguienteElemento = "administrativoPG" + numeroPagSiguiente;

        copiaArrayListaPaginas.push(cadenaSiguienteElemento);

        this.arrayListaPaginas = [...copiaArrayListaPaginas];

        let nuevaPagina = document.createElement("div");
        
        let contenedorDiv = document.createElement("div");
        
        let botonBorrar = document.createElement("img");
        botonBorrar.src = "rsrcs/delete.png";
        botonBorrar.className = "icono";
        botonBorrar.addEventListener("click", eliminarPagina);

        let h1 = document.createElement("h1");
        h1.classList.add("centradoNoFlex");
        h1.textContent = "Datos del Pago";
        let cajaContenedora = document.createElement("div");
            
        let conceptoArray = ["Concepto de Pago", 
                             "Retiro de Papeles", 
                             "Retiro de Título", 
                             "Certificación de Fondo Negro",
                             "Notas Certificadas", 
                             "Otro"];
        
        
        let labelNombres = document.createElement("label");
        let labelApellidos = document.createElement("label");
        let labelConceptoPago = document.createElement("label");
        let labelIntroduzcaConcepto = document.createElement("label");
        labelNombres.textContent = "Nombres: ";
        labelApellidos.textContent = "Apellidos: ";
        labelConceptoPago.textContent = "Lugar de Nacimiento: ";
        labelIntroduzcaConcepto.textContent = "Introduzca el Concepto ";
        labelIntroduzcaConcepto.style.display = "none";

        
        let inputNombres = document.createElement("input");
        let inputApellidos = document.createElement("input");
        let inputConcepto = document.createElement("select");
        let inputIntroduzcaConcepto = document.createElement("input");

        inputNombres.type = "text";
        inputNombres.placeholder = "Nombres";
        inputApellidos.type = "text";
        inputApellidos.placeholder = "Apellidos";
        inputIntroduzcaConcepto.type = "text";
        inputIntroduzcaConcepto.placeholder = "Concepto";
        inputIntroduzcaConcepto.style.display = "none";
        for(let i = 0; i <= 5; i++) inputConcepto.appendChild(document.createElement("option"));
        for(let i = 0; i <= 5; i++) inputConcepto.children[i].textContent = conceptoArray[i];
        inputConcepto.selectedIndex = 0;
        inputConcepto.addEventListener("change", cambiarConceptoPagoAdministrativo);

        let cajaLabels = document.createElement("div");
        let cajaInputs = document.createElement("div");
        cajaLabels.classList.add("subcajaFormularioAdministrativo");
        cajaInputs.classList.add("subcajaFormularioAdministrativoDerecha");
        cajaLabels.appendChild(labelNombres);
        cajaLabels.appendChild(labelApellidos);
        cajaLabels.appendChild(labelConceptoPago);
        cajaLabels.appendChild(labelIntroduzcaConcepto);
        cajaInputs.appendChild(inputNombres);
        cajaInputs.appendChild(inputApellidos);
        cajaInputs.appendChild(inputConcepto);
        cajaInputs.appendChild(inputIntroduzcaConcepto);
        nuevaPagina.id = cadenaSiguienteElemento;
        cajaContenedora.classList.add("cajaFormularioInscripcion");
        cajaContenedora.appendChild(cajaLabels);
        cajaContenedora.appendChild(cajaInputs);
        contenedorDiv.appendChild(h1);
        contenedorDiv.appendChild(botonBorrar);
        contenedorDiv.style.display = "flex";
        contenedorDiv.style.flexDirection = "row";
        contenedorDiv.style.justifyContent = "space-between";
        nuevaPagina.appendChild(contenedorDiv);
        nuevaPagina.appendChild(cajaContenedora);
        document.getElementById("administrativoPG" + numeroPagActual).style.display = "none";
        document.getElementById("contenedorAdministrativo").insertBefore(nuevaPagina, document.getElementById("contenedorAdministrativo").children[document.getElementById("contenedorAdministrativo").children.length - 1]);

        this.paginaSiguiente();

    }

    paginaSiguiente(){

        debugger;

        let paginaActual = document.getElementById(this.arrayListaPaginas[this.paginaActual]);

        let paginaSiguiente = document.getElementById(this.arrayListaPaginas[this.paginaActual + 1]);

        paginaActual.style.display = "none";
        paginaSiguiente.style.display = "block";

        this.paginaActual = this.paginaActual + 1;

        let numeroPagInterfaz = obtenerTextContent("paginaListaAdministrativo");

        numeroPagInterfaz = parseInt(numeroPagInterfaz);

        cambiarTextContent("paginaListaAdministrativo", numeroPagInterfaz + 1);

        this.determinarBotonesNavegacion();

    }

    paginaAnterior(){

        let paginaActual = document.getElementById(this.arrayListaPaginas[this.paginaActual]);

        let paginaAnterior = document.getElementById(this.arrayListaPaginas[this.paginaActual - 1]);

        paginaActual.style.display = "none";
        paginaAnterior.style.display = "block";

        let numeroPagInterfaz = obtenerTextContent("paginaListaAdministrativo");
        numeroPagInterfaz = parseInt(numeroPagInterfaz);
        cambiarTextContent("paginaListaAdministrativo", numeroPagInterfaz - 1);

        this.paginaActual = this.paginaActual - 1;
        this.determinarBotonesNavegacion();

    }


    determinarBotonesNavegacion(){

        let pagMax = this.arrayListaPaginas.length - 1;

        let botonAgregar = obtenerElementoHTML("pgAgregarAdministrativo");
        let botonSiguiente = obtenerElementoHTML("pgSiguienteAdministrativo");
        let botonAtras = obtenerElementoHTML("pgAtrasAdministrativo");

        if(this.paginaActual == 0 && this.paginaActual == pagMax){ //ES LA PRIMERA Y SOLO HAY UNA

            botonAtras.style.visibility = "hidden";
            botonSiguiente.style.display = "none";
            botonAgregar.style.display = "flex";
            return;

        }

        if(this.paginaActual == 0 && this.paginaActual != pagMax){ //ES LA PRIMERA Y HAY MAS

            botonAtras.style.visibility = "hidden";
            botonSiguiente.style.display = "flex";
            botonAgregar.style.display = "none";
            return;

        }

        if(this.paginaActual != 0 && this.paginaActual != pagMax){ //NO ES LA PRIMERA Y HAY MAS

            botonAtras.style.visibility = "visible";
            botonSiguiente.style.display = "flex";
            botonAgregar.style.display = "none";
            return;   

        }

        if(this.paginaActual != 0 && this.paginaActual == pagMax){ //ES LA ULTIMA Y HAY MAS ATRAS

            botonAtras.style.visibility = "visible";
            botonSiguiente.style.display = "none";
            botonAgregar.style.display = "flex";
            return;   

        }
 
        

    }

    ocultarOtroConcepto(){

        //PRIMERO OBTENEMOS EL NUMERO QUE ESTA MOSTRANDO EL CURSOR
        //Y DE AHI SACAMOS EL INDICE QUE SE VA A CONSULTAR EN EL ARRAY

        let numeroElemento = document.getElementById("paginaListaAdministrativo").textContent;

        let indiceElemento = parseInt(numeroElemento) - 1; //EL CURSOR CUENTA DESDE 1

        let idElemento = this.arrayListaPaginas[indiceElemento];

        let elemento = document.getElementById(idElemento);

        ocultarHTML(elemento.children[1].children[0].children[3]); //EL LABEL

        ocultarHTML(elemento.children[1].children[1].children[3]); //EL INPUT

    }

    dibujarTablaPrevioConfirmar(){

        limpiarFilasTabla("tablaDatosAdministrativo", 1);

        if(this.formulariosInvalidos()){ //LA PANTALLA DE ERROR LA MUESTRA ESTA FUNCION

            return "ERROR";

        }

        let tabla = obtenerElementoHTML("tablaDatosAdministrativo");

        let celdaNombreCompleto;
        let celdaConcepto;
        let celdaMontoUSD;
        let celdaPrecioUSD;

        let info;

        let montoUSD;

        let fila;
        let arrayCeldas;

        for(let i = 0; i <= this.arrayListaPaginas.length - 1; i++){

            arrayCeldas = [];

            info = this.obtenerInformacionFormulario(i);

            celdaNombreCompleto = crearCeldaConTexto(info.nombres + " " + info.apellidos);
            celdaConcepto = crearCeldaConTexto(info.concepto);

            montoUSD = "0,00";

            if(info.concepto == "Retiro de Papeles") montoUSD = numberAformatoMontos(precioRetiroPapeles);
            if(info.concepto == "Retiro de Título") montoUSD = numberAformatoMontos(precioRetiroTitulo);
            if(info.concepto == "Certificación de Fondo Negro") montoUSD = numberAformatoMontos(precioCertificacionFondoNegro);
            if(info.concepto == "Notas Certificadas") montoUSD = numberAformatoMontos(precioNotasCertificadas);

            celdaMontoUSD = crearCeldaConInput("text", montoUSD, "");

            celdaMontoUSD.children[0].addEventListener("input", validacionMontoUSDConCorreccionPagoConceptoAdministrativo);

            celdaPrecioUSD = crearCeldaConInput("text", numberAformatoMontos(precioDolar), "validacionMontoEstiloBDV");

            arrayCeldas.push(celdaNombreCompleto);
            arrayCeldas.push(celdaConcepto);
            arrayCeldas.push(celdaMontoUSD);
            arrayCeldas.push(celdaPrecioUSD);

            fila = crearTRconCeldasApendadas(arrayCeldas);

            tabla.appendChild(fila);

        }

        correccionSumaUSDTotalPagarAdministrativo();

    }

    obtenerInformacionFormulario(indice){

        let pagina = obtenerElementoHTML(this.arrayListaPaginas[indice]);

        let formulario = pagina.children[1].children[1];

        let objetoFormulario = {

            nombres: formulario.children[0].value,
            apellidos: formulario.children[1].value,
            concepto: formulario.children[3].value,

        };

        return objetoFormulario;


    }

    formulariosInvalidos(){

        let informacion;

        for(let i = 0; i <= this.arrayListaPaginas.length - 1; i++){

            informacion = this.obtenerInformacionFormulario(i);

            if(informacion.nombres == ""){

                mostrarPantallaError("Introduzca el nombre en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.apellidos == ""){

                mostrarPantallaError("Introduzca el apellido en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.concepto == ""){

                mostrarPantallaError("Introduzca el concepto en la página " + (i + 1) + ", por favor");
                return true;

            }

        }

        return false;

    }

}

export let gestorFormulario = new gestorFormularioAdministrativo();

export function paginaSiguienteAdministrativo(){

    gestorFormulario.paginaSiguiente();

}

export function paginaAnteriorAdministrativo(){

    gestorFormulario.paginaAnterior();

}

export function agregarPaginaAdministrativo(){

    gestorFormulario.agregarPagina();

}

function eliminarPagina(){

    let elemento = this.parentNode.parentNode;

    gestorFormulario.eliminarPagina(elemento);

}

export function continuarConsultarPreciosAdministrativo(){

    let resultado = gestorFormulario.dibujarTablaPrevioConfirmar();

    if(resultado == "ERROR") return;

    ocultar("main-container-PagosAdministrativos");
    mostrarPantalla("mainContainerConsultaPrecioAdministrativo");


}




function validacionMontoConCorreccionPagoTotalAdministrativo(){
  let valor = this.value;
  if(verSiEsUnaLetraOCaracterEspecial(valor[valor.length - 1])) valor = eliminarCaracterEnIndice(valor, valor.length - 1);
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ".");
  if(valor.length == 0){
      this.value = "0,00";
      return 0;
  }
  if(valor.length == 1){
      this.value = "0,0" + valor;
  }
  if((valor[0] === ".")){
      this.value = "0" + valor;
      return 0;
  }
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  if(valor[0] === "," && valor.length == 3) valor = "0" + valor;
  if(valor[0] === "0" && valor[1] != "," && valor.length > 1) valor = eliminarCaracterEnIndice(valor, 0);
  this.value = valor;
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  this.value = extraerNumerosPuntosComasDeUnaCadena(valor);
  this.value = formatearCadenaNumerosMilesYDecimales(valor);
  correccionSumaBSTotalPagarAdministrativo();
};

function validacionMontoUSDConCorreccionPagoConceptoAdministrativo(){
  let valor = this.value;
  if(verSiEsUnaLetraOCaracterEspecial(valor[valor.length - 1])) valor = eliminarCaracterEnIndice(valor, valor.length - 1);
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ".");
  if(valor.length == 0){
      this.value = "0,00";
      return 0;
  }
  if(valor.length == 1){
      this.value = "0,0" + valor;
  }
  if((valor[0] === ".")){
      this.value = "0" + valor;
      return 0;
  }
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  if(valor[0] === "," && valor.length == 3) valor = "0" + valor;
  if(valor[0] === "0" && valor[1] != "," && valor.length > 1) valor = eliminarCaracterEnIndice(valor, 0);
  this.value = valor;
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  this.value = extraerNumerosPuntosComasDeUnaCadena(valor);
  this.value = formatearCadenaNumerosMilesYDecimales(valor);
  correccionSumaUSDTotalPagarAdministrativo();
};

function correccionSumaBSTotalPagarAdministrativo(){
    let tabla = document.getElementById("tablaConfirmarDetallesAdministrativo");
    let precioTotal = 0;
    let inputBS;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            inputBS = tabla.rows[i].cells[3].children[0];
            precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), inputBS.value);
        }

    document.getElementById("totalPagarAdministrativoConfirmarBS").textContent = numberAformatoMontos(precioTotal);
}

function correccionSumaUSDTotalPagarAdministrativo(){
    let tabla = obtenerElementoHTML("tablaDatosAdministrativo");
    let precioTotal = 0;
    let montoUSD;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            montoUSD = tabla.rows[i].cells[2].children[0].value;
            precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), montoUSD);
        }

    cambiarTextContent("totalPagarAdministrativoConsultaUSD", numberAformatoMontos(precioTotal));
}

//PRIMERA PANTALLA EN DONDE SE CONSULTA SI EL REPRESENTANTE
//SE ENCUENTRA REGISTRADO EN LA BASE DE DATOS DEL SISTEMA

export async function entrarSeleccionarRegistroRepresentantePagoAdministrativo(){
    mostrarPantallaCarga();
    ocultar("main-container-postLogin");
    mostrarPantalla("mainContainerRegistroRepresentanteAdministrativo");
    await obtenerPrecioAdministrativo();
    ocultarPantallaCarga();
}

export function atrasSeleccionarRepresentanteAdministrativo(){
    reiniciarSelect("representanteRegistradoAdministrativo");
    ocultar("mainContainerRegistroRepresentanteAdministrativo");    
    mostrarPantalla("main-container-postLogin");
}

function formularioInvalidoRepresentanteRegistrado(){

    let select = obtenerSelectedIndex("representanteRegistradoAdministrativo");

    if(select == 0) return true;

    return false;

}

export function entrarPantallaDatosRepresentante(){

    if(formularioInvalidoRepresentanteRegistrado()){

        mostrarPantallaError("Seleccione una opción del menú desplegable, por favor");
        return;

    }

    let select = obtenerSelectedIndex("representanteRegistradoAdministrativo");

    if(select == 1) determinarInterfazIntroducirDatosRepresentante(true);
    else determinarInterfazIntroducirDatosRepresentante(false);

    
    ocultar("mainContainerRegistroRepresentanteAdministrativo");
    mostrarPantalla("mainContainerDatosRepresentanteAdministrativo");
}

function determinarInterfazIntroducirDatosRepresentante(registro){

    if(!registro){

        ocultar("tdBotonConsultarRepresentanteAdministrativo");
        ocultar("trTotalAbonadoRepresentanteAdministrativo");
        ocultar("pegarCedulaCopiadaPagosAdministrativos");

        habilitarInput("nombresRepresentanteAdministrativo");
        habilitarInput("apellidosRepresentanteAdministrativo");
        return;

    }

    //SI NO ESTA REGISTRADO, OCULTAR Y LUEGO RETORNA
    //SI LO ESTA, PASA A LO DE ABAJO

    let celdaBotonBuscar = obtenerElementoHTML("tdBotonConsultarRepresentanteAdministrativo");
    let filaTotalAbonado = obtenerElementoHTML("trTotalAbonadoRepresentanteAdministrativo");

    mostrarBlock("pegarCedulaCopiadaPagosAdministrativos");
    celdaBotonBuscar.style.display = "table-cell";
    filaTotalAbonado.style.display = "table-row";

    deshabilitarInput("nombresRepresentanteAdministrativo");
    deshabilitarInput("apellidosRepresentanteAdministrativo");

}

//PANTALLA DONDE SE INTRODUCEN LOS DATOS DEL REPRESENTANTE
//PANTALLA DONDE SE INTRODUCEN LOS DATOS DEL REPRESENTANTE
//PANTALLA DONDE SE INTRODUCEN LOS DATOS DEL REPRESENTANTE

export function determinarMontoTotalAbonadoAdministrativo(representante){

  let montoBS = "0,00";
  let montoUSD = "0,00";

  let usdAbolivares;
  
  for(let propiedad in representante){

    if(!propiedad.includes("abonos")) continue;

    //SE SUMA CADA MONEDA

    if(representante[propiedad][1] == "Bolívares"){

      montoBS = sumaDecimal(montoBS, numberAformatoMontos(representante[propiedad][2]));
      montoBS = numberAformatoMontos(montoBS);

    }

    if(representante[propiedad][1] == "Dólares"){

      montoUSD = sumaDecimal(montoUSD, numberAformatoMontos(representante[propiedad][2]));
      montoUSD = numberAformatoMontos(montoUSD);

    }

  }

  if(montoBS != "0,00" && montoUSD != "0,00"){

    //SI HAY DOLARES Y BS ENTRE EL DINERO QUE HA ABONADO EL REPRESENTANTE

    //AQUI LO QUE SE HACE ES
    //CONVERTIR LOS DOLARES A BS
    //LUEGO SE SUMA A LOS BS
    //LUEGO SE CONVIERTE A FORMATO MONTOS
    //Y FINALMENTE SE RETORNA

    montoUSD = formatoMontosAnumber(montoUSD);
    usdAbolivares = productoPrecision2(precioDolar, montoUSD);
    usdAbolivares = numberAformatoMontos(usdAbolivares);


    montoBS = sumaDecimal(montoBS, usdAbolivares);

    montoBS = numberAformatoMontos(montoBS);

    return (montoBS + " Bs");


  }

  if(montoBS != "0,00" && montoUSD == "0,00") return (montoBS + " Bs");
  if(montoBS == "0,00" && montoUSD != "0,00") return (montoUSD + " USD");

  if(montoBS == "0,00" && montoUSD == "0,00") return "0,00 Bs";



}

export function atrasIntroducirDatosRepresentanteAdministrativo(){

    limpiarInputText("cedulaRepresentanteAdministrativo");
    limpiarInputText("nombresRepresentanteAdministrativo");
    limpiarInputText("apellidosRepresentanteAdministrativo");
    limpiarInputText("totalAbonadoRepresentanteAdministrativo");

    ocultar("mainContainerDatosRepresentanteAdministrativo");
    mostrarPantalla("mainContainerRegistroRepresentanteAdministrativo");

    reiniciarContenedoresAbono();

}

export function entrarPantallaFormularioAdministrativo(){

    if(formularioInvalidoIntroducirDatosRepresentante()) return;

    ocultar("mainContainerDatosRepresentanteAdministrativo");
    mostrarPantalla("main-container-PagosAdministrativos");

}

function formularioInvalidoIntroducirDatosRepresentante(){

    let cedula = consultarInputText("cedulaRepresentanteAdministrativo");
    let nombre = consultarInputText("nombresRepresentanteAdministrativo");
    let apellido = consultarInputText("apellidosRepresentanteAdministrativo");

    if(cedula == "" || apellido == "" || nombre == ""){

        mostrarPantallaError("Rellene el formulario por favor");
        return true;

    }

    return false;

}


//RESTO DE COSAS

function atrasPagosNuevosAdministrativos(){
    document.getElementById("main-container-PagosAdministrativos").style.display = "none";
    document.getElementById("mainContainerDatosRepresentanteAdministrativo").style.display = "block";

    gestorFormulario.limpiarInterfaz();
}

export function cambiarConceptoPagoAdministrativo(){

    let espacioLabels = this.parentNode.parentNode.children[0];

    let espacioFormularios = this.parentNode;

    let select = espacioFormularios.children[2];

    let input = espacioFormularios.children[3];

    if(select.selectedIndex == 5){

        mostrarBlockHTML(espacioLabels.children[3]);
        mostrarBlockHTML(input);
        input.value = "";
        return;

    }

    ocultarHTML(espacioLabels.children[3]);
    ocultarHTML(input);

    let concepto = obtenerTextContentSelectedIndex(select, select.selectedIndex);

    if(select.selectedIndex != 0 && select.selectedIndex != 5){

        input.value = concepto;

    }
    
    else{

        input.value = "";

    }

}

export function dibujarTablaConfirmar(){

    limpiarFilasTabla("tablaConfirmarDetallesAdministrativo", 1);

    let tablaConfirmar = obtenerElementoHTML("tablaConfirmarDetallesAdministrativo");
    let tablaPrevia = obtenerElementoHTML("tablaDatosAdministrativo");

    let arrayCeldas;

    let montoBS;
    let celdaMontoBS;

    let nombreTablaPrevia;
    let conceptoTablaPrevia;
    let montoUSDtablaPrevia;
    let precioUSDtablaPrevia;

    let fila;

    for(let i = 1; i <= tablaPrevia.rows.length - 1; i++){

        arrayCeldas = [];

        nombreTablaPrevia = tablaPrevia.rows[i].cells[0].textContent;
        conceptoTablaPrevia = tablaPrevia.rows[i].cells[1].textContent;
        montoUSDtablaPrevia = tablaPrevia.rows[i].cells[2].children[0].value;
        precioUSDtablaPrevia = tablaPrevia.rows[i].cells[3].children[0].value;

        arrayCeldas.push(crearCeldaConTexto(nombreTablaPrevia));
        arrayCeldas.push(crearCeldaConTexto(conceptoTablaPrevia));
        arrayCeldas.push(crearCeldaConTexto(montoUSDtablaPrevia));

        montoBS = productoPrecision2(formatoMontosAnumber(montoUSDtablaPrevia), formatoMontosAnumber(precioUSDtablaPrevia));
        montoBS = numberAformatoMontos(montoBS);

        celdaMontoBS = crearCeldaConInput("text", montoBS, "");

        celdaMontoBS.children[0].addEventListener("input", validacionMontoConCorreccionPagoTotalAdministrativo);

        arrayCeldas.push(celdaMontoBS);

        fila = crearTRconCeldasApendadas(arrayCeldas);
        tablaConfirmar.appendChild(fila);

    }

    let sumaPrecioUSD = obtenerTextContent("totalPagarAdministrativoConsultaUSD");
    cambiarTextContent("totalPagarAdministrativoConfirmarUSD", sumaPrecioUSD);
    correccionSumaBSTotalPagarAdministrativo();

}

function tablaInvalidaPrevioConfirmar(){

    let tabla = obtenerElementoHTML("tablaDatosAdministrativo");

    let montoUSD;
    let precioUSD;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        montoUSD = tabla.rows[i].cells[2].children[0].value;
        precioUSD = tabla.rows[i].cells[3].children[0].value;

        if(montoUSD == "0,00"){

            mostrarPantallaError("Introduzca el monto en la fila " + i);
            return true;

        }

        if(precioUSD == "0,00"){

            mostrarPantallaError("Introduzca el precio del dólar en la fila " + i);
            return true;

        }

    }

    return false;

}

export function atrasConsultaPreciosAdministrativo(){

    ocultar("mainContainerConsultaPrecioAdministrativo");
    mostrarPantalla("main-container-PagosAdministrativos");

}

export function entrarPantallaConfirmarAdministrativo(){

    if(tablaInvalidaPrevioConfirmar()) return;

    dibujarTablaConfirmar();

    ocultar("mainContainerConsultaPrecioAdministrativo");
    mostrarPantalla("mainContainerConfirmarConceptosAdministrativo");


}

export function atrasPantallaConfirmarAdministrativo(){

    ocultar("mainContainerConfirmarConceptosAdministrativo");
    mostrarPantalla("mainContainerConsultaPrecioAdministrativo");
    

}

function tablaInvalidaConfirmarAdministrativo(){

    let tabla = obtenerElementoHTML("tablaConfirmarDetallesAdministrativo");

    let valorBS;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        valorBS = tabla.rows[i].cells[3].children[0].value;

        if(valorBS == "0,00"){

            mostrarPantallaError("Introduzca el monto en BS en la fila " + i);
            return true;

        }

    }

    return false;

}

export function entrarPantallaPagoAdministrativo(){

    if(tablaInvalidaConfirmarAdministrativo()) return; //SI ES INVALIDA TERMINA LA FUNCION

    //SE LIMPIAN LOS VALORES EN LA PANTALLA DE PAGO

    limpiarValoresTotalPagarPantallaPagos();

    //SE ASIGNAN LOS VALORES Y PROPIEDADES NECESARIOS

    setTipoPago("Administrativo");

    let valorBS = obtenerTextContent("totalPagarAdministrativoConfirmarBS");
    let valorUSD = obtenerTextContent("totalPagarAdministrativoConfirmarUSD");

    cambiarTextContent("montoPagarBolivares", valorBS);
    cambiarTextContent("montoPagarDolares", valorUSD);

    //SE REALIZA EL CAMBIO DE PANTALLA

    ocultar("mainContainerConfirmarConceptosAdministrativo");
    mostrarPantalla("mainContainerPagar");

}

function calcularPrecioPagarAdministrativo(){



    let tabla = document.getElementById("tabla-datosPagosAdministrativos");
    let precio = 0;
    let inputBS;
    let montoUSDTabla;
    let inputUSD;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            inputBS = tabla.rows[i].cells[3].children[0];
            inputUSD = tabla.rows[i].cells[4].children[0].value;
            if(tabla.rows[i].cells[5].children[0].selectedIndex == 0){ //NINGUNA SELECCIONADA
                montoUSDTabla = tabla.rows[i].cells[2];
                montoUSDTabla.textContent = "0,00";
                inputBS.value = "0,00";
                continue;
            }
            if(tabla.rows[i].cells[5].children[0].selectedIndex == 1){
                montoUSDTabla = tabla.rows[i].cells[2];
                montoUSDTabla.textContent = numberAformatoMontos(precioRetiroPapeles);
                inputBS.value = numberAformatoMontos(productoPrecision2(precioRetiroPapeles, formatoMontosAnumber(inputUSD)));
                continue;
            }
            if(tabla.rows[i].cells[5].children[0].selectedIndex == 2){
                montoUSDTabla = tabla.rows[i].cells[2];
                montoUSDTabla.textContent = numberAformatoMontos(precioRetiroTitulo);
                inputBS.value = numberAformatoMontos(productoPrecision2(precioRetiroTitulo, formatoMontosAnumber(inputUSD)));
                continue;
            }
            if(tabla.rows[i].cells[5].children[0].selectedIndex == 3){
                montoUSDTabla = tabla.rows[i].cells[2];
                montoUSDTabla.textContent = numberAformatoMontos(precioCertificacionFondoNegro);
                inputBS.value = numberAformatoMontos(productoPrecision2(precioCertificacionFondoNegro, formatoMontosAnumber(inputUSD)));
                continue;
            }
            if(tabla.rows[i].cells[5].children[0].selectedIndex == 4){
                montoUSDTabla = tabla.rows[i].cells[2];
                montoUSDTabla.textContent = numberAformatoMontos(precioNotasCertificadas);
                inputBS.value = numberAformatoMontos(productoPrecision2(precioNotasCertificadas, formatoMontosAnumber(inputUSD)));
                continue;
            }
        }
    
    //ASIGNACION DEL TOTAL A PAGAR EN DOLARES
    
    correccionSumaUSDTotalPagarAdministrativo();
    
    //ASIGNACION DEL TOTAL A PAGAR EN BOLIVARES

    correccionSumaBSTotalPagarAdministrativo();
}

function entrarPagarAdministrativo(){
    let tabla = document.getElementById("tabla-datosPagosAdministrativos");

    //SE VALIDAN LOS FORMULARIOS

    if(document.getElementById("nombresPagoAdministrativo").value == ""){
        mostrarPantallaError("Introduzca el nombre del representante, por favor...");
        return 0;
      }
    if(document.getElementById("apellidosPagoAdministrativo").value == ""){
        mostrarPantallaError("Introduzca el apellido del representante, por favor...");
        return 0;
    }
    if(document.getElementById("cedula-representanteAdministrativo").value == ""){
        mostrarPantallaError("Introduzca la cédula del representante, por favor...");
        return 0;
    }
    if(verSiEsNumeroEntero(document.getElementById("cedula-representanteAdministrativo").value) == 1){
        mostrarPantallaError("Introduzca solo números en la cédula del representante sin separaciones, por favor...");
        return 0;
    }

    //SE VALIDA LA TABLA

    for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(tabla.rows[i].cells[0].children[0].value == ""){
          mostrarPantallaError("Introduzca el nombre del estudiante en la fila " + i + ", por favor...");
          return 0;
        }
        if(tabla.rows[i].cells[1].children[0].value == ""){
          mostrarPantallaError("Introduzca el apellido del estudiante en la fila " + i + ", por favor...");
          return 0;
        }
        if(tabla.rows[i].cells[3].children[0].value == "0,00"){
          mostrarPantallaError("Introduzca un monto en la fila " + i + ", por favor...");
          return 0;
        }
        if(tabla.rows[i].cells[4].children[0].value == "0,00"){
          mostrarPantallaError("Introduzca un precio del Dolar en la fila " + i + ", por favor...");
          return 0;
        }
        if(tabla.rows[i].cells[5].children[0].selectedIndex == 0){
          mostrarPantallaError("Introduzca el concepto de pago en la fila " + i + ", por favor...");
          return 0;
        }
      }

      //SE PERMITE ENTRAR DESPUES DE COMPLETAR LA VALIDACION


    document.getElementById("main-container-PagosAdministrativos").style.display = "none";
    document.getElementById("").style.display = "block";
}