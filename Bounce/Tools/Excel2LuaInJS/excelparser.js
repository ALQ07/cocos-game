var xlsx = require("node-xlsx");
var fs = require("fs");
var path = require("path");

const excelFileReg = /\.xlsx|\.excel/; //表格正则
const numberTypeReg = /int|float|int64/;    //number类型正则
const arrayArrayReg = /arrayint|arrayfloat|arrayint64|arraystring/;    //多维数组类型正则
const stringTypeReg = /string/;   //字符串类型正则
const arrayTypeReg = /array_/;     //数组类型正则
const formatTypeReg = /format/;   //公式类型正则
const filterFlagsReg = /c/;       //文件和sheet过滤正则
const filedFitlterFlagsReg = /[C|A]/;  //字段过滤正则
const filedNameReg = /^[A-Za-z_]\w*$/

let parseType = "js";

/**
 * 
 * @param {string} dir 需要解析的路径，路径下的xls文件都将被尝试解析（不递归子文件夹）
 * @param {"lua"|"js"} lua_or_js 解析类型，只能是“lua”或者“js”
 * @returns 
 */
function excelparser (dir, lua_or_js) {
  parseType = lua_or_js;
  var files = fs.readdirSync(dir)
  var excelFileNameList = [];//[`${__dirname}/title-称号表示例1-cs.xls`];
  files.forEach(one => {
    if (excelFileReg.test(one)) {
      excelFileNameList.push(path.join(dir, one));
    }
  });
  //excel表格解析后的数据内存中临时存放的结构
  var excelData = { files: {}, heads: {}, datas: {}, formats: {} };
  /*example：
  var excelData = { 
      files: {    //各表的所属文件
          stage:{
              fileName: "config", //所属excel文件的名称
              fileDesc: "配置表", //所属excel文件的描述
              fileFlag: "cs", //所属excel文件的导出标志
              sheetName: "stage", //sheet的名称
              sheetDesc: "关卡表",//sheet的描述
              sheetFlag: "cs", //sheet的导出标志
          }
      },
      heads:{ //各表的表头信息部分
          stage: { //表名
              descs : value1,         //描述
              filterFlags : value2,   //过滤标志
              types : value3,         //类型
              names : value4,         //字段名称
              hash : value5,          //hash值 （服务器用）
          }
      },
      datas:{//各表的数据部分
          stage: [//表名
              [1, "赤壁之战", "xxx.png", "..."],
              [2, "长坂坡之战", "xxx.png", "..."],
          ],
      },
      formats: {//表中筛选出的公式部分
          stage:[//表名
              1:[
                  colName1: {type: "(xxx)=>number", code: "function (xxx){return 50 + 10 * xxx}"}, 
                  colName2: {type: "(xxx)=>number", code: "function (xxx){return 50 + 10 * xxx}"},
              ],
          ]
      }
  } */
  var fileNames = {};
  excelFileNameList.forEach(excelFileName => {

    var filename = excelFileName.match(/[^\/\\]+$/g)[0];//去掉路径，只保留文件名+后缀
    var filenameWithoutSuffix = filename.replace(excelFileReg, "");//去后缀

    var excelFileNameParseResult = ParseName(filenameWithoutSuffix, filenameWithoutSuffix);
    if (!excelFileNameParseResult) {
      return;
    }

    if (fileNames[excelFileNameParseResult.name]) {//sheet name 去重
      console.log(`excel文件名重复, 文件：${filename}, 重复文件名:${excelFileNameParseResult.name}`)
      return;
    }
    fileNames[excelFileNameParseResult.name] = true;

    if (!filterFlagsReg.test(excelFileNameParseResult.flag)) {
      //console.log("无需导出：" + excelFileName);
      return;
    }

    var workSheets = xlsx.parse(excelFileName);
    var sheetNames = {}
    workSheets.forEach(oneSheet => {
      var excelSheetNameParseResult = ParseName(filename, oneSheet.name);
      if (!excelSheetNameParseResult) {
        return;
      }
      if (sheetNames[excelSheetNameParseResult.name]) {//sheet name 去重
        console.log(`sheet重复, 文件：${filename}, 重复页签名:${excelSheetNameParseResult.name}`)
        return;
      }
      sheetNames[excelSheetNameParseResult.name] = true;
      if (!filterFlagsReg.test(excelSheetNameParseResult.flag)) {
        //console.log("无需导出：" + excelFileName);
        return;
      }
      var tableName = excelFileNameParseResult.name + "_" + excelSheetNameParseResult.name;
      //填充file和sheet之前的关系信息
      FileSheetInfoProcess(excelData, tableName, excelFileNameParseResult, excelSheetNameParseResult);
      //解析原始数据
      ParseExcel(oneSheet, excelData, tableName);

      //根据过滤标志来过滤
      FlagLineDelete(excelData, tableName);

      //类型处理
      TypeProcess(excelData, tableName);

      //hash索引处理
      HashProcess(excelData, tableName);

      //数据检查
      Check(excelData, tableName);
    });
  });
  return excelData;
}



function FileSheetInfoProcess (excelData, tableName, excelFile, excelSheet) {
  excelData.files[tableName] = {
    fileName: excelFile.name,
    fileDesc: excelFile.desc,
    fileFlag: excelFile.flag,
    sheetName: excelSheet.name,
    sheetDesc: excelSheet.desc,
    sheetFlag: excelSheet.flag,
  };
}

function ParseExcel (sheet, excelData, tableName) {
  excelData.heads[tableName] = {
    descs: sheet.data[0] || [],         //描述
    filterFlags: sheet.data[1] || [],   //过滤标志
    types: sheet.data[2] || [],         //类型
    names: sheet.data[3] || [],         //字段名称
    hash: sheet.data[4] || [],          //hash值 （服务器用）
  };
  excelData.datas[tableName] = sheet.data.slice(5);

  //空行过滤(删除后面无效行)
  var datalen = excelData.datas[tableName].length;
  for (let index = 0; index < datalen; index++) {
    const row = excelData.datas[tableName][index];
    if (!row[0] && row[0] != 0) {
      excelData.datas[tableName].splice(index, datalen - index);
      break;
    }
  }
}

function FlagLineDelete (excelData, tableName) {
  var heads = excelData.heads[tableName], datas = excelData.datas[tableName], filters = heads.filterFlags;
  for (let index = filters.length - 1; index >= 0; index--) {
    const one = filters[index];
    if (!filedFitlterFlagsReg.test(one)) {
      datas.forEach(row => {
        row.splice(index, 1);
      });
      //头部信息也要一并过滤
      heads.descs.splice(index, 1);
      heads.filterFlags.splice(index, 1);
      heads.types.splice(index, 1);
      heads.names.splice(index, 1);
      heads.hash.splice(index, 1);
    }
  }
  if (heads.descs.length > heads.filterFlags.length)
    heads.descs.splice(heads.filterFlags.length);
  if (heads.types.length > heads.filterFlags.length)
    heads.types.splice(heads.filterFlags.length);
  if (heads.names.length > heads.filterFlags.length)
    heads.names.splice(heads.filterFlags.length);
  if (heads.hash.length > heads.filterFlags.length)
    heads.hash.splice(heads.filterFlags.length);
  datas.forEach(row => {
    if (row.length > heads.filterFlags.length)
      row.splice(heads.filterFlags.length);
  })
}

function TypeProcess (excelData, tableName) {
  var types = excelData.heads[tableName].types;
  var names = excelData.heads[tableName].names;
  types.forEach((one, index) => {
    if (arrayArrayReg.test(one)) {//多维数组处理
      excelData.datas[tableName].forEach(row => {
        row[index] = (row[index] || "");
        row[index] = row[index] ? row[index].toString().split(";").map(i => i ? i.split("_") : []) : [];
        if (numberTypeReg.test(one)) {
          row[index].forEach((value, i) => {
            value.forEach((v, j) => {
              row[index][i][j] = +v || 0;//string转数值，非法字串转为0
            });
          });
        }
      });
    } else if (arrayTypeReg.test(one)) {//数组处理
      excelData.datas[tableName].forEach(row => {
        row[index] = (row[index] || "");
        row[index] = row[index] ? row[index].toString().split(";") : [];
        if (numberTypeReg.test(one)) {
          row[index].forEach((value, i) => {
            row[index][i] = +value || 0;//string转数值，非法字串转为0
          });
        }
      });
    } else if (formatTypeReg.test(one)) {
      excelData.formats[tableName] = excelData.formats[tableName] || {};
      excelData.datas[tableName].forEach(row => {
        var formatStr = row[index];
        if (!formatStr) {
          return;
        }
        var args = formatStr.match(/[a-zA-Z_]+/g) || [];
        var tempObj = {};
        args.forEach(one => { tempObj[one] = 1; });
        args = Object.keys(tempObj);
        var ID = row[0];
        excelData.formats[tableName][ID] = excelData.formats[tableName][ID] || {};

        if (parseType === "lua")//lua形式
        {
          row[index] = `function(${args.join(",")}) return ${formatStr} end`;
        }
        else if (parseType === "js") {//js形式
          var formatByID = excelData.formats[tableName][ID];
          var colName = names[index];
          args = args.map(arg => ['PA', 'PB', 'PC', 'PD', 'PE', 'PF'].includes(arg) ? `${arg}: number` : `${arg}: funType`);
          formatByID[colName] = { type: `(${args.join(",")}) => number`, code: `(${args.join(",")}) => {return ${formatStr}}` }
          row[index] = 0;//公式字段用完后这个值没有意义了，不会导出到json，会导出到ts中。所以赋值为0，减少文件大小占用。
        }
        else {
          console.error("不支持的解析类型")
        }
      });
    }
  });
}

function HashProcess (excelData, tableName) {
  const hashs = excelData.heads[tableName].hash.map((hash, i) => !!hash ? i : 0);
  excelData.heads[tableName].hash = hashs;
}

function Check (excelData, tableName) {
  var isok = true;

  var files = excelData.files[tableName];
  var file = files.fileName + "-" + files.fileDesc;
  var sheet = files.sheetName + "-" + files.sheetDesc;
  //id重复检查 id类型检查
  var data = excelData.datas[tableName], head = excelData.heads[tableName];

  isok = head.types && head.types.length;

  var repeat = {};
  isok && data.forEach(oneLine => {
    var id = oneLine[0];
    if (repeat[id]) {
      console.log(`id重复。文件：${file}，页签：${sheet}, id：${id}`);
      isok = false;
    } else {
      repeat[id] = true;
    }
    if (~~id != id) {
      console.log(`id类型错误，必须为数值。文件：${file}，页签：${sheet}, id：${id}`);
      isok = false;
    }
  });
  // 字段命名合法校验
  isok && head.names.forEach(oneName => {
    if (!filedNameReg.test(oneName)) {
      console.log(`字段命名不合法（包含字母、数字或下划线，且字母或下划线开头）。文件：${file}，页签：${sheet}, 字段：${oneName}`);
      isok = false;
    }
  });
  //字段重复检查
  repeat = {};
  isok && head.names.forEach(oneName => {
    if (repeat[oneName]) {
      console.log(`字段重复。文件：${file}，页签：${sheet}, 字段：${oneName}`);
      isok = false;
    } else {
      repeat[oneName] = true;
    }
  });

  // 数据类型检查
  let check = (v, t) => {
    if (t == 'int' || t == 'int64')
      return typeof v == 'number' && Number.isInteger(v);
    if (t == 'float')
      return typeof v == 'number';
    if (t == 'string')
      return typeof v == 'number' || typeof v == 'string';
    if (t == 'format')
      return typeof v == 'number' || typeof v == 'string';
    if (t == null)      // ???
      return true;
    return false;
  }
  isok && data.forEach(row => {
    row.forEach((c, i) => {
      let t = head.types[i]; // int float string array_int array_float
      let _isOk = false;
      if (t == 'array_int' || t == 'array_float' || t == 'array_string' || t == 'array_int64') {
        _isOk = Array.isArray(c) && c.every(cc => check(cc, t.substring(6)));
      } else if (t == 'array_arrayint' || t == 'array_arrayfloat' || t == 'array_arraystring' || t == 'array_arrayint64') {
        _isOk = Array.isArray(c) && c.every(cc => Array.isArray(cc) && cc.every(ccc => check(ccc, t.substring(11))));
      } else {
        if (t == 'string') row[i] = (c + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\n');
        _isOk = check(c, t);
      }

      if (!_isOk) {
        isok = false;
        console.log(`数据类型不符。文件：${file}，页签：${sheet}, 字段：${head.names[i]}, 行索引：${row[0]}, 类型：${t}, 数值: ${c}`);
      }
    })
  });

  //不合格则删除数据
  if (!isok) {
    delete excelData.files[tableName];
    delete excelData.heads[tableName];
    delete excelData.datas[tableName];
    delete excelData.formats[tableName];
  }
  return isok;
}

function ParseName (excelFileName, formatName) {
  var nameParseArray = formatName.split("-");
  if (nameParseArray.length < 3) {
    //console.log(`名称不合法,跳过导出,excel：${excelFileName}, sheet:${formatName}`);
    return null;
  }
  var name = nameParseArray[0];
  var desc = nameParseArray[1];
  var flag = nameParseArray[2];
  return { name, desc, flag };
}

function IsArrayType (type) {
  return arrayTypeReg.test(type);
}

function IsArrayArrayType (type) {
  return arrayArrayReg.test(type);
}

function IsStringType (type) {
  return stringTypeReg.test(type);
}

function IsNumberType (type) {
  return numberTypeReg.test(type);
}

function IsFromatType (type) {
  return formatTypeReg.test(type);
}

exports.default = {
  excelparser,
  IsArrayType, IsArrayArrayType, IsStringType, IsNumberType, IsFromatType
};