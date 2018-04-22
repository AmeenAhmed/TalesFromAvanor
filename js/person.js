(function () {
    window.Person = function (options) {
        var self = this;


        self.props = _.defaultsDeep (options, {
            name: ''
        });
    };

    Person.prototype.serialize = function () {
        var self = this;
        var props = _.cloneDeep (self.props);

        return props;
    };

    Person.prototype.deserialize = function (props) {
        var self = this;
        self.props = _.cloneDeep (props);
    };

    Person.prototype.showDialog = function (city) {
        var self = this;
        
        avanor.leftPage.title = self.props.name;

        if (self.props.name === 'Chancellor') {
            avanor.ui.showMessage (avanor.leftPage, 'Greetings sire, What\'s on your mind today?');

            avanor.ui.showOptions (avanor.rightPage, 'Options', [
                {text: 'I want to hire some workers', cb: function () {
                    avanor.ui.showMessage (avanor.leftPage, 'At once sire'+'<br/>We have ' + 
                            avanor.game.props.resources.workers + ' free workers at the moment.' +
                             '<br/>We have +' + avanor.game.props.resources.food + 
                             ' food in our stores.' + 
                             '<br/>Each worker consumes 1 food per day and 1 action point to hire') ;
                    self.hireWorkersDialog (city);
                }},
                // {text: 'I want to send an emissary', cb: function () {
                    
                // }},
                {text: 'I want to build a ...', cb: function () {
                    avanor.ui.showMessage (avanor.leftPage, 'Buildings need workers and certain numbers of resources to build. What do you want to build sire?');
                    self.buildDialog (city);
                }},
                {text: 'I want to check the inventory', cb: function () {
                    self.showResources ();
                }},
                // {text: 'I want to hold a festival', cb: function () {
                    
                // }},
                {text: 'That\'s it for now', cb: function () {
                    avanor.game.showCourt ();
                }}
            ]);
        } else if (self.props.name === 'Marshall') {
            avanor.ui.showMessage (avanor.leftPage, 'Greetings sire, What\'s on your mind today?');

            avanor.ui.showOptions (avanor.rightPage, 'Options', [
                {text: 'I want to hire some soldiers', cb: function () {
                    self.hireSoldiersDialog (city);
                }},
                {text: 'Lets visit the garrison', cb: function () {
                    self.showGarrsion (city);
                }},
                {text: 'May god be with you', cb: function () {
                    avanor.game.showCourt ();
                }}
            ]);
        } else if (self.props.name === 'Steward') {
            avanor.ui.showMessage (avanor.leftPage, 'Greetings sire, What\'s on your mind today?');

            avanor.ui.showOptions (avanor.rightPage, 'Options', [
                {text: 'Let\'s go over the books', cb: function () {
                    
                }},
                {text: 'I want to manage the taxes', cb: function () {
                    
                }},
                {text: 'I want to trade with ...', cb: function () {
                    
                }},
                {text: 'I will see you later', cb: function () {
                    avanor.game.showCourt ();
                }}
            ]);
        } else if (self.props.name === 'Chaplain') {
            avanor.ui.showMessage (avanor.leftPage, 'Greetings sire, What\'s on your mind today?');

            avanor.ui.showOptions (avanor.rightPage, 'Options', [
                {text: 'I want to research ...', cb: function () {
                    self.researchDialog ();
                }},
                {text: 'Show me current progress', cb: function () {
                    self.showAllResearches ();
                }},
                {text: 'Let\'s talk later', cb: function () {
                    avanor.game.showCourt ();
                }}
            ]);
        }
    };

    Person.prototype.hireWorkersDialog = function (city) {
        var self = this;

        function hireWorkers (num) {
            if (avanor.game.props.actionPoints === 0) {
                avanor.ui.showMessage (avanor.leftPage, 'We don\'t have enough action points to hire more workers mi lord');
            } else {
                
                avanor.game.props.resources.workers += num;
                avanor.game.props.actionPoints -= 1;
                avanor.game.update ();
                avanor.ui.showMessage (avanor.leftPage, 'I have sent a message to hire ' + num + ' worker ...<br/>' + 
                    'We have ' + avanor.game.props.resources.workers + ' free workers at the moment.<br/>' + 
                    'We have ' + avanor.game.props.actionPoints + ' action points for the day.');
                self.hireWorkersDialog (city);
            }
        }

        avanor.ui.showOptions (avanor.rightPage, 'Options', [
            {text: 'Let\'s hire a worker', cb: function () {
                hireWorkers (1);
            }},
            {text: 'Enough for now', cb: function () {
                self.showDialog (city);
            }}
        ]);
    }

    Person.prototype.buildDialog = function (city) {
        var self = this;
        var options = [
        ];

        function buildingDialog (building) {
            var msg = 'Are you sure you want to build a ' + building.name + '? <br/>' + building.name + ' requires, ';
            
            for (var i=0; i<building.requirements.length; i++) {
                msg += building.requirements[i].val + ' ' + building.requirements[i].resource;
            }
            msg += '<br/>and it gives<br/>';
            for (var i=0; i<building.affects.length; i++) {
                msg += building.affects[i].val + ' ' + building.affects[i].resource + ' per day <br/>';
            }

            avanor.ui.showMessage (avanor.leftPage, msg);
            avanor.ui.showOptions (avanor.rightPage, 'Options', [
                {text: 'Yes lets build it', cb: function () {
                    var hasEverything = true;

                    if (avanor.game.props.actionPoints === 0) {
                        hasEverything = false;
                        avanor.ui.showMessage (avanor.leftPage, 'We don\'t have enough action points to build mi lord');
                        return;
                    }

                    for (var i=0; i<building.requirements.length; i++) {
                        var res = building.requirements [i].resource;

                        if (avanor.game.props.resources [res] < building.requirements [i].val) {
                            hasEverything = false;
                        }
                    }

                    if (hasEverything) {
                        avanor.ui.showMessage (avanor.leftPage, 'As you wish mi lord, i have ordered the workers to build a ' + building.name);
                        for (var i=0; i<building.requirements.length; i++) {
                            var res = building.requirements [i].resource;
    
                            avanor.game.props.resources [res] -= building.requirements [i].val;

                            if (res === 'workers') {
                                avanor.game.props.resources.occWorkers += building.requirements [i].val;
                            }
                        }
                        
                        for (var i=0; i<building.affects.length; i++) {
                            var res = building.affects [i].resource;

                            avanor.game.props.resourcesPerDay [res] += building.affects [i].val;
                        }
                        avanor.game.props.actionPoints -= 1;
                        avanor.game.update ();
                        self.buildDialog ();
                    } else {
                        avanor.ui.showMessage (avanor.leftPage, 'I am afraid we don\'t have enough resources to build a ' + building.name + ' sire');
                        for (var i=0; i<building.requirements.length; i++) {
                            var res = building.requirements [i].resource;
    
                            avanor.ui.showMessage (avanor.leftPage, 'we have ' + avanor.game.props.resources [res] + ' of ' + building.requirements [i].val + ' ' + res + ' we need');;
                        }
                    }

                }},
                {text: 'Not right now', cb: function () {
                    self.buildDialog ();
                }}
            ]);
        }

        for (var i=0; i<Buildings.length; i++) {
            !function (idx) {
                options [idx] = {
                    text: Buildings [idx].name,
                    disabled: !Buildings [idx].unlocked,
                    disabledText: !Buildings [idx].unlocked ? 'needs research ' + Buildings [idx].needsResearch : '',
                    cb: function () {
                        buildingDialog (Buildings [idx]);
                    }
                }
            } (i);
        }

        options.push ({text: 'Lets discuss something else', cb: function () {
            self.showDialog (city);
        }})

        avanor.ui.showOptions (avanor.rightPage, 'Options', options);
    }

    Person.prototype.showResources = function () {
        var self = this;

        avanor.ui.renderView ('inventory-view', avanor.rightPage.content);
    };

    Person.prototype.hireSoldiersDialog = function (city) {
        var self = this;
        var options = [];

        function hireDialog (unit) {
            var msg = 'Are you sure you want to hire a ' + unit.name + '? <br/>' +
                        'hiring a ' + unit.name + ' requires, <br/>';

            for (var i=0; i<unit.requirements.length; i++) {
                msg += unit.requirements[i].val + ' ' + unit.requirements[i].resource + '<br/>';
            }
            msg += '<br/> ' + 'and it adds ' + unit.damage + ' damage to the army';
            msg += '<br/> ' + 'and it adds ' + unit.hitPoints + ' hit points to the army';
            avanor.ui.showMessage (avanor.leftPage, msg);
         
            avanor.ui.showOptions (avanor.rightPage, 'Options', [
                {text: 'Yes lets hire one', cb: function () {
                    var hasEverything = true;

                    if (avanor.game.props.actionPoints === 0) {
                        hasEverything = false;
                        avanor.ui.showMessage (avanor.leftPage, 'We don\'t have enough action points to build mi lord');
                        return;
                    }

                    for (var i=0; i<unit.requirements.length; i++) {
                        var res = unit.requirements [i].resource;

                        if (avanor.game.props.resources [res] < unit.requirements [i].val) {
                            hasEverything = false;
                        }
                    }

                    if (hasEverything) {
                        avanor.ui.showMessage (avanor.leftPage, 'As you wish mi lord, i have ordered to hire ' + unit.name);
                        for (var i=0; i<unit.requirements.length; i++) {
                            var res = unit.requirements [i].resource;
    
                            avanor.game.props.resources [res] -= unit.requirements [i].val;
                        }
                        
                        avanor.game.props.garrison [unit.name] ++;
                        avanor.game.props.actionPoints -= 1;
                        avanor.game.update ();
                    } else {
                        avanor.ui.showMessage (avanor.leftPage, 'I am afraid we don\'t have enough resources to hire a ' + unit.name + ' sire');
                        for (var i=0; i<unit.requirements.length; i++) {
                            var res = unit.requirements [i].resource;
    
                            avanor.ui.showMessage (avanor.leftPage, 'we have ' + avanor.game.props.resources [res] + ' of ' + unit.requirements [i].val + ' ' + res + ' we need');;
                        }
                    }

                }},
                {text: 'Not right now', cb: function () {
                    self.hireSoldiersDialog ();
                }}
            ]);
        }

        for (var i=0; i<Units.length; i++) {
            !function (idx) {
                options [idx] = {
                    text: Units [idx].name,
                    disabled: !Units [idx].unlocked,
                    disabledText: !Units [idx].unlocked ? 'needs research ' + Units [idx].needsResearch : '',
                    cb: function () {
                        hireDialog (Units [idx]);
                    }
                }
            } (i);
        }

        options.push ({text: 'Lets discuss something else', cb: function () {
            self.showDialog (city);
        }});

        avanor.ui.showOptions (avanor.rightPage, 'Options', options);
    }

    Person.prototype.showGarrsion = function (city) {
        var self = this;

        avanor.ui.showMessage (avanor.leftPage, 'Sure my sire');
        avanor.ui.renderView ('garrison-view', avanor.rightPage.content);

        // avanor.ui.showOptions (avanor.rightPage, 'Options', [
            
        //     {text: 'Enough for now', cb: function () {
        //         self.showDialog (city);
        //     }}
        // ]);
    }

    Person.prototype.researchDialog = function () {
        var self = this;
        
        var researches = _.filter (TechTree, function (item) {
            return avanor.game.props.research.indexOf (item.name) === -1;
        });

        var researches = _.filter (researches, function (item) {
            return _.keys (avanor.game.props.researchProgress).indexOf (item.name) === -1;
        });
        
        avanor.ui.showMessage (avanor.leftPage, 'Sure my sire');
        avanor.ui.renderView ('research-view', avanor.rightPage.content, {
            researches: researches
        });
    };

    Person.prototype.showAllResearches = function () {
        var self = this;
        var msg = '';
        
        if (_.keys (avanor.game.props.researchProgress).length) {
            for (var key in avanor.game.props.researchProgress) {
                msg += key + ' : ' + avanor.game.props.researchProgress [key] + ' days remaining.<br/>';
            }

            avanor.ui.showMessage (avanor.leftPage, 'Sure my sire,<br/>' + msg);
        } else {
            avanor.ui.showMessage (avanor.leftPage, 'We are currently not doing any research sire.');
        }
    }

    
}) ();