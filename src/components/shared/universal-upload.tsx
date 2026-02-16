'use client'

import { useRef, useState } from 'react'
import { Upload, X, CheckCircle2, Clock, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface UniversalUploadProps {
    module: 'consumer' | 'institution' | 'analyst'
    title?: string
    description?: string
    accept?: string
}

export function UniversalUpload({ module, title, description, accept = ".pdf,.csv,.json" }: UniversalUploadProps) {
    const [files, setFiles] = useState<any[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const config = {
        consumer: {
            title: title || "Upload Financial Statements",
            description: description || "Upload PDFs or CSVs for AI analysis",
            buttonColor: "bg-emerald-500 hover:bg-emerald-600",
            icon: FileText
        },
        institution: {
            title: title || "Bulk Portfolio Audit",
            description: description || "Import large transaction sets for institutional scoring",
            buttonColor: "bg-blue-500 hover:bg-blue-600",
            icon: Upload
        },
        analyst: {
            title: title || "Client Research Data",
            description: description || "Upload proprietary data for custom reporting",
            buttonColor: "bg-indigo-500 hover:bg-indigo-600",
            icon: CheckCircle2
        }
    }

    const moduleConfig = config[module]

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return

        Array.from(selectedFiles).forEach(file => {
            const newFile = {
                id: Math.random().toString(36).substring(7),
                name: file.name,
                size: file.size,
                status: 'completed', // For showcase, we just "complete" it
                timestamp: new Date()
            }
            setFiles(prev => [newFile, ...prev])
        })
    }

    return (
        <Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <moduleConfig.icon className="h-5 w-5 text-muted-foreground" />
                    {moduleConfig.title}
                </CardTitle>
                <CardDescription>{moduleConfig.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div
                    className={cn(
                        'rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer group',
                        isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                    )}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files) }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-foreground">Drop files or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">Accepts {accept}</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept={accept}
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />
                </div>

                {files.length > 0 && (
                    <div className="space-y-2 mt-4 max-h-[200px] overflow-y-auto pr-2">
                        {files.map((file) => (
                            <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {file.timestamp.toLocaleTimeString()}</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Success</Badge>
                            </div>
                        ))}
                    </div>
                )}

                <Button className={cn("w-full transition-all active:scale-[0.98]", moduleConfig.buttonColor)}>
                    Processing System Active
                </Button>
            </CardContent>
        </Card>
    )
}
