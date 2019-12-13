# Contributing

Contributions are welcome in any form.  Fork the repo and issue a PR.  It's a pretty lean team ([me](https://github.com/cjam)) at the moment so I'm focusing on code over documentation.


The following is a guide mostly for me so next time I come back to this project I know how to work with it.

### Development

Developing this library is most easily done with the [Example Project](./example).  Since we need Spotify on the device to verify functionality, the recommended approach is to add UI to the main screen that exercises the API, making functionality easy to verify and debug.

### Publishing
Unfortunately, this package doesn't yet have Continuous Deployment setup:

To release a new version of the package:

- Bump version number in [package.json](./package.json) using [Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)
- Verify package contents `npm publish --dry-run`
- Commit all changes (i.e. new docs etc)
- Merge in changes
- Tag master with version number
- Checkout tag <version_number>
- run `npm publish`



