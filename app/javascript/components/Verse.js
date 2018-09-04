import React from "react"
import PropTypes from "prop-types"
class Verse extends React.Component {
  render () {
    return (
    	<div className="VerseComponent">{this.props.children}</div>
    );
  }
}

export default Verse
