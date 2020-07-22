// 外部ライブラリをrequire()で読み込んで変数に格納
var Backbone = require('../node_modules/backbone/backbone');
// jQueryは変数$, underscoreは変数_ に格納
var $ = require('../node_modules/jquery/dist/jquery');
var _ = require('../node_modules/underscore/underscore');
// browserifyで1つに固める
// gulpでbrowserifyを使うにはvinyl-source-streamを使う


// function debug(obj) {
//   console.dir(obj);
// }

//=============================================
// Model
//=============================================
// モデルを作る
// Backbone.Model.extend

// タスクのモデルTaskModel
var TaskModel = Backbone.Model.extend({
  defaults: {
    // 初期値がなくても、モデルで使うデータの名前（プロパティ）を最初に全部定義しておく
    taskName: '',　//タスク名
    isDone: false, //タスクが終わっているかフラグ
    editMode: false //編集中フラグ
  }
});

// 入力フォームのモデルForm
var FormModel = Backbone.Model.extend({
  defaults: {
    formVal: '',
    hasError: false,
    errorMsg: ''
  },
  // initializeプロパティ
  // newした時に最初に呼ばれる処理を initializeプロパティ、constructorプロパティで定義
  // 両方定義する場合はinitializeの後にconstructor
  // https://backbonejs.org/#Model-constructor
  initialize: function (attrs, options) {
    console.log('FormModel initialize');
    console.log("attrs", attrs);
    console.log("options", options);
    // new Model([attributes], [options])
    // attributesはDBに保存する情報
    // optionsはjsの中だけで使う情報
  },
  // ＃formValidateプロパティ
  // https://backbonejs.org/#Model-validate
  validate: function (attrs) {
    // ビュー側FormViewでthis.model.set()するとvalidateが実行される
    console.log('FormModel validate');
    console.dir(attrs);
    // 引数で渡されたattrs（アトリビューツ）をバリデーションチェック
    // attrsにformValプロパティがない場合、またはformValプロパティの中身の長さが0ならメッセージをリターン
    if (!attrs.formVal || attrs.formVal.length === 0) {
      console.log("入力なし");
      return "タスクを入力してください";
      // ＃モデルは設計図なので判定のみ
      // エラーフラグの切替、エラーメッセージの代入はビュー側で行う
    } else if (attrs.formVal.length > 100) {
      console.log("文字数エラー");
      return "タスクは100文字以内で入力してください";
    }
  }
});
// インスタンス化
var FormModelInstance = new FormModel();

// ＃isValid()でモデルの中身をバリデーション
// FormModelInstance.isValid();
// if (!FormModelInstance.isValid()) {
//   alert(FormModelInstance.validationError);
// };
// FormModelInstance.on("invalid", function (model, error) {
//   alert(error);
// });


//=============================================
// Collection
//=============================================
// BackboneにControllerはない
// CollectionはModelを複数扱うためのオブジェクト

// コレクションを作る
// Backbone.Collection.extend

// コレクションTaskCollection
var TaskCollection = Backbone.Collection.extend({
  // タスクの設計図TaskModel（モデル）をコレクションのmodelプロパティに渡す
  model: TaskModel
});
// モデルをインスタンス化
// タスクを2つ作る
var SampleTask1 = new TaskModel({ taskName: 'sample todo1' });
var SampleTask2 = new TaskModel({ taskName: 'sample todo2' });

// コレクションをインスタンス化
// 配列形式でインスタンス化したモデルを渡す
var TaskCollectionInstance = new TaskCollection([SampleTask1, SampleTask2]);

// // プロパティに値を入れてコレクションに渡す場合
// var TaskCollectionInstance2 = new TaskCollection([{ taskName: 'sample todo3' }, { taskName: 'sample todo4' }]);

// // underscoreのメソッドeach（for〜loopのようなもの）
// // 第一引数に配列それぞれのアイテム（モデル）、第二引数にループの順番i
// TaskCollectionInstance.each(function (e, i) {
//   // モデルのgetメソッドでタスク名を取得
//   console.log('[' + i + '] ' + e.get('taskName'));
// });



//=============================================
// View
//=============================================
// ビューを作る
// Backbone.View.extend

// タスクの画面表示用のビューを作る
var TaskView = Backbone.View.extend({
  // 前回まではunderscoreを使ってrenderメソッドの中でテンプレート表示をしていたが
  // 今回はビューのtemplateプロパティで取得するように変更。
  template: _.template($('#template-list-item').html()),
  // 呼び出すイベントを定義
  events: {
    'click .js-toggle-done': 'toggleDone', //チェックボックスをクリックしたら呼び出す
    'click .js-click-trash': 'remove', //ゴミ箱アイコンをクリックしたら呼び出す
    'click .js-todo_list-text': 'showEdit', //タスク名をクリックしたら呼び出す
    'keyup .js-todo_list-editForm': 'closeEdit' //編集ボックスでshift+enterを押したら呼び出す

  },
  // 初期化（initialize）
  // newでインスタンス化するとinitializeが最初に必ず呼ばれる
  // 引数optionsは使わない場合、削除した方が良い
  initialize: function (options) {
    console.log('TaskView initialize');
    // _.bindAllでthisを縛る（このビューのthisだよと指定する）
    _.bindAll(this, 'toggleDone', 'render', 'remove', 'showEdit', 'closeEdit');
    // メソッドを増やす時は、bindAll()にも追加してthisを縛ってあげること！

    // モデルのデータが変わったら、renderメソッドを呼び出して画面に表示
    this.model.bind('change', this.render);
    // モデルが壊された時（モデルを削除した時）、removeメソッドを呼び出し
    this.model.bind('destroy', this.remove);

    // 「オブザーバパターン」（設計方法の1つ）を利用して、モデルのイベントを購読する
    // （イベントをセットしておいて、そのイベントが発生するのを待つ）
  },
  update: function (text) {
    console.log('TaskView update');
    // 引数taskNameを元にモデルのtaskNameプロパティを更新する
    this.model.set({ taskName: text });
    // change が発生し、this.render が呼ばれる
    // 最後にnewでインスタンス化してインスタンス変数に入れた時にupdateメソッドが呼ばれる
  },
  toggleDone: function () {
    console.log('TaskView toggleDone');
    // ！でistDoneの値を反転させる
    this.model.set({ isDone: !this.model.get('isDone') });
  },
  remove: function () {
    console.log('TaskView remove');
    // .remove()でエレメントを削除
    // this.elはulタグなので本来はliタグを削除する方が良い（今回は簡単にulを削除）
    this.$el.remove();
    return this;
    // return thisで自分自身への参照を返すことで、呼び出し元でメソッドチェーンを使うことが出来る
  },
  showEdit: function () {
    console.log('TaskView showEdit');
    // editModeをTrueにする
    this.model.set({ editMode: true });
  },
  closeEdit: function (e) {
    console.log('TaskView closeEdit');
    // キーコードが13（Enter）で、かつシフトキーがTrueの場合
    if (e.keyCode === 13 && e.shiftKey === true) {
      // this.model.setでモデルのtaskNameプロパティを変更
      // e.currentTarget.valueでinputに入力された文字列を取得してtaskNameプロパティにセットし
      // editModeをfalseに変更して編集モードを終了
      this.model.set({ taskName: e.currentTarget.value, editMode: false });
    }
  },
  // renderメソッド
  render: function () {
    // ログを出力
    console.log('TaskView render');
    // テンプレートを取得して変数に格納
    // this.model.attributes でモデルのデータをオブジェクト形式（連想配列）で渡すことができる
    var template = this.template(this.model.attributes);



    // this.$elに.html()で書き換えて入れる
    this.$el.html(template);

    // // テンプレートを取得して変数に格納
    // var compiled = _.template($('#template-list-item').html());⇒ビューのtemplateプロパティへ移動
    // // compiled()でモデルの中身を流し込む

    // // $(this.el)に.html()で書き換えて入れる
    // $(this.el).html(compiled(this.model.attributes));

    // このViewではelを何も指定していない。elを指定していない場合、Viewの中ではデフォルトで新たなdivタグのDOMが生成される。
    // そのため、this.$el.html()とした場合、新しい空のdivタグの中のhtmlがテンプレートのliタグに書き換えられる。
    // 開発ツールで実際にタスクをみてみると全てliタグがdivタグで囲われているのが確認できる。
    return this;
    // renderメソッドは最後に return this; をつけるのが慣し
    // return thisで自分自身への参照を返すことで、呼び出し元でメソッドチェーンを使うことが出来る
  }
});


//=============================================
// 親のビューを作る
var ListView = Backbone.View.extend({
  // elプロパティにulタグのエレメントを指定
  el: $('.js-todo_list'),
  //collectionプロパティにコレクションのインスタンスTaskCollectionInstanceを渡す（コレクションとビューの連携）
  collection: TaskCollectionInstance,
  initialize: function () {
    console.log('ListView initialize');
    // bindAllでthisを縛る
    _.bindAll(this, 'render', 'addItem', 'appendItem');

    // コレクションにモデルが追加'add'されたらappendItemメソッドを呼び出し
    this.collection.bind('add', this.appendItem);
    // 1つ1つのタスク表示用のビューでは this.model.bind だったが
    // この親ビューでは this.collection.bind を使う

    // 最初にビューを表示する時にrenderを呼び出し
    this.render();
  },
  // タスクを追加するaddItemメソッド
  addItem: function (text) {
    console.log('ListView addItem');
    // タスクの文字列を引数で受けとり、モデルを作る
    var TaskModelInstance = new TaskModel({ taskName: text });
    // そのモデルを、ビューに紐づいているコレクションにaddで追加
    this.collection.add(TaskModelInstance);
    // initializeプロパティのadd イベントが発生し、this.appendItem が呼ばれ
    // appendItemメソッドで1つ1つのタスクのビューが生成されて、モデルと連携して
    // 
  },
  // コレクションにモデルが追加されたらappendItemメソッドでタスクを追加
  appendItem: function (model) {
    console.log('ListView appendItem');
    // モデルを引数で受け取ってタスクのビューTaskViewにモデルを連携してデータを渡し
    // タスクのチケットTaskViewを作る（ビューとモデルの連携）
    var TaskViewInstance = new TaskView({ model: model });
    // 生成したタスクのチケットTaskViewInstanceをrender()してelのliタグのテンプレートを生成し
    // 親のthis.$elのulタグにappend()してタスクが追加される
    this.$el.append(TaskViewInstance.render().el);

    // render().elでviewで生成されたエレメントを取得できる
  },
  // renderメソッド
  render: function () {
    console.log('ListView render');
    // ビューのthisを変数thatに格納
    var that = this;
    // eachでコレクションに紐づいたモデルを1つ1つ呼び出し
    this.collection.each(function (model, i) {
      // 上記のappendItemメソッドにモデルを渡してTaskViewInstanceを生成して
      // TaskViewInstanceのrenderメソッドでhtml上のliのテンプレートにデータが流し込まれたタスクが作られて
      // 親のulにappendされて画面に表示される
      that.appendItem(model);
    });
    return this;
    // renderメソッドは最後に return this; をつけるのが慣し
    // return thisで自分自身への参照を返すことで、呼び出し元でメソッドチェーンを使うことが出来る
  }
});
// 親のビューListViewをインスタンス化
// コレクションとしてリストを渡す
// （上記ですでに渡しているのでなくてもOK、他のコレクションを渡したい時にこうやって書くことで汎用的に使える）

var ListViewInstance = new ListView({ collection: TaskCollectionInstance });

// addItemでインスタンスにタスクを追加
// ListViewInstance.addItem('sample2');
// ListViewInstance.addItem('sample3');

//=============================================
// フォームのビューを作る
var FormView = Backbone.View.extend({
  //エレメント(formタグのDOM)を渡す
  el: $('.js-form'),
  //underscoreのtemplateメソッドでテンプレートを登録
  template: _.template($('#template-form').html()),
  //モデルをビューに連携
  model: FormModelInstance,
  //イベント
  events: {
    'click .js-add-todo': 'addTodo' //追加ボタンがクリックされたらaddTodoメソッドを呼び出し
  },
  // initialize
  initialize: function () {
    console.log('FormView initialize');
    // bindAllでthisを縛る
    _.bindAll(this, 'render', 'addTodo');
    // _.bindAll(this, 'render', 'addTodo', 'showError');


    // モデルに変更があったらrenderを呼び出し(changeはbackboneで用意されているイベント)
    this.model.bind('change', this.render);

    // ＃エラー発生時は、showErrorメソッドを呼び出してエラーメッセージを表示し(errorはbackboneで用意されているイベント)
    // this.model.bind('error', this.showError);

    // 初期表示時もrenderを呼び出して表示
    this.render();
  },

  // 追加ボタンが押された時のaddTodoメソッド
  addTodo: function (e) {
    console.log('FormView addTodo');
    // formタグ内のボタンをクリックするとsubmitでページがリロードされてしまうので
    // 伝播を防ぐためe.preventDefault()で送信を止める
    e.preventDefault();

    // ＃入力フォームの値をval()で取得してモデルのformValにセット
    this.model.set({ formVal: $('.js-get-val').val() });
    // this.model.set({ formVal: $('.js-get-val').val() }, { validate: true });

    if (!this.model.isValid()) {
      console.log('hasErrorをtrue');
      // バリデーションエラーの場合はエラーフラグ、エラーメッセージをセット
      this.model.set({ hasError: true, errorMsg: this.model.validationError });
      // validateメソッドからの戻り値はmodel.validationErrorプロパティに入る
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
    // renderメソッドは最後に return this; をつけるのが慣し
    // return thisで自分自身への参照を返すことで、呼び出し元でメソッドチェーンを使うことが出来る
  },

  // ＃エラーメッセージ表示
  // showError: function () {
  //   // エラー表示処理
  //   this.model.set({ hasError: true });
  // }

});
// ビューをインスタンス化
new FormView();

// ----------------------------------------
// 宿題１：inputが空で入力された場合にエラーメッセージを表示してみよう
// （入力された値が空かどうかを判定して、空の場合はhasErrorをtrueにしてエラーメッセージを表示）

// 宿題２：検索を作ってみよう
// 検索用のテンプレート、モデルなどを作って、検索キーワードが入力されたらコレクションの中身を精査して
// マッチするものだけを画面に表示させる
