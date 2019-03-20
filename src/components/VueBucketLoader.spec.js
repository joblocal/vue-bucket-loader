import { mount, shallowMount } from '@vue/test-utils';
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
    const fileItem = {
      file: {
        name: 'file1.jpg',
      },
      location: 's3://localhost/file1.jpg',
    };
    wrapper.setData({
      files: [
        fileItem,
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

describe('to pass class as a prop', () => {
  test('to pass class as a object', () => {
    const className = { loremClass: true };

    wrapper = mount(VueBucketLoader, {
      propsData: { className, signingUrl },
    });

    expect(wrapper.classes()).toContain('loremClass');
  });

  test('to pass class as a string', () => {
    const className = 'loremClass';

    wrapper = mount(VueBucketLoader, {
      propsData: { className, signingUrl },
    });

    expect(wrapper.classes()).toContain('loremClass');
  });

  test('to pass class as an array', () => {
    const className = [{ loremClass: true }, 'ipsumClass'];

    wrapper = mount(VueBucketLoader, {
      propsData: { className, signingUrl },
    });

    expect(wrapper.classes()).toContain('loremClass');
    expect(wrapper.classes()).toContain('ipsumClass');
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

describe('to pass allowedFileExtensions and allowedMimTypes props', () => {
  beforeEach(() => {
    wrapper = shallowMount(VueBucketLoader, {
      propsData: {
        signingUrl,
        allowedFileExtensions: ['.pdf'],
        allowedMimeTypes: ['application/pdf'],
      },
    });
  });

  test('to contain pdf extension and application/pdf mimetype in the accept attribute', () => {
    expect(
      wrapper
        .find('.vue-bucket-loader__input')
        .attributes('accept'),
    ).toBe('.pdf,application/pdf');
  });
});
