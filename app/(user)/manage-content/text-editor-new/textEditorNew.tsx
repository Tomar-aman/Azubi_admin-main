import React from "react";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Context,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Heading,
  Link,
  List,
  FontFamily,
  Image,
  ImageUpload,
  ImageResize,
  ImageResizeHandles,
  Base64UploadAdapter,
  Table,
  MediaEmbed,
  BlockQuote,
  Alignment,
  FontColor,
  FontBackgroundColor,
  FontSize,
  Highlight,
  Indent,
  Underline,
  Subscript,
  Superscript,
  ContextWatchdog,
  SourceEditing,
  ImageResizeEditing,
  ImageStyle, // Include ImageStyle
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { Box } from "@mui/material";

export interface TextEditorType {
    setContent: (data: string) => void;
    content: string;
    disabled?: boolean;
  }



const  TextEditorNew =  ({ setContent, content, disabled }: TextEditorType) => {
  return (
    <Box
      sx={{
        "& .ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline":
          { height: "300px" },
        "& .ck-source-editing-area": {
          "& textarea": {
            height: "300px",
            overflowY: "auto",
            overflowX: "hidden",
          },
        },
      }}
    >

      <CKEditorContext
        context={Context}
        contextWatchdog={ContextWatchdog}
        onChangeInitializedEditors={(editors) => {
          console.info(editors.editor1?.instance);
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          config={{
            plugins: [
              Essentials,
              Bold,
              Italic,
              Paragraph,
              Heading,
              Link,
              List,
              FontFamily,
              Image,
              ImageUpload,
              ImageResize,
              ImageResizeEditing,
              ImageResizeHandles,
              ImageStyle, // Ensure ImageStyle plugin is included
              Base64UploadAdapter,
              Table,
              MediaEmbed,
              BlockQuote,
              Alignment,
              FontColor,
              FontBackgroundColor,
              FontSize,
              Highlight,
              Indent,
              Underline,
              Subscript,
              Superscript,
              SourceEditing,
            ],
            toolbar: [
              "heading",
              "bold",
              "italic",
              "fontFamily",
              "underline",
              "strikethrough",
              "link",
              "bulletedList",
              "numberedList",
              "alignment",
              "|",
              "fontColor",
              "fontBackgroundColor",
              "fontSize",
              "highlight",
              "blockQuote",
              "insertTable",
              "imageUpload",
              "mediaEmbed",
              "subscript",
              "superscript",
              "undo",
              "redo",
              "|",
              "sourceEditing",
            ],
            alignment: {
              options: ["left", "center", "right", "justify"],
            },
            fontFamily: {
              options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Times New Roman, Times, serif',
                'Tahoma, Geneva, sans-serif',
                'Palatino Linotype, Book Antiqua, Palatino, serif',
                'Ubuntu, Arial, sans-serif',
                'Roboto, Arial, sans-serif',
                'Open Sans, sans-serif',
                'Lato, sans-serif',
                'Montserrat, sans-serif',
                'Poppins, sans-serif',
                
              ]
          },
            fontSize: {
              options: [9, 11, 13, "default", 17, 19, 21, 27, 35],
            },
            table: {
              contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
            },
            heading: {
              options: [
                { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
                { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
                { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
                { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
                { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
                { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
                { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
              ],
            },
            image: {
              toolbar: [
                "imageTextAlternative",
                "imageStyle:alignLeft",
                "imageStyle:full",
                "imageStyle:alignRight",
                "resizeImage:25",
                "resizeImage:50",
                "resizeImage:75",
                "resizeImage:original",
              ],
              resizeUnit: "%",
              resizeOptions: [
                {
                  name: "resizeImage:original",
                  value: null,
                  label: "Original size",
                },
                {
                  name: "resizeImage:25",
                  value: "25",
                  label: "25%",
                },
                {
                  name: "resizeImage:50",
                  value: "50",
                  label: "50%",
                },
                {
                  name: "resizeImage:75",
                  value: "75",
                  label: "75%",
                },
                {
                  name: "resizeImage:100",
                  value: "100",
                  label: "100%",
                },
              ],
            },
            mediaEmbed: {
              previewsInData: true,
            },
            extraPlugins: [Base64UploadAdapter],
          }}
          data={content || "<p></p>"} // Set initial data
          disabled={disabled}
          contextItemMetadata={{
            name: "editor1",
            yourAdditionalData: 2,
          }}
          onReady={(editor) => {
            console.log("Editor 1 is ready to use!", editor);
          }}
         
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
          
        />
        
      </CKEditorContext>



    </Box>
  );
}

export default TextEditorNew;