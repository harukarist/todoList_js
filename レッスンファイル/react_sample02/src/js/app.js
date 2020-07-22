import React from 'react';
import ReactDOM from 'react-dom';

//=============================================
// イベントハンドリング
//=============================================
// backboneではViewの中のevents:に指定していた部分
// ReactではonClickなどのイベントハンドラを使う（js初級を参照）
// 発火させたい処理を {メソッド名} で指定する
// ハンドラ内でthisを使う場合は、constructor内でbindして束縛する必要がある
// backboneではunderscoreライブラリを使って_.bindAll()していた部分

// コンポーネント（部品）を作る＝ReactのViewクラス部分
class ToggleBtn extends React.Component {
  constructor(props) {
    // 継承元のコンストラクタにpropsを渡す
    super(props);
    // このコンポーネントのstateプロパティを設定
    this.state = {
      // トグルフラグをオンに
      isToggleOn: true
    };

    // this.メソッド名.bind(this)で、handleClick()メソッドの中で使うthisを縛る
    // ハンドラの中でthisを使う場合は、別のthisになってしまうので束縛が必要（そのまま使うとエラーが出る）
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // isToggleOnを反転する
    // 更新する前のStateを反転したいので!prevState.isToggleOnを使う
    // !this.state.isToggleOnだと更新後のStateになってしまう
    // setStateの中で前のstateを使いたい場合は、fuctionを渡すこと！
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
    // アロー関数で引数が1つの場合は引数の後ろの)は省略できる
    // this.setState(prevState) => ({
    // this.setState(prevState => ({

  }

  render() {
    // JSXではhtmlの書き方が少し変わる（classではなくclassNameを使う）
    // 吐き出されたhtmlはclassNameではなくclassになる。
    // onClickには中カッコ{}でイベント名を指定
    // {this.state.isToggleOn ? 'ON' : 'OFF'} →isToggleOnがtrueならON,falseならOFFを設定
    return (
      <button className="btn" onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
ReactDOM.render(
  <ToggleBtn />,
  document.getElementById('app1')
);

//=============================================
// Form
//=============================================

// reactでは、brタグやinputタグなどシングルタグやiタグなど空タグで使う場合、
// 最後に必ず / をつける必要があるので注意！
// <br />
// <input />
// <i /> など

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'デフォルトの値'
    };

    // メソッド名はなんでもいいが、わかりやすい名前に
    // イベントを操作するメソッドは handle などを使う

    // thisを縛る
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // inputやtextareaにはonChangeが必ず必要（change内でsetStateで値を変更しないと画面上でも値が変わらない）
  handleChange(event) {
    // textareaの値を更新する
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(this.state.value);
  }

  render() {
    return (
      // submitされるとonSubmit={this.handleSubmit}でhandleSubmit()が呼ばれる
      // 以下のhtmlは<br />で改行するのではなく、CSSでdisplay:blockを使う方が無駄なタグが増えなくて良い
      <form onSubmit={this.handleSubmit}>
        <label>
          comment:<br />
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label><br />
        <input type="submit" value="アラート出す" className="btn" />
      </form>
      // {this.state.value}でtextareaの中身を動的に変更
      // textareaの中身が変わったらonChangeの{this.handleChange}でhandleChange()が呼ばれる
      // onChangeを入れないとtextareaに入力しても文字が表示されなくなってしまう
    );
  }
}
ReactDOM.render(
  <Form />,
  document.getElementById('app2')
);

//=============================================
// 1つのコンポーネントで複数のフォーム項目を扱う場合
//=============================================
class MultipleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,　// チェックボックスのState
      numberOfGuests: 2　// ゲストの人数
    };

    // イベントハンドラのthisを縛る
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // チェックボックスを押した時、入力フォームの中身が変わった時
  handleInputChange(event) {
    // event.targetで自分自身のDOMを取得
    // 値は変化しないのでconstに格納
    const target = event.target;
    // DOMがチェックボックスの場合はcheckedプロパティ、そうでない場合はvalueプロパティの値を格納
    const value = target.type === 'checkbox' ? target.checked : target.value;
    // inputのname属性を格納（isGoingかnumberOfGuestsが入る）
    const name = target.name;

    this.setState({
      // [変数]でプロパティ名に変数を使うことができる
      // [name]で、inputのname属性の値がプロパティとして入る
      // numberOfGuests: value; と同じ意味
      [name]: value
    });
  }

  // 送信された時
  handleSubmit(event) {
    // イベントの伝播を止めてアラートを出力
    event.preventDefault();
    alert(this.state.isGoing + ' & ' + this.state.numberOfGuests);
  }

  // 今回は複数のinputを1つのコンポーネントにまとめているが
  // 実務では後々の更新、機能修正のため、フォーム要素ごとにコンポーネントを分ける方が保守性が高い
  render() {
    return (
      // submitされたらonSubmitが呼ばれる
      <form onSubmit={this.handleSubmit}>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            // isGoingがtrueならchecked=trueでチェックボックスがチェックされる
            checked={this.state.isGoing}
            // 画面上でinputの表示を変更するにはonChangeが必要
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:<br />
          <input
            // 途中で改行してもOK
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            // 画面表示を変更
            onChange={this.handleInputChange} />
        </label><br />
        <input type="submit" value="アラート出す" className="btn" />
      </form>
    );
  }
}
ReactDOM.render(
  <MultipleForm />,
  document.getElementById('app3')
);
