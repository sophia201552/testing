/**
 * 切换到模块配置 -> 规则代码视图，将下面代码贴到 Console 中执行
 */
var pattern = /rule[^\n]*?(?=\n|$)/mg, ins = $('.CodeMirror')[0].CodeMirror, val = ins.getValue(), match, arr = [], result = []; while(match = pattern.exec(val)) { arr.push(match[0]); }arr.forEach(row => { if (result.indexOf(row) === -1) { result.push(row); } });ins.setValue(val.replace(/rule(?:\n|.)*$/mg, '  ' + result.join('\n  ')))