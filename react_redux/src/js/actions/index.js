// TaskのAction
// storeの値を更新する際に、dispatch()を使ってcomponentsからアクションを呼び出すためのもの
// actionはアプリケーションからの情報をstoreへ送る為のオブジェクト
// actionでは、何を行なうものかを識別するために"type"プロパティを必ず持つ。
// 他のプロパティについては自由。

// Action Creator
// 色々なアクションごとに、「更新するstateと値」を定義する
export function addTask(id, text) {
  // 変更する値のみを定義する
  // typeでAction名を定義する。何のアクションなのかがパッとわかるものにする（大文字にするのが一般的）
  // ここで定義したプロパティがreducerへ渡される（idだけならidだけしかreducerには渡らない）
  // データの渡し方が一方向になる
  return {
    type: 'ADD',
    id: id,
    text: text
  };
}

export function deleteTask(id) {
  return {
    type: "DELETE", //シングルクオーテーションでも良い
    id: id
  };
}

export function updateTask(id, text) {
  return {
    type: "UPDATE",
    id: id,
    text: text
  };
}

export function toggleDone(id) {
  return {
    type: "TOGGLE_DONE",
    id: id
  };
}

export function searchTask(text) {
  return {
    type: "SEARCH",
    searchText: text
  };
}

