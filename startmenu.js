function StartMenu ()
{
	
	this.html = document.createElement('div');
	this.html.id = 'startmenu';
	this.html.style.position = 'absolute';
	this.html.style.backgroundColor = 'rgba(0,0,0,0.5)';
	this.html.style.width = '100%';
	this.html.style.height = '100%';
	
	this.contentWindow = document.createElement('div');
	this.contentWindow.style.backgroundColor = 'black';
	this.contentWindow.style.margin = '0% 5%';
	this.contentWindow.style.width = '100%';
	this.contentWindow.style.height = '100%';
	this.contentWindow.style.overflowY = 'auto';
	this.contentWindow.onclick = function (evt){evt.stopPropagation();};
	this.html.appendChild(this.contentWindow);
	
	this.screens = [];
	var screenNames = ['stage0','newgame_basic'];
	for (var c1=0,len=screenNames.length;c1<len;c1++)
	{
		var name = screenNames[c1];
		this.screens[name] = document.createElement('div');
		this.screens[name].style.display = 'none';
		this.contentWindow.appendChild(this.screens[name]);
	}
	this.screens.stage0.style.display = 'inline';
	this.screens.stage0.style.textAlign = 'center';
	this.screens.stage0.innerHTML = "<h1>Line Noise</h1>";
	//stage 1
	var stage0Buttons = ['new game','load game','credits'];
	
	this.buttons = [];
	for (var c1=0,len=stage0Buttons.length;c1<len;c1++)
	{
		var name = stage0Buttons[c1];
		this.buttons[name] = document.createElement('button');
		this.buttons[name].className = 'bleep_button';
		this.buttons[name].style.fontSize = '36px';
		this.buttons[name].style.marginBottom = '6px';
		this.buttons[name].innerHTML = name;
		var container = document.createElement('div');
		container.appendChild(this.buttons[name]);
		this.screens['stage0'].appendChild(container);
	}
	this.buttons['new game'].onclick = function ()
	{
		//hide all screens, show newgame_basic
		var scr = Object.keys(this.screens);
		for (var c1=0,len=scr.length;c1<len;c1++)
		{
			this.screens[scr[c1]].style.display='none';
		}
		this.screens.newgame_basic.style.display = 'inline';
	}.bind(this);
	//newgame_basic (character creation)
	//needs: char name, char gender, game mode, backgrounds.
	
	
	var nameBox = document.createElement('div');
	var genderRadioBox = document.createElement('div');
	var gameModeRadioBox = document.createElement('div');
	var backgroundRadioBox = document.createElement('div');
	this.backgroundDescBox = document.createElement('div');
	var continueButtonBox = document.createElement('div');
	var continueButton = document.createElement('button');
	continueButton.innerHTML = 'continue';
	
	this.screens['newgame_basic'].innerHTML += "<h2>Create a character</h2>";
	this.screens['newgame_basic'].innerHTML += "<div>Name:</div>";
	this.screens['newgame_basic'].appendChild(nameBox);
	this.screens['newgame_basic'].appendChild(document.createElement('br'));
	var label = document.createElement('div')
	this.screens['newgame_basic'].appendChild(label);
	label.innerHTML = 'Gender (not implemented):';
	this.screens['newgame_basic'].appendChild(genderRadioBox);
	this.screens['newgame_basic'].appendChild(document.createElement('br'));
	label = document.createElement('div')
	this.screens['newgame_basic'].appendChild(label);
	label.innerHTML = 'Game Mode (not implemented):';
	this.screens['newgame_basic'].appendChild(gameModeRadioBox);
	this.screens['newgame_basic'].appendChild(document.createElement('br'));
	label = document.createElement('div')
	this.screens['newgame_basic'].appendChild(label);
	label.innerHTML = 'Background (choose 2):';
	this.screens['newgame_basic'].appendChild(backgroundRadioBox);
	this.screens['newgame_basic'].appendChild(this.backgroundDescBox);
	this.screens['newgame_basic'].appendChild(document.createElement('br'));
	this.screens['newgame_basic'].appendChild(continueButtonBox);
	this.screens.newgame_basic.radios = [];
	
	this.screens['newgame_basic'].nameEnter = document.createElement('input');
	this.screens['newgame_basic'].nameEnter.type = 'text';//this.screens['newgame_basic'].nameEnter.setAttribute("type", "text");
	nameBox.appendChild(this.screens['newgame_basic'].nameEnter);
	
	var modeButtonSet = new ButtonSet([{'tex':'Both','val':'both'},{'tex':"DID",'val':'did'},{'tex':'GID','val':'gid'}],{'maxRadio':1});
	this.modeButtonSet = modeButtonSet;
	for (var c1=0,len=modeButtonSet.buttons.length;c1<len;c1++)
	{
		gameModeRadioBox.appendChild(modeButtonSet.buttons[c1]);
	}
	
	var sex = ['Male','Female'];
	var sexButtonSet = new ButtonSet([{'tex':'Male','val':'male'},{'tex':"Female",'val':'female'}],{'maxRadio':1});
	this.sexButtonSet = sexButtonSet;
	for (var c1=0,len=sexButtonSet.buttons.length;c1<len;c1++)
	{
		genderRadioBox.appendChild(sexButtonSet.buttons[c1]);
	}
	
	var bckgrnds = Object.keys(TextBank.words.backgrounds);
	var bgButtonsOrder = [];
	for (var c1=0,len=bckgrnds.length;c1<len;c1++)
	{
		var bck = bckgrnds[c1];
		bgButtonsOrder.push({'tex':TextBank.words.backgrounds[bck],'val':bck});
	}
	var bgButtonSet = new ButtonSet(bgButtonsOrder,{'maxRadio':2});
	this.bgButtonSet = bgButtonSet;
	for (var c1=0,len=bgButtonSet.buttons.length;c1<len;c1++)
	{
		var button = bgButtonSet.buttons[c1];
		button.onmouseover = function (evt)
		{
			this.backgroundDescBox.innerHTML = TextBank.words.backgrounds_desc[evt.target.value]
		}.bind(this);
		backgroundRadioBox.appendChild(button);
	}
	continueButton.style.position = 'absolute';
	continueButton.style.top = '10%';
	continueButton.style.right = '10%';
	continueButton.style.fontSize = '24';
	continueButton.className = 'bleep_button';
	continueButtonBox.appendChild(continueButton);
	continueButton.onclick = function ()
	{
		this.newgame();
	}.bind(this);
}

StartMenu.prototype.newgame = function ()
{
	//parse all the menus
	var choices = {};
	choices.name = this.screens['newgame_basic'].nameEnter.value;
	var genderChoice = this.sexButtonSet.getPushed();
	if (genderChoice.length!=1)
	{
		alert("Please select a gender!");
		return;
	}
	else choices.gender = genderChoice[0];
	var gameModeChoice = this.modeButtonSet.getPushed();;
	if (gameModeChoice.length!=1)
	{
		alert("Please select a game mode!");
		return;
	}
	else choices.game_mode = genderChoice[0];
	var backgroundChoices = document.getElementsByName('background_check');
	var found1 = false;
	choices.backgrounds = this.bgButtonSet.getPushed();
	//check them
	if (!choices.name)
	{
		alert("Please enter a name!");
		return;
	}
	if (!choices.gender)choices.gender = 'female';
	if (!choices.game_mode)choices.game_mode = 'Both';
	if (choices.backgrounds.length!=2)
	{
		alert("Please choose 2 backgrounds!");
		return;
	}
	//save them to character sheet
	characterSheet.party = {};
	characterSheet.party.main =
	{
		'name' : choices.name,
		'active' : true,
		'mobtype' : 'protagonist',
		'faction' : 'player',
		'backgrounds' : choices.backgrounds,
		'level' : 1,
		'str' : 5,
		'agi' : 5,
		'int' : 5,
		'cha' : 5,
		'xtra' : 5,
		'inventory': []
	};
	//load the map
	characterSheet.loadMap(MapLib.warehouse,[3,46],[]);
	this.html.style.display = 'none';
	characterSheet.cout(TextBank.console_misc.intro);
}
