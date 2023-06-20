const form = document.getElementById('form') as HTMLFormElement | null;

function playIP(e: SubmitEvent): void {
  e.preventDefault();
  const res = document.getElementById('result-text') as HTMLDivElement | null;
  const res_img = document.getElementById('result-img') as HTMLImageElement | null;
  if (!form) return;
  const formData = new FormData(form);

  const p2 = Math.floor(Math.random() * 10);
  const p1 = parseInt(formData.get('num')?.toString() ?? '0');

  const op = formData.get('op')?.toString();

  if (!op || !res || !res_img) return;
  const sum = p1 + p2;
  const par = sum % 2 === 0;

  if (op === "par")
    if (par) {
      res.innerHTML = `Você ganhou! ${p1} + ${p2} = ${sum}, que é par.`;
      res_img.src = "/ex2/triste.png";
    }
    else {
      res.innerHTML = `Você perdeu :( ${p1} + ${p2} = ${sum}, que é ímpar.`;
      res_img.src = "/ex2/feliz.png";
    }
  else
    if (!par) {
      res.innerHTML = `Você ganhou! ${p1} + ${p2} = ${sum}, que é ímpar.`;
      res_img.src = "/ex2/triste.png";
    }
    else {
      res.innerHTML = `Você perdeu :( ${p1} + ${p2} = ${sum}, que é par.`;
      res_img.src = "/ex2/feliz.png";
    }

}

form?.addEventListener('submit', playIP);