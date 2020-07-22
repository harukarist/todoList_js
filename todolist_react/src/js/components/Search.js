import React from 'react';
// react-reduxのconnectメソッドを読み込み
import { connect } from 'react-redux'
// actionのsearchTaskを読み込み
import { searchTask } from '../actions'
import PropTypes from "prop-types";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    console.log('handleChange', e.target.value)
    // 検索フォームに入力されるとhandleChangeが呼ばれ、自分自身のvalをセット
    this.setState({
      searchVal: e.target.value
    });
    // propsで渡されたdispatch()を使って、searchTaskアクションを呼ぶ（自分自身の値を渡す）
    this.props.dispatch(searchTask(e.target.value));
  }
  // 検索ボックスを描画
  render() {
    return (
      <div className="searchBox">
        <input type="text" className="searchBox__input" onChange={this.handleChange}
          value={this.state.searchVal} placeholder="Search..." />
        <i className="fas fa-search searchBox__icon" aria-hidden="true" />
      </div>
    );
  }
}

// propの型を指定
Search.propTypes = {
  // 必ず受け取る
  dispatch: PropTypes.func.isRequired
};

// Reduxお決まり
export default connect()(Search)
