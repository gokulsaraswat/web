// 👀 Change the "ratio" value below to alter the board size

const app = new Vue({
  el: '#board',

  data() {
    return {
      ratio: 4, //👈 A little buggy at some sizes; works best at 4, but ¯\_(ツ)_/¯
      tiles: [],
      solution: [],
      illegalMoves: [],
      invertSwipe: false,
      showNumbers: false,
      invertNumbers: false,
      dimTiles: false,
      imageSelect: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/240751/sanfran.jpg',
      customImage: 'https://ih0.redbubble.net/image.369334182.5732/flat,1000x1000,075,f.u2.jpg',
      showSolution: true,
      gameStarted: false };

  },

  watch: {
    tiles(newTiles) {
      if (this.gameStarted) {
        //We need nextTick here or the board will render legal moves based on where the empty tile *used to* be
        this.$nextTick(() => {
          const legalMoves = this.getLegalMoves();
          newTiles.forEach((tile, index) => {
            newTiles[index].isPossibleMove = legalMoves.includes(index) ? true : false;
          });
        });
      }
    },

    customImage() {
      document.querySelector('.root').style.setProperty('--backgroundImage', `url(${this.customImage})`);
    },

    imageSelect() {
      document.querySelector('.root').style.setProperty('--backgroundImage', this.imageSelect === 'custom' ? `url(${this.customImage})` : `url(${this.imageSelect})`);
    } },


  created() {//Generate a board, an answer, and a list of illegal moves based on this.ratio
    const max = this.ratioSquared;
    for (i = 0; i < max; i++) {
      this.tiles.push(i === max - 1 ? { val: '', isPossibleMove: false } : { val: i + 1, isPossibleMove: false });
      this.solution.push(i === max - 1 ? { val: '', isPossibleMove: false } : { val: i + 1, isPossibleMove: false });
      if (i % this.ratio == 0) {
        this.illegalMoves.push(i + (i - 1));
      }
    }
  },

  mounted() {//Set styles for any board size properly and randomize it to start		
    //Set up swipe
    const innerBoard = document.getElementById('innerBoard');
    const touchBoard = new Hammer(innerBoard);

    touchBoard.get('swipe').set({
      direction: Hammer.DIRECTION_ALL });


    touchBoard.on('swipeup swipedown swipeleft swiperight', e => {
      this.handleClick(e);
    });

    //Set the ratio and background image in CSS
    document.querySelector('.root').style.setProperty('--ratio', this.ratio);
    document.querySelector('.root').style.setProperty('--backgroundImage', this.imageSelect === 'custom' ? `url(${customImage})` : `url(${this.imageSelect})`);

    //Prevent arrow keys from scrolling
    innerBoard.addEventListener("keydown", function (e) {
      // space and arrow keys
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    }, false);

    this.randomizeBoard();
  },

  computed: {
    randomMoveQty() {
      return this.ratio * 75;
    },

    howManyCorrect() {
      const correctlyPlacedTiles = this.tiles.filter((tile, index) => {
        return Number(tile.val) == Number(index + 1) || Number(index + 1) == this.ratioSquared && !tile.val;
      });

      if (correctlyPlacedTiles.length === this.ratioSquared && this.gameStarted === true) {
        setTimeout(() => {
          alert('YOU WIN! Click the "re-shuffle" button to start a new game (or adjust the ratio to get crazy)!');
        }, 200);
      }

      return correctlyPlacedTiles.length;
    },

    ratioSquared() {
      return this.ratio * this.ratio;
    } },


  methods: {
    isTileCorrect(val, index) {
      return val - 1 == index;
    },

    highlightInput(e) {
      e.target.select();
    },

    getBackgroundPosition(val) {
      return val ? `${100 / (this.ratio - 1) * (val - 1)}% ${Math.floor((val - 1) / this.ratio) * (100 / (this.ratio - 1))}%` : '5% 5%';
    },

    moveIsNotTheSameTile(a, b) {
      return a != b; //Can't shuffle a tile with itself
    },

    moveIsInBounds(a, b) {
      //Don't let the user try to move a tile outside the board
      return a >= 0 && b >= 0 && a < this.ratioSquared && b < this.ratioSquared;
    },

    moveIsAdjacentTile(a, b) {
      //Tiles are either next to each other or above/below each other
      return a + b === 1 || a - b === 1 || b - a === 1 ||
      //…And we avoid the loophole where it LOOKS like the move is valid even though it's not because the two indexes are small enough they add up to the board size
      a + b == this.ratio && a - b >= this.ratio || a - b == this.ratio || b - a == this.ratio;
    },

    moveIsNotCrossRowHorizontal(a, b) {
      //Eliminates "adjacent" values on separate rows, like 4 -> 5 on a 4 × 4 grid
      return (a - b === 1 || b - a === 1) && !this.illegalMoves.includes(a + b) || a - b !== 1 && b - a !== 1;
    },

    isValidMove(a, b) {
      a = Number(a);
      b = Number(b);
      if (this.moveIsNotTheSameTile(a, b) && this.moveIsInBounds(a, b) && this.moveIsAdjacentTile(a, b) && this.moveIsNotCrossRowHorizontal(a, b)) {
        return true;
      }

      return false;
    },

    randomizeBoard() {
      let randomized = this.randomMoveQty;
      let shuffleSpeed = 10;
      this.gameStarted = false;

      const randomMove = () => {
        if (randomized > 0) {
          const a = this.getEmptyTileIndex();
          const b = this.generateRandomMove(a);

          if (!this.isValidMove(a, b)) {
            randomMove();
          } else {
            this.swap(a, b);
            randomized--;
            if (randomized > 0) {
              this.$nextTick(() => randomMove());
            } else {
              this.gameStarted = true;
              this.focusEmptyTile();
              document.querySelector('.root').style.setProperty('--transition', 'transform .15s ease-out');
              return;
            }
          }
        }
      };

      setTimeout(() => {
        randomMove();
      }, 100);
    },

    getLegalMoves() {
      const emptyIndex = this.getEmptyTileIndex();
      const possibleMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - this.ratio, emptyIndex + this.ratio];
      const legalMoves = possibleMoves.filter(index => {
        return this.isValidMove(index, emptyIndex);
      });
      return legalMoves;
    },

    isPossibleMove(index) {
      return this.getLegalMoves().includes(index) ? 'possible-move' : '';
    },

    generateRandomMove(x) {
      x = Number(x);
      const move = Math.floor(Math.random() * this.ratio);
      if (move === 0) {
        return x - 1;
      } else if (move === 1) {
        return x + 1;
      } else if (move === 2) {
        return x - this.ratio;
      } else if (move === 3) {
        return x + this.ratio;
      }
    },

    getAccessibleTilePosition(val, index) {
      let tileIdentifier = val ? `Tile ${val}` : `Empty tile`;
      return `${tileIdentifier} ${val - 1 === index ? 'correctly placed' : ''} in position ${index + 1}: row ${Math.floor(index / this.ratio) + 1}, column ${index % this.ratio + 1}`;
    },

    focusEmptyTile() {
      this.$nextTick(() => this.$refs.empty[0].focus());
    },

    getEmptyTileIndex() {
      return this.$refs.empty ? Number(this.$refs.empty[0].getAttribute('index')) : this.ratioSquared - 1;
    },

    handleArrow(e) {
      const emptyIndex = this.getEmptyTileIndex();
      let clickedIndex;

      if (e.which === 37) {
        clickedIndex = emptyIndex - 1;
      } else if (e.which === 38) {
        clickedIndex = emptyIndex - this.ratio;
      } else if (e.which === 39) {
        clickedIndex = emptyIndex + 1;
      } else if (e.which === 40) {
        clickedIndex = emptyIndex + this.ratio;
      } else {
        return;
      }

      if (this.isValidMove(emptyIndex, clickedIndex)) {
        this.swap(emptyIndex, clickedIndex);
        this.gameStarted && this.focusEmptyTile();
      }
    },

    handleClick(e) {
      e.preventDefault();
      //Get the empty tile and the clicked tile, then both of their index values
      const emptyIndex = this.getEmptyTileIndex();
      const wasSwipe = e.type && e.type.includes('swipe');
      let clicked;
      let clickedIndex;

      if (wasSwipe) {
        if (e.type === 'swiperight') {
          clickedIndex = this.invertSwipe ? emptyIndex + 1 : emptyIndex - 1;
        } else if (e.type === 'swipeleft') {
          clickedIndex = this.invertSwipe ? emptyIndex - 1 : emptyIndex + 1;
        } else if (e.type === 'swipeup') {
          clickedIndex = this.invertSwipe ? emptyIndex - this.ratio : emptyIndex + this.ratio;
        } else if (e.type === 'swipedown') {
          clickedIndex = this.invertSwipe ? emptyIndex + this.ratio : emptyIndex - this.ratio;
        }
      } else {
        clicked = e.target;
        clickedIndex = Number(clicked.getAttribute('index'));
      }

      if (!(emptyIndex || clickedIndex)) {
        return; //If we don't have a valid index value for both the empty tile and the clicked tile, exit early
      }

      //Check if the clicked move is valid
      if (this.isValidMove(emptyIndex, clickedIndex)) {
        //Shuffle the two tiles if it's a valid move
        this.swap(emptyIndex, clickedIndex);
        //Focus the empty tile if it was a click or keyboard move
        this.gameStarted && !wasSwipe && this.focusEmptyTile();
      } else {
        return; //If it's not a valid move, do nothing
      }
    },

    swap(clickedIndex, emptyIndex) {
      const a = this.tiles[clickedIndex];
      const b = this.tiles[emptyIndex];
      this.$set(this.tiles, clickedIndex, b);
      this.$set(this.tiles, emptyIndex, a);
    } } });