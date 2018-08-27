import React from "react"
import PropTypes from "prop-types"
import VerseSearch from "./verseSearch"

class Scripture extends React.Component {
				 state = {verses: "",
									loading: false,
									translation: "eng-NASB",
									formatError: false,
									searchTerm:"" 
 };

	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.state.translation != prevState.translation && !!this.state.searchTerm){
				this.getVerses(this.state.searchTerm);
		}
 }	

	setVerses(verses){
					this.setState({verses: verses});
	}

	toggleLoadIcon(){
		this.setState({loading: !this.state.loading})
	}

	setTranslation(translation){
		this.setState({translation: translation});
	}

 getVerses = (searchTerms) => {
		this.toggleLoadIcon();
		this.state.searchTerm != searchTerms && this.setState({searchTerm: searchTerms});
		const verseRegex = /^(.+) ([\d-:]+)?/ 
		let [, book, section]  = verseRegex.exec(searchTerms.trim());
		fetch(`https://cors-anywhere.herokuapp.com/https://bibles.org/v2/passages.js?q[]=${book}+${section}&version=${this.state.translation}`, {
										headers: {
														'Authorization': "Basic " + btoa(process.env.BIBLE_API_KEY + ":X")
														 }
										})
						.then(response => response.json())
						.then(data => {
										this.toggleLoadIcon();
										var passages = data.response.search.result.passages;
										if (passages.length < 1){
														this.setState({formatError: true })
										}else {
														this.setState({formatError: false});
														this.setState({verses: passages[0].text});
										}
						});
	}

  render () {
							let content;
							if(this.state.loading){
							content = <div>Loading...</div>
							}else {
							content = <div dangerouslySetInnerHTML={{__html: this.state.verses}} />
							}
			return(
							<div>
											{this.state.formatError && <div>Could not find passage. Make sure that your scripture query follows the format of something like 'Psalm 23:1-2'</div>}
											<VerseSearch loadToggle={() => this.toggleLoadIcon()} 
																	 onSearch={(searchTerms) => this.getVerses(searchTerms)}
																	 onTranslationChange={(event) => this.setTranslation(event.target.value)}
																	 defaultTranslation= {this.state.translation} />
							{content}
							</div>
			);
 } 
}

export default Scripture
