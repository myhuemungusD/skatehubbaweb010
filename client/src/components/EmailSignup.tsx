
import { useState } from "react";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const db = getFirestore(app);

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      await addDoc(collection(db, "signups"), {
        email: email.trim().toLowerCase(),
        source: "site",
        createdAt: serverTimestamp()
      });
      setMessage("Thanks. Check your inbox.");
      setEmail("");
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
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || !email.trim()}>
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
