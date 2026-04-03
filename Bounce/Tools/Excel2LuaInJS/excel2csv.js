'use strict';
var fs = require("fs");
var path = require("path");
var xlsx = require("node-xlsx");

function excel2CSV(inputDir, outDir) {
    fs.readdirSync(inputDir).forEach(name => {
        /** title-称号表示例1-cs.xls */
        let slices = name.slice(0, name.length - path.extname(name).length).split('-');
        if (slices.length != 3 || !slices[2].toLowerCase().includes('s'))
            return;

        xlsx.parse(path.join(inputDir, name)).forEach(sheet => {
            let slices2 = sheet.name.split('-');
            if (slices2.length != 3 || !slices2[2].toLowerCase().includes('s'))
                return;

            let maxCol = 0;
            let rows = sheet.data.map(row => {
                let cells = row.map(cell => toCSV(cell));
                maxCol = Math.max(maxCol, cells.length);
                return cells;
            });
            rows.forEach(row => {
                while (row.length < maxCol)
                    row.push('');
            });
            let file = path.join(outDir, `${slices[0]}_${slices2[0]}-${slices[1]}-${slices[2]}`) + '.csv';
            fs.writeFileSync(file, rows.map(row => row.join(',')).join('\r\n'));
        });
    });
}

/**
 * * MS-DOS-style lines that end with (CR/LF) characters (optional for the last line)
 * * An optional header record (there is no sure way to detect whether it is present, so care is required when importing).
 * * Each record "should" contain the same number of comma-separated fields.
 * * Any field may be quoted (with double quotes).
 * * Fields containing a line-break, double-quote, and/or commas should be quoted. (If they are not, the file will likely be impossible to process correctly).
 * * A (double) quote character in a field must be represented by two (double) quote characters.
 */
function toCSV(cell) {
    let value = cell + '';
    value = value.replace(/"/g, '""');
    if (value.includes('"') || value.includes('\r') || value.includes('\n') || value.includes(','))
        value = '"' + value + '"';
    return value;
}

exports.default = { excel2CSV }

//test: excel2CSV(process.argv[2] || process.cwd(), process.argv[3] || process.cwd());