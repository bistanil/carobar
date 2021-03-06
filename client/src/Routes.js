import React, {useEffect} from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  // Icons as IconsView,
  Account as AccountView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  MyCars as MyCarsView
} from './views';

import { useDispatch } from 'react-redux'

const Routes = () => {

  let dispatch = useDispatch();
  useEffect(()=>{
    let data=localStorage.getItem('_carobar_');
    if(data){
      dispatch({type:'localState', payload: data});
    }
  },[])
  
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/sign-in"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={MyCarsView}
        exact
        layout={MainLayout}
        path="/my-cars"
      />
      {/* <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      /> */}
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      {/* <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      /> */}
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
