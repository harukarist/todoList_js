//=============================================
// FrameWorkのメリット
//=============================================
// 1.１から何行もコードを書く必要がなく１行で済んだりと開発スピードが早い（開発効率が高い）
// 2.Model、View、Controllerという形でコードが整理されるので、後から見やすい、読み解きやすい

//=============================================
// Modelの使い方
//=============================================
// Modelはデータを永続的に保存しておく考え方のこと。そういう仕組みで実装したものをModelと呼んでいる
// Modelではデータを保存したり、保存するデータの形式が正しいかなどのバリデーションを行ったりする役割
// Model を作成するには、 Backbone.Model.extend() を使う。
// extend() の引数に、メンバー定義を渡す。
// 戻り値はコンストラクタ関数になっていて、 new でインスタンスを生成できる。
var MyModel = Backbone.Model.extend({
  // defaultsプロパティ
  defaults: {
    dateTime: new Date().toISOString()
  },
  initialize: function (attrs, options) {
    console.log("attrs", attrs);
    console.log("options", options);
  },
  validate: function (attrs) {
    if (attrs.text.length === 0) {
      return "入力されていません";
    }
  },
  method: function() {
    console.log('Hello Model!!');
    console.log(this.has("name")); // => true
    console.log(this.get("name")); // => kazukichi
    console.log(this.has("b")); // => false
    console.log(this.get("b")); // => undefined
  }
});
var myModel = new MyModel({name: 'kazukichi', text: 'sample text'}, {b: 2});
myModel.method();
// データベースに保存するような情報 は attrs で渡し、データベースには保存しない設定項目 を渡す場合は options を使う

var MyModel = new MyModel({text: "<script>alert('xss');</script>"});
MyModel.get('text'); // => <script>alert('xss');</script>
MyModel.escape('text'); // => &lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;

// 普通にインスタンスを作るのと変わらない（普通に作るインスタンスにbackboneのメソッドなどが色々くっついている）
var MyModel2 = function(){};
MyModel2.prototype.method = function() {
  console.log('Hello Model!!');
};
var myModel2 = new MyModel2();
myModel2.method();

//=============================================
// Viewの使い方
//=============================================
// 参考：https://qiita.com/JK0602@github/items/c366bc17583ff1a373a6
// Viewのelを指定する方法は2通りある
// (1).既に存在しているDOMエレメントをelに指定する
//   el には、セレクターを使った指定方法（この例の方法）か、DOMElementをそのまま渡す方法（jQueryなどで$('#app1')としてDOMを渡す）の２通りがある
// (2).新しくelを作る場合
//   新しくDOMを作りたい場合は、elを使わずにtagNameやclassName、attributesでタグの詳細を指定して作成する
//   下記の例の場合、<div class="viewClass" data-sample="bar"></div>のDOMが内部で作られている（画面に表示されているわけではなく、あくまでjs内で作られている）
//   素のjs（ネイティブのjsとかって言い方をする）では、document.createElement('div')でdivタグを作ってclass名などつけているのと同じ感じ
$(function() {
  var MyView = Backbone.View.extend({
    el: '#app1',
    tagName: 'div',
    className: 'viewClass',
    attributes: { 'data-sample': 'bar' },
    // 設定項目を書いていく
    initialize: function (options) {
      // インスタンスの生成時に呼ばれる
    },
    render: function() {
      this.$el.append('Hello View!!');
      return this;
    }
  });

  var myView = new MyView();
  myView.render();
});
// elを使って指定もできる
// ここでは、DOMElementをそのまま渡す方法（jQueryなどで$('#app1')としてDOMを渡す）でelプロパティを指定している
var MyView2 = Backbone.View.extend({
  el: $('#app2')
});
var myView2 = new MyView2();
// インスタンス化の時に引数でelを渡すこともできる
var MyView3 = Backbone.View.extend({});
var myView3 = new MyView3({el: $("#app3")});

//=============================================
// events
//=============================================
var MyView4 = Backbone.View.extend({
  el: "#app4",
  events: {
    "click" : "click", // #app4 以下で発生する全ての click イベント
    "click .js-click1" : "click1", // #app4 以下の .js-click1 で発生する click イベント
    "click .js-click2" : "click2"
  },
  click: function() {
    console.log("click");
  },
  click1: function() {
    console.log("click1");
  },
  click2: function(e) {
    e.stopPropagation();
    console.log("click2");
  }
});
new MyView4();

//=============================================
// backboneでunderscoreのtemplateを使う
//=============================================
var MyView5 = Backbone.View.extend({
  el: $('#app5'),
  initialize: function () {
    this.render();
  },
  render: function () {
    var compiled = _.template($('#template1').html());
    $(this.el).html(compiled({name: 'kazukichi', text: 'sample test'}));
  }
});
new MyView5();
