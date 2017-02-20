import React from 'react'

let ControllerUnit = React.createClass({
  handleClick: function(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center()
    }
    e.stopPropagation()
    e.preventDefault()
  },
  render: function() {
    let controllerUnitClassName = 'controller-unit'
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center'
    }
    if (this.props.arrange.isInverse) {
      controllerUnitClassName += ' is-inverse'
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}>
        
      </span>
    )
  }
})

export default ControllerUnit
