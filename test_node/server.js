/***�򵥵�˵,node.js���������ڷ���˵�JavaScript
��һ������Chrome JavaScript�����ǽ�����һ��ƽ̨
��һ���¼�����I/O�����JavaScript����,����google��v8����
��˲�������ܵķ���
ʵʱ�Զ�����,Ҫ���û�һֱ�����������һ����Ч����,ʵ�ַ���:���û��ͷ�����֮�䱣�ֳ���ѯ:��һ������HTTPģ��������ӵļ���,
��������Դ��https://www.zhihu.com/question/33578075

***/

var http=require("http");
http.createServer(function(request,response){
	//����httpͷ��
	//http ״ֵ̬ 200:ok
	//��������:text/plain
	response.writeHead(200,{'Content-Type':'text/plain'});
	//������Ӧ����"hello world"
	response.end("hello world\n");
	
}).listen(8888);
//�ն˴�ӡ������Ϣ
console.log('server running at http://127.0.0.01:888');