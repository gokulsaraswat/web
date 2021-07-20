function ChessBoard({i}) {
  return (
    <div style={(i%2)?{background:"black"}:{background:"white"}}/>
  );
}

export default ChessBoard;
