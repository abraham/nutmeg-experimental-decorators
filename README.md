&lt;test-dec&gt;
====

Install
----

Polyfill tags if you need them. This will include ShadowDOM and Custom Elements support.

```
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@latest/webcomponents-sd-ce.js"></script>
```

Loading this component. It would be a good idea to use a specific version instead of `latest`.

```
<script src="https://unpkg.com/test-dec@latest/dist/test-dec.min.js"></script>
```

Usage
----

```
  <test-dec one="Some value"></test-dec>

  <test-dec two="Some value"></test-dec>

  <test-dec>Slot content</test-dec>
```

License
----

TestDec is released under an MIT license.

Built, tested, and published with [Nutmeg](https://nutmeg.tools).
