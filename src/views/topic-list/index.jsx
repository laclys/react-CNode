import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Tabs, { Tab } from 'material-ui/Tabs'

import { AppState } from '../../store/app-state'
import Container from '../layout/container'
import TopicListItem from './list-item'

@inject('appState') @observer
export default class TopicList extends React.Component {
  constructor() {
    super()
    this.state = {
      tabIndex: 0,
    }
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }

  componentDidMount() {
    // do something here
  }

  bootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true)
      })
    })
  }

  changeTab(e, index) {
    this.setState({
      tabIndex: index,
    })
  }
  /* eslint-disable */
  listItemClick() {

  }
  /* eslint-enable */
  render() {
    const { tabIndex } = this.state
    const topic = {
      title: 'this is title',
      username: 'Lacly',
      reply_count: 20,
      visit_count: 30,
      create_at: 'abs',
      tab: 'share',
    }
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="lalalalallala" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab} >
          <Tab label="All" />
          <Tab label="Share" />
          <Tab label="Jobs" />
          <Tab label="QI" />
          <Tab label="Selected" />
          <Tab label="Test" />
        </Tabs>
        <TopicListItem onClick={this.listItemClick} topic={topic} />
      </Container>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
