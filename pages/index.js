import { useEffect } from "react";
import ContractReviewComponent from "./components/contractReviewComponent";
import styles from "./index.module.css";
import { Image } from "@nextui-org/react";

export default function Home() {
    useEffect(() => {
        // create a new IntersectionObserver instance with a callback function
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                console.log(entry)
                if (entry.isIntersecting) {
                    // if the element is intersecting the viewport, add the "show" class
                    entry.target.classList.add(styles.show);
                } else {
                    // if the element is not intersecting the viewport, remove the "show" class
                    entry.target.classList.remove(styles.show);
                }
            });
        });

        const hiddenElements = document.querySelectorAll(`.${styles.hidden}`);
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
                            If in any doubt, speak to an actual solicitor.
                        </p>
                        <p>
                            In my personal experience, the tool <strong>can</strong> provide useful insights, but has a tendency to pick up on insignificant quotes from your contract.
                        </p>
                        <p>
                            The tool is not perfect, and is still in development. If you find any bugs, you can let me know at dimitrije@pm.me
                        </p>
                    </div>
                </section>
                <section>
                    <div className={styles.hidden}>
                        <ContractReviewComponent />
                    </div>
                </section>
            </main>
        </div>
    );
}