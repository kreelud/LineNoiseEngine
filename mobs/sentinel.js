//doesn't move, just watches.  

function Sentinel ()
{
	var parent = new Mob();
	var keys = Object.keys(parent);
	for (var c1=0;c1<keys.length;c1++)this[keys[c1]] = parent[keys[c1]];

	this.img = MobSprites.Sentinel.bind(this);
	this.ai = function ()
	{
		console.log(this.field.tileVisible(this,6,5));
		this.currentMove = 'alert';
		this.currentMoveTarget = null;
		this.currentMoveTime = Date.now();
	};
}
