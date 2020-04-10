import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import {
  AdStatus,
  BidsClosed,
  SavedCars,
  TotalProfit,
  LatestProducts,
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  let loggedIn = useSelector(state=>state.loggedIn);
  let dispatch = useDispatch();

  useEffect(()=>{
    if(!loggedIn){
      dispatch({type:'logout'})
    }
  },[loggedIn, dispatch])

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <AdStatus />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <BidsClosed />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <SavedCars />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalProfit />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          <LatestProducts />
        </Grid>
        {/* <Grid
          item
          lg={12}
          md={12}
          xl={9}
          xs={12}
        >
          <LatestOrders />
        </Grid> */}
      </Grid>
    </div>
  );
};

export default Dashboard;
