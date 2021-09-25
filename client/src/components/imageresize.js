import Resizer from "react-image-file-resizer";

const imageResize = (image,width,height) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      width,
      height,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

  export default imageResize