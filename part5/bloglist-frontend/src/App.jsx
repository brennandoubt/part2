import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const BlogForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        title:
        <input
          type='text'
          value={props.title}
          name='Title'
          onChange={props.handleTitleChange}
        />
      </div>
      <div>
        author:
        <input
          type='text'
          value={props.author}
          name='Author'
          onChange={props.handleAuthorChange}
        />
      </div>
      <div>
        url:
        <input
          type='text'
          value={props.url}
          name='URL'
          onChange={props.handleUrlChange}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )
}

const Button = ({ text, handler }) => <button onClick={handler}>{text}</button>

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // implement frontend for user login
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(`logging in with ${username} ${password}`)

    try {
      // token and user details saved to 'user'
      const user = await loginService.login({
        username, password
      })
      // store login info in local storage of web app
      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(`Error: exception ${exception} caught`)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    console.log(`logging out ${username}...`)

    // remove logged user info from local storage + update user state
    window.localStorage.removeItem('loggedBloglistappUser')
    blogService.setToken(null)
    setUser(null)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // fetch logged-in user info if present in local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async event => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    // create new blog post and add to blogs list
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }


  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <Button text='logout' handler={handleLogout} />
      </p>
      <h2>create new</h2>
      <BlogForm
        title={title}
        author={author}
        url={url}
        handleSubmit={addBlog}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleUrlChange={({ target }) => setUrl(target.value)}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user &&
        <div>
          {blogList()}
        </div>
      }
    </div>
  )
}

export default App