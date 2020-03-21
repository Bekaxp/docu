---
id: graphql-basics
title: GraphQL Basics
sidebar_label: GraphQL Basics
---

## Setup

> Install it via npm using yarn or npm: `yarn add graphql`

### Simple GraphQL schema example

```js
const {graphql, buildSchema} = require('graphql');

/* Describes what's possible and what's not possible */
const schema = buildSchema(`
  type Query {
    foo: String
  }
  type Schema {
    query: Query
  }
`);

const resolvers = {
  foo: () => 'bar';
};

const query = `{foo}`;

/**
 * This is how we fire a request and get the data from GraphQL
 * graphql(
 *   schema: GraphQLSchema,
 *   requestString: string,
 *   rootValue?: ?any, passed as root value to the executor
 *   contextValue?: ?any,
 *   variableValues?: ?{[key: string]: any},
 *   operationName?: ?string
 * ): Promise<GraphQLResult>
 */
 graphql(schema, query, resolvers)
  .then((result) => console.log(`We got: ${result}`))
  .catch((error) => console.log('There was an error'));

```

We can define different Query types like `String, Int, ID, Boolean...`, depends on what we need. We can mark a type to be NON-NULLABLE by putting an `!` at the end.

#### Using List Type for collections

```js
/* Extend our schema with a new type Video */
const Schema = buildSchema(`
type Video {
  id: ID,
  title: String,
  duration: Int,
  watched: Boolean
}

type Query {
  video: Video
  videos: [Video]
}
`);

/* Some dummy data for 2 videos */
const videoA = {
  id: "abc",
  title: "Create a GraphQL Schema",
  duration: 120,
  watched: true
};
const videoB = {
  id: "def",
  title: "Ember.js CLI",
  duration: 240,
  watched: false
};

const videos = [videoA, videoB];

/* And we update our resolvers to resolve correct data */
const resolvers = {
  video: () => videoA,
  videos: () => videos
};

/* Now when we call graphQL with our new schema and resolvers we will get back a collection of videos */
graphql(schema, query, resolvers)
  .then(result => console.log(`We got: ${result}`))
  .catch(error => console.log("There was an error"));
```

## Using ExpressJS with GraphQL

> Install express and express-graphql `yarn add express express-graphql`

---

### Use ExpressJS middleware graphqlHTTP

```js
"use strict";

const express = require("express");
const graphqlHTTP = require("express-graphql");
const { graphql, buildSchema } = require("graphql");

const PORT = process.env.PORT || 3000;
const server = express();

const schema = buildSchema(`
type Video {
  id: ID,
  title: String,
  duration: Int,
  watched: Boolean
}
type Query {
  video: Video
  videos: [Video]
}
type Schema {
  query: Query
}
`);

const videoA = {
  id: "a",
  title: "Create a GraphQL Schema",
  duration: 120,
  watched: true
};
const videoB = {
  id: "b",
  title: "Ember.js CLI",
  duration: 240,
  watched: false
};
const videos = [videoA, videoB];

const resolvers = {
  video: () => ({
    id: "1",
    title: "Foo",
    duration: 180,
    watched: true
  }),
  videos: () => videos
};

server.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: resolvers
  })
);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
```

Now with this middleware we also get a tool called GraphiQL. If we start our server and then go to http://localhost:3000/graphql we will access the GraphiQL tool. Here we can make queries to GraphQL server and we can see the results.

---

### Using JS to define our schema

GraphQL comes with some helpers. For example:

- GraphQLSchema
- GraphQLSchema
- GraphQLSchema
- GraphQLObjectType
- GraphQLID
- GraphQLString
- GraphQLInt
- GraphQLBoolean

Here is an example using the above helpers:

```js
"use strict";

const express = require("express");
const graphqlHTTP = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require("graphql");

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: "Video",
  description: "A video on Egghead.io",
  fields: {
    id: {
      type: GraphQLID,
      description: "The id of the video."
    },
    title: {
      type: GraphQLString,
      description: "The title of the video."
    },
    duration: {
      type: GraphQLInt,
      description: "The duration of the video (in seconds)."
    },
    watched: {
      type: GraphQLBoolean,
      description: "Whether or not the viewer has watched the video."
    }
  }
});

const queryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type.",
  fields: {
    video: {
      type: videoType,
      resolve: () =>
        new Promise(resolve => {
          resolve({
            id: "a",
            title: "GraphQL",
            duration: 180,
            watched: false
          });
        })
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType
});

const videoA = {
  id: "a",
  title: "Create a GraphQL Schema",
  duration: 120,
  watched: true
};
const videoB = {
  id: "b",
  title: "Ember.js CLI",
  duration: 240,
  watched: false
};
const videos = [videoA, videoB];

server.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
```

---

### Passing arguments in GraphQL query

Let's take a look at the previous example and let's add an argument ID to the query:

```js
const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type',
  fields: {
    video: {
      type: videoType,
      args: {
        id: {
          type: GraphQLID,
          description: 'The id of the video',
        }
      }
      resolve: (_, args) => {
        return getVideoById(args.id);
      }
    }
  }
});
```

The 'getVideoById' call will just return a Promise filtering all the videos and returning the one with the same ID passed as an argument.

---

### Using GraphQLNonNull for required fields

Still looking at the example from before... we need to import this new method and use it where we define the type for the argument:

```js
import GraphQLNonNull from 'graphql';

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type',
  fields: {
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the video',
        }
      }
      resolve: (_, args) => {
        return getVideoById(args.id);
      }
    }
  }
});
```

Now when we run the query, if the argument is not passed we will get an error and not a null value anymore.

---

### Creating our first mutation

In the example below we will create a new mutation for adding additional videos...

```js
// First we need our video type
const videoType = new GraphQLObjectType({
  name: "Video",
  description: "A video on Egghead.io",
  fields: {
    id: {
      type: GraphQLID,
      description: "The id of the video."
    },
    title: {
      type: GraphQLString,
      description: "The title of the video."
    },
    duration: {
      type: GraphQLInt,
      description: "The duration of the video (in seconds)."
    },
    released: {
      type: GraphQLBoolean,
      description: "Whether or not the video has been released."
    }
  }
});

// Then we define the mutation type
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "The root Mutation type.",
  fields: {
    createVideo: {
      type: videoType,
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
          description: "The title of the video."
        },
        duration: {
          type: new GraphQLNonNull(GraphQLInt),
          description: "The duration of the video (in seconds)."
        },
        released: {
          type: new GraphQLNonNull(GraphQLBoolean),
          description: "Whether or not the video is released."
        }
      },
      resolve: (_, args) => {
        return createVideo(args);
      }
    }
  }
});

// At the end we add the mutation to our schema
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
```

---

### Working with more complex mutations

When we have certain mutations that require more complex input parameters, we can leverage the Input Object Type in GraphQL using `GraphQLInputObjectType`.

```js
// First we need to import the GraphQLInputObjectType
import { GraphQLInputObjectType } from "graphql";

// Then we define our new videoInputType object
const videoInputType = new GraphQLInputObjectType({
  name: "VideoInput",
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The title of the video."
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "The duration of the video (in seconds)."
    },
    released: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Whether or not the video is released."
    }
  }
});

// At the end like before we are consuming it in the mutation type which will be then added to the schema
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "The root Mutation type.",
  fields: {
    createVideo: {
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType)
        }
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      }
    }
  }
});
```

---

### Using GraphQL interface

As we start building out more complex GraphQL schemas, certain fields start to repeat across different types. This is a perfect use-case for the Interface Type made available to us through GraphQL’s Type System.

```js
// The interface file...
"use strict";

const { GraphQLInterfaceType, GraphQLNonNull, GraphQLID } = require("graphql");
const { videoType } = require("../");

const nodeInterface = new GraphQLInterfaceType({
  name: "Node",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolveType: object => {
    if (object.title) {
      return videoType;
    }

    return null;
  }
});

module.exports = nodeInterface;
```

```js
// Let's consume our interface here...
// First, of course, we need to import it...
const nodeInterface = require("./src/node");

// Now we can use it in our VideoType definition
const videoType = new GraphQLObjectType({
  name: "Video",
  description: "A video on Egghead.io",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The id of the video."
    },
    title: {
      type: GraphQLString,
      description: "The title of the video."
    },
    duration: {
      type: GraphQLInt,
      description: "The duration of the video (in seconds)."
    },
    released: {
      type: GraphQLBoolean,
      description: "Whether or not the video has been released."
    }
  },
  interfaces: [nodeInterface]
});
exports.videoType = videoType;
```

---

### Using Relay with GraphQL

> We can get Relay by installing it from `npm install graphql-relay` or `yarn add graphql-relay`

The GraphQL Relay Specification requires that a GraphQL Schema has some kind of mechanism for re-fetching an object. For typical Relay-compliant servers, this is going to be the Node Interface.

```js
// Our node interface example
const { nodeDefinitions, fromGlobalId } = require("graphql-relay");
const { getObjectById } = require("./data");

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);

    return getObjectById(type.toLowerCase(), id);
  },
  object => {
    const { videoType } = require("../");

    if (object.title) {
      return videoType;
    }

    return null;
  }
);

exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;
```

`getObjectById` is defined in the required data:

```js
const getObjectById = (type, id) => {
  const types = {
    video: getVideoById
  };

  return types[type](id);
};
```

We glue everything together:

```js
// First the import...
const { globalIdField } = require("graphql-relay");
const { nodeInterface, nodeField } = require("./src/node");

// We define the GraphQL object type: videoType
const videoType = new GraphQLObjectType({
  name: "Video",
  description: "A video on Egghead.io",
  fields: {
    id: globalIdField(), // *check this line*
    title: {
      type: GraphQLString,
      description: "The title of the video."
    },
    duration: {
      type: GraphQLInt,
      description: "The duration of the video (in seconds)."
    },
    released: {
      type: GraphQLBoolean,
      description: "Whether or not the video has been released."
    }
  },
  interfaces: [nodeInterface]
});
exports.videoType = videoType;
```

---

### Using Relay Connection Type instead of GraphQL List Type

In order to properly traverse through collections, Relay-compliant servers require a mechanism to page through collections available in a GraphQL Schema.

```js
// First we need to import what we need from Relay
const {
  globalIdField,
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionArgs,
} = require('graphql-relay');

// Now lets define the videoConnection
const { connectionType: videoConnection } = connectionDefinitions({
  nodeType: videoType,
});

// Next we need to update the videos field, which now will have the type `videoConnection`
const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    node: nodeField,
    videos: {
      type: VideoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(
        getVideos(),
        args,
      ),
    },
  ...
});
```

To query the above we can simply execute the following query:

```js
{
  videos: {
    edges: {
      node {
        id, title, duration
      }
    }
  }
}
```

#### Add `totalCount` field

Lets add another field called `totalCount`, which should describe the count of all of the videos.

```js
// Add it to the connectionDefinitions
const { connectionType: VideoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: "A count of the total number of objects in this connection.",
      resolve: conn => {
        return conn.edges.length;
      }
    }
  })
});
```

Now we can query this in the following way:

```js
{
  video(last: 1) { // we can use here also `first, after or before...`
    edge {
      node {
        title
      }
    }
  }
}
```

---

### GraphQL mutations with Relay

In order to support mutations in Relay, there is a requirement that the GraphQL Server exposes mutation fields in a standardized way. This standard includes a way for mutations to accept and emit an identifier string, allowing Relay to track mutations and responses.

```js
// First we need to import `mutationWithClientMutationId`
const { mutationWithClientMutationId } = require("graphql-relay");

// Let's create `videoMutation`
const videoMutation = mutationWithClientMutationId({
  name: "AddVideo",
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The title of the video."
    },
    duration: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The duration of the video (in seconds)."
    },
    released: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Whether or not the video is released."
    }
  },
  outputFields: {
    video: {
      type: videoType
    }
  },
  mutateAndGetPayload: args =>
    new Promise((resolve, reject) => {
      Promise.resolve(createVideo(args))
        .then(video => resolve({ video }))
        .catch(reject);
    })
});
```

Let's stop here and have a look above...

- The `inputFields` object is basicaly the same as the `videoInput` type defined before
- The `outputFields` will correspond to what we can actually query on after mutation. In this case we will just write out the `video` field which will have a `videoType`.
- The last part is the method `mutateAndGetPayload`. Here the arguments are all the `inputFields` specified above. The value that we end up returning or resolving from this method is what we're going to be able to pick out information from for these outputFields.

```js
const mutationType = new GraphQLObjectType({
  name: 'Mutation'.
  description: 'The root Mutation type',
  fields: {
    createVideo: videoMutation,
  },
});
```

Our last step here is to update our mutationType. Instead of having this config object for the createVideo field now we'll just have videoMutation.
