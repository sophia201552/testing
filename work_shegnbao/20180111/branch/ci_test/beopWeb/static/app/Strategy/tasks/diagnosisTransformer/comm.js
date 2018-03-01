const cacheMap = {};
// 生成 object id - 24 位
const ObjectId = () => {
    // 前 13 位，unix 时间戳
    var timestamp = new Date().valueOf().toString();
    // 中间 3 位
    var dec3 = (Math.random() * 999).toString().slice(-3);
    // 最后 8 位，随机十六进制数
    var hex8 = ('00000000' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16)).slice(-8);

    var uuid = timestamp + dec3 + hex8;

    while(cacheMap[uuid]) {
        uuid = ObjectId();
    }
    cacheMap[uuid] = 1;
    return uuid;
};

module.exports = {
    ObjectId
}
