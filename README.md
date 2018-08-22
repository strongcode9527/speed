# speed
react-like framework


diff 所遇到的问题


```
 <div onClick={() => {console.log('in')}} style={{background: 'red'}}>
  <span>strong1</span>   
  <span data-index={this.state.num}>strong2</span>
  <span>count {num}</span> 
  {
    this.state.show && <div>show</div>
  }  
</div>


// 最外层div在state为false的时候返回的children分别是['span', 'span', 'span', false]


```











