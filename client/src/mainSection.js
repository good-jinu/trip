import React from 'react';
import './mainSection.css';

class mainSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
      <article className="first">
        <div className="recommendation">popular place</div>
        <ul>
        <li>seoul</li>
        <li>busan</li>
        </ul>
      </article>
      </>
    );
  }
}

export default mainSection;
