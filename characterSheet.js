//this will contain all the saved info about the current game, and also act as a manager class for all windows
window.characterSheet;
function CharacterSheet (gameArea)
{
	this.gameArea = gameArea;
	this.start = new StartMenu();
	this.gameArea.appendChild(this.start.html);
	//party, inventory, game status
	this.party =
	{
		'main' :
		{
			'name' : 'Pride Queen',
			'active' : true,
			'mobtype' : 'protagonist',
			'backgrounds' : [],
			'level' : 1,
			'str' : 1,
			'agi' : 1,
			'int' : 1,
			'cha' : 1,
			'xtra' : 0,
			'inventory': []
		}
	};
}
CharacterSheet.prototype.currentMap = null;

CharacterSheet.prototype.unloadMap = function ()
{
	this.gameArea.removeChild(this.currentMap.html);
	this.currentMap = null;
};
CharacterSheet.prototype.loadMap = function (map,entry,enemies)
{
	if (this.currentMap != null)
	{
		this.unloadMap();
	}
	this.currentMap = new PlayfieldGraphic(map,entry,enemies);
	this.gameArea.appendChild(this.currentMap.html);
	this.currentMap.field.modePeaceful();
	console.log(this.currentMap.field.factions);
};
CharacterSheet.prototype.saveGame = function ()
{
	var data =
	{
		
	}
};
CharacterSheet.prototype.loadGame = function (data)  //actual upload handled by the form
{
	//initialize and set the map
};

