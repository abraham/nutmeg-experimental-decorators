import { html, render, TemplateResult } from 'lit-html';

export function property() {
  return function(target: HTMLElement, key: string) {
    const _val = (<any>target)[key];
    delete (<any>target)[key];
    (<any>target)[`_${key}`] = _val;
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get(this: TestDec) {
        return (<any>this)[`_${key}`];
      },
      set(this: TestDec, value) {
        (<any>this)[`_${key}`] = value;
        this.render();
      },
    });
  }
}

export function attribute(type: string) {
  return function(target: HTMLElement, key: string) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get: function() {
        switch (type) {
          case 'string':
            return (this as TestDec).getAttribute(key);
          case 'number':
            const value = (this as TestDec).getAttribute(key);
            if (value) {
              return Number(value);
            } else {
              return null;
            }
          case 'boolean':
            return (this as TestDec).hasAttribute(key);
          default:
           throw new Error('Unknown attribute');
        }
      },
      set: function(value: string | number | boolean | null) {
        if (value === null || value === undefined || value === false) {
          (this as TestDec).removeAttribute(key);
        } else {
          switch (type) {
            case 'string':
              (this as TestDec).setAttribute(key, String(value));
              break;
            case 'number':
              (this as TestDec).setAttribute(key, String(value));
              break;
            case 'boolean':
              (this as TestDec).setAttribute(key, '');
              break;
            default:
             throw new Error('Unknown attribute');
          }
        }
        (this as TestDec).render();
      }
    });
  }
}

export default class TestDec extends HTMLElement {
  @property() prop1: string[];
  @property() prop2: { foo: string };
  @attribute('boolean') attr1: boolean;
  @attribute('string') attr2: string;
  @attribute('number') attr3: number;

  private _connected = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /** The element instance has been inserted into the DOM. */
  connectedCallback() {
    this._connected = true;
    this.upgradeProperties();
    this.render();
  }

  /** The element instance has been removed from the DOM. */
  disconnectedCallback() {
    this._connected = false;
  }

  /** Watch for changes to these attributes. */
  static get observedAttributes(): string[] {
    return ['attr1', 'attr2', 'attr3'];
  }
  static get observedProperties(): string[] {
    return ['prop1', 'prop2'];
  }

  /** Rerender when the observed attributes change. */
  attributeChangedCallback(_name: string, _oldValue: any, _newValue: any) {
    this.render();
  }

  /** Rerender the element. */
  render() {
    if (this._connected) {
      render(this.template, this.shadowRoot as ShadowRoot);
    }
  }

  /** Helper to quickly query the rendered shadowRoot. `this.$('div.actions')` */
  private $(query: string): Element | null {
    return (this.shadowRoot as ShadowRoot).querySelector(query);
  }

  /** Support lazy properties https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties */
  private upgradeProperties() {
    const attrs = (<any>this).constructor['observedAttributes'];
    const props = (<any>this).constructor['observedProperties'];
    attrs.concat(props).forEach((prop: string) => {
      if (this.hasOwnProperty(prop)) {
        let value = (<any>this)[prop];
        delete (<any>this)[prop];
        (<any>this)[prop] = value;
      }
    });
  }
  private upgradeAttributesToProperties() {
    (<any>this).constructor['observedProperties'].forEach((prop: string) => {
      if (this.hasAttribute(prop)) {
        (<any>this)[prop] = this.getAttribute(prop);
        this.removeAttribute(prop);
      }
    });
  }

  /** Styling for the element. */
  private get styles(): TemplateResult {
    return html`
      <style>
        :host {
          display: block;
          box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0 ,0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
        }

        :host([hidden]) {
          display: none;
        }

        .content {
          background-color: var(--test-dec-background-color, #FAFAFA);
          color: #212121;
          padding: 16px;
        }
      </style>
    `;
  }

  /** HTML Template for the element. */
  private get template(): TemplateResult {
    return html`
      ${this.styles}
      <div class="content">
        Welcome to &lt;test-dec&gt;

        <ul>
          <li>prop1: ${this.prop1}</li>
          <li>prop2: ${this.prop2 && this.prop2.foo}</li>
          <li>attr1: ${this.attr1}</li>
          <li>attr2: ${this.attr2}</li>
          <li>attr3: ${this.attr3}</li>
        </ul>

        <slot></slot>
      </div>
    `;
  }
}

window.customElements.define('test-dec', TestDec);
