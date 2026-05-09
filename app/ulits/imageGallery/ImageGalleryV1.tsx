import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Pagination,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { X, Image as ImageIcon, Upload } from "lucide-react";
import { ImagesGallery } from "@/app/api/training/jobTypes.types";
import { getAllImageGallery } from "@/app/api/iamge-gallery/imagegallery";
import { fetchFileContent } from "../customMethods";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { handleDynamicFileSelected } from "../constatnt";
import { setCurrentElementId, setMediaUrl } from "@/app/redux/user/userSlice";

// Context for managing file inputs
const FileInputContext = createContext<{
  openGallery: (inputId: string) => void;
  selectedFiles: { [key: string]: File } | any;
  setSelectedFile: (inputId: string, file: File) => void;
}>({
  openGallery: () => {},
  selectedFiles: {},
  setSelectedFile: () => {},
});

// Provider component
export const FileInputProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>(
    {}
  );

  const setSelectedFile = (inputId: string, file: File) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [inputId]: file,
    }));
  };

  const openGallery = (inputId: string) => {
    // Will be implemented in the consumer
  };

  return (
    <FileInputContext.Provider
      value={{ openGallery, selectedFiles, setSelectedFile }}
    >
      {children}
    </FileInputContext.Provider>
  );
};

// Custom file input component
interface CustomFileInputProps {
  id: string;
  label?: string;
  onChange?: (file: File) => void;
  className?: string;
  accept?: string;
  required?: boolean;
}

export const CustomFileInput: React.FC<CustomFileInputProps> = ({
  id,
  label,
  onChange,
  className = "",
  accept = "image/*",
  required = false,
}) => {
  const { selectedFiles } = useContext(FileInputContext);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const selectedFile = selectedFiles[id];

  return (
    <>
      <div
        className={`relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-all cursor-pointer ${className}`}
        onClick={() => setIsGalleryOpen(true)}
      >
        {selectedFile ? (
          <div className="flex items-center gap-2">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-12 h-12 object-cover rounded"
            />
            <span className="text-sm text-gray-600">{selectedFile.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {label || "Click to upload or choose from gallery"}
            </p>
          </div>
        )}
      </div>

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onFileSelect={(file) => {
          if (onChange) onChange(file);
        }}
        inputId={id}
      />
    </>
  );
};

// Image Gallery Modal Component
interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  inputId: string;
}

const ITEMS_PER_PAGE = 8;

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  inputId,
}) => {
  const { setSelectedFile } = useContext(FileInputContext);
  const [images, setImages] = useState<ImagesGallery[]>([]);
  const [showGallery, setShowGallery] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isOpen) {
      setShowGallery(false);
      dispatch(setCurrentElementId(null));
    }
  }, [isOpen]);

  const fetchGalleryImages = async () => {
    try {
      const response: any = await getAllImageGallery();
      if (response.remote === "success") {
        setImages(response.data.data);
        dispatch(setMediaUrl(response.data.data));
      }
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
    }
  };

  const handleImageSelect = async (image: ImagesGallery) => {
    const imageDetail: any = images.find((item) => {
      return item._id === (image._id as any);
    });
    if (imageDetail) {
      setSelectedFile(inputId, imageDetail);
      onFileSelect(imageDetail);
      onClose();
    }
  };

  const handleLocalFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(inputId, file);
      onFileSelect(file);
      onClose();
    }
  };

  const handleImageError = (imagePath: string) => {
    setFailedImages((prev) => new Set(prev).add(imagePath));
  };
  useEffect(() => {
    fetchGalleryImages();
  }, []);
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        Select Image
        <IconButton onClick={onClose}>
          <X className="h-4 w-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} className="justify-center pt-4">
          <Button
            variant={showGallery ? "contained" : "outlined"}
            onClick={() => setShowGallery(true)}
            className="w-1/2"
          >
            Azubi Gallery
          </Button>
          <Button
            variant={!showGallery ? "contained" : "outlined"}
            component="label"
            className="w-1/2"
          >
            Choose from Device
            <input
              type="file"
              hidden
              accept="image/*"
              onClick={(e) => {
                e.preventDefault();
                if (elementId) {
                  handleDynamicFileSelected(elementId);
                }
              }}
            />
          </Button>
        </Stack>

        {showGallery && (
          <Box className="mt-6">
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
              {currentImages.map((item: ImagesGallery) => {
                if (item.filepath.includes("gif")) {
                  return;
                }
                return (
                  <Box sx={{ width: "20%", margin: "5px" }} key={item._id}>
                    <Box
                      className="relative overflow-hidden cursor-pointer rounded-lg border hover:border-blue-500 transition-all h-48 w-" // Set fixed height
                      onClick={() =>
                        !failedImages.has(item.filepath) &&
                        handleImageSelect(item)
                      }
                    >
                      {failedImages.has(item.filepath) ? (
                        <div className="flex items-center justify-center bg-gray-100 w-full h-full">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${item.filepath}`}
                          className="w-full h-full object-cover"
                          alt={item.filename}
                          onError={() => handleImageError(item.filepath)}
                          style={{ height: "200px", width: "100%" }}
                        />
                      )}
                    </Box>
                  </Box>
                );
              })}
            </div>
            {totalPages > 1 && (
              <Box className="flex justify-center mt-4">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
