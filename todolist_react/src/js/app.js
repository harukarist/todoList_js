// ライブラリを読み込み
import React from 'react'
import ReactDOM from 'react-dom'
// reduxのcreateStoreメソッド, react-reduxのProviderコンポーネントを
// 以下で使用するので、{}で囲ってimportする
import { createStore } from 'redux'
import { Provider } from 'react-redux'

// コンポーネントを呼び出し
import TodoApp from './components/ToDoApp'
//reducerを呼び出し
import rootReducer from './reducers'

// storeを生成
// createStore()に大元のreducerを渡して、変数storeに入れる
let store = createStore(rootReducer);

// ReactDOMを使ってrender()する
ReactDOM.render(
  // TodoAppでstoreのデータを使いたいので、react-reduxの Providerコンポーネント を作って
  // Providerタグの中にTodoAppコンポーネントを入れ、propsとしてstoreを渡す。

  <Provider store={store}>
    <TodoApp />
  </Provider>,

  document.getElementById('app') // index.html内の、<div id="app">の中に描画する
);

  // Provider配下のコンポーネントに、storeのメソッド
  // store={dispatch(), getState(), subscribe(), ・・・} がpropsとして渡されるので
  // 配下のコンポーネントで使えるようになる。
  // ※reduxの共通メソッド、reducersの中で作ったメソッドも全て渡される

