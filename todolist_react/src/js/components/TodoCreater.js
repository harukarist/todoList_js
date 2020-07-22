// reactライブラリを読み込み
import React from 'react';
// react-reduxライブラリのconnectメソッドを読み込み
import { connect } from 'react-redux'
// actionsで作ったaddTaskメソッドを読み込み
import { addTask } from '../actions'
// prop-typesライブラリを読み込み
import PropTypes from "prop-types";

// TodoCreatorコンポーネント
class TodoCreator extends React.Component {
  // コンストラクタ
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      errMsg: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  // 以前はTodoAppに書いていた乱数生成関数を移動【TODO】
  createHashId() {
    return Math.random().toString(36).slice(-16);
  }

  // フォームに入力された値を再描画するため、setState()で自分自身のstateを変更
  handleChange(e) {
    this.setState({
      inputVal: e.target.value
    });
  }

  // Enterを２回押した時
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
    const errMsg = (this.state.errMsg) ? <span className="formArea__is-error">{this.state.errMsg}</span> : '';
    return (
      <div className="formArea">
        <div className="entryBox">
          <input type="text" className="entryBox__input" value={this.state.inputVal}
            onChange={this.handleChange} onKeyUp={this.handleKeyUp} placeholder="タスクを入力" />
          {errMsg}
        </div>
      </div>
    );
  }
}

// propの型を指定する
// Reactの古いバージョン（ver14,15）ではコンポーネントの中で型を指定できたが
// 今のバージョンではprop-typesライブラリを読み込む必要あり。

// propsの中でどのようなデータが渡ってくるかわからないので、型を制限する。
// （指定していない型が渡されたら自動的にエラーになる）

// コンポーネントのクラス名.propTypesプロパティ = {}
// {}のなかにオブジェクトの形でどのpropを渡して欲しいかを定義

TodoCreator.propTypes = {
  dispatch: PropTypes.func.isRequired
  // dispatchを渡して欲しい
  // PropTypes.
  // dispatchはfunctionなので、funcの型で.
  // 必ず必要なので、渡ってこなかったらエラーにするisRequired
};


// connect()(クラス名)はお決まりパターン
export default connect()(TodoCreator)
