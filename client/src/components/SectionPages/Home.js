import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import wallpaperImg from './wallpaper/korea-main.jpg';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="first" style={{
	backgroundImage: `url(${wallpaperImg})`
      }}>
        <div className="first_nav">
          <h1>Popular place</h1>
          <ul>
            <li><Link to="/toseoul">Seoul</Link></li>
            <li>Busan</li>
            <li>Jeju</li>
          </ul>
        </div>
      </article>
    );
  }
}

export default Home;
