import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export const QRCodeDownload = ({ value, fileName = "qrcode", displaySize = 40 }: { value: string; fileName?: string; displaySize?: number }) => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${fileName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <Box 
        onClick={() => setOpen(true)}
        sx={{ 
           width: displaySize, 
           height: displaySize, 
           cursor: "pointer", 
           overflow: "hidden", 
           borderRadius: "8px", 
           border: "1px solid #e0e0e0",
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
           transition: "all 0.2s",
           "&:hover": {
             borderColor: "#0096A4",
             boxShadow: "0 4px 12px rgba(0,150,164,0.15)",
             transform: "translateY(-1px)",
           }
        }}
      >
        <QRCodeCanvas
          value={value}
          size={1024} // High resolution for download
          level={"H"}
          includeMargin={true}
          ref={qrRef}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", color: "#07575A", fontWeight: 600 }}>View QR Code</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
          <QRCodeCanvas
            value={value}
            size={250}
            level={"H"}
            includeMargin={true}
            style={{ borderRadius: "8px", border: "1px solid #ddd" }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
          <Button variant="outlined" onClick={() => setOpen(false)} sx={{ color: "#666", borderColor: "#ccc" }}>
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={downloadQR} 
            startIcon={<DownloadIcon />}
            sx={{ backgroundColor: "#0096A4", "&:hover": { backgroundColor: "#007a86" } }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
