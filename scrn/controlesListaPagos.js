/*global document */

export {mostrarPagosRecibidos, atrasListaDePagos, atrasListaPagosError};

function mostrarPagosRecibidos(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-PagosRecibidos").style.display = "block";
}

function atrasListaDePagos(){
    document.getElementById("main-container-PagosRecibidos").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    let tablaPagos = document.getElementById("tablaDatosPagos");
    tablaPagos.removeChild(tablaPagos.lastChild);
}

function atrasListaPagosError(){
    document.getElementById("main-container-PagosRecibidos").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    let tablaPagos = document.getElementById("tablaDatosPagos");
    while(tablaPagos.hasChildNodes()){
        tablaPagos.removeChild(tablaPagos.lastChild);
    }
}