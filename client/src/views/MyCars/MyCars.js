/* eslint-disable react/no-multi-comp */
import React, { useState, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Button,
  TextField,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  DialogContent,
  DialogContentText,
  FormHelperText
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import {DropzoneArea} from 'material-ui-dropzone'
import validate from 'validate.js';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';


import CarsTable from './components/CarsTable'

const schema = {
  carName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  amount: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
  chassisNo: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
  image: {
    presence: { allowEmpty: false, message: 'is required' },
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(4)
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: 'white'
  },
  tf1:{
    marginTop: theme.spacing(2),
  }
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide
    direction="up"
    ref={ref}
    {...props}
  // eslint-disable-next-line react/jsx-closing-bracket-location
  />;
});

const MyCars = props => {
  const { className, ...rest } = props;
  const [scroll, setScroll] = useState('paper');
  const [image] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const state = useSelector(state=>state.login);
  const cars = useSelector(state=>state.cars);
  const dispatch = useDispatch();

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values, image]);

  useEffect(()=>{
    let signal = axios.CancelToken.source();
    const loadCars= async () => {
      try {
        let response =await axios.get(`/api/cars/${state.user.id}`,{
          cancelToken: signal.token,
        }
        );
        dispatch({type: 'setCars', payload: response.data.cars})
      }catch(err){
        // console.log('Error: ', err); 
      }
    };
    if(state.user )
      loadCars();
    return function cleanup(){
      signal.cancel('Api is being canceled');
    }
  },[])

  useEffect(()=>{
    let signal = axios.CancelToken.source();
    const removeCar= async () => {
      try {
        let response =await axios.delete(`/api/cars/${state.user.id}/${toDelete}`,{
          cancelToken: signal.token,
        }
        );
        dispatch({type: 'removeCar', payload: response.data.cars['_id']})
        setIsDeleting(false)
        setToDelete(null)
      }catch(err){
        setIsDeleting(false)
        setToDelete(null)
      }
    };
    if(toDelete){
      setIsDeleting(true);
      removeCar();
    }
    return function cleanup(){
      signal.cancel('Api is being canceled');
    }
  },[toDelete])

  useEffect(() => {
    let signal = axios.CancelToken.source();
    const doUpload= async () => {
      try {
        let formData = new FormData();
        Object.keys(formState.values).filter(key=>key!=='image').forEach(key=>{
          formData.set(key, formState.values[key]);
        })
        formData.append('image', formState.values.image);
        formData.append('userId', state.user.id);
        let response =await axios.post('/api/cars/add', formData,{
          cancelToken: signal.token,
          headers:{
            'Content-type': 'multipart/form-data'
          }
        }
        );
        dispatch({type: 'addCar', payload: response.data.car})
        setIsSubmitting(false);
        handleClose();
      }catch(err){
        // if(err.code)
        if (axios.isCancel(err)) {
          // console.debug('Error: ', err);
        } else {
          // console.debug('Error: ', err); 
        }
        setIsSubmitting(false);
      }
    };
    if(isSubmitting)
      doUpload();
    return function cleanup(){
      signal.cancel('Api is being canceled');
    }
  }, [isSubmitting, formState.values, dispatch])

  const handleClickOpen = (scrollType) => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSave=(files)=> {
    //Saving files to state for further use and closing Modal.
    // console.log('Save', files);
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        image: files[0]
      },
      touched: {
        ...formState.touched,
        image:true
      }
    }));
  }

  const handleAdd=()=> {
    
    if(formState.isValid){
      setIsSubmitting(true);
    }
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;


  return (
    <div
      className={clsx(classes.root, className)}
    >
      <Dialog
        aria-describedby="scroll-dialog-description"
        aria-labelledby="scroll-dialog-title"
        fullScreen
        onClose={handleClose}
        open={open}
        // scroll={scroll}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              aria-label="close"
              color="inherit"
              edge="start"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="button"
            >
              Add a new car
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleAdd}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
Select the image to upload from the Image Chooser below and fill in the details. Then Click Save to saved your car details.
          </DialogContentText>
          <Card >
            <form
              autoComplete="off"
              noValidate
            >
              <CardHeader
                subheader="The information below should be filled"
                title="Add a new car"
              />
              <Divider />
              <CardContent>
                <DropzoneArea 
                  acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                  filesLimit={1}
                  onChange={handleSave}
                  showAlerts
                  showPreviewsInDropzone
                />
                {hasError('image') && (
                  <FormHelperText error>
                    {formState.errors.image}
                  </FormHelperText>
                )
                }
                <Grid
                  className={classes.tf1}
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      className={classes.textField}
                      error={hasError('carName')}
                      fullWidth
                      helperText={
                        hasError('carName') ? formState.errors.carName[0] : null
                      }
                      label="Car Name"
                      name="carName"
                      onChange={handleChange}
                      type="text"
                      value={formState.values.carName || ''}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      className={classes.chassisNo}
                      error={hasError('chassisNo')}
                      fullWidth
                      helperText={
                        hasError('chassisNo') ? formState.errors.chassisNo[0] : null
                      }
                      label="Chassis No"
                      name="chassisNo"
                      onChange={handleChange}
                      type="text"
                      value={formState.values.chassisNo || ''}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      className={classes.amount}
                      error={hasError('amount')}
                      fullWidth
                      helperText={
                        hasError('amount') ? formState.errors.amount[0] : null
                      }
                      label="Amount"
                      name="amount"
                      onChange={handleChange}
                      type="text"
                      value={formState.values.amount || ''}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              {/* <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                >
            Save details
                </Button>
              </CardActions> */}
            </form>
          </Card>
        </DialogContent>
      </Dialog>
      <Button
        color="primary"
        disabled={!formState.isValid&& isSubmitting}
        onClick={handleClickOpen}
        type="button"
        variant="contained"
      >
            Add Car
      </Button>
      <CarsTable
        isDeleting={isDeleting}
        setToDelete={setToDelete}
        tableData={cars.cars}
      />
    </div>
  );
};

MyCars.propTypes = {
  className: PropTypes.string
};

export default MyCars;

