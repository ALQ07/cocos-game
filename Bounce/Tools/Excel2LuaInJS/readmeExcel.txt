1、表名称，参照：constant-常量表-cs.xls， 其中：
	“constant”为英文名，导出到lua时使用，大小写均可，建议统一为小写；
	“常量表”为中文名，便于查找；
	“cs”表示客户端和服务器通用，另有c表示客户端专用，s表示服务器专用，大小写均可；
三个参数使用-（减号）连接；
后缀应为xls，打表工具不支持xlsx；

2、表头，举例如下：
	常量key	常量值		备注		类型     		公式
	A		C		N		S                 A
	int		float		string	array_int        	format
	Key		Value		Desc		Type             	FormatFunc
	hash:"1" 	type:"json"		
一共5行：
	第一行为中文字段名称；
	第二行为使用方（A-all, C-client, S-server, N-none，即不导出，仅作为备注使用）；
	第三行为字段类型，支持:  int（整数）、float（小数）、string（字符串，不需要引号、format（公式）、array_int、array_float、array_string；
	第四行为字段英文名称，不得包含字母&数字以外的字符，且必须以字母开头，首字母统一为大写，多字母时使用驼峰，例如：TypeName；
	第五行为服务器描述信息，请毋修改/删除。

3、表头上应附带详细的备注，例如： 道具表中的道具品质列，应在该列的第一行格加批注： 1，白色 2，红色 ...

4、内容：表行列区域以外的右侧列和底部行不得带有包括编辑过的空白格在内的信息，会导致打表解析出错，可使用删除行列操作清空，
  所有字段应输入默认值：int/array_int（0） float/array_float（0） string/array_string（留空即可）。