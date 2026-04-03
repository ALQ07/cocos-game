导表脚本updateExcel.cmd会把【svn上的表格目录】拉取到本地，再处理成json和ts，然后直接覆盖写入到项目中，然后调起svn界面等待人为操作提交。
【svn上的表格目录】在 ./update-doc.js前面几行可以找到定义，需要修成自己的svn表格目录地址。
./title-称号表-cs.xls 是示例excel格式。