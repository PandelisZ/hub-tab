import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import moment from 'moment';

const GET_REPOS = gql`
    query {
        viewer {
            repositories(orderBy: { field: UPDATED_AT, direction: DESC }, first: 10) {
                nodes {
                    id
                    name
                    url
                    description
                    updatedAt
                    owner {
                        login
                        url
                    }
                }
            }
            organizations(first: 10) {
                edges {
                    node {
                        repositories(orderBy: { field: UPDATED_AT, direction: DESC }, first: 10) {
                            nodes {
                                id
                                name
                                url
                                description
                                updatedAt
                                owner {
                                    login
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const Repos = () => {
    const { loading, error, data } = useQuery(GET_REPOS, {
        fetchPolicy: 'cache-and-network',
    });

    if (loading && !data)
        return (
            <h2>
                <span>Loading</span>
                <span className="AnimatedEllipsis" />
            </h2>
        );
    if (error)
        return (
            <div>
                <p>Error :(</p>
                <code>{JSON.stringify(error)}</code>
            </div>
        );

    const orgRepos = data.viewer.organizations.edges.reduce((acc, e) => {
        return acc.concat(e.node.repositories.nodes);
    }, []);

    let repositories = data.viewer.repositories.nodes.concat(orgRepos).filter((node, index, self) => {
        return (
            index ===
            self.findIndex(n => {
                return n.id === node.id;
            })
        );
    });
    repositories.sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);

        return dateB.getTime() - dateA.getTime();
    });
    repositories = repositories.slice(0, 12);

    return (
        <div className="container-lg">
            <h2 className="f4 p-4 text-normal">Recent</h2>
            <div className="grid">
                {repositories.map(({ id, name, url, description, updatedAt }) => {
                    return (
                        <div className="float-left p-4" key={id}>
                            <div className="Box box-shadow p-3 width-full">
                                <div className=" width-full flex-items-center position-relative">
                                    <svg
                                        className="octicon octicon-repo mr-2 text-gray flex-shrink-0"
                                        viewBox="0 0 12 16"
                                        version="1.1"
                                        width="12"
                                        height="16"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"
                                        />
                                    </svg>
                                    <a href={url} className="text-bold flex-auto min-width-0 ">
                                        <span className="repo" title={name}>
                                            {name}
                                        </span>
                                    </a>
                                </div>
                                <p className="text-gray text-small d-block mt-2 mb-3">{description}</p>
                                <div className="text-gray f6 mt-2">
                                    <span>{moment(updatedAt).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Repos;
