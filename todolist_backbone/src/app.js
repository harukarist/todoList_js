
//=============================================
// require
//=============================================
// 外部ライブラリをrequire()で読み込んで変数に格納
var Backbone = require('../node_modules/backbone/backbone');
var $ = require('../node_modules/jquery/dist/jquery');
var _ = require('../node_modules/underscore/underscore');

//=============================================
// Model
//=============================================
// タスクのモデル
var TaskModel = Backbone.Model.extend({
  defaults: {
    // モデルで使うプロパティを定義
    taskName: '',
    isDone: false,
    editMode: false,
    isHide: false,
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

  // initializeプロパティ
  // newでインスタンス化した時に最初に呼ばれる処理
  // https://backbonejs.org/#Model-constructor
  // initialize: function (attrs, options) {
  //   // attributesはDBに保存する情報
  //   // optionsはjsの中だけで使う情報
  // },

  // validateプロパティ
  // https://backbonejs.org/#Model-validate
  validate: function (attrs) {
    // ビュー側のFormViewでthis.model.set()するとvalidateが実行される
    console.log('FormModel validate');
    console.dir(attrs);

    // 引数で渡されたattrs（errorMsg,formVal,hasErrorを持つオブジェクト）をバリデーションチェック
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
// Modelを複数扱うためのオブジェクト
// Taskのコレクション
var TaskCollection = Backbone.Collection.extend({
  // タスクのモデルをコレクションのmodelプロパティに渡す
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
  // テンプレート
  template: _.template($('#template-list-item').html()),
  // 呼び出すイベントを定義
  events: {
    'click .js-toggle-done': 'toggleDone', //チェックボックスをクリックした時
    'click .js-click-to-remove': 'remove', //ゴミ箱アイコンをクリックした時
    'click .js-toggle-must': 'toggleMust', //スターアイコンをクリックした時
    'click .js-todoList-taskName': 'showEdit', //タスク名をクリックした時
    'blur .js-todoList-editName': 'closeEdit', //編集ボックスのフォーカスが外れた時
    'keydown .js-todoList-editName': 'checkKeyDown', //編集ボックスでkeydownした時
    'keyup .js-todoList-editName': 'checkKeyUp' //編集ボックスでkeyupした時
  },

  initialize: function () {
    console.log('TaskView initialize');
    // underscoreのbindAll()でthisを縛る
    _.bindAll(this, 'update', 'toggleDone', 'render', 'remove', 'toggleMust', 'showEdit', 'closeEdit', 'checkKeyDown','checkKeyUp');
    // モデルのデータが変わったら、renderメソッドを呼び出して画面に表示
    this.model.bind('change', this.render);
    // モデルが削除されたら、removeメソッドを呼び出し
    this.model.bind('destroy', this.remove);
    // 「オブザーバパターン」を利用して、モデルのイベントを購読する
    // （イベントをセットしておいて、そのイベントが発生するのを待つ）
  },
  update: function (text) {
    console.log('TaskView update');
    // 引数textを元にモデルのtaskNameプロパティを更新する
    this.model.set({ taskName: text });
    // change が発生し、this.render が呼ばれる
    // 最後にnewでインスタンス化してインスタンス変数に入れた時にupdateメソッドが呼ばれる
  },
  toggleDone: function () {
    console.log('TaskView toggleDone');
    // ！でisDoneの値を反転させる
    this.model.set({ isDone: !this.model.get('isDone') });
  },
  remove: function () {
    console.log('TaskView remove');
    // .remove()でエレメントを削除
    this.$el.remove();
    return this;
  },
  toggleMust: function () {
    console.log('TaskView toggleMust');
    // ！でisDoneの値を反転させる
    this.model.set({ isMust: !this.model.get('isMust') });
    // リストインスタンスの末尾にモデルを追加
    ListViewInstance.appendItem(this.model);
    this.$el.remove();
  },
  showEdit: function () {
    console.log('TaskView showEdit');
    // editModeをTrueにする
    this.model.set({ editMode: true });
  },
  closeEdit: function (e) {
    console.log('TaskView closeEdit');
    // this.model.setでモデルのtaskNameプロパティを変更
    this.model.set({ taskName: e.currentTarget.value, editMode: false });
  },
  checkKeyDown: function (e) {
    // console.log('TaskView checkKeyDown', e.keyCode);
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
  // renderメソッド
  render: function () {
    // ログを出力
    console.log('TaskView render');
    console.log('modelをテンプレートに入れる:', this.model.attributes);
    // テンプレートを取得して変数に格納
    // this.model.attributes でモデルのデータをオブジェクト形式（連想配列）で渡すことができる
    var template = this.template(this.model.attributes);
    // this.$elに.html()で書き換えて入れる
    this.$el.html(template);

    // タスクのソート
    // this.$el.children('.js-sortable').sortable({ axis: 'y' });
    // this.$el.sortable({ axis: 'y' });

    return this;
    // renderメソッドは最後に return this; をつける
    // return thisで自分自身への参照を返すことで、呼び出し元でメソッドチェーンを使うことが出来る

    // このViewではelを指定していないため、divタグのDOMが生成される。
    // this.$el.html()とすると、空のdivタグの中にテンプレートのliタグが作られる。
  }
});


// ------------------------
// 親のビュー
var ListView = Backbone.View.extend({
  // elプロパティにulを囲むdivエレメントを指定
  el: $('.js-todoList'),
  //collectionプロパティにコレクションのインスタンスTaskCollectionInstanceを渡す（コレクションとビューの連携）
  collection: TaskCollectionInstance,
  initialize: function () {
    console.log('ListView initialize');
    _.bindAll(this, 'render', 'addItem', 'appendItem', 'searchItem');
    // コレクションにモデルが追加されたらappendItemメソッドを呼び出し
    this.collection.bind('add', this.appendItem);
    // 初期表示時にrenderを呼び出し
    this.render();
  },
  // タスクを追加するメソッド
  addItem: function (text) {
    console.log('ListView addItem');
    // タスクの文字列を引数で受けとり、モデルを作る
    var TaskModelInstance = new TaskModel({ taskName: text });
    // そのモデルを、ビューに紐づいているコレクションにadd()で追加
    this.collection.add(TaskModelInstance);
    // initializeプロパティのaddイベントが発生し、this.appendItemメソッドでモデルと連携して個々のタスクのビューが生成される
  },
  // コレクションにモデルが追加されたらappendItemメソッドでタスクを追加
  appendItem: function (model) {
    console.log('ListView appendItem');
    console.log('modelからタスクのインスタンスを作る', model);
    // モデルを引数で受け取ってタスクのビュークラスにモデルを連携してデータを渡し、タスクのチケットを作る（ビューとモデルの連携）
    var TaskViewInstance = new TaskView({ model: model });
    // viewで生成されたエレメントをrender().elで取得し、
    // 親のthis.$elのulタグにappend()してタスクを追加する
    // 重要フラグの値によって、追加先のDOMを変える
    if (model.attributes.isMust) {
      this.$el.children('.js-todoList-must').append(TaskViewInstance.render().el);
    } else {
      this.$el.children('.js-todoList-normal').append(TaskViewInstance.render().el);
    }
  },
  // ＃検索結果を表示
  searchItem: function (searchText) {
    console.log('ListView searchItem');
    console.log('searchText', searchText);
    // underscoreのメソッドeach()でコレクションに紐づいたモデルを1つ1つ呼び出し
    // each(function(第一引数にモデル、第二引数にループの順番i))
    this.collection.each(function (model, i) {
      // console.log('model', model);
      console.log('taskName:', model.attributes.taskName);
      // モデルの属性からタスク名を取得
      var taskname = model.attributes.taskName;
      // 正規表現のオブジェクトを生成（部分一致）
      var regexp = new RegExp('^(?=.*' + searchText + ').*$');
      // match()で一致するかを判定
      if (taskname && taskname.match(regexp)) {
        // 一致したら非表示フラグはOFF
        model.set({ isHide: false });
        console.log('isHide:', model.attributes.isHide);
      } else {
        // 一致しなかったら非表示フラグをON
        model.set({ isHide: true });
        console.log('isHide', model.attributes.isHide);
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
      // 上記のappendItemメソッドにモデルを渡してTaskViewInstanceを生成して
      // TaskViewInstanceのrenderメソッドでhtml上のliのテンプレートにデータが流し込まれたタスクが作られて
      // 親のulにappendされて画面に表示される
      that.appendItem(model);
    });
    return this;
  }
});

// 親のビューListViewをインスタンス化
// コレクションとしてリストを渡す
// （上記ですでに渡しているのでなくてもOK、他のコレクションを渡したい時にこうやって書くことで汎用的に使える）
var ListViewInstance = new ListView({ collection: TaskCollectionInstance });

// 【参考】addItemでインスタンスにタスクを追加
// ListViewInstance.addItem('sample2');
// ListViewInstance.addItem('sample3');

// ------------------------
// 入力フォームのビュー
var FormView = Backbone.View.extend({
  //テンプレートが入る先のエレメント(formタグのDOM)を渡す
  el: $('.js-form'),
  //underscoreのtemplateメソッドでテンプレートを登録
  template: _.template($('#template-form').html()),
  //モデルをビューに連携
  model: FormModelInstance,
  //イベント
  events: {
    'click .js-add-todo': 'addTodo', //追加ボタンがクリックされたらaddTodoメソッドを呼び出し
    'keydown .js-form-val': 'checkKeyDown', //編集ボックスでkeyupした時
    'keyup .js-form-val': 'checkKeyUp' //編集ボックスでkeyupした時
  },
  // initialize
  initialize: function () {
    console.log('FormView initialize');
    // bindAllでthisを縛る
    _.bindAll(this, 'render', 'addTodo', 'checkKeyUp', 'checkKeyDown');
    // モデルに変更があったらrenderを呼び出し(changeはbackboneで用意されているイベント)
    this.model.bind('change', this.render);
    // 初期表示時もrenderを呼び出して表示
    this.render();
  },

  checkKeyDown: function (e) {
    // console.log('FormView checkKeyDown', e.keyCode);
    this.model.set({ keyDownCode: e.keyCode })
  },
  checkKeyUp: function (e) {
    console.log('FormView checkKeyUp');
    // Enterキーが押された時（日本語入力確定後）
    if (e.keyCode === 13 && e.keyCode === this.model.get('keyDownCode')) {
      // addTodoメソッドを呼び出す
      this.addTodo(e);
    }
  },

  // 追加ボタンが押された時のaddTodoメソッド
  addTodo: function () {
    // e.preventDefault();
    console.log('FormView addTodo');
    // ＃入力フォームの値をval()で取得してモデルのformValにセット
    // モデルのvalidateメソッドでバリデーションが実行（setメソッド、saveメソッドは自動）
    this.model.set({ formVal: $('.js-form-val').val() });

    // ＃isValid()でモデルのvalidateメソッドを実行
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
      // インスタンス化したListViewInstanceのaddItemメソッドを呼び出して、フォームのモデルのformValを元にタスクを追加
      ListViewInstance.addItem(this.model.get('formVal'));
    }
  },
  // renderメソッド
  render: function () {
    console.log('FormView render');
    // テンプレートを呼び出し
    var template = this.template(this.model.attributes);
    // フォーム部分にテンプレートを表示
    this.$el.html(template);
    return this;
  },

  // ＃【参考】エラーメッセージ表示
  // showError: function () {
  //   // エラー表示処理
  //   this.model.set({ hasError: true });
  // }

});
// ビューをインスタンス化
new FormView();

// ------------------------
// ＃検索のビュー
var SearchView = Backbone.View.extend({
  //テンプレートが入る先のエレメント(divタグのDOM)を渡す
  el: $('.js-searchBox'),
  // テンプレート（いらない？）
  template: _.template($('#template-search').html()),
  //モデルをビューに連携
  model: SearchModelInstance,

  // 呼び出すイベントを定義
  events: {
    'keyup .js-searchTasks': 'searchTasks'
  },
  initialize: function () {
    console.log('SearchView initialize');
    // _.bindAllでthisを縛る
    _.bindAll(this, 'render', 'searchTasks');

    // モデルのデータが変わったら、renderメソッドを呼び出して画面に表示（いらない？）
    // this.model.bind('change', this.searchTasks);
    // 最初にビューを表示する時にrenderを呼び出し
    this.render();
  },
  searchTasks: function () {
    console.log('SearchView searchTasks');
    // 検索ワードをモデルにセット
    this.model.set({ searchVal: $('.js-searchTasks').val() });
    // ListViewInstanceに検索ワードを渡す
    ListViewInstance.searchItem(this.model.get('searchVal'));
  },
  // renderメソッド（いらない？）
  render: function () {
    // ログを出力
    console.log('SearchView render');
    // テンプレートを取得して変数に格納
    // this.model.attributes でモデルのデータをオブジェクト形式（連想配列）で渡す
    var template = this.template(this.model.attributes);
    // this.$elに.html()で書き換えて入れる
    this.$el.html(template);
    return this;
  }
});
// ビューをインスタンス化
new SearchView();
