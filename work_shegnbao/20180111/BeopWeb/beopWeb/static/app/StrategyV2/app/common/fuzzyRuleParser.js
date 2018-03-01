import { fuzzyRuleShapeTypes } from './enum';

// tab => 2 spaces
const TAB = Array(3).join(' ');
// 换行
const WRAP = '\n';

const PARSER_STRUCT_HEAD = '__parser_header__';
const PARSER_STRUCT_BODY = '__parser_body__';

let formatter = {};
let fuzzyRuleParser = {};

const fromAll = (formatter.fromAll = (inputs, outputs, rule) => {
  let arr = [];
  let options = module.options;

  // 首行
  arr.push({
    [PARSER_STRUCT_HEAD]: [
      {
        k: 'Engine',
        v: rule.name || 'Default'
      }
    ]
  });

  // Input
  inputs.forEach(input => {
    arr.push(fromInput(input));
  });

  // Output
  outputs.forEach(output => {
    arr.push(fromOutput(output));
  });
  arr.push(fromRuleBlock(rule.ruleBlock));

  return arr;
});

const fromTerm = (formatter.fromTerm = term => {
  let arr = [];

  // 名称
  arr.push(term.name);

  // 类型
  switch (term.type) {
    case fuzzyRuleShapeTypes.TRIANGLE:
      arr.push('Triangle');
      break;
    case fuzzyRuleShapeTypes.RECTANGLE:
      arr.push('Rectangle');
      break;
    case fuzzyRuleShapeTypes.TRAPEZOID:
      arr.push('Trapezoid');
      break;
    case fuzzyRuleShapeTypes.GAUSSIAN:
      arr.push('Gaussian');
      break;
    case fuzzyRuleShapeTypes.ZSHAPE:
      arr.push('ZShape');
      break;
    case fuzzyRuleShapeTypes.SSHAPE:
      arr.push('SShape');
      break;
    default:
      arr.push('Unknow');
      break;
  }

  // 点
  term.points.forEach(p => arr.push(parseFloat(p).toFixed(3)));

  return {
    [PARSER_STRUCT_HEAD]: [
      {
        v: arr.join(' ')
      }
    ]
  };
});

const fromInput = (formatter.fromInput = input => {
  let obj = {};

  // 头部
  obj[PARSER_STRUCT_HEAD] = [
    {
      k: 'InputVariable',
      v: input['name']
    }
  ];

  // 主体部分
  obj[PARSER_STRUCT_BODY] = [
    {
      k: 'enabled',
      v: input.enabled === 1
    },
    {
      k: 'range',
      v: [input.min.toFixed(3), input.max.toFixed(3)].join(' ')
    },
    ...input.terms.map(term => {
      return {
        k: 'term',
        v: fromTerm(term)
      };
    })
  ];
  return obj;
});

const fromOutput = (formatter.fromOutput = output => ({
  [PARSER_STRUCT_HEAD]: [
    {
      k: 'OutputVariable',
      v: output.name
    }
  ],
  [PARSER_STRUCT_BODY]: [
    { k: 'enabled', v: true },
    { k: 'range', v: '0.000 1.000' },
    { k: 'accumulation', v: 'Maximum' },
    { k: 'defuzzifier', v: 'Centroid 200' },
    { k: 'default', v: '0.000' },
    { k: 'lock-previous', v: false },
    { k: 'lock-range', v: false },
    { k: 'term', v: 'Small Gaussian 0.000 0.300' },
    { k: 'term', v: 'Big Gaussian 1.000 0.300' }
  ]
}));

const fromRule = (formatter.fromRule = rule => {
  let results = rule.results;
  let items = rule.items;

  let arr = items
    .concat(results)
    .map(row => [row.continuity, row.name, row.judge, row.term].join(' '));

  return {
    [PARSER_STRUCT_HEAD]: [
      {
        v: arr.join(' ')
      }
    ]
  };
});

const fromRuleBlock = (formatter.fromRuleBlock = ruleBlock => ({
  [PARSER_STRUCT_HEAD]: [
    {
      k: 'RuleBlock',
      v: 'Rules'
    }
  ],
  [PARSER_STRUCT_BODY]: [
    {
      k: 'enabled',
      v: true
    },
    {
      k: 'conjunction',
      v: 'Minimum'
    },
    {
      k: 'disjunction',
      v: 'Maximum'
    },
    {
      k: 'activation',
      v: 'Minimum'
    },
    ...ruleBlock.map(rule => {
      return {
        k: 'rule',
        v: fromRule(rule)
      };
    })
  ]
}));

const parseModule = (fuzzyRuleParser.parse = str => {
  let matches;
  let module = {
    option: {}
  };

  matches = str.match(/Engine:(.|\n)*?(?=\n)(?!\n\s)/g);
  if (matches) {
    module['name'] = matches[0].split(':')[1].trim();
  }

  // input
  let input = (module.option.input = []);
  matches = str.match(/InputVariable:(.|\n)*?(?:(?=\n)(?!\n\s)|$)/g);
  if (matches) {
    matches.forEach(row => {
      input.push(parseInput(row));
    });
  }

  // output
  let output = (module.option.output = []);
  matches = str.match(/OutputVariable:(.|\n)*?(?:(?=\n)(?!\n\s)|$)/g);
  if (matches) {
    matches.forEach(row => {
      output.push(parseOutput(row));
    });
  }

  // ruleBlock
  let content = (module.option.content = {});
  matches = str.match(/RuleBlock:(.|\n)*?(?:(?=\n)(?!\n\s)|$)/g);
  if (matches) {
    matches.forEach(row => {
      content.ruleBlock = parseRuleBlock(row);
    });
  }
  return module;
});

const parseTerm = (fuzzyRuleParser.parseTerm = str => {
  str = str.trim();
  let arr = str.split(' ');
  let term = {};
  let type = fuzzyRuleShapeTypes[arr[1].toUpperCase()];

  term['name'] = arr[0];
  term['type'] = typeof type === 'undefined' ? -1 : type;
  term['points'] = arr.slice(2).map(row => parseFloat(row));

  return term;
});

const parseInput = (fuzzyRuleParser.parseInput = str => {
  let input = {};
  let pattern = /^\s*(\w*?):\s(.*)$/gm;
  let match, k, v;
  let option = (input.option = {
    terms: []
  });

  while ((match = pattern.exec(str))) {
    k = match[1];
    v = match[2].trim();
    switch (k) {
      case 'InputVariable':
        input['name'] = v;
        break;
      case 'range':
        let arr = v.split(' ');
        option['min'] = parseFloat(arr[0].trim());
        option['max'] = parseFloat(arr[1].trim());
        break;
      case 'enabled':
        option['enabled'] = v === 'true';
        break;
      case 'term':
        option['terms'].push(parseTerm(v));
        break;
    }
  }
  return input;
});

const parseOutput = (fuzzyRuleParser.parseOutput = str => {
  let output = {};
  let pattern = /^\s*(\w*?):\s(.*)$/gm;
  let match, k, v;

  while ((match = pattern.exec(str))) {
    k = match[1];
    v = match[2].trim();
    switch (k) {
      case 'OutputVariable':
        output['name'] = v;
        break;
    }
  }
  return output;
});

const parseRule = (fuzzyRuleParser.parseRule = str => {
  let rule = {
    items: [],
    results: []
  };
  let pattern = /(if|and|or|then)\s+(\w+)\s+(is not|is)\s+(\w+)/gi;
  let match;
  let bResult = false;

  while ((match = pattern.exec(str))) {
    if (match[1] === 'then') {
      bResult = true;
    }
    let arr = bResult ? rule.results : rule.items;
    arr.push({
      continuity: match[1],
      name: match[2],
      judge: match[3],
      term: match[4]
    });
  }
  return rule;
});

const parseRuleBlock = (fuzzyRuleParser.parseRuleBlock = str => {
  let ruleBlock = [];
  let pattern = /^\s*(\w*?):\s(.*)$/gm;
  let match, k, v;

  while ((match = pattern.exec(str))) {
    k = match[1];
    v = match[2].trim();

    if (k === 'rule') {
      ruleBlock.push(parseRule(v));
    }
  }

  return ruleBlock;
});

// 判断是否是一个 parser struct
const isStruct = obj => {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return false;
  }

  return PARSER_STRUCT_HEAD in obj || PARSER_STRUCT_BODY in obj;
};

const stringify$1 = struct => {
  let header = struct[PARSER_STRUCT_HEAD] || [];
  let body = struct[PARSER_STRUCT_BODY] || [];
  let arr = [];

  header.forEach(row => {
    let v = row.v;
    if (isStruct(row.v)) {
      v = stringify$1(row.v);
    }

    if (typeof row.k === 'undefined') {
      arr.push(v);
    } else {
      arr.push(`${row.k}: ${v}`);
    }
  });

  body.forEach(row => {
    let v = row.v;
    if (isStruct(row.v)) {
      v = stringify$1(row.v);
    }
    arr.push(`${TAB}${row.k}: ${v}`);
  });

  return arr.join(WRAP);
};

/**
 * 将 模糊规则的数据结构 转换 成规则字符串
 *
 * @param {any} module 模糊规则的数据结构
 */
fuzzyRuleParser.stringify = (inputs, outputs, rule) => {
  let structList = fromAll(inputs, outputs, rule);
  let arr = [];

  structList.forEach(struct => {
    arr.push(stringify$1(struct));
  });

  return arr.join(WRAP);
};

['Input', 'Output', 'RuleBlock', 'Rule', 'Term'].forEach(name => {
  fuzzyRuleParser[`stringify${name}`] = struct =>
    stringify$1(formatter[`from${name}`](struct));
});

export default fuzzyRuleParser;
