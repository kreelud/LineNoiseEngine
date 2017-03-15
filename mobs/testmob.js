function TestMob ()
{
	var parent = new Mob();
	var keys = Object.keys(parent);
	for (var c1=0;c1<keys.length;c1++)this[keys[c1]] = parent[keys[c1]];

	this.img = MobSprites.TestSprite.bind(this);
}
