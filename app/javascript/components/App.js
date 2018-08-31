import React from "react"
import PropTypes from "prop-types"
import { RouterContext, Router } from "./Router"
import Link from "./Link"
import Route from "./Route"
import Scripture from "./Scripture"
import VerseSearch from "./verseSearch"

const AppContext = React.createContext();

class App extends React.Component {
	state = { verses: "" }

	setVerses(verses){
		this.setState({verses: verses});
	}

	render() {
    return (
    	<AppContext.Provider
    		{...this.props}
    		value={{verses: this.state.verses, 
    			      loading: this.state.loading}}>
				<div>
								<Router>
									<Link to="/passage">Passage Selection </Link>
									<Link to="/content">Content</Link>
									<Link to="/divisions">Divisions</Link>
									<Link to="/subject">Subject Sentence</Link>
									<Route path="/passage" component={Scripture}
									                       setVerses={(verses) => this.setVerses(verses)} />
								</Router>
				</div>
			</AppContext.Provider>
    );
	}
}

export default App
export { AppContext }
