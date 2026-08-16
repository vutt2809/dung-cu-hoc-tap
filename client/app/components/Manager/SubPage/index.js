/**
 *
 * SubPage
 *
 */

import React from 'react';
import Button from '../../Common/Button';

const SubPage = props => {
  const { title, actionTitle, handleAction, children } = props;

  const isAddAction =
    actionTitle &&
    (actionTitle.toLowerCase().includes('thêm') ||
      actionTitle.toLowerCase().includes('add') ||
      actionTitle.toLowerCase().includes('tạo'));

  return (
    <div className='sub-page'>
      <div className='subpage-header'>
        <h3 className='subpage-title mb-0'>{title}</h3>
        {actionTitle && (
          <div className='action'>
            <Button
              variant={isAddAction ? 'primary' : 'secondary'}
              size='sm'
              text={actionTitle}
              icon={isAddAction ? <i className='fa fa-plus mr-1' /> : null}
              onClick={handleAction}
            />
          </div>
        )}
      </div>
      <div className='subpage-body'>{children}</div>
    </div>
  );
};

export default SubPage;
