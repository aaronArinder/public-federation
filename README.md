## Basic problem
GraphQL graphs should be singular in nature. There should ever only be one graph, unversioned, to make evolvability easier. That presents a problem for public apis, if you don't want all of the graph to be available for public apis.

There are two solutions for that:

1) Expose the entire graph and use an authorization directive or downstream services' authorization handling to restrict usage to all and only those parts of the graph that should be available.
2) Expose a subset of the graph, without creating two or more graphs.

This repo is a playground for (2). The first option, expose the entire graph and lean on authorization, is a viable choice, but I want a further constraint that makes it unappealing: a _clean_ public playground. (1) would be a great choice were that not a desire.

## Branches with PoC solutions
### Overview
These branches represent PoC solutions of the type expressed by (2). For them to be successful, they need to do two things:

1) Remove the dummy secrets/private node, called `secrets`.
2) Remove private mutations, `createShipment` and `deleteShipment`.

### Context
Apollo's gateway can pull registered schemas for federated services and then combine those schemas together to make one graph. We're going to register a public api schema that's only has those fields/nodes we want.

To remove nodes, we'll  deploy only the set of federated services necessary for the public api. This is represented in the service list (but could be done in other ways, like a helm chart). There is a dummy `secrets` node that stubs in behavior for private/secret data that shouldn't be exposed in a public api.

To block out fields we don't want, see the branches below and their short descriptions.

#### Branch: poc/modifying-ast-for-sdl
This branch filters out private document nodes from the generated AST, which means that the SDL won't have them when we push them to the registry. The big idea is to have a list of fields that shouldn't be exposed in the public api. We then use that list to modify the generated AST, removing any private-only document nodes.

When running `yarn watch-external`, the shipments node no longer shows `createShipment` or `deleteShipment`, and the secrets node isn't started at all, so it's not included in the completed graph. When running `yarn watch-internal`, both the secrets node and the two mutations are usable.


## Commands and queries
### Start the federated services
To serve the full graph:
```
yarn watch-internal
```

To serve only those services and fields that should be availble in the public api:
```
yarn watch-external
```

### Confirm SDL for a federated service
When we register a schema, apollo's cli tool runs the following query to figure out what, exactly, is in each federated service's schema. So, if this query returns only those fields we want in a federated service, so will the registered schema.

```
query getFederationInfo {
    _service {
        sdl
    }
}
```

