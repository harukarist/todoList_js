// ライブラリを読み込み
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
// reduxのcreateStoreメソッド, react-reduxのProviderコンポーネントを
// 以下で使用するので、{}で囲ってimportする

// コンポーネントを呼び出し
import TodoApp from './components/ToDoApp'
//reducerを呼び出し
import rootReducer from './reducers'

// storeを生成
// createStore()に大元のreducerを渡して、変数storeに入れる
let store = createStore(rootReducer);

// ReactDOMを使ってrender()する
ReactDOM.render(
  // TodoAppでstoreのデータを使いたいので、react-reduxのProviderコンポーネントを作って
  // その中にTodoAppコンポーネントを入れる。

  // Provider配下のコンポーネントに、storeのメソッド
  // store={dispatch(), getState(), subscribe(), ・・・} がpropsとして渡されるので
  // 配下のコンポーネントで使えるようになる。
  // ※reduxの共通メソッドも、reducersの中で作ったメソッドも全て渡される

  // react-reduxライブラリのProviderコンポーネント<Provider>を使って
  // propsとして{store}が渡され、TodoAppの中でstoreが使えるようになる
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  // 
  document.getElementById('app')
  // index.html内の、<div id="app">の中に描画する
);

