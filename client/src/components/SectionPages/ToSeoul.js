import React from 'react';
import './ToSeoul.css';

class ToSeoul extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="head_of_destArticle">
        <div className="destination_name">Seoul</div>
        <button>start</button>
        <button>end</button>
        <button>create</button>
      </article>
    );
  }
}

export default ToSeoul;
