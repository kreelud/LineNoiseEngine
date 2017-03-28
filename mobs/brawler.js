//fist equipped enemy  
function Brawler(x, y, faction)
{
	Mob.call(this, x, y, faction);
	this.img = MobSprites.Sentinel.bind(this);
}

Brawler.prototype.name = "brawler"+Math.round(Math.random() * 10);
Brawler.prototype = Object.create(Mob.prototype);

Brawler.prototype.ai = function()
{
	var attackValue = 20;
	var rescueValue = 30;
	
	var mobs = this.field.getMobs();
	var scoreTile = function (tile)
	{
		if (this.field.tileImpassable(tile[0],tile[1],this)
		var score = 0;
		var action = 'wait';
		var target = null;
		var targetMob = null;
		for (var c1=0,len=mobs.length;c1<len;c1++)
		{
			var otherMob = mobs[c1];
			if (otherMob.name == this.name)continue;
			//if the distance to tile is greater than 1, continue.
			if (1<Math.round(Math.sqrt(Math.pow(mob.x-tile[0],2) + Math.pow(mob.y-tile[1],2))))continue;
			//figure out ideal action
			if (mob.faction==this.faction && mob.bindingPoints>0)
			{
				score += rescueValue;//for each 
				if (action!='rescue')
				{
					action = 'rescue';
					targetMob = mob;
				}
			}
			else if (mob.faction!=this.faction)
			{
				score = Math.max(attackValue,score);  //unlike rescue, score is not additive
				//TODO: factor in flanking advantage
				if (action=='wait')
				{
					action = 'punch';
					targetMob = mob;
				}
			}
		}
		return score;
	}.bind(this);
	
	var tiles = [];
	for (var c1=this.x-this.movePoints, len=this.x+this.movePoints;c1<=len;c1++)
	{
		for (var c2=this.y-this.movePoints,len-this.y+this.movePoints;c2<=len;c2++)
		{
			tiles.push([c1,c2]);
		}
	}
	//score the tiles
	for (var c1=0,len=tiles.length;c1<len,c1++)
	{
		tiles[c1].push(scoreTile(tiles[c1]));
	}
	//sort the tiles
	tiles.sort(function (a,b){return b[2]-a[2];});
	//go through tiles best first until a suitable one is found
	var pathFound = false;
	for (var c1=0,len=tiles.length;c1<len,c1++)
	{
		var thisTile = tiles[c1];
		//make sure the tile is accessible
		var path = this.field.astar(thisTile[0],thisTile[c1][1],this); //TODO: limit
		if (!path)continue;
		//if it is, set it as the path
		this.currentPath = path;
		pathFound = true;
		break;
	}
	if (!pathFound)
	{
		//default to 'wait'
	}
};
