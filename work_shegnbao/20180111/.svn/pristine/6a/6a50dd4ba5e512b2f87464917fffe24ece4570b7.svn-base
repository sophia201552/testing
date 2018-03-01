var copy = [{"_id":"1516267000947262b3f05f65","h":27.53177257525084,"idDs":[],"isHide":0,"layerId":"","option":{"bgColor":"#ffffff","equipments":[],"float":0,"fontColor":"#000000","fontFamily":"Microsoft YaHei","fontSize":20,"fontStyle":"normal","lineHeight":1,"pageId":"","pageType":"","precision":2,"preview":[],"text":"I3_1F_V07_02_04","textAlign":"left","trigger":{},"verticalAlign":"top"},"pageId":"1516180581909282b44b3ec6","type":"CanvasText","w":166.50167224080263,"x":67.16053511705684,"y":125.3010033444817},{"_id":"1516267000947262baa159ab","h":27.5,"idDs":["@717|I3_1F_V07_02_04_RmTemp"],"isHide":0,"layerId":"","option":{"bgColor":"#ffffff","equipments":[],"float":0,"fontColor":"#333333","fontFamily":"Microsoft YaHei","fontSize":18,"fontStyle":"normal","lineHeight":1,"pageId":"","pageType":"","precision":2,"preview":["20.1"],"text":"<%value%>","textAlign":"center","trigger":{},"verticalAlign":"top"},"pageId":"1516180581909282b44b3ec6","type":"CanvasText","w":68.17391304347828,"x":267.60335465769924,"y":125.3010033444817},{"_id":"1516267000947262a44245bf","h":27.5,"idDs":["@717|I3_1F_V07_02_04_RmSpKnb"],"isHide":0,"layerId":"","option":{"bgColor":"#ffffff","equipments":[],"float":0,"fontColor":"#333333","fontFamily":"Microsoft YaHei","fontSize":18,"fontStyle":"normal","lineHeight":1,"pageId":"","pageType":"","precision":2,"preview":["26"],"text":"<%value%>","textAlign":"center","trigger":{},"verticalAlign":"top"},"pageId":"1516180581909282b44b3ec6","type":"CanvasText","w":68.17391304347828,"x":364.37806159786476,"y":125.3010033444817},{"_id":"151626700094826205cc00b5","h":27.5,"idDs":["@717|I3_1F_V07_02_04_SupAirDmpr"],"isHide":0,"layerId":"","option":{"bgColor":"#ffffff","equipments":[],"float":0,"fontColor":"#333333","fontFamily":"Microsoft YaHei","fontSize":18,"fontStyle":"normal","lineHeight":1,"pageId":"","pageType":"","precision":2,"preview":["23"],"text":"<%value%>","textAlign":"center","trigger":{},"verticalAlign":"top"},"pageId":"1516180581909282b44b3ec6","type":"CanvasText","w":68.17391304347828,"x":461.1527685380303,"y":125.3010033444817},{"_id":"1516267000948262e4b61f04","h":27.5,"idDs":["@717|I3_1F_V07_02_04_AirFlow"],"isHide":0,"layerId":"","option":{"bgColor":"#ffffff","equipments":[],"float":0,"fontColor":"#333333","fontFamily":"Microsoft YaHei","fontSize":18,"fontStyle":"normal","lineHeight":1,"pageId":"","pageType":"","precision":2,"preview":["200"],"text":"<%value%>","textAlign":"center","trigger":{},"verticalAlign":"top"},"pageId":"1516180581909282b44b3ec6","type":"CanvasText","w":68.17391304347828,"x":557.9274754781958,"y":125.3010033444817}];
var stepX = 650;
var stepY = 40.10653054039776;
var offsetX = -20;
var offsetY = -20;
var maxRows = 20;
var maxRowsPoints = 20 * 4;

(function (projectId, str) {
    if (!str) return;
    str = str.replace(/(\s|\n)+(?=\w)/g, ',').trim();
    var arr = str.split(',');
    var result = [];
    for (var i = 0, len = arr.length; i < len; i += 4) {
        var row = $.extend(true, [], copy);
        var x = Math.floor(i / maxRowsPoints) * stepX + offsetX;
        var y = Math.floor(i % maxRowsPoints / 4) * stepY + offsetY;
        var prefix = `@${projectId}|`;
        row[0].option.text = arr[i];
        row[0].x += x;
        row[0].y += y;

        row[1].idDs = [prefix + arr[i]];
        row[1].x += x;
        row[1].y += y;

        row[2].idDs = [prefix + arr[i+1]];
        row[2].x += x;
        row[2].y += y;

        row[3].idDs = [prefix + arr[i+2]];
        row[3].x += x;
        row[3].y += y;

        row[4].idDs = [prefix + arr[i+3]];
        row[4].x += x;
        row[4].y += y;
        result = result.concat(row);
    }
    sessionStorage.setItem('copy', JSON.stringify(result));
} (717, ``))