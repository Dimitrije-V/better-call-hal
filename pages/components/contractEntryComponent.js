import { Grid, Image } from "@nextui-org/react";
import PdfCard from "../cards/PdfCard";
import TextboxCard from "../cards/TextboxCard";
import styles from "../index.module.css"
import { useState } from "react";

export default function contractEntryComponent() {
    const [selectedImage, setSelectedImage] = useState("employment");

    function handleImageClick(event) {
        const imageContainer = event.target.parentNode;
        const allImageContainers = document.querySelectorAll(
            `.${styles.main} .${styles.image}`
        );

        allImageContainers.forEach((container) => {
            if (container !== imageContainer) {
                container.classList.remove(styles.active);
            }
        });

        imageContainer.classList.toggle(styles.active);

        if (imageContainer.childNodes[0].id === "employment") {
            setSelectedImage("employment");
        } else if (imageContainer.childNodes[0].id === "tenancy") {
            setSelectedImage("tenancy");
        }
    }

    return (
        <Grid.Container justify="center" gap={2}>
            <Grid>
                <div style={{ width: '200px', height: '200px' }}>
                    <Image
                        src="briefcase.png"
                        width="100%"
                        height="100%"
                        id="employment"
                        className={`${styles.image} ${styles.active}`}
                        onClick={handleImageClick} />
                    <p>Analyse an employment contract</p>
                </div>
            </Grid>
            <Grid>
                <div style={{ width: '200px', height: '200px' }}>
                    <Image
                        src="home.png"
                        width="100%"
                        height="100%"
                        id="tenancy"
                        className={styles.image}
                        onClick={handleImageClick} />
                    <p>Analyse a tenancy agreement</p>
                </div>
            </Grid>
            <Grid sm={24} md={10}>
                <PdfCard contractType={selectedImage} />
            </Grid>
            <Grid sm={24} md={10}>
                <p className={styles.or}>OR</p>
            </Grid>
            <Grid sm={24} md={10}>
                <TextboxCard contractType={selectedImage} />
            </Grid>
        </Grid.Container >


    );
}