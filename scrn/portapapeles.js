/*global document, setTimeout, console */

export {cedulaCopiada,
        asignarCedulaCopiada,
        mostrarMensajeCedulaCopiada,
        copiarAlPortapapelesCedulaDatosSeccion,
        pegarContenidoPortapapeles};

let cedulaCopiada = "";

function asignarCedulaCopiada(cedula){
    cedulaCopiada = cedula;
}

async function mostrarMensajeCedulaCopiada(){
    document.getElementById("modalMensajeCopiado").style.display = "block";
    document.getElementById("modalMensajeCopiado").style.opacity = 1;
    setTimeout(ocultarMensajeCedulaCopiada, 3500);
    setTimeout(function(){
        document.getElementById("modalMensajeCopiado").style.display = "none";
    }, 5000);
}

/*

2500MS para que se active





*/

async function ocultarMensajeCedulaCopiada(){
    document.getElementById("modalMensajeCopiado").style.opacity = 0;
}

function copiarAlPortapapelesCedulaDatosSeccion(){
    let cedula = this.parentNode.children[0].textContent;
    asignarCedulaCopiada(cedula);
    mostrarMensajeCedulaCopiada();
}

function pegarContenidoPortapapeles(){
    this.parentNode.children[0].value = cedulaCopiada;
}

function desaparecer(){
    document.getElementById("modalMensajeCopiado").style.opacity = 0;
}

document.getElementById("modalMensajeCopiado").addEventListener("click", desaparecer);