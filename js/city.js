(function () {
    window.City = function (options) {
        var self = this;

        self.props = _.defaultsDeep (options, {
            name: '',
            buildings: [],
            court: []
        });

        self.createCourt ();
    };

    City.prototype.createCourt = function () {
        var self = this;

        self.props.court.push (new Person ({
            name: 'Chancellor'
        }));

        self.props.court.push(new Person ({
            name: 'Marshall'
        }));

        self.props.court.push (new Person ({
            name: 'Steward'
        }));

        self.props.court.push (new Person ({
            name: 'Spymaster'
        }));

        self.props.court.push (new Person ({
            name: 'Chaplain'
        }));
    };

    City.prototype.serialize = function () {
        var self = this;
        var props = _.cloneDeep (self.props);
        
        for (var i=0; i<props.buildings.length; i++) {
            props.buildings [i] = props.buildings[i].serialize ();
        }

        for (var i=0; i<props.court.length; i++) {
            props.court [i] = props.court [i].serialize ();
        }

        return props;
    };

    City.prototype.deserialize = function (props) {
        var self = this;
        self.props = _.cloneDeep (props);
        
        for (var i=0; i<props.buildings.length; i++) {
            var building = new Building ();
            building.deserialize (props.buildings [i]);
            props.buildings [i] = building;
        }

        for (var i=0; i<props.court.length; i++) {
            var person = new Person ();
            person.deserialize (props.court [i]);
            self.props.court [i] = person;
        }
    };

    City.prototype.showDialog = function (person) {
        var self = this;

        _.find (self.props.court, function (item) {
            
            return item.props.name === person;
        }).showDialog (self);
    }
}) ();