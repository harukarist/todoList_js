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

// Backbone.Model.extendでモデルを作る
var Item = Backbone.Model.extend({
  defaults: {
    // 初期値がなくても、モデルで使うデータの名前（プロパティ）を最初に全部定義しておく
    text: '',　//タスク名
    isDone: false, //タスクが終わっているかフラグ
    editMode: false //編集中フラグ
  }
});

// デフォルトタスクを1つ作る
var item1 = new Item({ text: 'sample todo1' });

// Backbone.View.extendでビューを作る
var ItemView = Backbone.View.extend({
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
    $(this.el).remove();
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
    console.log('render');
    // テンプレートを取得して変数に格納
    var compiled = _.template($('#template-list-item').html());
    // compiled()でモデルの中身を流し込む
    // this.model.attributes でモデルのデータをオブジェクト形式（連想配列）で渡すことができる
    // $(this.el)に.html()で書き換えて入れる
    $(this.el).html(compiled(this.model.attributes));
    // return thisで返す（お決まりパターン）
    return this;
  }
});

// インスタンス化する時にDOMとモデルを渡す
var itemView = new ItemView({ el: $('.js-todo_list'), model: item1 });
// 最初に作ったデフォルトタスクは「sample todo1」だったが
// updateメソッドで「sample test」に上書きされる
itemView.update('sample test');
