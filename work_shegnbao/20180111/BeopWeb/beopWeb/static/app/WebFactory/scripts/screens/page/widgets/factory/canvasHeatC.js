﻿(function(exports) {
  var defaultMin = 10,
    defaultMax = 40,
    defaultRadius = 50,
    defaultIsGradient = true,
    defaultColor = '10,#0a6592;17.5,#2a9d8f;25,#e9c46a;32.5,#f4a261;40,#E71D36',
    default3DColor = '10,#3434ff;15,#35ffff;20,#36fe94;25,#6ff71c;30,#9fff39;35,#ffa922;40,#ff2323';
  var _this;
  function CanvasHeatC(option) {
    _this = this;
    option = option || {};
    this.canvsdpalette = undefined;
    this.max(option.max);
    this.min(option.min);
    this.data(option.data);
    this.setGradient(option.gradient);
    this.radius(option.radius);
    this.setIsGradient(option.isGradient);
    this._grad = undefined;
  }

  CanvasHeatC.prototype = {
    radius: function(radius) {
      this._radius = radius == undefined ? defaultRadius : radius;
      return this;
    },
    setGradient: function(gradient) {
      gradient = gradient || defaultColor;
      var map = {};
      gradient
        .split(';')
        .filter(function(v) {
          return v !== '';
        })
        .forEach(function(v, index) {
          var temp = v.split(',');
          var num = (Number(temp[0]) - _this._min) / (_this._max - _this._min);
          map[num] = temp[1];
        });
      this._gradient = map;
      return this;
    },
    data: function(data) {
      data = data || 0;
      this._data = isNaN(Number(data)) ? 0 : Number(data);
      return this;
    },

    max: function(max) {
      this._max = max == undefined ? defaultMax : max;
      return this;
    },

    min: function(min) {
      this._min = min == undefined ? defaultMin : min;
      return this;
    },
    setIsGradient: function(isGradient) {
      this._isGradient =
        isGradient == undefined ? defaultIsGradient : isGradient;
      return this;
    },

    gradient: function(grad) {
      // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
      this.canvsdpalette = document.createElement('canvas');
      var ctx = this.canvsdpalette.getContext('2d');
      this.canvsdpalette.width = 1;
      this.canvsdpalette.height = 256;

      var gradient = ctx.createLinearGradient(0, 0, 0, 256);
      for (var i in grad) {
        gradient.addColorStop(i, grad[i]);
      }
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1, 256);
      ctx.restore();

      this._grad = ctx.getImageData(0, 0, 1, 256).data;

      return this;
    },
    getColorBlock: function() {
      var leftMax = 0,
        rightMin = 0;
      var data = (this._data - this._min) / (this._max - this._min);
      for (var i in this._gradient) {
        if (data > i && leftMax <= i) {
          leftMax = i;
        } else if (data <= i && rightMin >= i) {
          rightMin = i;
        }
      }
      return this._gradient[leftMax];
    },

    color: function() {
      if (!this._isGradient) {
        return this.getColorBlock();
      }
      if (!this._grad) {
        this.gradient(this._gradient);
      }

      var pAlpha, shadowColor;

      var a = 1 / (this._max - this._min),
        b = this._min / (this._min - this._max),
        c = (this._max - this._min) / 2;

      // draw a grayscale heatmap by putting a blurred circle at each data point
      var temp = this._data;

      //if (temp < this._max && temp > this._min) {
      //    pAlpha = (c - Math.abs(temp - this._min - c)) / c;
      //    pAlpha = pAlpha < 0.5 ? pAlpha * 0.4 : pAlpha * 0.9;
      //} else {
      //    pAlpha = 0.9;
      //}
      var intTemp = parseInt(temp),
        x = intTemp - this._min,
        j,
        color;
      j = x < 0 ? 0 : parseInt(256 * a * x) * 4;
      if (j >= 1024) j = 1020;

      //var a = this._max - this._min;
      //this._max += a/2;
      //this._min -= a/2;
      //var j;
      //if (temp <= this._min) {
      //    j = 0;
      //} else if (temp >= this._max) {
      //    j = 1020;
      //} else {
      //    var b = (temp-this._min) / (a * 2);
      //    j = parseInt(b * 256) * 4;
      //}
      //console.log(j)

      // create a grayscale blurred circle image that we'll use for drawing points
      shadowColor =
        'rgb(' +
        this._grad[j] +
        ', ' +
        this._grad[j + 1] +
        ', ' +
        this._grad[j + 2] +
        ')';

      return shadowColor;
    },
    destroy: function() {
      this._data = null;
      this._canvas = null;
    }
  };
  exports.CanvasHeatC = CanvasHeatC;

  var _this;
  var isNeed3D = false;
  function threeDRender(dom, config) {
    _this = this;
    this.image = new Image();
    this.mapDegree = [];
    this.mapCoordinate = [];
    isNeed3D && (this.scene = new THREE.Scene());
    this.data = [];
    this.canvas = null;
    this.heat = null;
    this.mapConfig = $.extend(
      {
        near: -2000,
        far: 5000,
        position: -2000
      },
      config
    );
    this.container =
      typeof dom === 'string' ? document.getElementById(dom) : dom;
  }

  threeDRender.prototype = {
    render: function() {
      _this.initRoom();
    },
    initRoom: function() {
      isNeed3D && this.createMap();
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
      isNeed3D && load_terrain(heightMap, colorMap);

      function createTerrain(texture_heightmap, diffuse) {
        var texture_diffuse =
          typeof diffuse === 'undefined'
            ? texture_heightmap
            : THREE.ImageUtils.loadTexture(diffuse);

        var terrainShader = THREE.ShaderTerrain['terrain'];
        var uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);

        uniformsTerrain['tDisplacement'].value = texture_heightmap;
        uniformsTerrain['uDisplacementScale'].value = 500;

        uniformsTerrain['tDiffuse1'].value = texture_diffuse;
        uniformsTerrain['enableDiffuse1'].value = true;

        var material = new THREE.ShaderMaterial({
          uniforms: uniformsTerrain,
          vertexShader: terrainShader.vertexShader,
          fragmentShader: terrainShader.fragmentShader,
          lights: true,
          fog: false,
          side: THREE.DoubleSide
        });

        // we use a plane to render our terrain
        var geometry = new THREE.PlaneGeometry(
          _this.mapConfig.width,
          _this.mapConfig.height,
          256,
          256
        );
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
        _this.heat = simpleheat(_this.canvas,_this.mapConfig).data(_this.data);

        if (type == 'heightmap') {
          _this.heat.draw();
        } else {
          _this.heat.drawColor();
        }
        _this.image = new Image();
        _this.image.src = _this.canvas.toDataURL('image/png');
        if (type != 'heightmap') {
          _this.mapConfig.afterDraw(_this.image.src);
        }

        return _this.image.src;
      }
    },
    createMap: function() {
      var camera, scene, renderer, control;
      init();
      setTimeout(render, 0);
      function init() {
        // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        // camera.position.set(1438, 232, 2067);
        var width = _this.mapConfig.width,
          height = _this.mapConfig.height,
          near = _this.mapConfig.near,
          far = _this.mapConfig.far,
          position = _this.mapConfig.position;
        camera = new THREE.OrthographicCamera(
          -width / 2,
          width / 2,
          -height / 2,
          height / 2,
          near,
          far
        );
        camera.position.set(0, position, 0);

        scene = _this.scene;

        var light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x22252e, 0);
        renderer.setSize(width, height);
        //控制器
        // control = new THREE.OrbitControls(camera, renderer.domElement);

        _this.container.appendChild(renderer.domElement);
        _this.container.innerHTML = '';
      }

      function render() {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      }
    },
    close: function() {
      if (this.workerUpdate) this.workerUpdate.terminate();
      _this.container.empty();
    },
    setData: function(data) {
      this.data = data;
    }
  };
  exports.threeDRender = threeDRender;
})(namespace('widgets.factory'));

//(function (exports) {

//    function CanvasHeatC(canvas) {
//        if (canvas) {
//            if (!(this instanceof CanvasHeatC)) {
//                return new CanvasHeatC(canvas);
//            }

//            this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
//            this.canvsdpalette = undefined;
//            this._ctx = canvas.getContext('2d');
//            this._width = canvas.width;
//            this._height = canvas.height;

//            this._max = 1;
//            this._data = [];
//        }
//    }

//    CanvasHeatC.prototype = {

//        defaultRadius: 100,

//        defaultGradient: {
//            0: 'blue',
//            0.25: 'cyan',
//            0.5: 'lime',
//            0.75: 'yellow',
//            1.0: 'red'
//        },

//        data: function (data) {
//            this._data = data;
//            return this;
//        },

//        max: function (max) {
//            this._max = max;
//            return this;
//        },

//        min: function (min) {
//            this._min = min;
//            return this;
//        },

//        add: function (point) {
//            this._data.push(point);
//            return this;
//        },

//        showColor: function (data, minOpacity) {
//            return this.getColor(data, minOpacity);
//        },

//        clear: function () {
//            this._data = [];
//            return this;
//        },

//        gradient: function (grad) {
//            // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
//            this.canvsdpalette = document.createElement('canvas');
//            var ctx = this.canvsdpalette.getContext('2d');
//            this.canvsdpalette.width = 1;
//            this.canvsdpalette.height = 256;

//            var gradient = ctx.createLinearGradient(0, 0, 0, 256);
//            for (var i in grad) {
//                gradient.addColorStop(i, grad[i]);
//            }
//            ctx.save();
//            ctx.globalAlpha = 1;
//            ctx.fillStyle = gradient;
//            ctx.fillRect(0, 0, 1, 256);
//            ctx.restore();

//            this._grad = ctx.getImageData(0, 0, 1, 256).data;

//            return this;
//        },

//        draw: function (minOpacity) {
//            if (!this._grad) {
//                this.gradient(this.defaultGradient);
//            }

//            var ctx = this._ctx, pAlpha;

//            //ctx.clearRect(0, 0, this._width, this._height);
//            var a = 1 / (this._max - this._min), b = this._min / (this._min - this._max), c = (this._max - this._min) / 2;

//            // draw a grayscale heatmap by putting a blurred circle at each data point
//            for (var i = 0, len = this._data.length, p, temp; i < len; i++) {
//                p = this._data[i], temp = p[2];
//                if (temp == 0) continue;

//                if (temp < this._max && temp > this._min) {
//                    pAlpha = (c - Math.abs(temp - this._min - c)) / c;
//                    pAlpha = pAlpha < 0.5 ? pAlpha * 0.4 : pAlpha * 0.9;
//                } else {
//                    pAlpha = 0.9;
//                }

//                var r = this.defaultRadius;
//                var blur = blur || 30;

//                // create a grayscale blurred circle image that we'll use for drawing points
//                var circle = document.createElement('canvas'),
//                    ctxCircle = circle.getContext('2d'),
//                    r2 = this._r = r + blur;

//                circle.width = circle.height = r2 * 2;

//                ctxCircle.save();
//                ctxCircle.shadowOffsetX = ctxCircle.shadowOffsetY = 200;
//                ctxCircle.shadowBlur = blur;

//                var intTemp = parseInt(temp), x = intTemp - this._min, j, color;
//                j = x < 0 ? 0 : parseInt(256 * a * x) * 4;
//                if (j >= 1024) j = 1020;

//                ctxCircle.shadowColor = ctxCircle.fillStyle = 'rgba(' + this._grad[j] + ', ' + this._grad[j + 1] + ', ' + this._grad[j + 2] + ', ' + Math.max(minOpacity, pAlpha) + ')';

//                ctxCircle.beginPath();
//                ctxCircle.arc(r2 - 200, r2 - 200, r, 0, Math.PI * 2, true);
//                ctxCircle.closePath();
//                ctxCircle.fill();
//                ctxCircle.restore();

//                //ctx.globalAlpha = Math.max(minOpacity, pAlpha);
//                ctx.drawImage(circle, p[0] - this._r, p[1] - this._r);

//                ctxCircle = null;
//                circle = null;
//            }

//            return this;
//        },

//        getColor: function (data,minOpacity) {
//            if (!this._grad) {
//                this.gradient(this.defaultGradient);
//            }

//            var pAlpha, color;

//            var a = 1 / (this._max - this._min),
//                b = this._min / (this._min - this._max),
//                c = (this._max - this._min) / 2;
//            var temp = data;

//            if (temp < this._max && temp > this._min) {
//                pAlpha = (c - Math.abs(temp - this._min - c)) / c;
//                pAlpha = pAlpha < 0.5 ? pAlpha * 0.4 : pAlpha * 0.9;
//            } else {
//                pAlpha = 0.9;
//            }
//            var intTemp = parseInt(temp), x = intTemp - this._min, j;
//            j = x < 0 ? 0 : parseInt(256 * a * x) * 4;
//            if (j >= 1024) j = 1020;

//            color = 'rgba(' + this._grad[j] + ', ' + this._grad[j + 1] + ', ' + this._grad[j + 2] + ', ' + Math.max(minOpacity, pAlpha) + ')';

//            return color;
//        },

//        destroy: function () {
//            this._data = null;
//            this._canvas = null;
//        }
//    };
//    window.CanvasHeatC = CanvasHeatC
//    exports.CanvasHeatC = CanvasHeatC;
//}(namespace('widgets.factory')));
