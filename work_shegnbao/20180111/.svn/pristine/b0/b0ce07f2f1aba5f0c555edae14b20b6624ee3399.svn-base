(function(exports){
    class resize{
        constructor(){
            this.pool = [];
        }
        init(){
            $(window).resize(
                function(){this.onResize()}.bind(this)
            )
        }
        onResize(){
            this.pool.filter(function(item){return item && (item.target == 'window' || !item.target)}).forEach(function(item){
                if (item && typeof item.ev == 'function'){
                    if (!item.ins){
                        item.ev();
                    }else{
                        item.ev.call(item.ins)
                    }
                }
            })
        };
        add(opt){
            this.pool.push(opt)
        }
        delete(target){
            if (!target){
                this.pool.pop()
            }else{
                this.pool = this.pool.filter(function(item){
                    item.block != target.block && item.id != target.id;
                })
            }
        }
        empty(){
            this.pool = [];
        }
    }
    exports.resize = resize;
}(namespace('cmpt')))