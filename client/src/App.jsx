import React from 'react';
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
      .then(res => this.setState({urls: res.data}));
  }

  render() {
    const { urls } = this.state;
    const urlSummary = urls.map((url) => {
      const convertTsToTime = (ts) => {
        const date = new Date();
        date.setTime(ts);
        return `${date.toLocaleTimeString('uk-ua')}`
      };
      return (
          <li color="info" key={url.url}>
            '{url.url}': {url.avgDelay} ({url.minBatchDelay} / {url.maxBatchDelay}) {convertTsToTime(url.tsStart)} -- {convertTsToTime(url.tsEnd)}
          </li>
      );
    });
    
    return (
      <div>
        {urls.length > 0 ? <ul className="url-summary">{urlSummary}</ul> : <Container>No results found!</Container>}
      </div>
    );
  }
}

export default App;
