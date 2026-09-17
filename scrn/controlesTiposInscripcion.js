/*global document */

function entrarReinscribirEstudiante(){
    document.getElementById("main-container-TiposInscripcion").style.display = "none";
    document.getElementById("mainContainerInscribirEstudiante").style.display = "block";
    document.getElementById("menuReinscribir").style.display = "flex";
    document.getElementById("cedulaRepresentanteReinscribir").value = "";
    obtenerPrecioInscripcion();
}