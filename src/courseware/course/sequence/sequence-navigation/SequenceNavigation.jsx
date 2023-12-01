import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { breakpoints, useWindowSize } from '@edx/paragon';
import classNames from 'classnames';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { GetCourseExitNavigation } from '../../course-exit';
import UnitButton from './UnitButton';
import SequenceNavigationTabs from './SequenceNavigationTabs';
import { useSequenceNavigationMetadata } from './hooks';
import { useModel } from '../../../../generic/model-store';
import { LOADED } from '../../../data/slice';
import messages from './messages';

const SequenceNavigation = ({
  intl,
  unitId,
  sequenceId,
  className,
  onNavigate,
  nextHandler,
  previousHandler,
}) => {
  const sequence = useModel('sequences', sequenceId);
  const { isFirstUnit, isLastUnit, nextLink, previousLink } = useSequenceNavigationMetadata(
    sequenceId,
    unitId,
  );
  const { courseId, sequenceStatus } = useSelector(state => state.courseware);
  const isLocked =
    sequenceStatus === LOADED
      ? sequence.gatedContent !== undefined && sequence.gatedContent.gated
      : undefined;

  const shouldDisplayNotificationTriggerInSequence =
    useWindowSize().width < breakpoints.small.minWidth;

  const { exitActive, exitText } = GetCourseExitNavigation(courseId, intl);

  const renderUnitButtons = () => {
    if (isLocked) {
      return <UnitButton unitId={unitId} title="" contentType="lock" isActive onClick={() => {}} />;
    }
    if (sequence.unitIds.length === 0 || unitId === null) {
      return <div style={{ flexBasis: '100%', minWidth: 0, borderBottom: 'solid 1px #EAEAEA' }} />;
    }
    return (
      <SequenceNavigationTabs
        unitIds={sequence.unitIds}
        unitId={unitId}
        showCompletion={sequence.showCompletion}
        onNavigate={onNavigate}
      />
    );
  };

  const renderPreviousButton = () => (
    <Box display="flex" alignItems="center" borderRight="1px solid #eaeaea" height="100%" pr="2rem">
      <ArrowBackIcon sx={{ color: '#1A2029', ml: '2rem', mr: '1rem' }} />
      <Typography fontSize="18px" fontWeight={700} color="#1A2029" fontFamily="Hind">
        {shouldDisplayNotificationTriggerInSequence
          ? null
          : intl.formatMessage(messages.previousButton)}
      </Typography>
    </Box>
  );

  const renderNextButton = () => {
    const buttonText = isLastUnit && exitText ? exitText : intl.formatMessage(messages.nextButton);

    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        sx={{
          alignItems: 'baseline',
        }}
      >
        <Typography fontSize="18px" fontWeight={700} color="#1A2029" fontFamily="Hind">
          {shouldDisplayNotificationTriggerInSequence ? null : buttonText}
        </Typography>

        <ArrowForwardIcon sx={{ color: '#1A2029', ml: '1rem' }} />
      </Box>
    );
  };

  return (
    sequenceStatus === LOADED && (
      <nav
        id="courseware-sequenceNavigation"
        className={classNames('sequence-navigation', className)}
        style={{ width: shouldDisplayNotificationTriggerInSequence ? '90%' : null }}
      >
        <Box
          sx={{
            '&: hover': { cursor: isFirstUnit ? 'not-allowed' : 'pointer' },
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #eaeaea',
          }}
          onClick={previousHandler}
          as={isFirstUnit ? undefined : Link}
          to={isFirstUnit ? undefined : previousLink}
        >
          {renderPreviousButton()}
        </Box>
        {renderUnitButtons()}
        <Box
          sx={{
            '&: hover': { cursor: isLastUnit && !exitActive ? 'not-allowed' : 'pointer' },
            display: 'flex',
            justifyContent: 'flex-end',
            mr: '2rem',
            pl: '2rem',
            borderBottom: '1px solid #eaeaea',
            borderLeft: '1px solid #eaeaea',
            opacity: isLastUnit && !exitActive ? 0.5 : 1,
          }}
          onClick={nextHandler}
          as={isLastUnit && !exitActive ? undefined : Link}
          to={isLastUnit && !exitActive ? undefined : nextLink}
        >
          {renderNextButton()}
        </Box>
      </nav>
    )
  );
};

SequenceNavigation.propTypes = {
  intl: intlShape.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  className: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
  nextHandler: PropTypes.func.isRequired,
  previousHandler: PropTypes.func.isRequired,
};

SequenceNavigation.defaultProps = {
  className: null,
  unitId: null,
};

export default injectIntl(SequenceNavigation);
