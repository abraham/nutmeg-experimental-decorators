import 'mocha';
import { expect } from 'chai';
import 'karma-fixture';

describe('<test-dec>', () => {
  let component;
  let fixturePath = 'test-dec.fixture.html';
  const FIXTURES = {
    DEFAULT: 0,
    SLOT: 1,
    STYLE: 2,
    ATTRIBUTES: 3,
    PROPERTIES: 4,
  };
  const DEFAULTS = {
    BOOLEAN: true,
    NUMBER: 42,
    STRING: 'Pickle',
    OBJECT: {
      foo: 'bar',
    },
  }

  before(() => {
    fixture.setBase('test/fixture')
  });

  afterEach(() => {
    fixture.cleanup()
  });

  describe('slot', () => {
    beforeEach(() => {
      component = fixture.load(fixturePath)[FIXTURES.SLOT];
    });

    it('is rendered', () => {
      // Firefox has different output so testing for inclusion instead of exact match.
      const slot = component.shadowRoot.querySelector('slot');
      expect(slot.assignedNodes()[0].wholeText).to.include(DEFAULTS.STRING);
      // TODO: Switch to simpler test when Firefox is no longer polyfilled.
      // expect(component.innerText).equal('Cat');
    });
  });

  describe('--test-dec-background-color', () => {
    describe('with default', () => {
      beforeEach(() => {
        component = fixture.load(fixturePath)[FIXTURES.SLOT];
      });

      it('is set', () => {
        expect(getComputedStyle(component.shadowRoot.querySelector('.content')).backgroundColor).equal('rgb(250, 250, 250)');
      });
    });

    describe('with outside value', () => {
      beforeEach(() => {
        component = fixture.load(fixturePath)[FIXTURES.STYLE].querySelector('test-dec');
      });

      it('is set blue', () => {
        expect(getComputedStyle(component.shadowRoot.querySelector('.content')).backgroundColor).equal('rgb(3, 169, 244)');
      });
    });
  });

  describe('#one', () => {
    beforeEach(() => {
      component = fixture.load(fixturePath)[FIXTURES.DEFAULT];
    });

    describe('as property', () => {
      describe('when defined', () => {
        beforeEach(() => {
          component.one = DEFAULTS.STRING;
        });

        it('is gettable', () => {
          expect(component.one).equal(DEFAULTS.STRING);
        });

        it('is reflected to attribute', () => {
          expect(component.getAttribute('one')).equal(DEFAULTS.STRING);
        });

        it('is rendered in shadowRoot', () => {
          expect(component.shadowRoot.querySelector('.content').innerText).to.include(`one: ${DEFAULTS.STRING}`);
        });
      });

      describe('when undefined', () => {
        beforeEach(() => {
          component.one = null;
        });

        it('is gettable', () => {
          expect(component.one).equal(null);
        });

        it('is not reflected to attribute', () => {
          expect(component.hasAttribute('one')).to.be.false;
        });

        it('is not rendered in shadowRoot', () => {
          expect(component.shadowRoot.querySelector('.content').innerText).to.include(`one: N/A`);
        });
      });
    });

    describe('as attribute', () => {
      describe('when defined', () => {
        beforeEach(() => {
          component.setAttribute('one', DEFAULTS.STRING);
        });

        it('is gettable', () => {
          expect(component.one).equal(DEFAULTS.STRING);
        });

        it('is reflected to attribute', () => {
          expect(component.getAttribute('one')).equal(DEFAULTS.STRING);
        });

        it('is rendered in shadowRoot', () => {
          expect(component.shadowRoot.querySelector('.content').innerText).to.include(`one: ${DEFAULTS.STRING}`);
        });
      });

      describe('when undefined', () => {
        beforeEach(() => {
          component.removeAttribute('one');
        });

        it('is gettable', () => {
          expect(component.one).equal(null);
        });

        it('is not reflected to attribute', () => {
          expect(component.hasAttribute('one')).to.be.false;
        });

        it('is not rendered in shadowRoot', () => {
          expect(component.shadowRoot.querySelector('.content').innerText).to.include(`one: N/A`);
        });
      });
    });
  });

});
