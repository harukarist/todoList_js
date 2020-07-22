// 外部ライブラリをrequire()で読み込んで変数に格納
var Backbone = require('../node_modules/backbone/backbone');
// jQueryは変数$, underscoreは変数_ に格納
var $ = require('../node_modules/jquery/dist/jquery');
var _ = require('../node_modules/underscore/underscore');
// browserifyで1つに固める
// gulpでbrowserifyを使うにはvinyl-source-streamを使う
//=============================================
// ModelとViewの連携でItemを作る
//=============================================

// モデルを作る　Backbone.Model.extend
var Item = Backbone.Model.extend({
  defaults: {
    // 初期値がなくても、モデルで使うデータの名前（プロパティ）を最初に全部定義しておく
    text: '',　//タスク名
    isDone: false, //タスクが終わっているかフラグ
    editMode: false //編集中フラグ
  }
});

// ビューを作る　Backbone.View.extend
// 1つ1つのタスクの画面表示用のビューを作る
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

    // return thisで返す（お決まりパターン）
    return this;
  }
});

//=============================================
// Collectionの使い方 コレクションはモデルを複数扱うためのオブジェクト
//=============================================
// BackboneにControllerはない
// CollectionはModelを複数扱うためのオブジェクト

// Backbone.Collection.extendでコレクションを作る
var LIST = Backbone.Collection.extend({
  // modelプロパティに上記で作った変数Item（インスタンス化する前の設計図）を入れる
  model: Item
});

// モデルをインスタンス化
var item1 = new Item({ text: 'sample todo1' });
var item2 = new Item({ text: 'sample todo2' });

// コレクションのインスタンスを作る（インスタンス化したモデルを配列型式でコレクションに渡す）
// モデルをコレクションに渡す場合
var list = new LIST([item1, item2]);

// プロパティに値を入れてコレクションに渡す場合
var list2 = new LIST([{ text: 'sample todo3' }, { text: 'sample todo4' }]);
console.log(list);
console.log(list2);

// underscoreのメソッドeach（for〜loopのようなもの）
// 第一引数に配列それぞれのアイテム（モデル）、第二引数にループの順番i
list.each(function (e, i) {
  // モデルのgetメソッドでタスク名を取得
  console.log('[' + i + '] ' + e.get('text'));
});


//=============================================
// CollectionとModelとViewの連携
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
  }
});
// 親のビューListViewをインスタンス化
// コレクションとしてリストを渡す
// （上記ですでに渡しているのでなくてもOK、他のコレクションを渡したい時にこうやって書くことで汎用的に使える）
var listView = new ListView({ collection: list });

// addItemでインスタンスにタスクを追加
listView.addItem('sample2');
listView.addItem('sample3');
