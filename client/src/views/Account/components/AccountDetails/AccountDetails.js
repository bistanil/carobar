import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import { useSelector } from 'react-redux';
// import Password from '../Password';

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;
  const state = useSelector(state=>state.login);

  const classes = useStyles();


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        subheader="The information cannot be edited"
        title="Profile"
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              disabled
              fullWidth                
              label="First name"
              margin="dense"
              name="first_name"
              required
              value={state.user.first_name}
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              disabled
              fullWidth
              label="Last name"
              margin="dense"
              name="last_name"
              required
              value={state.user.last_name}
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              disabled
              fullWidth
              label="Email Address"
              margin="dense"
              name="email"
              required
              value={state.user.email}
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              disabled
              fullWidth
              label="Phone Number"
              margin="dense"
              name="phone"
              type="number"
              value={state.user.phone}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
      {/* <Password/> */}
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string,
  userDetails: PropTypes.object
};

export default AccountDetails;
