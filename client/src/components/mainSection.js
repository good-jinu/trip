import React from 'react';
import { Route } from 'react-router-dom';
import {Home, ToSeoul} from './SectionPages';
import './mainSection.css';

const mainSection = () => {
  return (
    <>
      <Route exact path='/' component={Home}/>
      <Route path="/toseoul" component={ToSeoul}/>
    </>
  );
}


export default mainSection;
