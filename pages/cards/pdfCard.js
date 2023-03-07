import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { Card, Text, Button, Row } from "@nextui-org/react";
import styles from ".././index.module.css";

export default function PdfCard() {
    const [pdfFile, setPdfFile] = useState(null);
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
    };

    return (
        <Card css={{ mw: "900" }}>
            <Card.Header>
                <Text b>Enter Contract Via Textbox</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ py: "$10" }}>
                <Text>
                    Click "Upload" to upload a PDF file. Hit submit to send the file to be processed.
                </Text>
                <Card.Divider />
                <Row justify="center">
                    <div>
                        <form onSubmit={onSubmitPdf}>
                            <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
                            <Button type="submit" size="sm"> Submit </Button>
                        </form>
                    </div>
                </Row>
                <Card.Divider />
            </Card.Body>
            <Card.Footer>
                {isLoading ? (
                    <div className={styles.loading}>
                        <PulseLoader size={10} color={"#0072F5"} />
                        <p>Processing...</p>
                    </div>
                ) : (
                    result.length > 0 && (
                        <div className={styles.resultContainer}>
                            {result.split('\n\n').map((item, index) => {
                                const [quote, summary] = item.split('\n');
                                return (
                                    <div key={index} className={styles.result}>
                                        <em>{quote}</em>
                                        <p>{summary}</p>
                                        <Card.Divider />
                                    </div>
                                )
                            })}
                        </div>
                    )
                )}
            </Card.Footer>
        </Card>
    );
}