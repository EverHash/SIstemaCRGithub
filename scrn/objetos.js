/*global document */

export{
    documentoDePago,
    representante,
    estudiante,
    estudianteRepresentante,
    reciboInscripcion,
    reciboMensualidad,
    reciboAdministrativo,
    reciboAbono,
    reciboAbonoNoRegistrado,
    documentoDePagoExonerado
};

import {extraerLetrasDeUnaCadena, 
        extraerNumerosPuntosComasDeUnaCadena, 
        numberAformatoMontos, 
        productoPrecision2, 
        subcadenaDesdeIndice, 
        sumaDecimal, 
        restaDecimal,
        formatoMontosAnumber} from "./utilidades.js";
import { crearCeldaConTexto, crearTRconCeldasApendadas } from "./utilidadesTablas.js";

class representante{
    nombres = "";
    apellidos = "";
    cedula = "";
    estudiantes = 0;
    telefono = "";
    tipoRepresentante = "";
    direccionRepresentante = "";
    nombrePadre = ""; 
    cedulaPadre = "";
    nombreMadre = "";
    cedulaMadre = "";
    hermanos = "";
    registroPagos = [];
    obtenerDatosRepresentante(formularios){
        this.nombres = formularios[0].children[0].value;
        this.apellidos = formularios[0].children[1].value;
        this.cedula = formularios[0].children[2].value;
        this.estudiantes = formularios.length - 1;
        this.telefono = formularios[0].children[3].value;
        this.tipoRepresentante = formularios[0].children[4].options[formularios[0].children[4].selectedIndex].textContent;
        this.direccionRepresentante = formularios[0].children[5].value;
        this.nombrePadre = formularios[0].children[6].value;
        this.cedulaPadre = formularios[0].children[7].value;
        this.nombreMadre = formularios[0].children[8].value;
        this.cedulaMadre = formularios[0].children[9].value;
    }
    introducirAbonoPrevio(objetoAbono){

      for(let propiedad in objetoAbono){
        if(propiedad.includes("abonos")){
          this[propiedad] = objetoAbono[propiedad];
        }
      }

    }    
}

class estudiante{
  nombres = "";
  apellidos = "";
  cedula = "";
  sexo = "";
  cedulaRepresentante = "";
  nombreRepresentante = "";
  tipoRepresentante = "";
  fechaNacimiento = "";
  fechaInscripcion = "";
  lugarNacimiento = "";
  estado = "";
  direccion = "";
  pagoInscripcion = true;
  pago09Septiembre = false;
  pago10Octubre = false;
  pago11Noviembre = false;
  pago12Diciembre = false;
  pago13Enero = false;
  pago14Febrero = false;
  pago15Marzo = false;
  pago16Abril = false;
  pago17Mayo = false;
  pago18Junio = false;
  pago19Julio = false;
  pago20Agosto = false;
  obtenerDatos(formularios){
    this.nombres = formularios.children[0].value;
    this.apellidos = formularios.children[1].value;
    this.sexo = formularios.children[3].options[formularios.children[3].selectedIndex].textContent;
    this.cedula = formularios.children[2].value;
    this.fechaNacimiento = formularios.children[7].value;
    this.lugarNacimiento = formularios.children[8].value;
    this.estado = formularios.children[9].options[formularios.children[9].selectedIndex].textContent;
    this.direccion = formularios.children[10].value;
  }
  obtenerDatosRepresentante(formulario){
    this.nombreRepresentante = formulario.children[0].value + " " + formulario.children[1].value;
    this.cedulaRepresentante = formulario.children[2].value;
  }
  solvenciaDeInscripcion(){

    let tabla = document.getElementById("tablaMesesSolventesInscripcion");

    let propiedades = ["pago09Septiembre", "pago10Octubre", "pago11Noviembre", "pago12Diciembre",
                    "pago13Enero", "pago14Febrero", "pago15Marzo", "pago16Abril", "pago17Mayo"];

    let mes;

    let mesSolvente;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

      if(this.cedula != tabla.rows[i].cells[1].textContent) continue;

      mesSolvente = tabla.rows[i].cells[4].children[0].checked;

      if(!mesSolvente) continue;

      mes = tabla.rows[i].cells[3].textContent;

      for(let j = 0; j <= propiedades.length - 1; j++){

        if(propiedades[j].includes(mes)){

          this[propiedades[j]] = "N/A";
          break;

        }

      }

    }
  }
  mesesPagadosInscripcion(){

    let propiedades = ["pago09Septiembre", "pago10Octubre", "pago11Noviembre", "pago12Diciembre",
                       "pago13Enero", "pago14Febrero", "pago15Marzo", "pago16Abril", "pago17Mayo",
                       "pago18Junio", "pago19Julio", "pago20Agosto"];

    let tabla = document.getElementById("tablaPagarMesesInscripcion");

    let mesSolvente;

    let mes;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

      if(this.cedula != tabla.rows[i].cells[1].textContent) continue;

      mesSolvente = tabla.rows[i].cells[7].children[0].checked;

      if(!mesSolvente) continue;

      mes = tabla.rows[i].cells[3].textContent;

      for(let j = 0; j <= propiedades.length - 1; j++){

        if(propiedades[j].includes(mes)){

          this[propiedades[j]] = true;
          break;

        }

      }

    }
  }
}

class estudianteRepresentante{
    nombres = "";
    apellidos = "";
    cedula = "";
    sexo = "";
    grado = "";
    curso = "";
    seccion = "";
    fechaNacimiento = "";
    lugarNacimiento = "";
    estado = "";
    direccion = "";
    tipoRepresentante = "";
    pagoInscripcion = true;
    pago09Septiembre = false;
    pago10Octubre = false;
    pago11Noviembre = false;
    pago12Diciembre = false;
    pago13Enero = false;
    pago14Febrero = false;
    pago15Marzo = false;
    pago16Abril = false;
    pago17Mayo = false;
    pago18Junio = false;
    pago19Julio = false;
    pago20Agosto = false;
    obtenerDatos(formularios){
      this.nombres = formularios.children[0].value;
      this.apellidos = formularios.children[1].value;
      this.sexo = formularios.children[3].options[formularios.children[3].selectedIndex].textContent;
      this.cedula = formularios.children[2].value;
      this.grado = formularios.children[4].options[formularios.children[4].selectedIndex].textContent;
      this.curso = formularios.children[5].options[formularios.children[5].selectedIndex].textContent;
      this.seccion = formularios.children[6].options[formularios.children[6].selectedIndex].textContent;
      this.fechaNacimiento = formularios.children[7].value;
      this.lugarNacimiento = formularios.children[8].value;
      this.estado = formularios.children[9].options[formularios.children[9].selectedIndex].textContent;
      this.direccion = formularios.children[10].value;
    }
    solvenciaDeInscripcion(){

      let tabla = document.getElementById("tablaMesesSolventesInscripcion");

      let propiedades = ["pago09Septiembre", "pago10Octubre", "pago11Noviembre", "pago12Diciembre",
                      "pago13Enero", "pago14Febrero", "pago15Marzo", "pago16Abril", "pago17Mayo"];

      let mes;

      let mesSolvente;

      for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(this.cedula != tabla.rows[i].cells[1].textContent) continue;

        mesSolvente = tabla.rows[i].cells[4].children[0].checked;

        if(!mesSolvente) continue;

        mes = tabla.rows[i].cells[3].textContent;

        for(let j = 0; j <= propiedades.length - 1; j++){

          if(propiedades[j].includes(mes)){

            this[propiedades[j]] = "N/A";
            break;

          }

        }

      }
    }
    mesesPagadosInscripcion(){

      let propiedades = ["pago09Septiembre", "pago10Octubre", "pago11Noviembre", "pago12Diciembre",
                        "pago13Enero", "pago14Febrero", "pago15Marzo", "pago16Abril", "pago17Mayo",
                        "pago18Junio", "pago19Julio", "pago20Agosto"];

      let tabla = document.getElementById("tablaPagarMesesInscripcion");

      let mesSolvente;

      let mes;

      for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(this.cedula != tabla.rows[i].cells[1].textContent) continue;

        mesSolvente = tabla.rows[i].cells[7].children[0].checked;

        if(!mesSolvente) continue;

        mes = tabla.rows[i].cells[3].textContent;

        for(let j = 0; j <= propiedades.length - 1; j++){

          if(propiedades[j].includes(mes)){

            this[propiedades[j]] = true;
            break;

          }
        }

      }
  }
}

class documentoDePago{
    reciboTieneAbono = false;
    prontoPago = false;
    version = 5;
    dolares = false;
    bolivares = false;
    escribirMontosEnUSD = false;
    escribirMontosEnBS = false;
    precioUSDdetallado = true;
    constructor(IdPago, nombreRepresentante, cedulaRepresentante,
                fecha, precioDolar, total, tipoDePago, flagVerificar){
        this.IdPago = IdPago;
        this.nombreRepresentante = nombreRepresentante;
        this.cedulaRepresentante = cedulaRepresentante;
        this.fecha = fecha;
        this.precioDolar = precioDolar;
        this.total = total;
        this.tipoDePago = tipoDePago;
        this.flagVerificar = flagVerificar;
    }
    indicarSiHuboAbono(abono){
      this.reciboTieneAbono = abono;
    }
    obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle, arrayTabla){
        const cadenaPunto = "pagoPunto";
        const cadenaEfectivo = "pagoEfectivo";
        const cadenaDolares = "pagoDolares";
        const cadenaTransferencia = "pagoTransferencia";
        const cadenaZelle = "pagoZelle";
        const cadenaAbono = "pagoAbono";
        let procesamientoMonto = "";
        let contadorPagos = 1;

        //ANOTAR PAGOS DE PUNTO

        for(let i = 0; i <= arrayTabla.length - 1; i++){
            if(arrayTabla[i][8] == "Punto"){
              this[cadenaPunto + contadorPagos] = [];
              this[cadenaPunto + contadorPagos].push(arrayTabla[i][5]); //CODIGO
              this[cadenaPunto + contadorPagos].push(arrayTabla[i][4]); //MONTO
              this[cadenaPunto + contadorPagos].push(arrayTabla[i][6]); //PRECIO DOLAR
              contadorPagos++;
            }
          }

        //ANOTAR PAGOS DE TRANSFERENCIA

        contadorPagos = 1;
        for(let i = 0; i <= arrayTabla.length - 1; i++){
            if(arrayTabla[i][8] == "Transferencia"){
              this[cadenaTransferencia + contadorPagos] = [];
              this[cadenaTransferencia + contadorPagos].push(arrayTabla[i][2]); //PROCEDENCIA DEL PAGO
              this[cadenaTransferencia + contadorPagos].push(arrayTabla[i][3]); //DESTINO DEL PAGO
              this[cadenaTransferencia + contadorPagos].push(arrayTabla[i][5]); //CODIGO
              this[cadenaTransferencia + contadorPagos].push(arrayTabla[i][4]); //MONTO
              if(verificarTransferencia == "SI"){
                this[cadenaTransferencia + contadorPagos].push(true); //FLAG DE ESTATUS
                this[cadenaTransferencia + contadorPagos].push(true); //FLAG DE ESPERA DE PROCESADO
                this.flagVerificar = true;
              }
              else{
                this[cadenaTransferencia + contadorPagos].push(false); //FLAG DE ESTATUS
                this[cadenaTransferencia + contadorPagos].push(false); //FLAG DE ESPERA DE PROCESADO
              }
              this[cadenaTransferencia + contadorPagos].push(arrayTabla[i][6]); //PRECIO DOLAR
              contadorPagos++;
            }
          }

          //ANOTAR PAGOS EFECTIVO BOLIVARES

          contadorPagos = 1;
          for(let i = 0; i <= arrayTabla.length - 1; i++){
            if(arrayTabla[i][8] == "Efectivo Bolívares"){
              this[cadenaEfectivo + contadorPagos] = [];
              this[cadenaEfectivo + contadorPagos][0] = arrayTabla[i][4];
              this[cadenaEfectivo + contadorPagos][1] = arrayTabla[i][6];
              contadorPagos++;
            }
          }

          //ANOTAR PAGOS EFECTIVO DOLARES

          contadorPagos = 1;
          for(let i = 0; i <= arrayTabla.length - 1; i++){
            if(arrayTabla[i][8] == "Efectivo Dólares"){
              this[cadenaDolares + contadorPagos] = [];
              this[cadenaDolares + contadorPagos].push(arrayTabla[i][2]); //BILLETE
              this[cadenaDolares + contadorPagos].push(arrayTabla[i][5]); //CODIGO BILLETE
              this[cadenaDolares + contadorPagos].push(arrayTabla[i][4]); //MONTO
              if(verificarDolares == "SI"){
                this.flagVerificar = true;
                this[cadenaDolares + contadorPagos].push(true); //FLAG DE ESTATUS
                this[cadenaDolares + contadorPagos].push(true); //FLAG DE ESPERA DE PROCESADO
              }
              else{
                this[cadenaDolares + contadorPagos].push(false); //FLAG DE ESTATUS
                this[cadenaDolares + contadorPagos].push(false); //FLAG DE ESPERA DE PROCESADO
              } 
              contadorPagos++;
            }
          }

          //ANOTAR PAGOS ZELLE

          contadorPagos = 1;
          for(let i = 0; i <= arrayTabla.length - 1; i++){
            if(arrayTabla[i][8] == "Zelle"){
              this[cadenaZelle + contadorPagos] = [];
              this[cadenaZelle + contadorPagos].push(arrayTabla[i][5]); //CODIGO
              this[cadenaZelle + contadorPagos].push(arrayTabla[i][4]); //MONTO
              if(verificarZelle == "SI"){
                this.flagVerificar = true;
                this[cadenaZelle + contadorPagos].push(true); //FLAG DE ESTATUS
                this[cadenaZelle + contadorPagos].push(true); //FLAG DE ESPERA DE PROCESADO                       
              }
              else{
                this[cadenaZelle + contadorPagos].push(false); //FLAG DE ESTATUS
                this[cadenaZelle + contadorPagos].push(false); //FLAG DE ESPERA DE PROCESADO
              } 
              contadorPagos++;
            }
          }

          contadorPagos = 1;
          for(let i = 0; i <= arrayTabla.length - 1; i++){

            if(arrayTabla[i][8] == "Abono"){
              this[cadenaAbono + contadorPagos] = [];
              this[cadenaAbono + contadorPagos].push(arrayTabla[i][2]); //CONTENEDOR DEL ABONO
              this[cadenaAbono + contadorPagos].push(arrayTabla[i][4]); //MONTO
              this[cadenaAbono + contadorPagos].push(arrayTabla[i][9]); //MONEDA
  
              contadorPagos++;

            }

          }
    }

    determinarMontoTotalVer2(montosTotalesPagados){
      let bs = false;
      let dolares = false;

      let dolaresConvertidos = 0;
      let resultado = "";

      let sumaMixta = 0;

      if(montosTotalesPagados[0] != 0) dolares = true;
      if(montosTotalesPagados[1] != 0) bs = true;

      if(dolares && bs){ //PAGO DE $ Y BS

        //PROCEDE A CONVERTIR LOS DOLARES A BS
        //LUEGO LOS SUMA
        //FINALMENTE HACE LA CADENA Y LA RETORNA

        dolaresConvertidos = productoPrecision2(this.precioDolar, montosTotalesPagados[0]);
        sumaMixta = sumaDecimal(numberAformatoMontos(dolaresConvertidos), numberAformatoMontos(montosTotalesPagados[1]));
        resultado = "Pago Total: " + numberAformatoMontos(sumaMixta) + " Bs";
        return resultado;
      }

      if(bs){ // PAGO DE BS UNICAMENTE

        //SIMPLEMENTE ARMA LA CADENA Y LA RETORNA

        resultado = "Pago Total: " + numberAformatoMontos(montosTotalesPagados[1]) + " Bs";
        return resultado;
      }
      
      if(dolares){ //PAGO DE $ UNICAMENTE

        //ARMA LA CADENA Y LA RETORNA

        resultado = "Pago Total: " + numberAformatoMontos(montosTotalesPagados[0]) + " USD";
        return resultado;
      }
    }

    sumarMontosDivisas(){
      let cadenaTransferencia = "pagoTransferencia";
      let cadenaPunto = "pagoPunto";
      let cadenaZelle = "pagoZelle";
      let cadenaEfectivoDolares = "pagoDolares";
      let cadenaEfectivo = "pagoEfectivo";
      let cadenaAbono = "pagoAbono";
      let numeroPropiedad = 1;

      let sumadorBS = 0;  //ESTA VARIABLE CONTENDRA LOS BS SUMADOS
      let sumadorUSD = 0;

      while(true){ //SUMAR BS PUNTO
        if(this.hasOwnProperty(cadenaPunto + numeroPropiedad)){ 
            sumadorBS = sumaDecimal(numberAformatoMontos(sumadorBS), this[cadenaPunto + numeroPropiedad][1]);
            numeroPropiedad++;
        }
        else break;
      }


      numeroPropiedad = 1;
      while(true){ //SUMAR BS TRANSFERENCIA
        if(this.hasOwnProperty(cadenaTransferencia + numeroPropiedad)){
          if((this[cadenaTransferencia + numeroPropiedad][4] == false) && (this[cadenaTransferencia + numeroPropiedad][5] == false)){
            sumadorBS = sumaDecimal(numberAformatoMontos(sumadorBS), this[cadenaTransferencia + numeroPropiedad][3]);
          }
          numeroPropiedad++;
        }
        else break;
      }
      numeroPropiedad = 1;


      while(true){ //SUMAR BS EFECTIVO
        if(this.hasOwnProperty(cadenaEfectivo + numeroPropiedad)){
          if(this.hasOwnProperty("precioUSDdetallado")){   
            sumadorBS = sumaDecimal(numberAformatoMontos(sumadorBS), this[cadenaEfectivo + numeroPropiedad][0]);
          }
          else{
            sumadorBS = sumaDecimal(numberAformatoMontos(sumadorBS), this[cadenaEfectivo + numeroPropiedad]);
          }
          numeroPropiedad++;
        }
        else break;
      }


      numeroPropiedad = 1;
      while(true){ //EFECTIVO DOLARES
        if(this.hasOwnProperty(cadenaEfectivoDolares + numeroPropiedad)){
          if((this[cadenaEfectivoDolares + numeroPropiedad][3] == false) && (this[cadenaEfectivoDolares + numeroPropiedad][4] == false)){
            sumadorUSD = sumaDecimal(numberAformatoMontos(sumadorUSD), this[cadenaEfectivoDolares + numeroPropiedad][2]);
          } 
          numeroPropiedad++;
        }
        else break;
      }


      numeroPropiedad = 1;
      while(true){ //ZELLE
        if(this.hasOwnProperty(cadenaZelle + numeroPropiedad)){
          if((this[cadenaZelle + numeroPropiedad][2] == false) && (this[cadenaZelle + numeroPropiedad][2] == false)){
            sumadorUSD = sumaDecimal(numberAformatoMontos(sumadorUSD), this[cadenaZelle + numeroPropiedad][1]);
          } 
          numeroPropiedad++;
        }
        else break;
      }

      numeroPropiedad = 1;
      while(true){
        if(this.hasOwnProperty(cadenaAbono + numeroPropiedad)){

          if(this[cadenaAbono + numeroPropiedad][2] == "USD"){
            sumadorUSD = sumaDecimal(numberAformatoMontos(sumadorUSD), this[cadenaAbono + numeroPropiedad][1]);
          }
          else{
            sumadorBS = sumaDecimal(numberAformatoMontos(sumadorBS), this[cadenaAbono + numeroPropiedad][1]);
          }
        }
        else break;
        numeroPropiedad++;
      }

      return [sumadorUSD, sumadorBS];
    }

    escribirCabeceraRecibo(){
      let fila;
      let tabla = document.createElement("tbody");
      let intermedio;
      let montosTotalesPagados = this.sumarMontosDivisas(); //[DOLARES, BS]

      //NOMBRE DE LA INSTITUCION
      //NOMBRE DE LA INSTITUCION
      //NOMBRE DE LA INSTITUCION

      fila = document.createElement("tr");
      intermedio = document.createElement("th");
      intermedio.className = "tdSinBorde";
      intermedio.textContent = "UNIDAD EDUCATIVA PRIVADA CRISTÓBAL ROJAS";
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);

      //RIF DE LA INSTITUCION
      //RIF DE LA INSTITUCION
      //RIF DE LA INSTITUCION

      fila = document.createElement("tr");
      intermedio = document.createElement("th");
      intermedio.className = "tdSinBorde";
      intermedio.textContent = "RIF: J-29643838-2";
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);

      //NOMBRE DEL REPRESENTANTE
      //NOMBRE DEL REPRESENTANTE
      //NOMBRE DEL REPRESENTANTE

      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Nombre Representante: " + this.nombreRepresentante; 
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);

      //CEDULA DEL REPRESENTANTE
      //CEDULA DEL REPRESENTANTE
      //CEDULA DEL REPRESENTANTE

      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Cedula Representante: " + this.cedulaRepresentante;
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);

      //CONCEPTO DE PAGO
      //CONCEPTO DE PAGO
      //CONCEPTO DE PAGO

      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Concepto de Pago: " + this.tipoDePago;
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);

      //FECHA DE EMISION DEL RECIBO
      //FECHA DE EMISION DEL RECIBO
      //FECHA DE EMISION DEL RECIBO

      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Fecha de Pago: " + this.fecha;
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);

      //NUMERO DEL RECIBO
      //NUMERO DEL RECIBO
      //NUMERO DEL RECIBO

      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Número de Recibo: " + this.IdPago;
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);

      //PAGO TOTAL
      //PAGO TOTAL
      //PAGO TOTAL

      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Pago Total: ";

      if(!(this.hasOwnProperty("version"))){ //LA OTRA OPCION ES PAGO TOTAL VER 2
        intermedio.textContent += numberAformatoMontos(this.pagoTotal) + " Bs";
        intermedio.colSpan = 4;
        fila.appendChild(intermedio);
        tabla.appendChild(fila);
        return tabla;
      }
      else{
        intermedio.textContent = this.determinarMontoTotalVer2(montosTotalesPagados);
        intermedio.colSpan = 4;
        fila.appendChild(intermedio);
        tabla.appendChild(fila);
      }

      return tabla;

    }

    escribirMetodosPago(tabla){

      //VARIABLES DE LECTURA DE PROPIEDADES
      //VARIABLES DE LECTURA DE PROPIEDADES
      //VARIABLES DE LECTURA DE PROPIEDADES

      let cadenaTransferencia = "pagoTransferencia";
      let cadenaPunto = "pagoPunto";
      let cadenaZelle = "pagoZelle";
      let cadenaEfectivoDolares = "pagoDolares";
      let cadenaEfectivo = "pagoEfectivo";
      let cadenaAbono = "pagoAbono";
      let numeroPropiedad = 1;

      //VARIABLES DE HTML
      //VARIABLES DE HTML
      //VARIABLES DE HTML

      let fila;

      let celdaEstudiante, celdaTipo, celdaMonto, celdaCurso;
      let celdaTipoPago, celdaRef, celdaMontoMetodo, celdaEstatus;

      //ESCRIBIENDO EL ENCABEZADO
      //ESCRIBIENDO EL ENCABEZADO
      //ESCRIBIENDO EL ENCABEZADO

      fila = document.createElement("tr");
      celdaEstudiante = document.createElement("th");
      celdaTipo = document.createElement("th");
      celdaMonto = document.createElement("th");
      celdaCurso = document.createElement("th");
      celdaEstudiante.textContent = "Método de Pago";
      celdaMonto.textContent = "Ref. o Código";
      celdaCurso.textContent = "Monto";
      celdaTipo.textContent = "Estatus";
      celdaCurso.className = "tdSinBorde";
      celdaTipo.className = "tdSinBorde";
      celdaEstudiante.className = "tdSinBorde";
      celdaMonto.className = "tdSinBorde";
      celdaEstudiante.style.textAlign = "center";
      celdaMonto.style.textAlign = "center";
      celdaCurso.style.textAlign = "center";
      celdaTipo.style.textAlign = "center";
      fila.appendChild(celdaEstudiante);
      fila.appendChild(celdaMonto);
      fila.appendChild(celdaCurso);
      fila.appendChild(celdaTipo);
      tabla.appendChild(fila);


      //ESCRIBIENDO LOS DATOS
      //ESCRIBIENDO LOS DATOS
      //ESCRIBIENDO LOS DATOS


      while(true){ //PUNTO
        if(this.hasOwnProperty(cadenaPunto + numeroPropiedad)){
            fila = document.createElement("tr");
            celdaTipoPago = document.createElement("td");
            celdaTipoPago.textContent = "Punto";
            celdaRef = document.createElement("td");
            celdaRef.textContent = this[cadenaPunto + numeroPropiedad][0];
            celdaMontoMetodo = document.createElement("td");
            celdaMontoMetodo.textContent = this[cadenaPunto + numeroPropiedad][1];
            celdaEstatus = document.createElement("td");
            celdaEstatus.textContent = "Aceptado";
            celdaTipoPago.className = "tdSinBorde";
            celdaRef.className = "tdSinBorde";
            celdaMontoMetodo.className = "tdSinBorde";
            celdaEstatus.className = "tdSinBorde";
            celdaTipoPago.style.textAlign = "center";
            celdaRef.style.textAlign = "center";
            celdaMontoMetodo.style.textAlign = "center";
            celdaEstatus.style.textAlign = "center";
            fila.appendChild(celdaTipoPago);
            fila.appendChild(celdaRef);
            fila.appendChild(celdaMontoMetodo);
            fila.appendChild(celdaEstatus);
            tabla.appendChild(fila);
            numeroPropiedad++;
        }
        else break;
      }

      numeroPropiedad = 1;
      while(true){ //TRANSFERENCIA
        if(this.hasOwnProperty(cadenaTransferencia + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Transferencia";
          celdaRef = document.createElement("td");
          celdaRef.textContent = this[cadenaTransferencia + numeroPropiedad][2];
          celdaMontoMetodo = document.createElement("td");
          celdaMontoMetodo.textContent = this[cadenaTransferencia + numeroPropiedad][3];
          celdaEstatus = document.createElement("td");
          if((this[cadenaTransferencia + numeroPropiedad][4] == true) && (this[cadenaTransferencia + numeroPropiedad][5] == true)){
            celdaEstatus.textContent = "En Espera";
          }
          if((this[cadenaTransferencia + numeroPropiedad][4] == true) && (this[cadenaTransferencia + numeroPropiedad][5] == false)){
            celdaEstatus.textContent = "Rechazado";
          }
          if((this[cadenaTransferencia + numeroPropiedad][4] == false) && (this[cadenaTransferencia + numeroPropiedad][5] == false)){
            celdaEstatus.textContent = "Aceptado";
          }
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          celdaTipoPago.style.textAlign = "center";
          celdaRef.style.textAlign = "center";
          celdaMontoMetodo.style.textAlign = "center";
          celdaEstatus.style.textAlign = "center";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }


      numeroPropiedad = 1;
      while(true){ //EFECTIVO
        if(this.hasOwnProperty(cadenaEfectivo + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Efectivo";
          celdaRef = document.createElement("td");
          celdaRef.textContent = "N/A";
          celdaMontoMetodo = document.createElement("td");
          if(this.hasOwnProperty("precioUSDdetallado")){
            celdaMontoMetodo.textContent = this[cadenaEfectivo + numeroPropiedad][0];
          }
          else{
            celdaMontoMetodo.textContent = this[cadenaEfectivo + numeroPropiedad];
          }
          celdaEstatus = document.createElement("td");
          celdaEstatus.textContent = "Aceptado";
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          celdaTipoPago.style.textAlign = "center";
          celdaRef.style.textAlign = "center";
          celdaMontoMetodo.style.textAlign = "center";
          celdaEstatus.style.textAlign = "center";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }

      numeroPropiedad = 1;
      while(true){ //DOLARES EFECTIVO
        if(this.hasOwnProperty(cadenaEfectivoDolares + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Dólares";
          celdaRef = document.createElement("td");
          celdaRef.textContent = this[cadenaEfectivoDolares + numeroPropiedad][1];
          celdaMontoMetodo = document.createElement("td");
          celdaMontoMetodo.textContent = this[cadenaEfectivoDolares + numeroPropiedad][0];
          celdaEstatus = document.createElement("td");
          if((this[cadenaEfectivoDolares + numeroPropiedad][3] == true) && (this[cadenaEfectivoDolares + numeroPropiedad][4] == true)){
            celdaEstatus.textContent = "En Espera";
          }
          if((this[cadenaEfectivoDolares + numeroPropiedad][3] == true) && (this[cadenaEfectivoDolares + numeroPropiedad][4] == false)){
            celdaEstatus.textContent = "Rechazado";
          }
          if((this[cadenaEfectivoDolares + numeroPropiedad][3] == false) && (this[cadenaEfectivoDolares + numeroPropiedad][4] == false)){
            celdaEstatus.textContent = "Aceptado";
          } 
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          celdaTipoPago.style.textAlign = "center";
          celdaRef.style.textAlign = "center";
          celdaMontoMetodo.style.textAlign = "center";
          celdaEstatus.style.textAlign = "center";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }

      numeroPropiedad = 1;
      while(true){ //ZELLE
        if(this.hasOwnProperty(cadenaZelle + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Zelle";
          celdaRef = document.createElement("td");
          celdaRef.textContent = this[cadenaZelle + numeroPropiedad][0];
          celdaMontoMetodo = document.createElement("td");
          celdaMontoMetodo.textContent = this[cadenaZelle + numeroPropiedad][1];
          celdaEstatus = document.createElement("td");
          if((this[cadenaZelle + numeroPropiedad][2] == true) && (this[cadenaZelle + numeroPropiedad][3] == true)){
            celdaEstatus.textContent = "En Espera";
          }
          if((this[cadenaZelle + numeroPropiedad][2] == true) && (this[cadenaZelle + numeroPropiedad][2] == false)){
            celdaEstatus.textContent = "Rechazado";
          }
          if((this[cadenaZelle + numeroPropiedad][2] == false) && (this[cadenaZelle + numeroPropiedad][2] == false)){
            celdaEstatus.textContent = "Aceptado";
          } 
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          celdaTipoPago.style.textAlign = "center";
          celdaRef.style.textAlign = "center";
          celdaMontoMetodo.style.textAlign = "center";
          celdaEstatus.style.textAlign = "center";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }
      
      numeroPropiedad = 1;
      while(true){ //ABONO
        if(this.hasOwnProperty(cadenaAbono + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Deducción Facturado";
          celdaRef = document.createElement("td");
          celdaRef.textContent = this[cadenaAbono + numeroPropiedad][0] + " (" + this[cadenaAbono + numeroPropiedad][2] + ")";
          celdaMontoMetodo = document.createElement("td");
          celdaMontoMetodo.textContent = this[cadenaAbono + numeroPropiedad][1];
          celdaEstatus = document.createElement("td");
          celdaEstatus.textContent = "Aceptado";
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          celdaTipoPago.style.textAlign = "center";
          celdaRef.style.textAlign = "center";
          celdaMontoMetodo.style.textAlign = "center";
          celdaEstatus.style.textAlign = "center";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }  

      return tabla;

    }

    escribirDetallesPagoVer2(tabla){
      let fila;
      let celdaEstudiante, celdaTipo, celdaMonto, celdaCurso;

      let montos = this.sumarMontosDivisas();

      let montoDescontar;

      let flagUSD = false;

      let numero = 1;
      let cadena;


      let montoPagoEstudiante;
      let sumadorPrueba;
    
      let convertirMonto = 0;


      //SE DETERMINA SI USAR SOLO BS O SOLO USD

      if(montos[0] != 0 && montos[1] != 0){
        montoDescontar = productoPrecision2(montos[0], this.precioDolar);
        montoDescontar = sumaDecimal(numberAformatoMontos(montoDescontar), numberAformatoMontos(montos[1]));
      }

      if(montos[0] != 0 && montos[1] == 0){
        montoDescontar = montos[0];
        flagUSD = true;
      }

      if(montos[0] == 0 && montos[1] != 0){
        montoDescontar = montos[1];
      }

      let sumadorMontos = montoDescontar;
        
      //FILA QUE CLASIFICA LOS DATOS DEL PAGO

      fila = document.createElement("tr");
      celdaEstudiante = document.createElement("th");
      celdaTipo = document.createElement("th");
      celdaMonto = document.createElement("th");
      celdaCurso = document.createElement("th");
      celdaEstudiante.textContent = "Nombre Estudiante";
      if(this.tipoDePago == "Abono"){
        celdaEstudiante.textContent = "Nombre Contenedor";
      }
      celdaMonto.textContent = "Monto";
      celdaCurso.textContent = "Curso";
      celdaCurso.className = "tdSinBorde";
      celdaTipo.className = "tdSinBorde";
      celdaEstudiante.className = "tdSinBorde";
      celdaMonto.className = "tdSinBorde";
      if(this.tipoDePago == "Inscripción"){
        celdaTipo.textContent = "Concepto";
      }
      if(this.tipoDePago == "Administrativo"){
        celdaTipo.textContent = "Concepto"; 
      }
      if(this.tipoDePago == "Mensualidad"){
        celdaTipo.textContent = "Mes";
      }
      if(this.tipoDePago == "Abono"){
        celdaTipo.textContent = "Mes";
      }
      fila.appendChild(celdaEstudiante);
      fila.appendChild(celdaTipo);
      fila.appendChild(celdaCurso);
      fila.appendChild(celdaMonto);
      tabla.appendChild(fila);

      //A PARTIR DE AQUI COMIENZA EL DIBUJADO DE LOS DETALLES


      //SUMADOR MONTOS HACE ESTO:
      //RESTA LO QUE COSTABA EL MES
      //LUEGO VE SI ES MAYOR O IGUAL A 0
      //SI NO LO ES SE LE SUMA LO QUE SE PAGO Y SE VERIFICA SI ES MAYOR O IGUAL A CERO, SI 
      //ESTA SEGUNDA COMPROBACION DA VERDADERO SE PONE LO QUE SE ABONO
      //DE LO CONTRARIO SE COLOCA 0BS


      while(true){
        cadena = "estudiante" + numero.toString();
        if(this.hasOwnProperty(cadena)){

          //AQUI SE ESCRIBEN LOS DATOS DEL PAGO DE UNA INSCRIPCION
          //ESTA PARTE DEL CODIGO NO LLEVA UN BUCLE FOR, YA QUE UN PAGO DE INSCRIPCION ES SOLO UNO POR ESTUDIANTE

          if(this.tipoDePago == "Inscripción"){
            fila = document.createElement("tr");
            celdaEstudiante = document.createElement("td");
            celdaTipo = document.createElement("td");
            celdaCurso = document.createElement("td");
            celdaMonto = document.createElement("td");
            celdaTipo.className = "tdSinBorde";
            celdaEstudiante.className = "tdSinBorde";
            celdaCurso.className = "tdSinBorde";
            celdaCurso.textContent = this["cursoEstudiante" + numero.toString()];
            celdaMonto.className = "tdSinBorde";
            celdaEstudiante.textContent = this[cadena][0]; 
            montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
            sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);

            if(flagUSD){
              if(sumadorMontos >= 0){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " USD";
              }
              else{
                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                }
                else{
                  celdaMonto.textContent = "0,00 USD";
                }
              }
            }


            //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
            //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS


            else{
              if(sumadorMontos >= 0){

                //AQUI LO QUE SE HACE ES QUE SI LA PLATA NO SE HA ACABADO
                //SE PROCEDE A CONVERTIR EL MONTO EN BS Y LUEGO SE PONE;

                convertirMonto = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
                convertirMonto = formatoMontosAnumber(convertirMonto);
                convertirMonto = productoPrecision2(convertirMonto, this.precioDolar);
                celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
              }
              else{

                //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA EL MES QUEDA ALGO
                //SI QUEDA SE PONE LO QUE QUEDO
                //SI NO QUEDA, SE PONE 0,00

                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  convertirMonto = productoPrecision2(sumadorPrueba, this.precioDolar);
                  celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                }
                else{
                  celdaMonto.textContent = "0,00 Bs";
                }
              }
            }

            celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][1]);
            fila.appendChild(celdaEstudiante);
            fila.appendChild(celdaTipo);
            fila.appendChild(celdaCurso);
            fila.appendChild(celdaMonto);
            tabla.appendChild(fila);     
          }

          //AQUI SI SE INCLUYO UN BUCLE PARA RECORRER TODOS LOS PAGOS DEL ESTUDIANTE
          //AL IGUAL QUE MENSUALIDAD, ADMINISTRATIVO SE DEJO EN UN BUCLE APARTE PARA NO
          //CONFUNDIR CON EL CODIGO, UNA PARTE PARA CADA COSA Y NO UNA QUE HACE VARIAS COSAS

          if(this.tipoDePago == "Mensualidad"){
            for(let i = 1; i <= this[cadena].length - 1; i++){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = this["cursoEstudiante" + numero];
              montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]);

              //ESCRIBIR LOS MONTOS EN BS

            if(flagUSD){
              if(sumadorMontos >= 0){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]) + " USD";
              }
              else{
                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                }
                else{
                  celdaMonto.textContent = "0,00 USD";
                }
              }
            }


            //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
            //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS
            

            else{
              if(sumadorMontos >= 0){

                //AQUI LO QUE SE HACE ES QUE SI LA PLATA NO SE HA ACABADO
                //SE PROCEDE A CONVERTIR EL MONTO EN BS Y LUEGO SE PONE;

                convertirMonto = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]);
                convertirMonto = formatoMontosAnumber(convertirMonto);
                convertirMonto = productoPrecision2(convertirMonto, this.precioDolar);
                celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
              }
              else{

                //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA EL MES QUEDA ALGO
                //SI QUEDA SE PONE LO QUE QUEDO
                //SI NO QUEDA, SE PONE 0,00

                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  convertirMonto = productoPrecision2(sumadorPrueba, this.precioDolar);
                  celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                }
                else{
                  celdaMonto.textContent = "0,00 Bs";
                }
              }
            }


              celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][i]);
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
            }
          }


          if(this.tipoDePago == "Administrativo"){
            for(let i = 1; i <= this[cadena].length - 1; i++){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = "N/A";
              montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]);
              sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);


              if(flagUSD){
                if(sumadorMontos >= 0){
                  celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " USD";
                }
                else{
                  sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                  if(sumadorPrueba >= 0){
                    celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                  }
                  else{
                    celdaMonto.textContent = "0,00 USD";
                  }
                }
              }
  
  
              //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
              //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS
              
  
              else{
                if(sumadorMontos >= 0){
  
                  //AQUI LO QUE SE HACE ES QUE SI LA PLATA NO SE HA ACABADO
                  //SE PROCEDE A CONVERTIR EL MONTO EN BS Y LUEGO SE PONE;
  
                  convertirMonto = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
                  convertirMonto = formatoMontosAnumber(convertirMonto);
                  convertirMonto = productoPrecision2(convertirMonto, this.precioDolar);
                  celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                }
                else{
  
                  //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA EL MES QUEDA ALGO
                  //SI QUEDA SE PONE LO QUE QUEDO
                  //SI NO QUEDA, SE PONE 0,00
  
                  sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                  if(sumadorPrueba >= 0){
                    convertirMonto = productoPrecision2(sumadorPrueba, this.precioDolar);
                    celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                  }
                  else{
                    celdaMonto.textContent = "0,00 Bs";
                  }
                }
              }
  
              celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][i]);
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
            }
          }

        }
        else{
          break;
        }
        numero++;
      }

      if(this.tipoDePago == "Abono"){
        while(true){
          cadena = "abono" + numero.toString();
          if(this.hasOwnProperty(cadena)){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = "N/A";
  
              if(this[cadena][2] == "USD"){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " USD";
              }
              else{
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " BS";
              }
  
  
              celdaTipo.textContent = "N/A";
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
          }
          else break;
          numero++;
        }
        
      }

      return tabla;
    }

    escribirDetallesPagoVer3(tabla){
      let fila;
      let celdaEstudiante, celdaTipo, celdaMonto, celdaCurso;

      let obtenerPrecioDolar;
      let obtenerPrecioDelProceso;

      let montos = this.sumarMontosDivisas();
      let montoDescontar;

      let flagUSD = false;

      let numero = 1;
      let cadena;


      let montoPagoEstudiante;
      let sumadorPrueba;
    
      let convertirMonto = 0;


      //SE DETERMINA SI USAR SOLO BS O SOLO USD

      if(montos[0] != 0 && montos[1] != 0){
        montoDescontar = productoPrecision2(montos[0], this.precioDolar);
        montoDescontar = sumaDecimal(numberAformatoMontos(montoDescontar), numberAformatoMontos(montos[1]));
      }

      if(montos[0] != 0 && montos[1] == 0){
        montoDescontar = montos[0];
        flagUSD = true;
      }

      if(montos[0] == 0 && montos[1] != 0){
        montoDescontar = montos[1];
      }

      let sumadorMontos = montoDescontar;
        
      //FILA QUE CLASIFICA LOS DATOS DEL PAGO

      fila = document.createElement("tr");
      celdaEstudiante = document.createElement("th");
      celdaTipo = document.createElement("th");
      celdaMonto = document.createElement("th");
      celdaCurso = document.createElement("th");
      celdaEstudiante.textContent = "Nombre Estudiante";
      if(this.tipoDePago == "Abono"){
        celdaEstudiante.textContent = "Nombre Contenedor";
      }
      celdaMonto.textContent = "Monto";
      celdaCurso.textContent = "Curso";
      celdaCurso.className = "tdSinBorde";
      celdaTipo.className = "tdSinBorde";
      celdaEstudiante.className = "tdSinBorde";
      celdaMonto.className = "tdSinBorde";
      if(this.tipoDePago == "Inscripción"){
        celdaTipo.textContent = "Concepto";
      }
      if(this.tipoDePago == "Administrativo"){
        celdaTipo.textContent = "Concepto"; 
      }
      if(this.tipoDePago == "Mensualidad"){
        celdaTipo.textContent = "Mes";
      }
      if(this.tipoDePago == "Abono"){
        celdaTipo.textContent = "Mes";
      }
      fila.appendChild(celdaEstudiante);
      fila.appendChild(celdaTipo);
      fila.appendChild(celdaCurso);
      fila.appendChild(celdaMonto);
      tabla.appendChild(fila);

      //A PARTIR DE AQUI COMIENZA EL DIBUJADO DE LOS DETALLES


      //SUMADOR MONTOS HACE ESTO:
      //RESTA LO QUE COSTABA EL MES
      //LUEGO VE SI ES MAYOR O IGUAL A 0
      //SI NO LO ES SE LE SUMA LO QUE SE PAGO Y SE VERIFICA SI ES MAYOR O IGUAL A CERO, SI 
      //ESTA SEGUNDA COMPROBACION DA VERDADERO SE PONE LO QUE SE ABONO
      //DE LO CONTRARIO SE COLOCA 0BS


      while(true){
        cadena = "estudiante" + numero.toString();
        if(this.hasOwnProperty(cadena)){

          //AQUI SE ESCRIBEN LOS DATOS DEL PAGO DE UNA INSCRIPCION
          //ESTA PARTE DEL CODIGO NO LLEVA UN BUCLE FOR, YA QUE UN PAGO DE INSCRIPCION ES SOLO UNO POR ESTUDIANTE

          if(this.tipoDePago == "Inscripción"){
            fila = document.createElement("tr");
            celdaEstudiante = document.createElement("td");
            celdaTipo = document.createElement("td");
            celdaCurso = document.createElement("td");
            celdaMonto = document.createElement("td");
            celdaTipo.className = "tdSinBorde";
            celdaEstudiante.className = "tdSinBorde";
            celdaCurso.className = "tdSinBorde";
            celdaCurso.textContent = this["cursoEstudiante" + numero.toString()];
            celdaMonto.className = "tdSinBorde";
            celdaEstudiante.textContent = this[cadena][0]; 
            montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
            sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);

            if(flagUSD){
              if(sumadorMontos >= 0){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " USD";
              }
              else{
                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                }
                else{
                  celdaMonto.textContent = "0,00 USD";
                }
              }
            }


            //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
            //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS


            else{
              if(sumadorMontos >= 0){

                //AQUI LO QUE SE HACE ES QUE SI LA PLATA NO SE HA ACABADO
                //SE PROCEDE A CONVERTIR EL MONTO EN BS Y LUEGO SE PONE;

                convertirMonto = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
                convertirMonto = formatoMontosAnumber(convertirMonto);
                convertirMonto = productoPrecision2(convertirMonto, this.precioDolar);
                celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
              }
              else{

                //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA EL MES QUEDA ALGO
                //SI QUEDA SE PONE LO QUE QUEDO
                //SI NO QUEDA, SE PONE 0,00

                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  convertirMonto = productoPrecision2(sumadorPrueba, this.precioDolar);
                  celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                }
                else{
                  celdaMonto.textContent = "0,00 Bs";
                }
              }
            }

            celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][1]);
            fila.appendChild(celdaEstudiante);
            fila.appendChild(celdaTipo);
            fila.appendChild(celdaCurso);
            fila.appendChild(celdaMonto);
            tabla.appendChild(fila);     
          }

          //AQUI SI SE INCLUYO UN BUCLE PARA RECORRER TODOS LOS PAGOS DEL ESTUDIANTE
          //AL IGUAL QUE MENSUALIDAD, ADMINISTRATIVO SE DEJO EN UN BUCLE APARTE PARA NO
          //CONFUNDIR CON EL CODIGO, UNA PARTE PARA CADA COSA Y NO UNA QUE HACE VARIAS COSAS

          if(this.tipoDePago == "Mensualidad"){
            for(let i = 1; i <= this[cadena].length - 1; i++){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = this["cursoEstudiante" + numero];
              obtenerPrecioDolar = this[cadena][i].split("-");
              obtenerPrecioDelProceso = obtenerPrecioDolar[0];
              obtenerPrecioDolar = formatoMontosAnumber(obtenerPrecioDolar[1]);
              montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(obtenerPrecioDelProceso);

              //ESCRIBIR LOS MONTOS EN BS

            if(flagUSD){
              if(sumadorMontos >= 0){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(obtenerPrecioDelProceso) + " USD";
              }
              else{
                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                }
                else{
                  celdaMonto.textContent = "0,00 USD";
                }
              }
            }


            //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
            //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS
            

            else{
              if(sumadorMontos >= 0){

                //AQUI LO QUE SE HACE ES QUE SI LA PLATA NO SE HA ACABADO
                //SE PROCEDE A CONVERTIR EL MONTO EN BS Y LUEGO SE PONE;

                convertirMonto = extraerNumerosPuntosComasDeUnaCadena(obtenerPrecioDelProceso);
                convertirMonto = formatoMontosAnumber(convertirMonto);
                convertirMonto = productoPrecision2(convertirMonto, obtenerPrecioDolar);
                celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
              }
              else{

                //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA EL MES QUEDA ALGO
                //SI QUEDA SE PONE LO QUE QUEDO
                //SI NO QUEDA, SE PONE 0,00

                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  convertirMonto = productoPrecision2(sumadorPrueba, obtenerPrecioDolar);
                  celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                }
                else{
                  celdaMonto.textContent = "0,00 Bs";
                }
              }
            }


              celdaTipo.textContent = extraerLetrasDeUnaCadena(obtenerPrecioDelProceso);
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
            }
          }


          if(this.tipoDePago == "Administrativo"){
            for(let i = 1; i <= this[cadena].length - 1; i++){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = "N/A";
              montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]);
              sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);


              if(flagUSD){
                if(sumadorMontos >= 0){
                  celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " USD";
                }
                else{
                  sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                  if(sumadorPrueba >= 0){
                    celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                  }
                  else{
                    celdaMonto.textContent = "0,00 USD";
                  }
                }
              }
  
  
              //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
              //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS
              
  
              else{
                if(sumadorMontos >= 0){
  
                  //AQUI LO QUE SE HACE ES QUE SI LA PLATA NO SE HA ACABADO
                  //SE PROCEDE A CONVERTIR EL MONTO EN BS Y LUEGO SE PONE;
  
                  convertirMonto = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
                  convertirMonto = formatoMontosAnumber(convertirMonto);
                  convertirMonto = productoPrecision2(convertirMonto, this.precioDolar);
                  celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                }
                else{
  
                  //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA EL MES QUEDA ALGO
                  //SI QUEDA SE PONE LO QUE QUEDO
                  //SI NO QUEDA, SE PONE 0,00
  
                  sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                  if(sumadorPrueba >= 0){
                    convertirMonto = productoPrecision2(sumadorPrueba, this.precioDolar);
                    celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                  }
                  else{
                    celdaMonto.textContent = "0,00 Bs";
                  }
                }
              }
  
              celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][i]);
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
            }
          }

        }
        else{
          break;
        }
        numero++;
      }

      if(this.tipoDePago == "Abono"){
        while(true){
          cadena = "abono" + numero.toString();
          if(this.hasOwnProperty(cadena)){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = "N/A";
  
              if(this[cadena][2] == "USD"){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " USD";
              }
              else{
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " BS";
              }
  
  
              celdaTipo.textContent = "N/A";
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
          }
          else break;
          numero++;
        }
        
      }

      return tabla;
    }

    escribirDetallesPagoVer4(tabla){
      let fila;
      let celdaEstudiante, celdaTipo, celdaMonto, celdaCurso;

      let obtenerPrecioDolar;
      let obtenerPrecioDelProceso;

      let montos = this.sumarMontosDivisas();
      let montoDescontar;

      let flagUSD = false;

      let numero = 1;
      let cadena;


      let montoPagoEstudiante;
      let sumadorPrueba;
    
      let convertirMonto = 0;

      let obtenerMontoDolares;
      let obtenerMontoBolivares;


      //SE DETERMINA SI USAR SOLO BS O SOLO USD

      if(montos[0] != 0 && montos[1] != 0){
        montoDescontar = productoPrecision2(montos[0], this.precioDolar);
        montoDescontar = sumaDecimal(numberAformatoMontos(montoDescontar), numberAformatoMontos(montos[1]));
      }

      if(montos[0] != 0 && montos[1] == 0){
        montoDescontar = montos[0];
        flagUSD = true;
      }

      if(montos[0] == 0 && montos[1] != 0){
        montoDescontar = montos[1];
      }

      let sumadorMontos = montoDescontar;
        
      //FILA QUE CLASIFICA LOS DATOS DEL PAGO

      fila = document.createElement("tr");
      celdaEstudiante = document.createElement("th");
      celdaTipo = document.createElement("th");
      celdaMonto = document.createElement("th");
      celdaCurso = document.createElement("th");
      celdaEstudiante.textContent = "Nombre Estudiante";
      if(this.tipoDePago == "Abono"){
        celdaEstudiante.textContent = "Nombre Contenedor";
      }
      celdaMonto.textContent = "Monto";
      celdaCurso.textContent = "Curso";
      celdaCurso.className = "tdSinBorde";
      celdaTipo.className = "tdSinBorde";
      celdaEstudiante.className = "tdSinBorde";
      celdaMonto.className = "tdSinBorde";
      if(this.tipoDePago == "Inscripción"){
        celdaTipo.textContent = "Concepto";
      }
      if(this.tipoDePago == "Administrativo"){
        celdaTipo.textContent = "Concepto"; 
      }
      if(this.tipoDePago == "Mensualidad"){
        celdaTipo.textContent = "Mes";
      }
      if(this.tipoDePago == "Abono"){
        celdaTipo.textContent = "Mes";
      }
      fila.appendChild(celdaEstudiante);
      fila.appendChild(celdaTipo);
      fila.appendChild(celdaCurso);
      fila.appendChild(celdaMonto);
      tabla.appendChild(fila);

      //A PARTIR DE AQUI COMIENZA EL DIBUJADO DE LOS DETALLES


      //SUMADOR MONTOS HACE ESTO:
      //RESTA LO QUE COSTABA EL MES
      //LUEGO VE SI ES MAYOR O IGUAL A 0
      //SI NO LO ES SE LE SUMA LO QUE SE PAGO Y SE VERIFICA SI ES MAYOR O IGUAL A CERO, SI 
      //ESTA SEGUNDA COMPROBACION DA VERDADERO SE PONE LO QUE SE ABONO
      //DE LO CONTRARIO SE COLOCA 0BS


      while(true){
        cadena = "estudiante" + numero.toString();
        if(this.hasOwnProperty(cadena)){

          //AQUI SE ESCRIBEN LOS DATOS DEL PAGO DE UNA INSCRIPCION
          //ESTA PARTE DEL CODIGO NO LLEVA UN BUCLE FOR, YA QUE UN PAGO DE INSCRIPCION ES SOLO UNO POR ESTUDIANTE

          if(this.tipoDePago == "Inscripción"){
            fila = document.createElement("tr");
            celdaEstudiante = document.createElement("td");
            celdaTipo = document.createElement("td");
            celdaCurso = document.createElement("td");
            celdaMonto = document.createElement("td");
            celdaTipo.className = "tdSinBorde";
            celdaEstudiante.className = "tdSinBorde";
            celdaCurso.className = "tdSinBorde";
            celdaCurso.textContent = this["cursoEstudiante" + numero.toString()];
            celdaMonto.className = "tdSinBorde";
            celdaEstudiante.textContent = this[cadena][0]; 
            montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
            sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);

            if(flagUSD){
              if(sumadorMontos >= 0){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " USD";
              }
              else{
                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                }
                else{
                  celdaMonto.textContent = "0,00 USD";
                }
              }
            }


            //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
            //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS


            else{
              if(sumadorMontos >= 0){

                //AQUI LO QUE SE HACE ES QUE SI LA PLATA NO SE HA ACABADO
                //SE PROCEDE A CONVERTIR EL MONTO EN BS Y LUEGO SE PONE;

                convertirMonto = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
                convertirMonto = formatoMontosAnumber(convertirMonto);
                convertirMonto = productoPrecision2(convertirMonto, this.precioDolar);
                celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
              }
              else{

                //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA EL MES QUEDA ALGO
                //SI QUEDA SE PONE LO QUE QUEDO
                //SI NO QUEDA, SE PONE 0,00

                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  convertirMonto = productoPrecision2(sumadorPrueba, this.precioDolar);
                  celdaMonto.textContent = numberAformatoMontos(convertirMonto) + " Bs";
                }
                else{
                  celdaMonto.textContent = "0,00 Bs";
                }
              }
            }

            celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][1]);
            fila.appendChild(celdaEstudiante);
            fila.appendChild(celdaTipo);
            fila.appendChild(celdaCurso);
            fila.appendChild(celdaMonto);
            tabla.appendChild(fila);     
          }

          //AQUI SI SE INCLUYO UN BUCLE PARA RECORRER TODOS LOS PAGOS DEL ESTUDIANTE
          //AL IGUAL QUE MENSUALIDAD, ADMINISTRATIVO SE DEJO EN UN BUCLE APARTE PARA NO
          //CONFUNDIR CON EL CODIGO, UNA PARTE PARA CADA COSA Y NO UNA QUE HACE VARIAS COSAS

          if(this.tipoDePago == "Mensualidad"){
            for(let i = 1; i <= this[cadena].length - 1; i++){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = this["cursoEstudiante" + numero];

              if(flagUSD){ //REALIZA LA RESTA PARA VER CUANTO QUEDÓ
                obtenerMontoDolares = this[cadena][i];
                obtenerMontoDolares = obtenerMontoDolares.split("-");
                celdaTipo.textContent = obtenerMontoDolares[0];
                obtenerMontoDolares = obtenerMontoDolares[1];
                sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), obtenerMontoDolares);
              }
              else{ //LO MISMO PERO EN BS

                obtenerMontoBolivares = this[cadena][i];
                obtenerMontoBolivares = obtenerMontoBolivares.split("-");
                celdaTipo.textContent = obtenerMontoBolivares[0];
                obtenerMontoBolivares = obtenerMontoBolivares[2];
                sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), obtenerMontoBolivares);

              }

              //ESCRIBIR LOS MONTOS EN BS

            if(flagUSD){
              if(sumadorMontos >= 0){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(obtenerMontoDolares) + " USD";
              }
              else{
                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), obtenerMontoDolares);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                }
                else{
                  celdaMonto.textContent = "0,00 USD";
                }
              }
            }


            //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
            //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS
            

            else{
              if(sumadorMontos >= 0){

                //AQUI LO QUE SE HACE ES QUE SI LA PLATA NO SE HA ACABADO
                //SE PROCEDE A CONVERTIR EL MONTO EN BS Y LUEGO SE PONE;

                celdaMonto.textContent = obtenerMontoBolivares + " Bs";
              }
              else{

                //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA EL MES QUEDA ALGO
                //SI QUEDA SE PONE LO QUE QUEDO
                //SI NO QUEDA, SE PONE 0,00

                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), obtenerMontoBolivares);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " Bs";
                }
                else{
                  celdaMonto.textContent = "0,00 Bs";
                }
              }
            }

              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
            }
          }


          if(this.tipoDePago == "Administrativo"){
            for(let i = 1; i <= this[cadena].length - 1; i++){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = "N/A";

              if(flagUSD){ //REALIZA LA RESTA PARA VER CUANTO QUEDÓ
                obtenerMontoDolares = this[cadena][1];
                obtenerMontoDolares = obtenerMontoDolares.split("-");
                obtenerMontoDolares = obtenerMontoDolares[1];
                sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), obtenerMontoDolares);
              }
              else{ //LO MISMO PERO EN BS

                obtenerMontoBolivares = this[cadena][1];
                obtenerMontoBolivares = obtenerMontoBolivares.split("-");
                obtenerMontoBolivares = obtenerMontoBolivares[2];
                sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), obtenerMontoBolivares);

              }

              if(flagUSD){
                if(sumadorMontos >= 0){
                  celdaMonto.textContent = obtenerMontoDolares + " USD";
                }
                else{
                  sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), obtenerMontoDolares);
                  if(sumadorPrueba >= 0){
                    celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " USD";
                  }
                  else{
                    celdaMonto.textContent = "0,00 USD";
                  }
                }
              }
  
  
              //ESTO DE AQUI ABAJO ES POR SI NO ES DOLARES
              //LA MONEDA EN LA QUE SE VAN A MOSTRAR LOS PRECIOS
              
  
              else{
                if(sumadorMontos >= 0){
                  celdaMonto.textContent = obtenerMontoBolivares + " Bs";
                }
                else{
  
                  //SE ACABO LA PLATA, SE PROCEDE A VER SI AL SUMAR LO QUE COSTABA
                  //SI QUEDA SE PONE LO QUE QUEDO
                  //SI NO QUEDA, SE PONE 0,00
  
                  sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), obtenerMontoBolivares);
                  if(sumadorPrueba >= 0){
                    celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " Bs";
                  }
                  else{
                    celdaMonto.textContent = "0,00 Bs";
                  }
                }
              }
  
              celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][i]);
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
            }
          }

        }
        else{
          break;
        }
        numero++;
      }

      if(this.tipoDePago == "Abono"){
        while(true){
          cadena = "abono" + numero.toString();
          if(this.hasOwnProperty(cadena)){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = "N/A";
  
              if(this[cadena][2] == "USD"){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " USD";
              }
              else{
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " BS";
              }
  
  
              celdaTipo.textContent = "N/A";
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
          }
          else break;
          numero++;
        }
        
      }

      return tabla;
    }


    escribirReciboVer2(tablaMaestra){

      let tabla = this.escribirCabeceraRecibo();
      tabla = this.escribirMetodosPago(tabla);

      if(this.version == 3) tabla = this.escribirDetallesPagoVer3(tabla);
      if(this.version == 2) tabla = this.escribirDetallesPagoVer2(tabla);
      if(this.version == 4) tabla = this.escribirDetallesPagoVer4(tabla);

      tablaMaestra.appendChild(tabla);
    }
    
    escribirReciboVer5(tabla){

      //ENCABEZADO NOMBRE INSTITUCION
      //ENCABEZADO NOMBRE INSTITUCION
      //ENCABEZADO NOMBRE INSTITUCION

      let tbody = document.createElement("tbody");


      let col1 = crearCeldaConTexto("UNIDAD EDUCATIVA CRISTÓBAL ROJAS");
      col1.style.fontWeight = "bold";
      col1.style.textAlign = "center";
      col1.className = "tdSinBorde";
      col1.colSpan = 4;

      let fila = document.createElement("tr");
      fila.appendChild(col1);

      tbody.appendChild(fila);

      ///ENCABEZADO RIF
      ///ENCABEZADO RIF
      ///ENCABEZADO RIF

      col1 = crearCeldaConTexto("RIF: J-29643838-2");
      col1.colSpan = 4;
      col1.className = "tdSinBorde";
      col1.style.fontWeight = "bold";
      col1.style.textAlign = "center";

      fila = document.createElement("tr");
      fila.appendChild(col1);

      tbody.appendChild(fila);

      //NOMBRE REPRESENTANTE
      //NOMBRE REPRESENTANTE
      //NOMBRE REPRESENTANTE

      col1 = crearCeldaConTexto("Nombre Representante: " + this.nombreRepresentante);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //CEDULA REPRESENTANTE
      //CEDULA REPRESENTANTE
      //CEDULA REPRESENTANTE

      col1 = crearCeldaConTexto("Cedula Representante: " + this.cedulaRepresentante);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //CONCEPTO DE PAGO
      //CONCEPTO DE PAGO
      //CONCEPTO DE PAGO

      col1 = crearCeldaConTexto("Concepto de Pago: " + this.tipoDePago);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //FECHA DE PAGO
      //FECHA DE PAGO
      //FECHA DE PAGO

      col1 = crearCeldaConTexto("Fecha de Pago: " + this.fecha);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //NUMERO RECIBO
      //NUMERO RECIBO
      //NUMERO RECIBO

      col1 = crearCeldaConTexto("Número de Recibo: " + this.IdPago);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //PAGO TOTAL
      //PAGO TOTAL
      //PAGO TOTAL

      col1 = crearCeldaConTexto("Pago Total: " + numberAformatoMontos(this.total));
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //COLUMNAS DE LA TABLA (METODOS)
      //COLUMNAS DE LA TABLA (METODOS)
      //COLUMNAS DE LA TABLA (METODOS)
      //COLUMNAS DE LA TABLA (METODOS)

      tbody = this.escribirMetodosPago(tbody);

      //COLUMNAS DETALLES (ESTUDIANTES)
      //COLUMNAS DETALLES (ESTUDIANTES)
      //COLUMNAS DETALLES (ESTUDIANTES)

      let arrayFila = [];
      
      col1 = crearCeldaConTexto("Nombre Estudiante");

      let col2 = crearCeldaConTexto("Concepto");
      let col3 = crearCeldaConTexto("Curso");
      let col4 = crearCeldaConTexto("Monto");

      col1.style.textAlign = "center";
      col2.style.textAlign = "center";
      col3.style.textAlign = "center";
      col4.style.textAlign = "center";
      col1.style.fontWeight = "bold";
      col2.style.fontWeight = "bold";
      col3.style.fontWeight = "bold";
      col4.style.fontWeight = "bold";
      col1.className = "tdSinBorde";
      col2.className = "tdSinBorde";
      col3.className = "tdSinBorde";
      col4.className = "tdSinBorde";


      arrayFila.push(col1);
      arrayFila.push(col2);
      arrayFila.push(col3);
      arrayFila.push(col4);

      tbody.appendChild(crearTRconCeldasApendadas(arrayFila));

      //DATOS DE LOS ESTUDIANTES
      //DATOS DE LOS ESTUDIANTES
      //DATOS DE LOS ESTUDIANTES


      let contadorConceptos = 1;

      let sumaDivisas = this.sumarMontosDivisas();

      let flagBS = false;
      let flagUSD = false;

      if(sumaDivisas[0] > 0) flagUSD = true;
      if(sumaDivisas[1] > 0) flagBS = true;

      if(flagUSD && flagBS) flagUSD = false;

      while(true){

        if(this.hasOwnProperty("concepto" + contadorConceptos)){

          debugger;

          col1 = crearCeldaConTexto(this["concepto" + contadorConceptos][0]);
          col2 = crearCeldaConTexto(this["concepto" + contadorConceptos][1]);
          col3 = crearCeldaConTexto(this["concepto" + contadorConceptos][2]);

          if(flagUSD){

            col4 = crearCeldaConTexto((this["concepto" + contadorConceptos][3]) + " USD");

          }

          if(flagBS){

            col4 = crearCeldaConTexto((this["concepto" + contadorConceptos][4]) + " BS");

          }

          if(this["concepto" + contadorConceptos][4] == "N/A") col4 = crearCeldaConTexto((this["concepto" + contadorConceptos][3]) + " USD");
          if(this["concepto" + contadorConceptos][3] == "N/A") col4 = crearCeldaConTexto((this["concepto" + contadorConceptos][4]) + " BS");

          col1.className = "tdSinBorde";
          col2.className = "tdSinBorde";
          col3.className = "tdSinBorde";
          col4.className = "tdSinBorde";
          col1.style.textAlign = "center";
          col2.style.textAlign = "center";
          col3.style.textAlign = "center";
          col4.style.textAlign = "center";

          arrayFila = [];
          arrayFila.push(col1);
          arrayFila.push(col2);
          arrayFila.push(col3);
          arrayFila.push(col4);

          tbody.appendChild(crearTRconCeldasApendadas(arrayFila));

          contadorConceptos++;

        }

        else break;

      }

      tabla.appendChild(tbody);
    }

    escribirReciboVer1(tablaMaestra){
      let fila;
      let cadenaTransferencia = "pagoTransferencia";
      let cadenaPunto = "pagoPunto";
      let cadenaZelle = "pagoZelle";
      let cadenaEfectivoDolares = "pagoDolares";
      let cadenaEfectivo = "pagoEfectivo";
      let numeroPropiedad = 1;
      let sumadorMontos = 0;
      let montoPagoEstudiante;
      let sumadorPrueba;
      let tabla = document.createElement("tbody");
      tablaMaestra.appendChild(tabla);
      let celdaEstudiante, celdaTipo, celdaMonto, celdaCurso;
      let intermedio;
      let celdaTipoPago, celdaRef, celdaMontoMetodo, celdaEstatus;

      //CABECERA DEL RECIBO

      fila = document.createElement("tr");
      intermedio = document.createElement("th");
      intermedio.className = "tdSinBorde";
      intermedio.textContent = "UNIDAD EDUCATIVA PRIVADA CRISTÓBAL ROJAS";
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);
      fila = document.createElement("tr");
      intermedio = document.createElement("th");
      intermedio.className = "tdSinBorde";
      intermedio.textContent = "RIF: J-29643838-2";
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);
      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Nombre Representante: " + this.nombreRepresentante; 
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);
      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Cedula Representante: " + this.cedulaRepresentante;
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);
      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Concepto de Pago: " + this.tipoDePago;
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);
      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Fecha de Pago: " + this.fecha;
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);
      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Número de Recibo: " + this.IdPago;
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);
      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Pago Total: " + numberAformatoMontos(this.total) + " Bs";
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);
      fila = document.createElement("tr");
      intermedio = document.createElement("td");
      intermedio.classList.add("tablaColspan", "tdSinBorde");
      intermedio.textContent = "Tipo de Pago: ";
      if(this.reciboTieneAbono == true){
        intermedio.textContent += "Abono"; 
      }
      if(this.reciboTieneAbono == false){
        intermedio.textContent += "Completo"; 
      }
      intermedio.colSpan = 4;
      fila.appendChild(intermedio);
      tabla.appendChild(fila);

      //SEGMENTO DE METODOS DE PAGO

      fila = document.createElement("tr");
      celdaEstudiante = document.createElement("th");
      celdaTipo = document.createElement("th");
      celdaMonto = document.createElement("th");
      celdaCurso = document.createElement("th");
      celdaEstudiante.textContent = "Método de Pago";
      celdaMonto.textContent = "Ref. o Código";
      celdaCurso.textContent = "Monto";
      celdaTipo.textContent = "Estatus";
      celdaCurso.className = "tdSinBorde";
      celdaTipo.className = "tdSinBorde";
      celdaEstudiante.className = "tdSinBorde";
      celdaMonto.className = "tdSinBorde";
      fila.appendChild(celdaEstudiante);
      fila.appendChild(celdaMonto);
      fila.appendChild(celdaCurso);
      fila.appendChild(celdaTipo);
      tabla.appendChild(fila);
      while(true){
        if(this.hasOwnProperty(cadenaPunto + numeroPropiedad)){
            fila = document.createElement("tr");
            celdaTipoPago = document.createElement("td");
            celdaTipoPago.textContent = "Punto";
            celdaRef = document.createElement("td");
            celdaRef.textContent = this[cadenaPunto + numeroPropiedad][0];
            celdaMontoMetodo = document.createElement("td");
            celdaMontoMetodo.textContent = this[cadenaPunto + numeroPropiedad][1];
            sumadorMontos = sumaDecimal(numberAformatoMontos(sumadorMontos), this[cadenaPunto + numeroPropiedad][1]);
            celdaEstatus = document.createElement("td");
            celdaEstatus.textContent = "Aceptado";
            celdaTipoPago.className = "tdSinBorde";
            celdaRef.className = "tdSinBorde";
            celdaMontoMetodo.className = "tdSinBorde";
            celdaEstatus.className = "tdSinBorde";
            fila.appendChild(celdaTipoPago);
            fila.appendChild(celdaRef);
            fila.appendChild(celdaMontoMetodo);
            fila.appendChild(celdaEstatus);
            tabla.appendChild(fila);
            numeroPropiedad++;
        }
        else break;
      }
      numeroPropiedad = 1;
      while(true){
        if(this.hasOwnProperty(cadenaTransferencia + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Transferencia";
          celdaRef = document.createElement("td");
          celdaRef.textContent = this[cadenaTransferencia + numeroPropiedad][2];
          celdaMontoMetodo = document.createElement("td");
          celdaMontoMetodo.textContent = this[cadenaTransferencia + numeroPropiedad][3];
          celdaEstatus = document.createElement("td");
          if((this[cadenaTransferencia + numeroPropiedad][4] == true) && (this[cadenaTransferencia + numeroPropiedad][5] == true)){
            celdaEstatus.textContent = "En Espera";
          }
          if((this[cadenaTransferencia + numeroPropiedad][4] == true) && (this[cadenaTransferencia + numeroPropiedad][5] == false)){
            celdaEstatus.textContent = "Rechazado";
          }
          if((this[cadenaTransferencia + numeroPropiedad][4] == false) && (this[cadenaTransferencia + numeroPropiedad][5] == false)){
            celdaEstatus.textContent = "Aceptado";
            sumadorMontos = sumaDecimal(numberAformatoMontos(sumadorMontos), this[cadenaTransferencia + numeroPropiedad][3]);
          }
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }
      numeroPropiedad = 1;
      while(true){
        if(this.hasOwnProperty(cadenaEfectivo + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Efectivo";
          celdaRef = document.createElement("td");
          celdaRef.textContent = "N/A";
          celdaMontoMetodo = document.createElement("td");
          celdaMontoMetodo.textContent = this[cadenaEfectivo + numeroPropiedad];
          sumadorMontos = sumaDecimal(numberAformatoMontos(sumadorMontos), this[cadenaEfectivo + numeroPropiedad]);
          celdaEstatus = document.createElement("td");
          celdaEstatus.textContent = "Aceptado";
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }
      numeroPropiedad = 1;
      while(true){ //FALTA ESTE QUE ES DE DOLARES EFECTIVO Y EL DE ZELLE
        if(this.hasOwnProperty(cadenaEfectivoDolares + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Dólares";
          celdaRef = document.createElement("td");
          celdaRef.textContent = this[cadenaEfectivoDolares + numeroPropiedad][1];
          celdaMontoMetodo = document.createElement("td");
          celdaMontoMetodo.textContent = this[cadenaEfectivoDolares + numeroPropiedad][2] + " (" + this[cadenaEfectivoDolares + numeroPropiedad][0] + ")";
          celdaEstatus = document.createElement("td");
          if((this[cadenaEfectivoDolares + numeroPropiedad][3] == true) && (this[cadenaEfectivoDolares + numeroPropiedad][4] == true)){
            celdaEstatus.textContent = "En Espera";
          }
          if((this[cadenaEfectivoDolares + numeroPropiedad][3] == true) && (this[cadenaEfectivoDolares + numeroPropiedad][4] == false)){
            celdaEstatus.textContent = "Rechazado";
          }
          if((this[cadenaEfectivoDolares + numeroPropiedad][3] == false) && (this[cadenaEfectivoDolares + numeroPropiedad][4] == false)){
            celdaEstatus.textContent = "Aceptado";
            sumadorMontos = sumaDecimal(numberAformatoMontos(sumadorMontos), this[cadenaEfectivoDolares + numeroPropiedad][2]);
          } 
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }
      numeroPropiedad = 1;
      while(true){ //FALTA ESTE QUE ES DE DOLARES EFECTIVO Y EL DE ZELLE
        if(this.hasOwnProperty(cadenaZelle + numeroPropiedad)){
          fila = document.createElement("tr");
          celdaTipoPago = document.createElement("td");
          celdaTipoPago.textContent = "Zelle";
          celdaRef = document.createElement("td");
          celdaRef.textContent = this[cadenaZelle + numeroPropiedad][0];
          celdaMontoMetodo = document.createElement("td");
          celdaMontoMetodo.textContent = this[cadenaZelle + numeroPropiedad][1];
          celdaEstatus = document.createElement("td");
          if((this[cadenaZelle + numeroPropiedad][2] == true) && (this[cadenaZelle + numeroPropiedad][3] == true)){
            celdaEstatus.textContent = "En Espera";
          }
          if((this[cadenaZelle + numeroPropiedad][2] == true) && (this[cadenaZelle + numeroPropiedad][2] == false)){
            celdaEstatus.textContent = "Rechazado";
          }
          if((this[cadenaZelle + numeroPropiedad][2] == false) && (this[cadenaZelle + numeroPropiedad][2] == false)){
            celdaEstatus.textContent = "Aceptado";
            sumadorMontos = sumaDecimal(numberAformatoMontos(sumadorMontos), this[cadenaZelle + numeroPropiedad][1]);
          } 
          celdaTipoPago.className = "tdSinBorde";
          celdaRef.className = "tdSinBorde";
          celdaMontoMetodo.className = "tdSinBorde";
          celdaEstatus.className = "tdSinBorde";
          fila.appendChild(celdaTipoPago);
          fila.appendChild(celdaRef);
          fila.appendChild(celdaMontoMetodo);
          fila.appendChild(celdaEstatus);
          tabla.appendChild(fila);
          numeroPropiedad++;
        }
        else break;
      }
      let numero = 1;
      let cadena;

      //FILA QUE CLASIFICA LOS DATOS DEL PAGO

      fila = document.createElement("tr");
      celdaEstudiante = document.createElement("th");
      celdaTipo = document.createElement("th");
      celdaMonto = document.createElement("th");
      celdaCurso = document.createElement("th");
      celdaEstudiante.textContent = "Nombre Estudiante";
      celdaMonto.textContent = "Monto";
      celdaCurso.textContent = "Curso";
      celdaCurso.className = "tdSinBorde";
      celdaTipo.className = "tdSinBorde";
      celdaEstudiante.className = "tdSinBorde";
      celdaMonto.className = "tdSinBorde";
      if(this.tipoDePago == "Inscripción"){
        celdaTipo.textContent = "Grado de Instrucción";
      }
      if(this.tipoDePago == "Administrativo"){
        celdaTipo.textContent = "Concepto"; 
      }
      if(this.tipoDePago == "Mensualidad"){
        celdaTipo.textContent = "Mes";
      }
      fila.appendChild(celdaEstudiante);
      fila.appendChild(celdaTipo);
      fila.appendChild(celdaCurso);
      fila.appendChild(celdaMonto);
      tabla.appendChild(fila);


      //A PARTIR DE ESTE PUNTO SE EMPIEZAN A ESCRIBIR LOS DATOS DEL PAGO


      while(true){
        cadena = "estudiante" + numero.toString();
        if(this.hasOwnProperty(cadena)){

          //AQUI SE ESCRIBEN LOS DATOS DEL PAGO DE UNA INSCRIPCION
          //ESTA PARTE DEL CODIGO NO LLEVA UN BUCLE FOR, YA QUE UN PAGO DE INSCRIPCION ES SOLO UNO POR ESTUDIANTE

          if(this.tipoDePago == "Inscripción"){
            fila = document.createElement("tr");
            celdaEstudiante = document.createElement("td");
            celdaTipo = document.createElement("td");
            celdaCurso = document.createElement("td");
            celdaMonto = document.createElement("td");
            celdaTipo.className = "tdSinBorde";
            celdaEstudiante.className = "tdSinBorde";
            celdaCurso.className = "tdSinBorde";
            celdaCurso.textContent = this["cursoEstudiante" + numero.toString()];
            celdaMonto.className = "tdSinBorde";
            celdaEstudiante.textContent = this[cadena][0]; 
            montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]);
            sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
            if(sumadorMontos >= 0){
              celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][1]) + " Bs";
            }
            else{
              sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
              if(sumadorPrueba >= 0){
                celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " Bs";
              }
              else{
                celdaMonto.textContent = "0,00 Bs";
              }
            }
            celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][1]);
            fila.appendChild(celdaEstudiante);
            fila.appendChild(celdaTipo);
            fila.appendChild(celdaCurso);
            fila.appendChild(celdaMonto);
            tabla.appendChild(fila);     
          }

          //AQUI SI SE INCLUYO UN BUCLE PARA RECORRER TODOS LOS PAGOS DEL ESTUDIANTE
          //AL IGUAL QUE MENSUALIDAD, ADMINISTRATIVO SE DEJO EN UN BUCLE APARTE PARA NO
          //CONFUNDIR CON EL CODIGO, UNA PARTE PARA CADA COSA Y NO UNA QUE HACE VARIAS COSAS

          if(this.tipoDePago == "Mensualidad"){
            for(let i = 1; i <= this[cadena].length - 1; i++){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = this["cursoEstudiante" + numero];
              montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]);
              sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
              if(sumadorMontos >= 0){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]) + " Bs";
              }
              else{
                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " Bs";
                }
                else{
                  celdaMonto.textContent = "0,00 Bs";
                }
              }
              celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][i]);
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
            }
          }
          if(this.tipoDePago == "Administrativo"){
            for(let i = 1; i <= this[cadena].length - 1; i++){
              fila = document.createElement("tr");
              celdaEstudiante = document.createElement("td");
              celdaTipo = document.createElement("td");
              celdaMonto = document.createElement("td");
              celdaCurso = document.createElement("td");
              celdaCurso.className = "tdSinBorde";
              celdaTipo.className = "tdSinBorde";
              celdaEstudiante.className = "tdSinBorde";
              celdaMonto.className = "tdSinBorde";
              celdaEstudiante.textContent = this[cadena][0];
              celdaCurso.textContent = "N/A";
              montoPagoEstudiante = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]);
              sumadorMontos = restaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
              if(sumadorMontos >= 0){
                celdaMonto.textContent = extraerNumerosPuntosComasDeUnaCadena(this[cadena][i]) + " Bs";
              }
              else{
                sumadorPrueba = sumaDecimal(numberAformatoMontos(sumadorMontos), montoPagoEstudiante);
                if(sumadorPrueba >= 0){
                  celdaMonto.textContent = numberAformatoMontos(sumadorPrueba) + " Bs";
                }
                else{
                  celdaMonto.textContent = "0,00 Bs";
                }
              }
              celdaTipo.textContent = extraerLetrasDeUnaCadena(this[cadena][i]);
              fila.appendChild(celdaEstudiante);
              fila.appendChild(celdaTipo);
              fila.appendChild(celdaCurso);
              fila.appendChild(celdaMonto);
              tabla.appendChild(fila);
            }
          }
        }
        else{
          break;
        }
        numero++;
      }
    }
}

class reciboInscripcion extends documentoDePago{
  rellenarRecibo(curso, estudianteRepre, numero, monto){
    const numeroEstudiante = "estudiante" + numero;
    const estudianteCurso = "cursoEstudiante" + numero;
    this[estudianteCurso] = curso;
    this[numeroEstudiante] = [estudianteRepre.nombres + " " + estudianteRepre.apellidos, estudianteRepre.grado + monto];
  }
  rellenarParaVerificar(numero, array){
    const cadenaVerificarEstudiante = "verificarEstudiante";
    this[cadenaVerificarEstudiante + numero] = array;
  }
  rellenarReciboVer5(){

    let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // MONTO USD
      ""  // MONTO BS
    ];
    
    let contadorConceptos = 1;

    let tabla = document.getElementById("tablaConfirmarMesesInscribir");

    for(let i = 1; i <= tabla.rows.length - 1; i++){

      propiedadDatosRecibo[0] = tabla.rows[i].cells[0].textContent; //NOMBRE
      propiedadDatosRecibo[1] = tabla.rows[i].cells[3].textContent; //CONCEPTO
      propiedadDatosRecibo[2] = tabla.rows[i].cells[2].textContent; //CURSO
      propiedadDatosRecibo[3] = tabla.rows[i].cells[4].textContent; //MONTO USD
      propiedadDatosRecibo[4] = tabla.rows[i].cells[5].children[0].value; //MONTO BS

      this["concepto" + contadorConceptos] = [...propiedadDatosRecibo];
      contadorConceptos++;

    }

  }
}

export class reciboPreinscripcion extends documentoDePago{

  rellenarReciboVer5(){

    let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // MONTO USD
      ""  // MONTO BS
    ];
    
    let contadorConceptos = 1;

    let tabla = document.getElementById("tablaPreinscripcionConfirmar");

    for(let i = 1; i <= tabla.rows.length - 1; i++){

      propiedadDatosRecibo[0] = tabla.rows[i].cells[0].textContent; //NOMBRE
      propiedadDatosRecibo[1] = "Preinscripción"; //CONCEPTO
      propiedadDatosRecibo[2] = tabla.rows[i].cells[2].textContent; //CURSO
      propiedadDatosRecibo[3] = tabla.rows[i].cells[3].textContent; //MONTO USD
      propiedadDatosRecibo[4] = tabla.rows[i].cells[4].children[0].value; //MONTO BS

      this["concepto" + contadorConceptos] = [...propiedadDatosRecibo];
      contadorConceptos++;

    }

  }  

}

//
//PARA PONER LOS PAGOS CON MONEDA MIXTA
//SE DEBE PONER TODO EN BS (PERO REPRESENTAR EN EL METODO QUE FUERON TANTOS $$)
//

class reciboMensualidad extends documentoDePago{

  rellenarReciboVer5(){

       let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // MONTO USD
      ""  // MONTO BS
    ];
    
    let contadorConceptos = 1;

    let tabla = document.getElementById("tabla-estudiante-pagado-encabezado");

    for(let i = 1; i <= tabla.rows.length - 1; i++){

      propiedadDatosRecibo[0] = tabla.rows[i].cells[0].textContent; //NOMBRE
      propiedadDatosRecibo[1] = tabla.rows[i].cells[3].textContent; //CONCEPTO
      propiedadDatosRecibo[2] = tabla.rows[i].cells[2].textContent; //CURSO
      propiedadDatosRecibo[3] = tabla.rows[i].cells[4].textContent; //MONTO USD
      propiedadDatosRecibo[4] = tabla.rows[i].cells[5].children[0].value; //MONTO BS

      this["concepto" + contadorConceptos] = [...propiedadDatosRecibo];
      contadorConceptos++;

    } 

  }

  rellenarRecibo(nombreEstudiante, cursoEstudiante, numero){
    const numeroEstudiante = "estudiante" + numero;
    const estudianteCurso = "cursoEstudiante" + numero;
    this[numeroEstudiante] = [];
    this[numeroEstudiante].push(nombreEstudiante);
    this[estudianteCurso] = cursoEstudiante;
  }
  agregarMes(montoUSD, mes, numero, montoBS){
    const numeroEstudiante = "estudiante" + numero;
    let agregar = mes + "-" + montoUSD + "-" + montoBS;
    this[numeroEstudiante].push(agregar);
  }
  rellenarParaVerificar(numero, array){
    const cadenaVerificarEstudiante = "verificarEstudiante";
    this[cadenaVerificarEstudiante + numero] = array;
  }
}

class reciboAdministrativo extends documentoDePago{
  rellenarRecibo(nombreEstudiante, tipoPago, numero, montoUSD, montoBS){
    const numeroEstudiante = "estudiante" + numero;
    this[numeroEstudiante] = [nombreEstudiante, tipoPago + "-" + montoUSD + "-" + montoBS];
  }
  rellenarReciboVer5(){

    let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // MONTO USD
      ""  // MONTO BS
    ];
    
    let contadorConceptos = 1;

    let tabla = document.getElementById("tablaConfirmarDetallesAdministrativo");

    let nombreCompleto, montoBS, montoUSD, concepto;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

      nombreCompleto = tabla.rows[i].cells[0].textContent;

      concepto = tabla.rows[i].cells[1].textContent;

      montoUSD = tabla.rows[i].cells[2].textContent;

      montoBS = tabla.rows[i].cells[3].children[0].value;

      propiedadDatosRecibo[0] = nombreCompleto;
      propiedadDatosRecibo[1] = concepto; //CONCEPTO
      propiedadDatosRecibo[2] = "N/A"; //CURSO
      propiedadDatosRecibo[3] = montoUSD; //MONTO USD
      propiedadDatosRecibo[4] = montoBS; //MONTO BS

      this["concepto" + contadorConceptos] = [...propiedadDatosRecibo];
      contadorConceptos++;

    }

  }
}

class reciboAbono extends documentoDePago{
  rellenarRecibo(nombreContenedor, numero, monto, moneda){
    const numeroAbono = "abono" + numero;
    if(moneda == "Dólares") moneda = "USD";
    else moneda = "BS";
    this[numeroAbono] = [nombreContenedor, monto, moneda];
  }
  rellenarReciboVer5(){

    let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // MONTO USD
      ""  // MONTO BS
    ];
    
    let contadorConceptos = 1;

    let tabla = document.getElementById("tabla-consultar-abonosRepresentante");

    for(let i = 1; i <= tabla.rows.length - 1; i++){

      if(tabla.rows[i].cells[3].children[0].value == "0,00") continue; //NO SE ABONO NADA EN ESE CONTENEDOR

      propiedadDatosRecibo[0] = "N/A"; //NOMBRE
      propiedadDatosRecibo[1] = tabla.rows[i].cells[0].children[0].value + " (Contenedor)"; //CONCEPTO
      propiedadDatosRecibo[2] = "N/A"; //CURSO

      if(tabla.rows[i].cells[1].children[0].selectedIndex == 1){

        propiedadDatosRecibo[3] = "N/A"; //MONTO USD
        propiedadDatosRecibo[4] = tabla.rows[i].cells[3].children[0].value; //MONTO BS

      }
      else{

        propiedadDatosRecibo[3] = tabla.rows[i].cells[3].children[0].value; //MONTO USD
        propiedadDatosRecibo[4] = "N/A"; //MONTO BS

      }

      this["concepto" + contadorConceptos] = [...propiedadDatosRecibo];
      contadorConceptos++;

    }

  }
}

class reciboAbonoNoRegistrado extends documentoDePago{

  rellenarReciboVer5(){

    let propiedadDatosRecibo = [
      "", // NOMBRE ESTUDIANTE
      "", // CONCEPTO
      "", // CURSO
      "", // MONTO USD
      ""  // MONTO BS
    ];
    
    let contadorConceptos = 1;

    let tabla = document.getElementById("tablaConsultarAbonosRepresentanteNoRegistrado");

    for(let i = 1; i <= tabla.rows.length - 1; i++){

      if(tabla.rows[i].cells[3].children[0].value == "0,00") continue; //NO SE ABONO NADA EN ESE CONTENEDOR

      propiedadDatosRecibo[0] = "N/A"; //NOMBRE
      propiedadDatosRecibo[1] = tabla.rows[i].cells[0].children[0].value + " (Contenedor)"; //CONCEPTO
      propiedadDatosRecibo[2] = "N/A"; //CURSO

      if(tabla.rows[i].cells[1].children[0].selectedIndex == 1){

        propiedadDatosRecibo[3] = "N/A"; //MONTO USD
        propiedadDatosRecibo[4] = tabla.rows[i].cells[3].children[0].value; //MONTO BS

      }
      else{

        propiedadDatosRecibo[3] = tabla.rows[i].cells[3].children[0].value; //MONTO USD
        propiedadDatosRecibo[4] = "N/A"; //MONTO BS

      }

      this["concepto" + contadorConceptos] = [...propiedadDatosRecibo];
      contadorConceptos++;

    }

  }

}

class documentoDePagoExonerado{
  constructor(IdPago, nombreRepresentante, cedulaRepresentante,
              fecha, tipoPago){
    this.IdPago = IdPago;
    this.nombreRepresentante = nombreRepresentante;
    this.cedulaRepresentante = cedulaRepresentante;
    this.fecha = fecha;
    this.tipoDePago = tipoPago;
  }
  insertarConceptoMensualidadExonerada(nombre, mes, curso, flag, numero){

    let nombrePropiedad = "concepto" + numero;

    let propiedadDatosRecibo = [];

    propiedadDatosRecibo.push(nombre);
    propiedadDatosRecibo.push(mes);
    propiedadDatosRecibo.push(curso);

    if(flag) propiedadDatosRecibo.push("Exonerado");
    else propiedadDatosRecibo.push("Pago Pendiente");


    this[nombrePropiedad] = [...propiedadDatosRecibo];

  }
  dibujarRecibo(tabla){

    
      //ENCABEZADO NOMBRE INSTITUCION
      //ENCABEZADO NOMBRE INSTITUCION
      //ENCABEZADO NOMBRE INSTITUCION

      let tbody = document.createElement("tbody");


      let col1 = crearCeldaConTexto("UNIDAD EDUCATIVA CRISTÓBAL ROJAS");
      col1.style.fontWeight = "bold";
      col1.style.textAlign = "center";
      col1.className = "tdSinBorde";
      col1.colSpan = 4;

      let fila = document.createElement("tr");
      fila.appendChild(col1);

      tbody.appendChild(fila);

      ///ENCABEZADO RIF
      ///ENCABEZADO RIF
      ///ENCABEZADO RIF

      col1 = crearCeldaConTexto("RIF: J-29643838-2");
      col1.colSpan = 4;
      col1.className = "tdSinBorde";
      col1.style.fontWeight = "bold";
      col1.style.textAlign = "center";

      fila = document.createElement("tr");
      fila.appendChild(col1);

      tbody.appendChild(fila);

      //NOMBRE REPRESENTANTE
      //NOMBRE REPRESENTANTE
      //NOMBRE REPRESENTANTE

      col1 = crearCeldaConTexto("Nombre Representante: " + this.nombreRepresentante);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //CEDULA REPRESENTANTE
      //CEDULA REPRESENTANTE
      //CEDULA REPRESENTANTE

      col1 = crearCeldaConTexto("Cedula Representante: " + this.cedulaRepresentante);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //CONCEPTO DE PAGO
      //CONCEPTO DE PAGO
      //CONCEPTO DE PAGO

      col1 = crearCeldaConTexto("Concepto: " + this.tipoDePago);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //FECHA DE PAGO
      //FECHA DE PAGO
      //FECHA DE PAGO

      col1 = crearCeldaConTexto("Fecha de Pago: " + this.fecha);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //NUMERO RECIBO
      //NUMERO RECIBO
      //NUMERO RECIBO

      col1 = crearCeldaConTexto("Número de Recibo: " + this.IdPago);
      col1.className = "tdSinBorde";
      col1.colSpan = 4;
      col1.style.textAlign = "left";
      fila = document.createElement("tr");

      fila.appendChild(col1);

      tbody.appendChild(fila);

      //COLUMNAS DETALLES (ESTUDIANTES)
      //COLUMNAS DETALLES (ESTUDIANTES)
      //COLUMNAS DETALLES (ESTUDIANTES)

      let arrayFila = [];
      
      col1 = crearCeldaConTexto("Nombre Estudiante");

      let col2 = crearCeldaConTexto("Concepto");
      let col3 = crearCeldaConTexto("Curso");
      let col4 = crearCeldaConTexto("Monto");

      col1.style.textAlign = "center";
      col2.style.textAlign = "center";
      col3.style.textAlign = "center";
      col4.style.textAlign = "center";
      col1.style.fontWeight = "bold";
      col2.style.fontWeight = "bold";
      col3.style.fontWeight = "bold";
      col4.style.fontWeight = "bold";
      col1.className = "tdSinBorde";
      col2.className = "tdSinBorde";
      col3.className = "tdSinBorde";
      col4.className = "tdSinBorde";


      arrayFila.push(col1);
      arrayFila.push(col2);
      arrayFila.push(col3);
      arrayFila.push(col4);

      tbody.appendChild(crearTRconCeldasApendadas(arrayFila));

      //DATOS DE LOS ESTUDIANTES
      //DATOS DE LOS ESTUDIANTES
      //DATOS DE LOS ESTUDIANTES


      let contadorConceptos = 1;

      while(true){

        if(this.hasOwnProperty("concepto" + contadorConceptos)){

          col1 = crearCeldaConTexto(this["concepto" + contadorConceptos][0]);
          col2 = crearCeldaConTexto(this["concepto" + contadorConceptos][1]);
          col3 = crearCeldaConTexto(this["concepto" + contadorConceptos][2]);
          col4 = crearCeldaConTexto((this["concepto" + contadorConceptos][3]));

          col1.className = "tdSinBorde";
          col2.className = "tdSinBorde";
          col3.className = "tdSinBorde";
          col4.className = "tdSinBorde";
          col1.style.textAlign = "center";
          col2.style.textAlign = "center";
          col3.style.textAlign = "center";
          col4.style.textAlign = "center";

          arrayFila = [];
          arrayFila.push(col1);
          arrayFila.push(col2);
          arrayFila.push(col3);
          arrayFila.push(col4);

          tbody.appendChild(crearTRconCeldasApendadas(arrayFila));

          contadorConceptos++;

        }

        else break;

      }

      tabla.appendChild(tbody);


  }

}

export class documentoReporte{

  constructor(numeroReporte, nombreRepresentante,
                tipoEdicion, cedulaRepresentante, fecha){
      this.numeroReporte = numeroReporte;
      this.nombreRepresentante = nombreRepresentante;
      this.cedulaRepresentante = cedulaRepresentante;
      this.fecha = fecha;
      this.tipoEdicion = tipoEdicion;
  }

  insertarCambiosAbonos(listaCambios){

    let noHuboCambio = false;

    let propiedad = "cambio";
    let numero = 1;

    for(let i = 0; i <= listaCambios.length - 1; i++){

      if(listaCambios[i][0] == noHuboCambio) continue;

      this[propiedad + numero] = [];

      //SOLO NECESITO ESTOS DOS ELEMENTOS

      this[propiedad + numero].push(listaCambios[i][1]);
      this[propiedad + numero].push(listaCambios[i][2]);
      numero++;


    }

  }

  insertarAbonoBorrado(abonoBorrado){

    this["cambio1"] = abonoBorrado;

  }


}