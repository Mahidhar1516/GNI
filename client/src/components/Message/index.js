
// Write your code here
const Message = props => {
  const {isLoggedin} = props
  const message = isLoggedin ? 'Welcome User' : 'Please Login'
  return <h1>{message}</h1>
}

export default Message
