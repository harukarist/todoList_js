/**
 * reducerは、actionを受けてstateを変更する為のメソッド
 * 大元のrootReducerを作って、他のreducerを結合することが一般的
 * （１ファイルに全部書くと肥大化していくため、importで読み込むようにしているってこと）
 */

//  reduxライブラリのcombineReducersメソッドを取り出す
import { combineReducers } from "redux"

// 他のreducerをimportで読み込む
import task from "./Task" 


// reducerを結合する
const reducer = combineReducers({
  task
  // 複数ある場合は
  // task1,
  // task2,
  // task3
});

export default reducer;
