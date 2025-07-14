"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, GitPullRequest } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DashboardStats {
  totalReviews: number
  bugsFound: number
  securityIssues: number
  avgComplexity: number
  recentReviews: Array<{
    id: string
    filename: string
    timestamp: string
    model: string
    issues: number
    status: "completed" | "in-progress" | "failed"
  }>
}

export default function ReviewDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchStats = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockStats: DashboardStats = {
        totalReviews: 247,
        bugsFound: 89,
        securityIssues: 23,
        avgComplexity: 6.8,
        recentReviews: [
          {
            id: "1",
            filename: "auth_service.py",
            timestamp: "2024-01-15 14:30",
            model: "GPT-4",
            issues: 5,
            status: "completed",
          },
          {
            id: "2",
            filename: "data_processor.js",
            timestamp: "2024-01-15 13:45",
            model: "CodeLlama",
            issues: 2,
            status: "completed",
          },
          {
            id: "3",
            filename: "user_controller.py",
            timestamp: "2024-01-15 12:20",
            model: "GPT-4",
            issues: 8,
            status: "completed",
          },
          {
            id: "4",
            filename: "api_routes.py",
            timestamp: "2024-01-15 11:15",
            model: "Claude-3",
            issues: 3,
            status: "in-progress",
          },
          {
            id: "5",
            filename: "database.py",
            timestamp: "2024-01-15 10:30",
            model: "GPT-4",
            issues: 12,
            status: "failed",
          },
        ],
      }

      setStats(mockStats)
      setIsLoading(false)
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugs Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.bugsFound}</div>
            <p className="text-xs text-muted-foreground">Across all reviewed code</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.securityIssues}</div>
            <p className="text-xs text-muted-foreground">Critical vulnerabilities detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Complexity</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.avgComplexity}/10</div>
            <Progress value={stats.avgComplexity * 10} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5" />
            Recent Reviews
          </CardTitle>
          <CardDescription>Latest code reviews and their analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(review.status)}
                    <Badge variant={getStatusColor(review.status)}>{review.status}</Badge>
                  </div>
                  <div>
                    <p className="font-medium">{review.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.timestamp} • {review.model}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{review.issues} issues</p>
                  <p className="text-sm text-muted-foreground">found</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Usage Distribution</CardTitle>
            <CardDescription>AI models used for code reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>GPT-4</span>
                <span>65%</span>
              </div>
              <Progress value={65} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>CodeLlama</span>
                <span>20%</span>
              </div>
              <Progress value={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Claude-3</span>
                <span>15%</span>
              </div>
              <Progress value={15} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Categories</CardTitle>
            <CardDescription>Types of issues found in reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Code Quality</span>
                <span>45%</span>
              </div>
              <Progress value={45} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Security</span>
                <span>30%</span>
              </div>
              <Progress value={30} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Performance</span>
                <span>25%</span>
              </div>
              <Progress value={25} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
