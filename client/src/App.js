import React from 'react';
import './App.css';
import Top from './Top.js';
import MainSection from './mainSection.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
      <header>
        <Top />
      </header>
      <section>
        <MainSection />
      </section>
      </>
    );
  }
}

export default App;
