import React from "react";
import PropTypes from "prop-types";
import { createHashHistory } from "history";
import { Router, RouterContext } from "./Router";

class Route extends React.Component {
  render () {
    return (
			<RouterContext.Consumer>
			{router => {
					const {path, render, component: Component, setVerses, verses} = this.props;
					if (router.location.pathname.startsWith(path)) {
									if (render) return render();
									if (Component) return React.cloneElement(<Component/>, {setVerses: setVerses});
					}
					return null;
			  }
			}
			</RouterContext.Consumer>
    );
  }
}

export default Route
