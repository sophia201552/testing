const XLSX = require('xlsx');

function ObjectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
}

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
