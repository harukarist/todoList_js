// 【はじめに】
// TODOアプリにはjsでのDOM操作の全てが詰まっている！
// イベントセット、要素の取得、追加、削除、変更、表示、非表示、アニメーション

// デザイン上のクラス名とjs操作用のクラス名は分けること！

// 【やること】
// 1. TODOを追加ボタンを押下した際にタスクを追加する
// 2. TODOタスクのチェックボックスアイコンを押下した際にタスクをDONEにする
// 3. DONEタスクのチェックボックスアイコンを押下した際にタスクをTODOタスクに戻す
// 4. ゴミ箱アイコンを押下した際にタスクを削除する
// 5. TODOタスクのテキストをクリックした際に文字列を入力できるようにし、shift+Enterで修正を確定する
// 6. 検索エリアに値を入力した際に、タスクの中から値にマッチするタスクのみ表示させる


// ------------------------------------------------------------------------
//【1. TODOを追加を押下したらタスクを追加する】
// 1. 「TODOを追加」ボタンを押下した際にイベントを発火
// 2. inputの値を取得（取得したらクリアする）
// 3. inputの値をlistのitemに追加する（DOM生成）

// 「TODOを追加」ボタンが押された時
// 第一引数にイベント名、第二引数に行う処理
// function(e)のeはエレメントオブジェクト（イベントのエレメントが渡される）

$('.js-add-todo').on('click', function (e) {
  // formタグを使っているので、buttonをクリックすると送信(submit)されてindex.htmlがリロードされてしまう
  // submitされないようにe.preventDefault()でイベントをキャンセルする
  e.preventDefault();

  // inputの値を.val()で取得して変数textに格納し、中身を空にする
  // 値の取得は .val()
  // 値のクリアは .val('')
  var text = $('.js-get-val').val();
  $('.js-get-val').val('');

  // 入力が空の場合（変数textがfalseの場合＝inputの値が空の場合）
  if (!text) {
    // .show()で非表示にしているエラーメッセージを表示したあと、returnでif文を抜ける（その後の処理を行わない）
    $('.js-toggle-error').show();
    return;
  }

  // .hide()でエラーメッセージを隠す（前回入力した時のエラーが表示されている場合があるので）
  $('.js-toggle-error').hide();


  // hide()   要素を非表示
  // show()   要素を表示
  // toggle() 表示・非表示を切替え

  // remove() 子要素を含めて要素を丸ごと削除
  // empty()  要素の子要素を削除
  // unwrap() 要素の親要素のみ削除



  // リスト表示用のhtmlタグを変数に格納
  // htmlタグはシングルクオーテーション''で囲って文字列にする
  // 文字列と変数は + で連結
  // data属性（data-text）としてフォームに入力された値を入れる
  var listItem = '<li class="list__item js-todo_list-item" data-text="' + text + '">' +
    '<i class="fa fa-square-o icon-check js-click-to-done" aria-hidden="true"></i>' +

    '<span class="js-todo_list-text">' + text + '</span>' +
    '<input type="text" class="editText js-todo_list-editForm" value="' + text + '">' +
    '<i class="fa fa-trash icon-trash js-click-trash" aria-hidden="true"></i>' +
    '</li>';

  // ulタグのDOMを取得して、prepend()メソッドで子要素の先頭にhtmlタグの文字列が入った変数listItemを追加する
  $('.js-todo_list').prepend(listItem);

  // $(対象).before(追加する要素)   対象の要素の前に追加
  // $(対象).after(追加する要素)    対象の要素の後ろに追加
  // $(対象).prepend(追加する要素)  対象の要素の子要素の先頭に追加
  // $(対象).append(追加する要素)   対象の要素の子要素の後ろに追加

});

// ------------------------------------------------------------------------
//【2. チェックボックスアイコンを押下したらタスクをDONEにする】

// 1. TODOタスクのチェックボックスアイコンを押下した際にイベントを発火
// 2. クリックしたDOM（アイコン）をdoneのアイコンに変更
// 3. クリックしたDOM（アイコン）のjs-click-to-doneのクラス名を削除し、js-click-to-todoのクラス名をつける
// 4. クリックしたDOM（アイコン）から辿って、親のDOMであるlist__itemを取得
// 5. list__itemのクラス名をdoneのものに変更する

// $(document).on() を使う！
// $('.js-click-to-done').onだと、後から追加した要素は対象にならない（イベントがセットされない）ので
// $(document).onとして「ドキュメント全体」を対象にして、第二引数で対象をセレクタ '.js-click-to-done'に限定する

$(document).on('click', '.js-click-to-done', function () {
  // ピリオドでメソッドをつなげて、クリックしたDOM（アイコン）のクラスを同時に変更
  // アイコンにfa-check-square、js-click-to-todoのクラス名をつける
  // .closest()で親のDOMから.js-todo_list-itemを取得して、doneのクラス名を追加する
  $(this).removeClass('fa-square-o').addClass('fa-check-square')
    .removeClass('js-click-to-done').addClass('js-click-to-todo')
    .closest('.js-todo_list-item').addClass('list__item--done');

  // .parent()  「1つ上の階層」の要素を取得
  // .closest() 「一番近い親」の要素を取得
  // .parents()  全ての親要素から取得

});

// ------------------------------------------------------------------------
//【3. DONEタスクのチェックボックスアイコンを押下したら未完了のTODOタスクに戻す】
// 1. DONEタスクのチェックボックスアイコンを押下した際にイベントを発火
// 2. クリックしたDOM（アイコン）をtodoのアイコンに変更
// 3. クリックしたDOM（アイコン）にjs-click-to-doneのクラス名を追加し、js-click-to-todoのクラス名を削除する
// 4. クリックしたDOM（アイコン）から辿って、list__itemのDOMを取得
// 5. list__itemのクラス名をtodoのものに変更する

$(document).on('click', '.js-click-to-todo', function () {
  // チェックボックスのクラスを変更し、親であるリストのDOMからdoneクラスを外す
  $(this).addClass('fa-square-o').removeClass('fa-check-square')
    .addClass('js-click-to-done').removeClass('js-click-to-todo')
    .closest('.js-todo_list-item').removeClass('list__item--done');
});

// ------------------------------------------------------------------------
//【4. ゴミ箱アイコンを押下したらタスクを削除する】
// 1. ゴミ箱アイコンを押下したらイベントを発火
// 2. クリックしたDOM（アイコン）から辿って、親のDOMであるlist__itemを取得し、削除する

$(document).on('click', '.js-click-trash', function () {
  // .closest()で一番近い親のDOMを探し、remove()でリストを削除
  // パッと削除されるとお洒落じゃないのでfadeOutでアニメーションしながら消えるようにする
  $(this).closest('.js-todo_list-item').fadeOut('slow', function () {
    this.remove();
    // fadeOutメソッド
    // 第一引数 速度を'slow'と指定
    // 第二引数 アニメーション終了後の処理を「コールバック関数」で指定
  });
});

// ------------------------------------------------------------------------
//【5. TODOタスクのテキストをクリックした際に入力できるようにし、修正可能にする】
// 1. テキストを押下した際にイベントを発火
// 2. クリックしたDOM（テキスト）を非表示にし、兄弟要素である編集エリアを表示する

$(document).on('click', '.js-todo_list-text', function () {
  // hide()メソッドでthis(spanタグのDOM)を非表示にして、
  // siblings()で兄弟要素から編集エリアのDOMを探し、show()で表示
  $(this).hide().siblings('.js-todo_list-editForm').show();

});

// 3. 編集エリア内でkeyupしたらイベントを発火
// 4. Shift+Enterを押したら値をリストにも反映し、編集エリアは非表示に、テキストは表示する

// イベントのエレメントeを取得
// 「キーコード」でどのキーが押されたかを判別
// エレメントオブジェクトe.keyCodeにどのキーが押されたかの情報が格納されている（Enterキーは13）
// エレメントオブジェクトe.shiftKeyにshiftキーが押されたかの情報が格納されている（shiftキーが押されたらtrue）

$(document).on('keyup', '.js-todo_list-editForm', function (e) {
  // Enterとshiftが押されていたら
  if (e.keyCode === 13 && e.shiftKey === true) {
    var $this = $(this);
    // 編集エリアのDOMを変数に格納
    // 2回以上$(this)を使う場合は、変数$thisに入れてキャッシュする

    // 編集エリア$thisを非表示にして、siblings()で兄弟要素のテキストspanタグを取得し、
    // text()で中身を書き換え
    // 編集エリア$thisの値をval()で取得してshow()で表示
    // closest()で親要素のlistItemを取得して、
    // attr()でdata属性'data-text'に編集エリア$thisの値をセットする
    // ※ 確定処理（タスク名の更新処理）
    $this.hide().siblings('.js-todo_list-text').text($this.val()).show()
      .closest('.js-todo_list-item').attr('data-text', $this.val());

    // data属性を操作するには、data()とattr()での2通りの方法がある
    // ・data()はhtmlには反映されない。「jQueryオブジェクト内のdataプロパティ」に対しての操作。
    // ・attr()はhtmlに反映される。htmlオブジェクト（DOM）に対しての操作。
  }

});

// ------------------------------------------------------------------------
//【6. 検索エリアに値を入力したら、タスクの中から値にマッチするタスクのみ表示】
// 1. 検索エリアに入力があった際(keyup)にイベントを発火
// 2. 全てのlist__itemのDOMを取得し、一つ一つループで展開
// 3. 正規表現で値にマッチするかを判定し、マッチしないものを非表示にする

// 検索エリアに入力されたら
$('.js-search').on('keyup', function () {
  // 入力中にリアルタイムで表示するなら'keyup'を使う。
  // 'change' だと、フォーカスアウトした時にイベントが走る。

  // 検索エリアの値を変数に格納
  var searchText = $(this).val();

  // .js-todo_list-itemのDOMを全て取得して、show()で全て表示
  // each()の中に関数を入れてループを回す
  // 第一引数にインデックスi（ループの何回目か）
  // 第二引数にループで取り出したエレメントelm（取得した1つ1つのDOM）
  $('.js-todo_list-item').show().each(function (i, elm) {
    // 取得したDOMのdata属性data-textの値を取得（取得するだけならdata()でOK）
    // data('text')でdata-textの属性を取得
    var text = $(elm).data('text');

    // new RegExpでオブジェクトを作る（正規表現の中で変数を使うにはオブジェクトにする必要あり）
    // キャレット'^' を使うと前方一致になる（ここから始まるよ）
    // jsのmatch()メソッドで一致するかを判定
    if (text && text.match(new RegExp('^' + searchText))) {
      // if (text && text.match(new RegExp('^' + searchText + '[a-zA-Z0-9]'*))) {
      // '[a-zA-Z0-9]'* をつけると、「a-zA-Z0-9のいずれかが0文字または1文字以上」という意味
      // * は０回以上続く場合（続く場合も続かない場合もマッチ）

      // /^abc9*/なら abc8 でも abc9999 でもマッチする。
      // 前方一致なのでabcから始まらないとマッチしない。123abc9だとマッチしない。
      // 「正規表現チェッカー」などで動作チェックする

      // 以下のように一度変数に入れることもできるが無駄なリソースを使うのでまとめて書く
      // var regexp = new RegExp('^' + searchText);
      // if (text && text.match(regexp)) {

      // 一致したらtrueを返してループを回す
      return true;
    }
    // 一致しなかったらhide()でエレメントを非表示にする
    $(elm).hide();
  });

});
