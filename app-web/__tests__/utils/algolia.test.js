import { getQueries, queries, reduceGithubRawNode } from '../../src/utils/algolia';

/*
Copyright 2019 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Created by Patrick Simonian
*/

describe('Algolia Utils', () => {
  test('getQueries returns queries with indexName suffixed', () => {
    const suffixedQueries = getQueries('baz');
    suffixedQueries.forEach(q => {
      expect(/-baz$/.test(q.indexName)).toBe(true);
    });
  });

  test('getQueries returns queries unchanged when no suffix passed', () => {
    const suffixedQueries = getQueries();
    expect(suffixedQueries).toEqual(queries);
  });

  describe(' Algolia reducers', () => {
    test('flattening githubRaw nodes', () => {
      const data = {
        allGithubRaw: {
          edges: [
            {
              node: {
                id: '123123',
                childMarkdownRemark: {
                  fields: {
                    title: 'foo',
                    description: 'abcabc',
                  },
                },
                internal: {
                  type: 'document',
                },
              },
            },
            {
              node: {
                id: '232323',
                childMarkdownRemark: {
                  fields: {
                    title: 'foo2',
                    description: 'xzcv',
                  },
                },
                internal: {
                  type: 'document',
                },
              },
            },
            {
              node: {
                id: '232323',
                childMarkdownRemark: {
                  fields: {
                    title: 'foo3',
                    description: 'asdfad',
                  },
                },
                internal: {
                  type: 'document',
                },
              },
            },
          ],
        },
      };
      const expected = [
        { id: '123123', fields: { title: 'foo', description: 'abcabc' }, __type: 'document' },
        { id: '232323', fields: { title: 'foo2', description: 'xzcv' }, __type: 'document' },
        { id: '232323', fields: { title: 'foo3', description: 'asdfad' }, __type: 'document' },
      ];
      const test1 = reduceGithubRawNode(data.allGithubRaw.edges);
      expect(test1).toEqual(expected);
    });
  });
});