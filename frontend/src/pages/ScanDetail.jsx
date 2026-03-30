import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getScan, downloadReport } from "@/services/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Leaf, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import ChatBot from '../components/ChatBot'

export default function ScanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scan, setScan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    async function fetchScan() {
      try {
        const data = await getScan(id)
        setScan(data)
      } catch (err) {
        console.error("Failed to load scan", err)
      } finally {
        setLoading(false)
      }
    }
    fetchScan()
  }, [id])

  const handleDownloadReport = async () => {
    setDownloading(true)
    try {
      toast.info("Generating PDF report — this may take a few seconds...")
      await downloadReport(id)
      toast.success("Report downloaded successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate report. Please ensure the backend is running.")
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <div className="p-10 text-center">Loading scan details...</div>
  if (!scan) return <div className="p-10 text-center">Scan not found.</div>

  const { result, input_data, created_at, media_url } = scan
  const disease = result?.disease || "Unknown"
  const severity = result?.severity || "None"
  const nutrition = result?.nutrition || {}
  const date = new Date(created_at).toLocaleString()

  return (
    <div className="container py-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-3">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button
          onClick={handleDownloadReport}
          disabled={downloading}
          className="gap-2 shadow-sm"
        >
          {downloading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...</>
            : <><Download className="h-4 w-4" /> Download Report</>}
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Col - Media & Context */}
        <div className="w-full md:w-5/12 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-64 sm:h-80 w-full bg-muted">
              <img src={media_url} alt={disease} className="w-full h-full object-cover" />
            </div>
          </Card>
          
          <Card>
            <CardHeader className="pb-3"><CardTitle>Context & Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Date</div>
                  <div className="font-medium text-sm">{date}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Type</div>
                  <div className="font-medium text-sm capitalize">{scan.scan_type.replace('_', ' ')}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground uppercase mb-2">Environmental Inputs</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-muted p-2 rounded">
                    <div className="text-[10px] text-muted-foreground">Solar Rad (W/m²)</div>
                    <div className="font-medium">{input_data?.uv_irradiance || 'N/A'}</div>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <div className="text-[10px] text-muted-foreground">Hum (%)</div>
                    <div className="font-medium">{input_data?.humidity || 'N/A'}</div>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <div className="text-[10px] text-muted-foreground">Temp (°C)</div>
                    <div className="font-medium">{input_data?.temperature || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Results */}
        <div className="w-full md:w-7/12 space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Analysis Results</h1>
          
          <Card>
             <CardHeader className="pb-3 border-b"><CardTitle>1. Disease Status</CardTitle></CardHeader>
             <CardContent className="pt-5 flex items-center justify-between">
               <div>
                 <h2 className="text-2xl font-bold">{disease.replace(/_/g, ' ')}</h2>
                 <p className="text-muted-foreground mt-1">Confidence: {scan.confidence_score ? `${scan.confidence_score}%` : 'N/A'}</p>
               </div>
               <Badge variant={severity === "None" ? "success" : severity === "Severe" ? "destructive" : "warning"} className="text-sm px-3 py-1">
                 {severity}
               </Badge>
             </CardContent>
          </Card>
          
          <Card>
             <CardHeader className="pb-3 border-b"><CardTitle>2. Nutritional Scorecard</CardTitle></CardHeader>
             <CardContent className="pt-5 flex gap-8 items-center">
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-muted/50" />
                    <circle 
                      cx="56" cy="56" r="48" fill="transparent" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={301.59} 
                      strokeDashoffset={301.59 - (301.59 * (nutrition?.nutritional_score || 0) / 100)}
                      className={nutrition?.nutritional_score >= 80 ? "text-brand-success" : nutrition?.nutritional_score >= 60 ? "text-amber-500" : "text-destructive"} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold">{nutrition?.nutritional_score || 0}</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Anthocyanins</span><span className="font-medium">{nutrition?.anthocyanins || 0} mg</span></div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-[#8E44AD]" style={{width: `${Math.min(100, ((nutrition?.anthocyanins || 0)/20)*100)}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Punicalagins</span><span className="font-medium">{nutrition?.punicalagins || 0} mg</span></div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-[#C0392B]" style={{width: `${Math.min(100, ((nutrition?.punicalagins || 0)/200)*100)}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Ellagic Acid</span><span className="font-medium">{nutrition?.ellagic_acid || 0} mg</span></div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-[#E67E22]" style={{width: `${Math.min(100, ((nutrition?.ellagic_acid || 0)/15)*100)}%`}}></div></div>
                  </div>
                </div>
             </CardContent>
          </Card>
          
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-lg border flex gap-4">
             <Leaf className="h-5 w-5 text-emerald-600 mt-0.5" />
             <div>
               <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Advisory</h3>
               <p className="text-sm text-emerald-900 dark:text-emerald-100/90 mt-1">
                 Quality Tier: <strong>{nutrition?.quality_tier || 'N/A'}</strong>. Based on these parameters, this fruit exhibits qualities characteristic of {severity === 'None' ? 'optimal health' : `a crop impacted by ${disease.replace(/_/g, ' ')}`}.
                 {severity === 'Severe' && ' Immediate mitigation is recommended.'}
               </p>
             </div>
          </div>
          
        </div>
      </div>
      <ChatBot scanId={scan.id} scanData={scan} />
    </div>
  )
}
