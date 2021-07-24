//Tried auto-generating this grid to keep the syntax shorter,
//but ran into issues with object duplication (when one updates, all update),
//so I just stuck with this ¯\_(ツ)_/¯
const emptyGrid = [
	[{}, {}, {}, {}, {}, {}, {}, {}],
	[{}, {}, {}, {}, {}, {}, {}, {}],
	[{}, {}, {}, {}, {}, {}, {}, {}],
	[{}, {}, {}, {}, {}, {}, {}, {}],
	[{}, {}, {}, {}, {}, {}, {}, {}],
	[{}, {}, {}, {}, {}, {}, {}, {}]
];

const game = new Vue({
	el: "#game",

	data: () => ({
		grid: emptyGrid,
		redTurn: true, //if false, it's yellow's turn. Better to use a boolean than strings.
		gameOver: false
	}),

	//Prevent users from navigating away from a game accidentally
	mounted() {
		window.onbeforeunload = () => {
			if (this.areThereMoves) return "Are you sure you want to leave this game?";
			//if we return nothing here (just calling return;) then there will be no pop-up question at all
		};
	},

	methods: {
		dropPiece(e) {
			if (this.gameOver) return; //No more plays once the game is done
			const column = e.target.dataset.column;

			for (let i = this.grid.length - 1; i >= 0; i--) {
				if (!this.grid[i][column].color) {
					this.grid[i][column].color = this.currentTurnColor;
					this.refreshGrid();
					const isGameOver = this.victoryCheck();

					if (isGameOver) {
						this.gameOver = true;
					} else {
						this.switchTurn();
					}
					break;
				}
			}
		},

		handleMoveCursor(e, x) {
			const currentBtn = parseInt(e.target.dataset.column);
			if (!e.key) return; //Do nothing if we don't have an identified key press

			if (["ArrowRight", "ArrowDown"].includes(e.key)) {
				this.focusAdjacentBtn(e, currentBtn, 1);
			} else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
				this.focusAdjacentBtn(e, currentBtn, -1);
			} // Do nothing if the key pressed was not an arrow key
		},

		//Move focus to next or previous button
		focusAdjacentBtn(e, currentBtn, direction) {
			e.preventDefault();
			if (!direction) return;
			const adjacentBtn = document.querySelector(
				`button[data-column="${currentBtn + direction}"]`
			);
			if (adjacentBtn) {
				adjacentBtn.focus();
			} else if (direction > 0) {
				document.querySelector(`button[data-column]`).focus(); //wrap to beginning if at the end
			} else {
				document.querySelector(`button[data-column="7"]`).focus(); //wrap to end if at the beginning
			}
		},

		//Helps prevent multiple "drop" cursors when hovering after a button has focus
		handleHover(e) {
			e.target.focus();
		},

		//Adds the "drop" indicator above a hovered column
		handleSlotHover(e) {
			const column = e.target.dataset.column;
			document
				.querySelector(`#button-board button[data-column="${column}"]`)
				.focus();
		},

		switchTurn() {
			this.redTurn = !this.redTurn;
		},

		//Necessary to get Vue to recognize changes, because changes to an object in an array of objects won't trigger a re-render
		refreshGrid() {
			this.grid = [...this.grid];
		},

		getPieceIcon(color) {
			return color == "yellow" ? "⭐" : "🔴";
		},

		//Runs through all possible win scenarios (and some impossible) to see if the game is over
		victoryCheck() {
			let isGameOver = false;
			//Loop over every victory method (some impossible, to keep the code simple; hence the optional chaining)
			this.grid.forEach((row, rowIndex) => {
				row.forEach((column, colIndex) => {
					const slotColor = column.color;
					//If we already know the game is over, get outta there
					if (!slotColor || isGameOver) return;
					if (
						//Horizontal row
						(slotColor == this.grid?.[rowIndex]?.[colIndex + 1]?.color &&
							slotColor == this.grid?.[rowIndex]?.[colIndex + 2]?.color &&
							slotColor == this.grid?.[rowIndex]?.[colIndex + 3]?.color) ||
						//Vertical column
						(slotColor == this.grid?.[rowIndex - 1]?.[colIndex]?.color &&
							slotColor == this.grid?.[rowIndex - 2]?.[colIndex]?.color &&
							slotColor == this.grid?.[rowIndex - 3]?.[colIndex]?.color) ||
						//Diagonal ascending
						(slotColor == this.grid?.[rowIndex - 1]?.[colIndex + 1]?.color &&
							slotColor == this.grid?.[rowIndex - 2]?.[colIndex + 2]?.color &&
							slotColor == this.grid?.[rowIndex - 3]?.[colIndex + 3]?.color) ||
						//Diagonal descending
						(slotColor == this.grid?.[rowIndex + 1]?.[colIndex + 1]?.color &&
							slotColor == this.grid?.[rowIndex + 2]?.[colIndex + 2]?.color &&
							slotColor == this.grid?.[rowIndex + 3]?.[colIndex + 3]?.color)
					) {
						isGameOver = true;
					}
				});
			});
			return isGameOver;
		},

		startNewGame() {
			if (this.areThereMoves) {
				const areYouSure = confirm(
					"Start a new game? This one will be lost four-ever :)"
				);
				if (!areYouSure) return;
			}
			this.grid.forEach(row => {
				row.forEach(column => {
					column.color = null;
				});
			});
			this.refreshGrid();
			this.gameOver = false;
			this.redTurn = true;
		}
	},

	computed: {
		currentTurnColor() {
			return this.redTurn ? "red" : "yellow";
		},

		message() {
			if (this.isADraw) {
				return `<b style="color: inherit">DRAW!</b>`;
			} else if (this.gameOver) {
				return `<b class="${this.currentTurnColor}">${this.currentTurnColor} WINS! 🎉</b>`;
			} else {
				return `<b class="${this.currentTurnColor}">${this.currentTurnColor}</b>’s turn`;
			}
		},

		//Monitor whether at least one move has been made
		areThereMoves() {
			let moves = false;
			this.grid.forEach(row => {
				row.forEach(column => {
					if (column.color) moves = true;
				});
			});
			return moves;
		},

		//Monitor whether the board is full and the game is not over
		isADraw() {
			let draw = true;
			this.grid.forEach(row => {
				row.forEach(column => {
					if (!column.color) draw = false;
				});
			});
			return draw;
		}
	}
});
