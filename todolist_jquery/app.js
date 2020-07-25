
// -----------------------------------------
// タスク追加
$('.js-add-todo').on('click', addTask);

$('.js-form-val').keydown(function (e) {
  // 押されたキーコードを保存
  keyDownCode = e.keyCode;
});
$('.js-form-val').keyup(function (e) {
  // keyupもkeydownも13の場合(日本語入力確定後にEnterキーが押された場合)
  // 日本語確定Enterのkeydownは229
  if (e.keyCode === 13 && e.keyCode === keyDownCode) {
    addTask();
  }
});

function addTask(e) {
  // 入力フォームの値を取得して変数に格納し、中身を空にする
  var taskName = $('.js-form-val').val();
  $('.js-form-val').val('');
  // 入力が空の場合は .show()でエラーメッセージを表示し、その後の処理を行わない
  if (!taskName) {
    $('.js-toggle-error').show();
    return;
  }
  // タスクが入力されている場合は .hide()でエラーメッセージを隠す
  $('.js-toggle-error').hide();

  // リスト表示用のhtmlタグを生成
  var listItem = '<li class="todoList__item js-todoList-item" data-task-name="' + taskName + '">' +
    '<i class="far fa-star icon-star js-click-to-must" aria-hidden="true"></i>' +
    '<i class="far fa-square icon-checkbox js-click-to-done" aria-hidden="true"></i>' +
    '<span class="todoList__taskName js-todoList-taskName">' + taskName + '</span>' +
    '<input type="text" class="todoList__editBox js-todoList-editName" value="' + taskName + '">' +
    '<i class="fas fa-trash-alt icon-trash js-click-to-remove" aria-hidden="true"></i>' +
    '</li>';

  // ul要素のDOMを取得して、prepend()メソッドで子要素の先頭にリストを追加
  $('.js-todoList-normal').prepend(listItem);

}


// -----------------------------------------
// タスクを完了に変更
// $(document).on() で後から追加した要素も対象とする
$(document).on('click', '.js-click-to-done', function () {
  $(this).removeClass('fa-square').addClass('fa-check-square')
    .removeClass('js-click-to-done').addClass('js-click-to-todo')
    .closest('.js-todoList-item').addClass('todoList__item--done');
});

// -----------------------------------------
// タスクを未完了に戻す
$(document).on('click', '.js-click-to-todo', function () {
  $(this).addClass('fa-square').removeClass('fa-check-square')
    .addClass('js-click-to-done').removeClass('js-click-to-todo')
    .closest('.js-todoList-item').removeClass('todoList__item--done');
});

// -----------------------------------------
// タスクに重要チェックをつける
$(document).on('click', '.js-click-to-must', function () {
  $(this).removeClass('far').addClass('fas')
    .removeClass('js-click-to-must').addClass('js-click-to-normal');
  var $listItem = $(this).closest('.js-todoList-item');
  // 子要素の先頭に移動
  $listItem.animate(300, 'swing', function () {
    $listItem.addClass('todoList__item--must');
    $listItem.prependTo('.js-todoList-must');
  });


});
// -----------------------------------------
// タスクの重要チェックを外す
$(document).on('click', '.js-click-to-normal', function () {
  $(this).removeClass('fas').addClass('far')
    .removeClass('js-click-to-normal').addClass('js-click-to-must');
  var $listItem = $(this).closest('.js-todoList-item');
  $listItem.animate(300, 'swing', function () {
    $listItem.removeClass('todoList__item--must');
    $listItem.prependTo('.js-todoList-normal');
  });
});
// -----------------------------------------
// タスク削除
$(document).on('click', '.js-click-to-remove', function () {
  // .closest()で一番近い親のDOMを探し、remove()でリストを削除
  $(this).closest('.js-todoList-item').fadeOut(300, 'swing', function () {
    this.remove();
  });
});

// -----------------------------------------
// タスクの編集
// タスク名がクリックされた時
$(document).on('click', '.js-todoList-taskName', function () {
  // タスク名thisをhide()で非表示にし、siblings()で兄弟要素の編集ボックスを探してshow()で表示
  $(this).hide().siblings('.js-todoList-editName').show();
});

// 編集ボックスのフォーカスが外れた時
$('.js-todoList-editName').blur(function () {
  var $this = $(this);
  editTask($this);
});

var keyDownCode = 0;
$(document).on('keydown', '.js-todoList-editName', function (e) {
  // 押されたキーコードを保存
  keyDownCode = e.keyCode;
});
$(document).on('keyup', '.js-todoList-editName', function (e) {
  // keyupもkeydownも13の場合(日本語入力確定後にEnterキーが押された場合)
  // 日本語確定Enterのkeydownは229
  if (e.keyCode === 13 && e.keyCode === keyDownCode) {
    var $this = $(this);
    editTask($this);
  }
});

function editTask($this) {
  // 編集ボックス$thisを非表示にし、siblings()で兄弟要素のタスク名を取得してtext()で入力された値に書き換えて表示
  // closest()で親要素のlistItemを取得し、attr()でdata属性の値を入力された値に書き換え
  $this.text($this.val()).hide().siblings('.js-todoList-taskName').text($this.val()).show()
    .closest('.js-todoList-item').attr('data-task-name', $this.val());
};

// -----------------------------------------
// タスクの検索
// 検索ボックスに入力された時
$('.js-searchTasks').on('keyup', function () {
  var searchText = $(this).val();

  // リストのDOMを全て取得してshow()で表示し、each()でDOMを1つずつ操作
  // each(第一引数にインデックスi, 第二引数に取得した要素elm)
  $('.js-todoList-item').show().each(function (i, elm) {
    // data属性に格納されたタスク名を取得
    var taskName = $(elm).data('taskName');
    // 正規表現のオブジェクトを生成（部分一致）
    var regexp = new RegExp('^(?=.*' + searchText + ').*$');
    // var regexp = new RegExp('^' + searchText);

    // match()で一致するかを判定
    if (taskName && taskName.match(regexp)) {
      // 一致したらtrueを返して次の要素へ
      return true;
    }
    // 一致しなかったらhide()でエレメントを非表示にする
    $(elm).hide();
  });

});

// タスクのソート
$(function () {
  $('.js-sortable').sortable({
    axis: 'y'
  });
});
