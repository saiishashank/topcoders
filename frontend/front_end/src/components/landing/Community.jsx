"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Users, Star } from "lucide-react";
import { platformData, topCoders } from "@/lib/data.js";

export function Community() {
  return (
    <section id="community" className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Join a Global Community</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Connect with competitive programmers from around the world. Share strategies, discuss problems, and grow
            together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Platform Distribution
              </CardTitle>
              {/* <CardDescription>Active users across different platforms</CardDescription> */}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rating" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Top Contributors
              </CardTitle>
              <CardDescription>Leading members of our community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCoders.map((coder, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-sm font-medium w-6">#{index + 1}</div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={coder.avatar || "/placeholder.svg"} alt={coder.name} />
                    <AvatarFallback>
                      {coder.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{coder.name}</div>
                    <div className="text-sm text-muted-foreground">{coder.country}</div>
                  </div>
                  <Badge variant="secondary">{coder.rating}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}