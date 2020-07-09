import React from 'react';
import ClassNames from 'classnames';

export default class Task extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      text: this.props.text,
      isDone: false,
      editMode: false
    };
    this.handleClickToggleDone = this.handleClickToggleDone.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
    this.handleClickshowEdit = this.handleClickshowEdit.bind(this);
    this.handleKeyUpCloseEdit = this.handleKeyUpCloseEdit.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
  }
  handleChangeText(e){
    this.setState({
      text: e.target.value
    });
  }
  handleClickToggleDone () {
    this.setState(prevState => ({
      isDone: !prevState.isDone
    }));
  }
  handleClickRemove(e) {
    // 親から渡ってきた関数を実行することで、親へどのitemを削除するのか通知する
    this.props.onRemove(this.state.id);

    // 自身で削除できなくもない
    // $(e.target).parent('.list__item').remove();
  }
  handleClickshowEdit() {
    this.setState({
      editMode: true
    });
  }
  handleKeyUpCloseEdit(e) {
    if(e.keyCode === 13 && e.shiftKey === true){
      this.setState({
        text: e.currentTarget.value,
        editMode: false
      });
    }
  }
  componentWillUnmountWillMount(){
    console.log('componentWillUnmountWillMount');
  }
  render() {
    // reactにはclassを付け替えする機能はないので、外部ライブラリを使う
    const classNameLi = ClassNames({
      'list__item': true,
      'list__item--done': this.state.isDone
    });
    const classNameIcon = ClassNames({
      'fa': true,
      'fa-circle-thin': !this.state.isDone,
      'fa-check-circle': this.state.isDone,
      'icon-check': true
    });
    // underscoreのようなif文は使えないので、変数に前もって入れておく
    const input = (this.state.editMode) ?
      <input type="text" className="editText" value={this.state.text}
             onChange={this.handleChangeText} onKeyUp={this.handleKeyUpCloseEdit}/> :
      <span onClick={this.handleClickshowEdit}>{this.state.text}</span>;

    return (
      <li className={classNameLi}>
        <i className={classNameIcon} onClick={this.handleClickToggleDone} aria-hidden="true" />
        {input}
        <i className="fa fa-trash icon-trash" onClick={this.handleClickRemove} aria-hidden="true" />
      </li>
    );
  }
}
