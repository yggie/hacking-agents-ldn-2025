export default {
  play: (url: string) => ({
    type: "play",
    source: url,
    loop: 1,
    preemptible: false,
    interruptible: true,
  }),
};
