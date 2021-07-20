import './ChessBoard.css';

import ChessCell from "./ChessCell"

const range = (n) => {
  const arr = []
  for(let i = 0; i < n; i++){
    arr.push(i)
  }
  return arr
}

function ChessBoard() {
  return (
    <div className="chess-board">
      {
        range(64).map((i)=>{
          return <ChessCell i={i + ((Math.floor(i/8)%2)?1:0)}/>
        })
      }
    </div>
  );
}

export default ChessBoard;
