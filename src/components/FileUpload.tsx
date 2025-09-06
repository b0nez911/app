import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onContentExtracted: (content: string) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string;
  status: 'uploading' | 'success' | 'error';
}

const FileUpload: React.FC<FileUploadProps> = ({ onContentExtracted }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const acceptedTypes = [
    '.txt', '.rtf', '.doc', '.docx', '.pdf',
    'text/plain', 'application/rtf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
  ];

  const handleFileUpload = async (fileList: FileList) => {
    const userId = localStorage.getItem('user_email') || 'demo_user';
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      const isValidType = acceptedTypes.some(type => 
        file.type === type || file.name.toLowerCase().endsWith(type)
      );
      
      if (!isValidType) continue;

      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading'
      };

      setFiles(prev => [...prev, newFile]);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        const { data, error } = await supabase.functions.invoke('parse-document', {
          body: formData,
        });

        if (error) {
          console.error('Edge function error:', error);
          throw new Error(`Edge function failed: ${error.message || 'Unknown error'}`);
        }

        if (!data) {
          throw new Error('No data returned from edge function');
        }
        // Skip database storage due to RLS policy restrictions
        // Store content in localStorage as fallback
        const storedDocs = JSON.parse(localStorage.getItem('user_documents') || '[]');
        storedDocs.push({
          id: Date.now(),
          user_id: userId,
          filename: data.filename,
          file_type: data.fileType,
          file_size: data.fileSize,
          content: data.content,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('user_documents', JSON.stringify(storedDocs));

        setFiles(prev => prev.map(f => 
          f.name === file.name 
            ? { ...f, status: 'success', content: data.content }
            : f
        ));

        onContentExtracted(data.content);

      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'error' } : f
        ));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <div className="space-y-4">
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50/10' 
            : 'border-slate-600 bg-slate-700/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Supports: TXT, RTF, DOC, DOCX, PDF
          </p>
          <Input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <Button 
            asChild 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <File className="w-4 h-4 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {file.status === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              {file.status === 'uploading' && (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(file.name)}
                className="p-1 h-auto text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;