import CodeMirror from "codemirror/lib/codemirror"

CodeMirror.defineMode("loanRulesCMM", function(config, parserConfig) {

  const keyChars = [
    "a", // Campus
    "b", // Branch
    "c", // Collection 
    "g", // Patron Group
    "m", // Material Type
    "s", // Shelf
    "t", // Loan type,
  ]

  const regex = new RegExp("^["+keyChars.join("")+"]\\s(?:(?![\\+:]).)*");

  const state = {};

  return {

    startState: function() {
      return state
    },

    token: function(stream, state) {

      let tokenClass;

      const match = stream.match(regex);

      if(match) {
        tokenClass = match[0][0];
      } else { 
        stream.next();
      }

      return tokenClass ? tokenClass : null;
    }
  };
});