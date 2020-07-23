import Vue from 'vue'
// import TaskList from './TaskList'

Vue.config.devtools = true

// イベントとメッセージを親コンポーネントに渡す
Vue.component('taskcomp', {
  props: ['taskprops'],
  data: function () {
    return {
      taskName: this.taskprops.taskName,
      isDone: this.taskprops.isDone,
      isMust: this.taskprops.isMust,
    }
  },

  // ヒアドキュメント（改行しても1つのデータとしてtemplateに登録できる）
  template:
    `<li :class="classTaskItem">
    <!-- チェックボックス -->
    <i @click="toggleDone" :class="classCheckBox" aria-hidden="true"></i>
    <!-- タスク名表示 -->
    <span v-show="!isEdit" @click="showEditBox" class="todoList__taskName">{{ taskName }}</span>
    <input v-show="isEdit" type="text" class="todoList__editBox" :value="taskName" @change="changeName" @keydown.enter="keyDownCloseEditBox" @blur="blurCloseEditBox">
    <!-- スターアイコン -->
    <i :class="classMustIcon" @click="toggleMust" aria-hidden="true"></i>
    <!-- ゴミ箱アイコン -->
    <i class="fas fa-trash-alt icon-trash" @click="deleteTask" aria-hidden="true"></i>
  </li>`,

  computed: {
    classTaskItem: function () {
      return {
        'todoList__item': true,
        'todoList__item--done': this.isDone,
        'todoList__item--must': this.isMust,
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
    // toggleDone() {
    toggleDone: function () {
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
  },
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
        isMust: false,
      },
      {
        id: '0002',
        taskName: '終わったタスク',
        isDone: true,
        isMust: false,
      },
      {
        id: '0003',
        taskName: '未完了の大事なタスク',
        isDone: false,
        isMust: true,
      },
      {
        id: '0004',
        taskName: '終わった大事なタスク',
        isDone: true,
        isMust: true,
      },
    ]
  },

})

// -------------------------------------------------
// タスク1件のサンプル
new Vue({
  el: '#todo-list',
  data: {
    isEdit: false,
    todo: {
      id: '0001',
      taskName: 'タスク1',
      isDone: false,
      isMust: false
    }
    // todos: [
    //   {
    //     id: '0001',
    //     taskName: '未完了のタスク',
    //     isDone: false,
    //     isMust: false
    //   },
    //   {
    //     id: '0002',
    //     taskName: '終わったタスク',
    //     isDone: true,
    //     isMust: false
    //   },
    //   {
    //     id: '0003',
    //     taskName: '未完了の大事なタスク',
    //     isDone: false,
    //     isMust: true
    //   },
    //   {
    //     id: '0004',
    //     taskName: '終わった大事なタスク',
    //     isDone: true,
    //     isMust: true
    //   },
    // ],
  },
  computed: {
    classTaskItem: function () {
      return {
        'todoList__item': true,
        'todoList__item--done': this.todo.isDone,
        'todoList__item--must': this.todo.isMust
      }
    },
    classCheckBox: function () {
      return {
        'far': true,
        'fa-square': !this.todo.isDone,
        'fa-check-square': this.todo.isDone,
        'icon-checkbox': true
      }
    },
    classMustIcon: function () {
      return {
        'fas': this.todo.isMust,
        'far': !this.todo.isMust,
        'fa-star': true,
        'icon-star': true
      }
    },
  },
  methods: {
    toggleDone: function () {
      this.todo.isDone = !this.todo.isDone
    },
    toggleMust: function () {
      this.todo.isMust = !this.todo.isMust
    },
    showEditBox: function () {
      this.isEdit = true
    },
    blurCloseEditBox: function (e) {
      this.todo.taskName = e.currentTarget.value;
      this.isEdit = false
    },
    keyDownCloseEditBox: function (e) {
      // keydown.enterは日本語入力中のEnterの場合、keyCode = 229となる
      if (e.keyCode !== 13) return;
      this.todo.taskName = e.currentTarget.value;
      this.isEdit = false
    },
    changeName: function (e) {
      this.todo.taskName = e.target.value
    },

    deleteTask: function () {
      // todos: _.reject(state.todos, { 'id': action.id })
    },
    updateTask: function () {
      // todos: state.this.todo.map((todo) => {
      //   // state.todosはコレクション（配列）なのでmap()が使える。
      //   // map()にはfunctionが渡せるので、アロー関数でtodosに入っている配列文を実行してループ。
      //   if (this.todo.id === action.id) {
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
