import React from "react"
import PropTypes from "prop-types"
import { RouterContext, Router } from "./Router"
import Link from "./Link"
import Route from "./Route"
import Scripture from "./Scripture"
import VerseSearch from "./verseSearch"

class App extends React.Component {
	render() {
    return (
			<div>
							<Router>
								<Link to="/passage">Passage Selection </Link>
								<Link to="/content">Content</Link>
								<Link to="/divisions">Divisions</Link>
								<Link to="/subject">Subject Sentence</Link>
								<Route path="/passage" component={Scripture} />
							</Router>
			</div>
    );
	}
}

export default App
