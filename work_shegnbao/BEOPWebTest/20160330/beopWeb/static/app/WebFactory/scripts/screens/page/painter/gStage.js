(function () {

    function GStage(painter) {
        this.painter = painter;

        this.shape = null;
        this.children = [];

        this.init();
    }

    GStage.prototype.init = function () {
        throw new Error('method "init" need to be implemented.');
    };

    GStage.prototype.removeChild = function (id) {
        var children = this.children;
        var removed = [];

        for (var i = 0, len = children.length; i < len; i++) {
            if( children[i].id() === id ) {
                removed = children.splice(i, 1);
                break;
            }
        }

        if(removed.length === 0) return false;
        return true;
    };

    GStage.prototype.close = function () {
        this.painter = null;
        this.children = null;
    };

    window.GStage = GStage;
} ());