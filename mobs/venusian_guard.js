//load assets

function Mob_VenusianGuard ()
{
	var parent = new Mob();
	var keys = Object.keys(parent);
	for (var c1=0;c1<keys.length;c1++)this[keys[c1]] = parent[keys[c1]];
	
	this.openSquare = function (x,y)
	{
		//check if space is out of bounds
		if (x <0 
		|| x >= this.field.grid
		|| y < 0
		|| y >= this.field.grid[0])return false;
	
		//check if space is blocked by obstacle
		if (this.field.grid[x][y] != 0)return false;
		return true;
	}
	this.lastMove = 'wait';
	this.getMove = function (info)
	{
		if (this.lastMove == 'walk')
		{
			field.registerMove(this,"wait");
			this.ready = Date.now() + 2000;
			var mob = this;
			setTimeout(function () {field.mobAnimationComplete(mob);},2000);
			this.lastMove = 'wait';
			return;
		}
		else if (this.lastMove == 'wait')
		{
			//find out which directions guard can move
			var options = [];
			if (options.length<1)options.push('wait');
			
		}
		else
		{
			if (field.registerMove(this,"walk"))
			{
				this.ready = Date.now() + 2000;
				var mob = this;
				setTimeout(function () {field.mobAnimationComplete(mob);},2000);
				this.lastMove = 'walk'
				return;
			}
			else
			{
				field.registerMove(this,"wait");
				this.ready = Date.now() + 2000;
				var mob = this;
				setTimeout(function () {field.mobAnimationComplete(mob);},2000);
				this.lastMove = 'wait';
				return;
			}
		}
	}
}
