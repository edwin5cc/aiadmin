import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Download, Eye, EyeOff } from 'lucide-react';

interface FileViewerProps {
  fileUrl: string;
  fileName: string;
  fileType?: string;
  showInline?: boolean;
}

const FileViewer: React.FC<FileViewerProps> = ({ 
  fileUrl, 
  fileName, 
  fileType,
  showInline = false 
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showInlineContent, setShowInlineContent] = useState(showInline);

  // Determine file type from URL or fileName
  const getFileType = () => {
    if (fileType) return fileType;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    const urlExtension = fileUrl.split('.').pop()?.toLowerCase();
    const ext = extension || urlExtension || '';
    
    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
      return 'image';
    }
    
    // Document types
    if (['pdf'].includes(ext)) {
      return 'pdf';
    }
    
    // Text types
    if (['txt', 'md', 'json', 'xml', 'csv'].includes(ext)) {
      return 'text';
    }
    
    // Video types
    if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(ext)) {
      return 'video';
    }
    
    // Audio types
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) {
      return 'audio';
    }
    
    return 'unknown';
  };

  const detectedFileType = getFileType();

  const renderFileContent = () => {
    switch (detectedFileType) {
      case 'image':
        return (
          <div className="max-w-full max-h-96 overflow-auto">
            <img 
              src={fileUrl} 
              alt={fileName}
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-center p-4 text-slate-500">
              <p>Unable to load image</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(fileUrl, '_blank')}
                className="mt-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in new tab
              </Button>
            </div>
          </div>
        );
        
      case 'pdf':
        return (
          <div className="w-full h-96">
            <iframe
              src={fileUrl}
              className="w-full h-full border rounded-lg"
              title={fileName}
              onError={() => {
                // Fallback for PDFs that can't be embedded
                return (
                  <div className="text-center p-4">
                    <p className="text-slate-500 mb-2">PDF cannot be displayed inline</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(fileUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open PDF
                    </Button>
                  </div>
                );
              }}
            />
          </div>
        );
        
      case 'text':
        return (
          <div className="w-full h-96 overflow-auto">
            <iframe
              src={fileUrl}
              className="w-full h-full border rounded-lg"
              title={fileName}
            />
          </div>
        );
        
      case 'video':
        return (
          <div className="w-full max-w-2xl">
            <video 
              controls 
              className="w-full h-auto rounded-lg"
              preload="metadata"
            >
              <source src={fileUrl} type={`video/${fileName.split('.').pop()}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
        
      case 'audio':
        return (
          <div className="w-full max-w-md">
            <audio 
              controls 
              className="w-full"
              preload="metadata"
            >
              <source src={fileUrl} type={`audio/${fileName.split('.').pop()}`} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
        
      default:
        return (
          <div className="text-center p-8">
            <div className="text-slate-400 mb-4">
              <ExternalLink className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-slate-600 mb-4">Preview not available for this file type</p>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => window.open(fileUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open File
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = fileUrl;
                  link.download = fileName;
                  link.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        );
    }
  };

  const renderInlineContent = () => {
    if (!showInlineContent) return null;
    
    return (
      <div className="mt-4 p-4 border rounded-lg bg-slate-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-700">File Preview</h4>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInlineContent(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsViewerOpen(true)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Full View
            </Button>
          </div>
        </div>
        {renderFileContent()}
      </div>
    );
  };

  return (
    <>
      {/* Inline content */}
      {renderInlineContent()}
      
      {/* Toggle button for inline view */}
      {!showInlineContent && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInlineContent(true)}
            className="text-green-600 hover:text-green-700"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(fileUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      )}
      
      {/* Full-screen modal */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{fileName}</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = fileName;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(fileUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open in new tab
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {renderFileContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileViewer;
