import React from 'react';
import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/python/python';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';

import 'codemirror/addon/merge/merge';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/scroll/simplescrollbars';

import 'codemirror/addon/hint/show-hint.css'; // without this css hints won't show
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import s from './CodeView.css';

const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
/*
  autoCompleteList  [{text:'',displayText:''}]  自动提示列表
  onChange          function(code)              value改变触发事件
  option            CodeMirror option           CodeMirror控件配置
  value                                         值
  onBlur            function()                  失去焦点事件
*/

export default class CodeView extends React.Component {
  constructor(props) {
    super(props);
    this.codemirror = null;
    this._autocomplete = this._autocomplete.bind(this);
  }
  componentDidMount() {
    const {
      onChange = () => {},
      option = {},
      value = '',
      onBlur = () => {}
    } = this.props;
    let options = Object.assign(
      {
        mode: 'python',
        lineNumbers: true,
        indentUnit: 4,
        tabMode: 'spaces',
        autofocus: true,
        scrollbarStyle: 'simple',
        gutters: ['CodeMirror-lint-markers'],
        fullScreen: false,
        smartIndent: true,
        indentWithTabs: true,
        lint: {
          getAnnotations(code, updateLinting) {
            let text = code + '\n';

            if (text.trim() == '') {
              updateLinting('', []);
              return;
            }
            apiFetch.checkPythonCode(text).subscribe({
              fail: rs => {
                console.log(rs);
              },
              next: result => {
                let found = [];
                if (!result.success && result.data) {
                  let start_line = result.data.lineno,
                    start_char = result.data.offset,
                    end_line = result.data.lineno,
                    end_char = result.data.offset,
                    message = result.data.msg;
                  found.push({
                    from: CodeMirror.Pos(start_line - 1, start_char),
                    to: CodeMirror.Pos(end_line - 1, end_char),
                    message: message
                  });
                }
                updateLinting(found);
              }
            });
          },
          async: true
        },
        extraKeys: {
          Tab: function(cm) {
            if (cm.somethingSelected()) {
              cm.indentSelection('add');
            } else {
              let spaces = new Array(cm.getOption('indentUnit') + 1).join(' ');
              cm.replaceSelection(spaces);
            }
          },
          F11: function(cm) {
            cm.setOption('fullScreen', !cm.getOption('fullScreen'));
          },
          Esc: function(cm) {
            if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
          }
        }
      },
      option
    );
    if (CodeMirror) {
      this.codemirror = CodeMirror.fromTextArea(
        this.refs['CodeMirror'],
        options
      );
      this.codemirror.setSize('100%', '100%');
      this.codemirror.on('keyup', (cm, e) => {
        // 屏蔽 backspace 上下左右 按键
        if (
          e.keyCode != 8 &&
          e.keyCode != 37 &&
          e.keyCode != 38 &&
          e.keyCode != 39 &&
          e.keyCode != 40
        ) {
          this._autocomplete(cm);
        }
      });
      this.codemirror.on('change', (cm, e) => {
        let value = cm.doc.getValue();
        onChange(value);
      });
      this.codemirror.on('blur', (cm, e) => {
        onBlur();
      });
      this.codemirror.setValue(value);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    let cursor = this.codemirror.getCursor();
    if (value == this.props.value) {
    } else {
      this.codemirror.setValue(value);
      this.codemirror.setCursor(cursor);
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentDidUpdate() {}
  render() {
    const { option } = this.props;
    return (
      <div className={css('codeView')}>
        <textarea ref="CodeMirror" />
      </div>
    );
  }
  setCursorValue(value) {
    return this.codemirror.replaceSelection(value);
  }
  getValue() {
    return this.codemirror.doc.getValue();
  }
  _autocomplete(cm) {
    let autoCompleteList = this.props.autoCompleteList || [];
    cm.showHint({
      hint: (editor, options) => {
        let WORD = /[\w$]+/;
        let word = (options && options.word) || WORD;
        let cur = editor.getCursor(),
          curLine = editor.getLine(cur.line);
        let end = cur.ch,
          start = end;
        while (start && word.test(curLine.charAt(start - 1))) --start;
        let curWord = start != end && curLine.slice(start, end);
        let candidates = autoCompleteList.filter(item => {
          return item.displayText.startsWith(curWord);
        });
        if (candidates.length === 1) {
          candidates.unshift({
            text: '',
            displayText: ''
          });
        }
        return {
          list: candidates,
          from: CodeMirror.Pos(cur.line, start),
          to: CodeMirror.Pos(cur.line, end)
        };
      }
    });
  }
}
