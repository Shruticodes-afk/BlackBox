const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Skull } = require('lucide-react');

const svgString = ReactDOMServer.renderToString(React.createElement(Skull, { 
  color: '#ccff00', 
  size: 32,
  strokeWidth: 2
}));

console.log(svgString);
