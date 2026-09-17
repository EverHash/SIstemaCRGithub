/*global document, console */

import { mostrarPantallaCarga, ocultarPantallaCarga, mostrarPantallaError } from "./modal.js";
import { doc, getDoc, getDocs, collection, query, limit, orderBy, Base, where } from "./firebase.js";
import { mostrarPagosRecibidos, atrasListaPagosError } from "./controlesListaPagos.js";
import { obtenerDatosPagoIndividual } from "./modal.js";
import { extraerLetrasDeUnaCadena } from "./utilidades.js";
import { establecerModoVerificarPago, establecerNumeroDePago, numeroPago } from "./verificarPago.js";

export {consultarListaDePagos, botonAtrasListaPagos, botonSiguienteListaPagos, colocarIconoPalomitaLista};

function colocarIconoPalomitaLista(){
  let tablaListaPagos = document.getElementById("tablaDatosPagos");
  for(let i = 1; i <= tablaListaPagos.rows.length - 1; i++){
    if(tablaListaPagos.rows[i].cells.length == 9){
      if(tablaListaPagos.rows[i].cells[6].textContent == numeroPago){
        tablaListaPagos.rows[i].cells[7].children[0].src = "rsrcs/checked.png";
      }
    }
  }
}

async function consultarListaDePagos(){
    mostrarPantallaCarga();
    let tablaPagos = document.getElementById("tablaDatosPagos");
    let tbody = document.createElement("tbody");
    let primeraFila = document.createElement("tr");
    let nombresR, cedula, estudi, mesesFila, montoFila, tipoDePagoFila, numeroTicketFila, estatusFila, fechaFila;
    nombresR = document.createElement("td");
    cedula = document.createElement("td");
    estudi = document.createElement("td");
    mesesFila = document.createElement("td");
    montoFila = document.createElement("td");
    tipoDePagoFila = document.createElement("td");
    numeroTicketFila = document.createElement("td");
    estatusFila = document.createElement("td");
    fechaFila = document.createElement("td");
    nombresR.textContent = "Nombre del Representante";
    cedula.textContent = "Cédula de Identidad";
    estudi.textContent = "Estudiantes";
    mesesFila.textContent = "Concepto de Pago";
    montoFila.textContent = "Detalles de Pago";
    tipoDePagoFila.textContent = "Tipo de Pago";
    numeroTicketFila.textContent = "Número de Ticket";
    estatusFila.textContent = "Verificación";
    fechaFila.textContent = "Fecha";
    nombresR.className = "tdConPadding";
    cedula.className = "tdConPadding";
    estudi.className = "tdConPadding";
    mesesFila.className = "tdConPadding";
    montoFila.className = "tdConPadding";
    tipoDePagoFila.className = "tdConPadding";
    numeroTicketFila.className = "tdConPadding";
    estatusFila.className = "tdConPadding";
    primeraFila.appendChild(nombresR);
    primeraFila.appendChild(cedula);
    primeraFila.appendChild(estudi);
    primeraFila.appendChild(mesesFila);
    primeraFila.appendChild(tipoDePagoFila);
    primeraFila.appendChild(montoFila);
    primeraFila.appendChild(numeroTicketFila);
    primeraFila.appendChild(estatusFila);
    primeraFila.appendChild(fechaFila);
    tbody.appendChild(primeraFila);
    tbody.id = "tabla-datos-pagos-recibidos";
    tablaPagos.appendChild(tbody);
    document.getElementById("ocultoNumeroPaginaTablaPagos").value = 1;
    document.getElementById("ocultoNumeroTotalPaginaTablaPagos").value = 1;
    let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
    let numeroDePago = await getDoc(obtenerNumeroDePago);
    let IdPagoObtener = numeroDePago.data();
    let numeroDePagosTotales = IdPagoObtener.numero;
    document.getElementById("ocultoNumeroPeticionesListaPagos").value = 1;
    let tabla = document.getElementById("tabla-datos-pagos-recibidos");
    let numeroListaPagos = parseInt(document.getElementById("ocultoNumeroPaginaTablaPagos").value, 10);
    try {
    let coleccionPagos = await collection(Base, "pagos/");
    let obtenerDocumentosDePago = await query(coleccionPagos, orderBy("IdPago", "desc"), limit(10), where("IdPago", "<=", numeroDePagosTotales));
    let documentosDePago = await getDocs(obtenerDocumentosDePago);
    let obtenerMenorDocumento = await query(coleccionPagos, orderBy("IdPago", "asc"), limit(1));
    let menorDocumento = await getDocs(obtenerMenorDocumento);
    let menorNumero;
    menorDocumento.forEach((documento) => {
      menorNumero = documento.data().IdPago;
    });
    let nombreRepresentante, cedula, estudiantes, meses, monto, tipoDePago, fecha, verif, idPago, fila;
    let imgVerificar;
    let verificador = 0;
    let propiedadEstudiante;
    let contadorEstudiantes = 1;
    let spanVerificador = false;
    let m = 1;
    let img;           
    documentosDePago.forEach((documento) => {
      m = 1;
      spanVerificador = false;
      documento = documento.data();
      contadorEstudiantes = 1;
      while(true){   
        if(documento.hasOwnProperty("estudiante" + (contadorEstudiantes + 1))){
          contadorEstudiantes++;
          propiedadEstudiante = "estudiante" + contadorEstudiantes;
          spanVerificador = true;
        }
        else{
          break;
        }
      }
      fila = document.createElement("tr");
      fila.className = numeroListaPagos;
      nombreRepresentante = document.createElement("td");
      cedula = document.createElement("td");
      estudiantes = document.createElement("td");
      meses = document.createElement("td");
      monto = document.createElement("td");
      tipoDePago = document.createElement("td");
      idPago = document.createElement("td");
      verif = document.createElement("td");
      fecha = document.createElement("td");
      nombreRepresentante.className = "tdConPadding";
      cedula.className = "tdConPadding";
      estudiantes.className = "tdConPadding";
      meses.className = "tdConPadding";
      monto.className = "tdConPadding";
      tipoDePago.className = "tdConPadding";
      idPago.className = "tdConPadding";
      verif.className = "tdConPadding";
      fecha.className = "tdConPadding";
      nombreRepresentante.textContent = documento.nombreRepresentante;
      cedula.textContent = documento.cedulaRepresentante;
      estudiantes.textContent = documento["estudiante1"][0];
      tipoDePago.textContent = documento.tipoDePago;
      fecha.textContent = documento.fecha;
      idPago.textContent = documento.IdPago;
      if(documento.tipoDePago == "Inscripción"){
        meses.textContent = documento.cursoEstudiante1;
      }
      else{
        for(let i = 1; i<= documento["estudiante1"].length - 1; i++){
          if(verificador > 0 && i <= (documento["estudiante1"].length - 1) && i != 1){
            meses.textContent += ", ";
          }
          meses.textContent += extraerLetrasDeUnaCadena(documento["estudiante1"][i]);
          verificador++;
        }
      }
      verificador = 0;
      img = document.createElement("img");
      img.src = "rsrcs/eye.png";
      img.style.width = "25px";
      img.style.height = "25px";
      img.addEventListener("click", verDetallesPagoListaPagos);
      monto.appendChild(img);
      imgVerificar = document.createElement("img");
      if(documento.flagVerificar == true){
        imgVerificar.src = "rsrcs/cross.png";
      }
      else imgVerificar.src = "rsrcs/checked.png";
      imgVerificar.style.width = "25px";
      imgVerificar.style.height = "25px";
      verif.appendChild(imgVerificar);
      nombreRepresentante.rowSpan = contadorEstudiantes;
      cedula.rowSpan = contadorEstudiantes;
      monto.rowSpan = contadorEstudiantes;
      tipoDePago.rowSpan = contadorEstudiantes;
      idPago.rowSpan = contadorEstudiantes;
      verif.rowSpan = contadorEstudiantes;
      fecha.rowSpan = contadorEstudiantes;
      fila.appendChild(nombreRepresentante);
      fila.appendChild(cedula);
      fila.appendChild(estudiantes);
      fila.appendChild(meses);
      fila.appendChild(tipoDePago);
      fila.appendChild(monto);
      fila.appendChild(idPago);
      fila.appendChild(verif);
      fila.appendChild(fecha);
      tabla.appendChild(fila);
      m = 1;
      if(documento.tipoDePago == "Inscripción"){
        if(spanVerificador == true){
          for(let i = 2; i <= contadorEstudiantes; i++){
            fila = document.createElement("tr");
            fila.className = numeroListaPagos;
            meses = document.createElement("td");
            meses.textContent = documento["cursoEstudiante" + i];
            estudiantes = document.createElement("td");
            estudiantes.textContent = documento["estudiante" + i][0];
            estudiantes.className = "tdConPadding";
            fila.appendChild(estudiantes);
            fila.appendChild(meses);
            tabla.appendChild(fila);
          }
        }
      }
      else{
        if(spanVerificador == true){
          for(let i = 2; i <= contadorEstudiantes; i++){
            fila = document.createElement("tr");
            fila.className = numeroListaPagos;
            estudiantes = document.createElement("td");
            estudiantes.textContent = documento["estudiante" + i][0];
            meses = document.createElement("td");
            meses.className = "tdConPadding";
            estudiantes.className = "tdConPadding";
            for(let j = 1; j <= documento["estudiante" + i].length - 1; j++){
              if(verificador > 0 && j <= (documento["estudiante" + i].length - 1) && j != 1){
                meses.textContent += ", ";
              }
              meses.textContent += extraerLetrasDeUnaCadena(documento["estudiante" + i][j]);
              verificador++;
            }
            fila.appendChild(estudiantes);
            fila.appendChild(meses);
            tabla.appendChild(fila);
          }
        }
      }
      verificador = 0;
      if(documento.IdPago == menorNumero){
        document.getElementById("listaSiguiente").style.visibility = "hidden";
      }
    });
    ocultarPantallaCarga();
    mostrarPagosRecibidos();
    document.getElementById("listaAtras").style.visibility = "hidden"; 
    if(numeroDePagosTotales <= 10) document.getElementById("listaSiguiente").style.visibility = "hidden";
    else document.getElementById("ocultoNumeroTotalPagos").value = numeroDePagosTotales - 10;
    } catch (error) {
      console.log("ERROR AL LEER LA LISTA DE PAGOS: ", error);
      mostrarPantallaError("Error Inesperado");
      atrasListaPagosError();
    }
  }

  function botonAtrasListaPagos(){
    let tabla = document.getElementById("tabla-datos-pagos-recibidos");
    document.getElementById("ocultoNumeroPaginaTablaPagos").value = parseInt(document.getElementById("ocultoNumeroPaginaTablaPagos").value, "10") - 1;
    let numeroListaPagos = parseInt(document.getElementById("ocultoNumeroPaginaTablaPagos").value, 10);
    for(let k = 1; k <= tabla.rows.length - 1;k++){
      tabla.rows[k].style.display = "none";
    }
    for(let k = 1; k <= tabla.rows.length - 1;k++){
      if(tabla.rows[k].className == numeroListaPagos){
        tabla.rows[k].style.display = "table-row";
      }
    }
    document.getElementById("listaSiguiente").style.visibility = "visible";
    if(document.getElementById("ocultoNumeroPaginaTablaPagos").value == "1"){
      document.getElementById("listaAtras").style.visibility = "hidden";
    }
  }
  

  async function botonSiguienteListaPagos(){
    try {
      mostrarPantallaCarga();
      let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
      let numeroDePago = await getDoc(obtenerNumeroDePago);
      let IdPagoObtener = numeroDePago.data();
      let numeroDePagosTotales = IdPagoObtener.numero - 10;
      let tabla = document.getElementById("tabla-datos-pagos-recibidos");
      let bajada = document.getElementById("ocultoNumeroTotalPagos").value;
      let coleccionPagos = await collection(Base, "pagos/");
      let nombreRepresentante, cedula, estudiantes, meses, monto, tipoDePago, fecha, verif, idPago, fila;
      let spanVerificador = false;
      let contadorEstudiantes = 1;
      let verificador = 0;
      let propiedadEstudiante;
      let imgVerificar;
      let numeroListaPagos = parseInt(document.getElementById("ocultoNumeroPaginaTablaPagos").value, 10);
      let numeroTotalListaPagos = parseInt(document.getElementById("ocultoNumeroTotalPaginaTablaPagos").value, 10);
      let img;
      let obtenerMenorDocumento = await query(coleccionPagos, orderBy("IdPago", "asc"), limit(1));
      let menorDocumento = await getDocs(obtenerMenorDocumento);
      let menorNumero;
      menorDocumento.forEach((documento) => {
        console.log(documento.data());
        menorNumero = documento.data().IdPago;
      });
      if((numeroListaPagos == numeroTotalListaPagos)){
        for(let i = tabla.rows.length - 1; i >= 1; i--){
          if(tabla.rows[i].cells.length < 6){
            continue;
          }
          bajada = tabla.rows[i].cells[6].textContent;
          break;
        }
        bajada = parseInt(bajada, 10) - 1;
        let obtenerDocumentosDePago = await query(coleccionPagos, orderBy("IdPago", "desc"), limit(10), where("IdPago", "<=", bajada));
        let documentosDePago = await getDocs(obtenerDocumentosDePago); 
        numeroListaPagos++;
        numeroTotalListaPagos++;
        document.getElementById("ocultoNumeroPaginaTablaPagos").value = numeroListaPagos;
        document.getElementById("ocultoNumeroTotalPaginaTablaPagos").value = numeroTotalListaPagos;
        for(let i = tabla.rows.length - 1; i >= 1; i--){
          tabla.rows[i].style.display = "none";
        }
        documentosDePago.forEach((documento) => {
          spanVerificador = false;
          documento = documento.data();
          contadorEstudiantes = 1;
          while(true){   
            if(documento.hasOwnProperty("estudiante" + (contadorEstudiantes + 1))){
              contadorEstudiantes++;
              propiedadEstudiante = "estudiante" + contadorEstudiantes;
              spanVerificador = true;
            }
            else{
              break;
            }
          }
          fila = document.createElement("tr");
          fila.className = numeroListaPagos;
          nombreRepresentante = document.createElement("td");
          cedula = document.createElement("td");
          estudiantes = document.createElement("td");
          meses = document.createElement("td");
          monto = document.createElement("td");
          tipoDePago = document.createElement("td");
          idPago = document.createElement("td");
          verif = document.createElement("td");
          fecha = document.createElement("td");
          nombreRepresentante.className = "tdConPadding";
          cedula.className = "tdConPadding";
          estudiantes.className = "tdConPadding";
          meses.className = "tdConPadding";
          monto.className = "tdConPadding";
          tipoDePago.className = "tdConPadding";
          idPago.className = "tdConPadding";
          verif.className = "tdConPadding";
          fecha.className = "tdConPadding";
          nombreRepresentante.textContent = documento.nombreRepresentante;
          cedula.textContent = documento.cedulaRepresentante;
          estudiantes.textContent = documento["estudiante1"][0];
          tipoDePago.textContent = documento.tipoDePago;
          fecha.textContent = documento.fecha;
          idPago.textContent = documento.IdPago;
          if(documento.tipoDePago == "Inscripción"){
            meses.textContent = documento["cursoEstudiante1"];
          }
          else{
            for(let i = 1; i<= documento["estudiante1"].length - 1; i++){
              if(verificador > 0 && i < (documento["estudiante1"].length - 1)  && i != 1){
                meses.textContent += ", ";
              }
              meses.textContent = extraerLetrasDeUnaCadena(documento["estudiante1"][i]);
              verificador++;
            }
          }
          verificador = 0;
          img = document.createElement("img");
          img.src = "rsrcs/eye.png";
          img.style.width = "25px";
          img.style.height = "25px";
          img.addEventListener("click", verDetallesPagoListaPagos);
          monto.appendChild(img);
          imgVerificar = document.createElement("img");
          if(documento.flagVerificar == true){
            imgVerificar.src = "rsrcs/cross.png";
          }
          else imgVerificar.src = "rsrcs/checked.png";
          imgVerificar.style.width = "25px";
          imgVerificar.style.height = "25px";
          verif.appendChild(imgVerificar);
          verif.rowSpan = contadorEstudiantes;
          nombreRepresentante.rowSpan = contadorEstudiantes;
          cedula.rowSpan = contadorEstudiantes;
          monto.rowSpan = contadorEstudiantes;
          tipoDePago.rowSpan = contadorEstudiantes;
          idPago.rowSpan = contadorEstudiantes;
          fecha.rowSpan = contadorEstudiantes;
          fila.appendChild(nombreRepresentante);
          fila.appendChild(cedula);
          fila.appendChild(estudiantes);
          fila.appendChild(meses);
          fila.appendChild(tipoDePago);
          fila.appendChild(monto);
          fila.appendChild(idPago);
          fila.appendChild(verif);
          fila.appendChild(fecha);
          tabla.appendChild(fila);
          if(documento.tipoDePago == "Inscripción"){
            if(spanVerificador == true){
              for(let i = 2; i <= contadorEstudiantes; i++){
                fila = document.createElement("tr");
                fila.className = numeroListaPagos;
                meses = document.createElement("td");
                meses.textContent = documento["cursoEstudiante" + i];
                estudiantes = document.createElement("td");
                estudiantes.className = "tdConPadding";
                estudiantes.textContent = documento["estudiante" + i][0];
                fila.appendChild(estudiantes);
                fila.appendChild(meses);
                tabla.appendChild(fila);
              }
            }
          }
          else{
            if(spanVerificador == true){
              for(let i = 2; i <= contadorEstudiantes; i++){
                fila = document.createElement("tr");
                fila.className = numeroListaPagos;
                estudiantes = document.createElement("td");
                estudiantes.textContent = documento["estudiante" + i][0];
                meses = document.createElement("td");
                estudiantes.className = "tdConPadding";
                meses.className = "tdConPadding";
                for(let j = 1; j <= documento["estudiante" + i].length - 1; j++){
                  if(verificador > 0 && j < (documento["estudiante" + i].length - 1) && j != 1){
                    meses.textContent += ", ";
                  }
                  propiedadEstudiante = documento["estudiante" + i][j];
                  meses.textContent = extraerLetrasDeUnaCadena(propiedadEstudiante);
                  verificador++;
                }
                fila.appendChild(estudiantes);
                fila.appendChild(meses);
                tabla.appendChild(fila);
              }
            }
          }
          verificador = 0;
          if(documento.IdPago == 1){
            document.getElementById("listaSiguiente").style.visibility = "hidden";
          }
        });
      }
      else{
        for(let i = tabla.rows.length - 1; i >= 1; i--){
          tabla.rows[i].style.display = "none";
        }
        for(let i = tabla.rows.length - 1; i >= 1; i--){
          if(tabla.rows[i].className == (numeroListaPagos + 1)){
            tabla.rows[i].style.display = "table-row";
          }
        }
        for(let i = 1; i <=tabla.rows.length - 1; i++){
          if(tabla.rows[i].style.display == "table-row"){
            if(tabla.rows[i].cells.length > 2){
              if(tabla.rows[i].cells[6].textContent == "1"){
                document.getElementById("listaSiguiente").style.visibility = "hidden";
              }
            }
          }
        }
        document.getElementById("ocultoNumeroPaginaTablaPagos").value = parseInt(document.getElementById("ocultoNumeroPaginaTablaPagos").value, "10") + 1;
      }
    if(parseInt(document.getElementById("ocultoNumeroTotalPagos").value - 10) <= 10) document.getElementById("listaSiguiente").style.visibility = "hidden"; 
    else document.getElementById("ocultoNumeroTotalPagos").value = numeroDePagosTotales - 10;
    for(let i = 1; i <= tabla.rows.length - 1; i++){
      if(tabla.rows[i].style.display != "none" && tabla.rows[i].cells.length == 8){
        if(tabla.rows[i].cells[6].textContent == menorNumero){
          document.getElementById("listaSiguiente").style.visibility = "hidden";
        }
      } 
    }
    document.getElementById("listaAtras").style.visibility = "visible";
    ocultarPantallaCarga();
    } catch (error) {
      console.log("ERROR AL CARGAR SIGUIENTE PAGINA: ", error);
      ocultarPantallaCarga();
      mostrarPantallaError("Error Inesperado");
    }
  }

function verDetallesPagoListaPagos(){
    establecerNumeroDePago(this.parentNode.parentNode.children[6].textContent);
    establecerModoVerificarPago("Lista");
    obtenerDatosPagoIndividual();
}