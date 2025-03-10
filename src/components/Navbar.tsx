import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-6 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold">maleda</h1>
          <div className="relative flex-1 max-w-[500px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-50 hover:bg-gray-100 transition-colors"
            />
          </div>
        </div>
        <Button variant="outline" className="rounded-full px-4 sm:px-6 hover:bg-gray-100 text-sm sm:text-base">
          Login
        </Button>
      </div>
    </header>
  );
}
