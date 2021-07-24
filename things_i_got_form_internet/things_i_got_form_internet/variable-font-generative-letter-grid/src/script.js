const darkGray = "#53565a";
const white = "#fff";
const yellow = "#ffd100";
const orange = "#ff6a13";
const lightBlue = "#7ba7bc";
const darkBlue = "#34657f";
const lightGray = "#a7a8aa";

const app = new Vue({
	el: "#app",
	data: () => ({
		grid: undefined,
		gridSize: undefined,
		characters:
			"àåabcdeéêfghijklmnñoöpqrstuvwxyzAÀBCDEÉFGHIJKLMNÑÖOPQRSTUVWXYZ0123456789!π¢£ø@#$%^&*()+{}?”“;",
		colors: [
			{ bg: white, fg: darkGray },
			{ bg: white, fg: orange },
			{ bg: white, fg: darkBlue },
			{ bg: white, fg: lightBlue },
			{ bg: yellow, fg: darkGray },
			{ bg: orange, fg: darkGray },
			{ bg: lightBlue, fg: darkBlue },
			{ bg: darkBlue, fg: white },
			{ bg: darkBlue, fg: lightBlue },
			{ bg: lightGray, fg: white },
			{ bg: darkGray, fg: yellow }
		],
		colorize: true,
		changeCharOnClick: true,
		changeCharOnHover: false,
		fancyCharShuffle: false,
		isToolbarOpen: false,
		serifPercentage: 30,
		blankPercentage: 10,
		roundPercentage: 10
	}),
	mounted() {
		window.addEventListener("resize", e => this.regenerateGrid());
		this.regenerateGrid();
		if (Modernizr.touch) this.changeCharOnClick = false;
	},
	methods: {
		setGridSize() {
			const cellSize = 70;
			const gridWidth = Math.floor(window.innerHeight / cellSize);
			const gridHeight = Math.floor(window.innerWidth / cellSize);
			const finalCellCount = gridWidth * gridHeight + gridWidth * 3;

			this.gridSize = finalCellCount;
			return finalCellCount;
		},
		regenerateGrid(closeMenu) {
			clearTimeout(this.nextShuffle);
			clearTimeout(this.unfade);

			this.fadeCells();

			this.nextShuffle = setTimeout(() => {
				this.resetGrid();
			}, 800);

			this.unfade = setTimeout(() => {
				this.fadeCells(true);
			}, 800);
			if (closeMenu === true) this.isToolbarOpen = false;
		},
		resetGrid() {
			this.setGridSize();
			this.grid = [];
			let filled = 0;
			while (filled < this.gridSize) {
				const cell = this.generateRandomCell();
				const { size } = cell;
				const squared = size * size;
				const leftToFill = this.gridSize - filled;

				if (leftToFill > squared) {
					this.grid.push(cell);
					filled += squared;
				} else {
					for (i = 0; i < leftToFill; i++) {
						this.grid.push({ ...cell, size: 1 });
						filled += 1;
					}
				}
			}
			this.$nextTick(() => {
				this.fadeCells(true);
			});
		},
		fadeCells(out) {
			const cells = document.querySelectorAll(".cell");
			if (out === true) {
				this.$nextTick(() => {
					cells.forEach(cell => {
						const delay = this.d100() * 4;
						setTimeout(() => {
							cell.classList.remove("fade");
						}, delay);
					});
				});
			} else {
				cells.forEach(cell => {
					const delay = this.d100() * 4;
					setTimeout(() => {
						cell.classList.add("fade");
					}, delay);
				});
			}
		},
		generateRandomCell() {
			return {
				char: this.getRandomChar(),
				size: this.setCellSize(),
				serif: this.d100(),
				blank: this.d100(),
				round: this.d100(),
				color: this.setCellColor(),
				weight: this.setCellWeight()
			};
		},
		getRandomChar() {
			return this.characters[Math.floor(Math.random() * this.characters.length)];
		},
		hoverLetter(e) {
			const weight = parseInt(e.target.dataset.weight);
			const randomColor = this.randomColor();
			e.target.classList.add("hovered");
			if (weight > 200) {
				e.target.dataset.weight = 200;
				e.target.style.backgroundColor = this.colorize && white;
				e.target.style.color = darkGray;
			} else {
				e.target.dataset.weight = 900;
				e.target.style.backgroundColor = this.colorize && randomColor.bg;
				e.target.style.color = this.colorize && randomColor.fg;
			}
			if (this.changeCharOnHover) {
				this.randomLetter(e);
			}
		},
		randomLetter(e) {
			if (!this.changeCharOnClick) return;
			if (!this.fancyCharShuffle) {
				e.target.innerText = this.getRandomChar();
			} else {
				let delay = 18;
				for (i = 0; i < 10; i++) {
					setTimeout(() => {
						e.target.innerText = this.getRandomChar();
					}, delay);
					delay += delay * 0.4;
				}
			}
		},
		toggleToolbar() {
			this.isToolbarOpen = !this.isToolbarOpen;
		},
		//Set a random size for a cell. The bigger, the more rare.
		setCellSize() {
			const size = this.d100();
			if (size === 100 && window.innerWidth > 1600) return 5;
			if (size > 97 && window.innerWidth > 900) return 4;
			if (size > 92) return 3;
			if (size > 80) return 2;
			return 1;
		},
		setCellDelay() {
			const delay = this.d100();
			return delay * 5;
		},
		setCellColor() {
			const colorOdds = this.d100();
			return colorOdds > 40 ? this.randomColor() : this.colors[0];
		},
		setCellWeight() {
			const weight = this.d100();
			return weight < 70 ? 200 : 900;
		},
		randomColor() {
			return this.colors[Math.floor(Math.random() * this.colors.length)];
		},
		d100() {
			return Math.floor(Math.random() * 100 + 1);
		},
		cellNumberToSize(no) {
			if (no === 5) return "xxl";
			if (no === 4) return "xl";
			if (no === 3) return "l";
			if (no === 2) return "m";
			return "s";
		},
		getCellClasses(cell) {
			let classes = [];
			if (cell.serif < this.serifPercentage) classes.push("serif");
			if (cell.round < this.roundPercentage) classes.push("round");
			classes.push(this.cellNumberToSize(cell.size));
			return classes.join(" ");
		}
	},
	computed: {
		menuBtnText() {
			return this.isToolbarOpen ? "×" : "›";
		}
	}
});
