;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.core'), function(
    exports,
    enums
) {

    // tab => 4 spaces
    const TAB = Array(5).join(' ');
    // 换行
    const WRAP = '\n';

    const createParamParser = function () {

        function parseDatasource(input, value) {
            if (typeof value === 'undefined') {
                return `${input['name']} = ${input.default}`; 
            } else {
                let arr = value.split('|');
                let projId = parseInt(arr[0].substr(1));
                return `${input['name']} = get_data(${projId}, '${arr[1]}')`;
            }
        }

        function parseNumber(input, value) {
            value = typeof value === 'undefined' ? input.default : value;

            return `${input['name']} = value`; 
        }

        function parseString(input, value) {
            value = typeof value === 'undefined' ? input.default : value;

            return `${input['name']} = 'value'`;
        }

        function parse(input, value) {
            switch(input.type) {
                case enums.moduleInputOutputTypes.DATA_SOURCE:
                    return parseDatasource(input, value);
                case enums.moduleInputOutputTypes.NUMBER:
                    return parseNumber(input, value);
                case enums.moduleInputOutputTypes.STRING:
                    return parseString(input, value);
                default:
                    return ''
            }
        }

        return {
            parse
        };
    };

    const createModuleParser = function () {

        const OUTPUT_PREFIX = 'output_';
        const METHOD_PREFIX = 'm_';
        let idx = 0;

        function getMethodName() {
            return METHOD_PREFIX + (idx++);
        }

        function parsePythonModule(module) {
            let arr = [];
            let code = module.content.code || '';
            let methodName = module.methodName = getMethodName();

            module.outputTmpName = OUTPUT_PREFIX + methodName;

            arr.push(`def ${methodName}():`, WRAP, TAB);
            arr.push(code.replace(new RegExp(WRAP, 'mg'), `${WRAP}${TAB}`), WRAP);

            return arr.join('');
        }

        function parse(module) {
            switch(module.type) {
                case enums.moduleTypes.PYTHON:
                    return parsePythonModule(module);
                default:
                    return '';
            }
        }

        return {
            parse
        }
    };

    const createCodeBuilder = function () {
        let codes = [];

        function append(code) {
            codes.push(code);
        }

        function getCode() {
            return `def main():${WRAP}${TAB}` + codes.join(WRAP).replace(new RegExp(WRAP, 'mg'), `${WRAP}${TAB}`)
        }

        function clear() {
            codes.length = 0;
        }

        return {
            append,
            getCode,
            clear
        };
    };

    exports.createParser = function (modules, value) {

        let currentModules = modules;
        let currentValue = value || [];

        let moduleMap = {};
        let inputMap = {};
        let outputMap = {}

        let paramParser = createParamParser();
        let moduleParser = createModuleParser();
        let codeBuilder = createCodeBuilder();

        let isDone = false;

        /**
         * 判断模块是否是策略的输出模块
         * 如果模块的输出没有被别的模块引用，则返回 true；否则，返回 false
         */
        function isOutput(module) {
            let output = module.output;
            let bIsOutput = true;

            output.some(function (op) {
                if (op['usedByOtherModule']) {
                    bIsOutput = false;
                    return true;
                }
            });
            return bIsOutput;
        }

        function display() {
            Object.keys(inputMap).forEach(function (id) {
                let row = inputMap[id];
                if ( row.refOutputId && outputMap[row.refOutputId] ) {
                    outputMap[row.refOutputId]['usedByOtherModule'] = true;
                }
            });

            Object.keys(moduleMap).forEach(function (id) {
                let row = moduleMap[id];
                row.isOutput = isOutput(row);
            });
        }

        function format() {
            currentModules.forEach(function (row) {
                let input = row.option.input.map( (ipt) => {
                    return Object.assign({}, ipt);
                } );
                let output = row.option.output.map( (opt) => {
                    return Object.assign({}, opt);
                } );
                moduleMap[row._id] = {
                    content: Object.assign({}, row.option.content),
                    input: input,
                    output: output,
                    isOutput: false,
                    isResolved: false,
                    method: '',
                    type: row.type
                }
                inputMap = Object.assign(inputMap, Array.toMap(input, '_id'));
                outputMap = Object.assign(outputMap, Array.toMap(output, '_id'));
            });
            display();
        }

        function parseModule(module) {
            if (module.isResolved) {
                return;
            }

            module.input.forEach(function (row) {
                if (row.refModuleId) {
                    let m = moduleMap[row.refModuleId];
                    let code = '', len;
                    
                    // 递归
                    parseModule(m);

                    len = m.output.length;

                    if (len === 0) {
                        return;
                    }
                    let name = outputMap[row.refOutputId].name;
                    codeBuilder.append(
                        `${row.name} = ${m.outputTmpName}['${name}'] if (isinstance(${m.outputTmpName}, dict) and '${name}' in ${m.outputTmpName}) else ${m.outputTmpName}`
                    );
                } else {
                    let value = currentValue[0] || {};
                    codeBuilder.append(
                        paramParser.parse(row, value[row.name])
                    );
                }
            });

            codeBuilder.append(
                moduleParser.parse(module)
            );

            codeBuilder.append(
                `${module.outputTmpName} = ${module.methodName}()`
            );

            module.isResolved = true;
        }

        function parse$1(outputModules) {
            let code = [];
            outputModules.forEach((module) => {
                let map = {};
                parseModule(module);

                let len = module.output.length;
                if (len === 0) {
                    return;
                }
                if (len = 1) {
                    map[module.output[0].name] = `${module.outputTmpName}`;
                } else {
                    module.output.forEach( (row) => {
                        map[row.name] = `${module.outputTmpName}['${row.name}']`;
                    });
                }

                code.push(map);
            });

            if (code.length > 0) {
                let rs = Object.assign.apply(Object, [{}].concat(code));

                codeBuilder.append(
                    'return {' + Object.keys(rs).map( (k) => ( `'${k}': ${rs[k]}` ) ) + '}'
                );
            }
        }

        /**
         * 解析
         */
        function parse() {
            if (isDone) {
                return codeBuilder.getCode();
            }
            let outputModules = Object.keys(moduleMap)
                .filter((id) => ( moduleMap[id].isOutput ))
                .map((id) => ( moduleMap[id] ));

            parse$1(outputModules);
            isDone = true;

            return codeBuilder.getCode();
        }

        function reset() {
            codeBuilder.clear();
            isDone = false;
        }

        /**
         * 更新modules
         */
        function replaceModules(newModules) {
            currentModules = newModules;
            reset();
            format();
        }

        /**
         * 更新modules
         */
        function replaceValue(newValue) {
            currentValue = newValue;
            reset();
            format();
        }

        // 预处理
        format();

        return {
            parse,
            replaceModules
        };
    }

}));