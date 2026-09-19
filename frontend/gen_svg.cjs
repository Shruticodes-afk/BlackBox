const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Skull } = require('lucide-react');
const fs = require('fs');

const svgString = ReactDOMServer.renderToString(React.createElement(Skull, { 
  color: '#ccff00', 
  size: 32,
  strokeWidth: 2,
  xmlns: "http://www.w3.org/2000/svg"
}));

fs.writeFileSync('public/favicon.svg', svgString, 'utf8');
console.log("Saved favicon.svg!");
