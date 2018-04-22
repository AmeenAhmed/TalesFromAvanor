(function () {
    window.Game = function (options) {
        var self = this;
        
        self.props = _.defaultsDeep (options, {
            money: 100,
            cities: [],
            actionPoints: 4,
            day: 1,
            wave: 0,
            barbarianAttackIn: {
                total: 10,
                remaining: 10
            },
            messages: [],
            kingName: '',
            kingdom: '',
            garrison: {
                Brute: 0,
                Slinger: 0,
                Fighter: 0,
                Archer: 0
            },
            buildables: [

            ],
            researchProgress: {

            },
            research: [

            ],
            buildings: [

            ],
            resourcesPerDay: {
                iron: 0,
                wood: 0,
                food: 5,
                stone: 0,
                cotton: 0,
                leather: 0
            },
            resources: {
                iron: 0,
                wood: 0,
                food: 5,
                stone: 0,
                cotton: 0,
                leather: 0,
                workers: 1,
                occWorkers: 0
            }
        });

        // self.tick = setInterval (function () {
        //     if (self.props.actionPoints === 0) {
        //         avanor.leftPage.button.addClass ('active');
        //     } else {
        //         avanor.leftPage.button.removeClass ('active');
        //     }
        // }, 1000 / 60);
        
        self.showCourt ();
        // self.showBarbarianAttack ();
    };

    Game.prototype.update = function () {
        var self = this;

        $('.action-points').text ('Action Points: ' + self.props.actionPoints);
    };
    
    Game.prototype.newGameSetup = function () {
        var self = this;
        self.props.cities.push (new City ({
            name: 'Avanor'
        }));
    
    };

    Game.prototype.serialize = function () {
        var self = this;
        var props = _.cloneDeep (self.props);
        
        for (var i=0; i<props.cities.length; i++) {
            props.cities [i] = props.cities [i].serialize ();
        }

        return props;
    };

    Game.prototype.deserialize = function (props) {
        var self = this;
        self.props = _.cloneDeep (props);
        
        for (var i=0; i<props.cities.length; i++) {
            var city = new City ();
            city.deserialize (props.cities [i]);
            self.props.cities [i] = city;
        }
        
        self.showCourt ();
    };

    Game.prototype.renderDate = function () {
        var self = this;
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        return 'Day ' + self.props.day;
    }

    Game.prototype.showCourt = function () {
        var self = this;

        avanor.clearPages ();
        avanor.leftPage.title = self.props.kingdom;
        
        avanor.ui.renderView ('court-view', avanor.leftPage.content, {
            date: self.renderDate (),
            actionPoints: self.props.actionPoints,
            game: self
        });

        avanor.ui.showOptions (avanor.rightPage, 'Court', [
            {text: 'Meet with the chancellor', cb: function () {
                self.props.cities [0].showDialog ('Chancellor');
            }},
            {text: 'Meet with the marshall', cb: function () {
                self.props.cities [0].showDialog ('Marshall');
            }},
            // {text: 'Meet with the priest', cb: function () {
            //     self.props.cities [0].showDialog ('Priest');
            // }},
            {text: 'Meet with the chaplain', cb: function () {
                self.props.cities [0].showDialog ('Chaplain');
            }}
        ]);
    };

    Game.prototype.showPersonDialog = function (person) {
        var self = this;

        avanor.clearPages ();
        avanor.leftPage.title = person;
    };

    Game.prototype.getBarbarianAttackPercent = function () {
        var self = this;

        return ((self.props.barbarianAttackIn.total - self.props.barbarianAttackIn.remaining) / self.props.barbarianAttackIn.total) * 100;
    }

    Game.prototype.getArmyDamage = function () {
        var self = this;
        var damage = 0;

        for (var key in self.props.garrison) {
            var unit = _.find (Units, {name: key});
            damage += unit.damage * self.props.garrison [key];
        }

        return damage;
    };

    Game.prototype.getArmyHp = function () {
        var self = this;
        var hp = 0;

        for (var key in self.props.garrison) {
            var unit = _.find (Units, {name: key});
            hp += unit.hitPoints * self.props.garrison [key];
        }

        return hp;
    };

    Game.prototype.startResearch = function (key) {
        var self = this;

        self.props.researchProgress [key] = _.find (TechTree, {name: key}).daysToComplete;
        self.props.actionPoints --;
        avanor.ui.showMessage (avanor.leftPage, 'The research on ' + key + ' has been started mi lord!');
    };

    Game.prototype.showBarbarianAttack = function () {
        var self = this;
        var barbarians = Waves [self.props.wave];
        var _barbarians = _.cloneDeep (barbarians);
        var ourArmy = {
            damage: self.getArmyDamage (),
            hitPoints: self.getArmyHp ()
        }

        var view = avanor.ui.renderView ('barbarian-view', $('.modal-container'), {
            game: self,
            barbarians: barbarians,
            ourArmy: ourArmy
        });        
        // debugger
        view.find ('.prepare-btn').on ('click', function () {
            view.find ('.view-1').hide ();
            view.find ('.view-2').show ();
        });

        view.find ('.our-army .attack-value').text ('Damage : ' + ourArmy.damage);
        view.find ('.our-army .hp-value').text (ourArmy.hitPoints + '/' + self.getArmyHp ());

        view.find ('.barbarians .attack-value').text ('Damage : ' + barbarians.damage);
        view.find ('.barbarians .hp-value').text (barbarians.hitPoints + '/' + _barbarians.hitPoints);

        view.find ('.next-turn').on ('click', function () {

            ourArmy.hitPoints -= barbarians.damage;
            barbarians.hitPoints -= ourArmy.damage;

            view.find ('.our-army .attack-value').text ('Damage : ' + ourArmy.damage);
            view.find ('.our-army .hp-value').text (ourArmy.hitPoints + '/' + self.getArmyHp ());
            view.find ('.our-army .bar').css ({
                width: ((ourArmy.hitPoints / self.getArmyHp ()) * 100) + '%'
            });

            view.find ('.barbarians .attack-value').text ('Damage : ' + barbarians.damage);
            view.find ('.barbarians .hp-value').text (barbarians.hitPoints + '/' + _barbarians.hitPoints);
            view.find ('.barbarians .bar').css ({
                width: ((barbarians.hitPoints / _barbarians.hitPoints) * 100) + '%'
            });

            if (ourArmy.hitPoints < 0) {
                view.find ('.defeat').show ();
                view.find ('.view-2').hide ();
                setTimeout (function () {
                    window.location.reload ();
                }, 5000);
            } 

            if (barbarians.hitPoints < 0) {
                view.find ('.win').show ();
                view.find ('.view-2').hide ();
                setTimeout (function () {
                    view.remove ();
                    self.showCourt ();
                }, 5000);

                self.props.wave ++;
                if (self.props.wave === 5) {
                    window.location.reload ();
                }
                self.props.barbarianAttackIn.total = Waves [self.props.wave].attackIn;
                self.props.barbarianAttackIn.remaining = Waves [self.props.wave].attackIn;
            }
        });
    }

    Game.prototype.nextTurn = function () {
        var self = this;
        var totalWorkers = self.props.resources.workers + self.props.resources.occWorkers;

        self.props.actionPoints += 4;
        self.props.day ++;


        for (var key in self.props.resourcesPerDay) {
            self.props.resources [key] += self.props.resourcesPerDay [key];
        }

        self.props.resources.food -= totalWorkers;
        self.props.barbarianAttackIn.remaining --;

        self.showCourt ();

        if (self.props.barbarianAttackIn.remaining === 0) {
            self.showBarbarianAttack ();
        }
        

        for (var key in self.props.researchProgress) {
            self.props.researchProgress [key] --;

            if (self.props.researchProgress [key] === 0) {
                delete self.props.researchProgress [key];
                var research = _.find (TechTree, {name: key});

                self.props.research.push (key);
                
                for (var i=0; i<research.unlocks.length; i++) {
                    if (research.unlocks [i].type === 'building') {
                        _.find (Buildings, {name: research.unlocks [i].name}).unlocked = true;
                    } else if (research.unlocks [i].type === 'unit') {
                        _.find (Units, {name: research.unlocks [i].name}).unlocked = true;
                    }
                }
            }            
        }

        if (self.props.resources.food < 0) {
            self.props.resources.food = 0;
            self.props.actionPoints -= 2;
            self.showCourt ();
            avanor.ui.showMessage (avanor.leftPage, 'You\'re people are starving, you lost 2 action points');
        }
    }
}) ();