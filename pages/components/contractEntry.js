import { Grid, Image } from "@nextui-org/react";
import PdfCard from "../cards/pdf";
import TextboxCard from "../cards/textbox";
import styles from "../index.module.css";
import { useState } from "react";

export default function ContractEntryComponent() {
    const [selectedImage, setSelectedImage] = useState("employment");

    const imageOptions = [
        { id: "employment", src: "briefcase.png", label: "Analyse an employment contract" },
        { id: "tenancy", src: "home.png", label: "Analyse a tenancy agreement" },
    ];

    function handleImageClick(id) {
        setSelectedImage(id);
    }

    return (
        <Grid.Container justify="center" gap={2}>
            {imageOptions.map((option) => (
                <Grid key={option.id}>
                    <div style={{ width: "200px", height: "200px" }}>
                        <Image
                            src={option.src}
                            width="100%"
                            height="100%"
                            id={option.id}
                            className={`${styles.image} ${selectedImage === option.id ? styles.active : ""}`}
                            onClick={() => handleImageClick(option.id)}
                        />
                        <p>{option.label}</p>
                    </div>
                </Grid>
            ))}
            <Grid sm={24} md={10}>
                <PdfCard contractType={selectedImage} />
            </Grid>
            <Grid sm={24} md={10}>
                <p className={styles.or}>OR</p>
            </Grid>
            <Grid sm={24} md={10}>
                <TextboxCard contractType={selectedImage} />
            </Grid>
        </Grid.Container>
    );
}