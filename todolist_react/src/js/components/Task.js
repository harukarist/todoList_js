// react,prop-types,classnames読み込み
import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

// Taskコンポーネント
// 親のTodoListコンポーネントから受け取った「propsのコールバック関数」を実行する
class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: this.props.taskName,
      editMode: false
    };
    // ハンドラを定義、bind()でthisを縛る
    this.handleClickShowEdit = this.handleClickShowEdit.bind(this);
    this.handleKeyUpCloseEdit = this.handleKeyUpCloseEdit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
  }
  handleChangeName(e) {
    this.setState({
      taskName: e.target.value
    });
  }
  handleClickShowEdit() {
    this.setState({
      editMode: true
    });
  }
  handleKeyUpCloseEdit(e) {
    if (e.keyCode === 13 && e.keyCode === prevKeyCode) {
      this.setState({
        taskName: e.currentTarget.value,
        editMode: false
      });
      // propsで受け取ったTodoList.jsのメソッド（コンテナから渡ってきたもの）を実行
      // dispatch()でIDとタスク名をアクションに通知する
      this.props.onEnterUpdateTask(e.currentTarget.value);
      // Reduxで自動的に連携してくれる
    }
    let prevKeyCode = e.keyCode;
  }
  render() {
    // propsとして受け取ったものを変数として展開
    // this.props.onClickToggleDone と同じ
    const { onClickToggleDone, onClickToggleMust, onClickRemove } = this.props;

    const classNameLi = ClassNames({
      'todoList__item': true,
      'todoList__item--done': this.props.isDone,
      'todoList__item--must': this.props.isMust
    });
    const classNameCheckIcon = ClassNames({
      'far': true,
      'fa-square': !this.props.isDone,
      'fa-check-square': this.props.isDone,
      'icon-checkbox': true
    });
    const classNameMustIcon = ClassNames({
      'fas': this.props.isMust,
      'far': !this.props.isMust,
      'fa-star': true,
      'icon-star': true
    });

    const taskContent = (this.state.editMode) ?
      <input type="text" className="todoList__editBox" value={this.state.taskName}
        onChange={this.handleChangeName} onKeyUp={this.handleKeyUpCloseEdit} /> :
      <span className="todoList__taskName" onClick={this.handleClickShowEdit}>{this.state.taskName}</span>;

    return (
      <li className={classNameLi}>
        <i className={classNameCheckIcon} onClick={onClickToggleDone} aria-hidden="true" />
        {taskContent}
        <i className={classNameMustIcon} onClick={onClickToggleMust} aria-hidden="true" />
        <i className="fas fa-trash-alt icon-trash" onClick={onClickRemove} aria-hidden="true" />
      </li>
    );
  }
}

// propの型を指定
Task.propTypes = {
  id: PropTypes.string.isRequired,
  taskName: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
  isMust: PropTypes.bool.isRequired,
  onEnterUpdateTask: PropTypes.func.isRequired,
  onClickToggleDone: PropTypes.func.isRequired,
  onClickToggleMust: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired
};

// Taskではstoreやdispatch()を使わないので、connect()をつけなくてOK
// 親から渡されたメソッドを呼んでるだけ
export default Task;
