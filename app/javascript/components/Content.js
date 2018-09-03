import React from "react"
import PropTypes from "prop-types"
import { AppContext } from "./App"

class Content extends React.Component {
	
  render () {
    return (
    	<AppContext.Consumer>
    		{context => {
	          return <div dangerouslySetInnerHTML={{__html: context.verses}} />
    		}
    	}
    	</AppContext.Consumer>
   );
  }
}


export default Content
