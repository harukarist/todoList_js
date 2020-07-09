import React from 'react';
import Task from './Task';
import _ from 'lodash';

export class TodoList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: [
        {
          id: 0,
          text: 'sample todo1'
        },
        {
          id: 1,
          text: 'sample todo2'
        }
      ]
    };
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleRemove(id){
    // for in などでループしてidをチェックしてもいいが、lodashで簡単にできる
    // let data = [];
    // for(let i in this.state.data){
    //   if(this.state.data[i].id !== id){
    //     data.push(this.state.data[i]);
    //   }
    // }
    let data = _.reject(this.state.data, { 'id': id });
    this.setState({
      data: data
    });
  }
  render() {

    let tasks = [];
    for(let i in this.state.data){
      // コンポーネントをループで複数生成する場合は、keyを指定する必要がある。
      // keyはReactがコンポーネントを一意に識別するためのもの
      // keyにはiかidを指定することが一般的
      tasks.push(<Task key={this.state.data[i].id}
                       id={this.state.data[i].id}
                       text={this.state.data[i].text} onRemove={this.handleRemove} />);
    }

    return (
      <ul className="list js-todo_list">
        {tasks}
      </ul>
    );
  }
}