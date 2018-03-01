var path = (function(){
	function path(){
		// this.path = router;
	}
	path.prototype = {
		back:function(router){
			var path = router[router.length-2];
            var id = path.data[0].id;
            var type = path.data[0].type;
            var title =  path.data[0].title;
            var parentName =  path.data[0].parentName;
            if(path.classFun.$ctn.length !== 0){//listPanel
            	if(path.data[0].type === ""){//setOption
                    path.classFun.setOption(id)
                }else{//initThings
                    var postData = {
                        parent: [{
                            id: id,
                            type: type
                        }]
                    };
                    var groupTitle = title;
                    path.classFun.initThings(postData,groupTitle);
                }
            }else{
        		path.classFun.info(id,type,name,parentName);
            }
		},
		to:function(){

		},
	}
	return path;
})()