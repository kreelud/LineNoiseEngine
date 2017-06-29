//this will contain all the saved info about the current game
window.characterSheet;
function CharacterSheet ()
{
	//party, inventory, game status
	this.characterInfo =
	{
		'name' : 'Pride Queen',
		'backgrounds' : [],
		'level' : 1,
		'str' : 1,
		'agi' : 1,
		'int' : 1,
		'cha' : 1,
		'xtra' : 0,
		'inventory': []
	};
}
CharacterSheet.prototype.currentMap = null;

CharacterSheet.prototype.saveGame = function ()
{
	var data =
	{
		
	}
}
CharacterSheet.prototype.loadGame = function (data)  //actual upload handled by the form
{
	//initialize and set the map
}

