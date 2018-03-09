# Vue Bucket Loader

This Project provides a SSR compatible vue component which can handle file uploads directly to an AWS S3 Bucket.
Therefore you will need to generate a signedUrl to upload your file.

## Requirements

- Yarn
- Vue 2.5.X

### Installing dependencies

Install dependencies

 ```
yarn install
 ```

### Usage

After installing this package, introduce this component as followed.

```javascript
<template>
  <VueBucketLoader />
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

### Development

To start the development server use

```
yarn dev
```

## Built With

* [Vue js](http://www.vuejs.org) - Javascript Framework
* [Yarn](https://yarnpkg.com/lang/en/) - Dependency Management
* [Webpack](https://webpack.js.org/) - Application Bundler

## Authors

* **Joblocal GmbH** - *Initial work* - [Joblocal](https://github.com/joblocal)

See also the list of [contributors](https://github.com/joblocal/vue-bucket-loader/contributors) who participated in this project.
