import { html, render, TemplateResult } from 'lit-html';

export default class TestDec extends HTMLElement {
  /** The constructor always attaches a shadowRoot so no need for it to be null. */
  public shadowRoot: ShadowRoot;

  public two: string[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /** The element instance has been inserted into the DOM. */
  connectedCallback() {
    this.upgradeProperties();
    this.render();
  }

  /** The element instance has been removed from the DOM. */
  disconnectedCallback() {
  }

  /** Watch for changes to these attributes. */
  static get observedAttributes(): string[] {
    return ['one'];
  }

  /** Rerender when the observed attributes change. */
  attributeChangedCallback(_name: string, _oldValue: any, _newValue: any) {
    this.render();
  }

  /** Rerender the element. */
  render() {
    render(this.template, this.shadowRoot);
  }

  /** Support lazy properties https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties */
  private upgradeProperties() {
    (<any>this).constructor['observedAttributes'].forEach((prop: string) => {
      if (this.hasOwnProperty(prop)) {
        let value = (<any>this)[prop];
        delete (<any>this)[prop];
        (<any>this)[prop] = value;
      }
    });
  }

  get one(): string | null {
    return this.getAttribute('one');
  }

  set one(value: string | null) {
    if (value) {
      this.setAttribute('one', value);
    } else {
      this.removeAttribute('one');
    }
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
          <li>one: ${this.one === null ? 'N/A' : this.one}</li>
        </ul>

        <slot></slot>
      </div>
    `;
  }
}

window.customElements.define('test-dec', TestDec);
