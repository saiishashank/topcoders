import { Button } from "../ui/button.jsx";
import { Code } from "lucide-react";
import {Link} from 'react-router-dom'
export function Header() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-balance">Topcoders</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">Community</a>
          <a href="#competitions" className="text-muted-foreground hover:text-foreground transition-colors">Competitions</a>
          <a href="#tracking" className="text-muted-foreground hover:text-foreground transition-colors">Progress</a>
          <a href="#leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</a>
        </nav>
        <div className="flex items-center space-x-3">
          <Button variant="ghost"><Link to="/login">Sign In</Link></Button>
          <Button><Link to="/signup">Join Now</Link></Button>
        </div>
      </div>
    </header>
  );
}