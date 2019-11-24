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
    setTimeout(() => {
      console.log('----------afterChange');
      this.setState({
        list: []
      })
    }, 2000);

    setTimeout(() => {
      console.log('in 222222222222change');
      this.setState({
        list: [{title: 'afterchange'}, {title: 'storng after change'}]
      })
    },4000)
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
        <div>111</div>
        {
          list.map((item, index) => (
            <div className={index}>{item.title}</div>
          ))
        }
        <div>222</div>
      </div>
    )
  }
}

render(<App></App>, document.getElementById('root'))




