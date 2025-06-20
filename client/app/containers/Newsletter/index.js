/**
 *
 * Newsletter
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import mapDispatchToProps from '../../actions';
import { VI } from '../../constants/vi';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';

class Newsletter extends React.PureComponent {
  componentDidMount() {
    this.props.resetNewsletter();
  }

  render() {
    const {
      newsletterFormData,
      formErrors,
      newsletterChange,
      subscribeNewsletter
    } = this.props;

    const handleSubmit = event => {
      event.preventDefault();
      subscribeNewsletter();
    };

    return (
      <div className='newsletter'>
        <form onSubmit={handleSubmit} noValidate>
          <Row>
            <Col xs='12' md='12'>
              <Input
                type={'text'}
                error={formErrors['email']}
                label={VI['Email Address']}
                name={'email'}
                placeholder={VI['Your Email Address']}
                value={newsletterFormData.email}
                onInputChange={(name, value) => {
                  newsletterChange(name, value);
                }}
              />
            </Col>
          </Row>
          <div className='newsletter-actions'>
            <Button type='submit' variant='primary' text={VI['Subscribe']} />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    newsletterFormData: state.newsletter.newsletterFormData,
    formErrors: state.newsletter.formErrors
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Newsletter);
