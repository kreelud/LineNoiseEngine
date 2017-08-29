//a modal to show equip abilities
function EquipModal ()
{
	Modal.call(this);
}
EquipModal.prototype = Object.create(Modal.prototype);

EquipModal.prototype.loadEquip = function (mob)
{
	var skillTable = document.createElement("table");
	this.contentWindow.appendChild(skillTable);
	var equip = ['wait','end_turn'];
	equip = equip.concat(mob.getEquipment());
	for (var c1=0,len=equip.length;c1<len;c1++)
	{
		var thisEquip = equip[c1];

		var newRow = document.createElement('tr');
		var newRowDescHolder = document.createElement('th');
		var newRowNameHolder = document.createElement('th');
		var button = document.createElement('button');
		button.innerHTML = TextBank.abilities[thisEquip];
		
		skillTable.appendChild(newRow);
		newRow.appendChild(newRowDescHolder);
		newRow.appendChild(newRowNameHolder);
		
		newRowNameHolder.appendChild(button);
		newRowDescHolder.innerHTML = TextBank.abilities[thisEquip+"_desc"];
	}
	this.show();
};
