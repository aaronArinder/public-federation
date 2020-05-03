### Basic problem
GraphQL graphs should be singular in nature. There should ever only be one graph, unversioned, to make evolvability easier. That presents a problem for public apis, if you don't want all of the graph to be available for public apis.

There are two solutions for that:

1) Expose the entire graph and use an authorization directive or downstream services' authorization handling to restrict usage to all and only those parts of the graph that should be available.
2) Expose a subset of the graph, without creating two or more graphs.

This repo is a playground for (2). The first option, expose the entire graph and lean on authorization, is a viable choice, but I want a further constraint that makes it unappealing: a _clean_ public playground. (1) would be a great choice were that not a desire.

### Start the federated services
To serve the full graph:
```
yarn watch-internal
```

To serve only those services and fields that should be availble in the public api:
```
yarn watch-external
```

### Branches
#### Directly resolve SDL
This adds a query to the shipments service that removes its mutations. It's meant as a poc for intercepting and changing the query that apollo runs when pushing a federated service's schema to its registry. This means that the gateway wouldn't know about those fields we don't want included. This is an incredibly clubfooted way to do it, but it should work.

`poc/directly-resolving-sdl`


