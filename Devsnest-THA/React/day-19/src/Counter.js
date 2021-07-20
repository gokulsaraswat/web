"use strict"

import React, {Component} from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }

  increaseCount = () => {
    this.setState((prevState) => {
      return {
        count: prevState.count + 1
      }
    })
  }

  render() {
    return (
      <button onClick={this.increaseCount} className="counter">
        {this.state.count}
      </button>
    );
  }
}

export default Counter;
