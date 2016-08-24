import React from 'react'
import ReactDOM from 'react-dom'

class Blog extends React.Component {
  render() {
    return (<h1>Hello World!</h1>)
  }
}

ReactDOM.render(
  <Blog/>,
  document.getElementById('main')
)
