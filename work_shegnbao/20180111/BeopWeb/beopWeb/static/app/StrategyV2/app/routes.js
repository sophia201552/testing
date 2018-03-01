import React from 'react';
import { Route, Router } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { withRouter } from 'react-router-dom';

import { store } from './index';

import Frame from './layouts/Frame';
import Login from './views/Login';
import Home from './views/Home';
import Painter from './views/Painter';

const FrameWrap = withRouter(Frame);

export default function Root({ history }) {
  return (
    <ConnectedRouter history={history}>
      <FrameWrap>
        <Route exact path="/" component={Home} />
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/home" component={Home} />
        <Route path="/painter/:id" component={Painter} />
        {/* <Route path="/error" /> */}
      </FrameWrap>
    </ConnectedRouter>
  );
}
