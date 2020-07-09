//=============================================
// React.jsとは？
//=============================================
// ・MVCのV（View）だけのフレームワーク（ライブラリに近い）
// ・Facebook社が作ったフレームワーク
// ・保守性が高く大規模なシステムにも強い
// ・高速に動くのでスマホなど処理能力の低い端末でもサクサク動く

// ・bootstrapと同じように、ボタン、フォームといったコンポーネント単位で管理できる
// ・仮想DOM（VirtualDOM）を使って、差分だけをレンダリング
// ・JSX（Reactの機能）を使えば、js内でhtml風に書ける
// ・propsとstateというプロパティを元に色々な処理をしていく
// ・一方向のデータフローにより、従来の双方向データバインディングを実現するコードよりも簡素でわかりやすい

// JavaScriptで書かれたライブラリ。react.jsをインクルードして使う。
//（MVCで言うところの）Viewのみを担当する。
// JavaScriptのコード中に（PHPの様に）「HTMLタグ(っぽいもの)」を書ける。
// componentを作って使う

// import 変数名 from 'ライブラリ' で reactとreact-dom を読み込む
import React from 'react';
import ReactDOM from 'react-dom';

//=============================================
// Sample01 基本の書き方
//=============================================

// Reactはバージョンによって書き方が違うので注意！
// ここでは最新(16.2.0）の書き方

// ReactDOMのrenderメソッド
// ReactDOM.render(第一引数に表示するhtml,第二引数に書き込み先)
ReactDOM.render(
  // 第一引数 htmlタグ
  // Reactではjsxの機能を使って、''で囲まなくてもhtmlを書くことができる
  <h1>Hello, world!</h1>,
  // 第二引数 書き込み先
  // app1のID属性を持つDOMに第一引数のh1タグが挿入される
  document.getElementById('app1')
);

//=============================================
// Sample02 JSXを使う
//=============================================

// formatNameという関数を作る
function formatName(user) {
  // 引数のfirstName, lastNameを空文字入りで返す
  return user.firstName + ' ' + user.lastName;
}

// ユーザー情報を入れるオブジェクト変数
var user = {
  firstName: 'kaz',
  lastName: 'kichi'
};

// JSXを使った書き方（''や + を使わない）
// 変数や関数の結果を表示する時は{}を使う
var element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);
// JSXを使わない場合、''と + を使う必要があり、可読性が悪い
// var element2 = '<h1>Hello, ' + formatName(user) + '！</h1>';

ReactDOM.render(
  // ReactDOM.render(第一引数に表示するhtml,第二引数に書き込み先)
  element,
  document.getElementById('app2')
);

//=============================================
// Sample03 コンポーネントとprops（ES6での書き方）
//=============================================
// jsでもES6からクラスが使えるようになった
// 一番上でimportしたReactライブラリにあるComponentメソッドをextendsで継承して
// Welcomeというコンポーネントを作る
// コンポーネントは使いまわせる（テンプレートのような物）
class Welcome extends React.Component {
  // クラスのメソッドとしてrender()を定義
  render() {
    // propsは親から値を渡す仕組み（関数に引数を渡すようなもの）
    // this.props.nameでpropsのnameプロパティを定義
    // Welcomeコンポーネントの{this.props.name}に"Sara"が表示される
    return <h1>Hello, {this.props.name}</h1>;
    // propsを使うと下記のようにタグの形<Welcome name="Sara" />で値を渡すことができる
  }
}
// 自分で作ったコンポーネントをタグのように使うことができる
// 上記で作ったWelcomeコンポーネントのnameプロパティに値を渡す
const element2 = <Welcome name="Sara" />;

// 今回からvarを使わない！ let、constを使う
// var a = 1; //ES6では var は使わない！
// let b = 2;　//変数の中身が変わる場合は let を使う
// const c = 3; //中身が変わらない定数はconst を使う（中身が変わるとエラーになる ）

// ES5までは定数の定義ができなかったため、大文字の変数名は定数というルールがあったが
// constを使えば、定数名を大文字を使わなくてもよくなった。

ReactDOM.render(
  // ReactDOM.render(第一引数に表示するhtml,第二引数に書き込み先)
  element2,
  document.getElementById('app3')
);

//=============================================
// Sample04 renderメソッド
//=============================================
// render()メソッドが呼ばれると画面が再描画される

// Clockという関数（引数propsを渡される）→コンポーネントになる
function Clock(props) {
  // JSXの書き方
  return (
    // 引数propsのdateプロパティの中のtoLocaleTimeString()メソッドを呼び出して結果を表示
    // toLocaleTimeString()は現在時刻を表示するメソッド
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

// 今はクラスで作る方法が主流
// class Welcome extends React.Component {
//   render() {
//     return <h1>Hello, {this.props.name}</h1>;
//   }
// }

// メソッドで作る方法（昔の書き方）
// function Clock(props) {
//   return (
//       <h1>Hello, world!</h1>
//       <h2>It is {props.date.toLocaleTimeString()}.</h2>
//   );
// }


function tick() {
  // 変数に入れずにrenderする方法
  // ReactDOM.render(第一引数に表示するhtml,第二引数に書き込み先)
  ReactDOM.render(
    // renderメソッドの第一引数に上記で作ったClockコンポーネントを渡す
    // propsのdateプロパティに現在時刻 new Date()のオブジェクトを渡す
    <Clock date={new Date()} />,
    // ID属性がapp4の要素に表示
    document.getElementById('app4')
  );

  // 変数に入れてからrenderする方法
  // const element2 = <Welcome name="Sara" />;
  // ReactDOM.render(
  //   element2,
  //   document.getElementById('app3')
  // );
}
// jsのsetInterval()で、1000ミリ秒（1秒）ごとにtickを呼び出して現在時刻を更新
// 毎回tickが呼ばれてrenderメソッドで画面を再描画する
setInterval(tick, 1000);

// ブログでよく見るReact.createClass（Reactの「createClassメソッド」）はv16から使えなくなった
// var CommentBox = React.createClass({
//   render: function() {
//     return (
//       <div className="commentBox">
//         Hello, world! I am a CommentBox.
//       </div>
//     );
//   }
// });
// React.render(
//   <CommentBox />,
//   document.getElementById('app5')
// );

//=============================================
// Sample05 propsとstate
//=============================================
// stateはコンポーネントの中だけで保持しておける変数のこと
// propsは親から値を受け取って、それを元になんやかんやする
// stateは自分で使う値を保持して、それを元になんやかんやする
// propsを使うには、this.props.プロパティ名
// stateを使うには、this.state.プロパティ名
class Clock2 extends React.Component {
  // constructor()でコンストラクタを定義
  // クラスのコンストラクタはインスタンス化newすると最初に動く処理
  // PHP部、フレームワーク部を参照
  constructor(props) {
    // super(props)でextendsした親コンポーネントReact.Componentのコンストラクタにpropsを渡す（お決まりパターン）
    super(props);
    this.state = {
      date: new Date()
    };
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
// ReactDOM.render(第一引数に表示するhtml,第二引数に書き込み先)
ReactDOM.render(
  <Clock2 />,
  document.getElementById('app5')
);

//=============================================
// Sample06 ライフサイクル
//=============================================
// React、 Vue.jsには「ライフサイクル」がある（メソッドが実行される順番）

class Clock3 extends React.Component {
  constructor(props) {
    console.log('constructor');
    super(props);
    this.state = { date: new Date() };
  }

  // ********************************
  // Reactで用意されているメソッド
  // componentWillMount()
  // componentDidMount()
  // componentWillReceiveProps()
  // componentWillUpdate()
  // componentDidUpdate()
  // componentWillUnmount() 

  /********************************
   * componentWillMount() マウント前
   * 画面の初回描画の直前に呼び出されるメソッド。
   * renderメソッドが呼ばれる前にコンポーネントの状態を変更したい場合は、このメソッド内で処理を書く。DOMはまだ作られていない（componentDidMount()で作る）
   */
  componentWillMount() {
    console.log('componentWillMount');
  }
  /********************************
   * componentDidMount() マウント後
   * 実際のDOMが表示された後に呼び出されるメソッド。
   * このメソッド内で実際のDOMにアクセスが出来るようになる。
   * jQueryでDOMを操作したい時などはこのメソッド内で行う。
   */
  componentDidMount() {
    console.log('componentDidMount');
    // timerIDプロパティにsetInterval()オブジェクトを格納
    // setInterval()で1秒毎にtick()を実行
    // tick()を実行するとsetState()でrender()が実行される
    this.timerID = setInterval(
      // アロー関数
      () => this.tick(),
      1000
    );
    // () => this.tick()は
    // function () {
    //   this.tick();
    // }と同じ
    // ※アロー関数の中では通常の関数とthisの向き先が変わるので注意！（console.logで確認しよう！）
  }

  /********************************
   * componentWillReceiveProps()　propsの更新時
   * setProps()によるプロパティの更新時に呼び出されるメソッド。
   * 親コンポーネントのプロパティが変更されたタイミングで呼ばれる。
   * 新しいpropsの値を元にコンポーネントの状態を変更したり、色々な処理を行うためのメソッド。
   */
  componentWillReceiveProps() {

  }

  /********************************
   * componentWillUpdate() 　コンポーネントが更新される前
   */
  componentWillUpdate() {

  }

  /********************************
   * componentDidUpdate() 　コンポーネントが更新された後
   */
  componentDidUpdate() {

  }

  /********************************
   * componentWillUnmount() コンポーネント（DOM）が削除された時
   * アンマウント(DOMからの削除)時
   * backboneのdestroyと同じ
   */
  componentWillUnmount() {
    console.log('componentWillUnmount');
    // jsのclearInterval()で、setInterval()をクリア
    clearInterval(this.timerID);
  }

  // -----------------------
  // componentDidMount() から呼び出すtick()
  tick() {
    console.log('tick');
    // stateを変更するには、this.setState({ プロパティ名: 値 });を使う
    // setState()でstateが変わると、renderメソッドで画面が再描画される
    this.setState({
      // stateのdateプロパティを現在時刻に変更
      date: new Date()
    });

    // renderを使うには、必ずReactで用意されたメソッド setState()を使うこと！
    // jsなので以下のようにも書けてしまうが、renderは動かない
    // this.state.date = new Date();
  }

  // -----------------------
  // このメソッドで仮想DOMが作られる。
  // この仮想DOMを元に実際のDOMに対して変更が必要か判断をしている。
  // ※Reactでは、renderで最初に描画したDOMを仮想DOMとして保持する。
  // 　再描画の際は変更した部分がどこかを判別し、差分だけを再描画する。
  // 再描画の際に全部書き換える必要がないので処理速度が早い。

  // 1コンポーネントに必ず１つ、renderメソッドが必要。
  // コンポーネントクラス内の他のメソッドは省略できる。
  render() {
    console.log('render');
    // 画面に表示するタグを返す
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
// ReactDOM.render(第一引数に表示するhtml,第二引数に書き込み先)
const clock3 = ReactDOM.render(
  <Clock3 />,
  document.getElementById('app6')
);
