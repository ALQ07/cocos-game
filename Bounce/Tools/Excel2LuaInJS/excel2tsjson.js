'use strict';
const excelparser = require("./excelparser").default
function excel2tsjson (dir) {
  let data = excelparser.excelparser(dir, "js");
  return { tsCode: toTs(data), jsondata: toJson(data) };
}

//转成ts代码文本
function toTs (excelInfo) {
  var excel = excelInfo.datas;
  var heads = excelInfo.heads;
  var formats = excelInfo.formats;
  let tabelDefs = [], tabelParses = [], formatCode = [];
  for (const table in excel) {    //每一张表的声明定义代码
    let tabelColExpr = [];
    let cols = heads[table].names;
    let types = heads[table].types;
    let descs = heads[table].descs;
    let hashs = heads[table].hash;
    // console.log("hashs:", JSON.stringify(hashs));
    let colParses = [];
    let hasFormat = false;
    for (let i = 0; i < cols.length; ++i) { //每个字段的声明定义代码
      colParses.push(`${cols[i]}: r[${i}]`);
      let type = "string";
      if (excelparser.IsNumberType(types[i])) {
        type = "number";
      }
      if (excelparser.IsArrayType(types[i])) {//公式与数组类型互斥，只能取一个
        type += "[]";
      }
      if (excelparser.IsArrayArrayType(types[i])) {// 多维数组类型
        type += "[]";
      }
      else if (excelparser.IsFromatType(types[i])) {
        // var ID = Object.keys(formats[table])[0];//取第一个公式的函数类型作为这一列通用的函数类型
        // type = formats[table][ID][cols[i]].type;
        type = 'any';
      }
      tabelColExpr.push(`\treadonly ${cols[i]}: ${type}; //${descs[i]}`);
    }
    tabelDefs.push(`/* table[${table}] define:  */`);
    tabelDefs.push(`export interface I${table}Row {`);
    tabelDefs.push(`${tabelColExpr.join("\n")}`);
    tabelDefs.push(`}`);
    tabelDefs.push(`export const ${table}: { readonly [index: string]: I${table}Row } = {};`);
    hashs.forEach((hash) => {
      if (hash != -1) {
        tabelDefs.push(`export const ${table}_${cols[hash]}: { readonly [index: string]: I${table}Row[] } = {};`);
      }
    });
    //表的解析代码
    tabelParses.push(`\t\tfor (const r of data.${table}){`);
    tabelParses.push(`\t\t\t(<any>${table}[r[0]]) = {${colParses.join(", ")} };`);
    hashs.forEach((hash) => {
      if (hash > 0) {
        tabelParses.push(`
        if(!(<any>${table}_${cols[hash]})[r[${hash}]]){
          (<any>${table}_${cols[hash]})[r[${hash}]] = [];
        }
        (<any>${table}_${cols[hash]})[r[${hash}]].push({${colParses.join(", ")} });
        `);
      }
    });
    tabelParses.push(`\n\t\t}`);
    if (!hasFormat) {
      tabelParses.push(`\t\tMakeReadonly(${table});\n`);
    } else {
      tabelParses.push(`\n`);
    }
  }
  //公式代码拼装
  formatCode.push(`export const formats = {`);
  for (const table in formats) {
    formatCode.push(`\t${table}: {`)
    for (const id in formats[table]) {
      var oneline = `\t\t${id}: {`;
      for (const col in formats[table][id]) {
        let code = formats[table][id][col].code;
        oneline += `${col}:${code}`;
      }
      oneline += ` },`;
      formatCode.push(oneline);
    }
    formatCode.push(`\t},`);
  }
  formatCode.push(`};`);

  return `/**
* Excel表格数据，由工具导出，切勿修改！
*/
type funType = ((...values: any[]) => number);
export namespace excel{

${tabelDefs.join("\n")}

/**
 * 错误
 * @enum const
 */
export const enum ErrorType {
    /** 数据格式错误 */
    ErrorData = "incorrect format for excel data.",
    /** 资源不存在 */
    NoExist = "file of excel doesn't exist."
}

/*
* 设置只读对象
* @param obj 要设置为只读的对象
*/
function MakeReadonly(obj){
    Object.freeze(obj);
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if(typeof obj[key] == "object"){
                MakeReadonly(obj[key])
            }
        }
    }
}

/**
 * 解析数据
 * @param data JSON 数据
 * @throws excel.ErrorType.ErrorData
 */
export function parse(data: any): void {
  try {
${tabelParses.join("\n")}
  } catch (e) {
      throw new Error(ErrorType.ErrorData + e);
  }
}

/**
 * 公式
 */
${formatCode.join("\n")}
}`;
}

//转成json数据文本
function toJson (excelInfo) {
  var excel = excelInfo.datas;
  let tables = [];
  for (const table in excel) {
    let rows = [];
    for (const index in excel[table]) {
      const json = JSON.stringify(excel[table][index]);
      rows.push(json);
    }
    tables.push(`    "${table}": [
        ${rows.join(",\n        ")}
    ]`);
  }
  return `{
${tables.join(",\n")}
} `;
}


exports.default = { excel2tsjson };

