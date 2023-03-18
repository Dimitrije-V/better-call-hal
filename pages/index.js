import { useEffect } from "react";
import ContractEntryComponent from "./components/contractEntry";
import styles from "./index.module.css";
import { Image } from "@nextui-org/react";

export default function Home() {
    useEffect(() => {
        // create a new IntersectionObserver instance with a callback function
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // if the element is intersecting the viewport, add the "show" class
                    entry.target.classList.toggle(styles.show, true);
                } else {
                    // if the element is not intersecting the viewport, remove the "show" class
                    entry.target.classList.toggle(styles.show, false);
                }
            });
        });

        const hiddenElements = [...document.querySelectorAll(`.${styles.hidden}`)];
        hiddenElements.forEach(element => {
            observer.observe(element);
        });
    });

    return (
        <div>
            <main className={styles.main}>
                <div className={styles.hidden}>
                    <br /><br /><br />
                    <h1>ChatGPT Powered Contract Review</h1>
                    <Image src="logo.png" width="25%" height="25%" />
                </div>
                <section>
                    <div className={styles.hidden}>

                        <p>
                            The outputs of this tool are <strong>NOT LEGAL ADVICE</strong>.
                        </p>
                        <p>
                            All this tool does is read through your tenancy or employment contract, and highlight points that you may want to re-read.
                            If in any doubt, speak to an actual solicitor.
                        </p>
                        <p>
                            In my personal experience, the tool <strong>can</strong> provide useful insights, but has a tendency to pick up on insignificant quotes from your contract.
                        </p>
                        <p>
                            |<br />
                            |<br />
                            ↓
                        </p>
                    </div>
                </section>
                <section>
                    <div className={styles.hidden}>
                        <p>
                            Longer contracts may take up to 5 minutes to process. The current maximum contract length is 100,000 characters.
                        </p>
                        <p>
                            The tool is not perfect, and is still in development. If you find any bugs, you can let me know at dimitrije@pm.me
                        </p>
                        <p>
                            Scroll down, and select which type of contract you want to analyse. Then either upload it, or copy and paste it into the text box.
                        </p>
                    </div>
                </section>
                <section>
                    <div className={styles.hidden}>
                        <ContractEntryComponent />
                    </div>
                </section>
            </main >
        </div >
    );
}