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
    setTimeout(() => {
      console.log('----------afterChange');
      this.setState({
        list: []
      })
    }, 5000);
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
        {
          list.map((item, index) => (
            <div className={index}>{item.title}</div>
          ))
        }
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))




