import React from "react"
import PropTypes from "prop-types";
import { createHashHistory } from "history";
import { Router, RouterContext } from "./Router";

class Link extends React.Component {
	handleClick = (event, router) => {
					event.preventDefault();
					router.push(this.props.to);
	};

  render () {
    return (
      <RouterContext.Consumer>
				{ router => (
														<a href={`#${this.props.to}`}
															onClick={event => this.handleClick(event,router)}
														>
															{this.props.children}
														</a>
				 )}
      </RouterContext.Consumer>
    );
  }
}

export default Link
