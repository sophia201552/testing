#####################
把老诊断的 excel 和 fll，转换成 mongo 导入脚本
把老诊断的 excel 中的 Fault 数据提取出来，转换成 mysql 导入脚本
#####################
开始
1、npm install
2、
npm run generate-rules-zh - 生成中文规则导入脚本
npm run generate-rules-en - 生成英文规则导入脚本
npm run generate-faults - 生成 Faults 导入脚本
npm run clean-rules - 清空生成的规则导入脚本
npm run clean-faults - 清空生成的 Faults 导入脚本

#####################
其他
debug-rules.log - 生成规则过程中的日志记录文件
debug-faults.log - 生成 Faults 过程中的日志记录文件