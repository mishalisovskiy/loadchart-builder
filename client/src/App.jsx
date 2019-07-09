import React from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

import { Container } from 'reactstrap';

import './App.css';

class App extends React.Component {
  state = {
    urls: [],
  }

  componentDidMount() {
    axios
      .get('/data')
      .then(res => this.setState({ urls: res.data }));
    const socket = socketIOClient.connect('/');
    socket.on("New_Data_Available", data => {
      console.log(data);
      const parsedJson = JSON.parse(data)
      this.setState({ urls: parsedJson });
    });
  }

  componentWillUnmount() {

  }

  render() {
    const { urls } = this.state;
    console.log(urls);
    const urlSummary = urls.map((url) => {
      const convertTsToTime = (ts) => {
        const date = new Date();
        date.setTime(ts);
        return `${date.toLocaleTimeString('uk-ua')}`
      };
      return (
          <li color="info" key={url.url}>
            '{url.url}': {url.avgDelay} ({url.avgDelay - url.prevAvgDelay}) {convertTsToTime(url.tsEnd)}
          </li>
      );
    });
    
    return (
      <div>
        {urls.length > 0 ? <ul id="url-summary">{urlSummary}</ul> : <Container>No results found!</Container>}
      </div>
    );
  }
}

export default App;
