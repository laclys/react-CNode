import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Tabs, { Tab } from 'material-ui/Tabs'
import List from 'material-ui/List'
import { CircularProgress } from 'material-ui/Progress'
import Container from '../layout/container'
import TopicListItem from './list-item'

@inject((stores) => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
}) @observer
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
    this.props.topicStore.fetchTopic()
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

    const { topicStore } = this.props

    const topicList = topicStore.topics
    const syncingTopics = topicStore.syncing
    // const topic = {
    //   title: 'this is title',
    //   username: 'Lacly',
    //   reply_count: 20,
    //   visit_count: 30,
    //   create_at: 'abs',
    //   tab: 'share',
    // }

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
        <List>
          {
            topicList.map(topic => (
              <TopicListItem
                key={topic.id}
                onClick={this.listItemClick}
                topic={topic}
              />
            ))
          }
        </List>
        {
          syncingTopics ?
          (
            <div>
              <CircularProgress color="primary" size={100} />
            </div>
          ) :
          null
        }
      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  topicStore: PropTypes.object.isRequired,
}

