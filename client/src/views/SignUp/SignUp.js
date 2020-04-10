import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
  FormHelperText
} from '@material-ui/core';
import {
  ToggleButtonGroup,
  ToggleButton,
} from '@material-ui/lab';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import axios from'axios'
import jwt_decode from 'jwt-decode'

const schema = {
  first_name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  last_name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  phone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 20
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
  // policy: {
  //   presence: { allowEmpty: false, message: 'is required' },
  //   checked: true
  // }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    width:'100%'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  },
  userType:{
    marginTop: theme.spacing(2),
    width:'100%'
  }
}));

const SignUp = props => {
  const state = useSelector(state => state);
  const [errors, setErrors] = useState('');
  const dispatch = useDispatch();
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {user_type:'seller'},
    touched: {},
    errors: {}
  });

  const [userType, setUserType] = React.useState('seller');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  useEffect(()=>{
    let token =localStorage.getItem('_carobar_');
    if(state.loggedIn || token){
      dispatch({ type: 'localState' , payload: {token, user:jwt_decode(token)}});
      history.push('/dashboard');
    }
  },[])

  useEffect(() => {
    let signal = axios.CancelToken.source();
    const doSignUp= async () => {
      try {
        let response =await axios.post('/api/users/register', formState.values,{
          cancelToken: signal.token,
        }
        );
        if(response){
          // console.log(response.data);
          const { token } = response.data;
          localStorage.setItem('_carobar_', token);
          dispatch({ type: 'register' , payload: {token, user:jwt_decode(token)}});
          history.push('/dashboard');
        }
      }catch(err){
        if (axios.isCancel(err)) {
          console.log('Error: ', err); // => prints: Api is being canceled
        } else {
          console.log('Error: ', err.response);
          Object.keys(err.response.data).forEach((key)=>{
            setErrors(errors+ '\n'+err.response.data[key])
          }) 
          // this.setState({ isLoading: false });
        }
        setIsSubmitting(false);
      }
    };
    if(isSubmitting)
      doSignUp();
    return function cleanup(){
      signal.cancel('Api is being canceled');
    }
  }, [isSubmitting, formState.values])

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
    setIsSubmitting(false);
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    event.preventDefault();
    setErrors('');
    setIsSubmitting(true);
    // history.push('/');
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleUserType = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          'user_type':newUserType
        },
        touched: {
          ...formState.touched
        }
      }));
    }
  };

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                "Kind words do not cost much. Yet they accomplish much."
              </Typography>
              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  Blaise Pascal
                </Typography>
                <Typography
                  className={classes.bio}
                  variant="body2"
                >
                  Mathematician, physicist and inventor
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignUp}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Create new account
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Use your email to create new account
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('first_name')}
                  fullWidth
                  helperText={
                    hasError('first_name') ? formState.errors.first_name[0] : null
                  }
                  label="First name"
                  name="first_name"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.first_name || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('last_name')}
                  fullWidth
                  helperText={
                    hasError('last_name') ? formState.errors.last_name[0] : null
                  }
                  label="Last name"
                  name="last_name"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.last_name || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />

                <TextField
                  className={classes.textField}
                  error={hasError('phone')}
                  fullWidth
                  helperText={
                    hasError('phone') ? formState.errors.phone[0] : null
                  }
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.phone || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                />

                <ToggleButtonGroup
                  aria-label="text alignment"
                  className={classes.userType}
                  exclusive
                  onChange={handleUserType}
                  value={userType}
                >
                  <ToggleButton
                    aria-label="User type"
                    disabled
                    style={{paddingLeft:'16px',paddingRight:'16px', flexGrow:1, justifyContent:'start'}}
                    value="user_type"
                  >
                    <Typography
                      className={classes.policyText}
                      color="textSecondary"
                      variant="body1"
                    > 
                      I want to sign up as
                    </Typography>
                  </ToggleButton>
                  <ToggleButton
                    aria-label="Seller"
                    value="seller"
                  >
                    <Typography
                      className={classes.policyText}
                      color="textSecondary"
                      variant="button"
                    > 
                      Seller
                    </Typography>
                  </ToggleButton>
                  <ToggleButton
                    aria-label="Buyer"
                    value="buyer"
                  >
                    <Typography
                      className={classes.policyText}
                      color="textSecondary"
                      variant="button"
                    > 
                      Buyer
                    </Typography>
                  </ToggleButton>
                  <ToggleButton
                    aria-label="Admin"
                    style={{visibility:'none'}}
                    value="admin"
                  >
                    <Typography
                      className={classes.policyText}
                      color="textSecondary"
                      variant="button"
                    > 
                      Admin
                    </Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
                {errors && (
                  <FormHelperText error>
                    {errors}
                  </FormHelperText>
                )}
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid || isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign up now
                </Button>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/sign-in"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
