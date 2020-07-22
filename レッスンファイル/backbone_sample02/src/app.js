
// 外部ライブラリをrequire()で読み込んで変数に格納
var Backbone = require('../node_modules/backbone/backbone');
// 変数はjQueryは$, underscoreは_ を使う
var $ = require('../node_modules/jquery/dist/jquery');
var _ = require('../node_modules/underscore/underscore');
// browserifyで1つに固める
// gulpでbrowserifyを使うにはvinyl-source-streamを使う


//=============================================
// viewとmodelを連携させる
//=============================================
var MyModel = Backbone.Model.extend({
  // デフォルト値を設定
  defaults: {
    name: 'default name',
    text: 'default text',
    like: 10
  },
  initialize: function (attrs, options) {
    // ログに吐き出し
    console.log("attrs", attrs);
    console.log("options", options);
  },
  validate: function (attrs) {
    // バリデーションサンプル
    if (attrs.text.length === 0) {
      return "入力されていません";
    }
  },
  // 自分で作ったメソッド（今回はなし）
  method: function () {

  }
});

// モデルをインスタンス化するときにattributesにプロパティを渡す
var myModel = new MyModel({ name: 'kazukichi', text: 'sample test', like: 0 });

// ビューを作る
var MyView = Backbone.View.extend({
  // イベントを定義
  events: {
    // お気に入りボタンをクリックしたらcountUpというメソッドを呼び出す
    "click .js-click-like": "countUp",
  },
  // 
  initialize: function () {
    // _.bindAllでthisを縛る
    // renderメソッドの中で使うthisは自分自身のビューだよ、と縛る
    _.bindAll(this, "render");
    // ビューの中ではthis.modelというオブジェクトが自動で作られる
    // this.model.bindで処理を指定
    // データが変化したらthis.renderを呼び出す（再描画する）
    this.model.bind("change", this.render);
    // 初期化
    this.render();
  },
  /**
   * お気に入りカウントアップ　
   */
  countUp: function () {
    // .set()メソッドを使って値をセット
    // お気に入りの値を.get()で取得して＋1する
    this.model.set({ like: this.model.get('like') + 1 });
  },
  render: function () {
    console.log('render');
    // テンプレートを読み込んで変数に格納
    var compiled = _.template($('#template1').html());
    // this.elでDOMを取得
    $(this.el).html(compiled({
      // this.model.getでモデルの中の値を渡す
      name: this.model.get('name'),
      text: this.model.get('text'),
      like: this.model.get('like')
    }));
  }
});
// インスタンス化の時に#appのDOMとモデルを値として渡す(ViewとModelの連携)
new MyView({ el: $("#app"), model: myModel });
