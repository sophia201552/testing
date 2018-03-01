/**
 * Created by vicky on 2015/11/24.
 */

/*Memento */
(function(exports){
    function Memento(state){
        this.state = state;
    }

    Memento.prototype.setState = function(state){
        this.state = state;
    };

    Memento.prototype.getState = function(){
        return this.state;
    };

    exports.Memento = Memento;
}(window));


(function(exports){
    function Originator(data){
        //转换成 Immutable结构数据
        this.state = Immutable.fromJS(data);
    }

    Originator.prototype.createMemento = function(){
        return new exports.Memento(this.state);
    };

    Originator.prototype.restoreMemento = function(memento){
        this.state = memento.getState();
    };

    Originator.prototype.setState = function(state, value){
        this.state = this.state.setIn(state, value);
        /*
        //view state detail
        function consl(o){
			o.map(function(value, key) {
				console.log('key:' + key + '   value:' + value);
			});
			console.log('======================');
		}
        consl(this.state);*/
    };

    Originator.prototype.getState = function(){
        return this.state;
    };

    exports.Originator = Originator;
}(window));

/**
 * 使用immutable操作数据
 */
(function(exports){
    function Manager(){
        //this.mementoList = Immutable.List.of();
        this.mementoList = [];
    }

    Manager.prototype.retrieveMemento = function(index){
        return this.mementoList[index];
    }

    Manager.prototype.saveMemento = function(memento){
        this.mementoList.push(memento);

    }

    exports.Manager = Manager;
}(window));


(function test(exports){
    var originator = new exports.Originator({state: 'good States', arr: [{a1: 'a1', b1: 'b1'}]});//初始化发起者时,初始化数据
    var manager = new exports.Manager();
    manager.saveMemento(originator.createMemento());

    originator.setState(['arr',0,'b1'], 100);
    manager.saveMemento(originator.createMemento());

    originator.setState(['arr',0,'a1'], 'str');
    manager.saveMemento(originator.createMemento());

    originator.setState(['state'], 'bad state');
    manager.saveMemento(originator.createMemento());

    originator.restoreMemento(manager.retrieveMemento(0));

}(window));


