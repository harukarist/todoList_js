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
      val: '',
      errMsg: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  // 以前はTodoAppに書いていた乱数生成関数を移動【宿題】
  createHashId() {
    return Math.random().toString(36).slice(-16);
  }

  // setStateで自分自身のstateを変更
  // これを書かないと、入力値を変えてもフォームの値が再描画されない
  handleChange(e) {
    this.setState({
      // 入力された値を取得してvalにセット
      val: e.target.value
    });
  }

  // ShiftEnterした時
  handleKeyUp(e) {
    if (e.keyCode === 13 && e.shiftKey === true) {

      const val = e.target.value;
      if (!val) {
        this.setState({
          errMsg: '入力が空です'
        });
        return;
      }

      this.setState({
        val: '',
        errMsg: ''
      });
      // propsで渡されたstoreのメソッド dispatch()の中で
      // addTask()を呼んでaddTaskアクションを実行（新しいランダムIDと入力されたタスク名を渡す）
      this.props.dispatch(addTask(this.createHashId(), val));

      // index.jsのaddTaskアクションでIDとタスク名を受け取り、Storeのプロパティの値を更新して
      // typeをADDとしてreducersに渡す。
      // reducersでは値を受け取り、typeを判別してADDの処理を実行し、Storeにstateを渡され、Storeが更新される。
    }
  }
  render() {
    const errMsg = (this.state.errMsg) ? <span className="error">{this.state.errMsg}</span> : '';
    return (
      <div className="form">
        <div className="inputArea">
          <input type="text" className="inputText" value={this.state.val}
            onChange={this.handleChange} onKeyUp={this.handleKeyUp} placeholder="smothing todo task" />
          {errMsg}
        </div>
      </div>
    );
  }
}

// propの型を指定する
// Reactの古いバージョン（ver14,15）では、コンポーネントの中で型を指定できたが
// 今のバージョンでは別個になっているので、prop-typesライブラリを読み込む必要あり。

// propsの中でどのようなデータが渡ってくるかわからないので、型を制限する。
// （指定していない型が渡されたら自動的にエラーになる）

// コンポーネントのクラス名.propTypesプロパティ = {}
// {}のなかにオブジェクトの形でどのpropを渡して欲しいかを定義

TodoCreator.propTypes = {
  dispatch: PropTypes.func.isRequired
  // dispatchのpropを渡して欲しい
  // PropTypes.
  // dispatchはfunctionなので、funcの型で.
  // 必ず必要なので、渡ってこなかったらエラーにする。 isRequired
};


// connect()(クラス名)はお決まりパターン
export default connect()(TodoCreator)
