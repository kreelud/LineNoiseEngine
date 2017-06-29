//preloads
(function ()
{
	var blinkArray = ['blink','open'];
	var directArray = [1,2,3,4,6,7,8,9];  //1-9 except 5
	var frameArray = ['flinch','kneebound','stand','touch1','touch2','walk1','walk2'];
	for (var c1=0,len1=blinkArray.length;c1<len1;c1++)
	{
		var thisBlink = blinkArray[c1];
		for (var c2=0,len2=directArray.length;c2<len2;c2++)
		{
			var thisDirect = directArray[c2].toString();
			for (var c3=0,len3=frameArray.length;c3<len3;c3++)
			{
				thisFrame = frameArray[c3];
				MobSpritePreloadStack.push
				({
					'label':'protest_'+thisBlink+'_'+thisDirect+'_'+thisFrame,
					'src':'assets/protest/'+thisBlink+'/'+thisDirect+'/'+thisFrame+'.png'
				});
			}
		}
	}
}());//putting this in a function to avoid taking up global var names

MobSprites.Protest = function (mobCache)
{

	if (!mobCache.mainSprite)
	{
		mobCache.mainSprite = document.createElement('img');
		mobCache.mainSprite.style.position='absolute';
		
	}
	mobCache.mainSprite.xOffset= -72 * config.scale;
	mobCache.mainSprite.yOffset= -115* config.scale;
	mobCache.mainSprite.xPos = this.x;
	mobCache.mainSprite.yPos = this.y;
	mobCache.mainSprite.style.zIndex = (1500 + Math.round((this.y / this.field.grid[0].length) * 200));
	mobCache.mainSprite.onload = function (evt)
	{
		var nWidth = evt.target.naturalWidth;
		evt.target.width = nWidth * config.scale;
		mobCache.mainSprite.xOffset += nWidth - (nWidth * config.scale);
	}.bind(mobCache);
	
	//I guess the best way to do it is still to let playfieldgraphic figure out the exact positioning
	
	var blinking = 'open';
	var time = Date.now();
	
	var blinkCyclePoint = (time - this.aniOffset) % 5000;
	if (blinkCyclePoint < 500)
	{
		blinking = 'blink';
	}

	var src = 'assets/protest/'+blinking+'/'+this.facing+'/stand.png';
	if (this.bindingPoints > 0)
	{
		src = 'assets/protest/'+blinking+'/'+this.facing+'/kneebound.png';
	}
	else if (this.currentMove=='walk')
	{
		var walkCycleCompletion = (time - this.currentMoveTime) / 500;
		if (walkCycleCompletion >= 1)
		{
			this.animationComplete();
		}
		else
		{
			var walkCyclePoint = Math.round((time - this.aniOffset) / 250) % 2; //which frame for to play
			var previous = this.lastTile;
			var currentX = (this.x-previous[0]) * walkCycleCompletion + previous[0];
			var currentY = (this.y- previous[1])* walkCycleCompletion + previous[1];
			src = 'assets/protest/'+blinking+'/'+this.facing+'/walk'+(walkCyclePoint+1)+'.png';
			mobCache.mainSprite.xPos = currentX;
			mobCache.mainSprite.yPos = currentY;
		}
	}
	else if (this.currentMove=='punch')
	{
		
	}
	else if (this.currentMove!='')this.animationComplete();
	mobCache.mainSprite.src = src;
}
