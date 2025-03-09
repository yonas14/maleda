import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search articles..." className="pl-8" />
          </div>
        </CardContent>
      </Card>

      {/* Staff Picks */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Trending Now</h3>
          <ul className="space-y-4">
            <li className="group">
              <a href="#" className="flex items-start gap-3">
                <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-800">01</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-black">The Future of AI: Predictions for 2030</p>
                  <p className="text-xs text-gray-500 mt-1">25K views</p>
                </div>
              </a>
            </li>
            <li className="group">
              <a href="#" className="flex items-start gap-3">
                <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-800">02</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-black">Understanding Web3 and Its Impact</p>
                  <p className="text-xs text-gray-500 mt-1">15K views</p>
                </div>
              </a>
            </li>
            <li className="group">
              <a href="#" className="flex items-start gap-3">
                <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-800">03</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-black">How to Build Scalable Web Apps</p>
                  <p className="text-xs text-gray-500 mt-1">18K views</p>
                </div>
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Topics */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Popular Topics</h3>
          <div className="flex flex-wrap gap-2">
            {["AI", "Tech", "Web Development", "Cybersecurity", "Writing", "Self Improvement"].map(
              (topic) => (
                <Link key={topic} href={`/topic/${topic.toLowerCase().replace(' ', '-')}`}>
                  <Button variant="outline" size="sm" className="rounded-full">
                    {topic}
                  </Button>
                </Link>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
          <p className="text-sm text-gray-600 mb-4">Get the latest articles and insights in your inbox.</p>
          <Input placeholder="Enter your email" className="mb-2" />
          <Button className="w-full">Subscribe</Button>
        </CardContent>
      </Card>
    </aside>
  );
}
