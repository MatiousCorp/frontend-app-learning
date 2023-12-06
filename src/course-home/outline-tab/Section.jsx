import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Collapsible, IconButton } from '@edx/paragon';
import {
  faCheckCircle as fasCheckCircle,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Typography } from '@mui/material';
import SequenceLink from './SequenceLink';
import { useModel } from '../../generic/model-store';

import genericMessages from '../../generic/messages';
import messages from './messages';

const Section = ({ courseId, defaultOpen, expand, intl, section }) => {
  const { complete, sequenceIds, title } = section;
  const {
    courseBlocks: { sequences },
  } = useModel('outline', courseId);

  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionTitle = (
    <div className="row w-100 m-0">
      <div className="col-auto p-0">
        {complete ? (
          <FontAwesomeIcon
            icon={fasCheckCircle}
            fixedWidth
            className="float-left mt-1 text-success"
            aria-hidden="true"
            title={intl.formatMessage(messages.completedSection)}
          />
        ) : (
          <FontAwesomeIcon
            icon={farCheckCircle}
            fixedWidth
            className="float-left mt-1 text-gray-400"
            aria-hidden="true"
            title={intl.formatMessage(messages.incompleteSection)}
          />
        )}
      </div>
      <div className="col-10 ml-3 p-0 font-weight-bold text-dark-500">
        <Typography
          width="100%"
          fontWeight={700}
          fontSize="20px"
          fontFamily="Hind"
          sx={{ verticalAlign: 'top !important' }}
        >
          {title}
        </Typography>
        <span className="sr-only">
          , {intl.formatMessage(complete ? messages.completedSection : messages.incompleteSection)}
        </span>
      </div>
    </div>
  );

  return (
    <li>
      <Collapsible
        className="mb-2"
        styling="card-lg"
        style={{
          borderLeft: '2px solid #434C59',
          backgroundColor: '#F9FAFA',
        }}
        title={sectionTitle}
        open={open}
        onToggle={() => {
          setOpen(!open);
        }}
        iconWhenClosed={(
          <IconButton
            alt={intl.formatMessage(messages.openSection)}
            icon={faChevronDown}
            onClick={() => {
              setOpen(true);
            }}
            size="sm"
          />
        )}
        iconWhenOpen={(
          <IconButton
            alt={intl.formatMessage(genericMessages.close)}
            icon={faChevronUp}
            onClick={() => {
              setOpen(false);
            }}
            size="sm"
          />
        )}
      >
        <ol className="list-unstyled" style={{ paddingLeft: '40px' }}>
          {sequenceIds.map((sequenceId, index) => (
            <SequenceLink
              key={sequenceId}
              id={sequenceId}
              courseId={courseId}
              sequence={sequences[sequenceId]}
              first={index === 0}
            />
          ))}
        </ol>
      </Collapsible>
    </li>
  );
};

Section.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  section: PropTypes.shape().isRequired,
};

export default injectIntl(Section);
