import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Card, Icon } from '@edx/paragon';
import { history } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Email } from '@edx/paragon/icons';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import messages from '../messages';
import LearningGoalButton from './LearningGoalButton';
import { saveWeeklyLearningGoal } from '../../data';
import { useModel } from '../../../generic/model-store';
import './FlagButton.scss';

const WeeklyLearningGoalCard = ({ daysPerWeek, subscribedToReminders, intl }) => {
  const { courseId } = useSelector(state => state.courseHome);

  const { isMasquerading, org } = useModel('courseHomeMeta', courseId);

  const { administrator } = getAuthenticatedUser();

  const [daysPerWeekGoal, setDaysPerWeekGoal] = useState(daysPerWeek);
  // eslint-disable-next-line react/prop-types
  const [isGetReminderSelected, setGetReminderSelected] = useState(subscribedToReminders);
  const location = useLocation();

  const handleSelect = (days, triggeredFromEmail = false) => {
    // Set the subscription button if this is the first time selecting a goal
    const selectReminders = daysPerWeekGoal === null ? true : isGetReminderSelected;
    setGetReminderSelected(selectReminders);
    setDaysPerWeekGoal(days);
    if (!isMasquerading) {
      // don't save goal updates while masquerading
      saveWeeklyLearningGoal(courseId, days, selectReminders);
      sendTrackEvent('edx.ui.lms.goal.days-per-week.changed', {
        org_key: org,
        courserun_key: courseId,
        is_staff: administrator,
        num_days: days,
        reminder_selected: selectReminders,
      });
      if (triggeredFromEmail) {
        sendTrackEvent('enrollment.email.clicked.setgoal', {});
      }
    }
  };

  function handleSubscribeToReminders(event) {
    const isGetReminderChecked = event.target.checked;
    setGetReminderSelected(isGetReminderChecked);
    if (!isMasquerading) {
      // don't save goal updates while masquerading
      saveWeeklyLearningGoal(courseId, daysPerWeekGoal, isGetReminderChecked);
      sendTrackEvent('edx.ui.lms.goal.reminder-selected.changed', {
        org_key: org,
        courserun_key: courseId,
        is_staff: administrator,
        num_days: daysPerWeekGoal,
        reminder_selected: isGetReminderChecked,
      });
    }
  }

  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const weeklyGoal = Number(currentParams.get('weekly_goal'));
    if ([1, 3, 5].includes(weeklyGoal)) {
      handleSelect(weeklyGoal, true);

      // Deleting the weekly_goal query param as it only needs to be set once
      // whenever passed in query params.
      currentParams.delete('weekly_goal');
      history.replace({
        search: currentParams.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <Card
      id="courseHome-weeklyLearningGoal"
      className="row w-100 m-0 mb-3 raised-card"
      data-testid="weekly-learning-goal-card"
    >
      {/* <Card.Header
        size="sm"
        title={<div id="set-weekly-goal-header">{intl.formatMessage(messages.setWeeklyGoal)}</div>}
        subtitle={intl.formatMessage(messages.setWeeklyGoalDetail)}
      /> */}
      <Box paddingX="20px" pt="20px">
        <Typography fontWeight={700} fontSize="22px" fontFamily="Hind">
          {intl.formatMessage(messages.setWeeklyGoal)}
        </Typography>
        <Typography fontWeight={400} fontSize="18px" fontFamily="Hind" sx={{ opacity: 0.7 }}>
          {intl.formatMessage(messages.setWeeklyGoalDetail)}
        </Typography>
      </Box>
      <Card.Section className="text-gray-700 small">
        <div
          role="radiogroup"
          aria-labelledby="set-weekly-goal-header"
          className="flag-button-container m-0 p-0"
        >
          <LearningGoalButton
            level="casual"
            isSelected={daysPerWeekGoal === 1}
            handleSelect={handleSelect}
          />
          <LearningGoalButton
            level="regular"
            isSelected={daysPerWeekGoal === 3}
            handleSelect={handleSelect}
          />
          <LearningGoalButton
            level="intense"
            isSelected={daysPerWeekGoal === 5}
            handleSelect={handleSelect}
          />
        </div>
        <div className="d-flex pt-3">
          <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
            label={(
              <Typography fontWeight={400} fontSize="18px" fontFamily="Hind">
                {intl.formatMessage(messages.setGoalReminder)}
              </Typography>
            )}
            checked={isGetReminderSelected}
            onChange={event => handleSubscribeToReminders(event)}
            disabled={!daysPerWeekGoal}
          />
        </div>
      </Card.Section>
      {isGetReminderSelected && (
        <Card.Section muted>
          <div className="row w-100 m-0 small align-center">
            <div className="d-flex align-items-center pr-1">
              <Icon className="text-primary-500" src={Email} />
            </div>
            <div className="col">
              <Typography fontWeight={400} fontSize="16px" fontFamily="Hind">
                {intl.formatMessage(messages.goalReminderDetail)}
              </Typography>
            </div>
          </div>
        </Card.Section>
      )}
    </Card>
  );
};

WeeklyLearningGoalCard.propTypes = {
  daysPerWeek: PropTypes.number,
  subscribedToReminders: PropTypes.bool,
  intl: intlShape.isRequired,
};

WeeklyLearningGoalCard.defaultProps = {
  daysPerWeek: null,
  subscribedToReminders: false,
};
export default injectIntl(WeeklyLearningGoalCard);

const IOSSwitch = styled(props => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));
