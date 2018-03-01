var threeDRender = (function() {
    var _this;
    var isNeed3D = false;
    function threeDRender(dom,config) {
        _this = this;
        this.image = new Image();
        this.mapDegree = [];
        this.mapCoordinate = [];
        this.scene = new THREE.Scene();
        this.data = [];
        this.canvas = null;
        this.heat = null;
        this.mapConfig = $.extend({
            near: -2000,
            far: 5000,
            position: -2000
        } ,config);
        this.container = typeof dom === 'string' ? document.getElementById(dom) : dom;
    }

    threeDRender.prototype = {
        render: function() {
            _this.initRoom();
        },
        initRoom: function() {
            isNeed3D&&this.createMap();
            this.initTerrain();
        },

        //创建山地图
        initTerrain: function() {
            var matrix = [];
            var sumTemp = 0;
            var avgTemp;
            var terrain = null;
            var mapCoordinate = _this.mapCoordinate;
            var mapDegree = _this.mapDegree;

            avgTemp = sumTemp / mapDegree.length;
            // var heightMap = drawColor('heightmap');
            var colorMap = drawColor();
            isNeed3D&&load_terrain(heightMap, colorMap);


            function createTerrain(texture_heightmap, diffuse) {
                var texture_diffuse = typeof diffuse === 'undefined' ? texture_heightmap :
                    THREE.ImageUtils.loadTexture(diffuse);

                var terrainShader = THREE.ShaderTerrain["terrain"];
                var uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);


                uniformsTerrain["tDisplacement"].value = texture_heightmap;
                uniformsTerrain["uDisplacementScale"].value = 500;

                uniformsTerrain["tDiffuse1"].value = texture_diffuse;
                uniformsTerrain["enableDiffuse1"].value = true;

                var material = new THREE.ShaderMaterial({
                    uniforms: uniformsTerrain,
                    vertexShader: terrainShader.vertexShader,
                    fragmentShader: terrainShader.fragmentShader,
                    lights: true,
                    fog: false,
                    side: THREE.DoubleSide,
                });

                // we use a plane to render our terrain
                var geometry = new THREE.PlaneGeometry(_this.mapConfig.width, _this.mapConfig.height, 256, 256);
                geometry.computeFaceNormals();
                geometry.computeVertexNormals();
                geometry.computeTangents();

                for (i = 0; i < _this.scene.children.length; i++) {
                    if (_this.scene.children[i].name == 'tempTerrain') {
                        _this.scene.remove(_this.scene.children[i]);
                    }
                }
                terrain = new THREE.Mesh(geometry, material);
                terrain.name = 'tempTerrain';
                terrain.position.y = -300;
                terrain.rotateX(-Math.PI / 2);
                return terrain;
            }

            function load_terrain(heightmap, diffuse) {
                var texture_heightmap = THREE.ImageUtils.loadTexture(heightmap);
                _this.scene.add(createTerrain(texture_heightmap, diffuse));
            }

            function drawColor(type) {
                _this.canvas = document.createElement('canvas');
                _this.canvas.width = _this.mapConfig.width;
                _this.canvas.height = _this.mapConfig.height;
                _this.heat = simpleheat(_this.canvas).data(_this.data);
                _this.heat.max(_this.mapConfig.max).min(_this.mapConfig.min);

                if (type == 'heightmap') {
                    _this.heat.draw();
                } else {
                    _this.heat.drawColor();
                }
                _this.image = new Image();
                _this.image.src = _this.canvas.toDataURL("image/png");
                if(type != 'heightmap'){
                    _this.mapConfig.afterDraw(_this.image.src);
                }
                
                return _this.image.src;
            }

        },
        createMap: function() {
            var camera, scene, renderer, control;
            init();
            setTimeout(render,0);
            function init() {
                // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
                // camera.position.set(1438, 232, 2067);
                var width = _this.mapConfig.width,
                    height = _this.mapConfig.height,
                    near = _this.mapConfig.near,
                    far = _this.mapConfig.far,
                    position = _this.mapConfig.position;
                camera = new THREE.OrthographicCamera(-width/2, width/2, -height/2, height/2, near, far);
                camera.position.set(0, position, 0);

                scene = _this.scene;

                var light = new THREE.AmbientLight(0xffffff);
                scene.add(light);

                renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
                renderer.setClearColor(0x22252E,0);
                renderer.setSize(width, height);
                //控制器
                // control = new THREE.OrbitControls(camera, renderer.domElement);
                
                _this.container.appendChild(renderer.domElement);
                _this.container.innerHTML = '';
            }

            function render() {
                camera.lookAt(scene.position);
                renderer.render(scene, camera);            
            };
        },
        close: function() {
            if (this.workerUpdate) this.workerUpdate.terminate();
            _this.container.empty();
        },
        setData: function(data) {
            this.data = data;
        }
    }
    return threeDRender;
})()