import Vue from 'vue'

Vue.config.devtools = true

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
