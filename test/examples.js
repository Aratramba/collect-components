const test = require("tape");
const fs = require("fs");
const parser = require("../lib/parser");

/**
 * Examples
 */

test("Get examples", function (assert) {
  let actual = parser.getExamples({ example: "foo" });
  let expected = ["foo"];
  assert.deepEqual(
    actual,
    expected,
    "should return an array of examples when given example object string"
  );

  actual = parser.getExamples({ example: ["foo", "faa"] });
  expected = ["foo", "faa"];
  assert.deepEqual(
    actual,
    expected,
    "should return an array of examples when given example object array"
  );

  actual = parser.getExamples({ example: "" });
  expected = [];
  assert.deepEqual(
    actual,
    expected,
    "should return an empty array when given an empty examples string"
  );

  actual = parser.getExamples({ examples: "foo" });
  expected = ["foo"];
  assert.deepEqual(
    actual,
    expected,
    "should return an array of examples when given examples object string"
  );

  actual = parser.getExamples({ examples: ["foo", "faa"] });
  expected = ["foo", "faa"];
  assert.deepEqual(
    actual,
    expected,
    "should return an array of examples when given examples object array"
  );

  actual = parser.getExamples({ examples: "" });
  expected = [];
  assert.deepEqual(
    actual,
    expected,
    "should return an empty when given an empty examples string"
  );

  actual = parser.getExamples({ example: "bar", examples: ["foo", "faa"] });
  expected = ["bar", "foo", "faa"];
  assert.deepEqual(
    actual,
    expected,
    "should return an array of examples when given examples object array and example string"
  );

  actual = parser.getExamples({ example: "", examples: ["foo", "faa"] });
  expected = ["foo", "faa"];
  assert.deepEqual(
    actual,
    expected,
    "should return an array of examples when given examples object array"
  );

  actual = parser.getExamples({ example: [], examples: [] });
  expected = [];
  assert.deepEqual(
    actual,
    expected,
    "should return an empty array of examples when given empty examples object array"
  );

  assert.end();
});

/**
 * Render examples
 */

test("Render examples", function (assert) {
  let actual = parser.render(
    "<p>foo</p>",
    { example: "<div></div>" },
    "{{block}}"
  );
  let expected = "<div></div>";
  assert.deepEqual(
    actual,
    expected,
    "should not render inner block because no flag was found"
  );

  actual = parser.render(
    "<p>foo</p>",
    { example: "<div>{{block}}</div>" },
    "{{block}}"
  );
  expected = "<div><p>foo</p></div>";
  assert.deepEqual(actual, expected, "should render inner block");

  actual = parser.render(
    "<p>foo</p>",
    { example: "<div>{{block}}</div>" },
    "{{fooblock}}"
  );
  expected = "<div>{{block}}</div>";
  assert.deepEqual(
    actual,
    expected,
    "should not render inner block because of no found flag"
  );

  actual = parser.render(
    "<p>foo</p>",
    { example: "<div>{{fooblock}}</div>" },
    "{{fooblock}}"
  );
  expected = "<div><p>foo</p></div>";
  assert.deepEqual(actual, expected, "should render inner block");

  assert.end();
});

/**
 * Get components and render examples
 */

test("Get examples from file", function (assert) {
  const src = fs.readFileSync("./test/fixtures/examples.html").toString();
  const components = parser.getComponents(src, "test.html", {
    keyword: "@component",
    block: "{{block}}",
  });

  let actual = components[0].output;
  let expected = '<div class="example">\n  <p>this is my example</p>\n</div>';
  assert.equal(actual, expected);

  actual = components[1].output;
  expected =
    '<div class="example">\n  <p>this is my example</p>\n  <p>this is my example</p>\n</div>';
  assert.equal(actual, expected);

  actual = components[2].output;
  expected =
    '<div class="example">\n  <p>this is my example</p>\n</div>\n<div class="example">\n  <p>this is my example</p>\n</div>';
  assert.equal(actual, expected);

  actual = components[3].output;
  expected = '<div class="example"></div>';
  assert.equal(actual, expected);

  actual = components[4].output;
  expected = '<div class="example"><p>this is my example</p></div>';
  assert.equal(actual, expected);

  actual = components[5].output;
  expected = '<div class="example"><p>this is my example</p></div>';
  assert.equal(actual, expected);

  actual = components[6].output;
  expected =
    '<div class="example">\n  <p>this is my example</p>\n</div>\n\n<div class="example">\n  <p>this is my example</p>\n</div>';
  assert.equal(actual, expected);

  actual = components[7].output;
  expected = '<div class="example">\n  {{noblock}}\n</div>';
  assert.equal(actual, expected);

  actual = components[8].output;
  expected =
    '<div class="example" style="background: red;"><p>this is my example</p></div>';
  assert.equal(actual, expected);

  actual = components[9].output;
  expected =
    '<div class="example">\n  <style type="text/css">\n    background: red;\n  </style>\n  <p>this is my example</p>\n</div>';
  assert.equal(actual, expected);

  actual = components[10].output;
  expected =
    "<div class=\"example\">\n  <script>\n    alert('foo');\n  </script>\n  <p>this is my example</p>\n</div>";
  assert.equal(actual, expected);

  assert.end();
});
