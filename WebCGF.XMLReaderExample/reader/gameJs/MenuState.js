var submenu = {
    MAIN: 0,
    PLAY: 1,
    SETTINGS: 2,
    ABOUT: 3,
    DIFFICULTY : 4,
    AFTER_GAME : 5,
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

    this.title = new Cube(scene,true);
    this.first = new Button(scene);
    this.second = new Button(scene);
    this.third = new Button(scene);
    this.back = new Button(scene);

    this.titleAppearance = new CGFappearance(scene);
    this.titleAppearance.loadTexture("resources\\images\\menus\\blockade.png");
    this.setAllColors(this.titleAppearance, 1, 1, 1, 1);

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

    this.backAppearance = new CGFappearance(scene);
    this.backAppearance.loadTexture("resources\\images\\menus\\back.png");
    this.setAllColors(this.backAppearance, 1, 1, 1, 1);

    this.goToMenu = new CGFappearance(scene);
    this.goToMenu.loadTexture("resources\\images\\menus\\go_to_menu.png");
    this.setAllColors(this.goToMenu, 1, 1, 1, 1);

    this.gameMovie = new CGFappearance(scene);
    this.gameMovie.loadTexture("resources\\images\\menus\\game_movie.png");
    this.setAllColors(this.gameMovie, 1, 1, 1, 1);

    this.restart = new CGFappearance(scene);
    this.restart.loadTexture("resources\\images\\menus\\restart.png");
    this.setAllColors(this.restart, 1, 1, 1, 1);
}

MenuState.prototype.display = function () {
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2,0,1,0);

    var y,z;
    if (this.scene.currentScene == 'Island') {
        y = 198;
        z = 470;
    }
    else if (this.scene.currentScene == 'Space') {
        y = 197;
        z = 470;
    }
    else if (this.scene.currentScene == 'Studio') {
        y = 893;
        z = 1080;
    }

    switch (this.submenu) {
        case submenu.MAIN:
            this.scene.pushMatrix();
                this.titleAppearance.apply();
                this.scene.translate(0, y, z);
                this.scene.scale(15, 1.5, 0.2);
                this.title.display();
            this.scene.popMatrix();

            this.playAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(1, this.first);
                this.scene.translate(0, y-3, z);
                this.first.display();
            this.scene.popMatrix();

            this.aboutAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(2, this.second);
                this.scene.translate(0, y-6, z);
                this.second.display();
            this.scene.popMatrix();
        break;

        case submenu.PLAY:
            this.singlePlayerAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(4, this.first);
                this.scene.translate(0, y-3, z);
                this.first.display();
            this.scene.popMatrix();

            this.multiPlayerAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(5, this.second);
                this.scene.translate(0, y-6, z);
                this.second.display();
            this.scene.popMatrix();

            this.backAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(3, this.back);
                this.scene.translate(0, y-7.5, z);
                this.scene.scale(0.5, 0.5, 0.5);
                this.back.display();
            this.scene.popMatrix();
        break;

        case submenu.SETTINGS:
            this.lostIslandAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(8, this.first);
                this.scene.translate(-15, y-15, z-10);
                this.scene.scale(2, 6, 1);
                this.first.display();
            this.scene.popMatrix();

            this.outerSpaceAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(9, this.second);
                this.scene.translate(0, y-15, z-10);
                this.scene.scale(2, 6, 1);
                this.second.display();
            this.scene.popMatrix();

            this.studioAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(10, this.third);
                this.scene.translate(15, y-15, z-10);
                this.scene.scale(2, 6, 1);
                this.third.display();
            this.scene.popMatrix();

            this.backAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(11, this.back);
                this.scene.translate(0, y-12.5, z);
                this.scene.scale(0.5, 0.5, 0.5);
                this.back.display();
            this.scene.popMatrix();
        break;

        case submenu.ABOUT:

            this.backAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(12, this.back);
                this.scene.translate(0, y-7.5, z);
                this.scene.scale(0.5, 0.5, 0.5);
                this.back.display();
            this.scene.popMatrix();
        break;

        case submenu.DIFFICULTY:
            this.easyAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(6, this.first);
                this.scene.translate(0, y-3, z);
                this.first.display();
            this.scene.popMatrix();

            this.hardAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(7, this.second);
                this.scene.translate(0, y-6, z);
                this.second.display();
            this.scene.popMatrix();

            this.backAppearance.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(13, this.back);
                this.scene.translate(0, y-7.5, z);
                this.scene.scale(0.5, 0.5, 0.5);
                this.back.display();
            this.scene.popMatrix();
        break;

        case submenu.AFTER_GAME:
            this.gameMovie.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(14, this.first);
                this.scene.translate(0, y-3, z);
                this.first.display();
            this.scene.popMatrix();

            this.restart.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(15, this.second);
                this.scene.translate(0, y-6, z);
                this.second.display();
            this.scene.popMatrix();

            this.goToMenu.apply();
            this.scene.pushMatrix();
                this.scene.registerForPick(16, this.third);
                this.scene.translate(0, y-9, z);
                this.third.display();
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
                            this.click(this.first, objID);
                        }
                        else if (objID == 2) {
                            this.nextSubmenu = submenu.ABOUT;
                            this.click(this.second, objID);
                        }
                    break;

                    case submenu.PLAY:
                        if (objID == 4) {
                            this.nextSubmenu = submenu.DIFFICULTY;
                            this.mode = mode.HUMAN_VS_BOT;
                            this.click(this.first, objID);
                        } else if (objID == 5) {
                            this.mode = mode.HUMAN_VS_HUMAN;
                            this.nextSubmenu = submenu.SETTINGS;
                            this.click(this.second, objID);
                        }
                        else if (objID == 3) {
                            this.nextSubmenu = submenu.MAIN;
                            this.click(this.back, objID);
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
                        else if (objID == 11) {
                            this.nextSubmenu = submenu.PLAY;
                            this.click(this.back, objID);
                        }
                    break;

                    case submenu.DIFFICULTY:
                        if (objID == 6) {
                            this.difficulty = difficulty.EASY;
                            this.nextSubmenu = submenu.SETTINGS;
                            this.click(this.first, objID);
                        }
                        else if (objID == 7) {
                            this.difficulty = difficulty.HARD;
                            this.nextSubmenu = submenu.SETTINGS;
                            this.click(this.second, objID);
                        }
                        else if (objID == 13) {
                            this.nextSubmenu = submenu.PLAY;
                            this.click(this.back, objID);
                        }
                    break;

                    case submenu.ABOUT:
                        if (objID == 12) {
                            this.nextSubmenu = submenu.MAIN;
                            this.click(this.back, objID);
                        }
                    break;
                    case submenu.AFTER_GAME:
                      this.selected = objID;
                      this.ready=true;

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

    if (this.first.animation === null && this.second.animation === null && this.third.animation === null && this.back.animation === null) {
        this.animating = false;
        this.submenu = this.nextSubmenu;
    }
    else {
        this.first.update(currTime);
        this.second.update(currTime);
        this.third.update(currTime);
        this.back.update(currTime);
    }
};


MenuState.prototype.click = function (button, objID) {
    button.click();
    this.selected = objID;
    this.animating = true;
};
