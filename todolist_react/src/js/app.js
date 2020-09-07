import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux' //reduxのcreateStoreメソッド
import { Provider } from 'react-redux' //react-reduxのProviderコンポーネント
import TodoApp from './components/ToDoApp' //アプリの親コンポーネント
import rootReducer from './reducers' //reducer

// storeを生成
// createStore()に大元のreducerを渡して、変数storeに入れる
let store = createStore(rootReducer);

// react要素をコンテナのDOMにレンダリング
ReactDOM.render(
  // react-reduxのProviderコンポーネントの配下にアプリのコンポーネントを入れ、
  // propsとしてstoreを渡すことで、配下のコンポーネントでもstoreのデータやメソッドが使える。
  // reduxの共通メソッド、reducers内で作ったメソッドも全て渡される。
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById('app') // index.htmlのid="app"に描画
);

