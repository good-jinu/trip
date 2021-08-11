import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {Home, To} from './SectionPages';
import {MainEdit} from './ManagingSection';
import './mainSection.css';

const mainSection = () => {
  return (
    <>
    <Swtich>
      <Route path="/to/:place" component={To}/
      <Route path="/edit" component={MainEdit}>
      <Route exact path='/' component={Home}/>
    </Switch>
    </>
  );
}


export default mainSection;
