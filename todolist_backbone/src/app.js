
//=============================================
// require
//=============================================
var Backbone = require('../node_modules/backbone/backbone');
var $ = require('../node_modules/jquery/dist/jquery');
var _ = require('../node_modules/underscore/underscore');

//=============================================
// Model
//=============================================
// タスクのモデル
var TaskModel = Backbone.Model.extend({
  defaults: {
    taskName: '',
    isDone: false,
    editMode: false,
    isShow: true,
    isMust: false,
    keyDownCode: ''
  }
});

// 入力フォームのモデル
var FormModel = Backbone.Model.extend({
  defaults: {
    formVal: '',
    hasError: false,
    errorMsg: '',
    keyDownCode: ''
  },

  // validateプロパティ
  validate: function (attrs) {
    // ビュー側のFormViewでmodel.set()するとvalidateが実行される
    console.log('FormModel validate');
    console.dir(attrs);

    // バリデーションチェック
    if (!attrs.formVal || attrs.formVal.length === 0) {
      console.log("入力なし");
      return "タスクを入力してください";
      // エラーフラグの切替、エラーメッセージの代入はビュー側で行う
    } else if (attrs.formVal.length > 20) {
      console.log("文字数エラー");
      return "タスクは20文字以内で入力してください";
    }
  }
});
// インスタンス生成
var FormModelInstance = new FormModel();

// 検索エリアのモデル
var SearchModel = Backbone.Model.extend({
  defaults: {
    searchVal: '',
  }
});
var SearchModelInstance = new SearchModel();


//=============================================
// Collection
//=============================================
// Taskのコレクション
var TaskCollection = Backbone.Collection.extend({
  model: TaskModel
});
// モデルをインスタンス化
var SampleTask1 = new TaskModel({ taskName: 'todo1' });
var SampleTask2 = new TaskModel({ taskName: 'todo2' });
var SampleTask3 = new TaskModel({ taskName: 'todo3 must', isMust: 'true' });
var SampleTask4 = new TaskModel({ taskName: 'todo4 must', isMust: 'true' });

// コレクションをインスタンス化（配列形式でインスタンス化したモデルを渡す）
var TaskCollectionInstance = new TaskCollection([SampleTask1, SampleTask2, SampleTask3, SampleTask4]);
// var TaskCollectionInstance = new TaskCollection();


//=============================================
// View
//=============================================

// タスクのビュー
var TaskView = Backbone.View.extend({
  //underscoreのtemplateメソッドでテンプレートを登録
  template: _.template($('#template-list-item').html()),
  // イベント定義
  events: {
    'click .js-toggle-done': 'toggleDone', //チェックボックスをクリックした時
    'click .js-click-to-remove': 'remove', //ゴミ箱アイコンをクリックした時
    'click .js-toggle-must': 'toggleMust', //スターアイコンをクリックした時
    'click .js-todoList-taskName': 'showEdit', //タスク名をクリックした時
    'blur .js-todoList-editName': 'closeEdit', //編集ボックスのフォーカスが外れた時
    'keydown .js-todoList-editName': 'saveKeyDown', //編集ボックスでkeydownした時
    'keyup .js-todoList-editName': 'checkKeyUp' //編集ボックスでkeyupした時
  },

  initialize: function () {
    console.log('TaskView initialize');
    // underscoreのbindAll()でthisを縛る
    _.bindAll(this, 'update', 'toggleDone', 'render', 'remove', 'toggleMust', 'showEdit', 'closeEdit', 'saveKeyDown', 'checkKeyUp');
    // オブザーバパターンでモデルのイベントを購読（イベントをセットしておき、そのイベントが発生するのを待つ）
    // モデルのデータが変わったら、renderメソッドを呼び出して画面に表示
    this.model.bind('change', this.render);
    // モデルが削除されたら、removeメソッドを呼び出し
    this.model.bind('destroy', this.remove);
  },
  update: function (text) {
    console.log('TaskView update');
    // 引数textを元にモデルのtaskNameプロパティを更新する
    this.model.set({ taskName: text });
    // change が発生し、this.render が呼ばれる
    // 最後にインスタンス化してインスタンス変数に入れた時にupdateメソッドが呼ばれる
  },
  toggleDone: function () {
    console.log('TaskView toggleDone');
    // isDoneの値を反転
    this.model.set({ isDone: !this.model.get('isDone') });
  },
  remove: function () {
    console.log('TaskView remove');
    // DOMを削除
    this.$el.remove();
    return this;
  },
  toggleMust: function () {
    console.log('TaskView toggleMust');
    // isMustの値を反転させて、リストインスタンスの末尾にモデルを追加
    this.model.set({ isMust: !this.model.get('isMust') });
    ListViewInstance.appendItem(this.model);
    // 元のデータは削除
    this.$el.remove();
  },
  showEdit: function () {
    console.log('TaskView showEdit');
    // editModeをTrueに
    this.model.set({ editMode: true });
  },
  closeEdit: function (e) {
    console.log('TaskView closeEdit');
    // this.model.setでモデルのtaskNameプロパティを変更
    this.model.set({ taskName: e.currentTarget.value, editMode: false });
  },
  saveKeyDown: function (e) {
    this.model.set({ keyDownCode: e.keyCode })
  },
  checkKeyUp: function (e) {
    console.log('TaskView checkKeyUp');
    // Enterキーが押された時（日本語入力確定後）
    if (e.keyCode === 13 && e.keyCode === this.model.get('keyDownCode')) {
      // モデルのtaskNameプロパティを変更
      this.model.set({ taskName: e.currentTarget.value, editMode: false });
    }
  },
  render: function () {
    // ログを出力
    console.log('TaskView render');
    console.log('model.attributes:', this.model.attributes);
    // テンプレートにモデルの属性を格納し、this.$elに.html()で書き換えて入れる
    var template = this.template(this.model.attributes);
    this.$el.html(template);
    // elプロパティを指定していないため、空のdivタグの中にテンプレートのliタグが作られる

    return this;
    // 呼び出し元でメソッドチェーンを利用するにはreturn thisで自分自身への参照を返す
  }
});


// ------------------------
// 親のビュー
var ListView = Backbone.View.extend({
  el: $('.js-todoList'), // ulを囲むdivエレメント
  collection: TaskCollectionInstance, // コレクションとビューを連携
  initialize: function () {
    console.log('ListView initialize');
    _.bindAll(this, 'render', 'addItem', 'appendItem', 'searchItem');
    // コレクションにモデルが追加されたらappendItemメソッドを呼び出し
    this.collection.bind('add', this.appendItem);
    // 初期表示時にrenderを呼び出し
    this.render();
  },
  // コレクションにタスクを追加
  addItem: function (text) {
    console.log('ListView addItem');
    // タスクの文字列を引数で受けとってモデルを作り、ビューに紐づいているコレクションにadd()で追加
    var TaskModelInstance = new TaskModel({ taskName: text });
    this.collection.add(TaskModelInstance);
    // initializeプロパティのaddイベントが発生し、this.appendItemメソッドでモデルと連携して個々のタスクのビューが生成される
  },
  // タスクのビューを追加
  appendItem: function (model) {
    console.log('ListView appendItem');
    console.log('model:', model);
    // タスクのビューインスタンスを生成（ビューとモデルの連携）
    var TaskViewInstance = new TaskView({ model: model });
    // インスタンスの要素をrender().elで取得して親要素this.$elのulタグにappend()でタスクを追加
    // 重要フラグの値によって、追加先のDOMを切り替え
    if (model.attributes.isMust) {
      this.$el.children('.js-todoList-must').append(TaskViewInstance.render().el);
    } else {
      this.$el.children('.js-todoList-normal').append(TaskViewInstance.render().el);
    }
  },
  // 検索結果を表示
  searchItem: function (searchText) {
    console.log('ListView searchItem');
    console.log('searchText', searchText);
    // コレクションに紐づいたモデルをeach()で1つ1つ呼び出し
    this.collection.each(function (model, i) {
      // モデルの属性からタスク名を取得
      var taskname = model.attributes.taskName;
      // 正規表現のオブジェクトを生成（部分一致）
      var regexp = new RegExp('^(?=.*' + searchText + ').*$');
      if (taskname && taskname.match(regexp)) {
        // 一致したら表示フラグをON
        model.set({ isShow: true });
      } else {
        // 一致しなかったら表示フラグをOFF
        model.set({ isShow: false });
      }
      return this;
    });
  },

  // renderメソッド
  render: function () {
    console.log('ListView render');
    // ビューのthisを変数thatに格納
    var that = this;
    this.collection.each(function (model, i) {
      that.appendItem(model);
      // 上記のappendItemメソッドにモデルを渡してインスタンスを生成し、その中のrenderメソッドで
      // タスクのテンプレートにデータが流し込まれ、親のulに追加される
    });
    return this;
  }
});

// 親のビューListViewをインスタンス化（コレクションとしてリストを渡す）
// 
var ListViewInstance = new ListView({ collection: TaskCollectionInstance });


// ------------------------
// 入力フォームのビュー
var FormView = Backbone.View.extend({
  el: $('.js-form'),
  template: _.template($('#template-form').html()),
  //モデルをビューに連携
  model: FormModelInstance,
  //イベント
  events: {
    'click .js-add-todo': 'addTodo', //追加ボタンがクリックされた時
    'keyup .js-form-val': 'checkKeyUp' //編集ボックスでキーが離された時
  },
  initialize: function () {
    console.log('FormView initialize');
    _.bindAll(this, 'render', 'addTodo', 'checkKeyUp');
    // モデルに変更があったらrenderを呼び出し
    this.model.bind('change', this.render);
    // 初期表示時もrenderを呼び出して表示
    this.render();
  },

  checkKeyUp: function (e) {
    console.log('FormView checkKeyUp');
    if (e.keyCode === 13 && e.KeyCode === prevKeyCode) {
    // Enter+Shiftキーが押されたらaddTodoメソッドを呼び出す
    // if (e.keyCode === 13 && e.shiftKey === true) {
      this.addTodo(e);
    }
  },
  addTodo: function () {
    console.log('FormView addTodo');
    // 入力フォームの値をval()で取得してモデルのformValにセット
    // モデルのvalidateメソッドでバリデーションが実行される（setメソッド、saveメソッドは自動）
    this.model.set({ formVal: $('.js-form-val').val() });

    // isValid()でモデルのvalidateメソッドを実行
    if (!this.model.isValid()) {
      console.log('hasErrorをtrue');
      // バリデーションエラーの場合はエラーフラグ、エラーメッセージをセット
      // validateメソッドからの戻り値（エラーメッセージ）はmodel.validationErrorプロパティに入る
      this.model.set({ hasError: true, errorMsg: this.model.validationError });
      // hasErrorが変わるのでthis.model.bind('change', this.render); でrenderメソッドが実行され、フォームのテンプレートが更新される
      console.log(this.model.attributes);
    } else {
      console.log('hasErrorをfalse');
      // バリデーションOKの場合、エラーフラグ、エラーメッセージを初期化（エラー時の値が残っていることがあるため変更する）
      this.model.set({ hasError: false, errorMsg: '' });
      console.log(this.model.attributes);
      // リストビューインスタンスのaddItemメソッドを呼び出し、フォームのモデルのformValを元にタスクを追加
      ListViewInstance.addItem(this.model.get('formVal'));
    }
  },
  // renderメソッド
  render: function () {
    console.log('FormView render');
    var template = this.template(this.model.attributes);
    this.$el.html(template);
    return this;
  },
});
// ビューをインスタンス化
new FormView();

// ------------------------
// 検索のビュー
var SearchView = Backbone.View.extend({
  el: $('.js-searchBox'),
  template: _.template($('#template-search').html()),
  model: SearchModelInstance,
  events: {
    'keyup .js-searchTasks': 'searchTasks'
  },
  initialize: function () {
    console.log('SearchView initialize');
    _.bindAll(this, 'render', 'searchTasks');
    this.render();
  },
  searchTasks: function () {
    console.log('SearchView searchTasks');
    // 検索ワードをモデルにセット
    this.model.set({ searchVal: $('.js-searchTasks').val() });
    // リストビューインスタンスに検索ワードを渡す
    ListViewInstance.searchItem(this.model.get('searchVal'));
  },
  render: function () {
    console.log('SearchView render');
    var template = this.template(this.model.attributes);
    this.$el.html(template);
    return this;
  }
});
// ビューをインスタンス化
new SearchView();
