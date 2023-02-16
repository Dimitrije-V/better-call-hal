import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { PulseLoader } from "react-spinners";

export default function Home() {
  const [contractInput, setContractInput] = useState("");
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract: contractInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setContractInput("");

    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    finally {
      setIsLoading(false); // set loading back to false
    }
  }

  return (
    <div>
      <Head>
        <title>Contract Checker</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.png" className={styles.icon} />
        <h3>Generate advice which isn't legal advice</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="contract"
            placeholder="Enter your contract"
            value={contractInput}
            onChange={(e) => setContractInput(e.target.value)}
          />
          <input type="submit" value="Generate advice" />
        </form>
        <div className={styles.result}>
          {isLoading ? (
            <div className={styles.loading}>
              <PulseLoader size={10} color={"#36D7B7"} />
              <p>Processing...</p>
            </div>
          ) : (
            result.length > 0 && (
              <ul>
                {result.map((adviceString, index) => (
                  <li key={index}>{adviceString}</li>
                ))}
              </ul>
            )
          )}
        </div>
      </main>
    </div>
  );
}
