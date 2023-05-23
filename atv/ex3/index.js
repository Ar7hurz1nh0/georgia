"use strict";
const result = document.getElementById('result');
function play(event) {
    event.preventDefault();
    if (!result)
        return;
    const formData = new FormData(event.target);
    const player1 = formData.get('op')?.toString();
    const player2rng = Math.floor(Math.random() * 3);
    const player2 = ["papel", "pedra", "tesoura"][player2rng];
    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    if (p1)
        p1.src = `/georgia/atv/ex3/${player1}.png` ?? (() => { throw new Error('Jogada invalida'); })();
    if (p2)
        p2.src = `/georgia/atv/ex3/${player2}.png` ?? (() => { throw new Error('Jogada invalida'); })();
    if (player1 === player2)
        result.innerText = 'Empate';
    else if (player1 === "pedra" && player2 === "tesoura")
        result.innerText = 'Você venceu!';
    else if (player1 === "papel" && player2 === "pedra")
        result.innerText = 'Você venceu!';
    else if (player1 === "tesoura" && player2 === "papel")
        result.innerText = 'Você venceu! ';
    else
        result.innerText = 'Computador venceu';
}
document.getElementById('form')?.addEventListener('submit', play);
