class Jugador {
    nombre;
    color;

    constructor(nombre, color) {
        this.nombre = nombre;
        this.color = color;
    }
}

let jugador1;
let jugador2;
let turnoActual;         
const filas = 6;
const columnas = 7;
let tableroLogico = [];
const botonPlay = document.getElementById("botonPlay");



window.addEventListener("load", prepararEventos);

function prepararEventos() {
    botonPlay.addEventListener("click", iniciarJuego);
}

function iniciarJuego(evento) {
    if (evento){
        evento.preventDefault();
    }

    const nombre1 = document.getElementById("p1-name").value || "Jugador 1";
    const nombre2 = document.getElementById("p2-name").value || "Jugador 2";
    const color1 = document.getElementById("p1-color").value || "#00ffff";
    const color2 = document.getElementById("p2-color").value || "#ff00ff";

    jugador1 = new Jugador(nombre1, color1);
    jugador2 = new Jugador(nombre2, color2);

    turnoActual = 1;

    tableroLogico = [];
    for (let f = 0; f < filas; f++) {
        const fila = [];
        for (let c = 0; c < columnas; c++) {
            fila.push(0); 
        }
        tableroLogico.push(fila);
    }

    dibujarZonaJuego();
}


function dibujarZonaJuego() {
    const contenedor = document.getElementById("zonaJuego");
    contenedor.innerHTML = "";

    const cabecera = document.createElement("div");
    cabecera.id = "cabeceraJuego";
    cabecera.className = "cabecera_juego";

    const spanJ1 = document.createElement("span");
    spanJ1.id = "jugador1Cabecera";
    spanJ1.textContent = jugador1.nombre;

    const spanVS = document.createElement("span");
    spanVS.textContent = " VS ";

    const spanJ2 = document.createElement("span");
    spanJ2.id = "jugador2Cabecera";
    spanJ2.textContent = jugador2.nombre;

    cabecera.appendChild(spanJ1);
    cabecera.appendChild(spanVS);
    cabecera.appendChild(spanJ2);
    contenedor.appendChild(cabecera);

    resaltarTurno();

    const tabla = document.createElement("table");
    tabla.id = "tablero";

    for (let f = 0; f < filas; f++) {
        const elementoFila = document.createElement("tr");

        for (let c = 0; c < columnas; c++) {
            const celda = document.createElement("td");
            celda.className = "celda";
            celda.dataset.fila = f;
            celda.dataset.columna = c;
            elementoFila.appendChild(celda);
        }

        tabla.appendChild(elementoFila);
    }

    tabla.addEventListener("click", manejarClickTablero);

    contenedor.appendChild(tabla);
}


function resaltarTurno() {
    const span1 = document.getElementById("jugador1Cabecera");
    const span2 = document.getElementById("jugador2Cabecera");

    span1.classList.remove("turno");
    span2.classList.remove("turno");

    if (turnoActual === 1) {
        span1.classList.add("turno");
    } else {
        span2.classList.add("turno");
    }
}


function manejarClickTablero(evento) {
    const celda = evento.target.closest(".celda");
    if (!celda){
        return;
    }  

    const columna = parseInt(celda.dataset.columna);
    colocarFicha(columna);
}


function colocarFicha(columna) {
    for (let f = filas - 1; f >= 0; f--) {
        if (tableroLogico[f][columna] === 0) {
            tableroLogico[f][columna] = turnoActual;
            pintarFicha(f, columna);

            if (comprobarVictoria(f, columna, turnoActual)) {
                anunciarVictoria();
                return;
            }

            if (tableroLleno()) {
                anunciarEmpate();
                return;
            }

            if (turnoActual === 1) {
                turnoActual = 2; 
            } else {
                turnoActual = 1; 
            }
            resaltarTurno();
            return;
        }
    }

    alert("La columna está llena. Elige otra columna.");
}


function pintarFicha(fila, columna) {
    const selector = 'td.celda[data-fila="' + fila + '"][data-columna="' + columna + '"]';
    const fichaVisual = document.querySelector(selector);

    let color;
    if (turnoActual === 1) {
        color = jugador1.color;
    } else {
        color = jugador2.color;
    }
    fichaVisual.style.backgroundColor = color;
    fichaVisual.style.boxShadow = "0 0 18px " + color;
}


function comprobarVictoria(fila, columna, jugadorNum) {
    if (contarDireccion(fila, columna, 0, 1, jugadorNum) +
        contarDireccion(fila, columna, 0, -1, jugadorNum) - 1 >= 4) {
        return true;
    }

    if (contarDireccion(fila, columna, 1, 0, jugadorNum) +
        contarDireccion(fila, columna, -1, 0, jugadorNum) - 1 >= 4) {
        return true;
    }

    if (contarDireccion(fila, columna, 1, 1, jugadorNum) +
        contarDireccion(fila, columna, -1, -1, jugadorNum) - 1 >= 4) {
        return true;
    }

    if (contarDireccion(fila, columna, -1, 1, jugadorNum) +
        contarDireccion(fila, columna, 1, -1, jugadorNum) - 1 >= 4) {
        return true;
    }

    return false;
}

function contarDireccion(fila, columna, deltaFila, deltaColumna, jugadorNum) {
    let cuenta = 0;
    let f = fila;
    let c = columna;

    while (f >= 0 && f < filas && c >= 0 && c < columnas &&
           tableroLogico[f][c] === jugadorNum) {
        cuenta++;
        f += deltaFila;
        c += deltaColumna;
    }

    return cuenta;
}


function tableroLleno() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tableroLogico[f][c] === 0) {
                return false;
            }
        }
    }
    return true;
}

function mostrarBotonReiniciar() {
    botonPlay.textContent = "Jugar de Nuevo"; 
}


function anunciarVictoria() {
    let ganador;
    if (turnoActual === 1) {
        ganador = jugador1;
    } else {
        ganador = jugador2;
    }

    
    const cabecera = document.getElementById("cabeceraJuego");

    cabecera.innerHTML = ""; 
    
    const mensajeFinal = document.createElement("span");
    mensajeFinal.classList.add("ganador"); 
    mensajeFinal.textContent = "¡GANADOR: " + ganador.nombre + "!";

    cabecera.appendChild(mensajeFinal);
    mostrarBotonReiniciar();
    deshabilitarTablero();
}


function anunciarEmpate() {
    const cabecera = document.getElementById("cabeceraJuego");
    cabecera.innerHTML = ""; 

    const mensajeFinal = document.createElement("span");
    mensajeFinal.classList.add("ganador");
    mensajeFinal.textContent = "¡EMPATE! Tablero lleno.";

    cabecera.appendChild(mensajeFinal);
    mostrarBotonReiniciar();
    deshabilitarTablero();
}


function deshabilitarTablero() {
    const tabla = document.getElementById("tablero");
    if (tabla) {
        tabla.removeEventListener("click", manejarClickTablero);
    }
}
