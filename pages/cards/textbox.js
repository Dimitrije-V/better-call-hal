import { Button, Card, Text, Input, Loading, Row } from "@nextui-org/react";
import { useState, useCallback } from "react";
import styles from ".././index.module.css";

export default function TextboxCard({ contractType }) {
    const [contractInput, setContractInput] = useState("");
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitText = useCallback(async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("/api/text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contract: contractInput, contractType }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.result);
            setContractInput("");
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsLoading(false); // set loading back to false
        }
    }, [contractInput, contractType]);

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

    return (
        <Card css={{ mw: "900" }}>
            <Card.Header>
                <Text b>Enter Contract Via Textbox</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ py: "$10" }}>
                <Text>
                    Copy-paste your contract into the textbox below, and click "Submit" to send it to be processed.
                </Text>
                <Card.Divider />
                <div className="formContainer">
                    <form onSubmit={onSubmitText}>
                        <Input
                            placeholder="Type something..."
                            variant="flush"
                            size="large"
                            width="100%"
                            borderRadius="0"
                            borderWidth="0"
                            boxShadow="none"
                            fontSize="1.25rem"
                            fontWeight="normal"
                            lineHeight="1.5"
                            padding="1.5rem"
                            autoComplete="off"
                            spellCheck={false}
                            className={styles.input}
                            value={contractInput}
                            onChange={(e) => setContractInput(e.target.value)}
                        />
                        {isLoading ? (
                            <Button disabled auto bordered color="primary">
                                <Loading type="points-opacity" color="currentColor" size="md" />
                            </Button>
                        ) : (
                            <Button type="submit" size="md" className={styles.submitButton} > Submit </Button>
                        )}
                    </form>
                </div>
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