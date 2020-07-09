import React from 'react';
import ReactDOM from 'react-dom';
import TodoList from './components/TodoList'
import TodoCreator from './components/TodoCreater'

class TodoApp extends React.Component {

  constructor(){
    super();
    this.state = {
      data: [
        {
          id: this.createHashId(),
          text: 'sample todo1'
        },
        {
          id: this.createHashId(),
          text: 'sample todo2'
        }
      ]
    };
    this.callBackRemoveTask = this.callBackRemoveTask.bind(this);
    this.callBackAddTask = this.callBackAddTask.bind(this);
  }

  createHashId(){
    // 完全に一意なキーは生成できないので注意！
    // 一意なキーにしたいなら外部ライブラリを使うか、このコンポーネントで...【課題】
    return Math.random().toString(36).slice(-16);
  }

  callBackRemoveTask(id){
    let data = _.reject(this.state.data, { 'id': id });
    this.setState({
      data: data
    });
  }

  callBackAddTask(val){
    // 新たにタスク追加する際にidを振る必要があるが、idを配列の順番号にしてしまうとタスクが削除された際に同じidが振られてしまう
    // const data = [
    //   {
    //     id: 0
    //   },
    //   {
    //     id: 1
    //   },
    //   {
    //     id: 2
    //   }
    // ];
    let nextData = this.state.data;
    nextData.push({ id: this.createHashId(), text: val });
    this.setState({
      data: nextData
    });
  }

  render() {
    return (
      <div>

        <TodoCreator callBackAddTask={this.callBackAddTask}/>

        <div className="searchBox">
          <i className="fa fa-search searchBox__icon" aria-hidden="true" />
          <input type="text" className="searchBox__input js-search"
                 value="" placeholder="somothing keyword" />
        </div>

        <TodoList data={this.state.data} callBackRemoveTask={this.callBackRemoveTask}/>

      </div>
    );
  }
}

ReactDOM.render(
  <TodoApp/>,
  document.getElementById('app')
);