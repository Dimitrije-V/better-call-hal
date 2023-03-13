import { useState, useRef } from "react";
import { Card, Text, Button, Row, Loading } from "@nextui-org/react";
import styles from ".././index.module.css";

export default function PdfCard(props) {
    const [pdfFile, setPdfFile] = useState(null);
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputFile = useRef(null);

    async function onSubmitPdf(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("pdf", pdfFile);
            formData.append("contractType", props.contractType);
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
            setIsLoading(false);
        }
    };

    const onButtonClick = () => {
        inputFile.current.click();
    };

    return (
        <Card css={{ mw: "900" }}>
            <Card.Header>
                <Text b>Enter Contract Via PDF Upload</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ py: "$10" }}>
                <Text>
                    Upload your .pdf file and click submit to send it to be processed.
                </Text>
                <Row justify="flex-start">
                    <div>
                        <form onSubmit={onSubmitPdf} style={{ display: 'flex' }}>
                            <Button onClick={onButtonClick} size="md" className={styles.submitButton}>
                                Upload .pdf file
                                <input className={styles.hiddenButton}
                                    type="file"
                                    accept=".pdf"
                                    ref={inputFile}
                                    onChange={(e) => setPdfFile(e.target.files[0])} />
                            </Button>
                            {isLoading ? (
                                <Button disabled auto bordered color="primary">
                                    <Loading type="points-opacity" color="currentColor" size="md" />
                                </Button>

                            ) : (
                                <Button type="submit" size="md" className={styles.submitButton}> Submit </Button>
                            )}
                        </form>
                    </div>
                </Row>
            </Card.Body>
            <Card.Footer>
                {
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
                }

            </Card.Footer>
        </Card >
    );
}