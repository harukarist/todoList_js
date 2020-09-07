import React from 'react';
import Task from './Task';
import PropTypes from 'prop-types';

// TodoListコンポーネント
class TodoList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // コンテナVisibleTodoListからpropsで値やメソッドを受け取るので、
    // 変数todosとイベント名の変数に格納する（以降の処理で this.props.todosを todosと省略できる）
    const { todos, onClickToggleDone, onClickToggleMust, onClickRemove, onEnterUpdateTask } = this.props;

    // タスクデータを格納する配列
    let normalTasks = [];
    let mustTasks = [];

    for (let i in todos) {
      // this.propsを格納した変数をTaskコンポーネントに渡す
      // ...todos[i]で配列を展開し、個々の要素にpropsで受け取ったメソッドを渡す
      let taskComponent = <Task key={todos[i].id} {...todos[i]}
        onClickToggleDone={() => onClickToggleDone(todos[i].id)}
        onClickToggleMust={() => onClickToggleMust(todos[i].id)}
        onClickRemove={() => onClickRemove(todos[i].id)}
        onEnterUpdateTask={(taskName) => onEnterUpdateTask(todos[i].id, taskName)} />;

      if (!todos[i].isMust) {
        // console.log('normalTask:', todos[i].taskName);
        normalTasks.push(taskComponent);
      } else {
        // console.log('mustTask:', todos[i].taskName);
        mustTasks.push(taskComponent);
      }
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
    PropTypes.shape({ // .shape()で形式を指定
      id: PropTypes.string.isRequired,
      isDone: PropTypes.bool.isRequired,
      isMust: PropTypes.bool.isRequired,
      taskName: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onClickToggleDone: PropTypes.func.isRequired,
  onClickToggleMust: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onEnterUpdateTask: PropTypes.func.isRequired
};

export default TodoList;
// containers/VisibleTodoList の中でTodoListを読み込むため、ここではconnect()は不要
