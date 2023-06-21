# Slemmy

<div align="center">
  <p>Lemmy web app written in Svelte</p>
  <img src=".github/screenshot1.png" width="600px" />
</div>

## Features

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

## Misc

### Favicon License

The favicon is taken from [OpenMoji](https://openmoji.org/), which is licensed
under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). It
is color-altered to be pink.

### Libraries

See [package.json](./package.json).

### Building

You shouldn't need to build this project just to use it, but for development,
you can use the following commands:

```sh
npm i # install dependencies
npm run build # build the project to ./build/
```

You can also use `npm run dev` to start a live development server.
