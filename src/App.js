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
      const start = (new Date).getTime();
      const formData = new FormData();
      Object.keys(this.state.preSignedUrl.data.fields).forEach(key => {
        formData.append(key, this.state.preSignedUrl.data.fields[key]);
      });
      formData.append('file', this.state.file[0]);
      this.setState({fileUpload: true, startTime: start})
      await axios.post(this.state.preSignedUrl.data.url, formData);
    } catch (error) {
        console.log(error)
    }
  };

  render(){
    if(!this.state.fileUpload){
      return (
        <form
          style={{
            bottom: 150,
            left: 400,
            position: "fixed",
          }} 
          onSubmit={this.submitFile}
        >
          <label>Upload file</label>
          <input type="file" onChange={event => this.setState({file : event.target.files})} />
          <button type="submit">Send</button>
      </form>
      );
    }
    else{
      return (
        <SuccessMessage
          startTime={this.state.startTime}
          file={this.state.file}
          />
      )
    }
  }
}

class SuccessMessage extends React.Component {
  async componentDidMount(){
    const form = new FormData();
    const finish = (new Date).getTime();
    form.append("start", this.props.startTime)
    form.append("finish", finish)
    form.append("file_name", this.props.file[0].name)
    form.append("file_size", this.props.file[0].size)
    await axios.post(`http://127.0.0.1:5000/file_upload/post_file_details`, form);
  }

  render(){
    return(
      <h1>FILE UPLOADED SUCCESSFULLY</h1>
      )
  }
}