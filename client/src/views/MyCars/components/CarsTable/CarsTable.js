import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardMedia,
  Button
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
  MUIDataTableHeadCell: {
    root: {
      '&:nth-child(0)': {
        width: '30%'
      }
    }
  }
}));

const CarsTable = props => {
  const { className, tableData, setToDelete, isDeleting, ...rest } = props;  
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
              style={{width:'250px'}}
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
    },
    {
      name:'_id',
      label:'Actions',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              color="primary"
              disabled={isDeleting}
              onClick={()=>{setToDelete(value)}}
              type="button"
              variant="contained"
            >
            Remove Car
            </Button>
          );
        }
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
  isDeleting: PropTypes.bool,
  setToDelete: PropTypes.func,
  tableData: PropTypes.array.isRequired,
};

export default CarsTable;
