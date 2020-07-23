// Vueを読み込む
import Vue from 'vue'
Vue.config.devtools = true
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


// v-if,v-else-if,v-else
new Vue({
  el: '#app1',
  data: {
    isShow: 'a'
  }
})

// v-showとv-ifの違い
// v-show による要素は常に描画されて DOM に維持する。
// v-show はシンプルに要素の display CSS プロパティを切り替える。
new Vue({
  el: '#app2',
  data: {
    isShow: true
  }
})

// 算出プロパティ「computed」はdataの変更を監視して、自動で実行される。
// 監視しているdataに変更があれば、再度returnする。
// returnされた結果が常にキャッシュされていて、this.isShowが変更されていない限り、何度呼び出しても前の結果が返ってくる。
// 監視するdataがない場合は最初にキャッシュされた値がそのまま使われる。

// methodsは毎回実行の度に再計算される（再描画の度にfunctionが実行される）

// dataの中身を整形する時などに computed を使う。
// dataの中身を使わない時は methods を使う。

new Vue({
  el: '#app3',
  data: {
    isShow: true
  },
  computed: {
    showString: function () {
      return (this.isShow) ? Date.now() : 'isShowはfalseです'
    },
    showString2() {
      return Date.now()
    }
    // どちらも同じ書き方。下の方がGood!
    // showString: function () {}
    // showString() {
  },

  methods: {
    showStringMethods() {
      return (this.isShow) ? Date.now() : 'isShowはfalseです'
    },
    showStringMethods2() {
      return Date.now()
    }
  }
})

// v-htmlでサニタイズを無効化
// Vue.jsでは自動でタグをサニタイズする
new Vue({
  el: '#app4',
  data: {
    script: '<p style="color:red">タグとして表示されます</p>'
  }
})


// トランジションとアニメーション
new Vue({
  el: '#app6',
  data: {
    show: true
  }
})

// コンポーネントの使い方
Vue.component('button-counter', {
  // コンポーネントで使う場合のdataは必ず関数にすること！通常のオブジェクト形式だと全コンポーネントでdataが共有されてしまう
  data: function () {
    return {
      count: 0
    }
  },
  // v-on:click でクリックイベント
  // クリックしたときにcountの数値を1ふやす
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
new Vue({ el: '#app7' })

// propsの使い方
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
new Vue({ el: '#app8' })

// イベントとメッセージを親コンポーネントに渡す方法
Vue.component('blog-post', {
  props: ['post'],
  // ヒアドキュメント（改行しても1つのデータとしてtemplateに登録できる）
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      // $emit()でカスタムイベント'enlarge-text'を作って親に通知する（メッセージを渡す）
      <button v-on:click="$emit('enlarge-text')">
        Enlarge text
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
new Vue({
  el: '#app9',
  data: {
    posts: [
      {
        id: 1,
        title: 'sample post1',
        content: '<p>サンプル投稿のコンテント</p>'
      },
      {
        id: 2,
        title: 'sample post2',
        content: '<p>サンプル投稿のコンテント</p>'
      },
      {
        id: 3,
        title: 'sample post3',
        content: '<p>サンプル投稿のコンテント</p>'
      }
    ],
    postFontSize: 1
  },
  methods: {
    fontSizeScale() {
      // 0.1ずつインクリメント
      this.postFontSize += 0.1;
    }
  }
})
