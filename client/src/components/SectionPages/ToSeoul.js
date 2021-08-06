import React from 'react';
import './Home.css';
import wallpaperImg from './wallpaper/seoul-dest.jpg';

class ToSeoul extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="first" style={{
	backgroundImage: `url(${wallpaperImg})`
      }}>
        <div className="first_nav">
          <h1>Seoul</h1>
          <button>start</button>
          <button>end</button>
          <button>create</button>
        </div>
      </article>
    );
  }
}

export default ToSeoul;
