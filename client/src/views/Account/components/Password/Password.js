import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField,
  Grid,
  Card,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import axios from 'axios';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  root: {}
}));

const schema = {
  currentPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
  confirm: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const Password = props => {
  const { className } = props;
  const state = useSelector(state=>state.login);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [clear, setClear] = useState(false);
  const classes = useStyles();

  const [values, setValues] = useState({
    password: '',
    confirm: '',
    currentPassword:''
  });

  useEffect(()=>{
    let signal = axios.CancelToken.source();
    const loadCars= async () => {
      try {
        await axios.put(`/api/users/${state.user.id}`,values,{
          cancelToken: signal.token,
        }
        );
        setValues({
          password: '',
          confirm: '',
          currentPassword:''
        });
        setClear(true);
        setSubmitting(false);
        setStatus('success');
        setMessage('Password updated');
      }catch(err){
        setStatus('error')
        setMessage('Error updating password')
        setSubmitting(false);
        setClear(false);
        // console.log('Error: ', err); 
      }
    };
    if(submitting)
      loadCars();
    return function cleanup(){
      signal.cancel('Api is being canceled');
    }
  },[submitting])

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = () => {
    const errors = validate(values, schema);
    if(errors){
      setStatus('error');
      setMessage('One or more validations failed')
    }else{
      setStatus(null);
      setSubmitting(true)
    }
  }

  return (
    <Card      
      className={clsx(classes.root, className)}
    >
      <form>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Current Password"
            margin="dense"
            name="currentPassword"
            onChange={handleChange}
            type="password"
            value={clear?'':values.currentPassword}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            margin="dense"
            name="password"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={clear?'':values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm password"
            margin="dense"
            name="confirm"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={clear?'':values.confirm}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Grid
            container
            spacing={1}
          >
         
            <Grid
              item
            >
              <Button
                color="primary"
                disabled={submitting}
                onClick={handleSubmit}
                variant="outlined"
              >
            Update
              </Button>
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
        
              {status && (<Alert severity={status}>{message}</Alert>)}
            </Grid>
          </Grid>
        </CardActions>
      </form>
    </Card>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
