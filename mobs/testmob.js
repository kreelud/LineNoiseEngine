function TestMob(x, y, faction)
{
	Mob.call(this, x, y, faction);
	this.img = MobSprites.Protest.bind(this);
}
MobLib.protagonist = TestMob;
TestMob.prototype = Object.create(Mob.prototype);
