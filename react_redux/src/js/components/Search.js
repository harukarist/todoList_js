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
      val: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    // 検索フォームに入力されるとhandleChangeが呼ばれて
    // 自分自身のvalを変える
    this.setState({
      val: e.target.value
    });
    // propsで渡されたdispatch()を使って、searchTaskアクションを呼ぶ（自分自身の値を渡す）
    this.props.dispatch(searchTask(e.target.value));
  }
  // renderは今までと変わらず
  render() {
    return (
      <div className="searchBox">
        <i className="fa fa-search searchBox__icon" aria-hidden="true" />
        <input type="text" className="searchBox__input" onChange={this.handleChange}
          value={this.state.val} placeholder="somothing keyword" />
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
