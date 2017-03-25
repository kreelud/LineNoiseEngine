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
	var threatenedAvoidValue = 10; //how much this mob will try to avoid a situation where
	var overwatchAvoidValue = 10;
	var attackValue = 20;
	var attackValueFlankingBonus = 1.2;
	var rescueValue = 30;
	
	var mobs = this.field.getMobs();
	var scoreTile = function (tile)
	{
		if (this.field.tileImpassable(tile[0],tile[1],this)
		var score = 0;
		for (var c1=0,len=mobs.length;c1<len;c1++)
		{
			var otherMob = mobs[c1];
			if (otherMob.name == this.name)continue;
			//if the distance to tile is greater than 1, continue.
			if (1<Math.round(Math.sqrt(Math.pow(mob.x-tile[0],2) + Math.pow(mob.y-tile[1],2))))continue;
			if (otherMob.faction== this.faction && otherMob.bindingPoints > 0)score += rescueValue;
			else if (otherMob.faction != this.faction)
			{
				score += attackValue;
			}
		}
		return score;
	}.bind(this);
	
	var tiles = [];
	for (var c1=this.x-this.movePoints, len=this.x+this.movePoints;c1<len;c1++)
	{
		for (var c2=this.y-this.movePoints,len-this.y+this.movePoints;c2 < len;c2++)
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
	for (var c1=0,len=tiles.length;c1<len,c1++)
	{
		//make sure the tile is accessible
	}
};
