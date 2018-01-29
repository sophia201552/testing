/***简单的说,node.js就是运行在服务端的JavaScript
是一个基于Chrome JavaScript运行是建立的一个平台
是一个事件驱动I/O服务端JavaScript环境,基于google的v8引擎
后端部署高性能的服务
实时自动更新,要让用户一直与服务器保持一个有效连接,实现方法:让用户和服务器之间保持长轮询:是一个利用HTTP模拟持续链接的技巧,
以上内容源自https://www.zhihu.com/question/33578075

***/

var http=require("http");
http.createServer(function(request,response){
	//发送http头部
	//http 状态值 200:ok
	//内容类型:text/plain
	response.writeHead(200,{'Content-Type':'text/plain'});
	//发送相应数据"hello world"
	response.end("hello world\n");
	
}).listen(8888);
//终端打印如下信息
console.log('server running at http://127.0.0.01:888');