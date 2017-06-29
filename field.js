/*tiles:
	1.  clear
	2.  opaque and impassible
	3.  impassible but not opaque
*/
function Field ()
{
	//transferweights in blender
	this.grid = [[]]; //just a parallel array

	this.mobNames = {};
	this.mode = null;  //either peaceful, story, or combat
	this.factions = {};
	this.activeFaction = 0;//only meaningful in combat
	this.activeMob = 0; //only meaningful in combat
	this.storyScript = [];
	this.activePlayerCharacter = null;
	this.lastMover = null;
	this.modAniCallback = function (){};
	
	this.getActiveId = function ()
	{
		if (this.mode == 'combat')
		{
			return this.lastMover.id;
		}
		else return this.activePlayerCharacter;
	}
	//add characters
	//character sight
	this.pythag = function(a, b)
	{
		return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	};
	
	this.addMob = function (mob)
	{
		mob.noise = this.noise.bind(this);
		if (this.factions[mob.faction]==null)
		{
			this.factions[mob.faction] = [];
		}
		this.factions[mob.faction].push(mob);
		if (this.activePlayerCharacter==null && mob.faction=='player')
			this.activePlayerCharacter = mob;
		
		mob.field = this;
	};
	this.getMobs = function ()
	{
		var fac = Object.keys(this.factions);
		var output = [];
		for (var c1=0;c1<fac.length;c1++)
		{
			var facname = fac[c1];
			
			for (var c2=0;c2<this.factions[facname].length;c2++)
			{
				output.push(this.factions[facname][c2]);
			}
		}
		return output;
	}
	this.tileOpaque = function (x,y) //visual
	{
		return x<0||x>=this.grid.length ||
			   y<0||y>=this.grid[0].length ||
			   this.grid[x][y] == 2;
	};
	this.tileImpassable = function (x,y,mob=false) //if mob is set, will only return false if mob knows obstruction
	{
		return this.tileOpaque(x, y) ||
		       this.grid[x][y] == 3 ||
			   this.mobAt(x,y);
	}
	this.mobAt = function (x,y,mob = false) //if mob is set, will only return true if mob knows target mob
	{
		var moblist = this.getMobs();
		for (var c1=0;c1<moblist.length;c1++)
		{
			var thismob = moblist[c1];
			if (thismob.x==x&&thismob.y==y)return thismob;
		}
		return false;
	};
	this.cycleActiveFaction = function ()
	{
		var fact = Object.keys(this.factions);
		this.activeFaction = (this.activeFaction +1) % fact.length;
		var active = this.factions[fact[this.activeFaction]];
		for (var c1=0;c1<active.length;c1++)
		{
			active[c1].refresh();
		}
		active[0].getMove();
		this.lastMover = active[0];
		if (fact[this.activeFaction]=='player')this.activePlayerCharacter = this.factions['player'][0];
		else this.activePlayerCharacter = null;
	};
	this.mobAnimationComplete = function (mob) //called when a mob finishes animating
	{
		this.mobAniCallback();
		if (this.mode == 'peaceful')
		{
			mob.refresh();
			if (mob.wantsCombat())
			{
				this.modeCombat(mob);
			}
			//call mob.getmove
			mob.getMove();
		}
		else if (this.mode=='story')
		{
			if (this.storyScript.length == 0)
			{
				this.modePeaceful();
			}
			else
			{
				//go to next part of the script
				var event = this.storyScript.shift();
				event.mob.forceMove(event.move);
			}
		}
		else if (this.mode =='combat')
		{
			if (!mob.attackedThisTurn)
			{
				mob.getMove();
				this.lastMover = mob;
			}
			else
			{
				var faction = this.factions[mob.faction];
				var idleFound = false;
				for (var c1=0;c1<faction.length;c1++)
				{
					if (!faction[c1].attackedThisTurn)  //attackedThisTurn should be true if the mob's turn is over
					{
						//TODO: add flag for non-player active character
						if(faction[c1].faction=='player')this.activePlayerCharacter=faction[c1];
						faction[c1].getMove();
						this.lastMover = faction[c1];
						idleFound = true;
						break;
					}
				}
				if (!idleFound)this.cycleActiveFaction();
			}
		}
	};
	this.tileVisible = function (mob,targetX,targetY,test)
	{
		if (this.tileOpaque(targetX,targetY))return false;
		if (mob.x==targetX&&mob.y==targetY)return false;
		// What to do here when targets are not set?
		var xDiff = targetX-mob.x;
		var yDiff = targetY-mob.y;
		
		var distance = this.pythag(xDiff, yDiff);
		//if (distance > mob.visionRange)
			//return false; //target too far away to be seen
		
		var circle = Math.PI * 2;
		var angle = (Math.atan2(-yDiff,xDiff) + circle) % circle;
		
		var fov = mob.fieldOfView / 2;
		
		var cw = Math.abs(mob.facingAngle - angle);
		var ccw = Math.abs(mob.facingAngle + circle - angle)
		
		if(test)
		{
			console.log('xdiff: '+xDiff);
			console.log('ydiff: '+yDiff);
			console.log('angle: '+angle);
		}
		if (cw > fov && ccw > fov)
			return false; //target outside field of view
		//check obstructions
		
		if (xDiff == 0)
		{
			var ystart = Math.min(mob.y,targetY);
			for (var ycount=0;ycount<yDiff;ycount++)
			{
				if (this.tileOpaque(targetX,ystart+ycount))
					return false; //obstruction in the way of target
			}
		}
		
		else
		{
			var slope = yDiff/xDiff;
			var yIntercept = targetY - (targetX * slope);
			
			//y = (slope * x) + yIntercept
			var xstart = Math.min(mob.x,targetX);
			
			for (var xcount=0;xcount<Math.abs(xDiff);xcount++)
			{
				var matchingY = (slope * (xstart+xcount)) + yIntercept;
				//if (targetX==4 && targetY == 3)console.log([xstart+xcount,matchingY,this.tileOpaque(xstart+xcount,Math.floor(matchingY)),this.tileOpaque(xstart+xcount,Math.round(matchingY))]);
				//if (this.tileOpaque(xstart+xcount,Math.floor(matchingY)))return false;
				if (this.tileOpaque(xstart+xcount,Math.round(matchingY)))return false; //todo, if .0 check both
				//if (matchingY == Math.floor(matchingY) && this.tileOpaque(xstart+xcount,matchingY-1))return false; //if the line hits a corner, check both?
			}
			//x = (y-yIntercept)/slope
			var ystart = Math.min(mob.y,targetY);
			
			for (var ycount=0;ycount<Math.abs(yDiff);ycount++)
			{
				var matchingX = (ystart+ycount - yIntercept) / slope;
				//if (targetX==4 && targetY == 3)console.log([matchingX,ystart+ycount,this.tileOpaque(Math.floor(matchingX),ystart+ycount),this.tileOpaque(Math.round(matchingX),ystart+ycount)]);
				//if (this.tileOpaque(Math.floor(matchingX),ystart+ycount))return false;
				if (this.tileOpaque(Math.round(matchingX),ystart+ycount))return false;
			}
		}
		return true;
	};
	this.getVisibleTiles = function (mob) //used for player vision
	{
		var output = [];
		for (var xcount = mob.x - mob.visionRange;xcount<mob.x+mob.visionRange;xcount++)
		{
			for (var ycount=mob.y - mob.visionRange;ycount<mob.y+mob.visionRange;ycount++)
			{
				//ray cast every tile within range
				if (this.tileVisible(mob, xcount, ycount))
					output.push([xcount,ycount]);
			}
		}
		return output;
	};
	this.getVisibleMobs = function (character)  //used for ai vision (and player vision)
	{
		var output = [];
		var mobs = this.getMobs();
		for (var c1=0,len=mobs.length;c1<len;c1++)
		{
			var mob = mobs[c1];
			if (this.tileVisible(character, mob.x, mob.y))
				output.push(mob);
		}
		return output;
	};
	this.noise = function (maker,volume) //alerts other mobs to the presence of "maker"
	{
		var mobs = this.getMobs();
		for (var c1=0,len=mobs.length;c1<len;c1++)
		{
			var mob = mobs[c1]
			var distance = this.pythag(mob.x-maker.x, mob.y-maker.y)
			if (volume >= Math.round(distance))
				this.mobInform(mob, maker);
		}
		//todo: add a record so it can be recorded for playfieldgraphic
	};
	this.mobLook = function (mob)
	{
		var visibleMobs = this.getVisibleMobs(mob);
		for (var c1=0,len=visibleMobs.length;c1<len;c1++)
		{
			this.mobInform(mob, visibleMobs[c1]);
		}
	};
	
	this.refreshVision = function ()
	{
		var mobs = this.getMobs();
		for (var c1=0,len=mobs.length;c1<len;c1++)
		{
			this.mobLook(mobs[c1]);
		}
	};
	this.mobInform = function (mob, target)
	{
		//if in peaceful mode, check if target is hostile
		if (this.mode=='peaceful' && mob.faction != 'player' && mob.perceiveMob(target))
		{
			this.modeCombat(mob);//this will clear all mob perception
			this.mobLook(mob);
			this.mobInform(mob, target); //make sure the mob remembers what started the fight
			mob.getMove();
		}
	};
	this.clearMobPerception = function ()
	{
		var mobs = this.getMobs();
		for (var c1=0,len=mobs.length;c1<len;c1++)
		{
			mobs[c1].knownMobs={};
			this.mobLook(mobs[c1]);
		}
	};
	this.modePeaceful = function ()
	{
		if (this.mode=='peaceful')
			return; //prevent recursion
		
		this.activePlayerCharacter = this.factions['player'][0];
		this.mode='peaceful';
		var mobs = this.getMobs();
		for (var c1=0;c1<mobs.length;c1++)
		{
			mobs[c1].getMove();
		}
	};
	this.modeCombat = function (activeMob)
	{
		if (this.mode=='combat')
			return; //prevent recursion
		
		this.mode = 'combat';
		this.clearMobPerception();
		if (activeMob == null)this.cycleActiveFaction();
		else
		{
			var fact = Object.keys(this.factions);
			for (var c1=0;c1<fact.length;c1++)
			{
				if (activeMob.faction == fact[c1])
				{
					this.activeFaction = c1;
					break;
				}
			}
			var active = this.factions[activeMob.faction];
			for (var c1=0;c1<active.length;c1++)
			{
				active[c1].refresh();
			}
			active[0].getMove();
			this.lastMover = active[0];
		}
	};
	this.modeStory = function (script)
	{
		if (this.mode=='story')
			return; //prevent recursion
		
		this.mode = 'story';
		this.activePlayerCharacter = null;
		this.storyScript = script;
		var event = this.storyScript.shift();
		event.mob.forceMove(event.move,event.text);
	};
	this.astar = function (start,end,mob) //returns an array representing a path between start and end, or false on failure
	{
		
		if (this.tileImpassable(end[0],end[1]))
			return false;
		
		//record room costs as {'cost':,'prev':,'coords'}
		var rooms = [[]];
		var toSearch = [];
		
		var addToSearch = function (thisRoom)
		{
			for (var c1=0;c1<toSearch.length;c1++)
			{
				if (toSearch[c1].dist > thisRoom.dist)
				{
					//insert it
					toSearch.splice(c1, 0, thisRoom);
					return;
				}
			}
			toSearch.push(thisRoom);
		};
		var checkRoom = function (thisRoom)//returns true if path found
		{
			//get all exits and record them in rooms
			var potentialExits = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
			for (var c1=0;c1<potentialExits.length;c1++)
			{
				var exit = [potentialExits[c1][0]+thisRoom.coords[0],potentialExits[c1][1]+thisRoom.coords[1]];
				//if exit is impassible, continue
				if (this.tileImpassable(exit[0],exit[1],mob))continue;
				//if the room is already known
				if (rooms[exit[0]] && rooms[exit[0]][exit[1]])
				{
					var nextRoom = rooms[exit[0]][exit[1]];
					if (nextRoom.cost > thisRoom.cost+1)
					{
						nextRoom.cost = thisRoom.cost+1;
						nextRoom.prev = thisRoom.coords;
					}
					else continue; //have already found a shorter path
				}
				else //if it's a new room
				{
					//if it's the end, record the path
					if (!rooms[exit[0]])rooms[exit[0]] = [];
					var newRoom =
					{
						'cost:' : thisRoom.cost+1,
						'prev' :thisRoom.coords,
						'coords' :[exit[0],exit[1]],
						'dist' : Math.sqrt(Math.pow(end[0]-exit[0],2) + Math.pow(end[1]-exit[1],2))
					};
					if (!rooms[exit[0]])rooms[exit[0]] =[];
					rooms[exit[0]][exit[1]] = newRoom;
					addToSearch(newRoom);
					//if it's the end, record the path
					if (exit[0] == end[0] && exit[1]==end[1])return true;
				}
			}
			return false;
		}.bind(this);
		
		var firstRoom =
		{
			'cost:' : 0,
			'prev' : [0,0],
			'coords' :[start[0],start[1]],
			'dist' : this.pythag(end[0] - start[0], end[1] - start[1])
		};
		rooms[start[0]] = [];
		rooms[start[0]][start[1]] = firstRoom;
		addToSearch(firstRoom);
		
		while (toSearch.length>0)
		{
			if (checkRoom(toSearch.shift()))
			{
				//trace the path and return it
				var finalPath = [];
				var troom = end;
				do
				{
					finalPath.unshift(troom);
					troom = rooms[troom[0]][troom[1]].prev;
				}
				while (troom[0] != start[0] || troom[1]!=start[1]);
				return finalPath;
			}
		}
		return false;//path not found
	};
	this.draw = function ()
	{
		return this.tileset.drawField(this);
	};
}
//receive move- callback function passed from mobs

//begin turn- prompts all mobs to move
