import React from 'react';
import logo from './logo.svg';
import './App.css';

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isButtonClicked : false
    }
    this._onButtonClcik = this._onButtonClcik.bind(this)
  }

  _onButtonClcik(){
    this.setState({
      isButtonClicked : true
    })
  }
  
  render(){
    if (!this.state.isButtonClicked){
      return (
        <UploadButton 
          onClick={this._onButtonClcik}
        />
      );
    }
    else{
      return <button />
    }
  }
}

class UploadButton extends React.Component{
  render(){
    return (
      <button 
        style={{
          height: 100,
          width:500,
          bottom: 150,
          left: 400,
          position: "fixed",
          background: "white",
          color: "blue"
        }}
        onClick={this.props.onClick}
      >
        <h1>UPLOAD FILE</h1>
      </button>
    );
  }
}

export default App;
