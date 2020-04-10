import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card
} from '@material-ui/core';

import MUIDataTable from 'mui-datatables';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const UsersTable = props => {
  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'phone',
      label: 'Phone',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'createdAt',
      label: 'Dated',
      options: {
        filter: true,
        sort: true,
      }
    },
  ];
  const options = {
    selectableRows: 'none',
    filterType: 'dropdown',
    body: {
      noMatch: 'Sorry, no matching records found',
      toolTip: 'Sort',
      columnHeaderTooltip: column => `Sort for ${column.label}`
    },
    pagination: {
      next: 'Next Page',
      previous: 'Previous Page',
      rowsPerPage: 'Rows per page:',
      displayRows: 'of',
    },
  };
  const { className, users, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.inner} >
        <MUIDataTable
          columns={columns}
          data={users}
          options={options}
          title={'Users List'}
        />
      </div>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
