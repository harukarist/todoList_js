// reactライブラリを読み込んで変数に割り当てる
import React from 'react';
// Task.jsを読み込んで変数に割り当てる
import Task from './Task';
// lodashライブラリを変数_に割り当てる（underscoreと同等のライブラリなので）
import _ from 'lodash';

// TodoListコンポーネント（タスク1つ1つをまとめた親要素。個々のタスクを管理するのに必要）
// 先頭にexport をつけることで、app.jsのimport {TodoList}で読み込みできる
export class TodoList extends React.Component {

  // クラスが1つしかない場合は、export defaultとすると
  // 呼び出し元のapp.jsで中カッコを使わずに 
  // import TodoList from …とできる
  // export default class TodoList extends React.Component {


  // コンストラクタ
  constructor(props) {
    super(props);
    this.state = {
      // dataプロパティにコレクション（オブジェクトがデータとして入った配列）を入れる
      data: [
        {
          id: 0, //タスクのID （一意のキーで管理する）
          text: 'sample todo1'　//タスク名
          // 編集フラグなどは個別タスクのコンポーネントに持たせる
        },
        {
          id: 1,
          text: 'sample todo2'
        }
      ]
    };
    this.handleRemove = this.handleRemove.bind(this);
  }


  // Task.jsでonRemove()を呼び出す際にIDを渡す
  handleRemove(id) {
    // for in などでループしてidをチェックしてもいいが、lodashのrejectメソッドで簡単にチェックできる
    // let data = [];
    // for(let i in this.state.data){
    //   if(this.state.data[i].id !== id){
    //     data.push(this.state.data[i]);
    //   }
    // }

    // DOMを削除するのではなく、タスクのデータを削除するだけ
    // データを削除するとコンポーネントにならないので画面に表示されない（DOMは生成されない）
    // Reactでは仮想DOMの機能を使うことでDOMの取得や操作が必要ない

    // lodashのrejectメソッド（第一引数に検索したいデータ、第二引数に連想配列のオブジェクトの形で検索したいプロパティと値を指定）でデータを検索して除外し、除外した後のデータを変数に再度セットして、setState()で更新
    // setStateすると自分自身のrenderが走って、除外されたあとのデータで再度コンポーネントが作り直される
    // app.jsでTodoListコンポーネントが読み込まれ、タスクリストが表示される
    let data = _.reject(this.state.data, { 'id': id });
    this.setState({
      data: data
    });
  }
  render() {

    // 初期化
    let tasks = [];

    // 自分自身のデータをfor in文で展開
    for (let i in this.state.data) {
      // コンポーネントをループで複数生成する場合は、一意のkeyを指定する必要がある。
      // keyはReactがコンポーネントを一意に識別するためのもの
      // keyにはiかidを指定することが一般的（なんでもいい）

      // タスクのコンポーネントにタスクのデータを渡す

      // push()で配列tasksの1つ1つにTaskのコンポーネントを追加
      // data[i] iで配列のインデックス番号を指定
      tasks.push(<Task key={this.state.data[i].id}
        id={this.state.data[i].id}
        text={this.state.data[i].text} onRemove={this.handleRemove} />);
      // idとtextをpropsで渡すことで、タスクのコンポーネントが複数作られるのでreturnの中で{tasks}で出力

      // Task.jsの中でTaskのConstructorのstateにid,textがあり、this.props.id,this.props.textを格納している
      // Task.jsではthis.props.onRemove(this.state.id)で実行できる
      // ここではonRemoveというメソッド名にしているが、メソッド名はなんでもいい
      // 実際にはthis.handleRemoveというコンポーネントのhandleRemoveというメソッドを渡している
    }

    // returnでulタグを吐き出す
    return (
      <ul className="list js-todo_list">
        {tasks}
      </ul>
    );
  }
}
