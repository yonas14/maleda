import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Zenna</h1>
      <Input type="text" placeholder="Search" className="w-1/3" />
      <div className="hidden md:flex space-x-4">
        {["For You", "Following", "Technology", "Machine Learning"].map((category) => (
          <Button key={category} variant="ghost">
            {category}
          </Button>
        ))}
      </div>
    </header>
  );
}
