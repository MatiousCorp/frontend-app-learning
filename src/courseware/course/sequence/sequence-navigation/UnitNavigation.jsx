import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { GetCourseExitNavigation } from '../../course-exit';
import UnitNavigationEffortEstimate from './UnitNavigationEffortEstimate';
import { useSequenceNavigationMetadata } from './hooks';
import messages from './messages';

const UnitNavigation = ({ intl, sequenceId, unitId, onClickPrevious, onClickNext }) => {
  const { isFirstUnit, isLastUnit, nextLink, previousLink } = useSequenceNavigationMetadata(
    sequenceId,
    unitId,
  );
  const { courseId } = useSelector(state => state.courseware);
  const { exitActive, exitText } = GetCourseExitNavigation(courseId, intl);

  const renderPreviousButton = () => (
    <Box display="flex" alignItems="center">
      <ArrowBackIcon style={{ color: '#1A2029', marginRight: '1rem' }} />
      <Box fontSize="18px" fontWeight={700} color="#1A2029" fontFamily="Hind">
        {intl.formatMessage(messages.previousButton)}
      </Box>
    </Box>
  );

  const renderNextButton = () => {
    const buttonText = isLastUnit && exitText ? exitText : intl.formatMessage(messages.nextButton);
    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        style={{
          alignItems: 'center',
        }}
      >
        <UnitNavigationEffortEstimate sequenceId={sequenceId} unitId={unitId}>
          <Box fontSize="18px" fontWeight={700} color="#1A2029" fontFamily="Hind">
            {buttonText}
          </Box>
        </UnitNavigationEffortEstimate>
        <ArrowForwardIcon style={{ color: '#1A2029', marginLeft: '1rem' }} />
      </Box>
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      borderTop="1px solid #eaeaea"
      borderBottom="1px solid #eaeaea"
      height="70px"
    >
      <Box
        width="50%"
        height="100%"
        style={{
          cursor: isFirstUnit ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          marginLeft: '2rem',
          opacity: isFirstUnit ? 0.5 : 1,
        }}
        onClick={() => (isFirstUnit ? null : onClickPrevious())}
        as={isFirstUnit ? undefined : Link}
        to={isFirstUnit ? undefined : previousLink}
      >
        {renderPreviousButton()}
      </Box>
      <Box
        width="50%"
        height="100%"
        borderLeft="1px solid #eaeaea"
        style={{
          cursor: isLastUnit && !exitActive ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: '2rem',
          opacity: isLastUnit && !exitActive ? 0.5 : 1,
        }}
        onClick={() => (isLastUnit && !exitActive ? null : onClickNext())}
        as={isLastUnit && !exitActive ? undefined : Link}
        to={isLastUnit && !exitActive ? undefined : nextLink}
      >
        {renderNextButton()}
      </Box>
    </Box>
  );
};

UnitNavigation.propTypes = {
  intl: intlShape.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  onClickPrevious: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
};

UnitNavigation.defaultProps = {
  unitId: null,
};

export default injectIntl(UnitNavigation);
