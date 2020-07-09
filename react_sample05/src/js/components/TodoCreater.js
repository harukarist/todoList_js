// Reactを読み込み
import React from 'react';

// TodoCreatorコンポーネント（タスク入力フォーム）
// app.jsの方で読み込むので export default にする
export default class TodoCreator extends React.Component {

  // コンストラクタ
  constructor(props) {
    // 継承元にpropsを渡す
    super(props);
    // 自分自身のstate
    this.state = {
      val: '',　//入力したタスク
      errMsg: '' //エラーメッセージ
      // エラーフラグ isError: false を追加してもgood

    };
    // bind(this)でメソッドを縛る
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }


  // 入力フォームinputに値が入力された時 onChangeで呼ばれる
  handleChange(e) {
    // 自分自身（input）のDOMのtargetのvalue（入力内容）を取得してstateにセット
    // setStateしないとrenderメソッドが呼ばれないので入力内容が画面に表示されない
    this.setState({
      val: e.target.value
    });
  }

  // キーボードが押された時 onKeyUpで呼ばれる
  handleKeyUp(e) {
    // ShiftとEnterが押された時
    if (e.keyCode === 13 && e.shiftKey === true) {
      // 入力された値を格納
      const val = e.target.value;
      // 入力された値が空だった場合はエラーメッセージをセット
      if (!val) {
        this.setState({
          errMsg: '入力が空です'
        });
        return; // returnすると、以降の処理は行わない

      }
      // 入力内容が空でない場合はstateを初期化
      this.setState({
        val: '',
        errMsg: ''
      });
      // propsとして親から渡されるcallBackAddTask()を使って、親に入力内容valを渡す
      this.props.callBackAddTask(val);
      // 親のコンポーネント側のメソッドで、渡されたvalを使ってタスクを作る
    }
  }

  // renderメソッド 画面表示用html
  render() {
    // エラーメッセージが空でない場合、spanタグを生成してエラーメッセージを表示、空の場合は空文字
    const errMsg = (this.state.errMsg) ? <span className="error">{this.state.errMsg}</span> : '';
    // 入力フォームのhtmlを返却
    return (
      // 入力内容を画面に表示するにはonChangeをつけてthis.handleChangeを呼び、this.setState()を実行
      // onKeyUpでキーアップした時にthis.handleKeyUpを呼ぶ
      <div className="form">
        <div className="inputArea">
          <input type="text" className="inputText" value={this.state.val}
            onChange={this.handleChange} onKeyUp={this.handleKeyUp} placeholder="ToDoを入力して[Shift+Enter]" />
          {errMsg}
        </div>
      </div>
      // 宿題TODO {errMsg}でエラーメッセージを表示
    );
  }
}
