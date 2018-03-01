/* tslint:disable:no-unused-variable */
import React from 'react';
/* tslint:enable:no-unused-variable */
import { DetailsList, DetailsRow, IDetailsRowProps, IDetailsRowCheckProps } from 'office-ui-fabric-react/lib/DetailsList';
import cx from 'classnames';


let _items;

export default class DetailsListCustomRowsExample extends React.PureComponent {
  constructor() {
    super();

    _items = _items || [{
      thumbnail: '//placehold.it/222x222'
    }];
    this._onRenderRow = this._onRenderRow.bind(this);
    this._onRenderCheck = this._onRenderCheck.bind(this);
  }

  render() {
    return (
      <DetailsList
        items={ _items }
        setKey='set'
        onRenderRow={ this._onRenderRow }
      />
    );
  }

  _onRenderRow(props) {
    return (
      <DetailsRow
        { ...props}
        onRenderCheck={ this._onRenderCheck }
        aria-busy={ false }
      />
    );
  }

  _onRenderCheck(props) {
    return (
      <div
        className={ cx(
          'ms-DetailsRow-check DetailsListExample-customCheck', {
            'is-any-selected': props.anySelected
          }) }
        role='button'
        aria-pressed={ props.isSelected }
        data-selection-toggle={ true }
      >
        <input
          type='checkbox'
          checked={ props.isSelected }
        />
      </div>
    );
  }
}