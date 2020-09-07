
// -----------------------------------------
// タスク追加
$('.js-add-todo').on('click', addTask);

$('.js-form-val').keydown(function (e) {
  // keydown時のkeyCodeを保存
  keyDownCode = e.keyCode;
});
$('.js-form-val').keyup(function (e) {
  // keyupもkeydownも13の場合(Enterのkeydownは日本語入力確定時は229,通常13)
  if (e.keyCode === 13 && e.keyCode === keyDownCode) {
    addTask();
  }
});

function addTask(e) {
  // 入力フォームの値を変数に格納し、入力フォームを空に
  var taskName = $('.js-form-val').val();
  $('.js-form-val').val('');
  // 入力が空の場合はエラーメッセージを表示し、その後の処理を行わない
  if (!taskName) {
    $('.js-toggle-error').show();
    return;
  }
  // タスクが入力されている場合はエラーメッセージを隠す
  $('.js-toggle-error').hide();

  // リスト表示用のhtmlタグを生成
  var listItem = '<li class="todoList__item js-todoList-item" data-task-name="' + taskName + '">' +
    '<i class="far fa-star icon-star js-click-to-must" aria-hidden="true"></i>' +
    '<i class="far fa-square icon-checkbox js-click-to-done" aria-hidden="true"></i>' +
    '<span class="todoList__taskName js-todoList-taskName">' + taskName + '</span>' +
    '<input type="text" class="todoList__editBox js-todoList-editName" value="' + taskName + '">' +
    '<i class="fas fa-trash-alt icon-trash js-click-to-remove" aria-hidden="true"></i>' +
    '</li>';
  // 通常リストの子要素の先頭にリストを追加
  $('.js-todoList-normal').prepend(listItem);

}


// 後から作成したDOMも対象となるよう、以降は$(document).on() でイベントを作る
// -----------------------------------------
// タスクを完了に変更
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
// 重要タスクに変更
$(document).on('click', '.js-click-to-must', function () {
  // 重要アイコンに変更
  $(this).removeClass('far').addClass('fas')
    .removeClass('js-click-to-must').addClass('js-click-to-normal');
  // 親のli要素を取得してクラスを変更し、重要リストに移動
  var $listItem = $(this).closest('.js-todoList-item');
  $listItem.animate(300, 'swing', function () {
    $listItem.addClass('todoList__item--must');
    $listItem.prependTo('.js-todoList-must');
  });


});
// -----------------------------------------
// 通常タスクに変更
$(document).on('click', '.js-click-to-normal', function () {
  // 通常アイコンに変更
  $(this).removeClass('fas').addClass('far')
    .removeClass('js-click-to-normal').addClass('js-click-to-must');
  // 
  // 親のli要素を取得してクラスを変更し、通常リストに移動
  var $listItem = $(this).closest('.js-todoList-item');
  $listItem.animate(300, 'swing', function () {
    $listItem.removeClass('todoList__item--must');
    $listItem.prependTo('.js-todoList-normal');
  });
});
// -----------------------------------------
// タスク削除
$(document).on('click', '.js-click-to-remove', function () {
  // 一番近い親のDOMを探し、remove()でリストを削除
  $(this).closest('.js-todoList-item').fadeOut(300, 'swing', function () {
    this.remove();
  });
});

// -----------------------------------------
// タスクの編集
$(document).on('click', '.js-todoList-taskName', function () {
  // タスク名のDOMを非表示にし、兄弟要素の編集ボックスを表示
  $(this).hide().siblings('.js-todoList-editName').show();
});

// 編集ボックスのフォーカスが外れた時
$('.js-todoList-editName').blur(function () {
  var $this = $(this);
  editTask($this);
});

var keyDownCode = 0;
$(document).on('keydown', '.js-todoList-editName', function (e) {
  keyDownCode = e.keyCode;
});
$(document).on('keyup', '.js-todoList-editName', function (e) {
  if (e.keyCode === 13 && e.keyCode === keyDownCode) {
    var $this = $(this);
    editTask($this);
  }
});

function editTask($this) {
  // 編集ボックスを非表示にし、兄弟要素のタスク名DOMを入力された値に書き換えて表示
  // 親要素のタスクを取得し、data属性の値を入力された値に書き換え
  $this.text($this.val()).hide().siblings('.js-todoList-taskName').text($this.val()).show()
    .closest('.js-todoList-item').attr('data-task-name', $this.val());
};

// -----------------------------------------
// タスクの検索
// 検索ボックスに入力された時
$('.js-searchTasks').on('keyup', function () {
  var searchText = $(this).val();

  // リストのDOMを全て表示し、each()で1つずつ操作
  $('.js-todoList-item').show().each(function (i, elm) {
    // data属性のタスク名を取得
    var taskName = $(elm).data('taskName');
    // 入力された値から正規表現オブジェクトを生成（部分一致）
    var regexp = new RegExp('^(?=.*' + searchText + ').*$');
    // DOMのタスク名と正規表現が一致したら次の要素へ
    if (taskName && taskName.match(regexp)) {
      return true;
    }
    // 一致しなかったらDOMを非表示に
    $(elm).hide();
  });

});

// タスクのソート
$(function () {
  $('.js-sortable').sortable({
    axis: 'y'
  });
});
