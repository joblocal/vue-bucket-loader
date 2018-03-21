# Vue Bucket Loader
This Project provides a SSR compatible vue component which can handle file upload / deleting directly to / from a AWS S3 Bucket.

## Requirements
- Yarn or npm
- Vue 2.X.X

## Installation

Using yarn:
```sh
$ yarn add vue-bucket-loader
```

Using npm:

```sh
$ npm install vue-bucket-loader
```

### Usage
After installing this package you can use it as followed.

```javascript
<template>
  <VueBucketLoader :signungUrl="http://localhost/your/endpoint/goes/here" >
    <template
      slot="btn-item"
      slot-scope="props"
    >
      <span>your content goes here {{ props.item.someParameter }}</span>
   </template>
  </VueBucketLoader>
</template>

<script>
  import VueBucketLoader from 'vue-bucket-loader';

  export default {
    components: {
      VueBucketLoader,
    },
  };
</script>
```

### Properties
| Property | Required | Type | Description |
| ------------- | ------------- | ------------- | ------------- |
| signingUrl | true | String / Function | Provide an endpoint to a backend service which can generate a [presignedUrl](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html). |
| beforeUpload | false | Function | Provide a function to add additional checks before your files get uploaded, e.g. MIME-Type checking. |

### Events
This component provides event-handling for the following cases. To subscribe:

```javascript
this.$on('Event', function( payload ));
```

| Event | Description | Payload |
| ------------- | ------------- | ------------- |
| "add-files-before" | This event will be emitted after a file was added to the input field. | Array
| "delete-file-before" | This event will be emitted before a file will be removed. | Object
| "delete-file-succes" | This event will be emitted after a file was successfully uploaded.| Object
| "delete-file-error" | This event will be emitted after a file was not uploaded.| Object

### Development
#### Installing dependencies
Run this command.

```sh
$ yarn install
```

#### Test
To make sure that the installation went fine. Run this command.

```sh
$ yarn test
```

#### Dev Server
To start the development server use

```sh
$ yarn dev
```

## Built with
* [Vue js](http://www.vuejs.org) - Javascript Framework
* [Yarn](https://yarnpkg.com/lang/en/) - Dependency Management
* [Webpack](https://webpack.js.org/) - Application Bundler
* [Jest](https://facebook.github.io/jest/) - Test Runner

### Also see
* [Vue-Test-Utils Api](https://vue-test-utils.vuejs.org/en/api/)
* [Jest Api](https://facebook.github.io/jest/docs/en/api.html)

## Contributing
Please read through our [contributing guidelines](https://github.com/joblocal/vue-bucket-loader/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and feature requests.


## Authors
* **Joblocal GmbH** - *Initial work* - [Joblocal](https://github.com/joblocal)

See also the list of [contributors](https://github.com/joblocal/vue-bucket-loader/contributors) who participated in this project.
