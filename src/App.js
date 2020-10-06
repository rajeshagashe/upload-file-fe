import React from 'react';
import axios from 'axios';

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isButtonClicked : false
    }
    this._onButtonClick = this._onButtonClick.bind(this)
  }

  _onButtonClick(){
    this.setState({
      isButtonClicked : true
    })
  }
  
  render(){
    if (!this.state.isButtonClicked){
      return (
        <UploadButton 
          onClick={this._onButtonClick}
        />
      );
    }
    else{
      return (
      <FileUpload/>
      );
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

class FileUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      preSignedUrl : 
      {
        data:
        {
          url : "url"
        }
      },
      fileUpload : false
    }
    this.submitFile = this.submitFile.bind(this)
  }
  
  async componentDidMount(){
    this.setState(
      {
        preSignedUrl : 
          await axios.get(
            `http://127.0.0.1:5000/file_upload/get_presigned_url`
          )
      }
    )
  }

  async submitFile() {
    try {
      if (!this.state.file) {
        throw new Error('Select a file first!');
      }
      const formData = new FormData();
      Object.keys(this.state.preSignedUrl.data.fields).forEach(key => {
        formData.append(key, this.state.preSignedUrl.data.fields[key]);
      });
      formData.append('file', this.state.file[0]);
      
      await axios.post(this.state.preSignedUrl.data.url, formData);
      this.setState({fileUpload: true})
      console.log("iplaegusCBHisLUFEGIYASLRJKFBWIUESLFJCBUILCBHUILJK")

    } catch (error) {
        console.log(error)
    }
  };

  render(){
    if(!this.state.fileUpload){
      console.log(this.state.fileUpload)
      return (
        <form
          style={{
            bottom: 150,
            left: 400,
            position: "fixed",
          }} 
          onSubmit={this.submitFile}
          // onClick={this.setState({fileUpload: true})}
        >
          <label>Upload file</label>
          <input type="file" onChange={event => this.setState({file : event.target.files})} />
          <button type="submit"  onClick={this.setState({fileUpload: true})}>Send</button>
      </form>
      );
    }
    else{
      return (
        <SuccessMessage />
      )
    }
  }
}
// };

class SuccessMessage extends React.Component {
  render(){
    return(
      <h1>FILE UPLOADED SUCCESSFULLY</h1>
      )
  }
}