import { mount } from '@vue/test-utils';
import axios from 'axios';
import VueBucketLoader from 'src/components/VueBucketLoader';

let wrapper;

const signingUrl = 'http://localhost';

jest.mock('axios');

describe('VueBucketLoader display', () => {
  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        signingUrl,
      },
    });
  });

  test('matches snapshot using defaults', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  test('matches snapshot showing file list', () => {
    wrapper.setData({
      files: [
        {
          file: {
            name: 'file1.jpg',
          },
        },
        {
          file: {
            name: 'file2.jpg',
          },
        },
      ],
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});

describe('requests presignedUrl', () => {
  test('to call with signingUrl type String', () => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        signingUrl,
      },
    });

    wrapper.vm.getPresignedUrl();
    expect(axios.post).toBeCalledWith(signingUrl);
  });

  test('to call with signingUrl type Function', () => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        signingUrl: () => signingUrl,
      },
    });

    wrapper.vm.getPresignedUrl();
    expect(axios.post).toBeCalledWith(signingUrl);
  });
});

describe('adding files', () => {
  const files = [
    'file 1',
    'file 2',
  ];
  const fileList = {
    0: files[0],
    1: files[1],
  };
  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        signingUrl,
      },
    });
  });

  test('to call handleFilesAdded on change', () => {
    const handleFilesAdded = jest.fn();
    wrapper.setMethods({
      handleFilesAdded,
    });
    wrapper.find('input[type=file]').trigger('change');
    expect(handleFilesAdded).toBeCalled();
  });

  test('to emit "files-added-before" event', () => {
    wrapper.vm.handleFilesAdded(fileList);
    expect(wrapper.emitted('add-files-before')[0][0])
      .toEqual({ files });
  });

  test('to call beforeUpload for each file', () => {
    const beforeUpload = jest.fn();
    wrapper.setProps({
      beforeUpload,
    });
    wrapper.vm.handleFilesAdded(fileList);
    expect(beforeUpload).toHaveBeenCalledTimes(2);
  });

  test('to call uploadFile for each file', () => {
    const uploadFile = jest.fn();
    wrapper.setMethods({
      uploadFile,
    });
    wrapper.vm.handleFilesAdded(fileList);
    expect(uploadFile).toHaveBeenCalledTimes(2);
  });
});

describe('upload file', () => {
  const postEndpoint = 's3://localhost/postEndpoint';
  const location = 's3://localhost/file.jpg';
  const signature = { key: 'value' };
  const file = { name: 'file.jpg' };
  const formData = new FormData();

  formData.append('key', 'value');
  formData.append('file', file);

  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        signingUrl,
      },
    });

    const getPresignedUrl = jest.fn()
      .mockReturnValue({
        data: {
          postEndpoint,
          signature,
        },
      });

    axios.post = jest.fn()
      .mockReturnValue({
        headers: {
          location,
        },
      });

    wrapper.setMethods({
      getPresignedUrl,
    });
  });

  test('to upload file via post', async () => {
    await wrapper.vm.uploadFile(file);

    expect(axios.post).toBeCalledWith(
      postEndpoint,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  });

  test('to add file to files array', async () => {
    await wrapper.vm.uploadFile(file);

    expect(wrapper.vm.files).toEqual([
      {
        file,
        location,
      },
    ]);
  });
});

describe('deleting files', () => {
  const files = [
    {
      file: {
        name: 'file1.jpg',
      },
      location: 's3://localhost/file1.jpg',
    },
    {
      file: {
        name: 'file2.jpg',
      },
      location: 's3://localhost/file2.jpg',
    },
  ];

  beforeEach(() => {
    wrapper = mount(VueBucketLoader, {
      propsData: {
        signingUrl,
      },
      data: () => ({
        files: Array.from(files),
      }),
    });
  });

  test('to call handleFileDeleted on click', () => {
    const handleFileDeleted = jest.fn();
    wrapper.setMethods({ handleFileDeleted });
    wrapper.find('li button').trigger('click');

    expect(handleFileDeleted).toHaveBeenCalledWith(files[0]);
  });

  test('to emit "delete-file-before" event', () => {
    const file = files[0];
    wrapper.vm.handleFileDeleted(file);

    expect(wrapper.emitted('delete-file-before')[0][0])
      .toEqual({ file });
  });

  test('to send delete request', () => {
    const file = files[0];
    wrapper.vm.handleFileDeleted(file);

    expect(axios.delete).toHaveBeenLastCalledWith(file.location);
  });

  test('to remove file from files array', async () => {
    const file = files[0];
    await wrapper.vm.handleFileDeleted(file);

    expect(wrapper.vm.files).toEqual([
      files[1],
    ]);
  });

  test('to emit "delete-file-success" event', async () => {
    const file = files[0];
    await wrapper.vm.handleFileDeleted(file);

    expect(wrapper.emitted('delete-file-success')[0][0])
      .toEqual({ file });
  });

  test('to emit "delete-file-error" event', async () => {
    const file = files[0];
    const error = 'Could not delete';

    axios.delete.mockReturnValue(Promise.reject(error));
    try {
      await wrapper.vm.handleFileDeleted(file);
    } catch (e) {} // eslint-disable-line

    expect(wrapper.emitted('delete-file-error')[0][0])
      .toEqual({ file, error });
  });

  test('to throw error', async () => {
    const file = files[0];
    const error = 'Could not delete';

    axios.delete.mockReturnValue(Promise.reject(error));
    try {
      await wrapper.vm.handleFileDeleted(file);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});
