# Vue Bucket Loader

This Project provides a SSR compatible vue component which can handle file uploads directly to an AWS S3 Bucket.
Therfore you will need to generate a signedUrl to upload your file.

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

```
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
* [Webpack](https://https://webpack.js.org/) - Application Bundler

## Authors

* **Joblocal GmbH** - *Initial work* - [Joblocal](https://https://github.com/joblocal)

See also the list of [contributors](https://github.com/joblocal/vue-s3-fileupload/contributors) who participated in this project.
