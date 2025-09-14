import { Button } from "../ui/button.jsx";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
export function HeroSection() {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-br from-background via-card/30 to-primary/5">
       <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Connect, Compete, <span className="text-primary">Conquer</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Join the ultimate competitive programming community. Track your progress across CodeChef, Codeforces, and
          more. Compete with programmers worldwide and level up your coding skills.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            <Link to="/signup">Start Your Journey</Link> <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
            <Link to="/login">View Leaderboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}