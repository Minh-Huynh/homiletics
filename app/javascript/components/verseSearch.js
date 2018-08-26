import React from "react"
import PropTypes from "prop-types"

class VerseSearch extends React.Component {
 
 state = { bookNames: {},
					loading: false,
					versions: {"Amplified Bible": "eng-AMP",
   									 "Contemporary English Version": "eng-CEV",
										 "Contemporary English Version (US Version)": "eng-CEVD",
										 "Good News Translation (US Version)": "eng-GNTD",
 										 "King James Version with Apocrypha, American Editio…":"eng-KJVA",
										 "New American Standard Bible":"eng-NASB",
										 "The Message":"eng-MSG" 
         							},
}

 componentDidMount() {
	 this.getBookNames();
 }

componentWillMount() {
	this.getTranslations();
}

  

 getBookNames = () => {
		fetch(`https://cors-anywhere.herokuapp.com/https://bibles.org/v2/versions/${this.props.defaultTranslation}/books.js`, {
					  headers: {
										'Authorization': "Basic " + btoa(process.env.BIBLE_API_KEY + ":X")
										 }
						})
		.then(response => response.json())
		.then(data => {
						let bookNames = {};
						data.response.books.forEach( book => {
							bookNames[book.name] = book.abbr
						});
						this.setState({bookNames: bookNames});
		});
	}

 getTranslations = () => {
		fetch('https://cors-anywhere.herokuapp.com/https://bibles.org/v2/versions.js?language=eng-US', {
					  headers: {
										'Authorization': "Basic " + btoa(process.env.BIBLE_API_KEY + ":X")
										 }
						})
		.then(response => response.json())
		.then(data => {
				let versions = {};
				data.response.versions.map( (versionObj) => {
					versions[versionObj.name] = versionObj.id;
				})	
			this.setState({versions: versions});
		});
  }


	handleChange = (e) => {
				if(e.keyCode == 13){
								this.props.onSearch(e.target.value);
				}
	}	

  render () {
	const options =	Object.entries(this.state.versions).map( valuePair => 
												 <option key={valuePair[1]} value={valuePair[1]}>{valuePair[0]}</option>
												 ) 	
											
    return (
			<div>
							<input type="text" onKeyDown={this.handleChange} ></input>
							<label>Translation:
											<select defaultValue={this.props.defaultTranslation} onChange={this.props.onTranslationChange}>
												{options}
											</select>
							</label>
			</div>
    );
  }
}

export default VerseSearch
