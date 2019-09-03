import React from 'react';
import PropTypes from 'prop-types';

const RefsList = ({
  data, indices, nCol
}) => {
  if (data.data === undefined) {
    return '';
  }

  const refDat = indices.map((k) => data.data[k]);
  refDat.sort((a, b) => {
    const textA = a.author === null || a.author === undefined ? 'ZZZZZZZ' : a.author.toUpperCase();
    const textB = b.author === null || b.author === undefined ? 'ZZZZZZZ' : b.author.toUpperCase();
    return textA.localeCompare(textB);
  });

  return (
    <div className="expand-info-ref-content" style={{ columnCount: Math.min(nCol, indices.length) }}>
      { refDat.map((cd, i) => {
        const author = cd.author === null || cd.author === undefined ? '' : `${cd.author}.`;
        const cat = cd.chapter_article_title === null || cd.chapter_article_title === undefined ? '' : ` ${cd.chapter_article_title}.`;
        const jbwt = cd.journal_book_website_title === null || cd.journal_book_website_title === undefined ? '' : ` ${cd.journal_book_website_title}.`;
        const year = cd.year === null || cd.year === undefined ? '' : ` ${cd.year}.`;
        const vol = cd.vol === null || cd.vol === undefined ? '' : ` Vol. ${cd.vol}.`;
        const issue = cd.issue === null || cd.issue === undefined ? '' : ` Issue ${cd.issue}.`;
        const pageRange = cd.page_range === null || cd.page_range === undefined ? '' : ` pp. ${cd.page_range}.`;
        const doi = cd.doi === null || cd.doi === undefined ? '' : ` ${cd.doi}.`;
        const url = cd.url === null || cd.url === undefined ? '' : (<span><a href={cd.url} target="_blank" rel="noopener noreferrer"> View Source</a></span>);

        // date_accessed
        // edition
        // editor
        // item_type
        // place
        // publisher

        const key = `ref-${i}`;
        return (
          <div className="refs-entry" key={key}>
            <span>
              {`${author}${cat}${jbwt}${year}${vol}${issue}${pageRange}${doi}`}
              {url}
            </span>
          </div>
        );
      })}
    </div>
  );
};

RefsList.propTypes = {
  data: PropTypes.object.isRequired,
  indices: PropTypes.array.isRequired,
  nCol: PropTypes.number.isRequired
};

export default RefsList;
