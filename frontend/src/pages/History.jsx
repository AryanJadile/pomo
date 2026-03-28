import { useEffect, useState } from "react"
import { getAnalysisHistory, deleteScan } from "@/services/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, Calendar, Leaf } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const data = await getAnalysisHistory()
      setHistory(data)
    } catch (err) {
      toast.error("Failed to fetch history")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this scan?")) return
    try {
      await deleteScan(id)
      toast.success("Scan deleted")
      fetchHistory()
    } catch (err) {
      toast.error("Failed to delete scan")
    }
  }

  return (
    <div className="container py-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
      </div>
      
      {loading ? (
        <div className="text-muted-foreground text-center py-10">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border rounded-lg">
          <Leaf className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
          <h2 className="text-xl font-medium">No Scans Found</h2>
          <p className="text-muted-foreground mt-2 mb-4">You haven't performed any fruit analyses yet.</p>
          <Button onClick={() => navigate('/analyse')}>Run a Scan</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((scan) => {
            const disease = scan.result?.disease || "Unknown"
            const severity = scan.result?.severity || "None"
            const score = scan.result?.nutrition?.nutritional_score || 0
            const date = new Date(scan.created_at).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            })
            
            return (
              <Card key={scan.id} className="cursor-pointer hover:shadow-md transition-shadow group overflow-hidden" onClick={() => navigate(`/scan/${scan.id}`)}>
                <div className="h-48 w-full bg-muted border-b relative">
                  <img src={scan.media_url} alt={disease} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="pointer-events-none"><Eye className="h-4 w-4 mr-2"/>View Details</Button>
                  </div>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-foreground line-clamp-1">{disease.replace(/_/g, " ")}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" /> {date}
                      </div>
                    </div>
                    <Badge variant={severity === "None" ? "success" : severity === "Severe" ? "destructive" : "warning"}>
                      {severity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t text-sm">
                    <div>
                      <span className="text-muted-foreground">Score: </span>
                      <span className="font-bold">{score} / 100</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive z-10" onClick={(e) => handleDelete(scan.id, e)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
