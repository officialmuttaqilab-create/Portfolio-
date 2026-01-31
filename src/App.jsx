import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroText, setHeroText] = useState("");

  useEffect(() => {
    async function loadHero() {
      const ref = doc(db, "content", "site");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setHeroTitle(snap.data().heroTitle);
        setHeroText(snap.data().heroText);
      }
    }

    loadHero();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>{heroTitle}</h1>
      <p>{heroText}</p>
    </div>
  );
}
