import Speed, {Component, render} from '../src'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      num: 0,
      show: false,
      list: [{title: 'strong'}, {title: 'strong123'}],
      name: 'strong',
    }

  }

  componentDidMount() {
    setTimeout(() => {
      console.log('----------afterChange');
      this.setState({
        list: [],
        name: 'strong1'
      })
    }, 2000);

    setTimeout(() => {
      console.log('in 222222222222change');
      this.setState({
        list: [{title: 'afterchange'}, {title: 'storng after change'}],
        name: 'strong2'
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
    const {num, list, name} = this.state
    console.log('props', this.props);
    return (
      <div className="container">
        <Temp name={name}/>
        {
          false && <div>false</div>
        }
        <div>111</div>
        {
          list.map((item, index) => (
            <div className={index}>{item.title}</div>
          ))
        }
        {
          false && <div>false2</div>
        }
        <div>222</div>
      </div>
    )
  }
}


class Temp extends Component {
  render() {
    console.log(this.props);
    return (
      <div>temp</div>
    )
  }
}

render(<App id={'aaa'}></App>, document.getElementById('root'))




