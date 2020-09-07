// --------------------------------------
// タスクのreducer
import _ from 'lodash'; //lodashでタスク削除

// stateに渡す初期値を指定
const initialState = {
  todos: [
    {
      id: '0001',
      taskName: '未完了のタスク',
      isDone: false,
      isMust: false
    },
    {
      id: '0002',
      taskName: '終わったタスク',
      isDone: true,
      isMust: false
    },
    {
      id: '0003',
      taskName: '未完了の大事なタスク',
      isDone: false,
      isMust: true
    },
    {
      id: '0004',
      taskName: '終わった大事なタスク',
      isDone: true,
      isMust: true
    },
  ],
  searchText: ''
};

// reducerでactionから値を受け取り、typeを判別してstateに適用し、storeへ渡す
// returnで返却するstateとstoreの元のstateに差分があれば更新（componentで再描画される）
// reducer名 ＝ state名

export default function task(state = initialState, action) {
  // 引数stateの初期値として上記で作成したinitialStateを指定し、第二引数でactionを受け取る
  // storeに保管されている直前のデータがstateに入っているため、以下の処理で最新のデータを追加

  // actionから渡されたtypeの種類によって処理を分岐
  switch (action.type) {
    case 'ADD':
      return {
        todos: [
          // オブジェクトの配列を展開して個々の要素の値を変更
          ...state.todos,
          {
            id: action.id, //actionで定義したid
            taskName: action.taskName, //actionで定義したtaskName
            isDone: false,
            isMust: false
          }
        ]
      };

    case 'DELETE':
      // Object.assign()で空オブジェクトに元のstate,データ削除後のtodosをマージ
      // stateに差分がないと更新されないため、空のオブジェクト{}にマージして新しいオブジェクトを生成する
      return Object.assign({}, state, {
        todos: _.reject(state.todos, { 'id': action.id })
        // lodashのreject()で、actionから渡されたidの要素をstate.todosから除く
      });

    case 'UPDATE':
      return Object.assign({}, state, {
        todos: state.todos.map((todo) => {
          // map()にアロー関数を渡し、個々のtodoのidとactionから受け取ったidが同じかを判定
          // idが同じならtaskNameを書き換えて、元のtodo、空オブジェクトとマージ
          if (todo.id === action.id) {
            return Object.assign({}, todo, {
              taskName: action.taskName
            })
          }
          // idが異なる場合はtodoをそのまま返す
          return todo
        })
      });

    case 'TOGGLE_DONE':
      return Object.assign({}, state, {
        todos: state.todos.map((todo) => {
          if (todo.id === action.id) {
            // idが同じならtodoのisDoneを反転してマージ
            return Object.assign({}, todo, {
              isDone: !todo.isDone
            })
          }
          return todo
        })
      });

    case 'TOGGLE_MUST':
      return Object.assign({}, state, {
        todos: state.todos.map((todo) => {
          if (todo.id === action.id) {
            // idが同じならtodoのisMustを反転してマージ
            return Object.assign({}, todo, {
              isMust: !todo.isMust
            })
          }
          return todo
        })
      });

    case 'SEARCH':
      // searchTextを書き換えて、元のstate、空オブジェクトとマージ
      return Object.assign({}, state, { 'searchText': action.searchText });

    default:
      return state;
  }
}
