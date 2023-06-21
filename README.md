# Slemmy

<div align="center">
  <p>Lemmy web app written in Svelte</p>
  <img src=".github/screenshot1.png" width="600px" />
</div>

## Status

This project is currently not usable for production. It will stay this way
until either issue https://github.com/LemmyNet/lemmy/issues/3109 gets addressed
or issue https://github.com/diamondburned/slemmy/issues/1 gets implemented.

### Features

- [x] WS support
- [x] Multiple instances (profiles support)
- [x] Posts feed
  - [x] Autoloading
  - [x] Filtering and sorting
- [x] Comments feed
  - [ ] Autoloading
  - [ ] Filtering and sorting
- [ ] Logging in
  - [ ] Upvoting
  - [ ] Commenting

## Rants

### Why Tailwind?

No good reason. Initially I wanted to try out a seemingly-good CSS framework.
It turned out to be awful, and so did Tailwind.

My advice? Never use Tailwind. It's a waste of time.
