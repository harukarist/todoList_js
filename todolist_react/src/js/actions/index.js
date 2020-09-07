// TaskのAction
// storeを更新する際に、コンポーネントやコンテナからdispatch()を使って呼び出される。
// reducerで何のアクションか判別できるよう、typeプロパティにアクション名を指定する。

// Action Creator
export function addTask(id, text) {
  return { // Action
    type: 'ADD', //アクション名
    id: id, //reducerへ渡す値
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

