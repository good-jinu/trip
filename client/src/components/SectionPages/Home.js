import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="first">
        <div className="popularPlace">Popular place </div>
        <ul>
          <li><Link to="/toseoul">Seoul</Link></li>
          <li>Busan</li>
          <li>Jeju</li>
        </ul>
      </article>
    );
  }
}

export default Home;
