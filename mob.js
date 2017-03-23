// Abstract class
function Mob (x, y, faction)
{
	this.x = x;
	this.y = y;
	this.faction = faction;
}

Mob.prototype.name = "mob";
Mob.prototype.knownMobs = {}; //mob, time
Mob.prototype.mobMemoryTurns = 3;
Mob.prototype.mobMemoryTime = 5000;
Mob.prototype.fieldOfView = (19 * Math.PI) / 30;
Mob.prototype.visionRange = 8;
Mob.prototype.facing = 1; //like a dial pad
Mob.prototype.movesPerTurn = 5;
Mob.prototype.remainingMoves = 5;
Mob.prototype.attackedThisTurn = false;
Mob.prototype.animationQueue=[];
Mob.prototype.animationStart = 0;
Mob.prototype.status = "ok";
Mob.prototype.currentPath = []; //if the mob has a path, it will follow it when prompted to move.

Mob.prototype.currentMove = '';
Mob.prototype.currentMoveTime=0;

Mob.prototype.lastHit = ''; //the last move this mob was affected by
Mob.prototype.lastHitTime = '';

Mob.prototype.angleTable = {'1':(0.75 * Math.PI),
							'2':(0.5 * Math.PI),
							'3':(0.25*Math.PI),
							'4':Math.PI,
							'6':0,
							'7':(1.25*Math.PI),
							'8':(1.5 * Math.PI),
							'9':(1.75*Math.PI)
							};

Mob.prototype.facingAngle = function()
{
	return this.angleTable[this.facing];
};

Mob.prototype.faceTile = function (x,y)
{
	//get the angle of the tile
	var xDiff = x-this.x;
	var yDiff = y-this.y;
		
	var circle = Math.PI * 2;
	var angle = (Math.atan2(yDiff,xDiff) + circle) % circle;
	//round to the nearest 0.25 * Math.PI
	//Math.round(angle / (0.25 * Math.PI)) * (0.25 * Math.PI); <-feels like this approach risks rounding errors
	
	var facings = Object.keys(this.angleTable);
	this.facing = '1';
	var bestFacingDiff = Math.abs(this.angleTable['1'] - angle);
	for (var c1=0,len=facings.length;c1<len;c1++)
	{
		var diff = Math.abs(this.angleTable[facings[c1]] - angle);
		if (diff < bestFacingDiff)
		{
			this.facing = facings[c1];
			bestFacingDiff = diff;
		}
	}
	this.field.mobLook(this);
};

Mob.prototype.animationComplete = function() //called by mobsprite
{
	this.currentMove = ''; 
	this.field.mobAnimationComplete(this);
};

Mob.prototype.refresh = function()
{
	this.remainingMoves = this.movesPerTurn;
	this.attackedThisTurn = false;
};

//each mob has a 'library' of animations
Mob.prototype.getSprite = function()
{
	return [{'x':this.x,'y':this.y,'img':imageLibrary['priestess_walk1'],'z':50}];
};

Mob.prototype.wantsCombat = function()
{
	return false;
};
Mob.prototype.endTurn = function ()
{
	this.remainingMoves = 0;
	this.attackedThisTurn = true;
	var known = Object.keys(this.knownMobs);
	for (var c1=0,len=known.length;c1<len;c1++)
	{
		this.knownMobs[known[c1]]--;
		if (this.knownMobs[known[c1]] <= 0)delete this.knownMobs[known[c1]];
	}
};
//prompted by faction
Mob.prototype.getMove = function()
{
	//if has a path, and hasn't discovered any new mobs
	if (this.currentPath.length > 0)
	{
		var targ = this.currentPath.shift();
		this.faceTile(targ[0],targ[1]);

		if (window.Attacks['walk'](this,targ,this.field))
		{
			this.currentMove = 'walk';
			this.currentMoveTarget = targ;
			this.currentMoveTime = Date.now();
		}
		else //path is blocked
		{
			this.currentPath = [];//discard path
			this.getMove(); // try again
		}
	}
	//if player, notifies the controller, otherwise, calls ai
	if (this.faction == 'player')
	{
		
	}
	else this.ai();
};

Mob.prototype.ai = function() 
{
	
};

Mob.prototype.hostileToMob = function(mob)
{
	return this.faction !=mob.faction;
};

//if this mob was not aware of perceived mob, abandon path, returns true if wants combat
Mob.prototype.perceiveMob = function(mob)
{
	var isHostile = this.hostileToMob(mob);
	if (!this.knownMobs[mob.name]) 
	{
		this.currentPath = []; //discard the path if it encounters a new mob
		if (isHostile)this.getMove();
	}
	this.knownMobs[mob.name]=this.mobMemoryTurns; //this is only meaningful in combat, otherwise ignored.
	return isHostile;
};

//used in story mode and for player control
Mob.prototype.forceMove = function(move,target=[0,0],text='')
{
	if (move == 'walk')
	{
		var path = this.field.astar([this.x,this.y],target,this);
		if (!path)return;
		this.currentPath = path;
		this.getMove(); //this should automatically start walking the path
	}
	else if (window.Attacks[move](this,target,this.field))
	{
		this.currentMove = move;
		this.currentMoveTarget = target;
		this.currentMoveTime = Date.now();
	}
};

Mob.prototype.openSquare = function(x,y)
{
	return x >= 0 &&                   // x within lower bounds
		   x < this.field.grid &&      // x within upper bounds
		   y >= 0 &&                   // y within lower bounds
		   y < this.field.grid[0] &&   // y within upper bounds
		   this.field.grid[x][y] == 0; // blocked by obstacle
}
