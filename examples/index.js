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
    // this.id = setInterval(() => {
    //   this.setState({num: this.state.num + 1, show: !this.state.show})
    // }, 1)
  }

  componentDidUpdate() {
    console.log('in update')
  }

  render() {
    const {num} = this.state

    return (
      <div onClick={() => {console.log('in')}} style={{background: 'red'}} className="container">
        <span>{num}</span> 
        <span data-index={this.state.num}>strong2</span>
        {
          this.state.show && <div onClick={(e) => {console.log('in child'); e.stopPropagation();}}>show</div>
        }  
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))




