import { combineReducers } from "redux" //  reduxライブラリのcombineReducersメソッド
import task from "./Task" // 子のreducer

// 子のreducerを結合する
const reducer = combineReducers({
  task,
  // task2,
  // task3
});

// export
export default reducer;
