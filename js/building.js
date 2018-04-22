(function () {
    window.Building = function (options) {
        var self = this;

        self.props = _.defaultsDeep (options, {

        });
    }

    Building.prototype.serialize = function () {
        var self = this;
        var props = _.cloneDeep (self.props);

        return props;
    };

    Building.prototype.deserialize = function (props) {
        var self = this;
        self.props = _.cloneDeep (props);
    };
}) ();