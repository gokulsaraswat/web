// Want to see your own message appear? 
// Just change the message value!
const message = `Machines can measure things a user will never notice, and users will notice things a machine can never measure.

If a user thinks your site is slow, a speed test won't convince them otherwise.`;


// Want to use this in your own code? Just copy and paste everything here, but change the value of the "container" variable (currently '#target') to match your chosen target DOM element.
// Also be sure the target element has the right white-space CSS in your code.
const container = document.querySelector('#target');




let n;

function rerun(){
	container.textContent = '';
	n = 0;
	typist(message, container);
};

rerun();

function interval(letter){
	console.log(letter);
	if(letter == ';' || letter == '.' || letter == ','){
		return Math.floor((Math.random() * 500) + 500);
	} else {
		return Math.floor((Math.random() * 130) + 5);
	}
}

function typist(text, target){
	if(typeof(text[n]) != 'undefined'){
		target.textContent += text[n];
	}
	n++;
	if(n < text.length){
		setTimeout(function(){
			typist(text, target)
		}, interval(text[n - 1]));
	} 
}

