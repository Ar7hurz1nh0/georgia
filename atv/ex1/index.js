"use strict";
function rndNumber(max) {
    return Math.floor(Math.random() * max);
}
const res = document.getElementById("resultado");
const btn = document.getElementById("btn");
function genList() {
    if (res === null)
        return console.warn("Elemento não encontrado");
    const num = Array(6)
        .fill(0)
        .map(() => rndNumber(60))
        .map((n) => n < 10 ? `0${n}` : n.toString())
        .map((n) => `<li class="ball">${n}</li>`);
    res.innerHTML = num.join("");
}
