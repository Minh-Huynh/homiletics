import React from "react"
import PropTypes from "prop-types"
import { createHashHistory } from "history"

const RouterContext = React.createContext();

class Router extends React.Component {
  

	history = createHashHistory();

	state = {location: this.history.location};

	componentDidMount(){
					this.history.listen(location => {
									this.setState({location});
					});
	}

	handlePush = to => {
					this.history.push(to);
	};
	

  render () {
    return (
			<RouterContext.Provider
				{...this.props}
				value={{location: this.state.location, push: this.handlePush }}
				/>
    );
  }
}

export { Router, RouterContext }

