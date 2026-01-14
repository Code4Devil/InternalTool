import React, { useState } from 'react';
import { uploadTaskAttachment, supabase } from '../lib/supabase';
import Icon from './AppIcon';
import Button from './ui/Button';

const FileUploadComponent = ({ taskId, projectId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 10;
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip', 'application/x-zip-compressed',
    'text/plain', 'text/csv'
  ];

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} exceeds 10MB limit`;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `${file.name} has unsupported file type`;
    }
    return null;
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length > MAX_FILES) {
      setErrors([`Maximum ${MAX_FILES} files allowed`]);
      return;
    }

    const validationErrors = fileArray
      .map(validateFile)
      .filter(Boolean);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setUploading(true);

    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        try {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 0
          }));

          // Upload file
          const { path } = await uploadTaskAttachment({
            projectId,
            taskId,
            file,
            upsert: false
          });

          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100
          }));

          // Save metadata
          const { error: metaError } = await supabase
            .from('task_attachments')
            .insert({
              task_id: taskId,
              file_name: file.name,
              file_path: path,
              file_size: file.size,
              file_type: file.type,
              uploaded_by: (await supabase.auth.getSession()).data.session?.user.id,
              uploaded_at: new Date().toISOString(),
            });

          if (metaError) throw metaError;

          return { success: true, file: file.name };
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          return { success: false, file: file.name, error: error.message };
        }
      });

      const results = await Promise.all(uploadPromises);
      
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        setErrors(failed.map(f => `${f.file}: ${f.error}`));
      }

      const succeeded = results.filter(r => r.success);
      if (succeeded.length > 0) {
        onUploadComplete?.();
      }

      setTimeout(() => {
        setUploadProgress({});
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors(['Upload failed. Please try again.']);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleChange}
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Icon
            name="Upload"
            size={48}
            className="text-muted-foreground mb-4"
          />
          <p className="text-sm font-medium text-foreground mb-1">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Max {MAX_FILES} files, 10MB each. Images, PDFs, Documents, Archives
          </p>
        </label>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground truncate flex-1">
                  {fileName}
                </span>
                <span className="text-muted-foreground ml-2">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Icon name="AlertCircle" size={16} color="var(--color-error)" />
            <div className="flex-1">
              {errors.map((error, i) => (
                <p key={i} className="text-xs text-error">
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
