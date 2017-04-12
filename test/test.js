scraper({
  hostname: 'localhost',
  protocol: 'http:',
  port:  8000,
  paths: ['examples.html'],
  output: 'test/tmp/components.json',
  complete: console.log
});