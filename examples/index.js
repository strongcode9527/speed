import Speed, {Component, render} from '../src'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      num: 0,
      show: false,
      list: [{title: 'strong'}, {title: 'strong123'}]
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

  handleClick = () => {
    console.log('insssss');
  }

  render() {
    const {num, list} = this.state

    return (
      <div style={{background: 'red'}} className="container">
        {/* {
          this.state.show && <div>show</div>
        }
        {
          list.map(item => (
            <div className="sssss">{item.title}</div>
          ))
        }
        <span>{num}</span> 
        <span data-index={this.state.num}>strong2</span>
        <div dangersInnerHTML="strongInnerhtml"></div> */}
        {/* <div>storng</div> */}
        {
          list.map(item => (
            <div className="sssss">{item.title}</div>
          ))
        }
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))




