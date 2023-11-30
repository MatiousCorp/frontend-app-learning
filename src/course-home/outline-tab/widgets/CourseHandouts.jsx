import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import LmsHtmlFragment from '../LmsHtmlFragment';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const CourseHandouts = ({ intl }) => {
  const { courseId } = useSelector(state => state.courseHome);
  const { handoutsHtml } = useModel('outline', courseId);

  if (!handoutsHtml) {
    return null;
  }

  return (
    <section className="mb-4">
      <Typography fontSize="18px" fontWeight={700} color="#1A2029" fontFamily="Hind">
        {intl.formatMessage(messages.handouts)}
      </Typography>
      <LmsHtmlFragment
        className="medium"
        html={handoutsHtml}
        title={intl.formatMessage(messages.handouts)}
      />
    </section>
  );
};

CourseHandouts.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseHandouts);
