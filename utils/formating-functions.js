const createUserTopicRef = function(topics, users, keyTopics, keyUsers) {
  if (topics.length === 0 || users.length === 0) return {};
  const topicUser = []
    
    keyUsers: users[0][keyUsers],
    keyTopics: topics[0][keyTopics]
  
  return topicUser;
};

module.exports = { createUserTopicRef };
