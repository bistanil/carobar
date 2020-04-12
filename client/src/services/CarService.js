import axios from 'axios';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import React from 'react';

const CarService = (values)=>{
  let dispatch = useDispatch();
  let signal = axios.CancelToken.source();
  axios.post('/api/users/login', values,{
    cancelToken: signal.token,
  }
  ).then((res)=>{
    console.log('Service',res);
  }).catch((err)=>{
    console.log('Service',err);
  })

  return(null);
}

export default CarService;

