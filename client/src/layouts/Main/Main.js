import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';
import { withRouter } from 'react-router-dom'

import { Sidebar, Topbar } from './components';
import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const { children, history } = props;
  let state = useSelector(state=>state);
  // let location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(()=>{
    let token = localStorage.getItem('_carobar_');
    // console.log('Location',location.pathname);
    if(!state.loggedIn || !token){
      history.push('/sign-in')
    }
  },[state])

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
        {/* <Footer /> */}
      </main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object
};

export default withRouter(Main);
