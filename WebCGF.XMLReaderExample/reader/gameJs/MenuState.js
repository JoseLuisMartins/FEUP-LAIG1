var submenu = {
    MAIN: 0,
    PLAY: 1,
    SETTINGS: 2,
    ABOUT: 3,
    SINGLE_PLAYER : 4,
};

var mode = {
  HUMAN_VS_HUMAN: 1,
  HUMAN_VS_BOT: 2,
};

var difficulty={
  HARD: 1,
  EASY: 2,
};

function MenuState(scene) {
    this.scene = scene;
    this.submenu = submenu.MAIN;

    this.ready = false;
    this.mode = -1;
    this.difficulty = -1;


    this.first = new Rectangle(scene, new Point3(-3, 2), new Point3(3, 4));
    this.second = new Rectangle(scene, new Point3(-3, -1), new Point3(3, 1));
    this.third = new Rectangle(scene, new Point3(-3, -4), new Point3(3, -2));

    this.playAppearance = new CGFappearance(scene);
    this.playAppearance.loadTexture("resources\\images\\menus\\new_game.png");
    this.setAllColors(this.playAppearance, 1, 1, 1, 1);

    this.settingsAppearance = new CGFappearance(scene);
    this.settingsAppearance.loadTexture("resources\\images\\menus\\settings.png");
    this.setAllColors(this.settingsAppearance, 1, 1, 1, 1);

    this.aboutAppearance = new CGFappearance(scene);
    this.aboutAppearance.loadTexture("resources\\images\\menus\\about.png");
    this.setAllColors(this.aboutAppearance, 1, 1, 1, 1);

    this.singlePlayerAppearance = new CGFappearance(scene);
    this.singlePlayerAppearance.loadTexture("resources\\images\\menus\\single_player.png");
    this.setAllColors(this.singlePlayerAppearance, 1, 1, 1, 1);

    this.multiPlayerAppearance = new CGFappearance(scene);
    this.multiPlayerAppearance.loadTexture("resources\\images\\menus\\multi_player.png");
    this.setAllColors(this.multiPlayerAppearance, 1, 1, 1, 1);

    this.easyAppearance = new CGFappearance(scene);
    this.easyAppearance.loadTexture("resources\\images\\menus\\easy.png");
    this.setAllColors(this.easyAppearance, 1, 1, 1, 1);

    this.hardAppearance = new CGFappearance(scene);
    this.hardAppearance.loadTexture("resources\\images\\menus\\hard.png");
    this.setAllColors(this.hardAppearance, 1, 1, 1, 1);
}

MenuState.prototype.display = function () {
    
    switch (this.submenu) {
        case submenu.MAIN:
            
            this.playAppearance.apply();
            this.scene.registerForPick(1, this.first);
            this.first.display();
            
            this.settingsAppearance.apply();
            this.scene.registerForPick(2, this.second);
            this.second.display();

            this.aboutAppearance.apply();
            this.scene.registerForPick(3, this.third);
            this.third.display();
        break;

        case submenu.PLAY:
            this.singlePlayerAppearance.apply();
            this.scene.registerForPick(4, this.first);
            this.first.display();
            
            this.multiPlayerAppearance.apply();
            this.scene.registerForPick(5, this.second);
            this.second.display();
        break;

        case submenu.ABOUT:
            
        break;

        case submenu.SINGLE_PLAYER:
            this.easyAppearance.apply();
            this.scene.registerForPick(6, this.first);
            this.first.display();

            this.hardAppearance.apply();
            this.scene.registerForPick(7, this.second);
            this.second.display();
        break;
    }

    this.scene.clearPickRegistration();
};


MenuState.prototype.picking = function () {

    if (this.scene.pickMode === false) {
        if (this.scene.pickResults !== null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var objID = this.scene.pickResults[i][1];

                switch (this.submenu) {
                    case submenu.MAIN:
                        if (objID == 1) {
                            this.submenu = submenu.PLAY;
                        }
                        else if (objID == 2) {
                            this.submenu = submenu.SETTINGS;
                        }
                        else if (objID == 3) {
                            this.submenu = submenu.ABOUT;
                        }
                    break;

                    case submenu.PLAY:
                        if (objID == 4) {
                            this.submenu = submenu.SINGLE_PLAYER;
                            this.mode = mode.HUMAN_VS_BOT;
                        } else if (objID == 5) {
                            this.mode = mode.HUMAN_VS_HUMAN;
                            this.ready = true;
                        }
                    break;

                    case submenu.SETTINGS:

                    break;

                    case submenu.SINGLE_PLAYER:
                        if (objID == 6) {
                            this.difficulty = difficulty.EASY;
                            this.ready = true;
                        }
                        else if (objID == 7) {
                            this.difficulty = difficulty.HARD;
                            this.ready = true;
                        }
                    break;
                }
            }
        }
    }
};


MenuState.prototype.setAllColors = function(apperance, r, g, b, a) {
    apperance.setAmbient(r, g, b, a);
	apperance.setDiffuse(r, g, b, a);
	apperance.setSpecular(r, g, b, a);
};


MenuState.prototype.update = function (currtime) {};