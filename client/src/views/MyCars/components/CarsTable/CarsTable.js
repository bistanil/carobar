import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardMedia
} from '@material-ui/core';

import MUIDataTable from 'mui-datatables';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2)
  },
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
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

const CarsTable = props => {
  const columns = [
    {
      name:'image',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <CardMedia
              className={classes.media}
              image={`/uploads/${value}`}
              title="Car Image"
            />
          );
        }
      }
    },
    {
      name: 'carName',
      label: 'Car Name',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'chassisNo',
      label: 'Chassis No',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'amount',
      label: 'Amount',
      options: {
        filter: true,
        sort: true,
      }
    }
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
  const { className, tableData, ...rest } = props;  

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.inner} >
        <MUIDataTable
          columns={columns}
          data={tableData}
          options={options}
          title={'Cars List'}
        />
      </div>
    </Card>
  );
};

CarsTable.propTypes = {
  className: PropTypes.string,
  tableData: PropTypes.array.isRequired,
};

export default CarsTable;
