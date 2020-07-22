// reactライブラリを読み込んで変数に割り当てる
import React from 'react';
// Task.jsを読み込んで変数に割り当てる
import Task from './Task';
//前回までlodashライブラリを変数_（underscoreと同等のライブラリなので）に割り当てていたが
//親のapp.jsにタスク削除を移動したため不要

// TodoListコンポーネント（タスク1つ1つをまとめた親要素。個々のタスクを管理するのに必要）
// 先頭にexport をつけることで、app.jsのimport {TodoList}で読み込みできる

// クラスが1つしかない場合は、export defaultとすると
// 呼び出し元のapp.jsで中カッコを使わずに
// import TodoList from …とできる


// TodoListコンポーネント（1つ1つのタスクを包括）
export default class TodoList extends React.Component {

  // コンストラクタ
  constructor(props) {
    super(props);
    //this.stateのdata配列は削除（他の子コンポーネントでも使うので、親のTodoAppコンポーネントで持つ）
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleRemove(id) {
    this.props.callBackRemoveTask(id);
    //  タスク削除も親コンポーネントで行う
  }
  render() {

    // 初期化
    let tasks = [];
    // propsで親から渡されたタスクのdataをfor in文で展開
    // 前回はstateだったが、親コンポーネントにdataを持たせたのでpropsに変更
    for (let i in this.props.data) {
      // コンポーネントをループで複数生成する場合は、一意のkeyを指定する必要がある。
      // keyはReactがコンポーネントを一意に識別するためのもの
      // keyにはiかidを指定することが一般的（なんでもいい）

      // push()で配列tasksの1つ1つにTaskのコンポーネントを追加
      // data[i] iで配列のインデックス番号を指定
      tasks.push(<Task key={this.props.data[i].id}
        id={this.props.data[i].id}
        text={this.props.data[i].text} onRemove={this.handleRemove} />);
    }
    // idとtextをpropsで渡すことで、タスクのコンポーネントが複数作られるのでreturnの中で{tasks}で出力

    // Task.jsの中でTaskのConstructorのstateにid,textがあり、this.props.id,this.props.textを格納している
    // Task.jsではthis.props.onRemove(this.state.id)で実行できる
    // ここではonRemoveというメソッド名にしているが、メソッド名はなんでもいい
    // 実際にはthis.handleRemoveというコンポーネントのhandleRemoveというメソッドを渡している

    // returnでulタグを吐き出す
    return (
      <ul className="list js-todo_list">
        {tasks}
      </ul>
    );
  }
}
