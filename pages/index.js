import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { PulseLoader } from "react-spinners";

export default function Home() {
  const [contractInput, setContractInput] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmitText(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/text", {
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
    } finally {
      setIsLoading(false); // set loading back to false
    }
  }

  async function onSubmitPdf(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      const response = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      setPdfFile(null);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
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
        <form onSubmit={onSubmitText}>
          <input
            type="text"
            name="contract"
            placeholder="Enter your contract"
            value={contractInput}
            onChange={(e) => setContractInput(e.target.value)}
          />
          <input type="submit" value="Generate advice" />
        </form>
        <form onSubmit={onSubmitPdf}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
          <input type="submit" value="Generate advice from PDF" />
        </form>
        <div className={styles.result}>
          {isLoading ? (
            <div className={styles.loading}>
              <PulseLoader size={10} color={"#36D7B7"} />
              <p>Processing...</p>
            </div>
          ) : (
            result.length > 0 && (
              result.split('\n\n').map((item) => {
                const [quote, summary] = item.split('\n');
                return (
                  <ul>
                    <em>{quote}</em>
                    <li>{summary}</li>
                  </ul>
                )
              })
            )
          )}
        </div>
      </main>
    </div>
  );
}