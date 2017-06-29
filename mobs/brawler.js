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
	console.log('brawler ai started ');
	var attackValue = 20;
	var rescueValue = 30;
	
	//decide what move to do
	var adjacents = [];
	
	if (this.remainingMoves <= 0)this.performMove('wait',null);//for now, just have it walk at the player
	
	var mobs = this.field.getMobs();  //todo: change to known mobs
	var scoreTile = function (tile)
	{
		if (this.field.tileImpassable(tile[0],tile[1],this))return -1;
		var score = 0;
		var action = 'wait';
		var target = null;
		var targetMob = null;
		for (var c1=0,len=mobs.length;c1<len;c1++)
		{
			var otherMob = mobs[c1];
			if (otherMob.name == this.name)continue;
			//if the distance to tile is greater than 1, continue.
			if (1<Math.round(Math.sqrt(Math.pow(otherMob.x-tile[0],2) + Math.pow(otherMob.y-tile[1],2))))continue;
			//figure out ideal action
			if (otherMob.faction==this.faction && otherMob.bindingPoints>0)
			{
				score += rescueValue;//for each 
				if (action!='rescue')
				{
					action = 'rescue';
					targetMob = otherMob;
				}
			}
			else if (otherMob.faction!=this.faction)
			{
				score = Math.max(attackValue,score);  //unlike rescue, score is not additive
				//TODO: factor in flanking advantage
				if (action=='wait')
				{
					action = 'punch';
					targetMob = otherMob;
				}
			}
		}
		return score;
	}.bind(this);
	
	var tiles = [];
	for (var c1=this.x-this.remainingMoves, len=this.x+this.remainingMoves;c1<=len;c1++)
	{
		for (var c2=this.y-this.remainingMoves,len=this.y+this.remainingMoves;c2<=len;c2++)
		{
			tiles.push([c1,c2]);
		}
	}
	//score the tiles
	for (var c1=0,len=tiles.length;c1<len;c1++)
	{
		tiles[c1].push(scoreTile(tiles[c1]));
	}
	//sort the tiles
	tiles.sort(function (a,b){return b[2]-a[2];});
	//go through tiles best first until a suitable one is found
	var pathFound = false;
	console.log('brawler ai tiles'+tiles.length);
	for (var c1=0,len=tiles.length;c1<len;c1++)
	{
		var thisTile = tiles[c1];
		
		//make sure the tile is accessible
		var path = this.field.astar([this.x,this.y],[thisTile[0],thisTile[1]],this); //TODO: limit
		if (!path)continue;
		//if it is, set it as the path
		this.currentPath = path;
		if (this.currentPath.length>0)
		{
			pathFound = true;
			var first = this.currentPath.shift();
			this.performMove('walk',first);
			break;
		}
	}
	if (!pathFound)this.performMove('wait',null);		//default to 'wait'
};
