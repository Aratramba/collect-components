# Collect Components
Captures tagged HTML comments and their corresponding HTML components from a website and generates components.json.


## Usage
Use the keyword @component to flag html comments in your templates. Comments should be written in properly formatted [YAML](http://en.wikipedia.org/wiki/YAML) format.

```html
<!-- @component
    name: My Component
    description: this is a description for my component
-->
```

The immediate next DOM-node after the comment will be used as HTML-source for the component. If you need to capture multiple blocks, see [Capture multiple](#capture-multiple-blocks) blocks. Any parameter in the component block will be add to the `meta` object in the output json.

```html
<!-- @component
    name: My Component
-->

<div>This is my component</div>
<div>This isn't</div>
```

---


### Output file
Output will look something like this.

```json
[
  {
    "meta": {
      "name": "foo",
      "description": "foo description",
      "param": "foo"
    },
    "file": "file.html",
    "output": "<div>this is my component</div>"
  }
]
```


---

### Examples
You can add an example or multiple examples with the `example` or `examples` keyword, where the former is a YAML string and the latter a YAML list. The `{{block}}` flag will be replaced by the captured block

_single example_
```html
<!-- @component
    name: My Component
    example: |
        <div style="max-width: 300px">
            {{block}}
        </div>
-->

<p>this is my example</p>
```

_multiple example_
```html
<!-- @component
    name: My Component
    examples: 
        - >
            <div style="max-width: 300px">
                {{block}}
            </div>
        - >
            <div style="max-width: 300px">
                {{block}}
            </div>
-->

<p>this is my example</p>
```

---

### Capture multiple blocks
The `capture` keyword specifies how many blocks after the comment will be returned. Use `capture: all` to capture the comments' siblings. Use `capture: section` to capture all items until the next @component tag.

```html
<!-- @component
    name: My Component
    capture: 3
-->

<div>1</div>
<div>2</div>
<div>3</div>
<div>nope</div>
<div>nope</div>
```

```html
<!-- @component
    name: My Component
    capture: section
-->

<div>1</div>
<div>2</div>
<div>3</div>
<!-- @component -->
<div>nope</div>
```

```html
<!-- @component
    name: My Component
    capture: all
-->

<div>1</div>
<div>2</div>
<div>3</div>
<!-- @component -->
<div>yep</div>
```


---

### Reserved words
* `example` for an example block
* `examples` for multiple example blocks
* `capture` for the number of DOM-nodes to be captured
    - `all`: the rest of the DOM-nodes within the comments` parent
    - `section`: the rest of the DOM-nodes within the comments` parent or a new @component comment
    - `number`: the exact positive number of DOM-nodes

---

## How to use
```
npm install collect-components
```

```js
var scraper = require('collect-components');

scraper({
    url: 'https://rawgit.com/EightMedia/collect-components/master/test/fixtures/',
    paths: ['examples.html', 'capture.html', 'yaml.html'],
    keyword: '@component',
    block: '{{block}}',
    output: 'components.json',
    complete: function(components){}
});
```
