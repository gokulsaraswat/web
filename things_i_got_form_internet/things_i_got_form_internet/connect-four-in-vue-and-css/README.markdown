# Connect Four in Vue and CSS

A Pen created on CodePen.io. Original URL: [https://codepen.io/collinsworth/pen/MWwXpLd](https://codepen.io/collinsworth/pen/MWwXpLd).

The classic game of Connect Four in Vue and Sass. Play by either clicking a slot, or using the keyboard.

I tried to make the game as accessible as I could, given the nature of it. The pen uses emoji and contrasted colors to be as colorblind-accessible as possible. It's also keyboard accessible (use tab or arrow keys to select your moves), and uses aria labels and a status role for communication with assistive technologies.

I wish the drop animation was a little smoother, but going fast and being choppy (with `steps()`) seemed to be the only way to simulate the pieces falling _inside_ the board rather than in front of it, since there's no well-supported way to cut circles out of a shape just in CSS. (I didn't want to create an SVG board.)

Pen uses JavaScript optional chaining from ES2020 (the `?.` operator) to get by with a lot of its loop logic that wouldn't work otherwise—at least, not without adding in a lot of conditionals. This allows the pen to check for impossible win conditions and not have to worry about the edges of the board. (For example: without optional chaining, before checking for a vertical win, you'd have to make sure you had at least four slots from the top of the board to your current position. Optional chaining allows you to bypass that requirement and safely check wins of any kind from anywhere on the board, and ignore any errors that might pop up from non-existent slots outside the board's edges.)
