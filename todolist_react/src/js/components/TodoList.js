import React from 'react';
import Task from './Task';
import PropTypes from 'prop-types';

class TodoList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // コンテナVisibleTodoListからpropsでメソッドが色々渡されるので、this.propsを変数に入れる
    // 中カッコの中にイベント名の変数を入れる
    const { todos, onClickToggleDone, onClickToggleMust, onClickRemove, onEnterUpdateTask } = this.props;

    // タスクのデータを格納する配列
    let normalTasks = [];
    let mustTasks = [];

    // todosはstoreにあったtodoのデータをpropsで受け取る
    // 変わった後のタスクのデータはtodosに入る
    for (let i in todos) {
      // 上記でthis.propsを変数に格納しているので、this.props.todos[i]と書く必要がなくなる
      // [i]はインデックス番号
      // 三点リーダーで{...todos[i]} とすると、todosの中身を全部展開して、Taskコンポーネントに全ての属性(id,isDone,taskName)を渡せる

      // 上記でthis.propsを入れた変数をTaskコンポーネントにpropsで渡す
      // {}にアロー関数を入れて、propsで取り出したメソッドをfunctionで渡す（引数としてタスクidやタスク名を渡す）

      if (!todos[i].isMust) {
        console.log('normalTask:', todos[i].taskName);
        normalTasks.push(
          <Task key={todos[i].id} {...todos[i]}
            onClickToggleDone={() => onClickToggleDone(todos[i].id)}
            onClickToggleMust={() => onClickToggleMust(todos[i].id)}
            onClickRemove={() => onClickRemove(todos[i].id)}
            onEnterUpdateTask={(taskName) => onEnterUpdateTask(todos[i].id, taskName)} />
        );
      } else {
        console.log('mustTask:', todos[i].taskName);
        mustTasks.push(
          <Task key={todos[i].id} {...todos[i]}
            onClickToggleDone={() => onClickToggleDone(todos[i].id)}
            onClickToggleMust={() => onClickToggleMust(todos[i].id)}
            onClickRemove={() => onClickRemove(todos[i].id)}
            onEnterUpdateTask={(taskName) => onEnterUpdateTask(todos[i].id, taskName)} />
        );
      }

      // タスクの中でonClickToggleDoneを実行すると、実際はこのTodoListコンポーネントのpropsのonClickToggleDoneメソッドが実行され、引数としてタスクのIDが渡される

      // Reduxなしだと
      // tasks.push(<Task key={this.props.data[i].id}
      //   id={this.props.data[i].id}
      //   taskName={this.props.data[i].taskName} onRemove={this.handleRemove} />);
    }

    return (
      <div>
        <ul className="todoList">
          {mustTasks}
        </ul>
        <ul className="todoList">
          {normalTasks}
        </ul>
      </div>
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
      isMust: PropTypes.bool.isRequired, //boolean型
      taskName: PropTypes.string.isRequired //string型
    }).isRequired
  ).isRequired,
  onClickToggleDone: PropTypes.func.isRequired,
  onClickToggleMust: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onEnterUpdateTask: PropTypes.func.isRequired
};

// コンテナ VisibleTodoList の中でTodoListを読み込むため、
// TodoListではconnect()は使わない
export default TodoList;
