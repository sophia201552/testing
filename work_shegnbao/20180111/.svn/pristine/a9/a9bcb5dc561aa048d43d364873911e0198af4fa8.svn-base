/**
 * Created by win7 on 2016/3/2.
 */
var SqliteDbManager = (function(){
    function SqliteDbManager(){
        this.db = undefined;
        this.enable = window.sqlitePlugin?true:false;
    }
    SqliteDbManager.prototype = {
        init:function(opt){
            if (!this.enable )return;
            var dbOpt = {
                name:opt.name?(opt.name + '.db'):'beop.db',
                location:opt.location?opt.location: 'default'
            };
            this.db = window.sqlitePlugin.openDatabase(dbOpt);
            if (opt.table) {
                for (var i = 0 ; i< opt.table.length ;i++) {
                    this.db.transaction(function (tx) {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS '+ opt.table [i].name + '(name, score)');
                    })
                }
            }
        },
        execute:function(opt){
            if(!this.db)return;
            if(!opt.sql)return;
            this.db.transaction(function(tx){
                tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
                tx.executeSql(opt.sql,opt.param,opt.success,opt.fail)
            })
        },
        disconnect:function(){
            if(!this.db)return;
            this.db.close();
            this.db = null;

        }
    };
    return SqliteDbManager
}());