/**
 * 可以三个参数或者两个参数
 * a.b.c
 * safeGetValue(defaultValue, ['b', 'c'], a) 有默认值
 * safeGetValue(['b', 'c'], a) 无默认值
 * 此函数主要用于深层json取值兜底
 * @return {*} 返回默认值
 */
function safeGetValue() {
    const argsLength = arguments.length;

    if (argsLength !== 2 && argsLength !== 3) {
        throw new Error('必须为两个或者三个参数');
    }
    let defaultValue,
        keys,
        item;
    if (argsLength === 3) {
        // eslint-disable-next-line
        defaultValue = arguments[0];
        // eslint-disable-next-line
        keys = arguments[1];
        // eslint-disable-next-line
        item = arguments[2];
    } else {
        // eslint-disable-next-line
        keys = arguments[0];
        // eslint-disable-next-line
        item = arguments[1];
    }

    if (!Array.isArray(keys)) {
        throw new Error('参数有误，取值的keys必须为数组');
    }

    try {
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] in item) {
                item = item[keys[i]];
            } else {
                return defaultValue;
            }
        }
    } catch (e) {
        return defaultValue;
    }

    return (item === undefined || item === null) ? defaultValue : item;
}

export default  safeGetValue;
