import React from 'react';
import { Link } from 'react-router-dom';
import './Top.css';

class Top extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
      <div className="Top_logo">
        <Link to="/">LOGO</Link>
      </div>
      <form method="GET">
        <input type="text" id="search" name="search" required />
        <input type="submit" />
      </form>
      <button>Menu</button>
      <button>Log in</button>
      </>
    );
  }
}

export default Top;
