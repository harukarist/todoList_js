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
      text: this.props.text,
      editMode: false
    };
    // ハンドラを定義、bind()でthisを縛る
    this.handleClickShowEdit = this.handleClickShowEdit.bind(this);
    this.handleKeyUpCloseEdit = this.handleKeyUpCloseEdit.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
  }
  handleChangeText(e) {
    this.setState({
      text: e.target.value
    });
  }
  handleClickShowEdit() {
    this.setState({
      editMode: true
    });
  }
  handleKeyUpCloseEdit(e) {
    if (e.keyCode === 13 && e.shiftKey === true) {
      this.setState({
        text: e.currentTarget.value,
        editMode: false
      });
      // propsで受け取ったTodoList.jsのメソッド（コンテナから渡ってきたもの）を実行
      // dispatch()でIDとタスク名をアクションに通知する
      this.props.onEnterUpdateTask(e.currentTarget.value);
      // Reduxで自動的に連携してくれる
    }
  }
  render() {
    // propsとして受け取ったものを変数として展開
    const { onClickToggleDone, onClickRemove } = this.props;
    // this.props.onClickToggleDone
    // this.props.onClickRemove と同じ

    const classNameLi = ClassNames({
      'list__item': true,
      'list__item--done': this.props.isDone
    });
    const classNameIcon = ClassNames({
      'fa': true,
      'fa-circle-thin': !this.props.isDone,
      'fa-check-circle': this.props.isDone,
      'icon-check': true
    });

    const input = (this.state.editMode) ?
      <input type="text" className="editText" value={this.state.text}
        onChange={this.handleChangeText} onKeyUp={this.handleKeyUpCloseEdit} /> :
      <span onClick={this.handleClickShowEdit}>{this.state.text}</span>;

    return (
      <li className={classNameLi}>
        <i className={classNameIcon} onClick={onClickToggleDone} aria-hidden="true" />
        {input}
        <i className="fa fa-trash icon-trash" onClick={onClickRemove} aria-hidden="true" />
      </li>
    );
  }
}

// propの型を指定
Task.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
  onEnterUpdateTask: PropTypes.func.isRequired,
  onClickToggleDone: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired
};

// Taskではstoreやdispatch()を使わないので、connect()をつけなくてOK
// 親から渡されたメソッドを呼んでるだけ
export default Task;
