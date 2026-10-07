
'use client';

import { useState } from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Users, TrendingUp, MousePointerClick, TrendingDown, Link, Power, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const analyticsData = {
  stats: [
    { name: "Total Visitors", value: "12,402", change: "+12.5%", icon: Users },
    { name: "Avg. Session", value: "2m 18s", change: "-2.1%", icon: MousePointerClick },
    { name: "Bounce Rate", value: "42.8%", change: "+5.3%", icon: TrendingDown },
    { name: "Conversion Rate", value: "4.2%", change: "+8.0%", icon: TrendingUp },
  ],
  pageViewsChart: [
    { date: "Jan 1", desktop: 222, mobile: 150 },
    { date: "Jan 2", desktop: 254, mobile: 180 },
    { date: "Jan 3", desktop: 219, mobile: 190 },
    { date: "Jan 4", desktop: 283, mobile: 210 },
    { date: "Jan 5", desktop: 301, mobile: 250 },
    { date: "Jan 6", desktop: 245, mobile: 210 },
    { date: "Jan 7", desktop: 321, mobile: 280 },
  ],
  trafficSourcesChart: [
    { source: "Google", visitors: 450, fill: "var(--color-google)" },
    { source: "X.com", visitors: 280, fill: "var(--color-twitter)" },
    { source: "Direct", visitors: 220, fill: "var(--color-direct)" },
    { source: "LinkedIn", visitors: 180, fill: "var(--color-linkedin)" },
    { source: "Other", visitors: 90, fill: "var(--color-other)" },
  ],
};

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  google: { label: "Google", color: "hsl(var(--chart-3))" },
  twitter: { label: "X.com", color: "hsl(var(--chart-4))" },
  direct: { label: "Direct", color: "hsl(var(--chart-5))" },
  linkedin: { label: "LinkedIn", color: "hsl(var(--chart-1))" },
  other: { label: "Other", color: "hsl(var(--chart-2))" },
};

function ConnectingLoader() {
  return (
      <div className="flex flex-col items-center justify-center gap-4 text-center p-8 transition-opacity duration-500 animate-fade-in">
        <div className="relative flex items-center justify-center h-20 w-20">
          <div className="absolute h-full w-full bg-primary/20 rounded-full animate-ping delay-500"></div>
          <div className="relative bg-background rounded-full p-4 shadow-inner flex items-center justify-center">
            <Image
              src="https://digitiful.net/wp-content/uploads/elementor/thumbs/DG-05-1-r9tunke78cyiykbizacfpfcdwqz7outsg8xjrtvb4a.png"
              alt="Digitiful Logo"
              width={36}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </div>
        </div>
        <p className="text-muted-foreground animate-pulse">Connecting account...</p>
      </div>
  )
}

export function AnalyticsCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate API call for authentication
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  if (!isConnected) {
    return (
      <Card className="bg-card/50 border-none">
        <CardContent className="flex flex-col items-center justify-center text-center p-12 min-h-[500px]">
           {isConnecting ? (
            <ConnectingLoader />
           ) : (
            <>
              <div className="relative h-24 w-24 mb-4">
                <Image 
                    src="https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg"
                    alt="Google Analytics Logo"
                    fill
                    className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Connect to Google Analytics</h3>
              <p className="mt-2 text-muted-foreground max-w-md">
                Link your Google Analytics account to view your website's performance data directly in your dashboard.
              </p>
              <Button onClick={handleConnect} disabled={isConnecting} className="mt-6">
                <Link className="mr-2 h-4 w-4" />
                Connect Google Account
              </Button>
            </>
           )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-none">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-2xl font-bold">Website Analytics</CardTitle>
          <CardDescription>An overview of your website's performance for the last 7 days.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDisconnect}>
          <Power className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {analyticsData.stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Page Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Page Views</CardTitle>
              <CardDescription>Desktop vs. Mobile page views over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <LineChart data={analyticsData.pageViewsChart} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 6)} />
                  <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
                  <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Traffic Sources Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Traffic Sources</CardTitle>
              <CardDescription>Visitors by traffic source over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <BarChart data={analyticsData.trafficSourcesChart} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <YAxis dataKey="source" type="category" tickLine={false} axisLine={false} tickMargin={8} width={80} />
                  <XAxis type="number" hide />
                  <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="visitors" radius={5} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
