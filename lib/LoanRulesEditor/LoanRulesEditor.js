import React from 'react';
import '!style-loader!css-loader!./CodeMirrorCustom.css';
import CodeMirror from 'react-codemirror';
import './LoanRulesCMM';
import 'codemirror/mode/yaml/yaml';
import './LoanRulesEditor.css';

class LoanRulesEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.updateCode = this.updateCode.bind(this);

  }

  getInitialState() {
		return  {
      codeMirrorOptions: {
		  	lineNumbers: true,
        tabSize: 4,
        indentUnit: 4,
        indentWithTabs: true,
        mode: 'loanRulesCMM'
	  	},
      code: ""
    }
	}

  updateCode(newCode, foo, bar) {
    //console.log(newCode);
		this.setState({
			code: newCode,
		});
	}

  render() {
    return(
      <CodeMirror value={this.state.code} onChange={this.updateCode} options={this.state.codeMirrorOptions} />
    );
  }

}

export default LoanRulesEditor;