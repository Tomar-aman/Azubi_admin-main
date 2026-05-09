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
  id,
  clickable,
}: Cropper) => {
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const onChange = ({ fileList: newFileList }: any) => {
    /* add image size validation */
    if (newFileList.length > 0) {
      for (let i = 0; i < newFileList.length; i++) {
        if (newFileList[i].size / 1024 >= 500) {
          alert("size must be less than 500kb");
          return;
        }
      }
    }
    const data = fileList.find((item: any) => {
      if (item.status === "removed") {
        return item.uid;
      }
    });
    setOldFile((pre: any) => [...pre, data?.uid]);
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
      <ImgCrop aspect={isA4 ? 1 / 1.414 : undefined} showGrid showReset>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          maxCount={maxCount ? maxCount : 10000}
          showUploadList={{ showRemoveIcon: true }}
          openFileDialogOnClick={elementId ? true : false}
        >
          <Button
            id={id || "cropper"}
            onClick={(e) => {
              clickable();
            }}
          >
            + Upload
          </Button>
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default Cropper;
