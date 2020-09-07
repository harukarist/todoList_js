import { connect } from 'react-redux' // react-reduxのconnectメソッド
import { toggleDone, toggleMust, deleteTask, updateTask } from '../actions' // actionで定義したメソッド
import TodoList from '../components/TodoList'; // TodoListコンポーネント

// stateのデータを加工する際は、コンポーネントが肥大化しないよう、コンテナを作って行う。
// コンテナでは一般的に mapStateToProps、mapDispatchToProps の2つの変数を作る。

// 検索フィルタ用の関数
const filterTasks = function (elm) {
  // 第二引数の'i'は「大文字・小文字を区別しない」オプション
  const regexp = new RegExp('^(?=.*' + this.searchText + ').*$', 'i');
  return (elm.taskName.match(regexp));
};

// タスク絞り込み用のメソッド
const mapStateToProps = state => {
  // 自動的に渡ってくるstateをアロー関数で処理
  return {
    // 検索中の場合はfilter()で検索ワードにマッチするtodosだけを返し、そうでない場合はtodosをそのまま返す
    todos: (state.task.searchText) ? state.task.todos.filter(filterTasks, state.task) : state.task.todos
    // (state.reducer名.プロパティ)になるので注意！
  }
};

// ディスパッチ用のメソッド
// propsに渡すdispatchを定義する
const mapDispatchToProps = dispatch => {
  // 自動的に渡ってくるdispatchをアロー関数で処理
  return {
    // オブジェクト型で
    // function名: プロパティ名 => {
    //   dispatch(アクション名(引数));
    // }
    onClickToggleDone: id => {
      dispatch(toggleDone(id));
    },
    onClickToggleMust: id => {
      dispatch(toggleMust(id));
    },
    onClickRemove: id => {
      dispatch(deleteTask(id));
    },
    onEnterUpdateTask: (id, taskName) => {
      dispatch(updateTask(id, taskName));
    }
    // TodoListコンポーネントでこれらのメソッドを取り出して使う。
    // コンポーネントやコンテナではdispatch()を呼び出すのみ。
    // 実際のアクションはactionsで定義。
  }
};

// connect()で TodoListコンポーネントに Reduxのstateやdispatch()を渡す
export default connect(mapStateToProps, mapDispatchToProps)(TodoList)
// connect(state, action)(渡し先のコンポーネント名)
