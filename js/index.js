const agregarNota = document.querySelector(".agregar-nota");
const modal = document.querySelector(".modal");
const cerrarModal = document.querySelector(".cerrar");

const inputTitulo = document.querySelector(".modal__titulo");
const inputDescripcion = document.querySelector(".modal__descripcion");
const botonAgregar = document.querySelector("#modal__boton--agregar");
const botonEditar = document.querySelector("#modal__boton--editar");

const contenedorNotas = document.querySelector(".notas-contenedor");
const botonEliminarTodo = document.querySelector(".boton__eliminar-todo");

// abrir Modal
agregarNota.addEventListener("click", () => modalAbrir())
//cerrar Modal
cerrarModal.addEventListener("click", () => modalCerrar())

const modalAbrir = (boton) => {
    if (boton) {
        botonAgregar.style.display = "none";
        botonEditar.style.display = "block";
    } else {
        botonEditar.style.display = "none";
        botonAgregar.style.display = "block";

    }
    modal.style.display = "flex";
    cerrarModal.style.display = "block";

}

const modalCerrar = () => {
    modal.style.display = "none";
    cerrarModal.style.display = "none";
}

const obtenerFecha = () => {
    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let fecha = new Date();
    let año = fecha.getFullYear();
    let mes = meses[fecha.getMonth()];
    let dia = fecha.getDate();
    return dia + " de " + mes + " del " + año;
}

const eliminarNota = (eleEliminar) => {
    const notas = JSON.parse(localStorage.getItem('notas'));
    const posicion = buscarPosicion(notas, eleEliminar.innerHTML)
    if (confirm("¿Estás seguro de que quieres eliminar la nota?")) {
        notas.splice(posicion, 1)
        console.log(notas)
        localStorage.setItem('notas', JSON.stringify(notas))
        location.reload(true);
    }
}

const editarNota = (eleEditar) => {
    modalAbrir(true);
    listaNodos = eleEditar.childNodes
    
    inputTitulo.value = listaNodos[0].textContent;
    inputDescripcion.value = listaNodos[1].textContent;

    const notas = JSON.parse(localStorage.getItem('notas'));
    const nuevo = listaNodos[3].childNodes;
    listaNodos[3].removeChild(nuevo[1])

    botonEditar.addEventListener("click", () => {
        const posicion = buscarPosicion(notas, eleEditar.innerHTML)
        console.log(posicion)
        notas[posicion]= creandoNota().innerHTML;
        console.log(notas[posicion])
        localStorage.setItem('notas', JSON.stringify(notas));
        modalCerrar();
        location.reload(true);
    })
}

const buscarPosicion = (obj, eleEliminar) => {
    for (let i = 0; i < obj.length; i++) {
        if (obj[i] == eleEliminar) return i;
    }
}

const crearElmento = (tag, clase, cont) => {
    const elemento = document.createElement(tag);
    elemento.className = clase;
    elemento.textContent = cont;
    return elemento
}
const creandoOpciones=()=>{
    const divContenedor = crearElmento("div", "opciones__contenedor");
    const img = document.createElement("img");
    img.src = "../img/three_dots_icon.svg";

    const divOpOcultas = crearElmento("div", "opciones__ocultas");
    const pEliminar = crearElmento("p", "eliminar", "Eliminar");
    const pEditar = crearElmento("p", "editar", "Editar");

    pEditar.addEventListener("click", () => editarNota(divContenedor.parentNode.parentNode))

    pEliminar.addEventListener("click", () => eliminarNota(divContenedor.parentNode.parentNode))

    divOpOcultas.appendChild(pEditar);
    divOpOcultas.appendChild(pEliminar);

    divContenedor.appendChild(img);
    divContenedor.appendChild(divOpOcultas);
    return divContenedor
}

const creandoNota = () => {
    //Creamos nota
    const nota = crearElmento("div", "nota");
    //introducimos info de la nota
    nota.appendChild(crearElmento("h2", "nota__titulo", inputTitulo.value));
    inputTitulo.value = "";
    nota.appendChild(crearElmento("p", "nota__descripcion", inputDescripcion.value));
    inputDescripcion.value = "";
    nota.appendChild(crearElmento("hr", "nota__linea"));

    const divOpciones = crearElmento("div", "nota__opciones");
    const divFecha = crearElmento("div", "opciones__fecha", obtenerFecha());
    divOpciones.appendChild(divFecha)
    nota.appendChild(divOpciones);
    return nota;
}

botonAgregar.addEventListener("click", () => {
    const nota = creandoNota()
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    notas.push(nota.innerHTML);
    localStorage.setItem('notas', JSON.stringify(notas));

    const posicion =  nota.childNodes;
    posicion[3].appendChild(creandoOpciones());
    contenedorNotas.appendChild(nota)
    modalCerrar();
})

//cargar notas guardadas en el localStorage
function cargarNotas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem('notas')) || [];
        tareasGuardadas.forEach(nota => {
        const div = crearElmento("div", "nota",);
        div.innerHTML = nota;
        const posicion =  div.childNodes;
        posicion[3].appendChild(creandoOpciones());
        contenedorNotas.appendChild(div);
    })

}
cargarNotas()

botonEliminarTodo.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas eliminar todas las Notas?")) {
        localStorage.clear();
        location.reload(true);
    }

})
