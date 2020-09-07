import React from 'react';
import { connect } from 'react-redux' //react-reduxライブラリのconnectメソッド
import { addTask } from '../actions' //actionsで作ったaddTaskメソッド
import PropTypes from "prop-types"; // prop-typesライブラリ

// TodoCreatorコンポーネント
class TodoCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      errMsg: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  // 乱数生成用の関数
  createHashId() {
    return Math.random().toString(36).slice(-16);
  }

  // フォームに入力された値を再描画するため、setState()で自分自身のstateを変更
  handleChange(e) {
    this.setState({
      inputVal: e.target.value
    });
  }

  // Enterが２回押された時
  handleKeyUp(e) {
    if (e.keyCode === 13 && e.KeyCode === prevKeyCode) {
      const inputVal = e.target.value;
      if (!inputVal) {
        // 入力値がない場合はエラーメッセージを格納
        this.setState({
          errMsg: 'タスクを入力してください'
        });
        return;
      }
      // stateの値を初期化
      this.setState({
        inputVal: '',
        errMsg: ''
      });
      // propsで渡されたstoreのメソッド dispatch()の中で
      // addTask()を呼んでaddTaskアクションを実行（新しいランダムIDと入力されたタスク名を渡す）
      this.props.dispatch(addTask(this.createHashId(), inputVal));

      // index.jsのaddTaskアクションでIDとタスク名を受け取り、Storeのプロパティの値を更新して
      // typeをADDとしてreducersに渡す。
      // reducersでは値を受け取り、typeを判別してADDの処理を実行し、Storeにstateを渡され、Storeが更新される。
    }
    let prevKeyCode = e.KeyCode;
  }
  render() {
    // エラーメッセージ生成
    const errMsg = (this.state.errMsg) ? <span className="formArea__is-error">{this.state.errMsg}</span> : '';
    return (
      // 入力フォームのDOM
      <div className="formArea">
        <div className="entryBox">
          <input type="text" className="entryBox__input" value={this.state.inputVal}
            onChange={this.handleChange} onKeyUp={this.handleKeyUp} placeholder="タスクを入力" />
        </div>
        {errMsg}
      </div>
    );
  }
}

// prop-typesライブラリでpropsの型チェック
// コンポーネントのクラス名.propTypesプロパティ = {必要なprops}
TodoCreator.propTypes = {
  dispatch: PropTypes.func.isRequired
};

// connect()(自身のクラス名) でReactコンポーネントをReduxのstoreに紐付け
export default connect()(TodoCreator)
