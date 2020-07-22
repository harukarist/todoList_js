// Vueを読み込む
import Vue from 'vue'

//=======================================
// Vue.jsの特徴
//=======================================

// 1. ドキュメントが日本語で整理されていて見やすい
// 2. React.jsよりも高速
// 3. 双方向データバインディングで、書くコードが少なくなる
// 4. 細かなアニメーションにも対応

// Vueの基本の書き方
// newして使う
new Vue({ // Vueインスタンス生成
  el: '#app1', // elでスコープを指定（backboneと同じ）セレクタの形で指定
  data: { // dataの中にプロパティを定義しておけば、vueの中で保持して使いまわせる。今回はテンプレートに表示している。
    message: 'vueのテンプレートの構文。{{}}で囲って処理が書ける。'
    // elに指定したセレクタ'#app1'のスコープの中で、dataのプロパティmessageが使える。
  }
})

// v-bindを使った属性のバインド
// htmlタグの属性に値を渡す
// v-bindは:という省略記号で書ける
new Vue({
  el: '#app2',
  data: {
    message: 'このページをロードしたのは ' + new Date().toLocaleString(),
    classObject: {
      active: true,
      'text-danger': false
    }
  }
})

// v-ifで条件分岐、表示・非表示切り替え
new Vue({
  el: '#app3',
  data: {
    isShow: true
  }
})

// v-forでループして、要素を複数出力
new Vue({
  el: '#app4',
  data: {
    todos: [
      { text: 'v-forを使うと' },
      { text: 'こうやってデータやhtmlをループして' },
      { text: '生成できる' }
    ]
  }
})

// v-onを使ってユーザーからのイベントを発火させる
// v-onは@という省略記号で書ける
// < button v-on: click = "changeMessage" >
// < button @click="changeMessage" >
// Reactのイベントハンドラ onClick,onChange等と同じ
new Vue({
  el: '#app5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    changeMessage: function () {
      this.message = this.message + 'を変えちゃった！'
      // jQueryのように「書き換え先のDOMを取得する」「値を取得する」「DOMを書き換える」というコードを書く必要がなくなる！
    }
  }
})

// v-modelで双方向データバインディング
new Vue({
  el: '#app6',
  data: {
    message: 'これが、双方向データバインディング'
    // 入力された内容が自動でデータへ更新され、データが更新されると自動で出力内容も変わる。
  }
})
