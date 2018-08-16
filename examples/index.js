import Speed, {Component, render} from '../src'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      num: 0,
    }

  }

  componentDidMount() {
    console.log('in didMount')
    setTimeout(() => this.setState({num: this.state.num + 1}))
  }

  render() {
    const {num} = this.state

    return (
      <div onClick={() => {}}>
        <span>strong1</span>   
        <span>strong2</span>
        <span>count {num}</span>   
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))




