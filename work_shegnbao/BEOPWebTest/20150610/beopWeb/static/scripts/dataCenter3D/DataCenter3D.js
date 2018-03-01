var DataCenter3D = (function () {

    function Room(domElement, dataSource) {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.domElement = domElement;
        this.dataSource = dataSource;
        this.data = null;
        this.projector = new THREE.Projector();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.stats = null;
        this.INTERSECTED = null;
        this.cameraHelper = null;
    }

    Room.prototype = {
        initScene: function () {
            this.scene = new THREE.Scene();
            this.scene.rotation.x = Math.PI / 2;
        },
        initCamera: function () {
            this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 200000);
            //this.cameraHelper = new THREE.CameraHelper(this.camera);
            this.resetView();
            this.camera.up = new THREE.Vector3(0, 0, 1);
            this.scene.add(this.camera);
            //this.scene.add(this.cameraHelper);
        },
        initRender: function () {
            this.renderer = new THREE.WebGLRenderer({antialias: true});
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0xf0f0f0, 1);
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;

            this.renderer.shadowMapEnabled = true;
            this.domElement.appendChild(this.renderer.domElement)
        },
        initControl: function () {
            this.controls = new THREE.TrackballControls(this.camera);
            this.controls.staticMoving = true;
            this.controls.addEventListener('change', this.render.bind(this));
        },
        initLight: function () {
            var light_ambient = new THREE.AmbientLight(0x000000);
            this.scene.add(light_ambient);

            var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
            hemiLight.color.setHSL(0.6, 1, 0.6);
            hemiLight.groundColor.setHSL(0.095, 1, 0.75);
            hemiLight.position.set(0, 0, 500);
            this.scene.add(hemiLight);

            var light = new THREE.DirectionalLight(0xffffff, 2.25);
            light.position.set(0, 450, 500);

            light.castShadow = true;
            light.shadowMapWidth = 1024;
            light.shadowMapHeight = 1024;
            this.scene.add(light);

        },
        initStats: function () {
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.bottom = '0px';
            this.stats.domElement.style.zIndex = 100;
            this.domElement.appendChild(this.stats.domElement);
        },
        initObjects: function () {
            if (!this.data) {
                return;
            }
            var units = this.data.units, unitItem;
            for (var n = 0, length = units.length; n < length; n++) {
                unitItem = units[n];
                var unitObj = this.executeUnitType(unitItem.type, unitItem, this);
                unitObj.castShadow = true;
                unitObj.receiveShadow = true;
                this.scene.add(unitObj);
            }

            //1.材质floor

            var gt = THREE.ImageUtils.loadTexture("/static/scripts/dataCenter3D/floor.jpg");
            var gg = new THREE.PlaneGeometry(this.data.width, this.data.height);
            var gm = new THREE.MeshBasicMaterial({color: 0xffffff, map: gt});

            var ground = new THREE.Mesh(gg, gm);
            ground.position.z = -300;
            ground.material.map.repeat.set(18, 18);
            ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;

            ground.receiveShadow = true;
            this.scene.add(ground);


            //var size = 3000;
            //var step = 100;
            //var gridHelper = new THREE.GridHelper(size, step);
            //gridHelper.position.z = -300;
            //gridHelper.rotation.x = Math.PI / 2;
            //this.scene.add(gridHelper);

        },
        loadData: function () {
            var _this = this;
            return $.getJSON(this.dataSource).done(function (data) {
                _this.data = data;
            });
        },
        executeUnitType: function (unitType, arg, scene) {
            var namespaces = unitType.split(".");
            var func = namespaces.pop();
            var context = window;
            for (var i = 0; i < namespaces.length; i++) {
                context = context[namespaces[i]];
            }
            return new context[func](arg, scene);
        },
        attachEvent: function () {
            window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
            document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        },
        cleanScene: function () {
            var elementsInTheScene = this.scene.children.length;

            for (var i = elementsInTheScene - 1; i > 0; i--) {

                if (this.scene.children [i].name != 'camera' &&
                    this.scene.children [i].name != 'ambientLight' &&
                    this.scene.children [i].name != 'directionalLight') {

                    this.scene.remove(this.scene.children [i]);
                }
            }
        },
        resetView: function () {
            this.camera.position.x = 6925.764174941334;
            this.camera.position.y = 12.494895273811855;
            this.camera.position.z = 4320.172377978487;
            if (this.controls) {
                this.controls.reset();
            }
        },
        findMouseIntersection: function (type) {
            if (!type) {
                return [];
            }
            var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
            this.projector.unprojectVector(vector, this.camera);

            this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

            var machines = this.scene.children.filter(function (item) {
                return item instanceof type;
            });
            var machinesChildren = [];
            for (var m = 0; m < machines.length; m++) {
                machinesChildren = machinesChildren.concat(machines[m].children);
            }
            var intersects = this.raycaster.intersectObjects(machinesChildren);
            return intersects.map(function (item) {
                return item.object.parent
            })[0];
        },
        enableCameraHelper: function () {
            this.cameraHelper.update();
            this.cameraHelper.visible = true;
        },
        disableCameraHelper: function () {
            this.cameraHelper.visible = false;
        },
        animate: function (time) {
            requestAnimationFrame(this.animate.bind(this));
            TWEEN.update(time);
            // find intersection
            var curObj = this.findMouseIntersection(threeData.unitType.Machine);
            if (curObj) {
                if (curObj instanceof threeData.unitType.Machine) {
                    if (curObj.userData.isMoving) {
                        return;
                    }
                    if (this.INTERSECTED && this.INTERSECTED.id != curObj.id) {
                        this.INTERSECTED.beopHideMachineName();
                    }

                    this.INTERSECTED = curObj;
                    this.INTERSECTED.beopShowMachineName();
                    this.domElement.style.cursor = 'pointer';
                }
            } else {
                if (this.INTERSECTED) {
                    this.INTERSECTED.beopHideMachineName();
                    this.domElement.style.cursor = 'auto';
                }
                this.INTERSECTED = null;
            }

            this.render();
            this.controls.update();
            this.stats.update();
            //this.camera.update();
        },
        render: function () {
            this.renderer.render(this.scene, this.camera);
        },
        start: function () {
            var _this = this;
            this.initScene();
            this.initCamera();
            this.initRender();
            this.initLight();
            this.loadData().done(function () {
                _this.initObjects();
            }).fail(function () {
                alert('load data failed.');
            });
            this.initControl();
            this.attachEvent();
            this.initStats();
            this.animate();
        },
        showMouseClickedObj: function (obj) {
            if (!obj) {
                return;
            }
            var _this = this;
            obj.userData.isMoving = true;
            //TWEEN.removeAll();
            return new TWEEN.Tween(obj.position).to({
                x: 2500,
                y: 0,
                z: 2000
            }, 2000).easing(TWEEN.Easing.Cubic.Out).onComplete(function () {
                obj.userData.isSingleShow = true;
                obj.userData.isMoving = false;
                //_this.camera.setFov(30);
            }).start();
        },
        hideMouseClickedObj: function (obj) {
            if (!obj) {
                return;
            }
            obj.userData.isMoving = true;
            //TWEEN.removeAll();
            return new TWEEN.Tween(obj.position).to({
                x: obj.userData.originPosition.x,
                y: obj.userData.originPosition.y,
                z: obj.userData.originPosition.z
            }, 2000).easing(TWEEN.Easing.Quartic.Out).onComplete(function () {
                obj.userData.isMoving = false;
                obj.userData.isSingleShow = false;
            }).start();
        },
        onMouseMove: function (event) {
            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        },
        onMouseDown: function (event) {
            var _this = this,
                curObj = this.findMouseIntersection(threeData.unitType.Machine);
            if (!curObj || curObj.userData.isMoving) {
                return;
            }

            if (!curObj.userData.isSingleShow) {
                this.hideMouseClickedObj(this.showingObj);
                this.showMouseClickedObj(curObj);
                this.showingObj = curObj;
            } else {
                this.hideMouseClickedObj(curObj);
            }

        }
    };

    function DataCenter3D() {

    }

    DataCenter3D.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            $.get("/static/views/dataCenter3D/index.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);

                _this.init();
            }).always(function () {
                Spinner.stop();
            });
        },
        init: function () {
            var room = new Room(document.getElementById('t3Container'), '/static/scripts/dataCenter3D/data_machine1.json');
            room.start();

            $('.showSkin').click(function () {
                room.scene.children.filter(function (item) {
                    return item instanceof threeData.unitType.Machine;
                }).forEach(function (machine) {
                    machine.showSkin();
                })
            });

            $('.hideSkin').click(function () {
                room.scene.children.filter(function (item) {
                    return item instanceof threeData.unitType.Machine;
                }).forEach(function (machine) {
                    machine.hideSkin();
                })
            });

            $('.showTemperature').click(function () {
                //room.scene.children.filter(function (item) {
                //    return item instanceof threeData.unitType.Machine;
                //}).forEach(function (machine) {
                //    machine.beopShowTemperature();
                //})
                room.scene.children.filter(function (item) {
                    return item instanceof threeData.unitType.Machine;
                })[0].beopShowTemperature();
            });

            $('.resetView').click(function () {
                room.resetView();
            })
        },
        close: function () {

        }
    }

    return DataCenter3D;
})();
