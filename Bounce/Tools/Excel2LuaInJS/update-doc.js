const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const PubUrl = `http://a1svn.360me.cn:10062/svn/h5_rogue/pub/`;
/** 策划数据地址配置 ，会有主分支和分支两种形式*/
const docRootUrlDir = `http://a1svn.360me.cn:10062/svn/h5_rogue/pub/`;
const trunkName = "trunk";
const branchDirName = "branches";
let docUrl = null;//最终的数据地址,运行时确定

/**autocommit 代表直接使用svn ci自动提交 */
const autocommit = process.argv[2] === "autocommit";
const jenkins = process.argv[3] === "jenkins";
const copyDir = path.join(`${__dirname}/../../`);
/** 当前目录 */
const curDir = __dirname;
/** 存放待解析 Excel 表格的本地目录（你需要自己创建这个文件夹并把表放进去） */
const inputExcelDir = path.join(__dirname, "excel_source");

/**
 * 更新文档到临时目录并输出到工程目录中
 * 解析本地目录下的 Excel 并输出到工程目录中
 */
function updateDoc() {

    let runCmd = (command, args, option) => child_process.spawnSync(command, args, option || { encoding: "utf8", shell: true });
    // /** 寻找当前工作副本 */ {
    //     let result = runCmd("svn", ["info", copyDir, "--show-item=url"]);
    //     if (result.error) {
    //         console.log(result.stderr);
    //         return;
    //     }
    //     let url = result.stdout.trim();
    //     let name = url.split('/').pop();
    //     if (name) {
    //         docUrl = docRootUrlDir + branchDirName + "/" + name;
    //     }
    //     else {
    //         console.log("error: not svn workspace");
    //     }
    //     console.log();
    //     console.log(`workspace url: ${url}`);
    //     console.log(`doc url: ${docUrl}`);
    //     console.log();
    // }
    let excelTempDir = path.join(copyDir, "./tempsvn/pub");
    //lua输出参数
    let out_dir = path.join(excelTempDir, "js/");
    // 输出目录
    let copy_js_dir = path.join(copyDir, "assets/GM/DataMgr/ExcelData");
    let copy_json_dir = path.join(copyDir, "assets/res/ExcelData");

    console.log("1. clean excel temp directory");
    try {
        fs.rmSync(out_dir, { recursive: true, force: true });
    } catch (_a) { };

    fs.mkdirSync(copy_js_dir, { recursive: true });
    fs.mkdirSync(copy_json_dir, { recursive: true });

    console.log("\n2. svn checkout xlsx");
    // {
    //     let result;
    //     if (jenkins) {
    //         result = runCmd("svn", ["co", docUrl, excelTempDir, "--username", "jenkins_rouge_client", "--password", "tSLQdGgV"]);
    //     } else {
    //         result = runCmd("svn", ["co", docUrl, excelTempDir]);
    //     }
    //     if (result.error) {
    //         console.log(result.stderr);
    //         return;
    //     }
    //     result = runCmd("svn", ["sw", docUrl, excelTempDir]);
    //     if (result.error) {
    //         console.log(result.stderr);
    //         return;
    //     }
    //     result = runCmd("svn", ["up", excelTempDir]);
    //     if (result.error) {
    //         console.log(result.stderr);
    //         return;
    //     }
    // }

    console.log("\n3. export");
    {
        try {
            fs.mkdirSync(out_dir, { recursive: true });
            // 使用本地 inputExcelDir 代替原有的 SVN 目录
            let out = require("./excel2tsjson").default.excel2tsjson(inputExcelDir);

            fs.writeFileSync(path.join(out_dir, "excel.ts"), out.tsCode);
            fs.writeFileSync(path.join(out_dir, "excel.json.txt"), out.jsondata);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    console.log("\n4. cut lua files");
    {
        // let result = runCmd("svn", ["up", copy_js_dir, copy_json_dir]);
        // if (result.error) {
        //     console.log(result.stderr);
        //     return;
        // }
        let result = runCmd("rmdir", [copy_js_dir, copy_json_dir, "/S"]);
        result = runCmd("xcopy", [out_dir + "*.ts", copy_js_dir + "\\", "/Y"]);
        if (result.error) {
            console.log(result.stderr);
            return;
        }
        result = runCmd("xcopy", [out_dir + "*.txt", copy_json_dir + "\\", "/Y"]);
        if (result.error) {
            console.log(result.stderr);
            return;
        }
    }
    if (process.argv[2] != 1) {
        console.log("\n5. commit");
        // {
        //     let result;
        //     if (autocommit) {
        //         result = runCmd("svn", ["ci", ` ${copy_js_dir} ${copy_json_dir} -m ==============updatedoc==============`]);
        //         if (result.error) {
        //             console.log(result.stderr);
        //         }
        //     }
        //     else {
        //         console.log(`/path:"${copy_js_dir}" "${copy_json_dir}"`);
        //         result = runCmd("TortoiseProc", ["/command:commit", `/path:"${copy_js_dir}*${copy_json_dir}"`, `/logmsg:"========== 更新策划表 =========="`]);
        //     }
        //     if (result && result.error) {
        //         console.log(result.stderr);
        //         return;
        //     }
        // }
    }
    console.log("\n6. clean lua temp files.");
    fs.rmSync(out_dir, { recursive: true, force: true });
    console.log("\ndone.");
}

/*process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });
console.log(process.argv[2]);*/
updateDoc();
