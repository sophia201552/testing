var threeDRender=(function(){
	var _this;

	function threeDRender(){
        _this=this;
        _this.image=new Image();
        _this.mapDegree = [];
        _this.mapCoordinate = [];
        _this.mode = 'temp';
        _this.scene = new THREE.Scene();
	}

	threeDRender.prototype={
      render:function(){
            _this.initRoom();      
            
        },
	  initRoom: function () {
            WebAPI.get('/appTemperature/room/getDetail/' + curRoom['_id']).done(function (resultData) {
                sensorAll = [];
                ctrAll = [];
                spaceAll = resultData.data.space;
                resultData.data.device.forEach(function (val) {
                    if (val.type.indexOf('Sensor') > -1) {
                        sensorAll.push(val)
                    } else {
                        ctrAll.push(val)
                    }
                });
                _this.initWorkerUpdate();
                _this.getCoordinate(sensorAll);
                _this.createMap();               
                
            })
        },
         initWorkerUpdate: function () {
            if (!sensorAll || !ctrAll) return;
            if (this.workerUpdate) this.workerUpdate.terminate();
            this.workerUpdate = new Worker("static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) {
                console.log(e);                
            }, true);
            var pointList = {dsItemIds: []};
            for (var i = 0; i < sensorAll.length; i++) {
                for (var ele in sensorAll[i].arrP) {
                    pointList.dsItemIds.push(sensorAll[i].arrP[ele]);
                }
            }
            if (_this.mode == 'device') {
                for (var i = 0; i < ctrAll.length; i++) {
                    for (var ele in ctrAll[i].arrP) {
                        pointList.dsItemIds.push(ctrAll[i].arrP[ele]);
                    }
                }
            }
            this.workerUpdate.postMessage({pointList: pointList.dsItemIds, type: "roomInfoRealtime", roomId: curRoom._id});
        },
          refreshData: function (e) {//e.data={data: [],mode: 0}  
            var $device, data;
            if (!e.data.data) return;
            data = e.data.data;
            _this.getDegree(data); 
            _this.initTerrain();
        },

         getDegree: function (data) {
            _this.mapDegree = [];
            for (var i = 0; i < data.length; i++) {
                _this.mapDegree.push(data[i].data);
            }
            
        },
        getCoordinate: function (data) {
            _this.mapCoordinate = [];
            for (var i = 0; i < data.length; i++) {
                var x = data[i].params.gps[0];
                var y = data[i].params.gps[1];
                var arr = [x, y];
                _this.mapCoordinate.push(arr);
            }
           
        },
        //创建山地图
        initTerrain: function () {
            var matrix=[];
            var sumTemp=0;
            var avgTemp;
            var terrain=null;
            var mapCoordinate = _this.mapCoordinate;
            var mapDegree = _this.mapDegree;
            var arrVector3 = [];
            var configMap = {
                heat_radius: 5,
                heat_blur: 40,
                heat_interval_y:100,
                heat_interval_x: 200,
                maxDistanceToCalc: 280,
                limitedDistance: 50,
                TEMP_RANGE: {
                    min: 20,
                    max: 30
                }
            };
            
            for (var i = 0; i < mapCoordinate.length; i++) {
                sumTemp=parseFloat(mapDegree[i])+sumTemp;
                arrVector3.push([mapCoordinate[i][0], mapCoordinate[i][1], mapDegree[i]]);
            }            
                   
            avgTemp=sumTemp/mapDegree.length;
            var heightMap=drawColor('heightmap');
            var colorMap=drawColor();
            load_terrain(heightMap,colorMap); 


                function createTerrain(texture_heightmap, diffuse) {
                var texture_diffuse = typeof diffuse === 'undefined' ? texture_heightmap :
                    THREE.ImageUtils.loadTexture(diffuse);

                var terrainShader = THREE.ShaderTerrain[ "terrain" ];
                var uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);


                uniformsTerrain[ "tDisplacement" ].value = texture_heightmap;
                uniformsTerrain[ "uDisplacementScale" ].value = 500;

                uniformsTerrain[ "tDiffuse1" ].value = texture_diffuse;
                uniformsTerrain[ "enableDiffuse1" ].value = true;

                var material = new THREE.ShaderMaterial({
                    uniforms:       uniformsTerrain,
                    vertexShader:   terrainShader.vertexShader,
                    fragmentShader: terrainShader.fragmentShader,
                    lights:         true,
                    fog:            false,
                    side: THREE.DoubleSide,                    
                });

                // we use a plane to render our terrain
                var geometry = new THREE.PlaneGeometry(mapConfig.width,mapConfig.height, 256, 256);
                geometry.computeFaceNormals();
                geometry.computeVertexNormals();
                geometry.computeTangents();

                for(i=0;i<_this.scene.children.length;i++){
                    if(_this.scene.children[i].name=='tempTerrain'){
                        _this.scene.remove(_this.scene.children[i]);
                    }
                }
                terrain=new THREE.Mesh(geometry, material);
                terrain.name='tempTerrain';
                terrain.position.y=-300;
                terrain.rotateX(-Math.PI/2); 
                return  terrain;
            }
            function load_terrain(heightmap, diffuse) {
                var texture_heightmap = THREE.ImageUtils.loadTexture(heightmap);
                _this.scene.add( createTerrain(texture_heightmap, diffuse) ); 
            }
            function drawColor(type) {
                var _this = this;
                _this.canvas = document.createElement('canvas');
                _this.canvas.width = mapConfig.width;
                _this.canvas.height = mapConfig.height;
                _this.heat = simpleheat(_this.canvas).data(arrVector3);
                _this.heat.max(avgTemp);
                
                if(type=='heightmap'){
                    _this.heat.draw();
                }
                else{
                    _this.heat.drawColor();
                }
                _this.image=new Image();
                _this.image.src = _this.canvas.toDataURL("image/png");
                return _this.image.src ;
            }
            
        },
        createMap: function () {
            var container, camera, scene, renderer, control;
            init();
            animate();
            function init() {
            	var container = $('#3DMap');	                                         
                camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
                camera.position.set(1438, 232, 2067);
                scene = _this.scene;

                var light=new THREE.AmbientLight(0xffffff);
                scene.add(light);
                var geoLeft = new THREE.PlaneGeometry(mapConfig.height, mapConfig.height, 10, 10);
                var mtlLeft = new THREE.MeshBasicMaterial({
                    map: createTexture(mapConfig.height, mapConfig.height),
                    side: THREE.DoubleSide
                });
                var meshLeft = new THREE.Mesh(geoLeft, mtlLeft);
                meshLeft.position.x = -mapConfig.width / 2;
                meshLeft.rotateY(Math.PI / 2);
                meshLeft.name="meshLeft";

                var geoRight = new THREE.PlaneGeometry(mapConfig.width, mapConfig.height, 10, 10);
                var mtlRight = new THREE.MeshBasicMaterial({
                    map: createTexture(mapConfig.width, mapConfig.height),
                    side: THREE.DoubleSide
                });
                var meshRight = new THREE.Mesh(geoRight, mtlRight);
                meshRight.position.z = -mapConfig.height / 2;
                //meshRight.rotateY(Math.PI);
                meshRight.name="meshRight";

             var onProgress = function (xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log(Math.round(percentComplete, 2) + '% downloaded');
                }
            };

            var onError = function (xhr) {
                console.log('模型加载失败！');
            };
            var loader=new THREE.JSONLoader();
            loader.load('/static/app/temperatureControl/scripts/observer/1103.js',function(object,materials) {          
            materials.forEach(function (mat) {                
                mat.side= THREE.DoubleSide;
            });
                
                var mesh=new THREE.Mesh(object,new THREE.MultiMaterial( materials ));
                mesh.position.x = 0;
                mesh.position.y = -400;
                mesh.position.z = 0;
                mesh.scale.set(1.3,1,0.9);
                mesh.name="model1103";
                objHouse = scene.add(mesh);
                scene.add(meshLeft);
                scene.add(meshRight);
                Spinner.stop();
            }, onProgress, onError);

                renderer = new THREE.WebGLRenderer();
                renderer.setClearColor(0x22252E);
                renderer.setSize(window.innerWidth, window.innerHeight);
                //控制器
                control = new THREE.OrbitControls( camera, renderer.domElement );
                renderer.domElement.style.position = 'absolute';                
                container.innerHTML = '';
                container.append(renderer.domElement);
                
            }

            function createTexture(width, height) {
                var gridDetail = {
                    STYLE: "lightgrey",
                    GRID_LINE_WIDTH: 1,
                    grid_width: 50,
                    grid_height: 50
                };
                var can = document.createElement('canvas');
                can.width = width;
                can.height = height;
                var context = can.getContext("2d");
                /*填充背景*/
                context.rect(0, 0, width, height);
                context.fillStyle = "rgba(255,255,255,0.1)";
                context.fill();

                var rows = parseInt(width / gridDetail.grid_width);
                var cols = parseInt(height / gridDetail.grid_height);
                context.lineWidth = gridDetail.GRID_LINE_WIDTH;
                context.strokeStyle = gridDetail.STYLE;
                for (var j = 0; j < rows; j++) {
                    context.beginPath();
                    context.moveTo(0, j * gridDetail.grid_width);
                    context.lineTo(width, j * gridDetail.grid_width);
                    context.stroke();
                }
                var texture = new THREE.CanvasTexture(can);
                return texture;

            };

            function animate() {
                requestAnimationFrame(animate);
                render();
            };
            function render() {
                camera.lookAt(scene.position);
                renderer.render(scene, camera);
                //console.log(camera.position);               
            };
        },
        close: function () {
            if (this.workerUpdate) this.workerUpdate.terminate();            
            $('#3DMap').empty();
        },
	}
    return threeDRender;
})()