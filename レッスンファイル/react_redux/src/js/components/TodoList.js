import React from 'react';
import Task from './Task';
import PropTypes from 'prop-types';

class TodoList extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    // VisibleTodoListコンテナからpropsでメソッドが色々渡されるので、this.propsを変数に入れる
    // 中カッコの中にイベント名の変数を入れる
    const { todos, onClickToggleDone, onClickRemove, onEnterUpdateTask } = this.props;

    // todosはstoreにあったtodoのデータをpropsで受け取る
    // 変わった後のタスクのデータはtodosに入る

    let tasks = [];
    for (let i in todos) {
      // 上記でthis.propsを変数に格納しているので、this.props.todos[i]と書く必要がなくなる
      // [i]はインデックス番号
      // 三点リーダーで{...todos[i]} とすると、todosの中身を全部展開して、Taskコンポーネントに全ての属性(id,isDone,text)を渡せる
      tasks.push(<Task key={todos[i].id} {...todos[i]}
        onClickToggleDone={() => onClickToggleDone(todos[i].id)}
        onClickRemove={() => onClickRemove(todos[i].id)}
        onEnterUpdateTask={(text) => onEnterUpdateTask(todos[i].id, text)} />);
      // 上記で作ったonClickToggleDone, onClickRemove, onEnterUpdateTaskをpropsで渡す
      // {}にアロー関数を入れて、propsで取り出したonClickToggleDone, onClickRemove, onEnterUpdateTaskメソッドをfunctionで渡す
      // 引数としてタスクのデータtodosのidを渡す

      // タスクの中でonClickToggleDoneを実行すると、実際はこのTodoListコンポーネントのpropsのonClickToggleDoneメソッドが実行され、引数としてタスクのIDが渡される

      // Reduxなしだと
      // tasks.push(<Task key={this.props.data[i].id}
      //   id={this.props.data[i].id}
      //   text={this.props.data[i].text} onRemove={this.handleRemove} />);
    }

    return (
      <ul className="list js-todo_list">
        {tasks}
      </ul>
    );
  }
}

// Propsの型の指定
TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    // .shape()は、形式を指定するもの
    PropTypes.shape({
      id: PropTypes.string.isRequired, //string型
      isDone: PropTypes.bool.isRequired, //boolean型
      text: PropTypes.string.isRequired //string型
    }).isRequired
  ).isRequired,
  onClickToggleDone: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onEnterUpdateTask: PropTypes.func.isRequired
};

// コンテナ VisibleTodoList の中でTodoListを読み込むため、
// TodoListではconnect()は使わない
export default TodoList;
