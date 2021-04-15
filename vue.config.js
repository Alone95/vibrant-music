module.exports = {
  pwa: {
    name: "LIFE IS FUN HAVE A NICE DAY",
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
    },
    themeColor: "#000",
    manifestOptions: {
      background_color: "#000",
    },
    // workboxOptions: {
    //   swSrc: "dev/sw.js",
    // },
  },
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "LIFE IS FUN HAVE A NICE DAY",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
};
