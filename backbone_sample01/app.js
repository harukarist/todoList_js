//=============================================
// FrameWorkのメリット
//=============================================
// 1.１から何行もコードを書く必要がなく１行で済んだりと開発スピードが早い（開発効率が高い）
// 2.「Model、View、Controller」という形でコードが整理されるので、後から見やすい、読み解きやすい

//=============================================
// Modelの使い方
//=============================================
// Model（モデル）は「データを永続的に保存しておく考え方」のこと。
// そういう仕組みで実装したものをModelと呼んでいる

// Modelではデータを保存したり、保存するデータの形式が正しいかなどのバリデーションを行ったりする役割。
// Model を作成するには、 Backbone.Model.extend() を使う。
// extend() の引数に、メンバー定義を渡す。
// 戻り値はコンストラクタ関数になっていて、 new でインスタンスを生成できる。


// extend（関数）した物を変数MyModelに入れる
var MyModel = Backbone.Model.extend({
  // defaultsプロパティでデフォルトの値を定義する
  // defaults:の中身はオブジェクトなので{ } で囲む。
  defaults: {
    // オブジェクトの中身は連想配列形式でプロパティ名:値
    // Date()関数をnewして現在日付のインスタンスを生成してdateTimeというプロパティに格納
    dateTime: new Date().toISOString()
  },
  // initializeプロパティ
  // newした時に最初に呼ばれる処理を initializeプロパティ、constructorプロパティで定義
  // 両方定義する場合はinitializeの後にconstructor
  // https://backbonejs.org/#Model-constructor
  initialize: function (attrs, options) {
    console.log("attrs", attrs);
    console.log("options", options);
    // new Model([attributes], [options])
    // attributesはDBに保存する情報
    // optionsはjsの中だけで使う情報
  },
  // validateプロパティ
  // https://backbonejs.org/#Model-validate
  validate: function (attrs) {
    // 引数で渡されたattrs（アトリビューツ）をバリデーションチェック
    // attrsにtextプロパティがない場合、またはtextプロパティの中身の長さが0ならメッセージをリターン
    if (!attrs.text || attrs.text.length === 0) {
      console.log("入力されていません");
      // return "入力されていません";
    }
  },
  // その他の処理（好きな名前でOK）
  method: function () {
    console.log('Hello Model!!');
    // .has()はプロパティが存在するかを判定するメソッド(true/falseを返す)
    console.log(this.has("name")); // => true
    // .get()はプロパティを取得するメソッド
    console.log(this.get("name")); // => kazukichi
    // this.has()とthis.get()はinitializeのプロパティをチェックする
    console.log(this.has("b")); // => "b"はoptionsのプロパティなのでfalse
    console.log(this.get("b")); // => "b"はoptionsのプロパティなのでundefined
  }
});

// newしてインスタンスを生成、第一引数（attributes)・第二引数(options)で初期値を渡す
// newするとinitializeプロパティの処理→validateプロパティの処理が実行される
var myModel = new MyModel({ name: 'kazukichi', text: 'sample text' }, { b: 2 });
// isValid()でモデルの中身をバリデーション
myModel.isValid();

// method:に書いたmethod関数を実行
myModel.method();
// データベースに保存するような情報 は attrs で渡し、データベースには保存しない設定項目 を渡す場合は options を使う

// さらにnewして別のインスタンスを生成
// jsのスクリプトタグをtextプロパティの値として渡す
var MyModel = new MyModel({ text: "<script>alert('xss');</script>" });
// .get()で中身を取り出すとスクリプトタグをそのまま取得
MyModel.get('text');
console.log('getだと' + MyModel.get('text')); // => <script>alert('xss');</script>
// .escape()で中身を取り出すとサニタイズされる
// クロスサイトスクリプティング攻撃（XSS）を防ぐため、必ずescapeでサニタイズして無効化してから出力する
MyModel.escape('text');
console.log('escapeだと' + MyModel.escape('text')); // => &lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;

// 普通にインスタンスを作るのと変わらない（普通に作るインスタンスにbackboneのメソッドなどが色々くっついている）
// 普通にインスタンスを作る場合
var MyModel2 = function () { };
// プロトタイプでメソッドを定義して関数を入れる（50行目と同じ）
MyModel2.prototype.method = function () {
  console.log('Hello Model!!');
};
// newしてインスタンス化して変数に入れる（64行目と同じ）
var myModel2 = new MyModel2();
// 関数を実行を呼び出す
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

// DOMがロードされたら以下の処理を行う
$(function () {
  // Backbone.view.extend()でビューを作る（1つのHTML）
  // 最低限、el, initialize, renderの3つがあればOK

  var MyView = Backbone.View.extend({
    // プロパティ（タグを定義）
    el: '#app1',　//id属性などのセレクタ
    tagName: 'div', //タグの種類
    className: 'viewClass', //クラス名
    attributes: { 'data-sample': 'bar' }, //データ属性

    // initializeで、newしたら最初に走る設定項目を書いていく
    initialize: function (options) {
      // Modelのinitializeは引数2つだったが、Viewでは1つ
      // インスタンスの生成時に呼ばれる
    },
    // renderメソッド
    render: function () {
      // backboneでは、$elプロパティを使うとjQueryのオブジェクトを呼び出せる
      // 上記のelプロパティで定義したDOM（#app1）が入っている
      // append()はjQueryのメソッド
      this.$el.append('Hello View!!');
      return this;
      // renderの中では必ずreturn this;で自分自身を返す
    }
  });

  // 定義したビューをインスタンス化
  var myView = new MyView();
  // renderメソッドを呼び出す
  myView.render();
});

// ビューを作る際、elプロパティに直接jQueryオブジェクトを入れることもできる
var MyView2 = Backbone.View.extend({
  el: $('#app2') //DOMエレメントをそのまま渡す
});
// インスタンス化
var myView2 = new MyView2();

// ビューを作る時は何も定義せず、インスタンス化する時に引数でelを渡すこともできる
var MyView3 = Backbone.View.extend({});
var myView3 = new MyView3({ el: $("#app3") }); //引数でDOMエレメントを渡す


//=============================================
// eventsプロパティ
//=============================================
// イベントを定義
// jsの addEventListener()
// jQueryだと.On()

// ビューを定義
var MyView4 = Backbone.View.extend({
  el: "#app4",　//elでセレクタを指定
  events: {
    // イベントをセット
    // プロパティにイベント名、値にメソッド名（下記で作ったメソッド）を指定

    // #app4配下の要素をクリックした時のイベント
    "click": "click",
    // #app4 以下の .js-click1をクリックした時のイベント
    "click .js-click1": "click1",
    // #app4 以下の .js-click2をクリックした時のイベント
    "click .js-click2": "click2"
  },

  // メソッド
  click: function () {
    console.log("click");
  },
  click1: function () {
    console.log("click1");
    // .js-click1をクリックすると、親のイベントで"click"が出力され、
    // 自分自身のイベントで"click1"が出力される
  },
  click2: function (e) {
    // eでイベントの変数を引数として指定して、
    // e.stopPropagation();でイベントの伝播を止めると、
    // 親のイベントclickは実行されないので、"click2"だけ出力される
    e.stopPropagation();
    console.log("click2");
  }
});

// インスタンスを生成
new MyView4();

//=============================================
// backboneでunderscoreのtemplateを使う
//=============================================
var MyView5 = Backbone.View.extend({
  el: $('#app5'), //直接jQueryオブジェクトを入れる

  initialize: function () {
    // インスタンス化したら初期化時にrenderを呼び出す
    this.render();
  },
  render: function () {
    //  _.templateでテンプレート機能を使う
    // '#template1'のDOMのhtmlを取得してtemplateに入れ、変数に格納
    var compiled = _.template($('#template1').html());
    // compiledで呼び出し
    // プロパティname,textをhtml側に渡す
    // $(this.el).htmlで要素を挿入
    $(this.el).html(compiled({ name: 'kazukichi', text: 'sample test' }));

    // ビューのelにセレクタだけ指定した場合は this.$el とダラーをつける
    // ビューのelにjQueryオブジェクトを入れた場合は this.el でOK

  }
});
new MyView5();
