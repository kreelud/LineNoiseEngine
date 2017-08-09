window.MapLib = {};

function PlayfieldGraphic (map,entry=null,enemies = null)
{
	this.mapName = 'default';
	this.html = document.createElement('div');
	this.html.style['background-color'] = 'black';
	this.stage = document.createElement('div'); //the part that can be moved around.
	this.window = document.createElement('div'); //the div containing 'stage'
	this.html.id = 'playfieldgraphic';
	this.html.style.position = 'absolute';
	this.html.style.width = '100%';
	this.html.style.height = '100%';
	this.window.style.overflow = 'hidden';
	this.window.style.position='relative';
	this.window.style.border = '3px solid lime';
	this.window.style.marginLeft = "auto";
	this.window.style.marginRight = "auto";
	
	this.stage.style.position = 'absolute';
	this.stage.style.zIndex = 0;
	this.window.appendChild(this.stage);
	

	var neededCanvas = ['belowMobs','uiLayer','aboveMobs'];
	var canvasZ = 0;
	this.map = map;
	
	this.modals = {}; //equip, dialog, game, character
	this.modals['equip'] = new EquipModal(); //triggered by clicking on icon
	this.modals['dialogue'] = new DialogueModal();  //triggered by story or by interacting with a character.
	this.modals['game'] = new GameModal(); //save, load, settings.  Gear icon on bottom right
	this.modals['character'] = new CharacterModal(); //talent tree of active character.  Button on bottom left.
	
	var modals = Object.keys(this.modals);
	for (var c1=0,len=modals.length;c1<len;c1++)
	{
		//console.log(modals[c1]);
		this.html.appendChild(this.modals[modals[c1]].html);
		this.modals[modals[c1]].close();
	}
	
	var mods = Object.keys(this.modals);
	for (var c1=0,len=mods.len;c1<len;c1++)
	{
		this.html.appendChild(this.modals[mods[c1]]);
	}
	
	var w = this.map.tilewidth*this.map.width*config.scale;
	var h = this.map.tileheight*this.map.height*config.scale;
	for (var c1=0,len=neededCanvas.length;c1<len;c1++)
	{
		this[neededCanvas[c1]] = document.createElement('canvas');
		this[neededCanvas[c1]].style.position='absolute';
		//this[neededCanvas[c1]].style.zIndex = canvasZ * 1000;
		this[neededCanvas[c1]].style.x = 0;
		this[neededCanvas[c1]].width = w;
		this[neededCanvas[c1]].height = h;
		canvasZ++;
		this.stage.appendChild(this[neededCanvas[c1]]);
	}
	
	this.mobGraphics = {};
	
	this.field = new Field({});  //needed to draw mobs in correct place
	this.field.mobAniCallback = function (){this.refreshUI;}.bind(this);
	this.field.changeModeCallback = function ()
	{
		console.log(this.field.mode);
		if (this.field.mode =='combat')
		{
			this.combatMenu.style.display ='inline';
			this.peacefulMenu.style.display = 'none';
		}
		else
		{
			this.combatMenu.style.display ='none';
			this.peacefulMenu.style.display = 'inline';
		}
	}.bind(this);
	this.entry = entry;
	this.enemies = enemies;
	this.camera = {'x':0,'y':0}; //in canvas coordinates
	this.loaded = false;
	this.firstGids = {};
	this.window.style.width = '100%';//1280*config.scale;
	this.window.style.height = '80%';//795 * config.scale;//640*config.scale;
	this.html.appendChild(this.window);
	this.html.appendChild(this.createControl());
	
	this.cameraPanSpeedMax = 3; //pixels per ms
	this.cameraPanX = 0; //current pan speed
	this.cameraPanY = 0;
	this.cameraLastPanUpdate = Date.now();
	
	
	this.arScannerOutput = document.createElement('div');
	this.arScannerOutput.style.position='absolute';
	this.arScannerOutput.style.right= 0;
	this.arScannerOutput.style.zIndex='3500';
	this.arScannerOutput.style.color = 'lime';
	this.arScannerOutput.style['font-family'] ='Monospace';
	this.arScannerOutput.style['font-size'] ='16';
	this.arScannerOutput.style.whiteSpace = 'pre-wrap';
	this.arScannerOutput.style.width = "24%";
	this.arScannerOutput.innerHTML = ( "");
	this.html.appendChild(this.arScannerOutput);
	
	this.arLogOutputFrame = document.createElement('div');
	this.arLogOutputContent = document.createElement('div');
	this.arLogOutputFrame.appendChild(this.arLogOutputContent);
	this.arLogOutputFrame.style.position='absolute';
	this.arLogOutputContent.style.position='absolute';
	this.arLogOutputContent.style.bottom=0;
	this.arLogOutputFrame.style.left= 0;
	this.arLogOutputFrame.style.overflow= 'hidden';
	this.arLogOutputFrame.style.zIndex='3500';
	this.arLogOutputFrame.style.color = 'lime';
	this.arLogOutputFrame.style['font-family'] ='Monospace';
	this.arLogOutputFrame.style['font-size'] ='16';
	this.arLogOutputFrame.style.whiteSpace = 'pre-wrap';
	this.arLogOutputFrame.style.width = "24%";
	this.arLogOutputFrame.style.height = "100%";
	this.arLogOutputContent.innerHTML = '';
	this.html.appendChild(this.arLogOutputFrame);
	
	this.playerAbility = 'walk'; //currently selected ability controlled by the ui
	//-------------------------------
	//draw map WITHOUT using phaser
	//-------------------------------
	
	//ensure map info is present
	
	//get map info
	this.tileHeight = Math.floor(map.tileheight * config.scale);
	this.tileWidth = map.tilewidth * config.scale;
	this.orientation = map.orientation;
	
	this.showModal = function (key)
	{
		//css pre-warp
	};
	
	this.canvasXYToTile = function (canvasX,canvasY)
	{
		return [Math.floor((canvasX+this.camera.x)/this.tileWidth),Math.floor((canvasY+this.camera.y)/this.tileHeight)];
	};
	this.window.onmousedown = function (evt)
	{

		var rect = this.window.getBoundingClientRect();
		evt.canvasX = evt.clientX - this.camera.x;
		evt.canvasY = evt.clientY - this.camera.y;
		var currentTile = [Math.floor((evt.clientX-rect.left+this.camera.x)/this.tileWidth),Math.floor((evt.clientY-rect.top+this.camera.y)/this.tileHeight)];
		
		this.lastMouseDown = [evt.clientX,evt.clientY];
		//var currentTile = this.mouseTile;//this.canvasXYToTile (evt.canvasX,evt.canvasY);
		
		//record canvasX and canvasY for movement
		
		
		this.mouseDown = true;
		
	}.bind(this);
	this.mouseTile = null;  //the tile that the mouse is hovering over
	this.window.onmouseup = function (evt)
	{
		this.mouseDown = false;
		this.lastMouseDown  = null;
	}.bind(this);
	this.window.onmouseout = function (evt)
	{
		this.cameraPanX = 0;
		this.cameraPanY = 0;
		this.lastMouseDown = null;
	}.bind(this);
	this.window.onmousemove = function (evt)
	{
		var rect = this.window.getBoundingClientRect();
		
		if (this.lastMouseDown)
		{
			
			this.camera.x -= evt.clientX - this.lastMouseDown[0];
			this.camera.y -= evt.clientY - this.lastMouseDown[1];
			this.lastMouseDown = [evt.clientX,evt.clientY]
		}
		
		/*
		//pan screen
		var mX = (evt.clientX-rect.left) / rect.width;
		var mY = (evt.clientY-rect.top) / rect.height;
		if (mX>0.9)this.cameraPanX = Math.max(this.cameraPanSpeedMax * (mX-0.90),0);
		else this.cameraPanX = Math.min(-this.cameraPanSpeedMax * (0.10-mX),0);
		if (mY>0.9)this.cameraPanY = Math.max(this.cameraPanSpeedMax * (mY-0.90),0);
		else this.cameraPanY = Math.min(-this.cameraPanSpeedMax * (0.10-mY),0);
		
		var currentTile = this.canvasXYToTile (evt.clientX-rect.left,evt.clientY-rect.top);
		var currentTile = [Math.floor((evt.clientX-rect.left+this.camera.x)/this.tileWidth),Math.floor((evt.clientY-rect.top+this.camera.y)/this.tileHeight)];
		//adjust cursor, if applicable
		//set mouseTile.  If it's the player's turn, img will draw the path
		if (this.mouseTile == null ||this.mouseTile[0] != currentTile[0]||this.mouseTile[1] != currentTile[1])
		{
			this.arScannerOutput.innerHTML = '';
			this.mouseTile = currentTile;
			this.refreshUI();
		}*/
		
	}.bind(this);
	this.refreshUI = function ()
	{
		//player footpath
		var ctx = this.uiLayer.getContext('2d');
		ctx.clearRect(0, 0, this.uiLayer.width, this.uiLayer.height);
		
		if (this.activeTile!=null)
		{
			
			var selectedMob = this.field.mobAt(this.activeTile[0],this.activeTile[1],false);
			if (selectedMob)
			{
				var textSubs = {};
				textSubs['$currentTargetName%']=selectedMob.name;
				textSubs['$currentTargetDisposition%'] = 'friendly';
				textSubs['$currentTargetAlerted%']= 'false';
				textSubs['$currentTargetHp%']="<--->";
				textSubs['$currentTargetStamina%']="<--->";
				textSubs['$currentTargetStatusEffects%']="<--->";
				textSubs['$currentTargetDescription%']="This is where rainbows all are dashed";
				//this.arScannerOutput.innerHTML = (getText('ui_scanner',textSubs));
				//TODO: Make sure it's known to the player
				var light = document.createElement('canvas');
				light.width = this.tileWidth;
				light.height = this.tileHeight;
				var lightCtx = light.getContext("2d");
				lightCtx.fillStyle = "#FFFF0088";
				lightCtx.fillRect(0, 0, light.width, light.height);
				var tiles = this.field.getVisibleTiles(selectedMob);
				
				for (var c1=0,len=tiles.length;c1<len;c1++)
				{
					ctx.drawImage
					(
						light,
						tiles[c1][0] * this.tileWidth,
						tiles[c1][1]*this.tileHeight
					);
				}
			}
			if (this.field.activePlayerCharacter!=null && this.field.activePlayerCharacter.currentMove==''&&this.playerAbility=='walk')
			{
				//change mob facing
				this.field.activePlayerCharacter.faceTile(this.activeTile[0],this.activeTile[1]);
				if (this.playerAbility=='walk')
				{
					var achar = this.field.activePlayerCharacter;
					var path = this.field.astar([achar.x,achar.y],this.activeTile);
					if (path)
					{
						path.unshift([achar.x,achar.y]);
						ctx.beginPath();
						ctx.lineWidth = 5;
						ctx.moveTo(achar.x*this.tileWidth+(this.tileWidth/2),achar.y*this.tileHeight+(this.tileHeight/2));
						ctx.strokeStyle='#00ff00';
						var switched = false;
						for (var c1=0;c1<path.length;c1++)
						{
							if (c1>achar.remainingMoves && !switched && this.field.mode=='combat')
							{
								ctx.stroke();
								ctx.beginPath();
								ctx.moveTo(path[c1-1][0]*this.tileWidth+(this.tileWidth/2),path[c1-1][1]*this.tileHeight+(this.tileHeight/2));
								ctx.strokeStyle='#ff0000';
								switched = true;
							}
							ctx.lineTo(path[c1][0]*this.tileWidth+(this.tileWidth/2),path[c1][1]*this.tileHeight+(this.tileHeight/2));
						}
						ctx.stroke();
					}
					else //no path found
					{
					
					}
				}
			}
		}
	};
	this.getTile = function (gid)
	{
		//find the correct image
		//put gids in order
		var gids = Object.keys(this.firstGids);
		gids.sort(function(a,b){return a-b;});
		var tileset = null;
		for (var c1=0;c1<gids.length;c1++)
		{
			if (gids[c1]<=gid)tileset = this.firstGids[gids[c1]];
		}
		//find out how many tiles per row in image
		var tilesPerRow = tileset.imagewidth / tileset.tilewidth;
		var row = Math.floor((gid-tileset.firstgid)/tilesPerRow);
		var column = (gid-tileset.firstgid) % tilesPerRow;
		var output = document.createElement('canvas');
		output.width = tileset.tilewidth;
		output.height = tileset.tileheight;
		output.getContext('2d').drawImage
		(
			imageCache[tileset.name],
			column * tileset.tilewidth,
			row * tileset.tileheight,
			tileset.tilewidth,
			tileset.tileheight,
			0,
			0,
			tileset.tilewidth,
			tileset.tileheight
		);
		return output;
	};
	this.graphicStart = function ()
	{
		console.log("sfds");
		//go through layer by layer, drawing on belowmobs and abovemobs
		var currentCanvas = this.belowMobs; //when we reach the moblayer, this is set to true
		for (var c1=0;c1<this.map.layers.length;c1++)
		{
			var layer = this.map.layers[c1];
			if (layer.name == 'collision')
			{
				for (var c2=0;c2<layer.data.length;c2++)
				{
					var tileNum = layer.data[c2];
					var row = Math.floor(c2 / layer.width);
					var column = c2 % layer.width;
					
					if (!this.field.grid[column])this.field.grid[column] = [];
					this.field.grid[column][row] = tileNum;
				}
				continue;
			}
			else if (layer.name == 'mobs')
			{
				currentCanvas = this.aboveMobs;
				continue;
			}
			//draw the tile
			for (var c2=0;c2<layer.data.length;c2++)
			{
				var tileNum = layer.data[c2];
				var row = Math.floor(c2 / layer.width);
				var column = c2 % layer.width;
				var tTile = this.getTile(tileNum);
				currentCanvas.getContext('2d').drawImage
				(
					tTile,
					0,
					0,
					this.map.tilewidth,
					this.map.tileheight,
					column*this.tileWidth,
					row*this.tileHeight,
					this.tileWidth,
					this.tileHeight
				);
			}
		}
		this.loaded = true;
		this.field.positionMobs(this.entry,this.enemies);
		this.field.modePeaceful();
		console.log("loaded");
		this.pulseTimer = setInterval(this.refresh.bind(this),250);
	};
	
	
	//load the graphics
	var stack = [];
	for (var c1=0;c1<this.map.tilesets.length;c1++)
	{
		var ts = this.map.tilesets[c1];
		stack.push({'label':ts.name,'src':''+ts.image});
		this.firstGids[ts.firstgid] = ts; //record this to make tile access easier
	}
	new ImageLoader (stack,this.graphicStart.bind(this));
	
	
}
PlayfieldGraphic.prototype.refresh = function ()
{
	//camera pan
	var timePassed = Date.now()- this.cameraLastPanUpdate
	this.cameraLastPanUpdate += timePassed;
	this.camera.x += timePassed * this.cameraPanX;
	this.camera.y += timePassed * this.cameraPanY;
		
	var rect = this.window.getBoundingClientRect();
	

	//mobs
	var mobs = this.field.getMobs();
	var xy = null;
	for (var c1=0;c1<mobs.length;c1++)
	{
		if (!this.mobGraphics[mobs[c1].mobId])this.mobGraphics[mobs[c1].mobId] = {};
		var mobCache = this.mobGraphics[mobs[c1].mobId];
		//TODO: fog of war
		if (!mobCache)this.mobGraphics[mobs[c1].mobId] = {};
		mobs[c1].img(mobCache);
			
		if (mobs[c1].faction=='player')
		{
			/*this.camera.x = mobs[c1].x * this.tileWidth - (parseInt(this.html.style.width)/2);
			this.camera.y = mobs[c1].y * this.tileHeight - (parseInt(this.html.style.height)/2);
			this.stage.style.left = -this.camera.x;
			this.stage.style.top = -this.camera.y;*/
		}
			
		var cacheContents = Object.keys(mobCache);
		for (var c2=0,len2=cacheContents.length;c2<len2;c2++)
		{
			var cont = mobCache[cacheContents[c2]];
			if (!cont.appended)
			{
				this.stage.appendChild(cont);
				cont.appended = true;
			}
			cont.style.left = cont.xPos * this.tileWidth + cont.xOffset; //- this.camera['x'];
			cont.style.top = cont.yPos * this.tileHeight + cont.yOffset; //- this.camera['y'];//+(this.map.tileheight/2 * config.scale)
		}
	}
	
	if (this.field.centerCameraOn && this.field.mode=='peaceful')
	{
		
		this.camera.x = this.field.centerCameraOn.x * this.tileWidth - (parseInt(rect.width)/2);
		this.camera.y = this.field.centerCameraOn.y * this.tileHeight - (parseInt(rect.height)/2);
		this.field.centerCameraOn = null;
	}
	this.camera.x = Math.max(Math.min(this.camera.x,this.belowMobs.width - parseInt(rect.width)),0);
	this.camera.y = Math.max(Math.min(this.camera.y,this.belowMobs.height - parseInt(rect.height)),0);
	this.stage.style.left = -this.camera.x;
	this.stage.style.top = -this.camera.y;
};
PlayfieldGraphic.prototype.createControl = function ()
{
	//action, skills, center, skip, end turn.  Move counter, console, game button
	//action, console, mob readout
	//buttons that light up, black text
	
	var output = document.createElement('div');
	output.style.bottom = '0px';
	output.style.height = '20%';
	output.style.width = this.window.style.width;
	output.style.position='relative';
	output.id = 'pgcontrol';
	
	var gameButtonBox = document.createElement('div');
	gameButtonBox.style.float = 'left';
	gameButtonBox.style.width = '10%';
	gameButtonBox.style.height = '100%';
	gameButtonBox.style.border = '2px solid';
	gameButtonBox.style.backgroundColor = 'grey';
	gameButtonBox.style.overflow='hidden';
	output.appendChild(gameButtonBox);
	
	var logo = document.createElement('img');
	gameButtonBox.appendChild(logo);
	logo.style.height = '100%';
	logo.src = "assets/LineNoiseLogo2.png";
	
	var consoleBox = document.createElement('div');
	consoleBox.style.float = 'left';
	consoleBox.style.width = '40%';
	consoleBox.style.height = '100%';
	consoleBox.style.border = '2px solid';
	output.appendChild(consoleBox);
	var wrapper = document.createElement("div");
	wrapper.style.position='relative';
	wrapper.style.width = '100%';
	consoleBox.style.overflowY='scroll';
	consoleBox.appendChild(wrapper);
	this.consoleOutput = document.createElement('div');
	this.consoleOutput.scroller = consoleBox;
	this.consoleOutput.style.fontSize = '14px';
	this.consoleOutput.style.margin = '7px';
	this.consoleOutput.style.whiteSpace='pre-wrap';
	wrapper.appendChild(this.consoleOutput);
	//this.consoleOutput.style.position = 'absolute';
	//consoleBox.appendChild(this.consoleOutput);
	characterSheet.consoleDiv = this.consoleOutput;
	
	var combatButtonBox = document.createElement('div'); //
	
	this.peacefulMenu = document.createElement('div');
	combatButtonBox.style.float = 'left';
	combatButtonBox.style.width = '40%';
	combatButtonBox.style.height = '100%';
	combatButtonBox.style.border = '2px solid';
	this.peacefulMenu.style.textAlign = 'center';
	this.peacefulMenu.innerHTML = "Peaceful";
	this.peacefulMenu.style.fontSize = '48px';
	this.peacefulMenu.onclick = function ()
	{
		this.field.modeCombat(this.activePlayerCharacter);
	}.bind(this);
	combatButtonBox.appendChild(this.peacefulMenu);
	
	this.combatMenu = document.createElement('div');
	var actionButton = document.createElement('button');
	actionButton.style.display = 'block';
	actionButton.innerHTML = "equip";
	actionButton.className = 'bleep_button';
	actionButton.onclick = function ()
	{
		if (this.field.activePlayerCharacter)
		{
			this.modals['equip'].loadEquip(this.field.activePlayerCharacter);
		}
	}.bind(this);
	var nextButton = document.createElement('button'); //swaps active character and recenters
	nextButton.style.display = 'block';
	nextButton.innerHTML = 'next';
	nextButton.className = 'bleep_button';
	nextButton.onclick = function ()
	{
		if (this.field.activePlayerCharacter)
		{
			this.field.activePlayerCharacter.forceMove('wait');
		}
	}.bind(this);
	var endTurnButton = document.createElement('button');
	endTurnButton.style.display = 'block';
	endTurnButton.innerHTML = 'end turn';
	endTurnButton.className = 'bleep_button';
	endTurnButton.onclick = function ()
	{
		if (this.field.activePlayerCharacter)
		{
			this.field.activePlayerCharacter.forceMove('wait');
		}
	}.bind(this);
	//var endCombatButton = document.createElement('button'); not needed- auto check after each turn
	//var combatMenu
	
	this.combatMenu.appendChild(actionButton);
	this.combatMenu.appendChild(nextButton);
	this.combatMenu.appendChild(endTurnButton);
	this.combatMenu.style.display = 'none';
	combatButtonBox.appendChild(this.combatMenu);
	
	output.appendChild(combatButtonBox);
	
	return output;
};

