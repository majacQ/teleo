import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
// import { TablePagination } from '@material-ui/core';
import MaterialTable from 'material-table';
import Search from '@material-ui/icons/Search';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Launch from '@material-ui/icons/Launch';
import { setReviewRefsOpen } from '../actions';
import { ui } from '../constants';

const ReviewReferences = ({
  windowSize, reviewRefsOpen, data, closeReviewRefs
}) => {
  if (data === undefined) {
    return '';
  }

  const keys = Object.keys(data);
  const refs = keys.map(k => ({
    author: data[k].author,
    cat: data[k].chapter_article_title,
    jbwt: data[k].journal_book_website_title,
    year: data[k].year,
    url: (<a href={data[k].url} target="_blank" rel="noopener noreferrer"><Launch /></a>)
  }));

  return (
    <Dialog open={reviewRefsOpen} onClose={closeReviewRefs}>
      <div className="review-refs-container" style={{ width: windowSize.appWidth, marginTop: ui.header.height - 4, left: windowSize.appLeft }}>
        <MaterialTable
          components={{
            Container: ({ children }) => ( // eslint-disable-line
              <div style={{ background: '#ffffff', width: windowSize.appWidth }}>
                {children}
              </div>
            )
          }}
          icons={{
            Search,
            FirstPage,
            LastPage,
            NextPage: ChevronRight,
            PreviousPage: ChevronLeft
          }}
          columns={[
            { title: 'Author(s)', field: 'author' }, // cellStyle: { color: '#fff' } },
            { title: 'Title', field: 'cat' }, // cellStyle: { color: '#fff' } },
            { title: 'Journal', field: 'jbwt' }, // cellStyle: { color: '#fff' } },
            { title: 'Year', field: 'year' }, // cellStyle: { color: '#fff' } },
            {
              title: 'Source',
              field: 'url',
              // cellStyle: { a: { color: '#fff' } },
              filtering: false,
              sorting: false
            }
          ]}
          data={refs}
          title="References"
          // options={{
          //  headerStyle: { color: '#fff' }
          //   paging: false
          // }}
        />
      </div>
    </Dialog>
  );
};

ReviewReferences.propTypes = {
  windowSize: PropTypes.object.isRequired,
  reviewRefsOpen: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  closeReviewRefs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize,
  filters: state.filters,
  reviewRefsOpen: state.reviewRefsOpen,
  data: state.refsData.data
});

const mapDispatchToProps = dispatch => ({
  closeReviewRefs: () => {
    dispatch(setReviewRefsOpen(false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewReferences);

// Pagination: props => (
//   <TablePagination
//     {...props}
//     labelRowsPerPage={<div style={{ color: '#fff' }}>{props.labelRowsPerPage}</div>}
//     labelDisplayedRows={row =>
//       <div style={{ color: '#fff' }}>{props.labelDisplayedRows(row)}</div>}
//     SelectProps={{
//       style: {
//         color: '#fff'
//       }
//     }}
//   />
// ),
// Toolbar: props => (
//   <div style={{ color: '#fff' }}>
//     <MTableToolbar {...props} />
//   </div>
// )
