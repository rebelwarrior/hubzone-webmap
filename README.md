# HUBZone Map

This application houses the new and improved HUBZone Map for the Small Business Administration.  All development is currently being done off of the `develop` branch.

Requirements:
* rvm
  - http://rvm.io/
* ruby 2.3.1
  - `rvm install 2.3.1`
* JavaScript interpreter (node)
  * nvm
    * `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash`
  * Install node
    * `nvm install 5`
* bundler 1.12.5
  - `gem install -v 1.12.5 bundler`
* postgresql 9.5
  * Mac
    - I use [Postgres.app](http://postgresapp.com/)
    - could also use `brew install postgresql`
    - set `PGSQL_HOME` to your installation dir
      - e.g. `export PGSQL_HOME=/Applications/Postgres.app/Contents/Versions/9.5`
    - ensure that the bin directory is in your path
      - e.g. `export PATH=${PATH}:${PGSQL_HOME}/bin`
  * Linux (rhel)
    * Install:
      * `yum install https://download.postgresql.org/pub/repos/yum/9.5/redhat/rhel-6-x86_64/pgdg-redhat95-9.5-3.noarch.rpm`
      * `yum install postgresql95-server postgresql95-devel`
    * Configure:
      * `echo 'export PGSQL_HOME=/usr/pgsql-9.5' >> ~/.bashrc`
      * `echo 'export PATH=${PATH}:${PGSQL_HOME}/bin' >> ~/.bashrc`

After cloning the repo, run the following:
``` bash
cd hubzone_map
bundle install
bundle exec rake db:create
rails server
```

If the `bundle install` fails due to the pg gem, make sure you have the ENV vars above set in your shell.

To run the test suite, simply run:
* `rspec`
* or with verbose output: `rspec -f d`

To launch the map:
``` bash
cd hubzone_map
git checkout develop
git pull
rails server
```
Then point your browser to http://localhost:3000/

# Running Tests #


## Javascript Tests ##
### Teaspoon / Jasmine / Istanbul Unit and Coverage tests ###
Teaspoon is used for Javascript testing and coverage.  It runs Jasmine for unit and integration tests and Istanbul for test coverage.

First install Istanbul:
```
npm install -g istanbul
```

To run Teaspoon for unit tests, run:
```
  RAILS_ENV=test bundle exec teaspoon
```

To include Istanbul coverage tests, run:
```
  RAILS_ENV=test bundle exec teaspoon --coverage=default
```

To view interactive report of test coverage, open:
```
coverage/default/index.html
```

### JSHint Lint Tests ###
Tring to use this JSHint gem [JSHint](https://github.com/damian/jshint), per its docs:

Add `gem 'jshint'` to the Gemfile under `group :development, :test`

Run `bundle` to install, then run `bundle exec rake jshint` to run test.  Currently this is running the linter then causing a rake error, which appears to be an ongoing issue with this gem.

Hello!
