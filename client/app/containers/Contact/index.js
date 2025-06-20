/*
 *
 * Contact
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import { VI } from '../../constants/vi';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';

class Contact extends React.PureComponent {
  componentDidMount() {
    this.props.resetContact();
  }

  render() {
    const {
      contactFormData,
      formErrors,
      contactChange,
      addContact
    } = this.props;

    const handleSubmit = event => {
      event.preventDefault();
      addContact();
    };

    return (
      <div className='contact'>
        <div className='bg-white p-4 box-shadow-primary'>
          <form onSubmit={handleSubmit} noValidate>
            <Row>
              <Col xs='12' md='12'>
                <Input
                  type={'text'}
                  error={formErrors['name']}
                  label={VI['Name']}
                  name={'name'}
                  placeholder={VI['Your Full Name']}
                  value={contactFormData.name}
                  onInputChange={(name, value) => {
                    contactChange(name, value);
                  }}
                />
              </Col>
              <Col xs='12' md='12'>
                <Input
                  type={'text'}
                  error={formErrors['email']}
                  label={VI['Email Address']}
                  name={'email'}
                  placeholder={VI['Your Email Address']}
                  value={contactFormData.email}
                  onInputChange={(name, value) => {
                    contactChange(name, value);
                  }}
                />
              </Col>
              <Col xs='12' md='12'>
                <Input
                  type={'textarea'}
                  error={formErrors['message']}
                  label={VI['Message']}
                  name={'message'}
                  placeholder={VI['Please Describe Your Message']}
                  value={contactFormData.message}
                  onInputChange={(name, value) => {
                    contactChange(name, value);
                  }}
                />
              </Col>
            </Row>
            <hr />
            <div className='contact-actions'>
              <Button type='submit' text={VI['Submit']} />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    contactFormData: state.contact.contactFormData,
    formErrors: state.contact.formErrors
  };
};

export default connect(mapStateToProps, actions)(Contact);
