//a modal to save, load, set options
function GameModal ()
{
	Modal.call(this);
	var buttons = ['newgame','save','load','character'];
	this.buttons = [];
	for (var c1=0,len=buttons.length;c1<len;c1++)
	{
		var thisButton = buttons[c1];
		var thisDiv = document.createElement('div');
		this.buttons[thisButton] = document.createElement('button');
		this.buttons[thisButton].innerHTML = TextBank.words[thisButton];
		thisDiv.appendChild(this.buttons[thisButton]);
		this.contentWindow.appendChild(thisDiv);
	}
}
GameModal.prototype = Object.create(Modal.prototype);
