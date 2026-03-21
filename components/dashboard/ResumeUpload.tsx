'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { processResume } from '@/app/actions/resume';

export function ResumeUpload({ jobId }: { jobId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'parsing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const fileId = `${file.name}-${file.size}`;
    if (uploadedFiles.has(fileId)) {
      setStatus('error');
      setErrorMessage('You have already uploaded this resume.');
      return;
    }

    try {
      if (file.size > 10 * 1024 * 1024) {
        setStatus('error');
        setErrorMessage('File exceeds the 10MB limit. Please upload a smaller file.');
        return;
      }

      setStatus('uploading');
      setErrorMessage(null);
      
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobId', jobId);

      // Total time usually takes 5-15s due to AI processing
      // We'll simulate a transition to 'parsing' after a bit of upload time
      // or just stay in 'uploading' then 'parsing' based on the action progress
      // Since Server Actions are one-shot, we'll just set to 'parsing' after the call starts
      const uploadPromise = processResume(formData);
      
      // Give it a second to "upload" before showing "analyzing"
      setTimeout(() => setStatus('parsing'), 1000);

      const result = await uploadPromise;

      if (result.success) {
        setStatus('success');
        setUploadedFiles(prev => new Set(prev).add(fileId));
      } else {
        throw new Error('Processing failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong during screening.');
    }
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950 p-12 text-center">
      {!file ? (
        <div className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
            <Upload className="h-6 w-6 text-zinc-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Upload Resume</p>
            <p className="text-sm text-zinc-500">Support PDF, DOCX up to 10MB</p>
          </div>
          <div className="inline-block cursor-pointer">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Select File</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4 max-w-md mx-auto">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{file.name}</p>
              <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {status === 'idle' && (
              <button onClick={() => setFile(null)} className="text-zinc-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            {status === 'idle' && (
              <Button onClick={handleUpload} className="w-full max-w-md">Start AI Screening</Button>
            )}
            
            {(status === 'uploading' || status === 'parsing') && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm font-medium text-zinc-300">
                  {status === 'uploading' ? 'Uploading to storage...' : 'AI is analyzing resume...'}
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <p className="text-lg font-semibold text-white">Screening Complete!</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setFile(null); setStatus('idle'); }}>Upload Another</Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20 max-w-md">
                   <p className="text-sm font-medium text-red-400">{errorMessage || 'An error occurred during screening.'}</p>
                </div>
                <Button variant="outline" onClick={() => setStatus('idle')}>Try Again</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
