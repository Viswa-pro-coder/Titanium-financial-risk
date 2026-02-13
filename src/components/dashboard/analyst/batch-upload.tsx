'use client'

import { useRef, useState } from 'react'
import { Upload, X, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'

interface FileUpload {
  id: string
  name: string
  size: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  recordsCount?: number
  progress?: number
  url?: string
}

export function BatchUpload() {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileUpload[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const generateFileId = () => {
    return Math.random().toString(36).substring(2, 11)
  }

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    if (!user) {
      alert("Please log in to upload files.");
      return;
    }

    const storage = getStorage(app);

    Array.from(selectedFiles).forEach((file) => {
      const fileId = generateFileId();
      const newFile: FileUpload = {
        id: fileId,
        name: file.name,
        size: file.size,
        status: 'pending',
        progress: 0,
      }

      setFiles((prev) => [...prev, newFile])

      // Start Real Upload
      const storageRef = ref(storage, `csv-uploads/${user.uid}/${fileId}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'uploading' } : f));

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: progress } : f));
        },
        (error) => {
          console.error("Upload error:", error);
          setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error' } : f));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Upload complete, mark as processing (simulated backend trigger)
            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'processing', progress: 100, url: downloadURL } : f));

            // Simulate backend processing time
            setTimeout(() => {
              setFiles(prev => prev.map(f =>
                f.id === fileId ? {
                  ...f,
                  status: 'completed',
                  recordsCount: Math.floor(Math.random() * 500) + 1  // Mock record count
                } : f
              ));
            }, 2000);
          });
        }
      );
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    // Note: cancellation of active upload task not implemented for brevity
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'processing':
      case 'uploading':
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'error':
        return <X className="h-5 w-5 text-rose-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/50'
      case 'processing':
      case 'uploading':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/50'
      case 'pending':
        return 'bg-amber-500/20 text-amber-700 border-amber-500/50'
      case 'error':
        return 'bg-rose-500/20 text-rose-700 border-rose-500/50'
      default:
        return ''
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Batch Data Upload</CardTitle>
        <CardDescription>Import customer data via CSV</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={cn(
            'rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFileSelect(e.dataTransfer.files)
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="font-medium text-foreground">Drop files here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">
            CSV files up to 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Recent Uploads ({files.length})
            </p>
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/50"
              >
                {getStatusIcon(file.status)}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    {file.recordsCount && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                          {file.recordsCount} records
                        </p>
                      </>
                    )}
                  </div>

                  {file.progress !== undefined && file.progress < 100 && (
                    <div className="w-full h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'capitalize text-xs font-medium border-0',
                      getStatusBadge(file.status)
                    )}
                  >
                    {file.status}
                  </Badge>
                  {file.status !== 'uploading' && file.status !== 'processing' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {/* Simulate clicking the hidden input when "Upload Files" is clicked if no files selected, 
               or just act as a trigger. For now, disabling if no files or just leaving as UI actions. */}
          <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => fileInputRef.current?.click()}>
            Select Files
          </Button>
          <Button variant="outline" className="flex-1">
            Download Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
