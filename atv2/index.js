"use strict";
const main = document.querySelector('main');
class Card {
    name;
    canPlay = false;
    isFlipped = false;
    cards = [];
    total = 0;
    hasPlayed = false;
    callback;
    constructor(name) {
        this.name = name;
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = name;
        card.innerHTML = '<div class="card" id="{name}"><div class="front" data-card="{name}" data-action="round"><h1>{name}</h1><div><span><span class="card-value-field" data-card="{name}" data-action="value">0</span><span class="card-value-field" data-card="{name}">x</span></span><span class="material-symbols-outlined">playing_cards</span></div><div class="bottom-card"><button class="card-btn" data-action="add" data-card="{name}"><span class="material-symbols-outlined">add</span></button><button class="card-btn" data-action="skip" data-card="{name}"><span class="material-symbols-outlined">block</span></button><button class="card-btn" data-action="flip" data-card="{name}"><span class="material-symbols-outlined">rotate_right</span></button></div></div><div class="back"><h1>{name}</h1><p>Valor total:</p><p class="card-value-field" data-card="{name}" data-action="final">0</p><p class="card-value-field" data-card="{name}" data-action="status"></p></div></div>'.replaceAll('{name}', name);
        main?.appendChild(card);
        document.querySelector(`button[data-card="${this.name}"][data-action="add"]`)?.addEventListener('click', this.add.bind(this));
        document.querySelector(`button[data-card="${this.name}"][data-action="skip"]`)?.addEventListener('click', this.skip.bind(this));
        document.querySelector(`button[data-card="${this.name}"][data-action="flip"]`)?.addEventListener('click', this.flip.bind(this));
    }
    flip() {
        if (this.isFlipped || !this.canPlay)
            return;
        this.isFlipped = true;
        document.getElementById(this.name)?.classList.add('flip');
        const status = document.querySelector(`p[data-action="status"][data-card="${this.name}"]`) ?? { innerHTML: "" };
        status.innerHTML = 'Aguardando...';
        this.endRound();
    }
    add() {
        if (this.isFlipped || !this.canPlay)
            return;
        const value = Math.floor(Math.random() * 10) + 1;
        this.cards.push(value);
        document.querySelector(`span[data-action="value"][data-card="${this.name}"]`).innerHTML = this.cards.length.toString();
        this.total += value;
        document.querySelector(`p[data-action="final"][data-card="${this.name}"]`).innerHTML = this.total.toString();
        this.endRound();
    }
    skip() {
        if (this.isFlipped || !this.canPlay)
            return;
        this.endRound();
    }
    doRound(cb) {
        if (this.isFlipped || this.canPlay)
            return;
        else {
            this.canPlay = true;
            this.callback = cb;
        }
    }
    endRound() {
        this.canPlay = false;
        this.hasPlayed = true;
        this.callback?.();
        this.callback = undefined;
    }
}
class Game {
    cards;
    constructor(cards) {
        this.cards = cards;
        document.querySelector(`div[data-card="${this.cards[0]?.name}"][data-action="round"]`)?.attributes.setNamedItem(document.createAttribute('data-selected'));
        cards[0]?.doRound(this.nextRound.bind(this));
    }
    nextRound() {
        const closest = this.cards.reduce((prev, curr) => {
            return (Math.abs(curr.total - 21) < Math.abs(prev.total - 21) ? curr : prev);
        });
        const difference = Math.abs(closest.total - 21);
        if (this.cards.filter(card => !card.isFlipped).length === 0) {
            let winners = [];
            this.cards.forEach(card => Math.abs(card.total - 21) === difference && winners.push(card));
            if (winners.length > 1) {
                document.querySelectorAll('p[data-action="status"]').forEach(el => el.innerHTML = 'Você perdeu!');
                winners.forEach(winner => {
                    const el = document.querySelector(`p[data-action="status"][data-card="${winner.name}"]`) ?? { innerHTML: "", parentElement: undefined };
                    el.innerHTML = 'Empate!';
                    el.parentElement?.classList.add('winner');
                });
            }
            else {
                document.querySelectorAll('p[data-action="status"]').forEach(el => el.innerHTML = 'Você perdeu!');
                const winner = document.querySelector(`p[data-action="status"][data-card="${closest.name}"]`) ?? { innerHTML: "", parentElement: undefined };
                winner.innerHTML = 'Você ganhou!';
                winner.parentElement?.classList.add('winner');
            }
        }
        else if (this.cards.filter(card => !card.isFlipped && !card.hasPlayed).length !== 0) {
            document.querySelectorAll(`div[data-action="round"][data-selected]`).forEach(el => el.attributes.removeNamedItem('data-selected'));
            const round = this.cards.filter(card => !card.isFlipped && !card.hasPlayed)[0];
            document.querySelector(`div[data-card="${round?.name}"][data-action="round"]`)?.attributes.setNamedItem(document.createAttribute('data-selected'));
            round?.doRound(this.nextRound.bind(this));
        }
        else {
            this.cards.filter(card => !card.isFlipped).forEach(card => card.hasPlayed = false);
            document.querySelectorAll(`div[data-action="round"][data-selected]`).forEach(el => el.attributes.removeNamedItem('data-selected'));
            const round = this.cards.filter(card => !card.isFlipped && !card.hasPlayed)[0];
            document.querySelector(`div[data-card="${round?.name}"][data-action="round"]`)?.attributes.setNamedItem(document.createAttribute('data-selected'));
            round?.doRound(this.nextRound.bind(this));
        }
    }
}
const mainCards = [];
const mainInput = document.getElementById('main-input');
const mainBtn = document.getElementById('main-btn');
const mainAddBtn = document.getElementById('main-add-btn');
mainAddBtn?.addEventListener('click', () => {
    if (!mainInput?.value)
        return;
    mainCards.push(new Card(mainInput.value));
});
mainBtn?.addEventListener('click', () => {
    void new Game(mainCards);
    mainInput?.remove();
    mainBtn?.remove();
    mainAddBtn?.remove();
});
