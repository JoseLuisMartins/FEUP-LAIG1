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
    this.nextSubmenu = submenu.MAIN;

    this.ready = false;
    this.mode = -1;
    this.difficulty = -1;
    this.selected = -1;
    this.animating = false;


    this.first = new Button(scene);
    this.second = new Button(scene);
    this.third = new Button(scene);

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

    this.lostIslandAppearance = new CGFappearance(scene);
    this.lostIslandAppearance.loadTexture("resources\\images\\menus\\lost_island.png");
    this.setAllColors(this.lostIslandAppearance, 1, 1, 1, 1);

    this.outerSpaceAppearance = new CGFappearance(scene);
    this.outerSpaceAppearance.loadTexture("resources\\images\\menus\\outer_space.png");
    this.setAllColors(this.outerSpaceAppearance, 1, 1, 1, 1);

    this.studioAppearance = new CGFappearance(scene);
    this.studioAppearance.loadTexture("resources\\images\\menus\\studio.png");
    this.setAllColors(this.studioAppearance, 1, 1, 1, 1);
}

MenuState.prototype.display = function () {
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2,0,1,0);

    switch (this.submenu) {
        case submenu.MAIN:

            this.playAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(1, this.first);
                this.scene.translate(0, 2, 0);
                this.first.display();
            this.scene.popMatrix();

            this.aboutAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(2, this.second);
                this.scene.translate(0, -1, 0);
                this.second.display();
            this.scene.popMatrix();
        break;

        case submenu.PLAY:
            this.singlePlayerAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(4, this.first);
                this.scene.translate(0, 2, 0);
                this.first.display();
            this.scene.popMatrix();

            this.multiPlayerAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(5, this.second);
                this.scene.translate(0, -1, 0);
                this.second.display();
            this.scene.popMatrix();
        break;

        case submenu.SETTINGS:
            this.lostIslandAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(8, this.first);
                this.scene.translate(-15, 0, 0);
                this.scene.scale(2, 6, 1);
                this.first.display();
            this.scene.popMatrix();

            this.outerSpaceAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(9, this.second);
                this.scene.scale(2, 6, 1);
                this.second.display();
            this.scene.popMatrix();

            this.studioAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(10, this.third);
                this.scene.translate(15, 0, 0);
                this.scene.scale(2, 6, 1);
                this.third.display();
            this.scene.popMatrix();
        break;

        case submenu.ABOUT:

        break;

        case submenu.SINGLE_PLAYER:
            this.easyAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(6, this.first);
                this.scene.translate(0, 2, 0);
                this.first.display();
            this.scene.popMatrix();

            this.hardAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(7, this.second);
                this.scene.translate(0, -1, 0);
                this.second.display();
            this.scene.popMatrix();
        break;
    }

    this.scene.clearPickRegistration();

    this.scene.popMatrix();
};


MenuState.prototype.picking = function () {

    if (this.animating) {
        return;
    }

    if (this.scene.pickMode === false) {
        if (this.scene.pickResults !== null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var objID = this.scene.pickResults[i][1];

                switch (this.submenu) {
                    case submenu.MAIN:
                        if (objID == 1) {
                            this.nextSubmenu = submenu.PLAY;
                            this.click(this.first);
                        }
                        else if (objID == 2) {
                            this.nextSubmenu = submenu.ABOUT;
                            this.click(this.second);
                        }
                    break;

                    case submenu.PLAY:
                        if (objID == 4) {
                            this.nextSubmenu = submenu.SINGLE_PLAYER;
                            this.mode = mode.HUMAN_VS_BOT;
                            this.click(this.first);
                        } else if (objID == 5) {
                            this.mode = mode.HUMAN_VS_HUMAN;
                            this.nextSubmenu = submenu.SETTINGS;
                            this.click(this.second);
                        }
                    break;

                    case submenu.SETTINGS:
                        if (objID == 8 && this.selected != 8) {
                            this.selected = objID;
                            this.scene.setGraph("Island.dsx");
                            this.ready = true;
                        }
                        else if (objID == 9 && this.selected != 9) {
                            this.selected = objID;
                            this.scene.setGraph("Space.dsx");
                            this.ready = true;
                        }
                        else if (objID == 10 && this.selected != 10) {
                            this.selected = objID;
                            this.scene.setGraph("Studio.dsx");
                            this.ready = true;
                        }
                    break;

                    case submenu.SINGLE_PLAYER:
                        if (objID == 6) {
                            this.difficulty = difficulty.EASY;
                            this.nextSubmenu = submenu.SETTINGS;
                            this.click(this.first);
                        }
                        else if (objID == 7) {
                            this.difficulty = difficulty.HARD;
                            this.nextSubmenu = submenu.SETTINGS;
                            this.click(this.second);
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


MenuState.prototype.update = function (currTime) {

    if (this.first.animation === null && this.second.animation === null && this.third.animation === null) {
        this.animating = false;
        this.submenu = this.nextSubmenu;
    }
    else {
        this.first.update(currTime);
        this.second.update(currTime);
        this.third.update(currTime);
    }
};


MenuState.prototype.click = function (button) {
    button.click();
    this.animating = true;
};