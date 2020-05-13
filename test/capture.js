const test = require("tape");
const fs = require("fs");
const parser = require("../lib/parser");

/**
 * Capture
 */

test("capture", function (assert) {
  const src = fs.readFileSync("./test/fixtures/capture.html").toString();

  const components = parser.getComponents(src, "test.html", {
    keyword: "@component",
  });

  let actual = components[0].output;
  let expected =
    "<div>1</div>\n<div>2</div>\n<div>3</div>\n<div>4</div>\n<div>5</div>\n<div>6</div>";
  assert.equal(actual, expected);

  actual = components[1].output;
  expected = "<div>6</div>";
  assert.equal(actual, expected);

  actual = components[2].output;
  expected = "<div>1</div>\n<div>2</div>\n<div>3</div>";
  assert.equal(actual, expected);

  actual = components[3].output;
  expected = "";
  assert.equal(actual, expected);

  actual = components[4].output;
  expected = "";
  assert.equal(actual, expected);

  actual = components[5].output;
  expected = "<div>4</div>\n<div>5</div>\n<div>6</div>";
  assert.equal(actual, expected);

  actual = components[6].output;
  expected = "<div>7</div>";
  assert.equal(actual, expected);

  actual = components[7].output;
  expected =
    "<style type=\"text/css\">\n    background: red;\n  </style>\n<script>\n    alert('hello')\n  </script>\n<div>8</div>";
  assert.equal(actual, expected);

  actual = components[8].output;
  expected =
    "<div>1</div>\n<div>2</div>\n<div>3</div>\n<div>4<div>4b</div></div>\n<div>5\n    <!-- @component -->\n    <div>5b</div>\n  </div>";
  assert.equal(
    actual,
    expected,
    "it should return all innerhtml of siblings including comments"
  );

  assert.end();
});
