const PLACEHOLDER_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const COMMENT_TEXT = 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const feeds = {
  0: { id: '0', label: 'World', name: 'World', feed: 'world' },
  1: { id: '1', label: 'Ryerson', name: 'Ryerson University' },
  3: { id: '3', label: 'U of A', name: 'University of Alberta' },
  2: { id: '2', label: 'U of T', name: 'University of Toronto' },
};

const users = {
  abc: {
    _id: 'abc',
    id: 'abc',
    email: 'taimur@ryerson.ca',
    picture: 'https://i.imgur.com/ZGAhg8l.jpg',
    snapchat: 'tymure',
    instagram: 'tymure',
    university: feeds['1'],
    reputation: 14203,
    name: 'Taimur Malik',
    posts: [4, 1],
    comments: [1, 3],
    votedPosts: [2, 4],
    votedComments: [1, 4],
  },
  def: {
    _id: 'def',
    id: 'def',
    email: 'jutt@ryerson.ca',
    picture: 'https://i.imgur.com/a64qzVR.jpg',
    university: feeds['1'],
    reputation: 1760,
    name: 'Hammad Jutt',
    snapchat: 'hammadj',
    instagram: 'photosbyhammad',
    posts: [2, 3],
    comments: [2, 4],
    votedPosts: [1, 2, 3],
    votedComments: [1, 3, 4],
  }
};

const friends = [users.abc, users.def];

const comments = {
  4: { _id: '4', postId: 2, user: users['def'], image: 'https://facebook.github.io/react/img/logo_og.png', date: 1471649364407, text: COMMENT_TEXT, votes: 1 },
  3: { _id: '3', postId: 2, user: users['abc'], date: 1471649318990, text: COMMENT_TEXT, votes: 3 },
  2: { _id: '2', postId: 4, user: users['def'], date: 1471493557917, text: COMMENT_TEXT, votes: 4 },
  1: { _id: '1', postId: 3, user: users['abc'], date: 1471648985021, text: COMMENT_TEXT, votes: 2 }
};

const posts = {
  4: { id: '4', userId: 'abc', feed: feeds['1'], date: 1471648985021, text: PLACEHOLDER_TEXT, comments: [comments['2']], votes: 2 },
  3: { id: '3', userId: 'def', feed: feeds['1'], date: 1471493557917, text: PLACEHOLDER_TEXT, comments: [comments['1']], votes: 1 },
  2: { id: '2', userId: 'def', feed: feeds['1'], date: 1471492380425, text: PLACEHOLDER_TEXT, comments: [comments['4'], comments['3']], votes: 0 },
  1: { id: '1', userId: 'abc', feed: feeds['1'], date: 1471490825300, text: PLACEHOLDER_TEXT, comments: [], votes: 3 }
};

const chats = [
  { id: '1', user: users.def, lastMessage: 'Last message in chat' }
];

const matches = [
  { id: '1', user: users.def },
  { id: '2', user: users.abc }
];

const messages = [
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'Nice',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: users.abc.id,
      avatar: users.abc.picture,
      name: users.abc.name
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'Check out this picture',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: users.def.id,
      avatar: users.def.picture,
      name: users.def.name
    },
    image: 'https://i.imgur.com/eYfGJkf.jpg',
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'Im doing great',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: users.def.id,
      avatar: users.def.picture,
      name: users.def.name
    }
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'Hey, how are you',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: users.abc.id,
      avatar: users.abc.picture,
      name: users.abc.name
    },
  },
];

export default {
  currentUser: users['abc'],
  postIds: ['4', '3', '2', '1'],
  feedIds: ['2', '3'],
  friends,
  matches,
  messages,
  chats,
  posts,
  comments,
  worldFeed: feeds[0],
  feeds,
  users,
};