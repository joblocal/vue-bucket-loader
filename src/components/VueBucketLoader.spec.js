import { mount } from 'vue-test-utils';
import sinon from 'sinon';
import axios from 'axios';
import VueBucketLoader from './VueBucketLoader.vue';

let wrapper;
let sandbox;

const presignedUrlEndpoint = 'http://localhost';
const presignedUrlEndpointReturnValue = 'http://invalid.localhost';
const presignedUrlEndpointCallback = () => presignedUrlEndpointReturnValue;

function FormDataMock() {
  this.append = jest.fn();
}

global.FormData = FormDataMock;

describe('VueBucketLoader display', () => {
  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        presignedUrlEndpoint,
        presignedUrlEndpointCallback,
      },
    });
  });

  test('matches snapshot using defaults', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});

describe('returns presigned endpoint', () => {
  test('to return presignedUrlEndpoint prop', async () => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        presignedUrlEndpoint,
      },
    });

    expect(await wrapper.vm.getPresignedUrlEndpoint())
      .toBe(presignedUrlEndpoint);
  });

  test('to return value of presignedUrlEndpointCallback', async () => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        presignedUrlEndpointCallback,
      },
    });

    expect(await wrapper.vm.getPresignedUrlEndpoint())
      .toBe(presignedUrlEndpointReturnValue);
  });
});

describe('to call getPresignedUrl', () => {
  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        presignedUrlEndpoint,
      },
    });
  });

  test('to call getPresignedUrl with presignedUrlEndpoint', async () => {
    const mock = sinon.mock(axios);

    mock.expects('post')
      .once()
      .withExactArgs(presignedUrlEndpoint);

    wrapper.vm.getPresignedUrl(presignedUrlEndpoint);

    mock.verify();
  });
});

describe('to call uploadFile', () => {
  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        presignedUrlEndpoint,
      },
    });
  });

  test('to call uploadFile with expected data', async () => {
    const presignedUrl = {
      data: {
        postEndpoint: 'http://invalid.postEndpoint',
      },
    };

    const formData = {};
    const config = {};

    const mock = sinon.mock(axios);

    mock.expects('post')
      .once()
      .withExactArgs(presignedUrl.data.postEndpoint, formData, config);

    wrapper.vm.uploadFile(presignedUrl, formData, config);

    mock.verify();
  });
});

describe('handle file added', () => {
  const firstFile = {
    file: {
      name: 'Lorem First',
      type: 'valid',
    },
    location: 'http://bucket/first',
  };

  const secondFile = {
    file: {
      name: 'Lorem Second',
      type: 'valid',
    },
    location: 'http://bucket/second',
  };

  const files = {
    0: firstFile,
    1: secondFile,
  };

  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        presignedUrlEndpoint,
      },
    });
  });

  test('to call getPresignedUrlEndpoint', async () => {
    sandbox = sinon.sandbox.create();
    const getPresignedUrlEndpointStub = sandbox.stub();

    wrapper.setMethods({
      getPresignedUrlEndpoint: getPresignedUrlEndpointStub,
    });

    wrapper.vm.handleFileAdded({});

    expect(getPresignedUrlEndpointStub.called).toBeTruthy();
  });

  test('to check mimeType is valid', async () => {
    wrapper.setProps({
      mimeTypes: ['valid'],
    });

    expect(wrapper.vm.checkMimeType(firstFile.file.type)).toBeTruthy();
  });

  test('to check mimeType is invalid', async () => {
    wrapper.setProps({
      mimeTypes: ['invalid'],
    });

    expect(wrapper.vm.checkMimeType(firstFile.file.type)).toBeFalsy();
  });

  test('matches snapshot after file was added', async () => {
    await wrapper.vm.handleFileAdded(files);
    expect(wrapper.element).toMatchSnapshot();
  });

  afterEach(() => {
    sandbox.restore();
  });
});

describe('handle file deleted', () => {
  const firstFile = {
    file: {
      name: 'Lorem First',
      type: 'valid',
    },
    location: 'http://bucket/first',
  };

  const secondFile = {
    file: {
      name: 'Lorem Second',
      type: 'valid',
    },
    location: 'http://bucket/second',
  };

  const files = [
    firstFile,
    secondFile,
  ];

  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        presignedUrlEndpointCallback,
      },
    });

    wrapper.setData({ files });
  });

  test('to call delete request with file location', async () => {
    const mock = sinon.mock(axios);

    mock.expects('delete')
      .once()
      .withExactArgs(firstFile.location);

    wrapper.find('li button')
      .trigger('click');

    mock.verify();
  });

  test('matches snapshot after file was deleted', () => {
    wrapper.vm.handleFileDeleted(files[0]);
    expect(wrapper.element).toMatchSnapshot();
  });
});
