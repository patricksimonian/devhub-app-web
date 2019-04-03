import React from 'react';
import queryString from 'query-string';
import intersectionBy from 'lodash/intersectionBy';
import isNull from 'lodash/isNull';
import styled from '@emotion/styled';

import { Alert } from 'reactstrap';

import { MAIN_NAV_ROUTES } from '../constants/routes';
import { flattenGatsbyGraphQL } from '../utils/dataHelpers';
import { SEARCH } from '../messages';

import Layout from '../hoc/Layout';
import { ResourcePreview, Masthead, CollectionsContainer } from '../components/Home';
import withResourceQuery from '../hoc/withResourceQuery';
import Aux from '../hoc/auxillary';

import { useSearch } from '../utils/hooks';
import {
  selectCollectionsWithResourcesGroupedByType,
  selectResourcesGroupedByType,
} from '../utils/selectors';
import { isQueryEmpty } from '../utils/search';

const Main = styled.main`
  margin-bottom: 5px;
  margin-top: 27px;
  padding: 0 15px;
  > div {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }
  > h1 {
    margin-top: 0;
    color: #242424;
    font-size: 42px;
    font-weight: 400;
  }
  > h2 {
    font-size: 14px;
    margin-bottom: 15px;
    color: #5091cd;
    font-weight: 300;
  }
  > p {
    margin-bottom: 20px;
    max-width: 738px;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.3em;
  }
`;

const collectionsSelector = selectCollectionsWithResourcesGroupedByType();
const resourcesSelector = selectResourcesGroupedByType();
/**
 * returns collection container component so aslong as a search is not being done
 * @param {Array} collections list of collections
 * @param {Boolean} searchResultsExist
 */
const getCollectionPreviews = (collections, searchResultsExist) => {
  return (
    !searchResultsExist && (
      <CollectionsContainer
        collections={collectionsSelector(collections)}
        link={MAIN_NAV_ROUTES.COLLECTIONS}
      />
    )
  );
};

/**
 * returns a resource preview components
 * @param {Array} resources the list of siphon resources
 * @param {Array} results the list of searched resources
 */
const getResourcePreviews = (resources, results = []) => {
  let resourcesToGroup = resources;
  if (!isNull(results) && results.length > 0) {
    // diff out resources by id
    resourcesToGroup = intersectionBy(resources, results, 'id');
  }

  // select resources grouped by type using relesect memoization https://github.com/reduxjs/reselect/issues/30
  const resourcesByType = resourcesSelector(resourcesToGroup);
  const siphonResources = Object.keys(resourcesByType).map(resourceType => {
    if (resourcesByType[resourceType].length > 0) {
      return (
        <ResourcePreview
          key={resourceType}
          title={resourceType}
          resources={resourcesByType[resourceType]}
          link={MAIN_NAV_ROUTES[resourceType]}
        />
      );
    }
    return null;
  });

  return siphonResources;
};

export const TEST_IDS = {
  alert: 'home-test-alert',
};

export const Index = ({
  data: {
    allDevhubCollection,
    allDevhubSiphon,
    siteSearchIndex: { index },
  },
  location,
}) => {
  const queryParam = queryString.parse(location.search);
  let query = [];
  let results = [];
  let windowHasQuery = Object.prototype.hasOwnProperty.call(queryParam, 'q');
  if (windowHasQuery) {
    query = decodeURIComponent(queryParam.q);
    results = useSearch(query, index);
  }

  let content = null;
  const siphonResources = getResourcePreviews(flattenGatsbyGraphQL(allDevhubSiphon.edges), results);

  const resourcesNotFound =
    !isQueryEmpty(query) && (!results || (results.length === 0 && windowHasQuery));
  if (resourcesNotFound) {
    content = (
      <Alert style={{ margin: '10px auto' }} color="info" data-testid={TEST_IDS.alert}>
        {SEARCH.results.empty.defaultMessage}
      </Alert>
    );
  } else {
    content = (
      <Aux>
        {getCollectionPreviews(flattenGatsbyGraphQL(allDevhubCollection.edges), windowHasQuery)}
        {siphonResources}
      </Aux>
    );
  }

  return (
    <Layout showHamburger>
      <Masthead query={query} />
      <Main>{content}</Main>
    </Layout>
  );
};

export default withResourceQuery(Index)();
