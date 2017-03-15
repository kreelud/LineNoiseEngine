//load assets
loadImage ('priestess_stand','assets/priestess/stand.png');

var walkFolders = ['N','S','E','W'];
for (var c1=0;c1<walkFolders.length;c1++)
{
	var folder = 'assets/priestess/walk'+walkFolders[c1];
	for (var c2=0;c2<=12;c2++)
	{
		var num = c2.toString();
		while (num.length<4)num = "0"+num;
		loadImage('walk'+walkFolders[c1].toLowerCase()+c2,folder+'/'+num+".png");
	}
}

function Mob_VenusianPriestess ()
{
	var parent = new Mob();
	var keys = Object.keys(parent);
	var readyToMove = false; //used when under player control
	for (var c1=0;c1<keys.length;c1++)this[keys[c1]] = parent[keys[c1]];
	
	
	this.lastMove = 'wait';
	this.getSprite = function ()
	{
		var time = Date.now();
		time = Math.floor(time / 50);
		var frame = time % 13;
		
		return [{'x':this.x,'y':this.y,'img':imageLibrary['walk'+this.facing+frame.toString()],'layer':50}];
		//return [{'x':this.x,'y':this.y,'img':imageLibrary['priestess_stand'],'layer':50}];
	};
	this.ai = function (info)
	{
		
	};
}
