import React from "react"
import PropTypes from "prop-types"
import VerseSearch from "./verseSearch"
import Verse from "./Verse"
import { AppContext } from "./App"
import ReactDOMServer from 'react-dom/server'
import HtmlToReact from "html-to-react"
import { Parser } from "html-to-react"

class Scripture extends React.Component {
				 state = {
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
					this.props.setVerses(verses);
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
		fetch(`https://cors-homiletics.herokuapp.com/https://bibles.org/v2/passages.js?q[]=${book}+${section}&version=${this.state.translation}`, {
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
														this.props.setVerses("Could not find passage. Make sure that your scripture query follows the format of something like 'Psalm 23:1-2'</div>");
										}else {
														this.setState({formatError: false});
														var textWithDivs = this.insertVerseDivs(passages[0].text);
														var textWithComponents = this.replaceVerseDivsWithComponents(textWithDivs.body.innerHTML);
														this.props.setVerses(textWithComponents);
										}
						})
						.catch(error => console.error('Error:', error));;
	}
	replaceVerseDivsWithComponents(passageText){
		var htmlToReactParser = new Parser();
		var isValidNode = () => true;
		var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
		var processingInstruction = [
			{
				replaceChildren: true,
				shouldProcessNode: (node) => {
					return node.attribs && node.attribs['class'] === 'verse';
			
				},
				processNode: (node, children, index) => {
					return <Verse>{children}</Verse>
				}
			},
			{
				shouldProcessNode: (node) => true,
				processNode: processNodeDefinitions.processDefaultNode,
			},
		];
		var reactComponent = htmlToReactParser.parseWithInstructions(passageText, isValidNode, processingInstruction);
		var reactHTML = ReactDOMServer.renderToStaticMarkup(reactComponent);
		return reactHTML;

	}
	//Bible API doesn't have any wrappers around the verses, so this function adds spans
	insertVerseDivs(passageText){
		let currentlyInsideVerse;
		let partOfVerse = 1;
		let passageDOM = new DOMParser().parseFromString(passageText, "text/html");
		let paragraphs = passageDOM.getElementsByTagName("p");
		Array.from(paragraphs).forEach( paragraph => {
			let nextSib = paragraph.firstChild;
			let nextSibContainer;
			let wrapper = passageDOM.createElement('span');
			while(nextSib){
				if(currentlyInsideVerse && 
		           nextSib.tagName !== "SUP" && 
				   paragraph.firstChild == nextSib) {
					partOfVerse++;
					wrapper.setAttribute('id', `${currentlyInsideVerse}.${partOfVerse}`);
					wrapper.setAttribute('class', `verse`);
					nextSib.parentNode.insertBefore(wrapper, nextSib);
				}else if(nextSib.tagName === "SUP") {
					currentlyInsideVerse = nextSib.id; 
					partOfVerse = 1;
					wrapper = passageDOM.createElement('span');
					wrapper.setAttribute('id', `${currentlyInsideVerse}.${partOfVerse}`);
					wrapper.setAttribute('class', `verse`);
					nextSib.parentNode.insertBefore(wrapper, nextSib);
				}
				nextSibContainer = nextSib.nextSibling;
				wrapper.appendChild(nextSib);
				nextSib = nextSibContainer;
			};

		});
		return passageDOM;

	}

  render () {
			return(
	  		<AppContext.Consumer>
	  			{context => {
	  				const {setVerses} = this.props;
					let content;
					if(this.state.loading){
						content = <div>Loading...</div>
						}else {
						content = <div dangerouslySetInnerHTML={{__html: context.verses}} />
						}
						return (
							<div>
								<VerseSearch loadToggle={() => this.toggleLoadIcon()} 
											 onSearch={(searchTerms) => this.getVerses(searchTerms)}
											 onTranslationChange={(event) => this.setTranslation(event.target.value)}
											 defaultTranslation= {this.state.translation} />
								{content}
							</div>
						);
		  			}
		  		}
		  	</AppContext.Consumer>
			);
 } 
}

export default Scripture
