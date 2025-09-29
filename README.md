This server folder isn't actually hosted anywhere. Here is the breakdown of resources in this director:
* "scripts" folder: What you're here for. Command-live resources for generating layouts and interacting with the notes DB.
* "wall" folder: Object-oriented backend code used to create layouts, upload notes, and do all that juicy stuff necessary to power the site.

* "db" folder: Also the local scripts when interacting with the database. Also converted to Lambdas to power routes on the live site.
* "routes" folder: Converted to AWS Lambdas using Amazon API Gateway. Used to power the live note site and not useful here in any capacity.