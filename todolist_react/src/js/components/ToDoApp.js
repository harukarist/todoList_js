import React from 'react';
// コンポーネントを読み込み
import VisibleTodoList from '../containers/VisibleTodoList';
import TodoCreator from '../components/TodoCreater';
import Search from '../components/Search';

// VisibleTodoListもコンポーネントだが、役割が少し違う（stateのデータを加工する）ので、コンテナ扱い
// componentsフォルダではなく containersフォルダに入れる

// TodoAppコンポーネント
class TodoApp extends React.Component {
  constructor(props) {
    // 大元のReactのコンストラクタにpropsを渡す
    super(props);
  }

  // renderで描画
  render() {
    return (
      // JSXで書く場合は、必ず1つのタグで囲む
      // コンポーネントを3つrender
      <div>
        <TodoCreator />
        <Search />
        <VisibleTodoList />
      </div>
    );
  }
}

// export default で TodoAppクラスを外に渡す
export default TodoApp

