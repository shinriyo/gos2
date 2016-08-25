import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent';

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.loadPostsFromServer();
  }

  loadPostsFromServer() {
    request
      .get('/api/posts')
      .set('Accept', 'application/json')
      .set('Content-type', 'application/json')
      .end((err, res) => {
        this.setState({data: res.body.data.reverse()});
      });
  }

  handlePostSubmit(post) {
    // client.js:964 POST http://localhost:4000/api/posts 400 (Bad Request)
    // http://itdoc.hitachi.co.jp/manuals/3020/30203M0360/EM030162.HTM
    request
      .post('/api/posts')
      .set('Accept', 'application/json')
      .set('Content-type', 'application/json')
      .send(JSON.stringify({post: post}))
      .end((err, res) => {
        this.setState({data: [res.body.data].concat(this.state.data)});
      });
  }

  componentWillMount() {
    setInterval(this.loadPostsFromServer.bind(this), 2000);
  }

  render() {
    const posts = this.state.data.map(post => {
      return (
        <Post data={post} key={post.id} />
      );
    });

    return (
      <div className='container'>
        <h1>Phoenix+React Blog Sample</h1>
        <div className='col-md-3'>
          <Submit onPostSubmit={this.handlePostSubmit.bind(this)}/>
        </div>
        <div className='col-md-9'>
          {posts}
        </div>
      </div>
    );
  }
}


const Post = props => {
  return (
    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h4 className='panel-title'>{props.data.title}</h4>
      </div>
      <div className='panel-body'>
        {props.data.body}
      </div>
    </div>
  );
};

class Submit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title: '', body: ''};
  }

  handleSubmit(e) {
    e.preventDefault();
    const title = this.state.title.trim();
    const body = this.state.body.trim();
    if (!title || !body) {
      return;
    }
    this.props.onPostSubmit({title, body});
    this.setState({title: '', body: ''});
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value});
  }

  handleBodyChange(e) {
    this.setState({body: e.target.value});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className='form-group'>
          <input className='form-control' type='text' placeholder='タイトル' value={this.state.title} onChange={this.handleTitleChange.bind(this)}/>
        </div>
        <div className='form-group'>
          <textarea className='form-control' type='text' placeholder='内容' value={this.state.body} onChange={this.handleBodyChange.bind(this)}/>
        </div>
        <input className='btn btn-default pull-right' type='submit' value='Post' />
      </form>
    );
  }
}

ReactDOM.render(
  <Blog/>,
  document.getElementById('main')
)
