class Guide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linkTitle: this.props.title
    }
  }
  render () {
    return <a href="#">{this.state.linkTitle}</a>;
  }
}
