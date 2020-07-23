import Vue from 'vue'

// イベントとメッセージを親コンポーネントに渡す
Vue.component('listcomp', {
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
