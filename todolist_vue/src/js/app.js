import Vue from 'vue'
// ------------------------------------------------
// タスク登録コンポーネント
Vue.component('todo-creator', {
  props: {
    propsarr: Array
  },
  // props: ['propsarr'],
  data: function () {
    return {
      value: '',
      errMsg: ''
    }
  },
  template:
    `
    <div class="formArea">
      <div class="entryBox">
        <input type="text" class="entryBox__input" value="" ref="inputBox" v-model="value" placeholder="タスクを入力" @keydown.13="addTask">
        <i class="far fa-paper-plane entryBox__btn" @click="addTask" aria-hidden="true"></i>
      </div>
      <span class="formArea__is-error">{{ errMsg }}</span>
    </div>
  `,
  computed: {
    pushedArr: {
      // 子のcomputedの中で親のpropsを受け取り、変更を$emitで親に通知する
      // getter/setterを上書き
      get: function () {
        return this.propsarr
      },
      set: function (value) {
        this.$emit('input-propsarr', value)
      },
    },
  },
  methods: {
    createHashId: function () {
      return Math.random().toString(36).slice(-16);
      // 【TODO】完全に一意にする
    },
    saveKeyDown: function (e) {
      // keydownの場合、日本語入力中のEnterはkeyCode = 229、確定後は13
      this.keyDownCode = e.keyCode
      console.log('keyDown', this.keyDownCode)
    },
    checkKeyUp: function (e) {
      console.log('keyUp', e.keyCode)
      // Enterキーが押された時（日本語入力確定後）
      if (e.keyCode === 13 && e.keyCode === this.keyDownCode) {
        this.addTask(e)
      }
      this.isEdit = false
    },
    addTask: function (e) {
      // let text = e.currentTarget.value
      // let text = e.target.value
      // v-modelの値を取得
      let text = this.value
      console.log('addTask', text)
      if (!text) {
        console.log('err')
        this.errMsg = 'タスクを入力してください'
        return;
      } else {
        // computedの配列にオブジェクトを追加
        this.pushedArr.push({
          id: this.createHashId(),
          taskName: text,
          isDone: false,
          isMust: false,
          isShow: true,
        })
        this.value = ''
        this.errMsg = ''
        console.log('pushedArr', this.pushedArr)
      }
      // 入力フォームにフォーカスを戻す(ref="inputBox"のDOMにfocus)
      this.$refs.inputBox.focus();
    },
  },
})
// ------------------------------------------------
// タスク絞り込みコンポーネント
Vue.component('task-search', {
  // props: ['propsarr'],
  props: {
    propsarr: Array
  },
  data: function () {
    return {
      searchVal: '',
      // data内で最初の配列を保存
      originalArr: this.propsarr,
    }
  },
  template:
    `
    <div class="searchBox">
      <input type="text" class="searchBox__input" value="" placeholder="Search..." @keyup="searchTasks($event)">
      <i class="fas fa-search searchBox__icon" aria-hidden="true"></i>
    </div>
  `,
  computed: {
    resultArr: {
      // 子のcomputedの中で親のpropsを受け取り、変更を$emitで親に通知する
      // getter/setterを上書き
      get: function () {
        return this.propsarr
      },
      set: function (value) {
        this.$emit('update-propsarr', value)
      },
    },
  },
  methods: {
    filterTasks: function (elm) {
      // 第二引数の'i'は「大文字・小文字を区別しない」オプション
      const regexp = new RegExp('^(?=.*' + this.searchVal + ').*$', 'i')
      console.log('match()', elm.taskName.match(regexp))
      // 引数の各要素について、regexpとマッチするものだけ返す
      return (elm.taskName.match(regexp))
    },
    searchTasks: function (e) {
      this.searchVal = e.target.value
      console.log('this.searchVal', this.searchVal)
      if (this.searchVal) {
        // data内で最初の配列を保存
        console.log('this.originalArr', this.originalArr)
        console.log('this.propsArr', this.propsArr)
        // 配列の各要素について、filter()で絞り込んで新しい配列を生成
        this.resultArr = this.originalArr.filter(this.filterTasks)
        console.log('this.resultArr', this.resultArr)
      } else {
        // 検索ボックスの値が削除されたら元の配列を表示
        console.log('originalArr', this.originalArr)
        this.resultArr = this.originalArr
      }
    },
  }
})

// ------------------------------------------------
// タスク表示コンポーネント
// html側のタグ
// <task-item v-for="todo in todos" :key="todo.id" :value="todo" @toggle-done="todo = $event" @toggle-must="todo = $event" @change-task-name="todo = $event" @delete-task="todo = $event"></task-item>

Vue.component('task-item', {
  // props名は小文字のみOK
  // html側でもケバブチェーン不可
  // props: ['propsobj'],
  props: {
    propsobj: Object
  },
  data: function () {
    return {
      isEdit: false,
      keyDownCode: '',
    }
  },
  template:
    `
  <transition name="slide-fade">
  <li v-show="propsobj.isShow" :class="classTaskItem" class="todoList__item">
    <i :class="classCheckBox" @click="toggleDone" aria-hidden="true"></i>
    <span v-show="!isEdit" class="todoList__taskName"　@click="isEdit=true">{{ propsobj.taskName }}</span>
    <span v-show="isEdit" class="todoList__editArea" @mouseover="focusEdit">
      <input type="text" class="todoList__editBox" :value="propsobj.taskName" ref="editBox" @change="changeTaskName($event)" @keydown="saveKeyDown($event)" @keyup.enter="checkKeyUp($event)" @blur="changeTaskName($event)"></span>
    <i :class="classMustIcon" @click="toggleMust" aria-hidden="true" ></i>
    <i class="fas fa-trash-alt icon-trash" @click="deleteTask" aria-hidden="true"></i>
    </li>
    </transition>
  `,

  computed: {
    classTaskItem: function () {
      return {
        'todoList__item': true,
        'todoList__item--done': this.propsobj.isDone,
        'todoList__item--must': this.propsobj.isMust,
        // 'todoList__item--deleted': !this.propsobj.isShow,
      }
    },
    classCheckBox: function () {
      return {
        'far': true,
        'fa-check-square': this.propsobj.isDone,
        'fa-square': !this.propsobj.isDone,
        'icon-checkbox': true
      }
    },
    classMustIcon: function () {
      return {
        'fas': this.propsobj.isMust,
        'far': !this.propsobj.isMust,
        'fa-star': true,
        'icon-star': true
      }
    },
    localObj: {
      // 子のcomputedでgetter/setterを上書き
      // 親のpropsを受け取り、変更を$emitで通知する
      get: function () {
        return this.propsobj
      },
      set: function (value) {
        this.$emit('update-props', value)
      },
    },
  },
  methods: {
    // 子ではpropsを直接操作せず、computed(localObj)の値を変更する
    toggleDone: function () {
      this.localObj.isDone = !this.propsobj.isDone
    },
    toggleMust: function () {
      this.localObj.isMust = !this.propsobj.isMust
    },
    focusEdit: function () {
      this.isEdit = true
    },
    saveKeyDown: function (e) {
      // keydownの場合、日本語入力中のEnterはkeyCode = 229、確定後は13
      this.keyDownCode = e.keyCode
      console.log('keyDown', this.keyDownCode)
    },
    checkKeyUp: function (e) {
      console.log('keyUp', e.keyCode)
      // Enterキーが押された時（日本語入力確定後）
      if (e.keyCode === 13) {
        // if (e.keyCode === 13 && e.keyCode === this.keyDownCode) {
        this.changeTaskName(e)
      }
      this.isEdit = false
    },
    changeTaskName: function (e) {
      let text = e.currentTarget.value
      if (text) {
        this.localObj.taskName = text
        console.log('changeTask', text)
      }
      this.isEdit = false
    },
    deleteTask: function () {
      this.localObj.isShow = false
      console.log('削除する', this.localObj)
    },
  },
})

// ------------------------------------------------
new Vue({
  el: '#app',
  data: {
    menuFlg: '',
    todos: [
      {
        id: '0001',
        taskName: '未完了のタスク',
        isDone: false,
        isMust: false,
        isShow: true,
      },
      {
        id: '0002',
        taskName: '終わったタスク',
        isDone: true,
        isMust: false,
        isShow: true,
      },
      {
        id: '0003',
        taskName: '未完了の大事なタスク',
        isDone: false,
        isMust: true,
        isShow: true,
      },
      {
        id: '0004',
        taskName: '終わった大事なタスク',
        isDone: true,
        isMust: true,
        isShow: true,
      },
    ]
  },
  // computed: {
  //   menuType: function () {
  //     return this.menuFlg
  //   },
  // },

  methods: {
    toggleShow: function () {
      this.isShow = !this.isShow
    },
    // remove: function(index) {
    //   this.todos.splice(index, 1)
    // },

    changeAll: function () {
      this.menuFlg = ''
      console.log(this.menuFlg)
    },
    changeMust: function () {
      this.menuFlg = 'MUST'
      console.log(this.menuFlg)
    },
    changeSmall: function () {
      this.menuFlg = 'SMALL'
      console.log(this.menuFlg)
    },
  }

})
