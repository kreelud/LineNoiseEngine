function PlayfieldGraphic (map)
{
	this.belowMobs = document.createElement('canvas'); //canvas representing all layers below moblayer
	this.aboveMobs= document.createElement('canvas');
	this.uiLayer = document.createElement('canvas');//a canvas for walking paths and such
	this.field = new Field({});  //needed to draw mobs in correct place
	this.camera = {'x':0,'y':0}; //in canvas coordinates
	this.map = map;
	this.loaded = false;
	this.firstGids = {};
	this.width = 1280;
	this.height = 640;
	var cameraPanSpeedMax = 0.5; //pixels per ms
	
	var w = this.map.tilewidth*this.map.width;
	var h = this.map.tileheight*this.map.height;
	this.belowMobs.width = w;
	this.belowMobs.height = h;
	this.aboveMobs.width = w;
	this.aboveMobs.height = h;
	this.uiLayer.width = w;
	this.uiLayer.height = h;
	
	this.playerAbility = 'walk'; //currently selected ability controlled by the ui
	//-------------------------------
	//draw map WITHOUT using phaser
	//-------------------------------
	
	//ensure map info is present
	
	//get map info
	this.tileHeight = map.tileheight;
	this.tileWidth = map.tilewidth;
	this.orientation = map.orientation;
	
	this.canvasXYToTile = function (canvasX,canvasY)
	{
		return [Math.floor((canvasX+this.camera.x)/this.tileWidth),Math.floor((canvasY+this.camera.y)/this.tileHeight)];
	};
	this.onclick = function (evt)
	{
		this.refreshUI();
		var currentTile = this.canvasXYToTile (evt.canvasX,evt.canvasY);
		
		if (this.playerAbility == 'center')
		{
			this.camera.x = Math.max(Math.min(evt.canvasX - this.width/2,this.map.tilewidth*this.map.width-this.width),0);
			this.camera.y = Math.max(Math.min(evt.canvasY - this.height/2,this.map.tileheight*this.map.height-this.height),0);
			console.log([this.camera.x,this.camera.y]);
			return;
		}
		
		if (this.field.activePlayerCharacter ==null)return; //not the player's turn
		
		//if it's combat and the player's turn, force mob move
		if (this.field.mode=='combat')
		{
			this.field.activePlayerCharacter.forceMove(this.playerAbility,currentTile,'');
		}
		//if it's peaceful and there's a mob, talk to the mob
		else if (this.field.mode=='peaceful' && this.field.mobAt(currentTile[0],currentTile[1]))
		{
			
		}
		//if it's peaceful and there's no mob, walk to that location
		else if (this.field.mode=='peaceful')
		{
			this.field.activePlayerCharacter.forceMove('walk',currentTile,'');
		}
	};
	this.mouseTile = null;  //the tile that the mouse is hovering over
	this.onmousemove = function (evt)
	{
		var currentTile = this.canvasXYToTile (evt.canvasX,evt.canvasY);
		//adjust cursor, if applicable
		//set mouseTile.  If it's the player's turn, img will draw the path
		if (this.mouseTile == null ||this.mouseTile[0] != currentTile[0]||this.mouseTile[1] != currentTile[1])
		{
			this.mouseTile = currentTile;
			this.refreshUI();
		}
		
	};
	this.refreshUI = function ()
	{
		//for now, the only thing here is a player footpath
		var ctx = this.uiLayer.getContext('2d');
		ctx.clearRect(0, 0, this.uiLayer.width, this.uiLayer.height);
		
		if (this.mouseTile!=null)
		{
		var selectedMob = this.field.mobAt(this.mouseTile[0],this.mouseTile[1],false);
		if (selectedMob)
		{
			//TODO: Make sure it's known to the player
			var light = this.getTile(9);
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
			var achar = this.field.activePlayerCharacter;
			var path = this.field.astar([achar.x,achar.y],this.mouseTile);
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
				currentCanvas.getContext('2d').drawImage(this.getTile(tileNum),column*this.map.tilewidth,row*this.map.tileheight);
			}
		}
		this.loaded = true;
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
	this.img = function ()
	{
		if (!this.loaded)
		{
			return this.belowMobs;
		}
		
		var output = document.createElement('canvas');
		output.width = this.width;
		output.height = this.height;
		output.getContext('2d').drawImage
		(
			this.belowMobs,
			this.camera.x,
			this.camera.y,
			this.width,
			this.height,
			0,
			0,
			this.width,
			this.height
		);
		//mobs
		var mobs = this.field.getMobs();
		for (var c1=0;c1<mobs.length;c1++)
		{
			//TODO: fog of war
			var graphics = mobs[c1].img(mobs[c1]);
			for (var c2=0;c2<graphics.length;c2++)
			{
				var graphic = graphics[c2];
				if (graphic.ac)
				{
					mobs[c1].animationComplete();
					this.refreshUI();
				}
				output.getContext('2d').drawImage
				(
					graphic.img,
					0,
					0,
					graphic.img.width,
					graphic.img.height,
					graphic.x * this.map.tilewidth-this.camera.x,
					graphic.y * this.map.tileheight -this.camera.y,
					graphic.img.width,
					graphic.img.height
				);
			}
		}
		output.getContext('2d').drawImage
		(
			this.aboveMobs,
			this.camera.x,
			this.camera.y,
			this.width,
			this.height,
			0,
			0,
			this.width,
			this.height
		);
		output.getContext('2d').drawImage
		(
			this.uiLayer,
			this.camera.x,
			this.camera.y,
			this.width,
			this.height,
			0,
			0,
			this.width,
			this.height
		);
		return output;
	};
}
