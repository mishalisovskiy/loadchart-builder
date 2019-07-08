import React from 'react';
import axios from 'axios';

import { Alert, Container } from 'reactstrap';

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
        return `${date.toLocaleString('uk-ua')}`
      };
      return (
          <Alert color="info">
            {`URL: ${url.url};\n
            First Request in Last 5 Batches: ${convertTsToTime(url.tsStart)};\n
            Last Request in Last 5 Batches: ${convertTsToTime(url.tsEnd)};\n
            Min Average Delay in Last 5 Batches: ${url.minBatchDelay};\n
            Max Average Delay in Last 5 Batches: ${url.maxBatchDelay};\n
            Average Delay for Last 5 Batches: ${url.avgDelay}`}
          </Alert>
      );
    });
    
    return (
      <div>
        {urls.length > 0 ? <Container className="url-summary">{urlSummary}</Container> : <Container>No results found!</Container>}
      </div>
    );
  }
}

export default App;
