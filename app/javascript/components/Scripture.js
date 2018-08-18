import React from "react"
import PropTypes from "prop-types"
class Scripture extends React.Component {

 componentDidMount(){
				 this.getVerses();
 }

 getVerses(){
		fetch('https://bibles.org/v2/chapters/eng-NASB:Exod.2/verses.js', {
					  headers: {
										'Authorization': "Basic " + btoa(ENV["bible_api_token"]),
										'Content-Type': 'application/json'
										 },
						})
		.then(response => response.json())
		.then(data => {
						console.log(data)
		});
	}

  render () {
    return (
			<div>Hello There</div>
    );
  }
}

export default Scripture
