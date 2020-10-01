# 0) Use Toolforge kubernetes infrastructure for the test system

Date: 2020-09-25

## Status

accepted

## Context

This project is new and its exact technological future is unknown. For example, we still don't know if this will have to be a nodejs app in the future, or if it will be only a client-side app served as static assets using Apache, Nginx, etc.

We also need a publicly accessible test setup to have its features tested by UX and PM once they land on the main branch. We also need a development environment, need a CI environment and so on. Each environment has its own unique requirements. For production we are not sure yet whether we will use [the Blubber deployment pipeline](https://wikitech.wikimedia.org/wiki/Blubber) and deploy the Query Builder as a node app or whether it will be part of the standard WDQS GUI assets.

Toolforge seems like a good setup for small projects due to its baked-in support of serving static assets using lighttpd or serving node10 apps. It has been changing and growing more mature. One of its most recent features is support for dockerized webservices and cronjobs using kubernetes. You can read more about it in [here](https://wikitech.wikimedia.org/wiki/Help:Toolforge/Kubernetes). We can't use our built Dockerfile in Toolforge and if we want to go in that direction, we would have to have a dedicated VM just for this service in CloudVPS instead and make it automatically updated using puppet or ansible which would be too much work for too little gain.


## Decision

We are going to have the test setup in Toolforge, served as static assets but built using a Kubernetes cronjob that builds these assets using the node10 docker image in Toolforge automatically and copies them to the public endpoint. You can see the exact configuration and steps in [PR#9](https://github.com/wmde/query-builder/pull/9).

## Consequences

This, while taking advantage of modern technologies like kubernetes jobs (instead of Gridengine jobs), is fairly simple and straightforward, especially compared to having a dedicated VM and serving these as either a nodejs app or using Apache/Nginx. This can also be used in a similar manner for other simple client-side apps we will develop.

It means at most, it would take an hour for a patch to be actually visible in the test system and it can be modified to be faster or slower depending on the need.

The CI or development environments are not affected by this ADR and can be discussed in another case.
