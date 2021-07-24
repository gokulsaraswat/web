// Change this if you want the possibility of longer or shorter puzzles.
const maxLength = 40; // (Typically, the lower this number, the harder the puzzle.)

//Change this if you want more or fewer strikes allowed
const allowedStrikes = 3; //If you set this and maxLength both too high, the puzzle will be impossible to lose.

const defaultStrikes = new Array(allowedStrikes).fill({ icon: '⚪', guess: '' });

const app = new Vue({
  el: "#app",
  data: () => ({
    letters: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    quotes: [], //Filled by the mounted hook
    currentQuote: '', //Filled by the mounted hook
    quoteAuthor: '',
    guesses: [],
    strikes: [...defaultStrikes],
    gameOver: false }),

  mounted() {
    fetch('https://type.fit/api/quotes').
    then(response => response.json()).
    then(fetchedQuotes => {
      fetchedQuotes = fetchedQuotes.filter(quote => quote.text.length <= maxLength); // Get rid of any quotes that are too long
      this.quotes = fetchedQuotes;
      this.pickAQuote();
    });
  },
  methods: {
    //Can enter guesses with a keyboard, but it doesn't work super great because you need to be focusing a non-disabled element to use it currently. Needs some refinement.
    handleKeyPress(e) {
      const key = e.key.toUpperCase();
      if (key.length === 1 && key.match(/[a-zA-Z]/) && !this.guesses.includes(key)) {
        console.log(key);
        this.guess(key);
      }
    },
    pickAQuote() {
      console.log(this.quotes);
      const random = Math.floor(Math.random() * this.quotes.length);
      this.currentQuote = this.quotes[random].text.toUpperCase();
      this.quoteAuthor = this.quotes[random].author;
    },
    //The function that turns unguessed letters into blank spots
    isRevealed(letter) {
      if (!letter.match(/[a-zA-Z\s]/)) {
        return letter;
      }
      return this.guesses.includes(letter) || this.gameOver ? letter : '_';
    },
    //Handles the guess and all possible results
    guess(letter) {
      console.log(letter);
      this.guesses.push(letter);
      if (!this.currentQuote.includes(letter)) {
        this.strikes.pop();
        this.strikes = [{ icon: '🚫', guess: letter }, ...this.strikes];
      }
      if (this.strikeout || this.puzzleComplete) {
        this.gameOver = true;
        if (this.puzzleComplete) fireEmAll();
      }
    },
    newGame() {
      const confirmation = confirm('End this game and start a new one?');
      if (!confirmation) return;
      this.pickAQuote();
      this.guesses = [];
      this.strikes = [...defaultStrikes];
      this.gameOver = false;
    } },

  computed: {
    splitQuote() {
      return this.currentQuote.split(' ');
    },
    badGuesses() {
      return this.strikes.filter(s => s.guess).map(s => s.guess);
    },
    strikeout() {
      return this.badGuesses.length >= allowedStrikes;
    },
    puzzleComplete() {
      return this.unrevealed === 0;
    },
    unrevealed() {
      return [...this.currentQuote].filter(letter => {
        return letter.match(/[a-zA-Z]/) && !this.guesses.includes(letter);
      }).length;
    },
    message() {
      if (!this.gameOver) {
        return '☝️ Pick a letter';
      } else if (this.strikeout) {
        return '❌ You lost this round. Try again?';
      } else if (this.puzzleComplete) {
        return '🎉 You win!';
      }
      //You can never be too safe ¯\_(ツ)_/¯
      return '😬 Unforeseen error state, maybe try a new game?';
    } } });




//Confetti! 🎉
//All the below code is just for the confetti. Could've brought it into Vue but didn't seem like there was any real reason to. Library is linked in the HTML tab's header settings.
let count = 200;
let defaults = {
  origin: { y: 0.5 },
  colors: ['#ffd100', '#a7a8aa', '#ff6a13', '#e4002b', '#7ba7bc', '#34657f'] };


const fire = (particleRatio, opts) => {
  confetti(
  Object.assign({}, defaults, opts, {
    particleCount: Math.floor(count * particleRatio) }));


};

const fireEmAll = () => {
  fire(0.25, {
    spread: 26,
    startVelocity: 55 });

  fire(0.2, {
    spread: 60 });

  fire(0.35, {
    spread: 100,
    decay: 0.91 });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92 });

  fire(0.1, {
    spread: 120,
    startVelocity: 45 });

};