
import { useState, useRef } from "react";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const db = getFirestore(app);

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Honeypot field
  const [submitCount, setSubmitCount] = useState(0);
  const lastSubmitTime = useRef<number>(0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length >= 3 && email.length <= 254;
  };

  const isRateLimited = (): boolean => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime.current;
    
    // Prevent more than 3 submissions per minute
    if (submitCount >= 3 && timeSinceLastSubmit < 60000) {
      return true;
    }
    
    // Prevent submissions faster than 2 seconds apart
    if (timeSinceLastSubmit < 2000) {
      return true;
    }
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security checks
    if (!email.trim()) return;
    
    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      setMessage("Error. Please try again.");
      return;
    }
    
    // Rate limiting
    if (isRateLimited()) {
      setMessage("Please wait before submitting again.");
      return;
    }
    
    // Email validation
    if (!validateEmail(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const now = Date.now();
      lastSubmitTime.current = now;
      setSubmitCount(prev => prev + 1);

      const response = await fetch('/api/secure-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: 'site',
          userAgent: navigator.userAgent
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }
      
      setMessage("Thanks. Check your inbox.");
      setEmail("");
      
      // Reset rate limiting after successful submission
      setTimeout(() => setSubmitCount(0), 60000);
    } catch (err) {
      console.error(err);
      setMessage("Error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Honeypot field - hidden from users but visible to bots */}
        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />
        
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          autoComplete="email"
          minLength={3}
          maxLength={254}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || !email.trim() || isRateLimited()}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${message.includes("Thanks") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
