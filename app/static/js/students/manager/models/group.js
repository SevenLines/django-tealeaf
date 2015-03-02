/**
 * Created by m on 02.03.15.
 */
app.factory("Group", ['_Base', '$rootScope', function (_Base, $rootScope) {
    function Group(data) {
        this.id = data.id;
        this.year = data.year;
        this.title = data.title;
        this.ancestor = data.ancestor;
        this.captain = data.captain;
        this.has_ancestor = data.has_ancestor;

        this.init_data = data;
    }

    helpers.extend(Group, _Base);

    Group.prototype.class = function () {
        return {
            'list-group-item-danger': this._destroy,
            'list-group-item-success': !this._destroy && this.changed(),
            'active': this.id == $rootScope.group_id
        };
    };

    Group.prototype.data = function () {
        var out = {};
        for (var key in this.init_data) {
            out[key] = this[key];
        }
        if (this._destroy) {
            out['_destroy'] = true;
        }
        return out;
    };

    return Group;
}]);
