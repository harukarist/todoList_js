// react-reduxのconnectメソッドを取り出し
import { connect } from 'react-redux'
// このcontainersで使うアクションを取り出し
import { toggleDone, deleteTask, updateTask } from '../actions'
// TodoListコンポーネントを読み込む
import TodoList from '../components/TodoList';


// stateのデータを加工する時は、コンポーネントが肥大化しないよう、コンテナを作って間に噛ませてあげる
// コンテナの中では一般的に
// mapStateToProps
// mapDispatchToProps　の2つが作られる
// 中身は変わらないのでconstで定義


// フィルター用の関数
const filterTodos = function (elm) {
  const regexp = new RegExp('^' + this.searchText, 'i');
  return (elm.text.match(regexp));
};


// 実際にフィルターする関数
const mapStateToProps = state => {
  // 自動的にstateが渡ってくるので受け取ってアロー関数で処理をする
  return {
    // filter()で検索ワードにマッチするtodosだけを返す
    // (state.reducer名.プロパティ)になるので注意！！
    todos: (state.task.searchText) ? state.task.todos.filter(filterTodos, state.task) : state.task.todos
  }
};

// ディスパッチするためのメソッドを定義
// propsに渡すdispatchを定義する
const mapDispatchToProps = dispatch => {
  // 自動的にdispatchが渡ってくるので受け取ってアロー関数で処理をする
  return {
    // オブジェクト型で
    // function名: プロパティ名 => {
    //   dispatch(アクション名(引数));
    // }
    onClickToggleDone: id => {
      dispatch(toggleDone(id));
    },
    onClickRemove: id => {
      dispatch(deleteTask(id));
    },
    onEnterUpdateTask: (id, text) => {
      dispatch(updateTask(id, text));
    }
    // TodoList.jsで取り出して使う

    // コンポーネントやコンテナではdispatch()を呼ぶだけで終わり
    // actionsで実際のアクションを定義し、reducersでstoreのstateを更新する
  }
};

// TodoListコンポーネントへdispatch()やstateを渡すため、
// connect()とマッピングをする

// ここではconnect()に state,action が入る
// connect(state, action)(コンポーネント名)
//  ※ stateを直接propsとして渡す場合は
//    connect(state => state)(コンポーネント名);
//    そのコンポーネントにstateを流し込むことができる
//    ＝そのコンポーネントのpropsでstateを直接使うことができる。
//    ここでのstateはstoreの中のデータのこと。コンポーネントの中のstateではない。

// TodoListコンポーネントに propsとして stateとactionを渡す
// 検索ワードにマッチするstateだけ渡したいので、mapStateToProps関数でフィルターしてから渡す
export default connect(mapStateToProps, mapDispatchToProps)(TodoList)
