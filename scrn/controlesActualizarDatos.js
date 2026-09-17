/*global document */

export {entrarActualizarDatos,
        atrasActualizarDatos, 
        paginaAnteriorActualizar, 
        paginaSiguienteActualizar,
        limpiarFormulariosActualizar, 
        acomodarArrayListaEstudiantesActualizar,
        escribirFormularioDigitalRepresentanteActualizar,
        escribirFormularioDigitalEstudianteActualizar
};

let arrayPaginasActualizar = ["actualizarPG1", "actualizarPG2"];

function entrarActualizarDatos(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("mainContainerActualizarDatos").style.display = "block";
}

function atrasActualizarDatos(){
    document.getElementById("mainContainerActualizarDatos").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    limpiarFormulariosActualizar();
}

function eliminarPaginasExtraFormulariosActualizar(){
    let tabla = document.getElementsByClassName("subcajaFormularioActualizarDerecha");
    while(true){
        if(tabla.length > 2){
            document.getElementById("contenedorActualizarDatos").removeChild(document.getElementById("contenedorActualizarDatos").children[document.getElementById("contenedorActualizarDatos").children.length - 2]);
        }
        else{
            break;
        }
    }
    arrayPaginasActualizar = ["actualizarPG1", "actualizarPG2"];
    document.getElementById("PgListaActualizar").textContent = 1;
  }
  
  function limpiarFormulariosRepresentanteActualizar(){
    let formulario = document.getElementsByClassName("subcajaFormularioActualizarDerecha")[0];
    formulario.children[0].value = "";
    formulario.children[1].value = "";
    formulario.children[2].value = "";
    formulario.children[3].value = "";
    formulario.children[4].selectedIndex = 0;
    formulario.children[5].value = "";
    formulario.children[6].value = "";
    formulario.children[7].value = "";
    formulario.children[8].value = "";
    formulario.children[9].value = "";
  }
  
  function limpiarFormulariosEstudianteActualizar(){
    let formulario = document.getElementsByClassName("subcajaFormularioActualizarDerecha")[1];
    formulario.children[0].value = "";
    formulario.children[1].value = "";
    formulario.children[2].value = "";
    formulario.children[3].selectedIndex = 0;
    formulario.children[4].selectedIndex = 0;
    formulario.children[5].selectedIndex = 0;
    formulario.children[6].selectedIndex = 0;
    formulario.children[7].value = "";
    formulario.children[8].value = "";
    formulario.children[9].selectedIndex = 0;
    formulario.children[10].value = "";
  }
  
  function ocultarSelectsCursoActualizarEstudiante(){
    let cursoSelect = document.getElementsByClassName("subcajaFormularioActualizarDerecha")[1].children[5];
    for(let i = 1; i <= cursoSelect.children.length - 1; i++){
        cursoSelect.children[i].style.display = "none";
    }
  }
  
  function limpiarFormulariosActualizar(){ //ESTA VA EXPORTADA
    eliminarPaginasExtraFormulariosActualizar();
    limpiarFormulariosRepresentanteActualizar();
    limpiarFormulariosEstudianteActualizar();
    ocultarSelectsCursoActualizarEstudiante();
    document.getElementById("actualizarPG1").style.display = "block";
    document.getElementById("actualizarPG2").style.display = "none";
    document.getElementById("actualizarAtras").style.visibility = "hidden";
    document.getElementById("actualizarSiguiente").style.visibility = "visible";
    document.getElementById("actualizarAgregar").style.display = "none";
    document.getElementById("cedulaRepresentanteActualizarDatos").value = "";
  }





  function paginaSiguienteActualizar(){
    let paginaActual = document.getElementById("PgListaActualizar").textContent;
    paginaActual = parseInt(paginaActual);
    let nombreIdPagina = arrayPaginasActualizar[paginaActual - 1];
    document.getElementById(arrayPaginasActualizar[paginaActual - 1]).style.display = "none";
    document.getElementById(arrayPaginasActualizar[paginaActual]).style.display = "block";
    document.getElementById("PgListaActualizar").textContent = paginaActual + 1;
    document.getElementById("actualizarAtras").style.visibility = "visible";
    document.getElementById("actualizarSiguiente").style.visibility = "visible";    
    if(arrayPaginasActualizar[arrayPaginasActualizar.length - 1] == arrayPaginasActualizar[paginaActual]){
        document.getElementById("actualizarSiguiente").style.visibility = "hidden";     
    }
}

function paginaAnteriorActualizar(){
    let paginaActual = document.getElementById("PgListaActualizar").textContent;
    paginaActual = parseInt(paginaActual);
    let nombreIdPagina = arrayPaginasActualizar[paginaActual - 1];
    document.getElementById(arrayPaginasActualizar[paginaActual - 1]).style.display = "none";
    document.getElementById(arrayPaginasActualizar[paginaActual - 2]).style.display = "block";
    document.getElementById("PgListaActualizar").textContent = paginaActual - 1;
    document.getElementById("actualizarSiguiente").style.visibility = "visible";   
    document.getElementById("actualizarAtras").style.visibility = "visible";
    document.getElementById("actualizarAgregar").style.display = "none";
    if(arrayPaginasActualizar[0] == arrayPaginasActualizar[paginaActual - 2]){
        document.getElementById("actualizarAtras").style.visibility = "hidden";
    }
}

function escribirFormularioDigitalRepresentanteActualizar(datosRepresentante){
    document.getElementById("contenedorActualizarDatos").style.display = "none";
    let formularios = document.getElementsByClassName("subcajaFormularioActualizarDerecha");
    formularios[0].children[0].value = datosRepresentante.nombres;
    formularios[0].children[1].value = datosRepresentante.apellidos;
    formularios[0].children[2].value = datosRepresentante.cedula;
    formularios[0].children[3].value = datosRepresentante.telefono;
    if(datosRepresentante.tipoRepresentante == "Regular") formularios[0].children[4].selectedIndex = 1;
    if(datosRepresentante.tipoRepresentante == "Empleado"){
      formularios[0].children[4].selectedIndex = 2;
    } 
    formularios[0].children[5].value = datosRepresentante.direccionRepresentante;
    formularios[0].children[6].value = datosRepresentante.nombrePadre;
    formularios[0].children[7].value = datosRepresentante.cedulaPadre;
    formularios[0].children[8].value = datosRepresentante.nombreMadre;
    formularios[0].children[9].value = datosRepresentante.cedulaMadre;
    document.getElementById("contenedorActualizarDatos").style.display = "flex";
}

function escribirFormularioDigitalEstudianteActualizar(datosEstudiante, numero, flag){
    let nuevaPagina = document.createElement("div");
    let h1 = document.createElement("h1");
    let cajaLabels = document.createElement("div");
    let cajaContenedora = document.createElement("div");
    let cajaInputs = document.createElement("div");
    let gradoArray = ["Grado de Instrucción", "Preescolar", "Primaria", "Bachillerato"];
    let cursoArray = ["Curso", "Primer Nivel", "Segundo Nivel", "Tercer Nivel", "Primer Grado", 
    "Segundo Grado", "Tercer Grado", "Cuarto Grado", "Quinto Grado", "Sexto Grado", 
    "Primer Año", "Segundo Año", "Tercer Año", "Cuarto Año", "Quinto Año"];
    let seccionArray = ["Sección", "Sección A", "Sección B"];
    let estadoArray = ["Estado", "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas",
        "Bolívar", "Carabobo", "Cojedes", "Delta Amacuro", "Dependencias Federales",
        "Distrito Federal", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", "Monagas",
        "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"];
    let labelNombres = document.createElement("label");
    let labelApellidos = document.createElement("label");
    let labelCedula = document.createElement("label");
    let labelSexo = document.createElement("label");
    let labelFecha = document.createElement("label");
    let labelLugar = document.createElement("label");
    let labelEstado = document.createElement("label");
    let labelDirección = document.createElement("label");
    let labelGrado = document.createElement("label");
    let labelCurso = document.createElement("label");
    let labelSeccion = document.createElement("label");
    let inputNombres = document.createElement("input");
    let inputApellidos = document.createElement("input");
    let inputCedula = document.createElement("input");
    let inputSexo = document.createElement("select");
    let inputGrado = document.createElement("select");
    let inputCurso = document.createElement("select");
    let inputSeccion = document.createElement("select");
    let inputFecha = document.createElement("input");
    let inputLugar = document.createElement("input");
    let inputEstado = document.createElement("select");
    let inputDireccion = document.createElement("input");
    labelNombres.textContent = "Nombres";
    labelApellidos.textContent = "Apellidos";
    labelCedula.textContent = "Cédula de Identidad";
    labelSexo.textContent = "Sexo";
    labelFecha.textContent = "Fecha de Nacimiento";
    labelLugar.textContent = "Lugar de Nacimiento";
    labelEstado.textContent = "Estado";
    labelDirección.textContent = "Dirección";
    labelGrado.textContent = "Grado de Instrucción";
    labelCurso.textContent = "Curso";
    labelSeccion.textContent = "Sección";
    inputNombres.type = "text";
    inputNombres.placeholder = "Nombres";
    inputNombres.value = datosEstudiante.nombres;
    inputApellidos.type = "text";
    inputApellidos.placeholder = "Apellidos";
    inputApellidos.value = datosEstudiante.apellidos;
    inputCedula.type = "number";
    inputCedula.placeholder = "Cédula";
    inputCedula.value = datosEstudiante.cedula;
    for(let i = 0; i <= 2; i++) inputSexo.appendChild(document.createElement("option"));
    inputSexo.children[0].textContent = "Sexo";
    inputSexo.children[1].textContent = "Masculino";
    inputSexo.children[2].textContent = "Femenino";
    if(datosEstudiante.sexo == "Masculino") inputSexo.selectedIndex = 1;
    if(datosEstudiante.sexo == "Femenino") inputSexo.selectedIndex = 2;
    inputSexo.disabled = true;
    for(let i = 0; i <= 3; i++) inputGrado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 3; i++) inputGrado.children[i].textContent = gradoArray[i];
    inputGrado.disabled = true;
    for(let i = 0; i <= 14; i++) inputCurso.appendChild(document.createElement("option"));
    for(let i = 0; i <= 14; i++) inputCurso.children[i].textContent = cursoArray[i];
    for(let i = 1; i <= 3; i++) inputCurso.children[i].className = "curso-preescolar";
    for(let i = 4; i <= 9; i++) inputCurso.children[i].className = "curso-primaria";
    for(let i = 10; i <= 14; i++) inputCurso.children[i].className = "curso-bachillerato";
    for(let i = 0; i <= 2; i++) inputSeccion.appendChild(document.createElement("option"));
    for(let i = 0; i <= 2; i++) inputSeccion.children[i].textContent = seccionArray[i];

    inputCurso.disabled = true;
    inputSeccion.disabled = true;

    //ASIGNACION DE LA SECCION DEL ESTUDIANTE

    for(let i = 0; i <= 3; i++){
        if(inputGrado.children[i].textContent == datosEstudiante.grado){
            inputGrado.selectedIndex = i;
        }
    }

    for(let i = 0; i <= 14; i++){
        if(inputCurso.children[i].textContent == datosEstudiante.curso){
            inputCurso.selectedIndex = i;
        }
    }

    for(let i = 0; i <= 2; i++){
        if(inputSeccion.children[i].textContent == datosEstudiante.seccion){
            inputSeccion.selectedIndex = i;
        }
    }


    inputFecha.type = "date";
    inputFecha.value = datosEstudiante.fechaNacimiento;
    inputLugar.type = "text";
    inputLugar.placeholder = "Lugar de Nacimiento";
    inputLugar.value = datosEstudiante.lugarNacimiento;
    for(let i = 0; i <= 25; i++) inputEstado.appendChild(document.createElement("option"));
    for(let i = 0; i <= 25; i++) inputEstado.children[i].textContent = estadoArray[i];
    for(let i = 0; i <= 25; i++){
        if(estadoArray[i] == datosEstudiante.estado){
            inputEstado.selectedIndex = i;
        }
    }
    inputDireccion.type = "text";
    inputDireccion.placeholder = "Dirección";
    inputDireccion.value = datosEstudiante.direccion;
    cajaLabels.classList.add("subcajaFormularioInscripcion");
    cajaInputs.classList.add("subcajaFormularioActualizarDerecha");
    cajaLabels.appendChild(labelNombres);
    cajaLabels.appendChild(labelApellidos);
    cajaLabels.appendChild(labelCedula);
    cajaLabels.appendChild(labelSexo);
    cajaLabels.appendChild(labelGrado);
    cajaLabels.appendChild(labelCurso);
    cajaLabels.appendChild(labelSeccion);
    cajaLabels.appendChild(labelFecha);
    cajaLabels.appendChild(labelLugar);
    cajaLabels.appendChild(labelEstado);
    cajaLabels.appendChild(labelDirección);
    cajaInputs.appendChild(inputNombres);
    cajaInputs.appendChild(inputApellidos);
    cajaInputs.appendChild(inputCedula);
    cajaInputs.appendChild(inputSexo);
    cajaInputs.appendChild(inputGrado);
    cajaInputs.appendChild(inputCurso);
    cajaInputs.appendChild(inputSeccion);
    cajaInputs.appendChild(inputFecha);
    cajaInputs.appendChild(inputLugar);
    cajaInputs.appendChild(inputEstado);
    cajaInputs.appendChild(inputDireccion);
    h1.textContent = "Datos Estudiante";
    h1.className = "centradoNoFlex";
    cajaContenedora.appendChild(cajaLabels);
    cajaContenedora.appendChild(cajaInputs);
    cajaContenedora.className = "cajaFormularioInscripcion";
    nuevaPagina.appendChild(h1);
    nuevaPagina.appendChild(cajaContenedora);
    nuevaPagina.className = "oculto";
    nuevaPagina.id = "actualizarPG" + (numero + 1);
    document.getElementById("contenedorActualizarDatos").insertBefore(nuevaPagina, document.getElementById("actualizarPG" + numero).nextSibling);
  }

  function acomodarArrayListaEstudiantesActualizar(){
      arrayPaginasActualizar = [];
      let formularios = document.getElementsByClassName("subcajaFormularioActualizarDerecha");
      for(let i = 0; i <= formularios.length - 1; i++){
        arrayPaginasActualizar.push(formularios[i].parentNode.parentNode.id);
      }
      document.getElementById("PgListaActualizar").textContent = "1";
      document.getElementById("actualizarAtras").style.visibility = "hidden";
  }