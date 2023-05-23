const result = document.getElementById('result');

const enum Options {
  Rock = 'pedra',
  Paper = 'papel',
  Scissors = 'tesoura'
}

function play(event: Event) {
  event.preventDefault();
  if (!result) return;
  const formData = new FormData(event.target as HTMLFormElement);
  
  const player1 = formData.get('op')?.toString() as Options | undefined;

  const player2rng = Math.floor(Math.random() * 3);
  const player2 = [Options.Paper, Options.Rock, Options.Scissors][player2rng];

  const p1 = document.getElementById('p1') as HTMLImageElement | null;
  const p2 = document.getElementById('p2') as HTMLImageElement | null;

  if (p1) p1.src = `${player1}.png` ?? (() => { throw new Error('Jogada invalida') })();
  if (p2) p2.src = `${player2}.png` ?? (() => { throw new Error('Jogada invalida') })();

  if (player1 === player2) result.innerText = 'Empate';
  else if (player1 === Options.Rock && player2 === Options.Scissors) result.innerText = 'Você venceu!';
  else if (player1 === Options.Paper && player2 === Options.Rock) result.innerText = 'Você venceu!';
  else if (player1 === Options.Scissors && player2 === Options.Paper) result.innerText = 'Você venceu! ';
  else result.innerText = 'Computador venceu';
}


document.getElementById('form')?.addEventListener('submit', play);