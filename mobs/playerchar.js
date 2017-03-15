
function PlayerChar ()
{
	var parent = new Mob();
	var keys = Object.keys(parent);
	
	for (var c1=0;c1<keys.length;c1++)this[keys[c1]] = parent[keys[c1]];
	this.fetchKeyboard = function (event)
	{
		//check window.keypresses and call registermove
	};
	document.addEventListener('keydown',this.fetchKeyboard);
	document.addEventListener('keyup',this.fetchKeyboard);
	
	this.getMove = function (info){}; //has no meaning for player characters (unless maybe some status effect?)
}
