import React from 'react';
import ReactDOM from 'react-dom';
// コンポーネントを読み込み
import TodoList from './components/TodoList';
import TodoCreator from './components/TodoCreater';
import Search from './components/Search';
// lodashライブラリを変数_に割り当てる（underscoreと同等のライブラリなので）
import _ from 'lodash';

// 中カッコ{}の中に任意の名前を入れるとfrom以下のjsの中身が入る
// import { TodoList } from './components/TodoList';
// 1つのjsファイルに複数クラスがある場合は、中カッコでインポートするクラスを指定する
// 今回の場合はTodoList.jsには1つのクラスしかないため、中カッコなしでもOK

// 別名のコンポート名をつける場合は中カッコの中でasを使う
// import { TodoList as ComponentName } from './components/TodoList';
// <ComponentName />で呼び出せる


// TodoAppコンポーネント（画面全体表示用）
class TodoApp extends React.Component {
  // コンストラクタ
  constructor() {
    super();
    // タスクのデータをTodoListコンポーネントではなく、このTodoAppコンポーネント（親）に持たせる
    // このコンポーネントのrenderでTodoCreator,TodoListコンポーネントを使う際にタスクのデータが必要になるため

    // <TodoCreator />コンポーネントで入力したタスク名が親（TodoApp）のdataに渡される
    // 親はそのdataを<TodoList />コンポーネントに渡して画面にリスト表示させる
    this.state = {
      data: [
        {
          id: this.createHashId(),
          text: 'sample todo1',
          isDone: false
        },
        {
          id: this.createHashId(),
          text: 'sample todo2',
          isDone: false
        }
      ],
      searchText: ''  //絞り込むキーワード
    };
    this.callBackRemoveTask = this.callBackRemoveTask.bind(this);
    this.callBackAddTask = this.callBackAddTask.bind(this);
    this.callBackSearch = this.callBackSearch.bind(this);
    this.filterCollection = this.filterCollection.bind(this);
  }

  // ハッシュID生成用関数
  createHashId() {
    // 新たにタスク追加する際にidを振る必要があるが、idを配列の順番号にしてしまうと
    // タスクが削除された際に同じidが振られてしまうため、ランダムなIDを生成する必要あり！
    // const data = [
    //   {
    //     id: 0
    //   },
    //   {
    //     id: 1
    //   },
    //   {
    //     id: 2
    //   }
    // ];

    // ーーーー
    // toString(36)で引数(0-9の10文字と、a-zの26文字)の値を基数変換
    // slice(-16)で末尾から16文字を抜き出す
    // return Math.random().toString(36).slice(-16);
    // 0: {id: "0.4jn51j0ksey", text: "sample todo1", isDone: false}
    // 1: {id: "0.ww6bxsqxp8", text: "sample todo2", isDone: false}
    // 2: {id: "0.mc1kkn9dm1", text: "test"}
    // 3: {id: "0.damvf2ii2we", text: "test2"}
    // 上記の方法では「完全に一意なキー」は生成できない（重複する場合がある）ので注意！
    // 【宿題TODO】一意なキーにしたいなら外部ライブラリを使うか、このコンポーネントで...？？

    // ーーーー
    // https://qiita.com/psn/items/d7ac5bdb5b5633bae165
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

    // UUIDのフォーマット文字列を配列に格納
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    let len = uuid.length;
    for (let i = 0; i < len; i++) {
      switch (uuid[i]) {
        case "x":
          /*
           * 0 ≦ Math.random() < 1 なので、16をかけると
           * 0 ～ 15.xxx(16未満) となり、小数部を切り捨てて数値 0 ～ 15 を
           * 16進数の文字にしている（0 ～ f となる）
           */
          uuid[i] = Math.floor(Math.random() * 16).toString(16);
          break;
        case "y":
          /* 
                * 同じく、 0 ～ 3.xxx(4未満) の小数部を切り捨てて、8を加えると
                * 8 ～ 11 の範囲の値となるので、それを16進数の文字にしている
                * (8, 9, a, b のいずれかになる)
                */
          uuid[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
          break;
      }
    }
    // 配列を結合して１つの文字列に変換
    return uuid.join("");
    // 0: {id: "68693982-3a75-4a0a-a659-47e7e35693c9", text: "sample todo1", isDone: false}
    // 1: {id: "b6019b80-25be-44ec-bb83-5397ad357676", text: "sample todo2", isDone: false}
    // 2: {id: "88ffd9ad-1407-4292-bf30-a3f849b3f41b", text: "test"}


    // ーーーー
    // cryptoモジュールを利用する方法
    // require("crypto").randomBytes(10).toString("base64");
    // ーーーー
    // uuidプラグインを使う方法
    // 
  }

  // Searchコンポーネントから呼ばれる
  callBackSearch(val) {
    this.setState({
      searchText: val //自分自身のstateを更新（コンストラクタのstateを更新）
    });
  }

  // タスク削除　TodoListコンポーネント呼び出し時に実行
  // TodoListではなく親のTodoApp側で行うように変更
  callBackRemoveTask(id) {
    // データを削除
    let data = _.reject(this.state.data, { 'id': id });
    // 更新
    this.setState({
      data: data
    });
    // stateを更新するとrenderメソッドが走って
    // コンポーネントに渡されるdataは更新されたものが渡され、タスクが生成される
  }

  // タスク追加　TodoCreatorコンポーネント呼び出し時に実行
  callBackAddTask(val) {
    // 自分のstate.dataを受け取って格納
    let nextData = this.state.data;
    // push()でコレクション型の配列にタスクID、タスク名をオブジェクトとして追加
    nextData.push({ id: this.createHashId(), text: val });
    console.log('nextData', nextData)
    // 上記のcreateHashId()を呼び出して一意のIDを生成
    this.setState({
      data: nextData
    });
  }

  // タスクを絞り込む時に呼び出し
  // 呼び出し元のfilterCollectionでは引数を指定していないが
  // filter()の引数としてfunctionを渡し、dataの配列ごとにfunctionが実行され、
  // js側で自動的に、1つ1つの配列のdataが展開されて引数elmに入るので
  // 引数elmで渡されたdataを元に絞り込んでいく
  filterCollection(elm) {
    // 正規表現の構文を作るオブジェクトRegExp()を使う
    // '^'で前方一致
    // 第二引数は基本的に'i'でOK
    const regexp = new RegExp('^' + this.state.searchText, 'i');
    // textのタスク名がregexpの正規表現にマッチするかをmatch(regexp)で調べる
    // match()でマッチするものだけ返す
    return (elm.text.match(regexp));
  }

  render() {

    // 検索ワードがある場合は、jsのメソッドfilter()を使って、上記のfilterCollectionを呼び出してタスクを絞り込む
    // 検索ワードがない場合はそのまま自身のstate.dataを格納
    // dataは配列のオブジェクト
    // filter()を使うことで引数にfunctionを渡せる。dataの配列の個数分、そのfunctionを実行する。
    const data = (this.state.searchText) ? this.state.data.filter(this.filterCollection) : this.state.data;
    // 正規表現で前方一致するタスク名のみ返ってくる

    // ただし、検索して戻すとdone状態が外れてしまう
    // 【宿題TODO】検索した後もdoneのままになるようにする
    // ⇒実装済み：isDoneをapp.js側のstateに持たせて、Task.js側のstateは isDone: this.props.isDone, に変更。

    return (
      // JSXの書き方では何らかのタグで囲む必要があるためdivタグで囲む
      // タグを並列で並べただけだとシンタックスエラーになってコンパイルできない
      <div>

        <TodoCreator callBackAddTask={this.callBackAddTask} />

        <Search callBackSearch={this.callBackSearch} />

        {/* 上記で絞り込んだあとのデータdataをTodoListコンポーネントに渡す */}
        <TodoList data={data} callBackRemoveTask={this.callBackRemoveTask} />

      </div>
    );
  }
}

ReactDOM.render(
  <TodoApp />,
  document.getElementById('app')
);

// TodoAppコンポーネントのrenderメソッド
// < TodoCreator /> でTodoCreatorコンポーネントを呼び出して入力フォームを表示
// this.callBackAddTask でタスク追加


// < TodoList /> でTodoListコンポーネントを呼び出し
// data={this.state.data} でdataをpropsとして渡す
// this.callBackRemoveTask でタスク削除

// インポートしたコンポーネントが呼び出される
// import TodoList from './components/TodoList'
// import TodoCreator from './components/TodoCreater'
