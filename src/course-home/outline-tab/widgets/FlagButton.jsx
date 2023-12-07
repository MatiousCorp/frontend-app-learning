import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Box } from '@material-ui/core';

const FlagButton = ({ buttonIcon, title, text, handleSelect, isSelected }) => (
  <button
    type="button"
    className={classnames(
      'flag-button row w-100 align-content-between m-1.5 py-3.5',
      isSelected ? 'flag-button-selected' : '',
    )}
    aria-checked={isSelected}
    role="radio"
    onClick={() => handleSelect()}
    data-testid={`weekly-learning-goal-input-${title}`}
  >
    <div className="row w-100 m-0 justify-content-center pb-2">{buttonIcon}</div>
    <div className={classnames('row w-100 m-0 justify-content-center')}>
      <Box fontWeight={isSelected ? 600 : 500} fontSize="16px" fontFamily="Hind">
        {title}
      </Box>
    </div>
    <div className={classnames('row w-100 m-0 justify-content-center')}>
      <Box fontWeight={isSelected ? 600 : 500} fontSize="14px" fontFamily="Hind" color="grey">
        {text}
      </Box>
    </div>
  </button>
);

FlagButton.propTypes = {
  buttonIcon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default FlagButton;
