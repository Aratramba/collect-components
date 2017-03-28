# Design Manual Scraper
Generate components.json file for [Design Manual](https://github.com/EightMedia/design-manual) by scraping a website.


## Usage


---


### Output file
Output will look something like this.

```json
[
  {
    "meta": {
      "name": "foo",
      "description": "foo description"
    },
    "file": "file.html",
    "source": "// foo",
    "output": "<!-- foo-->"
  }
]
```

