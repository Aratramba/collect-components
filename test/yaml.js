const test = require("tape");
const fs = require("fs");
const parser = require("../lib/parser");

/**
 * Parse yaml
 */

test("yaml", function (assert) {
  const src = fs.readFileSync("./test/fixtures/yaml.html").toString();

  const components = parser.getComponents(src, "test.html", {
    keyword: "@component",
  });

  let actual = components[0].meta.name;
  let expected = "foo";
  assert.equal(actual, expected);

  actual = components[0].meta.param1;
  expected = "faa";
  assert.equal(actual, expected);

  actual = components[0].meta.param2;
  expected = [1, 2, 3];
  assert.deepEqual(actual, expected);

  actual = components[0].file;
  expected = "test.html";
  assert.deepEqual(actual, expected);

  actual = components[1].meta;
  expected = {};
  assert.deepEqual(actual, expected);

  actual = components[2].meta;
  expected = {};
  assert.deepEqual(actual, expected);

  actual = components[3].meta.name;
  expected = "foo";
  assert.deepEqual(actual, expected);

  actual = components[3].meta.description;
  expected = "this is my component description";
  assert.deepEqual(actual, expected);

  actual = components[4].meta.name;
  expected = "foo";
  assert.deepEqual(actual, expected);

  actual = components[4].meta.description;
  expected = "this is my component description";
  assert.deepEqual(actual, expected);

  actual = components[5].meta.name;
  expected = "foo";
  assert.deepEqual(actual, expected);

  actual = components[5].meta.description;
  expected = "this is my component description";
  assert.deepEqual(actual, expected);

  actual = components[6].meta.name;
  expected = "foo";
  assert.deepEqual(actual, expected);

  actual = components[6].meta.description;
  expected = "this is my component description";
  assert.deepEqual(actual, expected);

  assert.end();
});
