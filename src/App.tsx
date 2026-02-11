import { useState, useEffect, type ChangeEvent } from 'react'
import { loadImage } from './core/imageLoader'
import { toSquareCanvas } from './core/squareNormalizer'
import { TARGET_SIZES } from './core/iconConfig'
import { resizeTo } from './core/resizeEngine'
import { generateZip } from './services/zipService'
import './index.css'

interface ImageMetadata {
  width: number
  height: number
  name: string
}

interface GeneratedIcon {
  size: number
  url: string
  blob: Blob
}

function App() {
  const [hasFile, setHasFile] = useState(false)
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [normalizedUrl, setNormalizedUrl] = useState<string | null>(null)
  const [normalizedCanvas, setNormalizedCanvas] = useState<OffscreenCanvas | null>(null)
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (normalizedUrl) URL.revokeObjectURL(normalizedUrl)
      generatedIcons.forEach(icon => URL.revokeObjectURL(icon.url))
    }
  }, [previewUrl, normalizedUrl, generatedIcons])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Reset state for new file
      setGeneratedIcons([])

      const bitmap = await loadImage(file)

      const newUrl = URL.createObjectURL(file)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(newUrl)

      // Square normalization
      const squareCanvas = await toSquareCanvas(bitmap)
      setNormalizedCanvas(squareCanvas)
      const blob = await squareCanvas.convertToBlob({ type: 'image/png' })
      const newNormalizedUrl = URL.createObjectURL(blob)
      if (normalizedUrl) URL.revokeObjectURL(normalizedUrl)
      setNormalizedUrl(newNormalizedUrl)

      setMetadata({
        width: bitmap.width,
        height: bitmap.height,
        name: file.name
      })
      setHasFile(true)

      console.log('Normalized to:', squareCanvas.width, 'x', squareCanvas.height)
      bitmap.close()
    } catch (err) {
      console.error(err)
      alert('Failed to process image.')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const syntheticEvent = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>
      handleFileChange(syntheticEvent)
    }
  }

  const generateIcons = async () => {
    if (!normalizedCanvas || !metadata) return

    setIsGenerating(true)
    const icons: GeneratedIcon[] = []
    const sourceSize = Math.max(metadata.width, metadata.height)

    try {
      for (const size of TARGET_SIZES) {
        if (sourceSize >= size) {
          console.log(`Generating ${size}px icon...`)
          const blob = await resizeTo(normalizedCanvas, size)
          const url = URL.createObjectURL(blob)
          icons.push({ size, blob, url })
        } else {
          console.log(`Skipping ${size}px icon (source is smaller)`)
        }
      }
      setGeneratedIcons(icons)
    } catch (err) {
      console.error('Generation failed:', err)
      alert('Failed to generate icons.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadIcon = (icon: GeneratedIcon) => {
    const a = document.createElement('a')
    a.href = icon.url
    a.download = `icon-${icon.size}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleZipDownload = async () => {
    if (generatedIcons.length === 0) return
    setIsGenerating(true)
    try {
      const zipBlob = await generateZip(generatedIcons)
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'icon-suite.zip'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('ZIP failed:', err)
      alert('Failed to generate ZIP.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Icon Shrinker</h1>
        <p className="subtitle">Generate production-ready icon sizes. Downscale only.</p>
      </header>

      <main className="card">
        <label
          htmlFor="file-upload"
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="upload-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p>{hasFile ? metadata?.name : 'Drop an image or click to upload'}</p>
        </label>

        {metadata && metadata.width < 512 && (
          <div className="low-res-warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Source is low-res ({metadata.width}px). Some sizes will be skipped to prevent quality loss.</span>
          </div>
        )}

        <section className="preview-area">
          {!hasFile && <p>Preview area will appear here after upload</p>}
          {hasFile && previewUrl && normalizedUrl && (
            <div className="preview-content">
              <div className="preview-grid">
                <div className="preview-item">
                  <p className="label">Original</p>
                  <div className="image-wrapper original">
                    <img src={previewUrl} alt="Original" className="image-preview" />
                  </div>
                  <div className="metadata-badge secondary">
                    {metadata?.width} × {metadata?.height}
                  </div>
                </div>

                <div className="preview-item">
                  <p className="label">Normalized (Square)</p>
                  <div className="image-wrapper normalized">
                    <img src={normalizedUrl} alt="Normalized" className="image-preview" />
                  </div>
                  <div className="metadata-badge">
                    {Math.max(metadata?.width || 0, metadata?.height || 0)} × {Math.max(metadata?.width || 0, metadata?.height || 0)}
                  </div>
                </div>
              </div>

              <div className="actions">
                <button
                  className="button primary"
                  onClick={generateIcons}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Forging Icons...' : 'Generate Icon Suite'}
                </button>
              </div>
            </div>
          )}
        </section>

        {generatedIcons.length > 0 && (
          <section className="results-area">
            <div className="results-header">
              <h2 className="section-title">Forged Icons</h2>
              <button
                className="button secondary sm"
                onClick={handleZipDownload}
                disabled={isGenerating}
              >
                {isGenerating ? 'Packing...' : 'Download All (ZIP)'}
              </button>
            </div>
            <div className="results-grid">
              {TARGET_SIZES.map(size => {
                const icon = generatedIcons.find(i => i.size === size);
                const isAvailable = !!icon;

                return (
                  <div key={size} className={`result-item ${isAvailable ? '' : 'unavailable'}`}>
                    <div className="result-preview">
                      {isAvailable ? (
                        <img src={icon.url} alt={`${size}px icon`} />
                      ) : (
                        <div className="unavailable-placeholder">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="result-meta">
                      <p className="result-label">{size}px</p>
                      {isAvailable ? (
                        <button
                          className="icon-download-btn"
                          onClick={() => downloadIcon(icon)}
                          title={`Download ${size}px`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                      ) : (
                        <span className="small-status">Too Small</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>Deterministic. Client-side. Privacy-focused.</p>
      </footer>
    </div>
  )
}

export default App
