import React, { Component, PropTypes } from 'react';

import Helmet from 'react-helmet';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';

import { Socket } from 'phoenix';

import config from '../../config';
import logger from '../../helpers/logger';

import * as authActions from '../../redux/modules/auth';

@connect(
  state => ({
    user: state.auth.user
  }),
  {
    pushState: push,
    ...authActions
  }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,

    user: PropTypes.object,

    pushState: PropTypes.func.isRequired,
    signOut: PropTypes.func
  };

  componentDidMount() {
    const socket = new Socket('/socket', {
      params: { token: window.userToken || null },
      logger: (kind, msg, data) => {
        logger.debug(`${kind}: ${msg}`, data);
      }
    });
    socket.connect();

    const channel = socket.channel('client:lobby', {});
    channel.join()
      .receive('error', () => {
        logger.error('Connection error');
      });
  }

  render() {
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet title="Main" titleTemplate="Maze | %s"/>

        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{ color: '#33e0ff' }}>
                <span className={styles.brand} />
                <span>{config.app.name}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav navbar>
              {this.props.user &&
                <LinkContainer to="game">
                  <NavItem>Game</NavItem>
                </LinkContainer>
              }
            </Nav>

            <Nav navbar pullRight>
              {!this.props.user &&
                <LinkContainer to="signin">
                  <NavItem>Sign In</NavItem>
                </LinkContainer>
              }

              {!this.props.user &&
                <LinkContainer to="signup">
                  <NavItem>Sign Up</NavItem>
                </LinkContainer>
              }

              {this.props.user &&
                <LinkContainer to="profile">
                  <NavItem>{this.props.user.email}</NavItem>
                </LinkContainer>
              }

              {this.props.user &&
                <NavItem
                  onClick={ () => {
                    this.props.signOut().then(() => this.props.pushState('/'));
                  }}
                >
                  Sign Out
                </NavItem>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

