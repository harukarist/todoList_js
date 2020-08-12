

import Vue from 'vue'


var STORAGE_KEY = 'todos-vuejs'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}



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
          isSmall: false,
          isRemoved: false,
          isShow: true,
        })
        this.value = ''
        this.errMsg = ''
        console.log('pushedArr', this.pushedArr)
        // 親コンポーネントに通知
        this.$emit('show-all')
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
      isShow: false,
      searchVal: '',
      // data内で最初の配列を保存
      originalArr: this.propsarr,
    }
  },
  template:
    `
    <div class="searchBox__wrapper">
      <div class="searchBox" v-if="isShow">
        <input type="text" class="searchBox__input" value="" placeholder="Search..." @keyup="searchTasks($event)">
      </div>

      <i class="fas fa-search searchBox__icon" aria-hidden="true" @mouseover="ShowElement"></i>
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
    ShowElement: function () {
      this.isShow = true
    },
    HideElement: function () {
      this.isShow = false
    },
    toggleShow: function () {
      this.isShow = !this.isShow
    },

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
      isShowIcon: false,
      keyDownCode: '',
    }
  },
  template:
    // <i v-show="propsobj.isMust" :class="classMustIcon" class="icon-mark" aria-hidden="true"></i>
    // <i v-show="propsobj.isSmall" :class="classSmallIcon" class="icon-mark" aria-hidden="true"></i>
    `
    <li :class="classTaskItem" @mouseover="isShowIcon=true" @mouseleave="isShowIcon=false">
    <i :class="classCheckBox" @click="toggleDone" aria-hidden="true"></i>

    <span v-show="!isEdit" class="todoList__taskName"　@click="isEdit=true">{{ propsobj.taskName }}</span>
    <span v-show="isEdit" class="todoList__editArea">
      <input type="text" class="todoList__editBox" :value="propsobj.taskName" ref="editBox" @change="changeTaskName($event)" @keydown="saveKeyDown($event)" @keyup.enter="checkKeyUp($event)" @blur="changeTaskName($event)"></span>
    <span>
      <i v-show="isShowIcon || propsobj.isMust" :class="classMustIcon" class="todoList__icon" @click="toggleMust" aria-hidden="true" ></i>
      <i v-show="isShowIcon || propsobj.isSmall" :class="classSmallIcon" class="todoList__icon"  @click="toggleSmall" aria-hidden="true" ></i>
      <i v-show="isShowIcon" :class="classTrashIcon" class="todoList__icon"  @click="toggleRemove" aria-hidden="true"></i>
      </li>
    </span>
  `,

  computed: {
    classTaskItem: function () {
      return {
        'todoList__item': true,
        'todoList__item--done': this.propsobj.isDone,
        'todoList__item--must': this.propsobj.isMust,
        'todoList__item--small': this.propsobj.isSmall,
      }
    },
    classCheckBox: function () {
      return {
        'far': true,
        'fa-check-square': this.propsobj.isDone,
        'fa-square': !this.propsobj.isDone,
        'icon-checkbox': true,
        // 'todoList__icon': true
      }
    },
    classMustIcon: function () {
      return {
        'fas true': this.propsobj.isMust,
        'far false': !this.propsobj.isMust,
        'fa-star': true,
        'icon-star': true,
        // 'todoList__icon': true
      }
    },
    classSmallIcon: function () {
      return {
        'fas': true,
        'fa-stopwatch': true,
        'icon-stopwatch': true,
        // 'todoList__icon': true,
        'true': this.propsobj.isSmall,
        'false': !this.propsobj.isSmall,
      }
    },
    classTrashIcon: function () {
      return {
        'fas fa-trash-alt icon-trash': true,
        // 'todoList__icon': true,
        'true': this.propsobj.isRemoved,
        'false': !this.propsobj.isRemoved,
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
    toggleSmall: function () {
      this.localObj.isSmall = !this.propsobj.isSmall
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
    toggleRemove: function () {
      this.localObj.isRemoved = !this.propsobj.isRemoved
    },
  },
})

// ------------------------------------------------
new Vue({
  el: '#app',
  data: {
    menuFlg: '',
    onlyWillDo: true,
    todos: [
      {
        id: '0001',
        taskName: '未完了のタスク',
        isDone: false,
        isMust: false,
        isSmall: false,
        isRemoved: false,
        isShow: true,
      },
      {
        id: '0002',
        taskName: '終わったタスク',
        isDone: true,
        isMust: false,
        isSmall: false,
        isRemoved: false,
        isShow: true,
      },
      {
        id: '0003',
        taskName: '未完了の大事なタスク',
        isDone: false,
        isMust: true,
        isSmall: false,
        isRemoved: false,
        isShow: true,
      },
      {
        id: '0004',
        taskName: '終わった大事なタスク',
        isDone: true,
        isMust: true,
        isSmall: false,
        isRemoved: false,
        isShow: true,
      },
    ]
  },
  computed: {
    classMenuAll: function () {
      if (this.menuFlg === '') {
        return 'active'
      }
    },
    classMenuMust: function () {
      if (this.menuFlg === 'MUST') {
        return 'active'
      }
    },
    classMenuSmall: function () {
      if (this.menuFlg === 'SMALL') {
        return 'active'
      }
    },
    todosMust: function () {
      if (this.onlyWillDo) {
        return this.todos.filter(todo => (todo.isMust && !todo.isDone && !todo.isRemoved))
      } else {
        return this.todos.filter(todo => (todo.isMust && !todo.isRemoved))
      }
    },
    todosSmall: function () {
      if (this.onlyWillDo) {
        return this.todos.filter(todo => (todo.isSmall && !todo.isDone && !todo.isRemoved))
      } else {
        return this.todos.filter(todo => (todo.isSmall && !todo.isRemoved))
      }
    },
    todosAll: function () {
      if (this.onlyWillDo) {
        return this.todos.filter(todo => (!todo.isDone && !todo.isRemoved))
      } else {
        return this.todos.filter(todo => (!todo.isRemoved))
      }
    },
    todosTrash: function () {
      if (this.onlyWillDo) {
        return this.todos.filter(todo => (!todo.isDone && todo.isRemoved))
      } else {
        return this.todos.filter(todo => (todo.isRemoved))
      }
    },
  },

  methods: {
    toggleShow: function () {
      this.isShow = !this.isShow
    },
    showAll: function () {
      this.menuFlg = ''
    },
    showMust: function () {
      this.menuFlg = 'MUST'
    },
    showSmall: function () {
      this.menuFlg = 'SMALL'
    },
    showDone: function () {
      this.onlyWillDo = false
    },
    hideDone: function () {
      this.onlyWillDo = true
    },
    showTrash: function () {
      this.menuFlg = 'TRASH'
    },
  },

  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  }
})
