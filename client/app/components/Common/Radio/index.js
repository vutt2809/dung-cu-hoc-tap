/**
 *
 * Checkbox
 *
 */

import React from 'react';

class Radio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      size: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      size: event.target.value
    });
    this.props.handleChangeSubmit(event.target.name,event.target.value);
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            <label>
              <input
                name="sorting"
                type="radio"
                value="Mới nhất"
                checked={this.state.size === "Mới nhất"}
                onChange={this.handleChange}
              />
              Mới nhất
            </label>
          </li>

          <li>
            <label>
              <input
                name="sorting"
                type="radio"
                value="Giá cao nhất"
                checked={this.state.size === "Giá cao nhất"}
                onChange={this.handleChange}
              />
              Giá cao nhất
            </label>
          </li>

          <li>
            <label>
              <input
                name="sorting"
                type="radio"
                value="Giá thấp nhất"
                checked={this.state.size === "Giá thấp nhất"}
                onChange={this.handleChange}
              />
              Giá thấp nhất
            </label>
          </li>
        </ul>
      </div>
    );
  }
}

export default Radio;
