import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { useSelector } from 'react-redux';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { Box, Button } from '@material-ui/core';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const StartOrResumeCourseCard = ({ intl }) => {
  const { courseId } = useSelector(state => state.courseHome);

  const { org } = useModel('courseHomeMeta', courseId);

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const {
    resumeCourse: { hasVisitedCourse, url: resumeCourseUrl },
  } = useModel('outline', courseId);

  if (!resumeCourseUrl) {
    return null;
  }

  const logResumeCourseClick = () => {
    sendTrackingLogEvent('edx.course.home.resume_course.clicked', {
      ...eventProperties,
      event_type: hasVisitedCourse ? 'resume' : 'start',
      url: resumeCourseUrl,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      border="1px solid #C8CACC"
      borderRadius="10px"
      padding="15px"
      style={{ marginBottom: '1rem' }}
    >
      <Box fontSize="20px" fontWeight={700} fontFamily="Hind">
        {hasVisitedCourse
          ? intl.formatMessage(messages.resumeBlurb)
          : intl.formatMessage(messages.startBlurb)}
      </Box>
      <Button
        variant="contained"
        href={resumeCourseUrl}
        onClick={() => logResumeCourseClick()}
        style={{
          backgroundColor: '#434C59',
          height: '50px',
          borderRadius: '5px',
        }}
        startIcon={<PlayCircleOutlineIcon style={{ color: 'white', fontSize: 24 }} />}
      >
        <Box
          fontSize="16px"
          fontWeight={500}
          fontFamily="Hind"
          color="white"
          style={{ textTransform: 'capitalize' }}
        >
          {hasVisitedCourse
            ? intl.formatMessage(messages.resume)
            : intl.formatMessage(messages.start)}
        </Box>
      </Button>
    </Box>
  );
};

StartOrResumeCourseCard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StartOrResumeCourseCard);
