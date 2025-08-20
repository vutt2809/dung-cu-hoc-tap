import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { error } from 'react-notification-system-redux';

import Input from '../../Common/Input';
import Button from '../../Common/Button';

const AddMessage = props => {
  const { onSubmit } = props;
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleOnSubmit = e => {
    e.preventDefault();
    if (!message.trim()) {
      const errorOptions = {
        title: 'Lỗi',
        message: 'Vui lòng nhập tin nhắn.',
        position: 'tr',
        autoDismiss: 2
      };
      dispatch(error(errorOptions));
      return;
    }
    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Input
        autoComplete='off'
        type={'text'}
        name={'message'}
        placeholder='Nhập tin nhắn'
        value={message}
        onInputChange={(_, value) => setMessage(value)}
        inlineElement={<SendButton disabled={!message} />}
      />
    </form>
  );
};

const SendButton = ({ disabled }) => (
  <Button type='submit' disabled={disabled} variant='primary' text='Gửi' />
);

export default AddMessage;
