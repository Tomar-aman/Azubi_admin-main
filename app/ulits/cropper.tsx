import React from "react";
import { useState } from "react";
import ImgCrop from "antd-img-crop";
import { Button, Upload } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
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
  id?: string;
  clickable?: any;
}
const Cropper = ({
  setFileList,
  fileList,
  setOldFile,
  disabled,
  maxCount,
  isA4 = false,
  aspect,
  id,
  clickable,
}: Cropper) => {
  const elementId = useSelector((state: RootState) => state.user.elementId);
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
    const MAX_FILE_KB = 5120; // 5 MB
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
  return (
    <div style={{ zIndex: "999" }}>
      <ImgCrop aspect={aspect ?? (isA4 ? 1 / 1.414 : undefined)} showGrid showReset>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          maxCount={maxCount ? maxCount : 10000}
          showUploadList={{ showRemoveIcon: true }}
          openFileDialogOnClick={true}
          // Do NOT return false from beforeUpload: with antd-img-crop that
          // discards the cropped file and keeps the original uncropped one.
          // Instead, accept the (cropped) file and no-op the upload so it stays
          // in fileList (with originFileObj = cropped file) for manual saving.
          customRequest={({ onSuccess }) => {
            setTimeout(() => onSuccess && onSuccess("ok"), 0);
          }}
        >
          <Button
            id={id || "cropper"}
          >
            + Upload
          </Button>
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default Cropper;
