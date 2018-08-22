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
    let num = 0
    this.id = setInterval(() => {
      num++
      if(num === 2) clearInterval(this.id)
      this.setState({num: this.state.num + 1, show: !this.state.show})
    }, 1000)
  }

  render() {
    const {num} = this.state

    return (
      <div onClick={() => {console.log('in')}} style={{background: 'red'}}>
        <span>strong1</span>   
        <span data-index={this.state.num}>strong2</span>
        <span>count {num}</span> 
        {
          this.state.show && <div>show</div>
        }  
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))




