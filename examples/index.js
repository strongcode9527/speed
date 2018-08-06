import Speed, {Component, render} from '../src'


class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div onClick={() => {}}>
        <span>strong1</span>   
        <span>strong2</span>   
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))




