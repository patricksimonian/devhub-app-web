// key of the query param in the url when searching ie ?q=
export const SEARCH_QUERY_PARAM = 'q';

export const SEARCH_FIELD_NAMES = [
  'title',
  'titles',
  'content',
  'contents',
  'description',
  'descriptions',
  'topicName',
  'topicname',
  'topicNames',
  'topicnames',
  'topic Name',
  'topic name',
  'topic Names',
  'topic names',
  'labels',
  'label',
  'author',
  'authors',
  'persona',
  'personas',
];

export const SEARCH_FIELD_MAPPING = {
  persona: { text: 'personas' },
  personas: { text: 'personas' },
  author: { text: 'author' },
  authors: { text: 'author' },
  label: { text: 'labels' },
  labels: { text: 'labels' },
  title: { text: 'title' },
  titles: { text: 'title' },
  content: { text: 'content' },
  contents: { text: 'content' },
  description: { text: 'description' },
  descriptions: { text: 'description' },
  topicName: { text: 'topicName' },
  topicname: { text: 'topicName' },
  topicNames: { text: 'topicName' },
  topicnames: { text: 'topicName' },
  'topic Name': { text: 'topicName' },
  'topic name': { text: 'topicName' },
  'topic Names': { text: 'topicName' },
  'topic names': { text: 'topicName' },
};

// federated search configurations
export const SEARCH_SOURCES = {
  rocketchat: 'rocketchat',
  documize: 'documize',
  github: 'github',
};

// this is a simple implementation of the search source 'toggle' feature
// this object acts like a reducer
export const SEARCH_SOURCE_INITIAL_STATE = {
  [SEARCH_SOURCES.rocketchat]: true,
  [SEARCH_SOURCES.documize]: true,
  [SEARCH_SOURCES.github]: true,
};

export const SEARCH_SOURCE_CONFIG = {
  [SEARCH_SOURCES.rocketchat]: {
    maxResults: 10,
  },
  [SEARCH_SOURCES.documize]: {
    maxResults: 10,
  },
  [SEARCH_SOURCES.github]: {
    // Github will be rendered as cards, since cards align in grids of 4
    // columns this will make a neat set of of 3 rows
    maxResults: 12,
  },
  default: {
    maxResults: 10,
  },
};
