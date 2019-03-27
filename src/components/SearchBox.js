import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import parse from 'autosuggest-highlight/parse';
import { whitespacesRegex, escapeRegexCharacters } from '../utils/regex';

const match = (text, query) => (
  query
    .trim()
    .split(whitespacesRegex)
    .reduce((result, word) => {
      if (!word.length) return result;
      const wordLen = word.length;
      const regex = new RegExp(escapeRegexCharacters(word), 'i');
      const { index = -1 } = text.match(regex);
      if (index > -1) {
        result.push([index, index + wordLen]);

        // Replace what we just found with spaces so we don't find it again.
        // eslint-disable-next-line no-param-reassign
        text = `${text.slice(0, index)}${new Array(wordLen + 1).join(' ')}${text.slice(index + wordLen)}`;
      }
      return result;
    }, [])
    .sort((match1, match2) => match1[0] - match2[0])
);

const SearchBox = ({
  items, handler, checkSuggestion, initialText, menuWidth, handleEscape
}) => {
  const stateReducer = (state, changes) => {
    switch (changes.type) {
      // case Downshift.stateChangeTypes.blurInput:
      // case Downshift.stateChangeTypes.changeInput: {
      //   return {
      //     ...changes,
      //     isOpen: true
      //   };
      // }
      case Downshift.stateChangeTypes.keyDownEscape: {
        handleEscape();
        return { ...changes };
      }
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem: {
        handler(changes.selectedItem);
        return {
          ...changes,
          inputValue: state.inputValue,
          selectedItem: null,
          isOpen: true,
          highlightedIndex: state.highlightedIndex
        };
      }
      default:
        return {
          ...changes,
          selectedItem: null
        };
    }
  };

  const renderSuggestion = (item, value, index, highlightedIndex, getItemProps) => {
    const matches = match(item.name, value);
    const parts = parse(item.name, matches);

    return (
      <div
        {...getItemProps({
          key: item.uid,
          index,
          item,
          className: `suggestion-container ${index === highlightedIndex ? 'suggestion-container--highlighted' : ''}`
        })}
      >
        <div className="suggestion-text">
          {parts.map((part, idx) => {
            const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;
            return (
              <span
                className={className}
                key={idx} /* eslint-disable-line react/no-array-index-key */
              >
                {part.text}
              </span>
            );
          })}
        </div>
        <div className="suggestion-class">
          {item.type}
        </div>
      </div>
    );
  };

  return (
    <Downshift
      stateReducer={stateReducer}
      itemToString={item => (item ? item.name : '')}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex
        // selectedItem
      }) => {
        const suggestions = items
          .filter(item => checkSuggestion(item, inputValue))
          .map((item, index) => renderSuggestion(
            item, inputValue, index, highlightedIndex, getItemProps));
        return (
          <div className="react-autosuggest__container">
            <input
              {...getInputProps({
                className: 'react-autosuggest__input',
                placeholder: initialText
              })}
            />
            <div
              {...getMenuProps({ className: `react-autosuggest__suggestions-container ${isOpen && suggestions.length > 0 ? 'react-autosuggest__suggestions-container--open' : ''}` })}
              style={{ width: menuWidth }}
            >
              {isOpen ? suggestions : null }
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};

SearchBox.propTypes = {
  items: PropTypes.array.isRequired,
  handler: PropTypes.func.isRequired,
  checkSuggestion: PropTypes.func.isRequired,
  initialText: PropTypes.string.isRequired,
  menuWidth: PropTypes.number.isRequired,
  handleEscape: PropTypes.func.isRequired
};

export default SearchBox;
