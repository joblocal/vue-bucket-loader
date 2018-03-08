import { mount } from 'vue-test-utils';
import VueBucketLoader from './VueBucketLoader.vue';


describe('VueBucketLoader wrapper component ', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(VueBucketLoader);
  });

  it('matches snapshot using defaults', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});

