'use strict';
var fs = require("fs");
var path = require("path");
var excelparser = require("./excelparser").default;

// //test
// let out = excel2lua(".")
// out.forEach(one => {
//     fs.writeFileSync(path.join(".", one.fileName + ".lua.txt"), one.data);
// });
// //test



function excel2lua(dir){
    let data = excelparser.excelparser(dir);
    return toLua(data);
}

function toLua(excelInfo){

    var luas = [];
    Object.keys(excelInfo.heads).forEach(oneTableName=>{
        var tableName = oneTableName;
        //生成数据块字符串
        var types = excelInfo.heads[tableName].types;
        var flags = excelInfo.heads[tableName].filterFlags;
        var datas =  excelInfo.datas[tableName];
        var datasstring = "";
        datas.forEach(oneLine=>{
            datasstring += `[${oneLine[0]}] = {`;
            //oneLine.forEach((oneFiled, index)=>{//forEach遍历会跳过空值？？？
            for (let index = 0; index < types.length; index++) {
                const oneFiled = oneLine[index];
                if(0 == index) continue; //id已取过
                var isArray = excelparser.IsArrayType(types[index]);
                var isString = excelparser.IsStringType(types[index]);
                if(isArray)
                {
                    datasstring += "{";
                    oneFiled.forEach(oneArrayItem=>{
                        datasstring += isString ? `"${oneArrayItem}",` : `${oneArrayItem},`;
                    });
                    datasstring += "},";
                }
                else{
                    if (oneFiled == undefined){
                        datasstring += isString ? `"",` : `0,`;
                    }
                    else{
                        datasstring += isString ? `"${oneFiled}",` : `${oneFiled},`;
                    }
                    
                }
            }
            datasstring += `},\n`;
        });
        //生产字段块字符串
        var keysstring = "";
        var keys = excelInfo.heads[tableName].names;
        var descs = excelInfo.heads[tableName].descs;
        keys.forEach((oneKey, index)=>{
            if(0 == index) return; //跳过主键（id）
            keysstring += `keys.${oneKey} = ${index}; \t\t\t--${descs[index]}\n`;
        });

        //拼装起来
        var fileName = excelInfo.files[tableName].fileName;
        var fileDesc = excelInfo.files[tableName].fileDesc;
        var sheetName = excelInfo.files[tableName].sheetName;
        var sheetDesc = excelInfo.files[tableName].sheetDesc;
        var filecontent =
`--[[本文件为工具导出，请勿修改]]
-- 文件：${fileName}-${fileDesc}  页签：${sheetName}-${sheetDesc}
--[[数据]]
local datas = {
${datasstring}
}

--[[字段名]]
local keys = {}
${keysstring}

--[[继承数据接口]]
local Class = require('Lua/Behaviour/Class')
local stdatainterface = require('Lua/Data/STDataInterface')
local ${tableName} = stdatainterface;
local ${tableName} = Class.Class(stdatainterface)
${tableName}.datas = datas;
${tableName}.keys = keys;
${tableName}.name = "${tableName}";

STData.${tableName} = ${tableName};
`
        luas.push({fileName: tableName, data: filecontent});
    });
    //STData file
    var stdatafilecontent = "STData = {};\n";
    Object.keys(excelInfo.heads).forEach(oneTableName=>{
        stdatafilecontent += `require("Lua/Data/STData/${oneTableName}")\n`;
    });
    luas.push({fileName: "STData", data: "return nil"});
    return luas;
}


exports.default = {excel2lua}