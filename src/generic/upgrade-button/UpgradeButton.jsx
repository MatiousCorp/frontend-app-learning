import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Box } from '@material-ui/core';

import FormattedPricing from './FormattedPricing';

const UpgradeButton = props => {
  const { intl, offer, variant, onClick, verifiedMode, ...rest } = props;

  // Prefer offer's url in case it is ever different (though it is not at time of this writing)
  const url = offer ? offer.upgradeUrl : verifiedMode.upgradeUrl;

  return (
    <Button
      variant="contained"
      block
      href={url}
      onClick={onClick}
      style={{
        backgroundColor: '#434C59',
        height: '50px',
        borderRadius: '5px',
      }}
      fullWidth
      {...rest}
    >
      <Box
        fontSize="16px"
        fontWeight={500}
        style={{ textTransform: 'capitalize' }}
        fontFamily="Hind"
        color="white"
      >
        <FormattedMessage
          id="learning.upgradeButton.buttonText"
          defaultMessage="Upgrade for {pricing}"
          values={{
            pricing: <FormattedPricing offer={offer} verifiedMode={verifiedMode} />,
          }}
        />
      </Box>
    </Button>
  );
};

UpgradeButton.defaultProps = {
  offer: null,
  onClick: null,
  variant: 'primary',
};

UpgradeButton.propTypes = {
  intl: intlShape.isRequired,
  offer: PropTypes.shape({
    upgradeUrl: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func,
  verifiedMode: PropTypes.shape({
    upgradeUrl: PropTypes.string.isRequired,
  }).isRequired,
  variant: PropTypes.string,
};

export default injectIntl(UpgradeButton);
