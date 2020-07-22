/**
 * Taskのreducer
 * reducerは、「受けとったactionのtypeをもとに、storeに新しいstateを返す」だけのもの
 * reducerの中で下記のことはやってはダメ
 * ・引数のstate, actionインスタンスの値を変更するのはNG
 * ・副作用をおこす可能性のあるもの(AjaxでAPIを呼んだり、ルーティングを変えるなど,確実に実行されるかわからない事)はNG
 * ・毎回値が変わるもの(Date.now() や Math.random())を扱うのはNG
 */

//  lodashを読み込み
import _ from 'lodash';

// stateの初期値を設定
const initialState = {
  // storeの中で管理するデータ（コレクション形式）
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

// reducer
// actionから受け取った値を state に適用する
// returnで返却するstateと,Storeの元のstateに差分があれば、アップデートする
// ⇒componentで再描画される

// reducer名 ＝ stateの名前 になる
// function名はファイル名と同じにするのが通例

export default function task(state = initialState, action) {
  // 引数stateの初期値として、上記で作成した変数initialStateを指定
  // storeに保管されている直前のデータがstateに入っているので、
  // 以下の処理で最新のデータを追加する

  // 第二引数でactionを受け取る

  // actionから渡されたtypeの種類によって、switch文で処理を分ける
  switch (action.type) {
    case 'ADD':
      return {
        todos: [
          // オブジェクトの配列を展開して1つ1つの要素の値を変更する
          ...state.todos,
          {
            id: action.id, //actionで定義したidプロパティの値を取得
            taskName: action.taskName, //actionで定義したtaskNameプロパティの値を取得
            isDone: false,
            isMust: false
          }
        ]
      };

    case 'DELETE':
      // Object.assign()で新しいオブジェクトを生成
      // データをDeleteした後のtodosを、空オブジェクト・元のstateとマージ
      return Object.assign({}, state, {
        todos: _.reject(state.todos, { 'id': action.id })
        // lodashのメソッド _.reject()で、actionから渡されたidのものを
        // stateのtodosの中から見つけて除き、残ったデータをtodosに入れる。
      });

    case 'UPDATE':
      return Object.assign({}, state, {
        // todoをまとめたオブジェクトtodosを、stateと空オブジェクトとマージ
        todos: state.todos.map((todo) => {
          // state.todosはコレクション（配列）なのでmap()が使える。
          // map()にはfunctionが渡せるので、アロー関数でtodosに入っている配列文を実行してループ。
          if (todo.id === action.id) {
            // 自動的に個々のtodoのデータが入ってくるのでtodoのidとactionで受け取ったidが同じかを判定
            // IDが同じなら、差分ありと認識させるために新しいオブジェクトを生成する
            return Object.assign({}, todo, {
              taskName: action.taskName
              // taskNameを書き換えて、現在のtodoオブジェクトと空オブジェクトとマージする
              // →todoのtaskNameがaction.taskNameに上書きされる
            })
          }
          // idが同じでなければ何もせずtodoのデータをそのまま返す
          return todo
        })
      });

    case 'TOGGLE_DONE':
      return Object.assign({}, state, {
        todos: state.todos.map((todo) => {
          if (todo.id === action.id) {
            // idが同じならtodoのisDoneを反転して新しいオブジェクトを生成
            return Object.assign({}, todo, {
              isDone: !todo.isDone
            })
          }
          // idが同じでなければそのままtodoを返す
          return todo
        })
      });

    case 'TOGGLE_MUST':
      return Object.assign({}, state, {
        todos: state.todos.map((todo) => {
          if (todo.id === action.id) {
            // idが同じならtodoのisMustを反転して新しいオブジェクトを生成
            return Object.assign({}, todo, {
              isMust: !todo.isMust
            })
          }
          // idが同じでなければそのままtodoを返す
          return todo
        })
      });

    case 'SEARCH':
      return Object.assign({}, state, { 'searchText': action.searchText });
    // jsのObject.assign()を使ってオブジェクトをマージ（結合）する
    // stateに差分がないと更新されないため、空のオブジェクト{}, storeに入っているstate, 新しくactionから渡ってきたsearchTextをtodosの'searchText'に入れたもの を結合して新しいオブジェクトを生成する

    default:
      return state;
  }
}
