

import Vue from 'vue'

// ------------------------------------------------
// localStorage
var STORAGE_KEY = 'todos-vuejs'
var todoStorage = {
  fetch: function () {
    // ローカルストレージからデータを取得
    // JSON.parse()でJSON形式から配列に変換
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
    // ローカルストレージにデータ保存
    // JSON.stringify()でJSON形式に変換
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// ------------------------------------------------
// タスク登録コンポーネント
Vue.component('todo-creator', {
  props: {
    propsarr: Array
  },
  // 肩を指定しない場合は props: ['propsarr']
  data: function () {
    return {
      newTask: '',
      errMsg: ''
    }
  },
  template:
    `
    <div class="formArea">
      <div class="entryBox">
        <input type="text" class="entryBox__input" value="" ref="inputBox" v-model="newTask" placeholder="タスクを入力" @keydown.13="addTask">
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
      set: function (newTask) {
        this.$emit('input-propsarr', newTask)
      },
    },
  },
  methods: {
    // createHashId: function () {
    //   return Math.random().toString(36).slice(-16);
    // },
    saveKeyDown: function (e) {
      // keydownの場合、日本語入力中のEnterはkeyCode = 229、確定後は13
      this.keyDownCode = e.keyCode
    },
    checkKeyUp: function (e) {
      // Enterキーが押された時（日本語入力確定後）
      if (e.keyCode === 13 && e.keyCode === this.keyDownCode) {
        this.addTask(e)
      }
      this.isEdit = false
    },
    addTask: function () {
      // v-modelの値を取得
      let text = this.newTask
      if (!text) {
        this.errMsg = 'タスクを入力してください'
        return;
      } else {
        // computedの配列にオブジェクトを追加
        this.pushedArr.push({
          id: todoStorage.uid++,
          taskName: text,
          isDone: false,
          isMust: false,
          isSmall: false,
          isRemoved: false,
          isShow: true,
        })
        this.newTask = ''
        this.errMsg = ''
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
    <transition name="slide-list">
    <div class="searchBox__wrapper">
      <i :class="classSearchIcon" aria-hidden="true" @click="toggleShow"></i>
      <div class="searchBox" v-show="isShow">
        <input type="text" v-model="searchVal" class="searchBox__input" placeholder="Search..." @keyup="searchTasks($event)">
        <i v-show="this.searchVal" class="fas fa-times" @click="clearVal"></i>
      </div>
    </div>
    </transition>
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
    classSearchIcon: function () {
      return {
        'fas fa-search searchBox__icon': true,
        'active': this.isShow
      }
    },
  },
  methods: {
    toggleShow: function () {
      if (this.isShow) {
        this.searchVal = ''
        this.searchTasks()
      }
      this.isShow = !this.isShow
    },


    filterTasks: function (elm) {
      // 第二引数の'i'は「大文字・小文字を区別しない」オプション
      const regexp = new RegExp('^(?=.*' + this.searchVal + ').*$', 'i')
      // 引数の各要素について、regexpとマッチするものだけ返す
      return (elm.taskName.match(regexp))
    },
    searchTasks: function () {
      if (this.searchVal) {
        // data内で保存した最初の配列originalArrの各要素について、filter()で絞り込んで新しい配列を生成
        this.resultArr = this.originalArr.filter(this.filterTasks)
        this.$emit('on-search-flg')
      } else {
        // 検索ボックスの値が削除されたら元の配列を表示
        this.resultArr = this.originalArr
        this.$emit('off-search-flg')
      }
    },
    clearVal: function () {
      this.searchVal = ''
      this.searchTasks()
    }
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
    `
    <li :class="classTaskItem" @mouseover="isShowIcon=true" @mouseleave="isShowIcon=false">

    <i :class="classCheckBox" class="todoList__icon" @click="toggleDone" aria-hidden="true"></i>

    <span v-show="!isEdit" class="todoList__taskNa"　@click="isEdit=true">
    {{ propsobj.taskName }}
    </span>

    <span v-show="isEdit" class="todoList__editArea">
      <input type="text" class="todoList__editBox" :value="propsobj.taskName" ref="editBox" @change="changeTaskName($event)" @keydown="saveKeyDown($event)" @keyup.enter="checkKeyUp($event)" @blur="changeTaskName($event)">
    </span>

    <span>
      <i v-show="isShowIcon || propsobj.isMust" :class="classMustIcon" class="todoList__icon" @click="toggleMust" aria-hidden="true" ></i>
      <i v-show="isShowIcon || propsobj.isSmall" :class="classSmallIcon" class="todoList__icon"  @click="toggleSmall" aria-hidden="true" ></i>
      <i v-show="isShowIcon || propsobj.isRemoved" :class="classTrashIcon" class="todoList__icon" @click="toggleRemove" aria-hidden="true"></i>
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
      }
    },
    classMustIcon: function () {
      return {
        'fas true': this.propsobj.isMust,
        'far false': !this.propsobj.isMust,
        'fa-star': true,
        'icon-star': true,
      }
    },
    classSmallIcon: function () {
      return {
        'fas': true,
        'fa-stopwatch': true,
        'icon-stopwatch': true,
        'true': this.propsobj.isSmall,
        'false': !this.propsobj.isSmall,
      }
    },
    classTrashIcon: function () {
      return {
        'fas fa-trash-alt icon-trash': true,
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
    },
    checkKeyUp: function (e) {
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
    menuFlg: 'ALL',
    showDone: false,
    showTrash: false,
    isSearch: false,
    todos: todoStorage.fetch(),
    doneMessages: [
      'おつかれさま！',
      'よくやった！',
      '最高！',
      'この調子！',
      'いいね！',
      'Good job！',
    ]
  },
  computed: {
    classMenuAll: function () {
      if (this.menuFlg === 'ALL') {
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
      return this.todos.filter(todo => (todo.isMust && !todo.isDone && !todo.isRemoved))
    },
    todosSmall: function () {
      return this.todos.filter(todo => (todo.isSmall && !todo.isDone && !todo.isRemoved))
    },
    todosAll: function () {
      return this.todos.filter(todo => (!todo.isDone && !todo.isRemoved))
    },
    todosDone: function () {
      return this.todos.filter(todo => (todo.isDone && !todo.isRemoved))
    },
    todosTrash: function () {
      return this.todos.filter(todo => todo.isRemoved)
    },
  },

  methods: {
    showAll: function () {
      this.menuFlg = 'ALL'
    },
    showMust: function () {
      this.menuFlg = 'MUST'
    },
    showSmall: function () {
      this.menuFlg = 'SMALL'
    },
    toggleTrash: function () {
      this.showTrash = !this.showTrash
    },
    toggleDone: function () {
      this.showDone = !this.showDone
    },
    showDoneMessage: function () {
      let num = Math.floor(Math.random() * this.doneMessages.length)
      return this.doneMessages[num]
    },
    onSearch: function () {
      this.isSearch = true
    },
    offSearch: function () {
      this.isSearch = false
    }

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
