import { Card, Text, Button, Row, Input } from "@nextui-org/react";
import { useState } from "react";
import styles from ".././index.module.css";
import { PulseLoader } from "react-spinners";

export default function TextboxCard() {
    const [contractInput, setContractInput] = useState("");
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
    };

    return (
        <Card css={{ mw: "900" }}>
            <Card.Header>
                <Text b>Enter Contract Via Textbox</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ py: "$10" }}>
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
                    </form>
                </div>
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