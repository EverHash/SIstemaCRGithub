/*global window, jsPDF, XMLHttpRequest, FileReader, document, setTimeout*/

import { annoEnCurso } from "./obtenerPrecios.js";

export {generarImagen, 
    pdfInscripcion, 
    imprimirListaDeudores, 
    pdfMensualidad, 
    pdfAgregar, 
    pdfReinscripcion, 
    pdfPagoAdministrativo, 
    pdfVerificarTicket,
    pdfPagoAbono, 
    pdfPagoAbonoNoRegistrado,
    pdfEdicionMensualidad};


//IMPRIMIR FORMULARIO DE INSCRIPCION

function openDataIframe(url) {
    var html = '<html>' +
      '<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>' +
      '<body>' +
      '<iframe src="' + url + '"></iframe>' +
      '</body></html>';
    let a = window.open();
    a.document.write(html);
  }

  function cargarImagen(url){
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e){
            const reader = new FileReader;
            reader.onload = function(event){
                const res = event.target.result;
                resolve(res);
            };
            const file = this.response;
            reader.readAsDataURL(file);
        };
        xhr.send();
    });
}

async function generarImagen(nombreEstudiante, apellidoEstudiante, cedulaEstudiante,
    sexoEstudiante, fechaNacimiento, lugarNacimiento, 
    estado, direccion, nombreCompletoRepresentante,
    cedulaRepresentante, direccionRepresentante, telefono,
    nombrePadre, cedulaPadre, nombreMadre, cedulaMadre,
    curso, numeroRecibo, fecha, annoEscolar){
        
        const imagen = await cargarImagen("rsrcs/formulario.jpg");
        const pdf = new jsPDF('p', 'px', 'legal');
        pdf.addImage(imagen, 'JPG', 0, 0, 475, 870);
        pdf.setFontSize(12);
        pdf.text(nombreEstudiante, 258, 162);
        pdf.text(apellidoEstudiante, 76, 162);
        pdf.text(cedulaEstudiante, 61, 177);
        pdf.text(sexoEstudiante, 142, 177);
        pdf.text(fechaNacimiento, 305, 177);
        pdf.text(lugarNacimiento, 120, 192);
        pdf.text(estado, 250, 192);
        pdf.text(direccion, 77, 207);
        pdf.text(nombreCompletoRepresentante, 120, 266);
        pdf.text(cedulaRepresentante, 346, 266);
        pdf.text(direccionRepresentante, 77, 281);
        pdf.text(telefono, 206, 296);
        pdf.text(nombrePadre, 109, 311);
        pdf.text(cedulaPadre, 319, 311);
        pdf.text(cedulaMadre, 319, 325);
        pdf.text(nombreMadre, 116, 325);
        pdf.text(curso, 11, 385);
        pdf.text(numeroRecibo, 83, 385);
        pdf.text(fecha, 144, 385);
        pdf.text(annoEscolar, 240, 385);
        pdf.autoPrint();
        let a = pdf.output('datauristring');
        openDataIframe(a);
}

export async function generarImagenConvenioPares(datosConvenio){

    //CONFIGURAR LA IMAGEN

    //LOS DOS 0 QUE VAN LUEGO DEL "JPG" TIENEN COMO PROPOSITO EL 
    //CENTRAR LA IMAGEN. LOS OTROS DOS NUMEROS SON LAS DIMENSIONES
    //DE LA IMAGEN, QUE DE POR CIERTO NO SE CORRESPONDEN CON
    //LO QUE TE DICE EL SISTEMA OPERATIVO EN CUANTO AL ANCHO Y ALTO EN PX

    //CONCLUSION? TOCA TANTEARLO HASTA QUE QUEDE BIEN

    //EL 450 ES EL ANCHO Y EL 590 ES EL ALTO

    const imagen = await cargarImagen("rsrcs/convenioPago.jpg");
    const pdf = new jsPDF('p', 'px', 'letter');
    pdf.addImage(imagen, 'JPG', 0, 0, 450, 590);
    pdf.setFontSize(12);

    //INTRODUCIR DATOS

    if(!datosConvenio.hasOwnProperty("anno")) pdf.text(annoEnCurso, 231, 100); //ANNO ESCOLAR LISTO

    else pdf.text(datosConvenio.anno, 231, 100); //ANNO ESCOLAR LISTO

    pdf.text(datosConvenio.nombreRepresentante, 276, 158); //NOMBRE REPRESENTANTE LISTO
    pdf.text(datosConvenio.cedulaRepresentante, 23, 170); //CEDULA REPRESENTANTE LISTO


    pdf.text(datosConvenio.apellidosEstudiante1, 20, 221); //APELLIDOS ESTUDIANTE 1 LISTO
    pdf.text(datosConvenio.nombresEstudiante1, 168, 221); //NOMBRES ESTUDIANTE 1 LISTO
    pdf.text(datosConvenio.cursoEstudiante1, 300, 221); //CURSO ESTUDIANTE 1 LISTO


    pdf.text(datosConvenio.apellidosEstudiante2, 20, 241); //APELLIDOS ESTUDIANTE 2 LISTO
    pdf.text(datosConvenio.nombresEstudiante2, 168, 241); //NOMBRES ESTUDIANTE 2 LISTO
    pdf.text(datosConvenio.cursoEstudiante2, 300, 241); //CURSO ESTUDIANTE 2 LISTO


    pdf.text(datosConvenio.intervalo, 61, 307); //INTERVALO MESES LISTO
    pdf.text(datosConvenio.fecha, 210, 307); //FECHAS LISTO
    pdf.autoPrint();
    let a = pdf.output('datauristring');
    openDataIframe(a);
}

export async function generarImagenConvenioIndividual(datosConvenio){

    //CONFIGURAR LA IMAGEN

    //LOS DOS 0 QUE VAN LUEGO DEL "JPG" TIENEN COMO PROPOSITO EL 
    //CENTRAR LA IMAGEN. LOS OTROS DOS NUMEROS SON LAS DIMENSIONES
    //DE LA IMAGEN, QUE DE POR CIERTO NO SE CORRESPONDEN CON
    //LO QUE TE DICE EL SISTEMA OPERATIVO EN CUANTO AL ANCHO Y ALTO EN PX

    //CONCLUSION? TOCA TANTEARLO HASTA QUE QUEDE BIEN

    //EL 450 ES EL ANCHO Y EL 590 ES EL ALTO

    const imagen = await cargarImagen("rsrcs/convenioPago.jpg");
    const pdf = new jsPDF('p', 'px', 'letter');
    pdf.addImage(imagen, 'JPG', 0, 0, 450, 590);
    pdf.setFontSize(12);

    //INTRODUCIR DATOS




    if(!datosConvenio.hasOwnProperty("anno")) pdf.text(annoEnCurso, 231, 100); //ANNO ESCOLAR LISTO

    else pdf.text(datosConvenio.anno, 231, 100); //ANNO ESCOLAR LISTO

    pdf.text(datosConvenio.nombreRepresentante, 276, 158); //NOMBRE REPRESENTANTE LISTO
    pdf.text(datosConvenio.cedulaRepresentante, 23, 170); //CEDULA REPRESENTANTE LISTO


    pdf.text(datosConvenio.apellidosEstudiante1, 20, 221); //APELLIDOS ESTUDIANTE 1 LISTO
    pdf.text(datosConvenio.nombresEstudiante1, 168, 221); //NOMBRES ESTUDIANTE 1 LISTO
    pdf.text(datosConvenio.cursoEstudiante1, 300, 221); //CURSO ESTUDIANTE 1 LISTO

    pdf.text(datosConvenio.intervalo, 61, 307); //INTERVALO MESES LISTO
    pdf.text(datosConvenio.fecha, 210, 307); //FECHA LISTO
    pdf.autoPrint();
    let a = pdf.output('datauristring');
    openDataIframe(a);
}

async function imprimirListaDeudores(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tabla-Lista-Deudores").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table th, table td {' +'border:1px solid #000; border-collapse:collapse' +'padding:0.5em;' +'} img{position: relative; margin: 0 auto;}' +'</style>');
    setTimeout(function () {
        ventanaImprimir.document.close();
        ventanaImprimir.print(); 
        ventanaImprimir.close(); 
        }, 700);
}

export async function imprimirNuevaListaDeudoresSeccion(){

    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tableNuevaListaDeudoresSeccion").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table th, table td {' +'border:1px solid #000; border-collapse:collapse' +'padding:0.1em;' +'}' +'</style>');
    setTimeout(function () {
        ventanaImprimir.document.close();
        ventanaImprimir.print(); 
        ventanaImprimir.close(); 
        }, 700);

}

async function pdfInscripcion(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaInscripcionImprimir").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print();
    setTimeout(function () {
        ventanaImprimir.close();  
        }, 1000);
}

async function pdfAgregar(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaAgregarImprimir").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print();
    setTimeout(function () {
        ventanaImprimir.close();  
        }, 1000);
}

async function pdfReinscripcion(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaReinscripcionImprimir").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print();
    setTimeout(function () {
        ventanaImprimir.close();  
        }, 1000);
}

async function pdfMensualidad(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaTicketMensualidad").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'} img{position: relative; margin: 0 auto;}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print(); 
    setTimeout(function () {
        ventanaImprimir.close(); 
        }, 700);
}

export async function imprimirTicketPreinscripcion(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaPreinscripcionImprimir").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'} img{position: relative; margin: 0 auto;}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print(); 
    setTimeout(function () {
        ventanaImprimir.close(); 
        }, 700);
}


async function pdfPagoAdministrativo(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaAdministrativoImprimir").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'} img{position: relative; margin: 0 auto;}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print(); 
    setTimeout(function () {
        ventanaImprimir.close(); 
        }, 700);
}

async function pdfVerificarTicket(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaticketVerificar").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'} img{position: relative; margin: 0 auto;}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print(); 
    setTimeout(function () {
        ventanaImprimir.close(); 
        }, 700);
}

async function pdfPagoAbono(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaTicketAbono").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'} img{position: relative; margin: 0 auto;}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print(); 
    setTimeout(function () {
        ventanaImprimir.close(); 
        }, 700);
}

async function pdfPagoAbonoNoRegistrado(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaTicketAbonoNoRegistrado").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'} img{position: relative; margin: 0 auto;}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print(); 
    setTimeout(function () {
        ventanaImprimir.close(); 
        }, 700);
}

async function pdfEdicionMensualidad(){
    let ventanaImprimir = window.open();
    let html = document.createElement("html");
    let head = document.head.cloneNode(true);
    let body = document.createElement("body");
    let section = document.getElementById("tablaTicketEdicionMensualidad").cloneNode(true);
    body.appendChild(section);
    html.appendChild(head);
    html.appendChild(body);
    ventanaImprimir.document.write(html.innerHTML);
    ventanaImprimir.document.write('<style type="text/css">' +'table{margin:0; font-size:14px} div{margin:0} table th, table td {' +'border:none; border-collapse:collapse' +'padding:0.5em;' +'} img{position: relative; margin: 0 auto;}' +'</style>');
    ventanaImprimir.document.close();
    ventanaImprimir.print(); 
    setTimeout(function () {
        ventanaImprimir.close(); 
        }, 700);
}