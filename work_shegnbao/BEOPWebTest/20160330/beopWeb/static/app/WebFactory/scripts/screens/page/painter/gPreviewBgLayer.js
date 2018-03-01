/** 
 * 背景图层
 */

(function (GBgLayer) {

    function GPreviewBgLayer() {
        GBgLayer.apply(this, arguments);
    }

    GPreviewBgLayer.prototype = Object.create(GBgLayer.prototype);
    GPreviewBgLayer.prototype.constructor = GPreviewBgLayer;

    GPreviewBgLayer.prototype.update = function () {
        var options = this.store.model.option();
        var parseInfo;

        GBgLayer.prototype.update.call(this, arguments);

        if (options.type === 'html') {
            var parseInfo = this.getFormatHtml(options.html);
            this.shape.style.backgroundColor = '';
            this.shape.innerHTML = parseInfo.html;
            this.runScript(parseInfo.scriptContent);
        }
    };

    GPreviewBgLayer.prototype.getFormatHtml = function(html) {
        var _this = this;
        var patternScript = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;
        var scriptContent = [];

        var wrapTpl = '(function() { |code| }).call()';
        // script 标签处理
        var formatHtml = html.replace(patternScript, function($0, $1, $2, $3) {
            if( $2.trim() !== '') scriptContent.push( $2 );
            return '';
        });

        return {
            scriptContent: wrapTpl.replace( '|code|', scriptContent.join(';\n') ),
            html: formatHtml
        }
    };

    // 运行指定的 js 脚本
    GPreviewBgLayer.prototype.runScript = function (content) {
        var done = false;
        var script = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        script.type = "text\/javascript";
        script.text = content;
        head.appendChild(script);
        head.removeChild(script);
    };

    window.layers = window.layers || {};
    window.layers.bg = GPreviewBgLayer;
} (window.layers.bg));