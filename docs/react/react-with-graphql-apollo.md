---
id: react-with-graphql-apollo
title: React with GraphQL Apollo
sidebar_label: React with GraphQL Apollo
---

## Setup and getting started

To get started with Apollo Client, we run `npm install --save graphql apollo-boost react-apollo` to add the following npm packages, **GraphQL**, **apollo-boost**, and **react-apollo**.

> npm install --save graphql apollo-boost react-apollo

---

### Simple example breakdown

```js
// Import needed libs...
import React, { Component } from "react";
import ApolloClient from "apollo-boost";

// Instantiate a new ApolloClient
const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

// And here we have our simple component which we will connect later on...
export class App extends Component {
  render() {
    return <div>Hello World!</div>;
  }
}
```

For querying the data we will use `GraphQL tag`. Lets have a look at a simple query we will use later on:

```js
// We add this line to the imports to get GraphQL tag
import gql from "graphql-tag";

// Now lets create our query. Fetch the data and output it in a console log...
client
  .query({
    query: gql`
      {
        recipies {
          id
          title
        }
      }
    `
  })
  .then(results => console.log(results));
```

Let's introduce `ApolloProvider` as well... this will allow us to pass the Apollo client down the rendering tree via a React context feature:

```js
// Lets import ApolloProvider
import { ApolloProvider } from "react-apollo";

// Now lets wrap our application with it to expose it down the tree...
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>Hello World!</div>
      </ApolloProvider>
    );
  }
}
```

To finalize this first simple use case, let's introduce `ApolloConsumer` as well. Using an ApolloConsumer, we can leverage this setup to use the client for our queries deeper down in our React rendering tree. Here is the complete component:

```js
// Let's add ApolloConsumer to the imports as well
import { ApolloProvider, ApolloConsumer } from "react-apollo";

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>Hello World!</div>
        <ApolloConsumer>
          {client => {
            client
              .query({
                query: gql`
                  {
                    recipes {
                      id
                      title
                    }
                  }
                `
              })
              .then(result => console.log(result));
            \;
            return null;
          }}
        </ApolloConsumer>
      </ApolloProvider>
    );
  }
}
```

---

## Fetch data using the Apollo Query Component

In order to display data we first need to fetch it. The Query component allows us to describe which data we are interested and automatically handle the fetching of our data. Once we received the data we can render it using React. Since the Query component handles the data fetching we need to make sure we properly deal with the cases of a loading state as well as when the receive Errors from the GraphQL API.

```js
// Import the Query component
import { Query } from "react-apollo";

// Use the Query
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`
            {
              recipes {
                id
                title
              }
            }
          `}
        >
          {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Something went wrong</p>;

            return (
              <ul>
                {data.recipes.map(({ id, title }) => (
                  <li key={id}>{title}</li>
                ))}
              </ul>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}
```

> As we can see the Query component exposes a callback with `data`, `loading` and `error` properties. We can display proper data and state of the app based on these props.

---

## Provide dynamic arguments in a Apollo Query with GraphQL variables

GraphQL supports parameters for queries via variables. They allow us to supply dynamic arguments. Often we want these variables to be dependent on decisions made by a User.

```js
// Our GraphQL query accepts a Boolean parameter which is required
const recipesQuery = gql`{
  query recipes($vegetarian: Boolean!) {
    id
    title
  }
}`;

// We can pass this parameter in our Query component
class Recipes extends Component {
  render() {
    return (
      <Query query={recipesQuery} variables={{ vegetarian: true }}>
        ...
      </Query>
    );
  }
}
```

> As always we can take the power of React and update these variables dynamically through local or global component state... (via `setState...` or `props`)

---

## Update data using the Apollo Mutation component

Let's have a look how to deal with data mutations using the Mutation component from Apollo. This is usefull when submitting forms, or adding items to a dynamic list for example...

```js
// Let's create our Query to get the recipies and our mutation in a separate file... for this demo let's call this file myQueries
import gql from "graphql-tag";

const addRecipeMutation = gql`
  mutation addRecipe($recipe: RecipeInput!) {
    addRecipe(recipe: $recipe) {
      id
      title
    }
  }
`;

const queryRecipies = gql`
  query recipes($vegetarian: Boolean!) {
    recipes(vegetarian: $vegetarian) {
      id
      title
    }
  }
`;

export { addRecipeMutation, queryRecipies };
```

Now let's see how to consume this query and mutation:

```js
// First we need to import the Mutation component and both actions
import { Mutation } from "react-apollo";
import { addRecipeMutation, queryRecipies } from "myQueries";

class AddRecipe extends Component {
  // Our internal state
  state = {
    title: "",
    vegetarian: false
  };

  // State update methods
  updateVegetarian = ({ target: { checked } }) => {
    this.setState({ vegetarian: checked });
  };
  updateTitle = ({ target: { value } }) => {
    this.setState({ title: value });
  };
  resetFields = () => {
    this.setState({ title: "", vegetarian: false });
  };

  render() {
    return (
      <Mutation
        mutation={addRecipeMutation}
        //
        refetchQueries={[
          {
            query: queryRecipies,
            variables: { vegeterian: true }
          },
          {
            query: queryRecipies,
            variables: { vegeterian: false }
          }
        ]}
        // Keep the loading indicator until refetch is done
        awaitRefetchQueries={true}
      >
        {/* Using the render-prop where `addRecipe` is the mutation method */}
        {(addRecipe, { loading, error }) => (
          <form
            onSubmit={evt => {
              evt.preventDefault();
              addRecipe({
                variables: {
                  recipe: {
                    title: this.state.title,
                    vegetarian: this.state.vegetarian
                  }
                }
              });
              this.resetFields();
            }}
          >
            <label>
              <span>Title</span>
              <input
                type="text"
                value={this.state.title}
                onChange={this.updateTitle}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={this.state.vegetarian}
                onChange={this.updateVegetarian}
              />
              <span>vegetarian</span>
            </label>
            <div>
              <button>Add Recipe</button>
            </div>

            {/* Show different states... */}
            {loading && <p>Adding a recipe - please wait...</p>}
            {error && <p>Error :( Please try again</p>}
          </form>
        )}
      </Mutation>
    );
  }
}
```
