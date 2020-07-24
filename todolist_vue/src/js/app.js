import Vue from 'vue'


// ------------------------------------------------
// タスク絞り込みコンポーネント
Vue.component('task-search', {
  props: {
    listprops: Array
  },
  data: function () {
    return {
      searchVal: '',
    }
  },
  template:
    `
    <div class="searchBox">
      <input type="text" class="searchBox__input" value="" v-model="searchVal" placeholder="Search..." @keyup="searchTasks">
      <i class="fas fa-search searchBox__icon" aria-hidden="true"></i>
    </div>
  `,
  methods: {
    filterTasks: function (elm) {
      // 第二引数の'i'は「大文字・小文字を区別しない」オプション
      const regexp = new RegExp('^(?=.*' + this.searchVal + ').*$', 'i')
      console.log('filterTasks', this.searchVal)
      console.log('elm', elm)
      console.log(elm.taskName.match(regexp))
    },
    searchTasks: function () {
      // console.log(this.searchVal)
      // console.log(this.listprops)
      return {
        todos: (this.searchVal) ? this.listprops.filter(this.filterTasks(this.listprops)) : this.listprops
      }
    },
  }

})

// ------------------------------------------------
// タスク登録コンポーネント
Vue.component('todo-creator', {
  props: {
    listprops: Array
  },
  // props: ['listprops'],
  data: function () {
    return {
      inputVal: '',
      errMsg: ''
    }
  },
  template:
    `
    <div class="formArea">
      <div class="entryBox">
        <input type="text" class="entryBox__input" value="" ref="inputBox" v-model="inputVal" placeholder="タスクを入力" @keydown.13="addTask">
        <i class="far fa-paper-plane entryBox__btn" @click="addTask" aria-hidden="true"></i>
      </div>
      <span class="formArea__is-error">{{ errMsg }}</span>
    </div>
  `,
  methods: {
    createHashId: function () {
      return Math.random().toString(36).slice(-16);
      // 【TODO】完全に一意にする
    },
    addTask: function () {
      // v-modelの値を取得
      let text = this.inputVal
      if (!text) {
        console.log('err')
        this.errMsg = 'タスクを入力してください'
      } else {
        this.listprops.push({
          id: this.createHashId(),
          taskName: text,
          isDone: false,
          isMust: false
        })
        this.inputVal = ''
        this.errMsg = ''
        console.log('listprops', this.listprops)
      }
      // 入力フォームにフォーカス(ref属性がinputBoxのDOM)
      this.$refs.inputBox.focus();
    }
  },
})

// ------------------------------------------------
// タスク表示コンポーネント
// html側から <task-item v-for="todo in todos" v-if="todo.isMust" :key="todo.id" :taskprops="todo"></task-item> で呼び出し
Vue.component('task-item', {
  props: {
    taskprops: Object
  },
  data: function () {
    return {
      isEdit: false,
    }
  },
  // keydownの場合、日本語入力中のEnterはkeyCode = 229、確定後は13
  template:
    `
  <li :class="classTaskItem" class="todoList__item">
    <i :class="classCheckBox" @click="toggleDone" aria-hidden="true"></i>

    <span v-show="!isEdit" class="todoList__taskName"　@click="isEdit=true">{{ taskprops.taskName }}</span>
    <span v-show="isEdit" class="todoList__editArea" @mouseover="focusEdit"><input type="text" class="todoList__editBox" :value="taskprops.taskName" ref="editBox" @change="changeTaskName($event)" @keydown.13="closeEdit($event)" @blur="closeEdit($event)"></span>

    <i :class="classMustIcon" @click="toggleMust" aria-hidden="true" ></i>
    <i class="fas fa-trash-alt icon-trash" @click="deleteTask(key)" aria-hidden="true"></i>
  </li>
  `,

  computed: {
    classTaskItem: function () {
      return {
        'todoList__item--done': this.taskprops.isDone,
        'todoList__item--must': this.taskprops.isMust,
      }
    },
    classCheckBox: function () {
      return {
        'far': true,
        'fa-check-square': this.taskprops.isDone,
        'fa-square': !this.taskprops.isDone,
        'icon-checkbox': true
      }
    },
    classMustIcon: function () {
      return {
        'fas': this.taskprops.isMust,
        'far': !this.taskprops.isMust,
        'fa-star': true,
        'icon-star': true
      }
    },
  },
  methods: {
    toggleDone: function () {
      this.taskprops.isDone = !this.taskprops.isDone
      console.log('this.taskprops.isDone', this.taskprops.isDone)
    },
    toggleMust: function () {
      this.taskprops.isMust = !this.taskprops.isMust
      console.log('this.taskprops.isMust', this.taskprops.isMust)
    },
    focusEdit: function () {
      this.isEdit = true
      this.$refs.editBox.focus();
    },
    closeEdit: function (e) {
      if (this.taskprops.taskName !== e.target.value) {
        this.changeTaskName(e)
      }
      this.isEdit = false
    },
    changeTaskName: function (e) {
      let text = e.target.value
      console.log('changeTask',text)
      if (text) {
        this.taskprops.taskName = text
      }
    },
    deleteTask: function (index) {
      console.log('削除する', index)
      console.log(this.taskprops)
      this.taskprops.splice(index)
    },
  },
})

// ------------------------------------------------
new Vue({
  el: '#apptodolist',
  data: {
    searchVal: '',
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
