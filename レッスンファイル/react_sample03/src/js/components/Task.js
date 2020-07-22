// reactライブラリを読み込み
import React from 'react';
// クラスを付け替えするclassnamesライブラリを読み込み
import ClassNames from 'classnames';
// bundle.jsを読み込み
// import { TodoList } from '../../../dist/js/bundle';

// Taskコンポーネント（1つ1つのタスク）
// TodoList.jsでインポートするため、export defaultをつける
export default class Task extends React.Component {

  // コンストラクタ
  constructor(props) {
    // 継承元にpropsを渡す
    super(props);

    this.state = {
      id: this.props.id, // コンポーネント自体のID
      text: this.props.text, //タスク名
      isDone: false,
      editMode: false
    };
    // イベントハンドラ（thisで縛る）
    this.handleClickToggleDone = this.handleClickToggleDone.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
    this.handleClickshowEdit = this.handleClickshowEdit.bind(this);
    this.handleKeyUpCloseEdit = this.handleKeyUpCloseEdit.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
  }



  // 編集ボックスが変更されたら呼び出し
  handleChangeText(e) {
    this.setState({
      text: e.target.value
    });
  }
  // チェックボックスをクリックしたら呼び出し
  handleClickToggleDone() {
    // 引数prevStateで以前のStateを取得して、isDoneプロパティを反転させる
    this.setState(prevState => ({
      isDone: !prevState.isDone
    }));
  }
  // ゴミ箱アイコンをクリックしたら呼び出し
  handleClickRemove(e) {
    // 親から渡ってきたpropsにある関数onRemove()を実行して、引数に自分自身のidを渡して、
    // 自分を削除してねと親にお願いする
    this.props.onRemove(this.state.id);

    // 以下の方法を使えば自身で削除できなくもない。
    // $(e.target).parent('.list__item').remove();
    // でもReactを使う場合はjsやjQueryでDOMを取得するのは避けた方が良い（せざるをえない場合もある）
    // コンポーネント、JSX、仮想DOMの機能を使う。
  }
  // タスクがクリックされた場合
  handleClickshowEdit() {
    this.setState({
      editMode: true
    });
  }
  // 編集ボックスがkeyupされた時
  handleKeyUpCloseEdit(e) {
    if (e.keyCode === 13 && e.shiftKey === true) {
      this.setState({
        text: e.currentTarget.value,
        editMode: false
      });
    }
  }
  // タスクを削除した時（コンポーネントが破棄される）
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  // renderメソッド
  render() {
    // reactにはclassを付け替えする機能はないので、外部ライブラリclassnamesを使う

    // liタグのクラス名 list__itemとlist__item--doneを用意する
    const classNameLi = ClassNames({
      'list__item': true,
      'list__item--done': this.state.isDone
    });
    // チェックボックスのクラス名（クリックすると変化する）
    const classNameIcon = ClassNames({
      'fa': true,
      'fa-circle-thin': !this.state.isDone,
      'fa-check-circle': this.state.isDone,
      'icon-check': true
    });

    // underscoreのようなif文は使えないので、変数に前もって入れておく（returnの中ではif文が書けない）
    const input = (this.state.editMode) ?
      // editModeの場合
      <input type="text" className="editText" value={this.state.text}
        onChange={this.handleChangeText} onKeyUp={this.handleKeyUpCloseEdit} /> :
      // そうでない場合
      <span onClick={this.handleClickshowEdit}>{this.state.text}</span>;

    // returnでhtmlを吐き出す
    return (
      // JSXの書き方
      // 上記で定義した変数classNameLiをliタグのクラス名、変数classNameIconをiタグのクラス名に入れる
      // チェックボックスがクリックされたら this.handleClickToggleDone()を呼び出してisDoneを反転
      // {input}でタスク名を表示
      // ゴミ箱アイコンをクリックしたらthis.handleClickRemove()を呼び出し
      <li className={classNameLi}>
        <i className={classNameIcon} onClick={this.handleClickToggleDone} aria-hidden="true" />
        {input}
        <i className="fa fa-trash icon-trash" onClick={this.handleClickRemove} aria-hidden="true" />
      </li>
    );
  }
}
