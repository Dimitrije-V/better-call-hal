import { useState, useRef, useCallback } from "react";
import { Card, Text, Button, Row, Loading } from "@nextui-org/react";
import styles from ".././index.module.css";

export default function PdfCard({ contractType }) {
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFileSelected, setPdfFileSelected] = useState(false);
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputFile = useRef(null);

    const onSubmitPdf = useCallback(async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("pdf", pdfFile);
            formData.append("contractType", contractType);
            const adviceListResponse = await fetch("/api/file", {
                method: "POST",
                body: formData,
            });

            const adviceListData = await adviceListResponse.json();
            if (adviceListResponse.status !== 200) {
                throw adviceListData.error || new Error(`Request failed with status ${adviceListResponse.status}`);
            }
            const response = await fetch("/api/final", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ adviceList: adviceListData.result, contractType }),
            });
            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.result);
            setPdfFile(null);

        } catch (error) {
            console.error(error);
            alert('Apologies, we have failed to process your contract. Please try submitting copy pasting it into the textbox instead.');
        } finally {
            setIsLoading(false);
        }
    }, [pdfFile, contractType]);

    const onButtonClick = () => {
        inputFile.current.click();
    };

    const renderResult = (result) => {
        return result.split('\n\n').map((item, index) => {
            const [quote, summary] = item.split('\n');
            return (
                <div key={index} className={styles.result}>
                    <em>{quote}</em>
                    <p>{summary}</p>
                    <Card.Divider />
                </div>
            );
        });
    };

    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]);
        if (e.target.files[0]) {
            setPdfFileSelected(true);
        } else {
            setPdfFileSelected(false);
        }
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
                            <Button
                                onClick={onButtonClick}
                                size="md"
                                color="success"
                                className={styles.submitButton}
                                bordered={pdfFileSelected}
                            >
                                {pdfFileSelected ? "✓" : "Upload .pdf file"}
                                <input className={styles.hiddenButton}
                                    type="file"
                                    accept=".pdf"
                                    ref={inputFile}
                                    onChange={handleFileChange} />
                            </Button>
                            {isLoading ? (
                                <Button disabled auto bordered>
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
                {result.length > 0 && (
                    <div className={styles.resultContainer}>
                        {renderResult(result)}
                    </div>
                )}
            </Card.Footer>
        </Card >
    );
}