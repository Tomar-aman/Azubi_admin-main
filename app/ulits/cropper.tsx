import React, { useRef, useState } from "react";
import ImgCrop from "antd-img-crop";
import { Button, ConfigProvider, Modal, Upload } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
export interface FileState {
  uid: string;
  url: string;
  name: string;
  originFileObj?: any;
}
const getSrcFromFile = (file: any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });
};
export interface Cropper {
  setFileList: (data: FileState[]) => void;
  fileList: FileState[];
  setOldFile: (data: any) => void;
  disabled: boolean;
  maxCount?: number;
  isA4?: boolean;
  /** Fixed crop aspect ratio (e.g. 1 for a 1:1 square). Overrides isA4/free. */
  aspect?: number;
  /**
   * Skip the fixed-aspect crop step entirely and upload the image at its
   * natural shape (e.g. for company logos that shouldn't be forced into a
   * square). Displayed with object-fit: contain on the public side.
   */
  freeCrop?: boolean;
  /**
   * Keep the cropper but show a slider so the user can freely adjust the crop
   * aspect ratio (e.g. for logos) instead of being locked to a square.
   */
  aspectSlider?: boolean;
  /**
   * Keep the same upload UI, but replace the crop dialog with a free-form one
   * (react-image-crop) where the crop box can be drawn/resized by dragging its
   * edges with the mouse — no fixed aspect.
   */
  freeCropModal?: boolean;
  id?: string;
  clickable?: any;
}
const MAX_FILE_KB = 5120; // 5 MB
const Cropper = ({
  setFileList,
  fileList,
  setOldFile,
  disabled,
  maxCount,
  isA4 = false,
  aspect,
  freeCrop = false,
  aspectSlider = false,
  freeCropModal = false,
  id,
  clickable,
}: Cropper) => {
  const elementId = useSelector((state: RootState) => state.user.elementId);

  // Free-form crop dialog state (only used when freeCropModal is on).
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onChange = (info: any) => {
    let { fileList: newFileList, file } = info;

    // Handle removals
    if (file.status === 'removed') {
      if (file.uid && !file.originFileObj) {
        setOldFile((pre: any) => [...pre, file.uid]);
      }
    }

    // Handle size validation for new uploads.
    // Limit is generous (5 MB) because cropped PNGs are often larger than the
    // old 500 KB cap; the backend itself imposes no upload size limit.
    if (file.status === 'uploading' || file.status === 'done' || !file.status) {
      if (file.originFileObj && file.originFileObj.size / 1024 >= MAX_FILE_KB) {
        alert(`${file.name} is too large (must be less than 5MB)`);
        // Filter out the oversized file
        newFileList = newFileList.filter((f: any) => f.uid !== file.uid);
      }
    }

    setFileList(newFileList);
  };

  const onPreview = async (file: any) => {
    const src = file.url || (await getSrcFromFile(file));
    const imgWindow = window.open(src);

    if (imgWindow) {
      const image = new Image();
      image.src = src;
      imgWindow.document.write(image.outerHTML);
    } else {
      window.location.href = src;
    }
  };

  // Intercept the picked file, open the free-form crop dialog, and stop antd
  // from adding the raw (uncropped) file — we add the cropped one on OK.
  const beforeUploadFree = (file: any) => {
    if (file.size / 1024 >= MAX_FILE_KB) {
      alert(`${file.name} is too large (must be less than 5MB)`);
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    return Upload.LIST_IGNORE;
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop({ unit: "px", x: width * 0.1, y: height * 0.1, width: width * 0.8, height: height * 0.8 });
  };

  const closeCrop = () => {
    setCropOpen(false);
    setCropSrc("");
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const confirmCrop = async () => {
    const image = imgRef.current;
    const pc =
      completedCrop ||
      (crop && image ? convertToPixelCrop(crop, image.width, image.height) : undefined);
    if (image && pc && pc.width && pc.height) {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(pc.width * scaleX);
      canvas.height = Math.floor(pc.height * scaleY);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          image,
          pc.x * scaleX,
          pc.y * scaleY,
          pc.width * scaleX,
          pc.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );
        const blob: Blob | null = await new Promise((res) =>
          canvas.toBlob((b) => res(b), "image/png")
        );
        if (blob) {
          const f = new File([blob], "cropped.png", { type: "image/png" });
          const item: FileState = {
            uid: String(Date.now()),
            name: f.name,
            url: URL.createObjectURL(blob),
            originFileObj: f,
          };
          setFileList(maxCount === 1 ? [item] : [...fileList, item]);
        }
      }
    }
    closeCrop();
  };

  const uploadEl = (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={onChange}
      onPreview={onPreview}
      maxCount={maxCount ? maxCount : 10000}
      showUploadList={{ showRemoveIcon: true }}
      openFileDialogOnClick={true}
      {...(freeCropModal
        ? { beforeUpload: beforeUploadFree }
        : {
            // Do NOT return false from beforeUpload: with antd-img-crop that
            // discards the cropped file and keeps the original uncropped one.
            // Accept the (cropped) file and no-op the upload so it stays in
            // fileList (with originFileObj = cropped file) for manual saving.
            customRequest: ({ onSuccess }: any) => {
              setTimeout(() => onSuccess && onSuccess("ok"), 0);
            },
          })}
    >
      <Button id={id || "cropper"}>+ Upload</Button>
    </Upload>
  );

  return (
    <div style={{ zIndex: "999" }}>
      {freeCropModal ? (
        <ConfigProvider theme={{ token: { colorPrimary: "#1FA49A" } }}>
          {uploadEl}
          <Modal
            open={cropOpen}
            title="Edit image"
            onOk={confirmCrop}
            onCancel={closeCrop}
            okText="OK"
            cancelText="Cancel"
            destroyOnClose
          >
            {cropSrc && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={cropSrc}
                    onLoad={onImageLoad}
                    alt="crop"
                    style={{ maxWidth: "100%", maxHeight: 400 }}
                  />
                </ReactCrop>
              </div>
            )}
          </Modal>
        </ConfigProvider>
      ) : freeCrop ? (
        // Upload at natural aspect ratio (no forced square crop).
        uploadEl
      ) : (
        <ConfigProvider theme={{ token: { colorPrimary: "#1FA49A" } }}>
          <ImgCrop
            aspect={aspect ?? (isA4 ? 1 / 1.414 : undefined)}
            aspectSlider={aspectSlider}
            showGrid
            showReset
          >
            {uploadEl}
          </ImgCrop>
        </ConfigProvider>
      )}
    </div>
  );
};

export default Cropper;
