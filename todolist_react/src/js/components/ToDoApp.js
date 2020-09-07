import React from 'react';
import VisibleTodoList from '../containers/VisibleTodoList'; //stateのデータを加工するコンテナ
import TodoCreator from '../components/TodoCreater'; //タスク作成コンポーネント
import Search from '../components/Search'; //検索コンポーネント

// TodoAppコンポーネント
class TodoApp extends React.Component {
  // コンストラクタ
  constructor(props) {
    super(props); // Reactの大元のコンストラクタにpropsを渡す
  }

  render() {
    return (
      // JSXでは必ず1つのタグで囲む必要があるため、divタグでコンポーネントを囲む
      <div>
        <TodoCreator />
        <Search />
        <VisibleTodoList />
      </div>
    );
  }
}

// 自身のクラスを外部に渡す
export default TodoApp

