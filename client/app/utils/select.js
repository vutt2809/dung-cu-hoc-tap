/**
 *
 * select.js
 * this helper formulate data into select options
 */

export const formatSelectOptions = (data, empty = false, from) => {
  let newSelectOptions = [];

  if (data && data.length > 0) {
    data.map(option => {
      let newOption = {};
      newOption.value = option.id !== undefined ? option.id : option.value;
      newOption.label = option.name !== undefined ? option.name : option.label;
      newOption.id = option.id;
      newOption.name = option.name;
      newSelectOptions.push(newOption);
    });
  }

  if (empty) {
    const emptyOption = {
      value: 0,
      label: 'No option selected'
    };
    newSelectOptions.unshift(emptyOption);
  }

  return newSelectOptions;
};

export const unformatSelectOptions = data => {
  if (!data) return null;

  let newSelectOptions = [];

  if (data && data.length > 0) {
    data.map(option => {
      let newOption = {};
      newOption.id = option.value !== undefined ? option.value : option.id;
      if (newOption.id !== undefined && newOption.id !== null) {
        newSelectOptions.push(newOption.id);
      }
    });
  }

  return newSelectOptions;
};
