function TestMob(x, y, faction)
{
	Mob.call(this, x, y, faction);
	this.img = MobSprites.TestSprite.bind(this);
}

TestMob.prototype = Object.create(Mob.prototype);