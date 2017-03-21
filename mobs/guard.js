function Guard(x, y, faction)
{
	Mob.call(this, x, y, faction);
	//this.img = MobSprites.Guard.bind(this);
}

Guard.prototype.name = "guard";
Guard.prototype = this.lastMove = 'wait';
Guard.prototype = Object.create(Mob.prototype);

Guard.prototype.getMove = function(info)
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
	
	if (this.lastMove == 'wait')
	{
		//find out which directions guard can move
		var options = [];
		if (options.length<1)
			options.push('wait');
		
		return;
	}

	if (field.registerMove(this,"walk"))
	{
		this.ready = Date.now() + 2000;
		var mob = this;
		setTimeout(function () {field.mobAnimationComplete(mob);},2000);
		this.lastMove = 'walk'
		return;
	}
	
	field.registerMove(this,"wait");
	this.ready = Date.now() + 2000;
	var mob = this;
	setTimeout(function () {field.mobAnimationComplete(mob);},2000);
	this.lastMove = 'wait';
};
