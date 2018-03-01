#Icon文件替换说明

1. 将所有Icon开头(iconfont.css, iconfont.eot iconfont.js, iconfont.svg, iconfont.ttf, iconfont.woff)的文件复制\static\app\StrategyV2\app\themes\default\iconfont   路径中粘贴并替换所有相同文件
2. 打开iconfont.js文件,替换 fill="#333333", fill="#666666", fill="#999999" 为 fill=""并保存修改
3. 新的icon替换完成

#Icon使用说明

1. 复制代码
``
<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-xxx"></use>
</svg>
``
2. 找到需要使用的字体库的名称替换掉xxx
3. 修改样式之后页面就可以正常使用了