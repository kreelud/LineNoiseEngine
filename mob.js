var MobID = 0;

// Abstract class
function Mob (x, y, faction)
{
	this.x = x;
	this.y = y;
	this.faction = faction;
	this.mobId = MobID;
	this.facing = Math.floor(Math.random() * 8) + 1;
	if (this.facing = 5)this.facing = 9;//like a dial pad
	MobID++;
}
window.MobLib = {};
MobLib['Mob'] = Mob;

Mob.prototype.saveStats = ['hp','str','agi','int','cha','hp','skills','facing','faction','capturePoints','bindingPoints'];
Mob.prototype.name = "mob";
Mob.prototype.mobType = 'mob'; 
Mob.prototype.knownMobs = {}; //mob, time
Mob.prototype.mobMemoryTurns = 3;
Mob.prototype.mobMemoryTime = 5000;
Mob.prototype.fieldOfView = (19 * Math.PI) / 30 * 0.9;
Mob.prototype.visionRange = 8;
Mob.prototype.movesPerTurn = 5;
Mob.prototype.remainingMoves = 5;
Mob.prototype.attackedThisTurn = false;
Mob.prototype.animationQueue=[];
Mob.prototype.animationStart = 0;
Mob.prototype.aniOffset = Math.round(Math.random() * 10000); //used for blinking currently, so they don't all blink simultaneously
Mob.prototype.status = "ok";
Mob.prototype.currentPath = []; //if the mob has a path, it will follow it when prompted to move.

Mob.prototype.currentMove = '';
Mob.prototype.currentMoveTime=0;

Mob.prototype.lastHit = ''; //the last move this mob was affected by
Mob.prototype.lastHitTime = '';
Mob.prototype.capturePoints = 0;
Mob.prototype.bindingPoints = 0; //impossible to escape on their own once > 100
Mob.prototype.hitPoints = 10;
Mob.prototype.selectedAbility = 'walk';

//progression
Mob.prototype.level = 1;
Mob.prototype.skills = [];
Mob.prototype.str = 1;
Mob.prototype.agi = 1;
Mob.prototype.int = 1;
Mob.prototype.cha = 1;

Mob.prototype.angleTable = {'1':(0.75 * Math.PI),
							'2':(0.5 * Math.PI),
							'3':(0.25*Math.PI),
							'4':Math.PI,
							'6':0,
							'7':(1.25*Math.PI),
							'8':(1.5 * Math.PI),
							'9':(1.75*Math.PI)
							};

Object.defineProperty(Mob.prototype, 'facingAngle', {
	get: function() { return this.angleTable[this.facing]; }
});

//each mob has a 'library' of animations
Object.defineProperty(Mob.prototype, 'sprite', {
	get: function() { return [{'x':this.x,'y':this.y,'img':imageLibrary['priestess_walk1'],'z':50}]; }
}); 
							
Mob.prototype.faceTile = function (x,y)
{
	//get the angle of the tile
	var xDiff = x - this.x;
	var yDiff = y - this.y;
		
	var circle = Math.PI * 2;
	var angle = (circle - Math.atan2(yDiff, xDiff) + circle) % circle;
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
	this.capturePoints = 0;
};
Mob.prototype.discardPath = function ()
{
	console.log('path discarded');
	this.currentPath = [];
	this.possiblePath = null;
	this.plannedMove = "";
	this.plannedMoveTarget = null;
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
			this.discardPath();//discard path
			this.getMove(); // try again
		}
	}
	else this.ai();
};
Mob.prototype.ai = function() 
{
	
};

Mob.prototype.hostileToMob = function(otherMob)
{
	return this.faction != otherMob.faction;
};

//if this mob was not aware of perceived mob, abandon path, returns true if wants combat
Mob.prototype.perceiveMob = function(otherMob)
{
	var wantsCombat = this.hostileToMob(otherMob);
	if (!this.knownMobs[otherMob.name]) 
	{
		this.currentPath = []; //discard the path if it encounters a new mob
		if (wantsCombat)
			this.getMove();
	}
	this.knownMobs[otherMob.name] = this.mobMemoryTurns; //this is only meaningful in combat, otherwise ignored.
	return wantsCombat;
};


//used in story mode and for player control
Mob.prototype.forceMove = function(move,target=[0,0],text='')
{
	if (move == 'walk')
	{
		var path= this.field.astar([this.x, this.y],target,this); //reccomputing it is just easier
		this.possiblePath = null;
		if (!path)
			return;  // exit if no path found
		
		this.currentPath = path;
		this.getMove(); //this should automatically start walking the path
	}
	else
	{
		this.performMove(move, target);
	}
};
Mob.prototype.performMove = function (attack,target)
{
	if (window.Attacks[attack] && window.Attacks[attack](this, target, this.field))
	{
		this.currentMove = attack;
		this.currentMoveTarget = target;
		this.currentMoveTime = Date.now();
		return true;
	}
	return false;
};

Mob.prototype.openSquare = function(x,y)
{
	return x >= 0 &&                   // x within lower bounds
		   x < this.field.grid &&      // x within upper bounds
		   y >= 0 &&                   // y within lower bounds
		   y < this.field.grid[0] &&   // y within upper bounds
		   this.field.grid[x][y] == 0; // blocked by obstacle
};

Mob.prototype.getEquipment = function () //returns a list of valid abilities based on skills and equipment
{
	var equipList = [];
	for (var c1=0;c1<this.skills.length;c1++)
	{
		equipList = equipList.concat(SkillTable[this.skills[c1]+'_eq']);
	}
	return equipList;
};
Mob.prototype.save = function ()
{
	//record current hp, x,y facing,all stats and skills, status effects
	var output = {};
	for (var c1=0,len=this.saveStats.length;c1<len;c1++)
	{
		var sta = saveStats[c1];
		output[sta] = this[sta];
	}
	return output;
};
