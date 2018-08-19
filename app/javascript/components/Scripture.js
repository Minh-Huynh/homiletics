import React from "react"
import PropTypes from "prop-types"
class Scripture extends React.Component {

 state = {verses: ""}

 componentDidMount(){
				 this.getVerses();
 }

 getVerses(){
		fetch('https://cors-anywhere.herokuapp.com/https://bibles.org/v2/chapters/eng-NASB:Exod.2/verses.js', {
					  headers: {
										'Authorization': "Basic " + btoa(process.env.BIBLE_API_KEY + ":X")
										 }
						})
		.then(response => response.json())
		.then(data => {
						console.log(data);
						this.setState({verses: data.response.verses[0]});
		});
	}

  render () {
    return (
			<div>Hello There</div>
    );
  }
}

export default Scripture
