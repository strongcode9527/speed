import Speed, {Component, render} from '../src'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      num: 0,
      show: true
    }

  }

  componentDidMount() {
    let numa = 0
    this.id = setInterval(() => {
      numa++
      this.setState({num: this.state.num + 1, show: !this.state.show})
      // if(numa === 2) clearInterval(this.id)
    }, 1000)
  }

  render() {
    const {num} = this.state

    return (
      <div onClick={() => {console.log('in')}} style={{background: 'red'}}>
        <span>{num}</span> 
        <span>strong1</span>   
        <span data-index={this.state.num}>strong2</span>
        {
          this.state.show && <div>show</div>
        }  
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))




