function pascal(element, rows) {
  let header = 'none';
  let output = '';
  let arr = [];

  for (let i = 0; i < rows; i++) {
    let cells = []; let total = 0;
    for (let j = 0; j <= i; j++) {
      let s = (j === 0 || j === i) ? 1 : parseInt(arr[i-1][j] + arr[i-1][j-1]);
      cells.push(s);
      total = total + s;
    };
    arr.push(cells);
    if (i === 1) { header = 'natural'; }
    if (i === 2) { header = 'triangular'; }
    if (i === 3) { header = 'tetrahedral'; }
    if (i === 4) { header = 'pentalope'; }
    if (i > 4) { header = `${i + 1} simplex`; }
    output += `<div class="r"><i>${total}</i><b>${cells.join('</b><b>')}</b><em data-index="${i}">${header}</em></div>`;
  }
  element.innerHTML = output;
  element.onclick=function(e){
    if (e.target.nodeName === 'B' && parseInt(e.target.innerText)%5 === 0) e.target.classList.toggle('o');
    if (e.target.nodeName === 'EM') { element.classList.toggle(`r${e.target.dataset.index}`); }
  }
}
pascal(document.querySelector('.app') ,20)