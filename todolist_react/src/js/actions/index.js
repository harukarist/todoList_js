// TaskのAction
// storeの値を更新する際にコンポーネントやコンテナからdispatch()を使ってアクションを呼び出す
// アクションはアプリケーションからの情報をstoreへ送る為のオブジェクト
// 何を行なうものかを識別するために必ず"type"プロパティを持たせる。

// Action Creator
// アクションごとに「更新するstateと値」を定義
export function addTask(id, text) {
  // 変更する値のみを定義する
  // ここで定義したプロパティがreducerへ渡される（一方向でデータを渡す）
  return {
    type: 'ADD', //アクション名（大文字にすると見やすい）
    id: id,
    taskName: text
  };
}

export function deleteTask(id) {
  return {
    type: 'DELETE',
    id: id
  };
}

export function updateTask(id, text) {
  return {
    type: 'UPDATE',
    id: id,
    taskName: text
  };
}

export function toggleDone(id) {
  return {
    type: 'TOGGLE_DONE',
    id: id
  };
}

export function toggleMust(id) {
  return {
    type: 'TOGGLE_MUST',
    id: id
  };
}

export function searchTask(text) {
  return {
    type: 'SEARCH',
    searchText: text
  };
}

