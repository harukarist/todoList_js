import React from 'react';
import PropTypes from 'prop-types';　//propsの型チェック
import ClassNames from 'classnames'; //cssクラスを生成

// Taskコンポーネント
// 親のTodoListコンポーネントから受け取った、propsのコールバック関数を実行
class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: this.props.taskName,
      isEdit: false
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
      isEdit: true
    });
  }
  handleKeyUpCloseEdit(e) {
    if (e.keyCode === 13) {
      this.setState({
        taskName: e.currentTarget.value,
        isEdit: false
      });
      // propsで受け取ったコンテナのメソッドを実行
      this.props.onEnterUpdateTask(e.currentTarget.value);
      // コンテナのdispatch()でIDとタスク名がアクションに通知される（Reduxで自動連携）
    }
  }
  render() {
    // propsをイベント名の変数に格納
    const { onClickToggleDone, onClickToggleMust, onClickRemove } = this.props;

    // classnamesライブラリでcssクラスを生成
    const taskClass = ClassNames({
      'todoList__item': true,
      'todoList__item--done': this.props.isDone,
      'todoList__item--must': this.props.isMust
    });
    const checkIconClass = ClassNames({
      'far': true,
      'fa-square': !this.props.isDone,
      'fa-check-square': this.props.isDone,
      'icon-checkbox': true
    });
    const mustIconClass = ClassNames({
      'fas': this.props.isMust,
      'far': !this.props.isMust,
      'fa-star': true,
      'icon-star': true
    });

    // 編集中の場合は編集ボックス、そうでない場合はタスク名表示のDOMを格納
    const taskContent = (this.state.isEdit) ?
      <input type="text" className="todoList__editBox" value={this.state.taskName}
        onChange={this.handleChangeName} onKeyDown={this.handleKeyUpCloseEdit} /> :
      <span className="todoList__taskName" onClick={this.handleClickShowEdit}>{this.state.taskName}</span>;

    return (
      <li className={taskClass}>
        <i className={checkIconClass} onClick={onClickToggleDone} aria-hidden="true" />
        {taskContent}
        <i className={mustIconClass} onClick={onClickToggleMust} aria-hidden="true" />
        <i className="fas fa-trash-alt icon-trash" onClick={onClickRemove} aria-hidden="true" />
      </li>
    );
  }
}

// propsの型チェック
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

export default Task;
// Reduxのstoreやdispatch()を使わないのでconnect()は不要
