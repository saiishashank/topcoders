import { Button } from "../ui/button.jsx";
import { Link } from "react-router-dom";
export function CallToActionSection() {
  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Level Up Your Coding?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Join thousands of competitive programmers who are already tracking their progress and connecting with peers
          worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            <Link to="/signup">Create Free Account</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
            Explore Features
          </Button>
        </div>
      </div>
    </section>
  );
}