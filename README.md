<h1>Roller's Frontend Template</h1>
<a target="_blank" href="https://circleci.com/gh/hghazal/app.roller.io/tree/master"><img src="https://circleci.com/gh/hghazal/app.roller.io.svg?style=shield"></a>
***

## Stack:
- Node.js
- React
- Redux
- **Testing:** Karma, Mocha, Chai, Sinon
- **Style:** ESLint, [`airbnb style guide`](https://github.com/airbnb/javascript)
- **Docker** - for production release
- **[Kubernetes](http://kubernetes.io/)** - for running the code in production on [Google's container engine](https://cloud.google.com/container-engine/).

## Release Workflow:
- Create a feature branch and a pull request
- Get the code reviewed
- Merge code into master
- CircleCI runs the CI process which includes
  - Running tests
  - Running the JS linter
  - Building docker image
  - [Publishing docker image](deploy/publish.sh) to Google's container registry
  - [Releasing the code to producing](deploy/rolling-update.sh) in a rolling fashion
  
## Local Dev workflow
- Clone the repo locally
- Install dependencies
```bash
$ npm install
```

- Run the app server
```bash
$ npm run dev
```

- Write tests and run tests before pushing
```bash
$ npm run test
```

- Ensure that you're following the coding guidelines
```bash
$ npm run lint
```

- Regurally check that you're running the latest dependencies
```bash
$ npm run deps
```

## Manually releasing code:
- Publish new image to the registry
```bash
$ ./deploy/publish.sh
```

- Run the rolling update command to release the code, the command takes
an optional argument that lets you add a tag the Kubernetes controller's name. It's required if you're releasing code with the same git SHA1 hash.
```bash
$ ./deploy/rolling-update.sh [label]
```

## Current Issues:
- Releasing code in a rolling update on Kubernetes might break the user experience. Consider
the situation when a user sends a request to load a page and that page requests another resource.
Kubernetes Replication Controller (RC) will use round robin to route the traffic, thus requesting
a resource that is either no longer on the new docker image or hasn't made it to the new docker
instance.

  **Potential Solution**: Use version numbers in the url of the resource and distribute the assets on a CDN.
