import React from 'react';
import ReactDOM from 'react-dom';
// TodoListコンポーネントを読み込み
import { TodoList } from './components/TodoList';
// 別名のコンポート名をつける場合は中カッコの中でasを使う
// import { TodoList as ComponentName } from './components/TodoList';
// <ComponentName />で呼び出せる

// 中カッコ{}の中に任意の名前を入れるとfrom以下のjsの中身が入る
// 今回の場合はTodoList.jsには1つのクラスしかないため、中カッコなしでもOK
// 1つのjsファイルに複数クラスがある場合は、中カッコでインポートするクラスを指定する

// TodoAppコンポーネント（ToDoアプリ全体）
class TodoApp extends React.Component {
  render() {
    return (
      // JSXの書き方では何らかのタグで囲む必要がある
      // タグを並列で並べただけだとシンタックスエラーになってコンパイルできない
      <div>
        <form className="form">
          <div className="inputArea">
            <input type="text" className="inputText js-get-val" value="" placeholder="smothing todo task" />
            <span className="error js-toggle-error">入力が空です</span>
          </div>
        </form>

        <div className="searchBox">
          <i className="fa fa-search searchBox__icon" aria-hidden="true" />
          <input type="text" className="searchBox__input js-search"
            value="" placeholder="something keyword" />
        </div>


        <TodoList />

      </div>
    );
  }
}
// 上記TodoAppコンポーネントの中でTodoListコンポーネント<TodoList />を呼び出し
// import { TodoList } from './components/TodoList'; が呼び出される

ReactDOM.render(
  <TodoApp />,
  document.getElementById('app')
);
