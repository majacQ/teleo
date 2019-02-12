import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import parse from 'autosuggest-highlight/parse';
import { setSelectedORFI } from '../actions';

const specialCharsRegex = /[.*+?^${}()|[\]\\]/g;
const whitespacesRegex = /\s+/;

const escapeRegexCharacters = str => str.replace(specialCharsRegex, '\\$&');

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

const FilterPathwaySelect = ({ items, selected, addPathway }) => {
  const initialText = 'What are you interested in?';

  const stateReducer = (state, changes) => {
    switch (changes.type) {
      // case Downshift.stateChangeTypes.blurInput:
      // case Downshift.stateChangeTypes.changeInput: {
      //   return {
      //     ...changes,
      //     isOpen: true
      //   };
      // }
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem: {
        addPathway(changes.selectedItem.id, changes.selectedItem.class);
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

  const checkSuggestion = (item, value) => {
    const escapedValue = escapeRegexCharacters(value.trim());
    const regex = new RegExp(`${escapedValue}`, 'i');
    const isSelected1 = selected.ho.indexOf(item.id) > -1;
    const isSelected2 = selected.rf.indexOf(item.id) > -1;
    const isSelected3 = selected.int.indexOf(item.id) > -1;
    return regex.test(item.name) && !(isSelected1 || isSelected2 || isSelected3);
  };

  const renderSuggestion = (item, value, index, highlightedIndex, getItemProps) => {
    const matches = match(item.name, value);
    const parts = parse(item.name, matches);

    return (
      <div
        {...getItemProps({
          key: item.name,
          index,
          item,
          className: `suggestion-container ${index === highlightedIndex ? 'suggestion-container--highlighted' : ''}`
        })}
      >
        <div className={`suggestion-text suggestion-text-${item.class}`}>
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
            <div {...getMenuProps({ className: `react-autosuggest__suggestions-container ${isOpen && suggestions.length > 0 ? 'react-autosuggest__suggestions-container--open' : ''}` })}>
              {isOpen ? suggestions : null }
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};

FilterPathwaySelect.propTypes = {
  items: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
  addPathway: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  selected: state.selectedORFI
});

const mapDispatchToProps = dispatch => ({
  addPathway: (val, group) => {
    dispatch(setSelectedORFI({ val, group, type: 'add' }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPathwaySelect);
