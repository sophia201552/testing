import React from 'react';
import $ from 'jquery';
import s from './Pagination.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
export default //props         分页控件
//current       当前页
//pageSize      每页条数
//total         总数
//onChange      页码改变事件
//continuityNum 连续页码数量 大于等于3的单数 为0的话只有翻页键
//skin          样式配置
//localText     {prve:'<',next:'>'}  文字
// onChangeValue 修改每页条数
// isShowPageSize 是否显示修改页数input框
class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
      total: 0
    };
    this._onPrev = this._onPrev.bind(this);
    this._onNext = this._onNext.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onChangeValue = this._onChangeValue.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {
    const { current = 1, pageSize = 10, total = 10 } = nextProps;
    this.setState({
      current,
      pageSize,
      total: total
    });
  }
  componentDidUpdate() {}
  render() {
    const {
      continuityNum = 5,
      skin = '',
      localText = { prev: '<', next: '>' },
      isShowPageSize = false,
      isShowTotalRecords = false
    } = this.props;
    const { current, pageSize, total } = this.state;
    let maxPage = Math.max(1, Math.ceil(total / pageSize)),
      overflowNum = Math.ceil(continuityNum / 2),
      isOverflowLeft = current - overflowNum > 2,
      isOverflowRight = current + overflowNum < maxPage - 1;
    return (
      <div className={css(`wrapper ${skin}`)}>
        <ul className={css('pagination clear')}>
          <li
            className={css('prev' + (current == 1 ? ' disabled' : ''))}
            onClick={this._onPrev}
          >
            <a>{localText.prev}</a>
          </li>
          {continuityNum == 0 ? null : (
            <li
              title={'1'}
              className={css('item' + (current == 1 ? ' active' : ''))}
              data-page={1}
              onClick={this._onChange}
            >
              <a>{1}</a>
            </li>
          )}
          {isOverflowLeft && continuityNum !== 0 ? (
            <li className={css('item jump')}>
              <a>{'···'}</a>
            </li>
          ) : null}
          {this._createPage()}
          {isOverflowRight && continuityNum !== 0 ? (
            <li className={css('item jump')}>
              <a>{'···'}</a>
            </li>
          ) : null}
          {maxPage == 1 || continuityNum == 0 ? null : (
            <li
              title={maxPage}
              className={css('item' + (current == maxPage ? ' active' : ''))}
              data-page={maxPage}
              onClick={this._onChange}
            >
              <a>{maxPage}</a>
            </li>
          )}
          <li
            className={css('next' + (current == maxPage ? ' disabled' : ''))}
            onClick={this._onNext}
          >
            <a>{localText.next}</a>
          </li>
          {isShowTotalRecords && (
            <li
              className={css('itemInput')}
              title={this.props.i18n.TOTAL_RECORDS.replace('{num}', total)}
            >
              <a>{this.props.i18n.TOTAL_RECORDS.replace('{num}', total)}</a>
            </li>
          )}
          {isShowPageSize && (
            <li
              className={css('itemInput')}
              title={this.props.i18n.DISPLAY_DATA_PER_PAGE.replace(
                '{num}',
                pageSize
              )}
            >
              <span>pageSize</span>
              <input
                value={pageSize}
                onChange={this._onChangeValue}
                onBlur={() => {
                  const { onChangeValue = () => {} } = this.props;
                  onChangeValue(pageSize);
                }}
              />
            </li>
          )}
        </ul>
      </div>
    );
  }
  _createPage() {
    const { continuityNum = 5 } = this.props;
    const { current, pageSize, total } = this.state;
    let maxPage = Math.max(1, Math.ceil(total / pageSize)),
      overflowNum = Math.ceil(continuityNum / 2),
      isOverflowLeft = current - overflowNum > 2,
      isOverflowRight = current + overflowNum < maxPage - 1;
    let rs = [];
    if (maxPage <= 2 || continuityNum == 0) {
      return rs;
    }
    let startIndex = isOverflowLeft ? current - (overflowNum - 1) : 2,
      endIndex = isOverflowRight ? current + (overflowNum - 1) : maxPage - 1;
    if (!isOverflowLeft && isOverflowRight) {
      endIndex = 1 + continuityNum;
    }
    if (!isOverflowRight && isOverflowLeft) {
      startIndex = maxPage - continuityNum;
    }
    for (let i = startIndex; i <= endIndex; i++) {
      rs.push(
        <li
          key={i}
          title={i}
          className={css('item' + (current == i ? ' active' : ''))}
          data-page={i}
          onClick={this._onChange}
        >
          <span>{i}</span>
        </li>
      );
    }
    return rs;
  }
  _onPrev(ev) {
    const { onChange = () => {} } = this.props;
    const { current } = this.state;
    let num = current - 1;
    if (
      !$(ev.target)
        .closest('li')
        .hasClass(css('disabled'))
    ) {
      this.setState({
        current: num
      });
      onChange(num);
    }
  }
  _onNext(ev) {
    const { onChange = () => {} } = this.props;
    const { current } = this.state;
    let num = current + 1;
    if (
      !$(ev.target)
        .closest('li')
        .hasClass(css('disabled'))
    ) {
      this.setState({
        current: num
      });
      onChange(num);
    }
  }
  _onChange(ev) {
    const { onChange = () => {} } = this.props;
    const { current } = this.state;
    let num = Number(ev.target.closest('li').dataset.page);
    if (num != current) {
      this.setState({
        current: num
      });
      onChange(num);
    }
  }
  _onChangeValue(e) {
    let newValue = e.target.value;
    this.setState({
      pageSize: newValue - 0
    });
  }
}
