import Vue from 'vue'
Vue.config.devtools = true

// イベントとメッセージを親コンポーネントに渡す
Vue.component('task-component', {
  props: ['todo'],
  // ヒアドキュメント（改行しても1つのデータとしてtemplateに登録できる）
  template: `
  <li>
    <!-- チェックボックス -->
    <i @click="$emit('toggle-done')" :class="classCheckBox" aria-hidden="true"></i>
    <!-- タスク名表示 -->
    <span v-show="!isEdit" @click="showEditBox" class="todoList__taskName">{{ todo.taskName }}</span>
    <input v-show="isEdit" type="text" class="todoList__editBox" :value="todo.taskName" @change="changeName" @keydown.enter="keyDownCloseEditBox" @blur="blurCloseEditBox">
    <!-- スターアイコン -->
    <i :class="classMustIcon" @click="toggleMust" aria-hidden="true"></i>
    <!-- ゴミ箱アイコン -->
    <i class="fas fa-trash-alt icon-trash" @click="deleteTask" aria-hidden="true"></i>
  </li>
  `
})
new Vue({
  el: '#app9',
  data: {
    isEdit: false,
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
    ]
  },
  computed: {
    classTaskItem: function () {
      return {
        'todoList__item': true,
        'todoList__item--done': this.isDone,
        'todoList__item--must': this.isMust
      }
    },
    classCheckBox: function () {
      return {
        'far': true,
        'fa-square': !this.isDone,
        'fa-check-square': this.isDone,
        'icon-checkbox': true
      }
    },
    classMustIcon: function () {
      return {
        'fas': this.isMust,
        'far': !this.isMust,
        'fa-star': true,
        'icon-star': true
      }
    },
  },
  methods: {
    toggleDone() {
      this.isDone = !this.isDone;
    },

    toggleMust: function () {
      this.isMust = !this.isMust
    },
    showEditBox: function () {
      this.isEdit = true
    },
    blurCloseEditBox: function (e) {
      this.taskName = e.currentTarget.value;
      this.isEdit = false
    },
    keyDownCloseEditBox: function (e) {
      // keydown.enterは日本語入力中のEnterの場合、keyCode = 229となる
      if (e.keyCode !== 13) return;
      this.taskName = e.currentTarget.value;
      this.isEdit = false
    },
    changeName: function (e) {
      this.taskName = e.target.value
    },

    deleteTask: function () {
      // todos: _.reject(state.todos, { 'id': action.id })
    },
    updateTask: function () {
      // todos: state.todos.map((todo) => {
      //   // state.todosはコレクション（配列）なのでmap()が使える。
      //   // map()にはfunctionが渡せるので、アロー関数でtodosに入っている配列文を実行してループ。
      //   if (todo.id === action.id) {
      //     // 自動的に個々のtodoのデータが入ってくるのでtodoのidとactionで受け取ったidが同じかを判定
      //     // IDが同じなら、差分ありと認識させるために新しいオブジェクトを生成する
      //     return Object.assign({}, todo, {
      //       taskName: action.taskName
      //       // taskNameを書き換えて、現在のtodoオブジェクトと空オブジェクトとマージする
      //       // →todoのtaskNameがaction.taskNameに上書きされる
      //     })
      //   }
      //   // idが同じでなければ何もせずtodoのデータをそのまま返す
      //   return todo
    },

    addTask: function () {
    },
    searchTask: function () {
    },
  }
})

new Vue({
  el: '#todo-list',
  data: {
    isEdit: false,
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
    ]
  },
  computed: {
    classTaskItem: function () {
      return {
        'todoList__item': true,
        'todoList__item--done': this.isDone,
        'todoList__item--must': this.isMust
      }
    },
    classCheckBox: function () {
      return {
        'far': true,
        'fa-square': !this.isDone,
        'fa-check-square': this.isDone,
        'icon-checkbox': true
      }
    },
    classMustIcon: function () {
      return {
        'fas': this.isMust,
        'far': !this.isMust,
        'fa-star': true,
        'icon-star': true
      }
    },
  },
  methods: {
    toggleDone: function () {
      this.isDone = !this.isDone
    },
    toggleMust: function () {
      this.isMust = !this.isMust
    },
    showEditBox: function () {
      this.isEdit = true
    },
    blurCloseEditBox: function (e) {
      this.taskName = e.currentTarget.value;
      this.isEdit = false
    },
    keyDownCloseEditBox: function (e) {
      // keydown.enterは日本語入力中のEnterの場合、keyCode = 229となる
      if (e.keyCode !== 13) return;
      this.taskName = e.currentTarget.value;
      this.isEdit = false
    },
    changeName: function (e) {
      this.taskName = e.target.value
    },

    deleteTask: function () {
      // todos: _.reject(state.todos, { 'id': action.id })
    },
    updateTask: function () {
      // todos: state.todos.map((todo) => {
      //   // state.todosはコレクション（配列）なのでmap()が使える。
      //   // map()にはfunctionが渡せるので、アロー関数でtodosに入っている配列文を実行してループ。
      //   if (todo.id === action.id) {
      //     // 自動的に個々のtodoのデータが入ってくるのでtodoのidとactionで受け取ったidが同じかを判定
      //     // IDが同じなら、差分ありと認識させるために新しいオブジェクトを生成する
      //     return Object.assign({}, todo, {
      //       taskName: action.taskName
      //       // taskNameを書き換えて、現在のtodoオブジェクトと空オブジェクトとマージする
      //       // →todoのtaskNameがaction.taskNameに上書きされる
      //     })
      //   }
      //   // idが同じでなければ何もせずtodoのデータをそのまま返す
      //   return todo
    },

    addTask: function () {
    },
    searchTask: function () {
    },

  }
})


// // stateの初期値を設定
// const initialState = {
//   // storeの中で管理するデータ（コレクション形式）
//   todos: [
//     {
//       id: '0001',
//       taskName: '未完了のタスク',
//       isDone: false,
//       isMust: false
//     },
//     {
//       id: '0002',
//       taskName: '終わったタスク',
//       isDone: true,
//       isMust: false
//     },
//     {
//       id: '0003',
//       taskName: '未完了の大事なタスク',
//       isDone: false,
//       isMust: true
//     },
//     {
//       id: '0004',
//       taskName: '終わった大事なタスク',
//       isDone: true,
//       isMust: true
//     },
//   ],
//   searchText: ''
// };

// case 'ADD':
//   return {
//     todos: [
//       // オブジェクトの配列を展開して1つ1つの要素の値を変更する
//       ...state.todos,
//       {
//         id: action.id, //actionで定義したidプロパティの値を取得
//         taskName: action.taskName, //actionで定義したtaskNameプロパティの値を取得
//         isDone: false,
//         isMust: false
//       }
//     ]
//   };
