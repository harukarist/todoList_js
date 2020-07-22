import React from 'react';
import ReactDOM from 'react-dom';
// コンポーネントを読み込み
import TodoList from './components/TodoList'
import TodoCreator from './components/TodoCreater'　//TODO：Creatorに変更する
// lodashライブラリを変数_に割り当てる（underscoreと同等のライブラリなので）
import _ from 'lodash';

// 中カッコ{}の中に任意の名前を入れるとfrom以下のjsの中身が入る
// import { TodoList } from './components/TodoList';
// 1つのjsファイルに複数クラスがある場合は、中カッコでインポートするクラスを指定する
// 今回の場合はTodoList.jsには1つのクラスしかないため、中カッコなしでもOK

// 別名のコンポート名をつける場合は中カッコの中でasを使う
// import { TodoList as ComponentName } from './components/TodoList';
// <ComponentName />で呼び出せる


// TodoAppコンポーネント（ToDoアプリ全体）
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
          text: 'sample todo1'
        },
        {
          id: this.createHashId(),
          text: 'sample todo2'
        }
      ]
    };
    this.callBackRemoveTask = this.callBackRemoveTask.bind(this);
    this.callBackAddTask = this.callBackAddTask.bind(this);
  }

  // ハッシュID生成用関数
  createHashId() {
    // 以下の方法では「完全に一意なキー」は生成できない（重複する場合がある）ので注意！
    // 【宿題】一意なキーにしたいなら外部ライブラリを使うか、このコンポーネントで...？？【課題】TODO！
    return Math.random().toString(36).slice(-16);
    // toString(36)で引数(0-9の10文字と、a-zの26文字)の値を基数変換
    // slice(-16)で末尾から16文字を抜き出す

    // cryptoモジュールを利用する方法
    // require("crypto").randomBytes(10).toString("base64");
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
    // 【宿題】新たにタスク追加する際にidを振る必要があるが、idを配列の順番号にしてしまうと
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

  render() {
    return (
      // JSXの書き方では何らかのタグで囲む必要があるためdivタグで囲む
      // タグを並列で並べただけだとシンタックスエラーになってコンパイルできない
      <div>
        <TodoCreator callBackAddTask={this.callBackAddTask} />

        <div className="searchBox">
          <i className="fa fa-search searchBox__icon" aria-hidden="true" />
          <input type="text" className="searchBox__input js-search"
            value="" placeholder="something keyword" />
        </div>

        <TodoList data={this.state.data} callBackRemoveTask={this.callBackRemoveTask} />

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


