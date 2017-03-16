function Mob ()
{
	this.name = "mob";
	this.knownMobs = {}; //mob, time
	this.mobMemoryTurns = 3;
	this.mobMemoryTime = 5000;
	this.fieldOfView = (19 * Math.PI) / 30;
	this.visionRange = 8;
	this.facing = 1; //like a dial pad
	this.x = 0;
	this.y = 0;
	this.movesPerTurn = 5;
	this.remainingMoves = 5;
	this.attackedThisTurn = false;
	this.animationQueue=[];
	this.animationStart = 0;
	this.status = "ok";
	this.faction = "enemy";
	this.currentPath = []; //if the mob has a path, it will follow it when prompted to move.
	
	this.currentMove = '';
	this.currentMoveTime=0;
	
	this.lastHit = ''; //the last move this mob was affected by
	this.lastHitTime = '';
	
	this.facingAngle = function ()
	{
		var table = {'1':(0.75 * Math.PI),'2':(0.5 * Math.PI),'3':(0.25*Math.PI),'4':Math.PI,'6':0,'7':(1.25*Math.PI),'8':(1.5 * Math.PI),'9':(1.75*Math.PI)};
		return table[this.facing];
	};
	this.animationComplete = function ()//called by mobsprite
	{
		this.currentMove = ''; 
		this.field.mobAnimationComplete(this);
	};
	this.refresh = function ()
	{
		this.remainingMoves = this.movesPerTurn;
		this.attackedThisTurn = false;
	}
	//each mob has a 'library' of animations
	this.getSprite = function ()
	{
		return [{'x':this.x,'y':this.y,'img':imageLibrary['priestess_walk1'],'z':50}];
	};
	this.wantsCombat = function ()
	{
		return false;
	}
	//prompted by faction
	this.getMove = function ()
	{
		//if has a path, and hasn't discovered any new mobs
		if (this.currentPath.length > 0)
		{
			var targ = this.currentPath.unshift();
			if (window.Attacks['walk'](this,this.currentPath.shift(),this.field))
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
	}
	this.ai = function () 
	{
		
	}
	this.hostileToMob(mob)
	{
		return this.faction !=mob.faction;
	}
	//if this mob was not aware of perceived mob, abandon path, returns true if wants combat
	this.perceiveMob = function (mob)
	{
		var hostile = this.hostileToMob(mob);
		if (!this.knownMobs[mob.name]) 
		{
			this.currentPath = []; //discard the path if it encounters a new mob
			if (hostile)this.getMove();
		}
		this.knownMobs[mob.name]=this.mobMemoryTurns; //this is only meaningful in combat, otherwise ignored.
		return hostile;
	}
	//used in story mode and for player control
	this.forceMove = function (move,target=[0,0],text='')
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
	}
}
