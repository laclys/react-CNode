import React from 'react'
import PropTypes from 'prop-types'
import ListItem from 'material-ui/List/ListItem'
import ListItemAvatar from 'material-ui/List/ListItemAvatar'
import ListItemText from 'material-ui/List/ListItemText'
import Avatar from 'material-ui/Avatar'
import { withStyles } from 'material-ui/styles'

import { topicPrimaryStyle, topicSecondaryStyles } from './styles'
import { tabs } from '../../util/variable-define'

const Primary = ({ classes, topic }) => {
  return (
    <div className={classes.root} >
      <span className={classes.tab} >{topic.top ? 'Top' : tabs[topic.tab]}</span>
      <span className={classes.title} >{topic.title}</span>
    </div>
  )
}

const Secondary = ({ classes, topic }) => (
  <span className={classes.root} >
    <span className={classes.userName} >{topic.author.loginname}</span>
    <span className={classes.count} >
      <span className={classes.accentColo} >{topic.reply_count}</span>
      <span>/</span>
      <span>{topic.visit_count}</span>
    </span>
    <span>Create Time：{topic.create_at}</span>
  </span>
)

Primary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

Secondary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const StylesPrimary = withStyles(topicPrimaryStyle)(Primary)
const StylesSecondary = withStyles(topicSecondaryStyles)(Secondary)

const TopicListItem = ({ onClick, topic }) => (
  <ListItem button onClick={onClick} >
    <ListItemAvatar>
      <Avatar src={topic.author.avatar_url} />
    </ListItemAvatar>
    <ListItemText
      primary={<StylesPrimary topic={topic} />}
      secondary={<StylesSecondary topic={topic} />}
    />
  </ListItem>
)

TopicListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired,
}

export default TopicListItem
