import React from 'react';
import injectSheet from 'react-jss';
import superagent from 'superagent';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: '',
      longitude: '',
      searchZipCodes: [],
      topZipCodes: []
    };

    this.fetchSearchZips = this.fetchSearchZips.bind(this);
    this.fetchTopZips = this.fetchTopZips.bind(this);
  }

  update(field) {
    return (e) => this.setState({ [field]: e.currentTarget.value });
  }

  fetchTopZips() {
    superagent
      .get('/api/top')
      .end((err, res) => {
        if (err) console.error(err);
        else {
          let topZipCodes = JSON.parse(res.text);
          this.setState({ topZipCodes });
        }
      });
  }

  fetchSearchZips() {
    let { latitude, longitude } = this.state;

    superagent
      .post('/api/search')
      .send({ latitude, longitude })
      .end((err, res) => {
        if (err) console.error(err);
        else {
          let searchZipCodes = JSON.parse(res.text);
          this.setState({ searchZipCodes });
        }
      });
  }

  renderZips(zips) {
    let { classes } = this.props;

    return zips.map((zip, idx) => {
      return <span key={idx} className={classes.zip}>{zip}</span>;
    });
  }

  render() {
    let hello = "";
    let { classes } = this.props;
    let { latitude, longitude, searchZipCodes, topZipCodes } = this.state;

    return (
      <div className={classes.appContainer}>
        <div className={classes.locationContainer}>
          <div className={classes.title}>
            Please enter a latitude and longitude to find the 5 nearest zip codes!
          </div>
          <input
            className={classes.inputBox}
            type='text'
            id='lat'
            value={latitude}
            placeholder='Latitude'
            onChange={this.update('latitude')} />
          <input
            className={classes.inputBox}
            type='text'
            id='lng'
            value={longitude}
            placeholder='Longitude'
            onChange={this.update('longitude')} />

          <div className={classes.searchZipsButton} onClick={this.fetchSearchZips}>Search!</div>
          <div className={classes.zipBox}>{searchZipCodes.length > 0 ? this.renderZips(searchZipCodes) : ''}</div>

          <div className={classes.searchZipsButton} onClick={this.fetchTopZips}>Top 5!</div>
          <div className={classes.zipBox}>{topZipCodes.length > 0 ? this.renderZips(topZipCodes) : ''}</div>
        </div>
      </div>
    );
  }
}

const styles = {
  appContainer: {
    width: '100vw',
    height: '100vw',
  },
  locationContainer: {
    fontFamily: 'Sans serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '100px'
  },
  title: {
    fontSize: '30px',
  },
  inputBox: {
    textAlign: 'center',
    width: '150px',
    marginTop: '20px',
    border: '1px solid #ccc',
    padding: '5px',
    fontSize: '24px'
  },
  searchZipsButton: {
    fontSize: '24px',
    padding: '5px 20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginTop: '20px',
    background: '#29d58f',
    color: 'white',
    cursor: 'pointer',
    '&:hover': {
      background: '#2ede96'
    }
  },
  zipBox: {
    height: '40px',
    width: '300px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    margin: '10px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zip: {
    padding: '5px'
  }
};

export default injectSheet(styles)(App);
