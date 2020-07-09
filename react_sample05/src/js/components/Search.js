import React from 'react';

// Searchコンポーネントを作る（app.jsで読み込んで使う）
export default class Search extends React.Component {

  // コンストラクタ
  constructor(props){
    super(props);
    this.state = {
      val: '' //検索内容
    };
    this.handleChange = this.handleChange.bind(this);
  }
  // 入力された値が変わった時に呼び出し
  handleChange(e) {
    // setStateでvalを更新
    this.setState({
      val: e.target.value
    });
    // 親コンポーネントapp.jsのrender()とcallBackSearchというpropsをやりとりするので
    // 新しいvalを親に通知する（実際の検索は親コンポーネントの方で行う）
    this.props.callBackSearch(e.target.value);
  }
  // 検索ボックスのタグ
  // onChange
  // value
  render() {
    return (
      <div className="searchBox">
        <i className="fa fa-search searchBox__icon" aria-hidden="true" />
        <input type="text" className="searchBox__input" onChange={this.handleChange}
              value={this.state.val} placeholder="something keyword" />
      </div>
    );
  }
}
