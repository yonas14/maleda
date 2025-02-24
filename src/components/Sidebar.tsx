import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-1/3 space-y-6">
      {/* Staff Picks */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Staff Picks</h3>
          <ul className="space-y-2">
            <li className="text-gray-700 hover:text-black">
              <a href="#">Yes, Girl Scout Cookies are okay to eat</a>
            </li>
            <li className="text-gray-700 hover:text-black">
              <a href="#">‘The Adopted’: I visited a WW2 soldier’s home</a>
            </li>
            <li className="text-gray-700 hover:text-black">
              <a href="#">Google DeepMind CEO on AGI</a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Recommended Topics */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Recommended Topics</h3>
          <div className="flex flex-wrap gap-2">
            {["Programming", "Self Improvement", "Politics", "Writing", "Data Science"].map(
              (topic) => (
                <Button key={topic} variant="outline" size="sm">
                  {topic}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
