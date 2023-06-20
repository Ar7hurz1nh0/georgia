const main = document.querySelector('main');

class Card {
  public canPlay: boolean = false;
  public isFlipped: boolean = false;
  public cards: number[] = [];
  private callback?: () => void;
  constructor(
    public name: string,
  ) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = name;
    card.innerHTML = '<div class="card" id="{name}"><div class="front" data-card="{name}" data-action="round"><h1>{name}</h1><div><span><span class="card-value-field" data-card="{name}" data-action="value">0</span><span class="card-value-field" data-card="{name}">x</span></span><span class="material-symbols-outlined">playing_cards</span></div><div class="bottom-card"><button class="card-btn" data-action="add" data-card="{name}"><span class="material-symbols-outlined">add</span></button><button class="card-btn" data-action="skip" data-card="{name}"><span class="material-symbols-outlined">block</span></button><button class="card-btn" data-action="flip" data-card="{name}"><span class="material-symbols-outlined">rotate_right</span></button></div></div><div class="back"><h1>{name}</h1><p>Valor total:</p><p class="card-value-field" data-card="{name}" data-action="final">0</p><p class="card-value-field" data-card="{name}" data-action="status"></p></div></div>'.replaceAll('{name}', name);
    main?.appendChild(card);
    document.querySelector(`button[data-card="${this.name}"][data-action="add"]`)?.addEventListener('click', this.add.bind(this));
    document.querySelector(`button[data-card="${this.name}"][data-action="skip"]`)?.addEventListener('click', this.skip.bind(this));
    document.querySelector(`button[data-card="${this.name}"][data-action="flip"]`)?.addEventListener('click', this.flip.bind(this));
  }
  public flip() {
    if (this.isFlipped || !this.canPlay) return;
    this.isFlipped = true;
    document.getElementById(this.name)?.classList.add('flip');
    const status = document.querySelector(`p[data-action="status"][data-card="${this.name}"]`) ?? { innerHTML: "" };
    if (this.cards.reduce((a, b) => a + b, 0) === 21)
      status.innerHTML = 'Você ganhou!';
    else status.innerHTML = 'Você perdeu!';
    this.endRound();
  }
  public add() {
    if (this.isFlipped || !this.canPlay) return;
    const value = Math.floor(Math.random() * 10) + 1;
    this.cards.push(value);
    document.querySelector(`span[data-action="value"][data-card="${this.name}"]`)!.innerHTML = this.cards.length.toString();
    document.querySelector(`p[data-action="final"][data-card="${this.name}"]`)!.innerHTML = this.cards.reduce((a, b) => a + b, 0).toString();
    this.endRound();
  }
  public skip() {
    if (this.isFlipped || !this.canPlay) return;
    this.endRound();
  }
  public doRound(cb: () => void) {
    if (this.isFlipped || this.canPlay) return;
    else {
      this.canPlay = true;
      this.callback = cb;
    }
  }
  private endRound() {
    this.canPlay = false;
    this.callback?.();
    this.callback = undefined;
  }
}

class Game {
  private round: number = 0;
  constructor(
    public cards: Card[],
  ) {
    document.querySelector(`div[data-card="${this.cards[this.round]?.name}"][data-action="round"]`)?.attributes.setNamedItem(document.createAttribute('data-selected'));
    cards[0]?.doRound(this.nextRound.bind(this));
  }

  private nextRound() {
    document.querySelector(`div[data-card="${this.cards[this.round]?.name}"][data-action="round"]`)?.attributes.removeNamedItem('data-selected')
    this.round++;
    if (this.round > this.cards.length - 1) this.round = 0;
    document.querySelector(`div[data-card="${this.cards[this.round]?.name}"][data-action="round"]`)?.attributes.setNamedItem(document.createAttribute('data-selected'));
    if (this.cards[this.round]?.isFlipped) {
      this.nextRound();
    }
    else this.cards[this.round]?.doRound(this.nextRound.bind(this));
  }
}

const mainCards: Card[] = [];

const mainInput = document.getElementById('main-input') as HTMLInputElement | null;
const nameList = document.getElementById('name-list') as HTMLUListElement | null;
const mainBtn = document.getElementById('main-btn');

mainInput?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    mainCards.push(new Card(mainInput.value));
  }
})

mainBtn?.addEventListener('click', () => {
  void new Game(mainCards);
  mainInput?.remove();
  mainBtn?.remove();
})