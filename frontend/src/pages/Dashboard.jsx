import { useEffect, useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getAnalysisHistory } from "@/services/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { notifications } = useAppStore()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const activeAlerts = notifications.filter(n => !n.read).length

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getAnalysisHistory();
        setHistory(data.reverse()); // Assume older to newer for chart
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory()
  }, [])

  const healthyFruits = history.filter((h) => (h.result?.disease || "") === "Healthy").length;
  const healthRatio = history.length ? Math.round((healthyFruits / history.length) * 100) : 0;
  const avgScore = history.length ? Math.round(history.reduce((acc, curr) => acc + (curr.result?.nutrition?.nutritional_score || 0), 0) / history.length) : 0;
  
  // Format history for chart
  const chartData = history.map(h => ({
    date: new Date(h.created_at).toLocaleDateString(),
    score: h.result?.nutrition?.nutritional_score || 0
  })).reverse();

  return (
    <div className="container py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Analyses</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-foreground">{loading ? "..." : history.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Healthy Fruits %</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-brand-success">{loading ? "..." : `${healthRatio}%`}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Average Nutritional Score</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-primary">{loading ? "..." : avgScore}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-destructive">{activeAlerts}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Nutritional Score Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                    <Line type="monotone" dataKey="score" stroke="#8B1A1A" strokeWidth={3} dot={{ r: 4, fill: '#8B1A1A' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Farm Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg overflow-hidden border h-32 relative">
              <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">Map View Unavailable</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Location</span><span className="font-medium text-sm">Solapur, Maharashtra</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Cultivar</span><span className="font-medium text-sm">Bhagwa</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Total Area</span><span className="font-medium text-sm">12 Acres</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-md">Date</th>
                  <th className="px-4 py-3 font-medium">Disease Detected</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium text-right">Score</th>
                  <th className="px-4 py-3 font-medium rounded-tr-md">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => {
                  const disease = item.result?.disease || "Unknown";
                  const severity = item.result?.severity || "None";
                  const score = item.result?.nutrition?.nutritional_score || 0;
                  const date = new Date(item.created_at).toLocaleDateString();
                  
                  return (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">{date}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{disease.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3">
                        <Badge variant={severity === "None" ? "success" : severity === "Severe" ? "destructive" : "warning"}>
                          {severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">{score}</td>
                      <td className="px-4 py-3 text-muted-foreground cursor-pointer hover:underline" onClick={() => window.location.href=`/scan/${item.id}`}>View Analysis</td>
                    </tr>
                  )
                })}
                {history.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-muted-foreground">No analyses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
