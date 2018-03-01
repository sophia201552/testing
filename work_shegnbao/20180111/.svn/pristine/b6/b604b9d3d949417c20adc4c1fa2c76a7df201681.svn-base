const XLSX = require('xlsx');

const getObjectId = (id) => {
    id = id || ObjectId();
    return `ObjectId('${id}')`;
};

const formatWorkbook = filepath => {
    let workbook = XLSX.readFile(filepath);
    let sheets = workbook.Sheets;
    let map = {};

    Object.keys(sheets).forEach(
        sheetName => {
            let sheet = sheets[sheetName];
            map[sheetName] = XLSX.utils.sheet_to_json(sheet, {raw: true});
        }
    );

    return map;
}

const array2map = (objArr, key) => {
    let map = {};

    objArr = objArr || [];
    objArr.forEach(row => {
        map[row[key]] = row;
    });

    return map;
};

module.exports = {
    getObjectId,
    array2map,
    formatWorkbook
}
