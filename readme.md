# Vue Bucket Loader

This Project provides a SSR compatible vue component which can handle file uploads directly to an AWS S3 Bucket.
Therefore you will need to provide a signedUrl to upload your file.

## Requirements

- Yarn
- Vue 2.X.X

### Installing dependencies

Install dependencies

 ```
yarn install
 ```

 ### Test
 To make sure that the installation went fine. Run following command.

 ```
 yarn test
 ```

### Usage

After installing this package, introduce this component as followed.
Make sure that you provide an presignedUrlEndpoint or a presignedUrlEndpointCallback function.
One of these are needed to use this component.

```javascript
<template>
  <VueBucketLoader
    :presignedUrlEndpoint="your endpoint"
    :presignedUrlEndpointCallback="your callback function"
  />
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

| Property | Description |
| ------------- | ------------- |
| presignedUrlEndpoint | optional: **true** \| type: **String** \| Provide endpoint to a service wich can generate a presignedUrl. |
| presignedUrlEndpointCallback  | optional: **true** \| type: **Function** \| Provide callback function, if you need to dynamically create an endpoint. |
| mimeTypes  | optional: **true** \| type: **Array** \| Use this if you want your files to be checked for a specific MIME-Type \| Example: ['image/jpeg', 'application/pdf', '.etc', ...]|

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
