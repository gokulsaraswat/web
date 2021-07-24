function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} //CHANGE THIS NUMBER to alter the board size! ❤️🔷⭐️🍀
const size = 12;



const ColorButton = props => {
  return /*#__PURE__*/(
    React.createElement("button", { className: "tile buttonTile", style: { backgroundColor: props.color.rgb }, onClick: props.handleClick }, /*#__PURE__*/
    React.createElement("span", { className: props.colorblind ? 'pop-in' : undefined }, props.color.symbol)));


};

const ColorblindToggle = props => {
  return /*#__PURE__*/(
    React.createElement("div", { className: "toggle" }, /*#__PURE__*/
    React.createElement("input", { type: "checkbox", id: "colorblindMode", checked: props.colorblind }), /*#__PURE__*/
    React.createElement("label", { htmlFor: "colorblindMode", onClick: props.handleColorblindToggle }, "Colorblind", /*#__PURE__*/React.createElement("br", null), "Mode", /*#__PURE__*/
    React.createElement("div", { className: "toggle-outer" }, /*#__PURE__*/
    React.createElement("div", { className: "toggle-inner" })))));




};

const Tile = props => {
  const { absorbed, color, colorblind, tileKey } = props;
  return /*#__PURE__*/(
    React.createElement("div", { className: absorbed ? 'absorbed tile' : 'tile', style: { backgroundColor: color.rgb }, "data-key": tileKey }, /*#__PURE__*/
    React.createElement("span", { className: colorblind && 'pop-in' }, color.symbol)));


};

class GameBoard extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "generateGameBoard",







































    () => {
      const x = this.state.boardSize;
      const board = [];
      let key = 1;
      for (let i = 0; i < x * x; i++) {
        const randomColor = Math.floor(Math.random() * this.state.colors.length);
        board.push({ color: this.state.colors[randomColor], key: key, absorbed: false });
        key++;
      }
      this.setState({
        board: board,
        currentColor: board[0].color.rgb,
        clicks: 0 });

    });_defineProperty(this, "returnSymbol",

    match => {
      let symbol;
      this.state.colors.filter(color => {
        color.rgb == match ? symbol = color.symbol : null;
      });
      return symbol;
    });_defineProperty(this, "getTheAbsorbed",









    () => {
      const size = this.state.boardSize;
      let currentPool = [];
      const roundup = () => {
        this.state.board.forEach((tile, i) => {
          if (
          (tile.color.rgb == this.state.currentColor && (

          i % size != 0 && currentPool.includes(this.state.board[i - 1]) ||
          (i + 1) % size != 0 && currentPool.includes(this.state.board[i + 1]) ||
          this.state.board[i + size] && currentPool.includes(this.state.board[i + size]) ||
          this.state.board[i - size] && currentPool.includes(this.state.board[i - size])) ||


          i === 0) &&

          !currentPool.includes(tile)) {
            currentPool.push(tile);
            roundup();
          }
        });
      };
      roundup();
      return currentPool;
    });_defineProperty(this, "propagate",

    (e, arr) => {
      const size = this.state.boardSize;
      const color = e ? e.target.style.backgroundColor : this.state.currentColor;
      const roundup = () => {
        this.state.board.forEach((tile, i) => {
          if (
          (tile.color.rgb == color && (

          i % size != 0 && arr.includes(this.state.board[i - 1]) ||
          (i + 1) % size != 0 && arr.includes(this.state.board[i + 1]) ||
          this.state.board[i + size] && arr.includes(this.state.board[i + size]) ||
          this.state.board[i - size] && arr.includes(this.state.board[i - size])) ||


          i === 0) &&

          !arr.includes(tile)) {
            arr.push(tile);
            roundup();
          }
        });
      };
      roundup();
      return arr;
    });_defineProperty(this, "handleClick",



    e => {
      const clicked = e ? e.target.style.backgroundColor : this.state.currentColor;
      const size = this.state.boardSize;
      if (clicked != this.state.currentColor || !e) {

        const prevPool = this.getTheAbsorbed();
        const currentPool = this.propagate(e, prevPool);

        const newBoard = this.state.board.map((tile, i) => {
          if (currentPool.includes(tile)) {
            return { color: { rgb: clicked, symbol: this.returnSymbol(clicked) }, key: tile.key, absorbed: true };
          } else {
            return tile;
          }
        });
        this.setState({
          board: newBoard,
          currentColor: clicked,
          clicks: e ? this.state.clicks + 1 : this.state.clicks });


        this.endgameCheck();

      } else {
        console.log('The corner is already the clicked color. Choose another.');
      }
    });_defineProperty(this, "handleColorblindToggle",

















    e => {
      e.preventDefault();
      this.setState({ colorblindMode: !this.state.colorblindMode });
    });this.state = { boardSize: size, board: [], clicks: 0, colorblindMode: false, //You could theoretically add more colors here
      colors: [{ rgb: 'rgb(255, 50, 50)', //red 
        symbol: '❤️' }, { rgb: 'rgb(24, 187, 255)', //blue 
        symbol: '🔷' }, { rgb: 'rgb(255, 224, 17)', //yellow 
        symbol: '⭐️' }, { rgb: 'rgb(51, 153, 68)', //green 
        symbol: '🍀' } // UNCOMMENT to add more (completely arbitrary)colors! 🍊🎀
      // {
      // 	rgb: 'rgb(235, 168, 11)', //orange 
      // 	symbol: '🍊'
      // },
      // {
      // 	rgb: 'rgb(255, 105, 180)', //pink 
      // 	symbol: '🎀'
      // },
      ], currentColor: '' };}componentWillMount() {this.generateGameBoard();}componentDidMount() {this.handleClick();}endgameCheck() {const size = this.state.boardSize;setTimeout(() => {const absorbed = this.state.board.filter(tile => {if (tile.color.rgb == this.state.currentColor) {return tile.color.rgb;} else {return;}});if (absorbed.length === size * size) {alert(`You won a ${size}x${size} board in ${this.state.clicks} clicks! (Hint: refresh to start a new game, or change the "size" constant at the top of the JS window to a different number!)`);}}, 200);}render() {const style = { gridTemplateColumns: `repeat(${this.state.boardSize}, 1fr)`, gridTemplateRows: `repeat(${this.state.boardSize}, 1fr)` };return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", { id: "optionsBar" }, /*#__PURE__*/React.createElement("h2", null, this.state.clicks), /*#__PURE__*/React.createElement(ColorblindToggle, { handleColorblindToggle: this.handleColorblindToggle, colorblind: this.state.colorblindMode })), /*#__PURE__*/React.createElement("div", { id: "gameBoard", style: style }, this.state.board.map(tile => {
      return /*#__PURE__*/React.createElement(Tile, { color: tile.color, key: tile.key, tileKey: tile.key, currentColor: this.state.currentColor, colorblind: this.state.colorblindMode, absorbed: tile.absorbed });
    })), /*#__PURE__*/

    React.createElement("div", { id: "buttonBoard" },
    this.state.colors.map(color => {
      return /*#__PURE__*/React.createElement(ColorButton, { color: color, handleClick: this.handleClick, key: color.rgb, size: this.state.size, colorblind: this.state.colorblindMode });
    })));



  }}


ReactDOM.render( /*#__PURE__*/React.createElement(GameBoard, null), document.querySelector('#app'));