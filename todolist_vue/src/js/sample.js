import Vue from 'vue'

// サンプル
Vue.component('item', {
  // 子コンポーネント
  props: ['fruit'],
  template: `
      <li>
        <img :src="fruit.imgUrl">
        <div>{{ fruit.name }} = {{ subtotalCount }}個</div>
        <button @click="increase">増やす</button>
        <button @click="reduce">減らす</button>
      </li>
    `,
  data: function () {
    return {
      subtotalCount: 0
    };
  },
  methods: {
    // ボタンクリックで子のメソッドを呼び出し
    increase: function () {
      this.subtotalCount += 1;
      this.$emit('clicked-increase-button');
      // this.$emit('イベント名')でトリガを設定して、
      // html側のitemコンポーネントにイベント購読設定する

      // <item v-for="fruit in fruits" :fruit="fruit" @clicked-increase-button="incrementTotalCount"
      // @clicked-reduce-button="decrementTotalCount">
      // </item>
      // で、親コンポーネントのincrementTotalCountを呼び出し
    },
    reduce: function () {
      if (this.subtotalCount > 0) {
        this.subtotalCount -= 1;
        this.$emit('clicked-reduce-button');
      }
    },

  },
});

new Vue({
  el: '#sample',
  data: {
    totalCount: 0,
    fruits: [
      {
        name: 'RedApple',
        imgUrl: 'https://placehold.jp/18/c40000/ffffff/150x150.png?text=RedApple'
      },
      {
        name: 'GreenApple',
        imgUrl: 'https://placehold.jp/18/79cf2d/ffffff/150x150.png?text=GreenApple'
      },
    ],
  },
  methods: {
    incrementTotalCount: function () {
      this.totalCount += 1;
    },
    decrementTotalCount: function () {
      this.totalCount -= 1;
    },
  },
});

