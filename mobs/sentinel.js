//doesn't move, just watches.  
function Sentinel(x, y, faction)
{
	Guard.call(this, x, y, faction);
	this.img = MobSprites.Sentinel.bind(this);
}

Sentinel.prototype.name = "sentinel";
Sentinel.prototype = Object.create(Guard.prototype);

Sentinel.prototype.getMove = function()
{
	// throw invalid exception?
};

Sentinel.prototype.ai = function()
{
	this.currentMove = 'alert';
	this.currentMoveTarget = null;
	this.currentMoveTime = Date.now();
};

