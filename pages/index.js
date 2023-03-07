import { useEffect } from "react";
import MyCard from "./card";
import styles from "./index.module.css";

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
                <h1>AI Powered Contract Review</h1>
                <section>
                    <div className={styles.hidden}>
                        <h3>Stuff</h3>
                        <p>Stuff</p>
                    </div>
                </section>

                <section>
                    <div className={styles.hidden}>
                        <MyCard></MyCard>
                    </div>
                </section>
            </main>
        </div>
    );
}