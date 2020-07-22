// 外部ライブラリをrequire()で読み込んで変数に格納
var Backbone = require('../node_modules/backbone/backbone');
// jQueryは変数$, underscoreは変数_ に格納
var $ = require('../node_modules/jquery/dist/jquery');
var _ = require('../node_modules/underscore/underscore');
// browserifyで1つに固める
// gulpでbrowserifyを使うにはvinyl-source-streamを使う
//=============================================
// Model
//=============================================
// モデルを作る
// Backbone.Model.extend

// タスクのモデルItem
var Item = Backbone.Model.extend({
  defaults: {
    // 初期値がなくても、モデルで使うデータの名前（プロパティ）を最初に全部定義しておく
    text: '',　//タスク名
    isDone: false, //タスクが終わっているかフラグ
    editMode: false //編集中フラグ
  }
});

// 入力フォームのモデルForm
var Form = Backbone.Model.extend({
  defaults: {
    val: '',
    hasError: false,
    errorMsg: ''
  }
});
// インスタンス化
var form = new Form();

//=============================================
// Collection
//=============================================
// BackboneにControllerはない
// CollectionはModelを複数扱うためのオブジェクト

// コレクションを作る
// Backbone.Collection.extend

// コレクションLIST
var LIST = Backbone.Collection.extend({
  // タスクの設計図Item（モデル）をコレクションに渡す
  model: Item
});
// モデルをインスタンス化
// タスクを2つ作る
var item1 = new Item({ text: 'sample todo1' });
var item2 = new Item({ text: 'sample todo2' });

// コレクションをインスタンス化
// 配列形式でインスタンス化したモデルを渡す
var list = new LIST([item1, item2]);

// // プロパティに値を入れてコレクションに渡す場合
// var list2 = new LIST([{ text: 'sample todo3' }, { text: 'sample todo4' }]);

// // underscoreのメソッドeach（for〜loopのようなもの）
// // 第一引数に配列それぞれのアイテム（モデル）、第二引数にループの順番i
// list.each(function (e, i) {
//   // モデルのgetメソッドでタスク名を取得
//   console.log('[' + i + '] ' + e.get('text'));
// });



//=============================================
// View
//=============================================
// ビューを作る
// Backbone.View.extend

// タスクの画面表示用のビューを作る
var ItemView = Backbone.View.extend({
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
    // _.bindAllでthisを縛る（このビューのthisだよ）
    // メソッドを増やした時は、bindAll()にも追加してthisを縛ってあげること！
    _.bindAll(this, 'toggleDone', 'render', 'remove', 'showEdit', 'closeEdit');

    // 'change'モデルのデータが変わったら、renderメソッドを呼び出して画面に表示
    this.model.bind('change', this.render);
    // 'destroy'モデルが壊された時（モデルを削除した時）、removeメソッドを呼び出し
    this.model.bind('destroy', this.remove);
    // 「オブザーバパターン」（設計方法の1つ）を利用して、モデルのイベントを購読する
    // （イベントをセットしておいて、そのイベントが発生するのを待つ）
  },
  update: function (text) {
    // 引数textを元にモデルのtextプロパティを更新する
    this.model.set({ text: text });
    // change が発生し、this.render が呼ばれる
    // 最後にnewでインスタンス化してインスタンス変数に入れた時にupdateメソッドが呼ばれる
  },
  toggleDone: function () {
    // ！でistDoneの値を反転させる
    this.model.set({ isDone: !this.model.get('isDone') });
  },
  remove: function () {
    // .remove()でエレメントを削除
    // this.elはulタグなので本来はliタグを削除する方が良い（今回は簡単にulを削除）
    this.$el.remove();
    return this;
    // return thisで自分自身への参照を返すことで、呼び出し元でメソッドチェーンを使うことが出来る
  },
  showEdit: function () {
    // editModeをTrueにする
    this.model.set({ editMode: true });
  },
  closeEdit: function (e) {
    // キーコードが13（Enter）で、かつシフトキーがTrueの場合
    if (e.keyCode === 13 && e.shiftKey === true) {
      // this.model.setでモデルのtextプロパティを変更
      // e.currentTarget.valueでinputに入力された文字列を取得してtextプロパティにセットし
      // editModeをfalseに変更して編集モードを終了
      this.model.set({ text: e.currentTarget.value, editMode: false });
    }
  },
  // renderメソッド
  render: function () {
    // ログを出力
    console.log('render item');
    // テンプレートを取得して変数に格納
    var template = this.template(this.model.attributes);
    // this.$elに.html()で書き換えて入れる
    this.$el.html(template);
    // // テンプレートを取得して変数に格納
    // var compiled = _.template($('#template-list-item').html());⇒ビューのtemplateプロパティへ移動
    // // compiled()でモデルの中身を流し込む
    // // this.model.attributes でモデルのデータをオブジェクト形式（連想配列）で渡すことができる
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
  //collectionプロパティにコレクションのインスタンスlistを渡す（コレクションとビューの連携）
  collection: list,
  initialize: function () {
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
    // タスクの文字列を引数で受けとり、モデルを作る
    var model = new Item({ text: text });
    // そのモデルを、ビューに紐づいているコレクションにaddで追加
    this.collection.add(model);
    // initializeプロパティのadd イベントが発生し、this.appendItem が呼ばれ
    // appendItemメソッドで1つ1つのタスクのビューが生成されて、モデルと連携して
    // 
  },
  // コレクションにモデルが追加されたらappendItemメソッドでタスクを追加
  appendItem: function (model) {
    // モデルを引数で受け取ってタスクのビューItemViewにモデルを連携してデータを渡し
    // タスクのチケットitemViewを作る（ビューとモデルの連携）
    var itemView = new ItemView({ model: model });
    // 生成したタスクのチケットitemViewをrender()してelのliタグのテンプレートを生成し
    // 親のthis.$elのulタグにappend()してタスクが追加される
    this.$el.append(itemView.render().el);

    // render().elでviewで生成されたエレメントを取得できる
  },
  // renderメソッド
  render: function () {
    // ログを出力
    console.log('render list');
    // ビューのthisを変数thatに格納
    var that = this;
    // eachでコレクションに紐づいたモデルを1つ1つ呼び出し
    this.collection.each(function (model, i) {
      // 上記のappendItemメソッドにモデルを渡してitemViewを生成して
      // itemViewのrenderメソッドでhtml上のliのテンプレートにデータが流し込まれたタスクが作られて
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

var listView = new ListView({ collection: list });

// addItemでインスタンスにタスクを追加
// listView.addItem('sample2');
// listView.addItem('sample3');

//=============================================
// フォームのビューを作る
var FormView = Backbone.View.extend({
  el: $('.js-form'),　//エレメントを渡す
  template: _.template($('#template-form').html()),　//underscoreのtemplateメソッドでテンプレートを登録
  model: form, //モデルをビューに連携
  events: { //イベント
    'click .js-add-todo': 'addTodo' //追加ボタンがクリックされたらaddTodoメソッドを呼び出し
  },
  // initialize
  initialize: function () {
    // bindAllでthisを縛る
    _.bindAll(this, 'render', 'addTodo');
    // モデルに変更があったらrenderを呼び出し
    this.model.bind('change', this.render);
    // 初期表示時もrenderを呼び出して表示
    this.render();
  },

  // 追加ボタンが押された時のaddTodoメソッド
  addTodo: function (e) {
    // formタグ内のボタンをクリックするとsubmitでページがリロードされてしまうので
    // 伝播を防ぐためe.preventDefault()で送信を止める
    e.preventDefault();
    // 入力フォームの値をval()で取得してモデルのvalにセット
    this.model.set({ val: $('.js-get-val').val() });
    // インスタンス化したlistViewのaddItemメソッドを呼び出して、フォームのモデルのvalを元にタスクを追加
    listView.addItem(this.model.get('val'));
  },
  // renderメソッド
  render: function () {
    // テンプレートを呼び出し
    var template = this.template(this.model.attributes);
    // フォーム部分にテンプレートを表示
    this.$el.html(template);
    return this;
    // renderメソッドは最後に return this; をつけるのが慣し
    // return thisで自分自身への参照を返すことで、呼び出し元でメソッドチェーンを使うことが出来る
  }
});
// ビューをインスタンス化
new FormView();

// ----------------------------------------
// 宿題１：inputが空で入力された場合にエラーメッセージを表示してみよう
// （入力された値が空かどうかを判定して、空の場合はhasErrorをtrueにしてエラーメッセージを表示）

// 宿題２：検索を作ってみよう
// 検索用のテンプレート、モデルなどを作って、検索キーワードが入力されたらコレクションの中身を精査して
// マッチするものだけを画面に表示させる
